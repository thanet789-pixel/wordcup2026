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

const teams = {
  mex: "เม็กซิโก", rsa: "แอฟริกาใต้", kor: "เกาหลีใต้", cze: "เช็กเกีย",
  can: "แคนาดา", bih: "บอสเนีย", qat: "กาตาร์", sui: "สวิตเซอร์แลนด์",
  bra: "บราซิล", mar: "โมร็อกโก", hai: "ไฮติ", sco: "สกอตแลนด์",
  usa: "สหรัฐอเมริกา", par: "ปารากวัย", aus: "ออสเตรเลีย", tur: "ตุรกี",
  ger: "เยอรมนี", cuw: "กูราเซา", civ: "ไอวอรีโคสต์", ecu: "เอกวาดอร์",
  ned: "เนเธอร์แลนด์", jpn: "ญี่ปุ่น", swe: "สวีเดน", tun: "ตูนิเซีย",
  bel: "เบลเยียม", egy: "อียิปต์", irn: "อิหร่าน", nzl: "นิวซีแลนด์",
  esp: "สเปน", cpv: "เคปเวิร์ด", ksa: "ซาอุดีอาระเบีย", uru: "อุรุกวัย",
  fra: "ฝรั่งเศส", sen: "เซเนกัล", irq: "อิรัก", nor: "นอร์เวย์",
  arg: "อาร์เจนตินา", alg: "แอลจีเรีย", aut: "ออสเตรีย", jor: "จอร์แดน",
  por: "โปรตุเกส", cod: "ดีอาร์คองโก", uzb: "อุซเบกิสถาน", col: "โคลอมเบีย",
  eng: "อังกฤษ", cro: "โครเอเชีย", gha: "กานา", pan: "ปานามา"
};

async function printMatches() {
  try {
    const snap = await getDocs(collection(db, "matches"));
    const list = [];
    snap.forEach(doc => {
      list.push({ id: doc.id, ...doc.data() });
    });
    
    list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    console.log(`Matches in Firestore (${list.length}):`);
    list.forEach(m => {
      const homeName = teams[m.homeTeamId] || m.homeTeamId;
      const awayName = teams[m.awayTeamId] || m.awayTeamId;
      console.log(`[${m.id}] ${m.date} - ${m.group} - ${homeName} (${m.homeScore}) vs ${awayName} (${m.awayScore}) - Status: ${m.status}`);
    });
  } catch (err) {
    console.error("Error:", err);
  }
}

printMatches();
