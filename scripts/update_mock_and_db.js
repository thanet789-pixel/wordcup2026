const fs = require("fs");
const path = require("path");
const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc, writeBatch } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyAUCGk7SsSU-Gb9_Sj9wjXdlu_GdpQzQ48",
  authDomain: "wordcup2026-7ae55.firebaseapp.com",
  projectId: "wordcup2026-7ae55",
  storageBucket: "wordcup2026-7ae55.firebasestorage.app",
  messagingSenderId: "785402346943",
  appId: "1:785402346943:web:611a4657a95fdc6582f50a",
  measurementId: "G-3C3FV4PVS4"
};

// 1. Shift dates in src/data/mock.ts
const mockFilePath = path.join(__dirname, "../src/data/mock.ts");
console.log("Reading mock.ts...");
let mockContent = fs.readFileSync(mockFilePath, "utf8");

const dateReplacements = [
  { from: "2026-06-11T19:00:00Z", to: "2026-06-15T19:00:00Z" },
  { from: "2026-06-12T02:00:00Z", to: "2026-06-16T02:00:00Z" },
  { from: "2026-06-12T19:00:00Z", to: "2026-06-16T19:00:00Z" },
  { from: "2026-06-13T19:00:00Z", to: "2026-06-17T19:00:00Z" },
  { from: "2026-06-13T22:00:00Z", to: "2026-06-17T22:00:00Z" },
  { from: "2026-06-14T01:00:00Z", to: "2026-06-18T01:00:00Z" },
  { from: "2026-06-13T01:00:00Z", to: "2026-06-16T01:00:00Z" },
  { from: "2026-06-14T04:00:00Z", to: "2026-06-17T04:00:00Z" },
  { from: "2026-06-14T17:00:00Z", to: "2026-06-17T17:00:00Z" },
  { from: "2026-06-14T23:00:00Z", to: "2026-06-17T23:00:00Z" },
  { from: "2026-06-14T20:00:00Z", to: "2026-06-17T20:00:00Z" },
  { from: "2026-06-15T02:00:00Z", to: "2026-06-18T02:00:00Z" },
  { from: "2026-06-15T19:00:00Z", to: "2026-06-19T02:00:00Z" },
  { from: "2026-06-16T01:00:00Z", to: "2026-06-19T10:00:00Z" },
  { from: "2026-06-15T16:00:00Z", to: "2026-06-19T19:00:00Z" },
  { from: "2026-06-15T22:00:00Z", to: "2026-06-19T22:00:00Z" },
  { from: "2026-06-16T19:00:00Z", to: "2026-06-20T19:00:00Z" },
  { from: "2026-06-16T22:00:00Z", to: "2026-06-20T22:00:00Z" },
  { from: "2026-06-17T01:00:00Z", to: "2026-06-21T01:00:00Z" },
  { from: "2026-06-17T04:00:00Z", to: "2026-06-21T04:00:00Z" },
  { from: "2026-06-17T17:00:00Z", to: "2026-06-21T17:00:00Z" },
  { from: "2026-06-18T02:00:00Z", to: "2026-06-22T02:00:00Z" },
  { from: "2026-06-17T20:00:00Z", to: "2026-06-21T20:00:00Z" },
  { from: "2026-06-18T23:00:00Z", to: "2026-06-22T23:00:00Z" }
];

let replacedCount = 0;
for (const rep of dateReplacements) {
  if (mockContent.includes(rep.from)) {
    mockContent = mockContent.replace(new RegExp(rep.from, "g"), rep.to);
    replacedCount++;
  }
}

if (replacedCount > 0) {
  fs.writeFileSync(mockFilePath, mockContent, "utf8");
  console.log(`Successfully updated ${replacedCount} dates in mock.ts!`);
} else {
  console.log("No dates replaced (they might already be updated).");
}

