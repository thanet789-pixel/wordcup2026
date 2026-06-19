const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyAUCGk7SsSU-Gb9_Sj9wjXdlu_GdpQzQ48",
  authDomain: "wordcup2026-7ae55.firebaseapp.com",
  projectId: "wordcup2026-7ae55",
  storageBucket: "wordcup2026-7ae55.firebasestorage.app",
  messagingSenderId: "785402346943",
  appId: "1:785402346943:web:611a4657a95fdc6582f50a",
  measurementId: "G-3C3FV4PVS4"
};

const teams = [
  // Group A
  { id: "mex" }, { id: "rsa" }, { id: "kor" }, { id: "cze" },
  // Group B
  { id: "can" }, { id: "bih" }, { id: "qat" }, { id: "sui" },
  // Group C
  { id: "bra" }, { id: "mar" }, { id: "hai" }, { id: "sco" },
  // Group D
  { id: "usa" }, { id: "par" }, { id: "aus" }, { id: "tur" },
  // Group E
  { id: "ger" }, { id: "cuw" }, { id: "civ" }, { id: "ecu" },
  // Group F
  { id: "ned" }, { id: "jpn" }, { id: "swe" }, { id: "tun" },
  // Group G
  { id: "bel" }, { id: "egy" }, { id: "irn" }, { id: "nzl" },
  // Group H
  { id: "esp" }, { id: "cpv" }, { id: "ksa" }, { id: "uru" },
  // Group I
  { id: "fra" }, { id: "sen" }, { id: "irq" }, { id: "nor" },
  // Group J
  { id: "arg" }, { id: "alg" }, { id: "aut" }, { id: "jor" },
  // Group K
  { id: "por" }, { id: "cod" }, { id: "uzb" }, { id: "col" },
  // Group L
  { id: "eng" }, { id: "cro" }, { id: "gha" }, { id: "pan" }
];

const teamIds = new Set(teams.map(t => t.id));

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  console.log("Checking all matches in Firestore...");
  try {
    const matchesSnap = await getDocs(collection(db, "matches"));
    console.log(`Total matches in Firestore: ${matchesSnap.size}`);
    
    let invalidMatches = 0;
    matchesSnap.forEach((doc) => {
      const match = doc.data();
      const homeValid = teamIds.has(match.homeTeamId);
      const awayValid = teamIds.has(match.awayTeamId);
      
      if (!homeValid || !awayValid) {
        console.error(`Invalid match ID ${doc.id}: homeTeamId="${match.homeTeamId}" (valid: ${homeValid}), awayTeamId="${match.awayTeamId}" (valid: ${awayValid})`);
        invalidMatches++;
      }
    });
    
    if (invalidMatches === 0) {
      console.log("All matches have valid home and away team IDs!");
    } else {
      console.log(`Found ${invalidMatches} invalid matches.`);
    }
  } catch (err) {
    console.error("Error connecting or querying Firestore:", err);
  }
}

check();
