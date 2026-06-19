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
  console.log("Checking matches fields and dates...");
  try {
    const matchesSnap = await getDocs(collection(db, "matches"));
    let count = 0;
    matchesSnap.forEach((doc) => {
      const match = doc.data();
      const dateVal = new Date(match.date);
      const isDateValid = !isNaN(dateVal.getTime());
      console.log(`Match ${doc.id}: date="${match.date}" (valid: ${isDateValid}), status="${match.status}", group="${match.group}"`);
      if (!isDateValid) count++;
    });
    console.log(`Matches with invalid dates: ${count}`);
  } catch (err) {
    console.error("Error running check:", err);
  }
}

check();
