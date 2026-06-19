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
  console.log("Checking Firestore collections...");
  try {
    const matchesSnap = await getDocs(collection(db, "matches"));
    console.log(`- 'matches' collection size: ${matchesSnap.size}`);
    if (matchesSnap.size > 0) {
      console.log("First match document:");
      console.log(JSON.stringify(matchesSnap.docs[0].data(), null, 2));
    }

    const standingsSnap = await getDocs(collection(db, "standings"));
    console.log(`- 'standings' collection size: ${standingsSnap.size}`);

    const newsSnap = await getDocs(collection(db, "news"));
    console.log(`- 'news' collection size: ${newsSnap.size}`);
  } catch (err) {
    console.error("Error connecting or querying Firestore:", err);
  }
}

check();