// 2. Initialize Firebase and seed Firestore matches with new dates and statuses
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const newMatches = [
  // Finished matches (Group A-F)
  { id: "m1", homeTeamId: "mex", awayTeamId: "rsa", homeScore: 2, awayScore: 0, date: "2026-06-15T19:00:00Z", stadium: "เอสตาดิโอ อัซเตกา", city: "เม็กซิโก ซิตี้", group: "กลุ่ม A", status: "finished", events: [] },
  { id: "m2", homeTeamId: "kor", awayTeamId: "cze", homeScore: 1, awayScore: 1, date: "2026-06-16T02:00:00Z", stadium: "กัวดาลาฮารา สเตเดียม", city: "กัวดาลาฮารา", group: "กลุ่ม A", status: "finished", events: [] },
  { id: "m3", homeTeamId: "can", awayTeamId: "bih", homeScore: 2, awayScore: 1, date: "2026-06-16T19:00:00Z", stadium: "โตรอนโต สเตเดียม", city: "โตรอนโต", group: "กลุ่ม B", status: "finished", events: [] },
  { id: "m4", homeTeamId: "qat", awayTeamId: "sui", homeScore: 0, awayScore: 2, date: "2026-06-17T19:00:00Z", stadium: "ซานฟรานซิสโก เบย์แอเรีย สเตเดียม", city: "ซานฟรานซิสโก", group: "กลุ่ม B", status: "finished", events: [] },
  { id: "m5", homeTeamId: "bra", awayTeamId: "mar", homeScore: 3, awayScore: 1, date: "2026-06-17T22:00:00Z", stadium: "เม็ตไลฟ์ สเตเดียม", city: "นิวยอร์ก นิวเจอร์ซีย์", group: "กลุ่ม C", status: "finished", events: [] },
  { id: "m6", homeTeamId: "hai", awayTeamId: "sco", homeScore: 0, awayScore: 1, date: "2026-06-18T01:00:00Z", stadium: "ยิเลตต์ สเตเดียม", city: "บอสตัน", group: "กลุ่ม C", status: "finished", events: [] },
  { id: "m7", homeTeamId: "usa", awayTeamId: "par", homeScore: 2, awayScore: 0, date: "2026-06-16T01:00:00Z", stadium: "โซไฟ สเตเดียม", city: "ลอสแอนเจลิส", group: "กลุ่ม D", status: "finished", events: [] },
  { id: "m8", homeTeamId: "aus", awayTeamId: "tur", homeScore: 1, awayScore: 2, date: "2026-06-17T04:00:00Z", stadium: "บีซี เพลส", city: "แวนคูเวอร์", group: "กลุ่ม D", status: "finished", events: [] },
  { id: "m9", homeTeamId: "ger", awayTeamId: "cuw", homeScore: 4, awayScore: 0, date: "2026-06-17T17:00:00Z", stadium: "เอ็นอาร์จี สเตเดียม", city: "ฮิวสตัน", group: "กลุ่ม E", status: "finished", events: [] },
  { id: "m10", homeTeamId: "civ", awayTeamId: "ecu", homeScore: 1, awayScore: 1, date: "2026-06-17T23:00:00Z", stadium: "ลินคอล์น ไฟแนนเชียล ฟิลด์", city: "ฟิลาเดลเฟีย", group: "กลุ่ม E", status: "finished", events: [] },
  { id: "m11", homeTeamId: "ned", awayTeamId: "jpn", homeScore: 2, awayScore: 2, date: "2026-06-17T20:00:00Z", stadium: "เอทีแอนด์ที สเตเดียม", city: "ดัลลัส", group: "กลุ่ม F", status: "finished", events: [] },
  { id: "m12", homeTeamId: "swe", awayTeamId: "tun", homeScore: 1, awayScore: 0, date: "2026-06-18T02:00:00Z", stadium: "มอนเตร์เรย์ สเตเดียม", city: "มอนเตร์เรย์", group: "กลุ่ม F", status: "finished", events: [] },
  
  // Today's matches (June 19)
  { id: "m13", homeTeamId: "bel", awayTeamId: "egy", homeScore: 2, awayScore: 1, date: "2026-06-19T02:00:00Z", stadium: "ลูเมน ฟิลด์", city: "ซีแอตเทิล", group: "กลุ่ม G", status: "finished", events: [] },
  { id: "m14", homeTeamId: "irn", awayTeamId: "nzl", homeScore: 1, awayScore: 1, date: "2026-06-19T10:00:00Z", stadium: "โซไฟ สเตเดียม", city: "ลอสแอนเจลิส", group: "กลุ่ม G", status: "live", minute: 65, events: [] },
  { id: "m15", homeTeamId: "esp", awayTeamId: "cpv", homeScore: null, awayScore: null, date: "2026-06-19T19:00:00Z", stadium: "เมอร์เซเดส-เบนซ์ สเตเดียม", city: "แอตแลนตา", group: "กลุ่ม H", status: "scheduled", events: [] },
  { id: "m16", homeTeamId: "ksa", awayTeamId: "ury", homeScore: null, awayScore: null, date: "2026-06-19T22:00:00Z", stadium: "ฮาร์ดร็อก สเตเดียม", city: "ไมอามี", group: "กลุ่ม H", status: "scheduled", events: [] },
  
  // Future matches
  { id: "m17", homeTeamId: "fra", awayTeamId: "sen", homeScore: null, awayScore: null, date: "2026-06-20T19:00:00Z", stadium: "เม็ตไลฟ์ สเตเดียม", city: "นิวยอร์ก นิวเจอร์ซีย์", group: "กลุ่ม I", status: "scheduled", events: [] },
  { id: "m18", homeTeamId: "irq", awayTeamId: "nor", homeScore: null, awayScore: null, date: "2026-06-20T22:00:00Z", stadium: "ยิเลตต์ สเตเดียม", city: "บอสตัน", group: "กลุ่ม I", status: "scheduled", events: [] },
  { id: "m19", homeTeamId: "arg", awayTeamId: "alg", homeScore: null, awayScore: null, date: "2026-06-21T01:00:00Z", stadium: "แอร์โรว์เฮด สเตเดียม", city: "แคนซัสซิตี้", group: "กลุ่ม J", status: "scheduled", events: [] },
  { id: "m20", homeTeamId: "aut", awayTeamId: "jor", homeScore: null, awayScore: null, date: "2026-06-21T04:00:00Z", stadium: "ซานฟรานซิสโก เบย์แอเรีย สเตเดียม", city: "ซานฟรานซิสโก", group: "กลุ่ม J", status: "scheduled", events: [] },
  { id: "m21", homeTeamId: "por", awayTeamId: "cod", homeScore: null, awayScore: null, date: "2026-06-21T17:00:00Z", stadium: "เอ็นอาร์จี สเตเดียม", city: "ฮิวสตัน", group: "กลุ่ม K", status: "scheduled", events: [] },
  { id: "m22", homeTeamId: "uzb", awayTeamId: "col", homeScore: null, awayScore: null, date: "2026-06-22T02:00:00Z", stadium: "เอสตาดิโอ อัซเตกา", city: "เม็กซิโก ซิตี้", group: "กลุ่ม K", status: "scheduled", events: [] },
  { id: "m23", homeTeamId: "eng", awayTeamId: "cro", homeScore: null, awayScore: null, date: "2026-06-21T20:00:00Z", stadium: "เอทีแอนด์ที สเตเดียม", city: "ดัลลัส", group: "กลุ่ม L", status: "scheduled", events: [] },
  { id: "m24", homeTeamId: "gha", awayTeamId: "pan", homeScore: null, awayScore: null, date: "2026-06-22T23:00:00Z", stadium: "โตรอนโต สเตเดียม", city: "โตรอนโต", group: "กลุ่ม L", status: "scheduled", events: [] }
];

