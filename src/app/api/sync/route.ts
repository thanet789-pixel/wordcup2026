import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, writeBatch, collection, getDocs } from "firebase/firestore";

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
      batch.update(matchRef, {
        homeScore,
        awayScore,
        status,
        date: apiMatch.utcDate,
      });
      updatedMatchesCount++;
    }
  }

  // 4. Map and update standings in Firestore
  const apiStandings = standingsData.standings || [];
  for (const groupStanding of apiStandings) {
    if (groupStanding.stage !== "GROUP_STAGE") continue;

    const apiGroup = groupStanding.group; // e.g. "GROUP_A"
    if (!apiGroup) continue;

    const parts = apiGroup.split("_");
    const letter = parts[1]; // e.g. "A"
    if (!letter) continue;

    const thaiGroupName = `กลุ่ม ${letter}`;

    const tableRows = groupStanding.table || [];
    const rows = tableRows.map((row: any) => {
      const teamCode = row.team.tla.toLowerCase();
      return {
        teamId: teamCode,
        played: row.playedGames,
        won: row.won,
        drawn: row.draw,
        lost: row.lost,
        gf: row.goalsFor,
        ga: row.goalsAgainst,
        points: row.points,
        status: "active",
      };
    });

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

