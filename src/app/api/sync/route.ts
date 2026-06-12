import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, writeBatch, collection, getDocs } from "firebase/firestore";
import { standings as mockStandings } from "@/data/mock";

let isSyncLoopStarted = false;

async function performSync() {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiKey) {
    throw new Error("กรุณาใส่ API Key 'FOOTBALL_DATA_API_KEY' ในไฟล์ .env.local ก่อนทำการเชื่อมต่อซิงก์ข้อมูล");
  }

  // 1. Fetch matches from football-data.org (WC = World Cup)
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

  // 2. Fetch standings from football-data.org
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

  // 3. Map and update matches in Firestore
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

  // 4. Calculate standings dynamically based on final matches list
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
  return updatedMatchesCount;
}

function startBackgroundSync() {
  if (isSyncLoopStarted) return;
  isSyncLoopStarted = true;

  console.log("Background auto-sync loop started on Server (runs every 5 minutes).");
  
  // Set interval for every 5 minutes (300000 ms)
  setInterval(async () => {
    try {
      console.log(`[${new Date().toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })}] Auto-sync: Running background sync...`);
      const count = await performSync();
      console.log(`Auto-sync complete. Updated ${count} matches.`);
    } catch (err: any) {
      console.error("Auto-sync error in background loop:", err.message);
    }
  }, 5 * 60 * 1000);
}

export async function GET() {
  // Start the background sync loop on the first server hit
  startBackgroundSync();

  try {
    const updatedCount = await performSync();
    return NextResponse.json({
      success: true,
      message: `ซิงก์ข้อมูลสำเร็จแล้ว! อัปเดตข้อมูล ${updatedCount} แมตช์ และตารางคะแนนกลุ่ม`,
    });
  } catch (error: any) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { success: false, error: `เกิดข้อผิดพลาดในการดึงข้อมูล: ${error.message}` },
      { status: 500 }
    );
  }
}

