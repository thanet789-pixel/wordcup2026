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
  console.log("Checking news items in Firestore...");
  try {
    const newsSnap = await getDocs(collection(db, "news"));
    console.log(`Total news items: ${newsSnap.size}`);
    
    const items = [];
    newsSnap.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort by date desc
    items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    console.log("Latest 5 news items:");
    items.slice(0, 5).forEach((item, idx) => {
      console.log(`${idx + 1}. Title: "${item.title}"`);
      console.log(`   Date: ${item.date}`);
      console.log(`   Excerpt: "${item.excerpt.substring(0, 100)}..."`);
    });
  } catch (err) {
    console.error("Error:", err);
  }
}

check();
