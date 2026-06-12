import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, writeBatch, collection, getDocs, getDoc, query, where, increment } from "firebase/firestore";
import { standings as mockStandings } from "@/data/mock";

let isSyncLoopStarted = false;

async function syncNews() {
  try {
    const rssRes = await fetch("https://www.thairath.co.th/rss/sport", {
      next: { revalidate: 0 }
    });
    if (!rssRes.ok) {
      throw new Error(`Failed to fetch RSS feed: ${rssRes.status}`);
    }
    const xml = await rssRes.text();
    const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);
    const newsList: any[] = [];
    
    let isFirst = true;
    for (const match of itemMatches) {
      const itemXml = match[1];
      
      let title = "";
      const titleCdataMatch = itemXml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/);
      if (titleCdataMatch) {
        title = titleCdataMatch[1];
      } else {
        const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/);
        if (titleMatch) title = titleMatch[1];
      }

      let link = "";
      const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/);
      if (linkMatch) link = linkMatch[1];

      let guid = "";
      const guidMatch = itemXml.match(/<guid[\s\S]*?>([\s\S]*?)<\/guid>/);
      if (guidMatch) guid = guidMatch[1];
      if (!guid) guid = link;

      let description = "";
      const descCdataMatch = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/);
      if (descCdataMatch) {
        description = descCdataMatch[1];
      } else {
        const descMatch = itemXml.match(/<description>([\s\S]*?)<\/description>/);
        if (descMatch) description = descMatch[1];
      }

      let imageUrl = "";
      const encMatch = itemXml.match(/<enclosure\s+url="([^"]+)"/);
      if (encMatch) imageUrl = encMatch[1];

      let pubDateStr = "";
      const dateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
      if (dateMatch) pubDateStr = dateMatch[1];

      const id = guid.split("/").pop() || Math.random().toString(36).substring(7);

      newsList.push({
        id,
        title: title.trim(),
        excerpt: description.trim(),
        image: imageUrl || "https://images.unsplash.com/photo-1574629810360-7ab2e98b8a88?w=800&h=450&fit=crop",
        category: "news",
        date: pubDateStr ? new Date(pubDateStr).toISOString() : new Date().toISOString(),
        featured: isFirst,
        link: link.trim()
      });
      
      isFirst = false;
      if (newsList.length >= 20) break;
    }

    if (newsList.length === 0) {
      console.log("No news items parsed from RSS.");
      return 0;
    }

    // Write to Firestore
    const batch = writeBatch(db);
    
    // First, clear all existing news in Firestore to keep it fresh
    const newsSnap = await getDocs(collection(db, "news"));
    for (const d of newsSnap.docs) {
      batch.delete(doc(db, "news", d.id));
    }
    
    // Write new items
    for (const n of newsList) {
      batch.set(doc(db, "news", n.id), n);
    }
    
    await batch.commit();
    console.log(`Successfully synced ${newsList.length} news items to Firestore.`);
    return newsList.length;
  } catch (err: any) {
    console.error("Error syncing news from RSS:", err.message);
    throw err;
  }
}

async function scorePredictions() {
  if (!db) return 0;
  
  try {
    const predictionsRef = collection(db, "predictions");
    const q = query(predictionsRef, where("status", "==", "pending"));
    const querySnap = await getDocs(q);
    
    if (querySnap.empty) {
      return 0;
    }
    
    const matchCache: Record<string, { status: string; homeScore: number | null; awayScore: number | null }> = {};
    let batch = writeBatch(db);
    let batchCount = 0;
    let scoredCount = 0;
    
    for (const predictionDoc of querySnap.docs) {
      const predData = predictionDoc.data();
      const matchId = predData.matchId;
      const uid = predData.uid;
      const userChoice = predData.prediction;
      
      if (!matchId || !uid || !userChoice) continue;
      
      let matchInfo = matchCache[matchId];
      if (!matchInfo) {
        const matchRef = doc(db, "matches", matchId);
        const matchSnap = await getDoc(matchRef);
        if (matchSnap.exists()) {
          const matchData = matchSnap.data();
          matchInfo = {
            status: (matchData.status || "").toLowerCase(),
            homeScore: matchData.homeScore !== undefined && matchData.homeScore !== null ? parseInt(matchData.homeScore, 10) : null,
            awayScore: matchData.awayScore !== undefined && matchData.awayScore !== null ? parseInt(matchData.awayScore, 10) : null,
          };
          matchCache[matchId] = matchInfo;
        }
      }
      
      if (matchInfo && matchInfo.status === "finished") {
        const { homeScore, awayScore } = matchInfo;
        if (homeScore !== null && awayScore !== null && !isNaN(homeScore) && !isNaN(awayScore)) {
          let actualResult: "home" | "draw" | "away";
          if (homeScore > awayScore) {
            actualResult = "home";
          } else if (homeScore < awayScore) {
            actualResult = "away";
          } else {
            actualResult = "draw";
          }
          
          const isCorrect = userChoice === actualResult;
          const pointsEarned = isCorrect ? 3 : 0;
          
          const predRef = doc(db, "predictions", predictionDoc.id);
          batch.update(predRef, {
            status: "scored",
            points: pointsEarned,
            actualResult,
            scoredAt: new Date().toISOString()
          });
          
          const userRef = doc(db, "users", uid);
          batch.update(userRef, {
            totalPoints: increment(pointsEarned)
          });
          
          batchCount += 2;
          scoredCount++;
          
          if (batchCount >= 400) {
            await batch.commit();
            batch = writeBatch(db);
            batchCount = 0;
          }
        }
      }
    }
    
    if (batchCount > 0) {
      await batch.commit();
    }
    
    return scoredCount;
  } catch (err: any) {
    console.error("Error scoring predictions:", err);
    return 0;
  }
}

