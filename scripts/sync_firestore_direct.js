const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, doc, writeBatch } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyAUCGk7SsSU-Gb9_Sj9wjXdlu_GdpQzQ48",
  authDomain: "wordcup2026-7ae55.firebaseapp.com",
  projectId: "wordcup2026-7ae55",
  storageBucket: "wordcup2026-7ae55.firebasestorage.app",
  messagingSenderId: "785402346943",
  appId: "1:785402346943:web:611a4657a95fdc6582f50a",
  measurementId: "G-3C3FV4PVS4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const apiKey = "af3d26d38c454e74963576f2fe5b68c5";

async function sync() {
  console.log("Fetching matches from football-data.org...");
  try {
    const res = await fetch("https://api.football-data.org/v4/competitions/WC/matches", {
      headers: {
        "X-Auth-Token": apiKey
      }
    });
    const data = await res.json();
    const apiMatches = data.matches || [];
    console.log(`Total API matches: ${apiMatches.length}`);

    console.log("Fetching existing matches from Firestore...");
    const snap = await getDocs(collection(db, "matches"));
    const firestoreMatches = [];
    snap.forEach(doc => {
      firestoreMatches.push({ id: doc.id, ...doc.data() });
    });
    console.log(`Existing matches in Firestore: ${firestoreMatches.length}`);

    const batch = writeBatch(db);
    let updatedCount = 0;
    let createdCount = 0;

    for (const apiMatch of apiMatches) {
      const docId = `api_${apiMatch.id}`;

      // Find match in Firestore
      let matchDoc = firestoreMatches.find(m => m.id === docId);
      if (!matchDoc && apiMatch.homeTeam?.tla && apiMatch.awayTeam?.tla) {
        const homeCode = apiMatch.homeTeam.tla.toLowerCase();
        const awayCode = apiMatch.awayTeam.tla.toLowerCase();
        matchDoc = firestoreMatches.find(
          m => m.homeTeamId === homeCode && m.awayTeamId === awayCode
        );
      }

      const homeTeamId = apiMatch.homeTeam?.tla ? apiMatch.homeTeam.tla.toLowerCase() : "tbd";
      const awayTeamId = apiMatch.awayTeam?.tla ? apiMatch.awayTeam.tla.toLowerCase() : "tbd";
      const stage = apiMatch.stage || "GROUP_STAGE";

      // Determine winnerTeamId
      let winnerTeamId = null;
      if (apiMatch.score?.winner === "HOME_TEAM" && apiMatch.homeTeam?.tla) {
        winnerTeamId = apiMatch.homeTeam.tla.toLowerCase();
      } else if (apiMatch.score?.winner === "AWAY_TEAM" && apiMatch.awayTeam?.tla) {
        winnerTeamId = apiMatch.awayTeam.tla.toLowerCase();
      }

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

      if (matchDoc) {
        const matchRef = doc(db, "matches", matchDoc.id);
        batch.update(matchRef, {
          homeTeamId,
          awayTeamId,
          homeScore,
          awayScore,
          status,
          date: apiMatch.utcDate,
          stage,
          winnerTeamId,
        });
        updatedCount++;
      } else {
        const matchRef = doc(db, "matches", docId);
        let groupMapped = "รอบน็อกเอาต์";
        if (apiMatch.group) {
          const groupKey = apiMatch.group.replace("_", " ");
          const groupNum = groupKey.split(" ")[1];
          if (groupNum) {
            groupMapped = `กลุ่ม ${groupNum}`;
          }
        }

        const newMatch = {
          id: docId,
          homeTeamId,
          awayTeamId,
          homeScore,
          awayScore,
          status,
          date: apiMatch.utcDate,
          group: groupMapped,
          stadium: "สนามกีฬาหลัก (World Cup)",
          city: "สหรัฐฯ/เม็กซิโก/แคนาดา",
          events: [],
          stage,
          winnerTeamId,
        };
        batch.set(matchRef, newMatch);
        createdCount++;
      }
    }

    console.log("Committing batch to Firestore...");
    await batch.commit();
    console.log(`Success! Updated: ${updatedCount}, Created: ${createdCount} matches.`);

  } catch (err) {
    console.error("Error running sync script:", err);
  }
}

sync();
