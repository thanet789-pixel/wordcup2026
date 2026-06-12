import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { teams, players, matches, standings, news } from "../src/data/mock";

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

async function seed() {
  console.log("Starting seeding...");

  // Seed Teams
  console.log("Seeding teams...");
  for (const team of teams) {
    await setDoc(doc(db, "teams", team.id), team);
  }

  // Seed Players
  console.log("Seeding players...");
  for (const player of players) {
    await setDoc(doc(db, "players", player.id), player);
  }

  // Seed Matches
  console.log("Seeding matches...");
  for (const m of matches) {
    await setDoc(doc(db, "matches", m.id), m);
  }

  // Seed Standings
  console.log("Seeding standings...");
  for (const [groupName, rows] of Object.entries(standings)) {
    await setDoc(doc(db, "standings", groupName), { rows });
  }

  // Seed News
  console.log("Seeding news...");
  for (const n of news) {
    await setDoc(doc(db, "news", n.id), n);
  }

  console.log("Seeding completed successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Error seeding database:", err);
  process.exit(1);
});