interface SyncResult {
  matchesUpdated: number | null;
  newsUpdated: number;
  matchError?: string;
  newsError?: string;
}

async function performSync(): Promise<SyncResult> {
  let matchesUpdated: number | null = null;
  let newsUpdated = 0;
  let matchError: string | undefined;
  let newsError: string | undefined;

  // 1. Sync news from RSS (does not require API key)
  try {
    newsUpdated = await syncNews();
  } catch (err: any) {
    newsError = err.message || String(err);
  }

  // 2. Sync matches and standings from football-data.org (requires API key)
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiKey) {
    matchError = "กรุณาใส่ API Key 'FOOTBALL_DATA_API_KEY' ในไฟล์ .env.local ก่อนทำการเชื่อมต่อซิงก์ข้อมูลแมตช์";
  } else {
    try {
      // Fetch matches from football-data.org (WC = World Cup)
      const matchesRes = await fetch("https://api.football-data.org/v4/competitions/WC/matches", {
        headers: {
          "X-Auth-Token": apiKey,
        },
        next: { revalidate: 0 },
      });

      if (!matchesRes.ok) {
        const errText = await matchesRes.text();
        throw new Error(`Failed to fetch matches: ${matchesRes.status} ${errText}`);
      }

      const matchesData = await matchesRes.json();

      // Fetch standings from football-data.org
      const standingsRes = await fetch("https://api.football-data.org/v4/competitions/WC/standings", {
        headers: {
          "X-Auth-Token": apiKey,
        },
        next: { revalidate: 0 },
      });

      if (!standingsRes.ok) {
        const errText = await standingsRes.text();
        throw new Error(`Failed to fetch standings: ${standingsRes.status} ${errText}`);
      }

      const standingsData = await standingsRes.json();

      const batch = writeBatch(db);

      // Fetch current matches in Firestore to map them by team code combinations
      const matchesSnap = await getDocs(collection(db, "matches"));
      const firestoreMatches = matchesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      let updatedMatchesCount = 0;
      const apiMatches = matchesData.matches || [];
      const finalMatches: any[] = [];

      for (const apiMatch of apiMatches) {
        if (!apiMatch.homeTeam?.tla || !apiMatch.awayTeam?.tla) continue;

        const homeCode = apiMatch.homeTeam.tla.toLowerCase();
        const awayCode = apiMatch.awayTeam.tla.toLowerCase();

        // Find match in Firestore
        const matchDoc = firestoreMatches.find(
          (m: any) => m.homeTeamId === homeCode && m.awayTeamId === awayCode
        );

        if (matchDoc) {
          // Map status
          let status = "scheduled";
          if (apiMatch.status === "FINISHED") status = "finished";
          else if (apiMatch.status === "IN_PLAY" || apiMatch.status === "LIVE") status = "live";
          else if (apiMatch.status === "PAUSED") status = "halftime";

          // Map scores
          const homeScore =
            apiMatch.score?.fullTime?.home !== undefined && apiMatch.score?.fullTime?.home !== null
              ? apiMatch.score.fullTime.home
              : null;
          const awayScore =
            apiMatch.score?.fullTime?.away !== undefined && apiMatch.score?.fullTime?.away !== null
              ? apiMatch.score.fullTime.away
              : null;

          const matchRef = doc(db, "matches", matchDoc.id);
          
          const updatedMatch = {
            ...matchDoc,
            homeScore,
            awayScore,
            status,
            date: apiMatch.utcDate,
          };
          
          batch.update(matchRef, {
            homeScore,
            awayScore,
            status,
            date: apiMatch.utcDate,
          });
          
          finalMatches.push(updatedMatch);
          updatedMatchesCount++;
        }
      }

      // Add any matches from Firestore that were not present or updated by the API
      for (const fm of firestoreMatches) {
        if (!finalMatches.some(m => m.id === fm.id)) {
          finalMatches.push(fm);
        }
      }

      // Calculate standings dynamically based on final matches list
      const standingsMap: Record<string, any[]> = {};
      for (const [groupName, rows] of Object.entries(mockStandings)) {
        standingsMap[groupName] = rows.map(row => ({
          teamId: row.teamId,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          gf: 0,
          ga: 0,
          points: 0,
          status: row.status || "active"
        }));
      }

      for (const match of finalMatches) {
        const groupName = match.group;
        if (!groupName || !standingsMap[groupName]) continue;

        const status = match.status?.toLowerCase();
        if (status !== "finished") continue;

        const homeId = match.homeTeamId;
        const awayId = match.awayTeamId;

        const homeScore = parseInt(match.homeScore as any, 10);
        const awayScore = parseInt(match.awayScore as any, 10);

        if (isNaN(homeScore) || isNaN(awayScore)) continue;

        const homeRow = standingsMap[groupName].find(r => r.teamId === homeId);
        const awayRow = standingsMap[groupName].find(r => r.teamId === awayId);

        if (homeRow && awayRow) {
          homeRow.played += 1;
          awayRow.played += 1;
          homeRow.gf += homeScore;
          homeRow.ga += awayScore;
          awayRow.gf += awayScore;
          awayRow.ga += homeScore;

          if (homeScore > awayScore) {
            homeRow.won += 1;
            homeRow.points += 3;
            awayRow.lost += 1;
          } else if (homeScore < awayScore) {
            awayRow.won += 1;
            awayRow.points += 3;
            homeRow.lost += 1;
          } else {
            homeRow.drawn += 1;
            homeRow.points += 1;
            awayRow.drawn += 1;
            awayRow.points += 1;
          }
        }
      }

      // Sort standings rows within each group
      for (const groupName of Object.keys(standingsMap)) {
        standingsMap[groupName].sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          const gdA = a.gf - a.ga;
          const gdB = b.gf - b.ga;
          if (gdB !== gdA) return gdB - gdA;
          if (b.gf !== a.gf) return b.gf - a.gf;
          return a.teamId.localeCompare(b.teamId);
        });
      }

      // Write calculated standings to Firestore
      for (const [thaiGroupName, rows] of Object.entries(standingsMap)) {
        const standingRef = doc(db, "standings", thaiGroupName);
        batch.set(standingRef, { rows });
      }

      await batch.commit();
      matchesUpdated = updatedMatchesCount;

      // Score pending predictions for finished matches
      try {
        const scoredCount = await scorePredictions();
        if (scoredCount > 0) {
          console.log(`[Sync] Successfully scored ${scoredCount} predictions.`);
        }
      } catch (predErr: any) {
        console.error("Error scoring predictions during sync:", predErr);
      }
    } catch (err: any) {
      matchError = err.message || String(err);
    }
  }

  return {
    matchesUpdated,
    newsUpdated,
    matchError,
    newsError
  };
}