async function seed() {
  console.log("Seeding shifted matches into Firestore...");
  const batch = writeBatch(db);
  for (const m of newMatches) {
    const ref = doc(db, "matches", m.id);
    batch.set(ref, m);
  }
  
  // Calculate standings dynamically
  console.log("Calculating standings...");
  const mockGroups = ["กลุ่ม A", "กลุ่ม B", "กลุ่ม C", "กลุ่ม D", "กลุ่ม E", "กลุ่ม F", "กลุ่ม G", "กลุ่ม H", "กลุ่ม I", "กลุ่ม J", "กลุ่ม K", "กลุ่ม L"];
  const teamMappings = {
    "กลุ่ม A": ["mex", "rsa", "kor", "cze"],
    "กลุ่ม B": ["can", "bih", "qat", "sui"],
    "กลุ่ม C": ["bra", "mar", "hai", "sco"],
    "กลุ่ม D": ["usa", "par", "aus", "tur"],
    "กลุ่ม E": ["ger", "cuw", "civ", "ecu"],
    "กลุ่ม F": ["ned", "jpn", "swe", "tun"],
    "กลุ่ม G": ["bel", "egy", "irn", "nzl"],
    "กลุ่ม H": ["esp", "cpv", "ksa", "ury"],
    "กลุ่ม I": ["fra", "sen", "irq", "nor"],
    "กลุ่ม J": ["arg", "alg", "aut", "jor"],
    "กลุ่ม K": ["por", "cod", "uzb", "col"],
    "กลุ่ม L": ["eng", "cro", "gha", "pan"]
  };

  const standingsMap = {};
  for (const group of mockGroups) {
    standingsMap[group] = teamMappings[group].map(tId => ({
      teamId: tId,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      points: 0,
      status: "active"
    }));
  }

  // Calculate based on finished matches
  for (const match of newMatches) {
    if (match.status !== "finished") continue;
    const groupName = match.group;
    const homeRow = standingsMap[groupName].find(r => r.teamId === match.homeTeamId);
    const awayRow = standingsMap[groupName].find(r => r.teamId === match.awayTeamId);
    
    if (homeRow && awayRow) {
      homeRow.played++;
      awayRow.played++;
      homeRow.gf += match.homeScore;
      homeRow.ga += match.awayScore;
      awayRow.gf += match.awayScore;
      awayRow.ga += match.homeScore;
      
      if (match.homeScore > match.awayScore) {
        homeRow.won++;
        homeRow.points += 3;
        awayRow.lost++;
      } else if (match.homeScore < match.awayScore) {
        awayRow.won++;
        awayRow.points += 3;
        homeRow.lost++;
      } else {
        homeRow.drawn++;
        awayRow.drawn++;
        homeRow.points += 1;
        awayRow.points += 1;
      }
    }
  }

  // Sort standings
  for (const groupName of Object.keys(standingsMap)) {
    standingsMap[groupName].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const gdA = a.gf - a.ga;
      const gdB = b.gf - b.ga;
      if (gdB !== gdA) return gdB - gdA;
      return b.gf - a.gf;
    });
    
    // Write to Firestore
    const standingRef = doc(db, "standings", groupName);
    batch.set(standingRef, { rows: standingsMap[groupName] });
  }

  await batch.commit();
  console.log("Firestore reseed and dynamic standings calculation completed successfully!");
  process.exit(0);
}

seed().catch(err => {
  console.error("Seeding error:", err);
  process.exit(1);
});
