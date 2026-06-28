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
  console.log("Checking matches collection size in Firestore...");
  try {
    const matchesSnap = await getDocs(collection(db, "matches"));
    console.log(`Current matches count in Firestore: ${matchesSnap.size}`);
    
    // Check if Korea vs Mexico exists (homeTeamId = mex, awayTeamId = kor)
    const list = [];
    matchesSnap.forEach(doc => list.push(doc.data()));
    
    const korMex = list.find(m => 
      (m.homeTeamId === "mex" && m.awayTeamId === "kor") || 
      (m.homeTeamId === "kor" && m.awayTeamId === "mex")
    );
    
    if (korMex) {
      console.log("Found Korea vs Mexico match!");
      console.log(JSON.stringify(korMex, null, 2));
    } else {
      console.log("Korea vs Mexico match NOT found in Firestore yet.");
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

check();