function startBackgroundSync() {
  if (isSyncLoopStarted) return;
  isSyncLoopStarted = true;

  console.log("Background auto-sync loop started on Server (runs every 5 minutes).");
  
  setInterval(async () => {
    try {
      console.log(`[${new Date().toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })}] Auto-sync: Running background sync...`);
      const result = await performSync();
      console.log(`Auto-sync complete. Updated news: ${result.newsUpdated}, matches: ${result.matchesUpdated} (Error: ${result.matchError || "none"}).`);
    } catch (err: any) {
      console.error("Auto-sync error in background loop:", err.message);
    }
  }, 5 * 60 * 1000);
}

export async function GET() {
  startBackgroundSync();

  try {
    const result = await performSync();
    
    if (result.matchError && result.newsError) {
      return NextResponse.json(
        { success: false, error: `ซิงก์ข้อมูลล้มเหลว: (ข่าว: ${result.newsError}), (ข้อมูลแมตช์: ${result.matchError})` },
        { status: 500 }
      );
    }

    let message = `ซิงก์ข่าวสำเร็จแล้ว! อัปเดตข่าว ${result.newsUpdated} หัวข้อ`;
    if (result.matchesUpdated !== null) {
      message += ` และซิงก์ตารางแข่งสำเร็จ! อัปเดตข้อมูล ${result.matchesUpdated} แมตช์`;
    } else if (result.matchError) {
      message += ` (หมายเหตุ: ข้อมูลแมตช์ไม่ได้ซิงก์ - ${result.matchError})`;
    }

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error: any) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { success: false, error: `เกิดข้อผิดพลาดในการดึงข้อมูล: ${error.message}` },
      { status: 500 }
    );
  }
}

