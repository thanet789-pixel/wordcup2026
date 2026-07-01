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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  try {
    const snap = await getDocs(collection(db, "matches"));
    const list = [];
    snap.forEach(doc => {
      list.push({ id: doc.id, ...doc.data() });
    });

    const knockouts = list.filter(m => m.stage && m.stage !== "GROUP_STAGE");
    knockouts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    console.log(`Total knockout matches in Firestore: ${knockouts.length}`);
    knockouts.forEach(m => {
      console.log(`[${m.id}] Stage: ${m.stage} | Date: ${m.date}`);
      console.log(`  Home: ${m.homeTeamId} (${m.homeScore}) vs Away: ${m.awayTeamId} (${m.awayScore})`);
      console.log(`  Status: ${m.status} | Winner: ${m.winnerTeamId}`);
    });
  } catch (err) {
    console.error("Error:", err);
  }
}

check();
