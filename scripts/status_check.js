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
    const matchesSnap = await getDocs(collection(db, "matches"));
    const statusCounts = {};
    matchesSnap.forEach((doc) => {
      const match = doc.data();
      const status = match.status;
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    console.log("Match Status Counts in Firestore:", statusCounts);
  } catch (err) {
    console.error("Error:", err);
  }
}

check();
