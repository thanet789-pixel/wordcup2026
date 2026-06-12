export type MatchStatus = "scheduled" | "live" | "finished" | "halftime";

export interface Team {
  id: string;
  name: string;
  code: string;
  flag: string;
  ranking: number;
  continent: string;
  colors: { primary: string; secondary: string };
  overview: string;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  position: string;
  number: number;
  age: number;
  height: string;
  weight: string;
  foot: string;
  image: string;
  goals: number;
  assists: number;
  matches: number;
  motm: number;
  shots: number;
  passes: number;
  passAccuracy: number;
}

export interface MatchEvent {
  id: string;
  minute: number;
  type: "goal" | "yellow" | "red" | "substitution";
  teamId: string;
  player: string;
  detail?: string;
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  date: string;
  stadium: string;
  city: string;
  group: string;
  status: MatchStatus;
  minute?: number;
  events?: MatchEvent[];
  stats?: MatchStats;
}

export interface MatchStats {
  possession: [number, number];
  shots: [number, number];
  shotsOnTarget: [number, number];
  corners: [number, number];
  fouls: [number, number];
  yellowCards: [number, number];
}

export interface StandingRow {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  points: number;
  status: "qualified" | "playoff" | "eliminated" | "active";
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: "news" | "video" | "highlight" | "transfer";
  date: string;
  featured?: boolean;
}

export interface CommentaryLine {
  minute: number;
  text: string;
  type: "normal" | "goal" | "card" | "important";
}

export const teams: Team[] = [
  // Group A
  { id: "mex", name: "เม็กซิโก", code: "MEX", flag: "https://flagcdn.com/w320/mx.png", ranking: 15, continent: "อเมริกาเหนือ", colors: { primary: "#006847", secondary: "#CE1126" }, overview: "เจ้าภาพร่วมเม็กซิโกพร้อมประเดิมสนามในบ้านเกิดด้วยประวัติศาสตร์อันยิ่งใหญ่ ณ สนามเอสตาดิโอ อัซเตกา" },
  { id: "rsa", name: "แอฟริกาใต้", code: "RSA", flag: "https://flagcdn.com/w320/za.png", ranking: 59, continent: "แอฟริกา", colors: { primary: "#007A4D", secondary: "#FFB81C" }, overview: "ทัพบาร์ฟานา บาร์ฟานา กลับมาสู่เวทีระดับโลกอีกครั้งโดยหวังจะสร้างปาฏิหาริย์ในกลุ่ม A" },
  { id: "kor", name: "เกาหลีใต้", code: "KOR", flag: "https://flagcdn.com/w320/kr.png", ranking: 22, continent: "เอเชีย", colors: { primary: "#CD2E3A", secondary: "#0047A0" }, overview: "เกาหลีใต้ยอดทีมจากเอเชียที่มีวินัยและสปีดการเล่นที่รวดเร็วเป็นจุดเด่น" },
  { id: "cze", name: "เช็กเกีย", code: "CZE", flag: "https://flagcdn.com/w320/cz.png", ranking: 36, continent: "ยุโรป", colors: { primary: "#11457E", secondary: "#D91A30" }, overview: "ทีมแกร่งจากยุโรปที่มีความแข็งแกร่งทางร่างกายและวินัยการเล่นเป็นเลิศ" },

  // Group B
  { id: "can", name: "แคนาดา", code: "CAN", flag: "https://flagcdn.com/w320/ca.png", ranking: 40, continent: "อเมริกาเหนือ", colors: { primary: "#FF0000", secondary: "#FFFFFF" }, overview: "เจ้าภาพร่วมแคนาดา นำทัพโดยคนรุ่นใหม่ที่รวดเร็วและพร้อมสร้างความประหลาดใจ" },
  { id: "bih", name: "บอสเนียและเฮอร์เซโกวีนา", code: "BIH", flag: "https://flagcdn.com/w320/ba.png", ranking: 74, continent: "ยุโรป", colors: { primary: "#002F6C", secondary: "#FFDD00" }, overview: "มังกรแห่งยุโรปพร้อมสู้ทุกทีมด้วยหัวใจนักสู้และการเล่นที่ดุดัน" },
  { id: "qat", name: "กาตาร์", code: "QAT", flag: "https://flagcdn.com/w320/qa.png", ranking: 46, continent: "เอเชีย", colors: { primary: "#8A1538", secondary: "#FFFFFF" }, overview: "อดีตแชมป์เอเชียที่หวังพิสูจน์ตัวเองบนเวทีโลกอีกครั้งหลังจากปี 2022" },
  { id: "sui", name: "สวิตเซอร์แลนด์", code: "SUI", flag: "https://flagcdn.com/w320/ch.png", ranking: 15, continent: "ยุโรป", colors: { primary: "#D52B1E", secondary: "#FFFFFF" }, overview: "ทัพสวิสทีมที่มีความสม่ำเสมอสูงและพร้อมรับมือคู่แข่งทุกระดับ" },

  // Group C
  { id: "bra", name: "บราซิล", code: "BRA", flag: "https://flagcdn.com/w320/br.png", ranking: 5, continent: "อเมริกาใต้", colors: { primary: "#009C3B", secondary: "#FFDF00" }, overview: "แชมป์โลก 5 สมัย นำทัพโดยซูเปอร์สตาร์ชั้นนำพร้อมเป้าหมายคว้าแชมป์สมัยที่ 6" },
  { id: "mar", name: "โมร็อกโก", code: "MAR", flag: "https://flagcdn.com/w320/ma.png", ranking: 12, continent: "แอฟริกา", colors: { primary: "#C1272D", secondary: "#006233" }, overview: "ผู้สร้างประวัติศาสตร์เข้ารอบ 4 ทีมสุดท้ายปี 2022 กลับมาลุยด้วยความมั่นใจ" },
  { id: "hai", name: "ไฮติ", code: "HAI", flag: "https://flagcdn.com/w320/ht.png", ranking: 82, continent: "อเมริกาเหนือ", colors: { primary: "#002060", secondary: "#C00000" }, overview: "ทีมม้ามืดจากแถบแคริบเบียนที่พร้อมสร้างปาฏิหาริย์ให้คนทั้งโลกได้เห็น" },
  { id: "sco", name: "สกอตแลนด์", code: "SCO", flag: "https://flagcdn.com/w320/gb-sct.png", ranking: 39, continent: "ยุโรป", colors: { primary: "#002D62", secondary: "#FFFFFF" }, overview: "ทัพขี้เมาที่มีพลังเชียร์ล้นหลามและหัวใจที่ไม่มีวันยอมแพ้" },

  // Group D
  { id: "usa", name: "สหรัฐอเมริกา", code: "USA", flag: "https://flagcdn.com/w320/us.png", ranking: 16, continent: "อเมริกาเหนือ", colors: { primary: "#3C3B6E", secondary: "#B22234" }, overview: "เจ้าภาพร่วมสหรัฐอเมริกาที่เต็มไปด้วยขุมกำลังดาวรุ่งในลีกยุโรป" },
  { id: "par", name: "ปารากวัย", code: "PAR", flag: "https://flagcdn.com/w320/py.png", ranking: 56, continent: "อเมริกาใต้", colors: { primary: "#D52B1E", secondary: "#0038A8" }, overview: "ปารากวัยเน้นการตั้งรับที่เหนียวแน่นและลูกกลางอากาศที่อันตราย" },
  { id: "aus", name: "ออสเตรเลีย", code: "AUS", flag: "https://flagcdn.com/w320/au.png", ranking: 24, continent: "เอเชีย", colors: { primary: "#00008B", secondary: "#FFD700" }, overview: "ทัพซอกเกอรูส์ที่มาพร้อมพละกำลังกายและความเป็นนักสู้ที่แข็งแกร่ง" },
  { id: "tur", name: "ตุรกี", code: "TUR", flag: "https://flagcdn.com/w320/tr.png", ranking: 26, continent: "ยุโรป", colors: { primary: "#E30A17", secondary: "#FFFFFF" }, overview: "ตุรกีพร้อมทำศึกด้วยสไตล์การเล่นที่ดุดันและเทคนิคเฉพาะตัวอันยอดเยี่ยม" },

  // Group E
  { id: "ger", name: "เยอรมนี", code: "GER", flag: "https://flagcdn.com/w320/de.png", ranking: 11, continent: "ยุโรป", colors: { primary: "#000000", secondary: "#DD0000" }, overview: "อินทรีเหล็กโฉมใหม่ที่มีสมดุลแดนกลางและวินัยอันแข็งแกร่ง" },
  { id: "cuw", name: "กูราเซา", code: "CUW", flag: "https://flagcdn.com/w320/cw.png", ranking: 88, continent: "อเมริกาเหนือ", colors: { primary: "#002B7F", secondary: "#F9E814" }, overview: "ทีมที่พัฒนาอย่างรวดเร็วจากโซนคอนคาเคฟพร้อมพิสูจน์ตัวเอง" },
  { id: "civ", name: "ไอวอรีโคสต์", code: "CIV", flag: "https://flagcdn.com/w320/ci.png", ranking: 38, continent: "แอฟริกา", colors: { primary: "#F77F00", secondary: "#009E60" }, overview: "ช้างดำแห่งแอฟริกาที่เต็มไปด้วยนักเตะที่แข็งแกร่งและเล่นเกมรุกได้อย่างดุดัน" },
  { id: "ecu", name: "เอกวาดอร์", code: "ECU", flag: "https://flagcdn.com/w320/ec.png", ranking: 31, continent: "อเมริกาใต้", colors: { primary: "#FFDD00", secondary: "#002F6C" }, overview: "เอกวาดอร์นำเสนอความเร็วและเกมโต้กลับที่เฉียบขาดในทัวร์นาเมนต์นี้" },

  // Group F
  { id: "ned", name: "เนเธอร์แลนด์", code: "NED", flag: "https://flagcdn.com/w320/nl.png", ranking: 8, continent: "ยุโรป", colors: { primary: "#FF6600", secondary: "#21468B" }, overview: "อัศวินสีส้มที่พร้อมเดินหน้าเพรสซิ่งสูงและบุกโจมตีจากทุกทิศทาง" },
  { id: "jpn", name: "ญี่ปุ่น", code: "JPN", flag: "https://flagcdn.com/w320/jp.png", ranking: 19, continent: "เอเชีย", colors: { primary: "#BC002D", secondary: "#FFFFFF" }, overview: "ซามูไรบลูผู้เปี่ยมไปด้วยแท็กติก ทีมเวิร์ค และวินัยการเล่นระดับสูง" },
  { id: "swe", name: "สวีเดน", code: "SWE", flag: "https://flagcdn.com/w320/se.png", ranking: 28, continent: "ยุโรป", colors: { primary: "#006AA7", secondary: "#FECC00" }, overview: "ไวกิ้งสีน้ำเงินเหลืองกลับมาพร้อมระบบทีมเวิร์คและลูกกลางอากาศที่ทรงพลัง" },
  { id: "tun", name: "ตูนิเซีย", code: "TUN", flag: "https://flagcdn.com/w320/tn.png", ranking: 41, continent: "แอฟริกา", colors: { primary: "#E20E17", secondary: "#FFFFFF" }, overview: "ตูนิเซียเน้นการจัดตำแหน่งที่เหนียวแน่นและหัวใจนักสู้สไตล์แอฟริกาเหนือ" },

  // Group G
  { id: "bel", name: "เบลเยียม", code: "BEL", flag: "https://flagcdn.com/w320/be.png", ranking: 3, continent: "ยุโรป", colors: { primary: "#E30613", secondary: "#FFE600" }, overview: "เบลเยียมยังคงอันตรายด้วยการผสมผสานของดาวรุ่งยอดเยี่ยมและตัวเก๋ามากประสบการณ์" },
  { id: "egy", name: "อียิปต์", code: "EGY", flag: "https://flagcdn.com/w320/eg.png", ranking: 33, continent: "แอฟริกา", colors: { primary: "#C00000", secondary: "#000000" }, overview: "ทัพฟาโรห์ที่พึ่งพาเกมรุกที่รวดเร็วและการจบสกอร์ที่เฉียบคม" },
  { id: "irn", name: "อิหร่าน", code: "IRN", flag: "https://flagcdn.com/w320/ir.png", ranking: 20, continent: "เอเชีย", colors: { primary: "#228B22", secondary: "#DA291C" }, overview: "อิหร่านทีมยักษ์ใหญ่เอเชียที่มีเกมรับมีระเบียบและโต้กลับเฉียบคม" },
  { id: "nzl", name: "นิวซีแลนด์", code: "NZL", flag: "https://flagcdn.com/w320/nz.png", ranking: 104, continent: "โอเชียเนีย", colors: { primary: "#000000", secondary: "#FFFFFF" }, overview: "ทีมกีวีตัวแทนจากโอเชียเนียที่มุ่งมั่นแสดงผลงานที่ดีที่สุดบนเวทีระดับโลก" },

  // Group H
  { id: "esp", name: "สเปน", code: "ESP", flag: "https://flagcdn.com/w320/es.png", ranking: 6, continent: "ยุโรป", colors: { primary: "#AA151B", secondary: "#F1BF00" }, overview: "กระทิงดุยังคงรักษามาตรฐานการครองบอลสไตล์ ติกิ-ตากา และการบดขยี้คู่แข่ง" },
  { id: "cpv", name: "เคปเวิร์ด", code: "CPV", flag: "https://flagcdn.com/w320/cv.png", ranking: 65, continent: "แอฟริกา", colors: { primary: "#002A66", secondary: "#C8102E" }, overview: "ฉลามสีน้ำเงินจากแอฟริกาพร้อมสร้างเซอร์ไพรส์ด้วยสไตล์ที่คาดเดายาก" },
  { id: "ksa", name: "ซาอุดีอาระเบีย", code: "KSA", flag: "https://flagcdn.com/w320/sa.png", ranking: 53, continent: "เอเชีย", colors: { primary: "#006C35", secondary: "#FFFFFF" }, overview: "สิงห์ทะเลทรายหวังจะสร้างผลงานระดับประวัติศาสตร์เฉกเช่นการชนะอาร์เจนตินาในปี 2022" },
  { id: "uru", name: "อุรุกวัย", code: "URU", flag: "https://flagcdn.com/w320/uy.png", ranking: 14, continent: "อเมริกาใต้", colors: { primary: "#0081C6", secondary: "#FFFFFF" }, overview: "จอมโหดที่เปี่ยมไปด้วยจิตวิญญาณนักสู้ ดุดัน และการเพรสซิ่งที่ไร้ความปรานี" },

  // Group I
  { id: "fra", name: "ฝรั่งเศส", code: "FRA", flag: "https://flagcdn.com/w320/fr.png", ranking: 2, continent: "ยุโรป", colors: { primary: "#002395", secondary: "#ED2939" }, overview: "ตราไก่อดีตแชมป์โลก 2 สมัยที่มีขุมกำลังเชิงลึกและนักเตะระดับโลกครบทุกตำแหน่ง" },
  { id: "sen", name: "เซเนกัล", code: "SEN", flag: "https://flagcdn.com/w320/sn.png", ranking: 18, continent: "แอฟริกา", colors: { primary: "#00853F", secondary: "#FDEF42" }, overview: "สิงโตแห่งเตรังกา นำทัพแอฟริกาด้วยความแข็งแกร่ง ความเร็ว และความมุ่งมั่นสูง" },
  { id: "irq", name: "อิรัก", code: "IRQ", flag: "https://flagcdn.com/w320/iq.png", ranking: 58, continent: "เอเชีย", colors: { primary: "#007A3D", secondary: "#DA291C" }, overview: "อิรักมุ่งหวังพิสูจน์ตัวเองในระดับโลกด้วยวินัยและการประสานงานที่เหนียวแน่น" },
  { id: "nor", name: "นอร์เวย์", code: "NOR", flag: "https://flagcdn.com/w320/no.png", ranking: 44, continent: "ยุโรป", colors: { primary: "#BA0C2F", secondary: "#00205B" }, overview: "ไวกิ้งยุคใหม่นำโดยดาวยิงระดับโลกพร้อมระเบิดฟอร์มในทัวร์นาเมนต์นี้" },

  // Group J
  { id: "arg", name: "อาร์เจนตินา", code: "ARG", flag: "https://flagcdn.com/w320/ar.png", ranking: 1, continent: "อเมริกาใต้", colors: { primary: "#74ACDF", secondary: "#FFFFFF" }, overview: "แชมป์เก่าอาร์เจนตินานำทัพโดย ลิโอเนล เมสซี มุ่งมั่นป้องกันบัลลังก์แชมป์โลกให้สำเร็จ" },
  { id: "alg", name: "แอลจีเรีย", code: "ALG", flag: "https://flagcdn.com/w320/dz.png", ranking: 37, continent: "แอฟริกา", colors: { primary: "#006633", secondary: "#D21034" }, overview: "นักรบทะเลทรายพร้อมสู้ด้วยการเล่นที่รวดเร็วและเทคนิคเฉพาะตัวที่แพรวพราว" },
  { id: "aut", name: "ออสเตรีย", code: "AUT", flag: "https://flagcdn.com/w320/at.png", ranking: 23, continent: "ยุโรป", colors: { primary: "#ED2939", secondary: "#FFFFFF" }, overview: "ออสเตรียพร้อมทำศึกด้วยการเล่นตามระบบแท็กติกที่รัดกุมและความแข็งแกร่งของทีม" },
  { id: "jor", name: "จอร์แดน", code: "JOR", flag: "https://flagcdn.com/w320/jo.png", ranking: 71, continent: "เอเชีย", colors: { primary: "#C60C30", secondary: "#000000" }, overview: "ตัวแทนจากตะวันออกกลางที่สร้างความตื่นตาตื่นใจในเอเชียและพร้อมลุยบอลโลก" },

  // Group K
  { id: "por", name: "โปรตุเกส", code: "POR", flag: "https://flagcdn.com/w320/pt.png", ranking: 7, continent: "ยุโรป", colors: { primary: "#006600", secondary: "#FF0000" }, overview: "ทัพฝอยทองที่มีการผสมผสานนักเตะรุ่นเก๋าและคลื่นลูกใหม่ที่มีทักษะส่วนตัวสูงอย่างลงตัว" },
  { id: "cod", name: "สาธารณรัฐประชาธิปไตยคองโก", code: "COD", flag: "https://flagcdn.com/w320/cd.png", ranking: 61, continent: "แอฟริกา", colors: { primary: "#007FFF", secondary: "#F7D117" }, overview: "เสือดาวแห่งคองโกมาพร้อมกับความแข็งแกร่งของพละกำลังและสไตล์การเล่นที่ทรงพลัง" },
  { id: "uzb", name: "อุซเบกิสถาน", code: "UZB", flag: "https://flagcdn.com/w320/uz.png", ranking: 66, continent: "เอเชีย", colors: { primary: "#00C5FF", secondary: "#FFFFFF" }, overview: "หมาป่าขาวแห่งเอเชียกลางพร้อมสร้างประวัติศาสตร์บนแผ่นดินอเมริกาเหนือ" },
  { id: "col", name: "โคลอมเบีย", code: "COL", flag: "https://flagcdn.com/w320/co.png", ranking: 13, continent: "อเมริกาใต้", colors: { primary: "#FCD116", secondary: "#003893" }, overview: "โคลอมเบียผู้มีสไตล์การเล่นเกมรุกที่สวยงาม คล่องตัว และแฟนบอลที่หลงใหลในฟุตบอลอย่างยิ่ง" },

  // Group L
  { id: "eng", name: "อังกฤษ", code: "ENG", flag: "https://flagcdn.com/w320/gb-eng.png", ranking: 4, continent: "ยุโรป", colors: { primary: "#FFFFFF", secondary: "#CE1124" }, overview: "สิงโตคำรามนำทัพโดยสตาร์พรีเมียร์ลีกพร้อมเป้าหมายนำถ้วยฟุตบอลโลกกลับบ้าน" },
  { id: "cro", name: "โครเอเชีย", code: "CRO", flag: "https://flagcdn.com/w320/hr.png", ranking: 10, continent: "ยุโรป", colors: { primary: "#C8102E", secondary: "#002F6C" }, overview: "ตาหมากรุกที่มีแดนกลางระดับโลกและวินัยชั้นเลิศในการทำผลงานในรอบลึกๆ" },
  { id: "gha", name: "กานา", code: "GHA", flag: "https://flagcdn.com/w320/gh.png", ranking: 64, continent: "แอฟริกา", colors: { primary: "#DA291C", secondary: "#006B3F" }, overview: "ดาวดำกานากลับมาพร้อมความแข็งแกร่งของร่างกายและนักเตะรุ่นใหม่ที่น่าจับตา" },
  { id: "pan", name: "ปานามา", code: "PAN", flag: "https://flagcdn.com/w320/pa.png", ranking: 43, continent: "อเมริกาเหนือ", colors: { primary: "#DA121A", secondary: "#072357" }, overview: "ปานามาพร้อมสู้ในกลุ่ม L ด้วยหัวใจนักสู้และการเล่นเกมสวนกลับที่มีประสิทธิภาพ" }
];

export const players: Player[] = [
  {
    id: "messi",
    name: "ลิโอเนล เมสซี",
    teamId: "arg",
    position: "กองหน้า",
    number: 10,
    age: 38,
    height: "170 ซม.",
    weight: "72 กก.",
    foot: "ซ้าย",
    image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=400&h=500&fit=crop",
    goals: 0,
    assists: 0,
    matches: 0,
    motm: 0,
    shots: 0,
    passes: 0,
    passAccuracy: 0,
  },
  {
    id: "neymar",
    name: "เนย์มาร์ จูเนียร์",
    teamId: "bra",
    position: "กองหน้า",
    number: 10,
    age: 34,
    height: "175 ซม.",
    weight: "68 กก.",
    foot: "ขวา",
    image: "https://images.unsplash.com/photo-1574629810360-7ab2e98b8a88?w=400&h=500&fit=crop",
    goals: 0,
    assists: 0,
    matches: 0,
    motm: 0,
    shots: 0,
    passes: 0,
    passAccuracy: 0,
  },
  {
    id: "vinicius",
    name: "วินิซิอุส จูเนียร์",
    teamId: "bra",
    position: "กองหน้า",
    number: 7,
    age: 25,
    height: "176 ซม.",
    weight: "73 กก.",
    foot: "ขวา",
    image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&h=500&fit=crop",
    goals: 0,
    assists: 0,
    matches: 0,
    motm: 0,
    shots: 0,
    passes: 0,
    passAccuracy: 0,
  },
  {
    id: "mbappe",
    name: "คีเลียน เอ็มบัปเป้",
    teamId: "fra",
    position: "กองหน้า",
    number: 10,
    age: 27,
    height: "178 ซม.",
    weight: "73 กก.",
    foot: "ขวา",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=500&fit=crop",
    goals: 0,
    assists: 0,
    matches: 0,
    motm: 0,
    shots: 0,
    passes: 0,
    passAccuracy: 0,
  },
  {
    id: "pulisic",
    name: "คริสเตียน พูลิซิช",
    teamId: "usa",
    position: "กองกลาง",
    number: 10,
    age: 27,
    height: "178 ซม.",
    weight: "71 กก.",
    foot: "ขวา",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&h=500&fit=crop",
    goals: 0,
    assists: 0,
    matches: 0,
    motm: 0,
    shots: 0,
    passes: 0,
    passAccuracy: 0,
  },
  {
    id: "son",
    name: "ซน ฮึง-มิน",
    teamId: "kor",
    position: "กองหน้า",
    number: 7,
    age: 33,
    height: "183 ซม.",
    weight: "77 กก.",
    foot: "สองเท้า",
    image: "https://images.unsplash.com/photo-1522778119026-d647f0566c20?w=400&h=500&fit=crop",
    goals: 0,
    assists: 0,
    matches: 0,
    motm: 0,
    shots: 0,
    passes: 0,
    passAccuracy: 0,
  }
];

export const matches: Match[] = [
  // กลุ่ม A
  {
    id: "m1",
    homeTeamId: "mex",
    awayTeamId: "rsa",
    homeScore: null,
    awayScore: null,
    date: "2026-06-11T19:00:00Z",
    stadium: "เอสตาดิโอ อัซเตกา",
    city: "เม็กซิโก ซิตี้",
    group: "กลุ่ม A",
    status: "scheduled",
    events: [],
  },
  {
    id: "m2",
    homeTeamId: "kor",
    awayTeamId: "cze",
    homeScore: null,
    awayScore: null,
    date: "2026-06-12T02:00:00Z",
    stadium: "กัวดาลาฮารา สเตเดียม",
    city: "กัวดาลาฮารา",
    group: "กลุ่ม A",
    status: "scheduled",
  },
  // กลุ่ม B
  {
    id: "m3",
    homeTeamId: "can",
    awayTeamId: "bih",
    homeScore: null,
    awayScore: null,
    date: "2026-06-12T19:00:00Z",
    stadium: "โตรอนโต สเตเดียม",
    city: "โตรอนโต",
    group: "กลุ่ม B",
    status: "scheduled",
  },
  {
    id: "m4",
    homeTeamId: "qat",
    awayTeamId: "sui",
    homeScore: null,
    awayScore: null,
    date: "2026-06-13T19:00:00Z",
    stadium: "ซานฟรานซิสโก เบย์แอเรีย สเตเดียม",
    city: "ซานฟรานซิสโก",
    group: "กลุ่ม B",
    status: "scheduled",
  },
  // กลุ่ม C
  {
    id: "m5",
    homeTeamId: "bra",
    awayTeamId: "mar",
    homeScore: null,
    awayScore: null,
    date: "2026-06-13T22:00:00Z",
    stadium: "เม็ตไลฟ์ สเตเดียม",
    city: "นิวยอร์ก นิวเจอร์ซีย์",
    group: "กลุ่ม C",
    status: "scheduled",
  },
  {
    id: "m6",
    homeTeamId: "hai",
    awayTeamId: "sco",
    homeScore: null,
    awayScore: null,
    date: "2026-06-14T01:00:00Z",
    stadium: "ยิเลตต์ สเตเดียม",
    city: "บอสตัน",
    group: "กลุ่ม C",
    status: "scheduled",
  },
  // กลุ่ม D
  {
    id: "m7",
    homeTeamId: "usa",
    awayTeamId: "par",
    homeScore: null,
    awayScore: null,
    date: "2026-06-13T01:00:00Z",
    stadium: "โซไฟ สเตเดียม",
    city: "ลอสแอนเจลิส",
    group: "กลุ่ม D",
    status: "scheduled",
  },
  {
    id: "m8",
    homeTeamId: "aus",
    awayTeamId: "tur",
    homeScore: null,
    awayScore: null,
    date: "2026-06-14T04:00:00Z",
    stadium: "บีซี เพลส",
    city: "แวนคูเวอร์",
    group: "กลุ่ม D",
    status: "scheduled",
  },
  // กลุ่ม E
  {
    id: "m9",
    homeTeamId: "ger",
    awayTeamId: "cuw",
    homeScore: null,
    awayScore: null,
    date: "2026-06-14T17:00:00Z",
    stadium: "เอ็นอาร์จี สเตเดียม",
    city: "ฮิวสตัน",
    group: "กลุ่ม E",
    status: "scheduled",
  },
  {
    id: "m10",
    homeTeamId: "civ",
    awayTeamId: "ecu",
    homeScore: null,
    awayScore: null,
    date: "2026-06-14T23:00:00Z",
    stadium: "ลินคอล์น ไฟแนนเชียล ฟิลด์",
    city: "ฟิลาเดลเฟีย",
    group: "กลุ่ม E",
    status: "scheduled",
  },
  // กลุ่ม F
  {
    id: "m11",
    homeTeamId: "ned",
    awayTeamId: "jpn",
    homeScore: null,
    awayScore: null,
    date: "2026-06-14T20:00:00Z",
    stadium: "เอทีแอนด์ที สเตเดียม",
    city: "ดัลลัส",
    group: "กลุ่ม F",
    status: "scheduled",
  },
  {
    id: "m12",
    homeTeamId: "swe",
    awayTeamId: "tun",
    homeScore: null,
    awayScore: null,
    date: "2026-06-15T02:00:00Z",
    stadium: "มอนเตร์เรย์ สเตเดียม",
    city: "มอนเตร์เรย์",
    group: "กลุ่ม F",
    status: "scheduled",
  },
  // กลุ่ม G
  {
    id: "m13",
    homeTeamId: "bel",
    awayTeamId: "egy",
    homeScore: null,
    awayScore: null,
    date: "2026-06-15T19:00:00Z",
    stadium: "ลูเมน ฟิลด์",
    city: "ซีแอตเทิล",
    group: "กลุ่ม G",
    status: "scheduled",
  },
  {
    id: "m14",
    homeTeamId: "irn",
    awayTeamId: "nzl",
    homeScore: null,
    awayScore: null,
    date: "2026-06-16T01:00:00Z",
    stadium: "โซไฟ สเตเดียม",
    city: "ลอสแอนเจลิส",
    group: "กลุ่ม G",
    status: "scheduled",
  },
  // กลุ่ม H
  {
    id: "m15",
    homeTeamId: "esp",
    awayTeamId: "cpv",
    homeScore: null,
    awayScore: null,
    date: "2026-06-15T16:00:00Z",
    stadium: "เมอร์เซเดส-เบนซ์ สเตเดียม",
    city: "แอตแลนตา",
    group: "กลุ่ม H",
    status: "scheduled",
  },
  {
    id: "m16",
    homeTeamId: "ksa",
    awayTeamId: "uru",
    homeScore: null,
    awayScore: null,
    date: "2026-06-15T22:00:00Z",
    stadium: "ฮาร์ดร็อก สเตเดียม",
    city: "ไมอามี",
    group: "กลุ่ม H",
    status: "scheduled",
  },
  // กลุ่ม I
  {
    id: "m17",
    homeTeamId: "fra",
    awayTeamId: "sen",
    homeScore: null,
    awayScore: null,
    date: "2026-06-16T19:00:00Z",
    stadium: "เม็ตไลฟ์ สเตเดียม",
    city: "นิวยอร์ก นิวเจอร์ซีย์",
    group: "กลุ่ม I",
    status: "scheduled",
  },
  {
    id: "m18",
    homeTeamId: "irq",
    awayTeamId: "nor",
    homeScore: null,
    awayScore: null,
    date: "2026-06-16T22:00:00Z",
    stadium: "ยิเลตต์ สเตเดียม",
    city: "บอสตัน",
    group: "กลุ่ม I",
    status: "scheduled",
  },
  // กลุ่ม J
  {
    id: "m19",
    homeTeamId: "arg",
    awayTeamId: "alg",
    homeScore: null,
    awayScore: null,
    date: "2026-06-17T01:00:00Z",
    stadium: "แอร์โรว์เฮด สเตเดียม",
    city: "แคนซัสซิตี้",
    group: "กลุ่ม J",
    status: "scheduled",
  },
  {
    id: "m20",
    homeTeamId: "aut",
    awayTeamId: "jor",
    homeScore: null,
    awayScore: null,
    date: "2026-06-17T04:00:00Z",
    stadium: "ซานฟรานซิสโก เบย์แอเรีย สเตเดียม",
    city: "ซานฟรานซิสโก",
    group: "กลุ่ม J",
    status: "scheduled",
  },
  // กลุ่ม K
  {
    id: "m21",
    homeTeamId: "por",
    awayTeamId: "cod",
    homeScore: null,
    awayScore: null,
    date: "2026-06-17T17:00:00Z",
    stadium: "เอ็นอาร์จี สเตเดียม",
    city: "ฮิวสตัน",
    group: "กลุ่ม K",
    status: "scheduled",
  },
  {
    id: "m22",
    homeTeamId: "uzb",
    awayTeamId: "col",
    homeScore: null,
    awayScore: null,
    date: "2026-06-18T02:00:00Z",
    stadium: "เอสตาดิโอ อัซเตกา",
    city: "เม็กซิโก ซิตี้",
    group: "กลุ่ม K",
    status: "scheduled",
  },
  // กลุ่ม L
  {
    id: "m23",
    homeTeamId: "eng",
    awayTeamId: "cro",
    homeScore: null,
    awayScore: null,
    date: "2026-06-17T20:00:00Z",
    stadium: "เอทีแอนด์ที สเตเดียม",
    city: "ดัลลัส",
    group: "กลุ่ม L",
    status: "scheduled",
  },
  {
    id: "m24",
    homeTeamId: "gha",
    awayTeamId: "pan",
    homeScore: null,
    awayScore: null,
    date: "2026-06-17T23:00:00Z",
    stadium: "โตรอนโต สเตเดียม",
    city: "โตรอนโต",
    group: "กลุ่ม L",
    status: "scheduled",
  }
];

export const standings: Record<string, StandingRow[]> = {
  "กลุ่ม A": [
    { teamId: "mex", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "kor", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "cze", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "rsa", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
  ],
  "กลุ่ม B": [
    { teamId: "can", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "sui", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "qat", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "bih", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
  ],
  "กลุ่ม C": [
    { teamId: "bra", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "mar", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "sco", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "hai", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
  ],
  "กลุ่ม D": [
    { teamId: "usa", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "tur", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "aus", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "par", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
  ],
  "กลุ่ม E": [
    { teamId: "ger", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "ecu", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "civ", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "cuw", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
  ],
  "กลุ่ม F": [
    { teamId: "ned", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "jpn", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "swe", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "tun", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
  ],
  "กลุ่ม G": [
    { teamId: "bel", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "egy", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "irn", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "nzl", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
  ],
  "กลุ่ม H": [
    { teamId: "esp", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "uru", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "ksa", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "cpv", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
  ],
  "กลุ่ม I": [
    { teamId: "fra", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "sen", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "nor", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "irq", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
  ],
  "กลุ่ม J": [
    { teamId: "arg", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "aut", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "alg", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "jor", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
  ],
  "กลุ่ม K": [
    { teamId: "por", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "col", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "uzb", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "cod", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
  ],
  "กลุ่ม L": [
    { teamId: "eng", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "cro", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "pan", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
    { teamId: "gha", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, status: "active" },
  ],
};

export const news: NewsItem[] = [
  {
    id: "n1",
    title: "พรีวิวฟุตบอลโลก 2026: เม็กซิโก ดวล แอฟริกาใต้ แมตช์เปิดสนามประวัติศาสตร์",
    excerpt:
      "วิเคราะห์ความพร้อมและสถิติต่างๆ ก่อนเกมการแข่งขันนัดเปิดสนามฟุตบอลโลก 2026 ระหว่างเจ้าภาพร่วมเม็กซิโกปะทะทีมเยือนแอฟริกาใต้ ณ สนามเอสตาดิโอ อัซเตกา คืนนี้",
    image: "https://images.unsplash.com/photo-1574629810360-7ab2e98b8a88?w=800&h=450&fit=crop",
    category: "news",
    date: "2026-06-11T10:00:00Z",
    featured: true,
  },
  {
    id: "n2",
    title: "พูลิซิช พร้อมนำทัพสหรัฐอเมริกาประเดิมสนามชนปารากวัย",
    excerpt: "กัปตันทีมพูลิซิชแสดงความมั่นใจอย่างเต็มเปี่ยมก่อนการเผชิญหน้าในลอสแอนเจลิส",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&h=450&fit=crop",
    category: "news",
    date: "2026-06-11T20:00:00Z",
  },
  {
    id: "n3",
    title: "ทัพบราซิลถึงนิวยอร์กเตรียมลุยศึกบิ๊กแมตช์พบโมร็อกโก",
    excerpt: "เนย์มาร์ และ วินิซิอุส นำทัพบราซิลเดินทางถึงนิวเจอร์ซีย์เพื่อเตรียมลงเล่นรอบแบ่งกลุ่มที่สนามเม็ตไลฟ์ สเตเดียม",
    image: "https://images.unsplash.com/photo-1574629810360-7ab2e98b8a88?w=800&h=450&fit=crop",
    category: "transfer",
    date: "2026-06-11T18:00:00Z",
  },
  {
    id: "n4",
    title: "เอสตาดิโอ อัซเตกา สร้างประวัติศาสตร์เป็นสนามแรกที่จัดบอลโลก 3 สมัย",
    excerpt: "สนามฟุตบอลในตำนานที่เม็กซิโก ซิตี้ ได้รับการจารึกชื่อในฐานะสนามแรกของโลกที่เป็นเจ้าภาพจัดการแข่งขัน 3 ทศวรรษ",
    image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&h=450&fit=crop",
    category: "video",
    date: "2026-06-11T14:00:00Z",
  }
];

export const commentary: CommentaryLine[] = [];

export function getTeam(id: string) {
  return teams.find((t) => t.id === id);
}

export function getPlayer(id: string) {
  return players.find((p) => p.id === id);
}

export function getMatch(id: string) {
  return matches.find((m) => m.id === id);
}

export function getTeamPlayers(teamId: string) {
  return players.filter((p) => p.teamId === teamId);
}

export function getTeamMatches(teamId: string) {
  return matches.filter((m) => m.homeTeamId === teamId || m.awayTeamId === teamId);
}

export function getLiveMatches() {
  return matches.filter((m) => m.status === "live");
}

export function getTodayMatches() {
  const today = new Date("2026-06-11");
  return matches.filter((m) => {
    const d = new Date(m.date);
    return d.toDateString() === today.toDateString();
  });
}

export function getUpcomingMatches() {
  return matches.filter((m) => m.status === "scheduled");
}

export const aiPrediction = {
  matchId: "m1",
  winner: "เม็กซิโก",
  confidence: 65,
  score: "2-1",
  summary:
    "ความได้เปรียบจากการเล่นในฐานะเจ้าบ้าน ณ สนามเอสตาดิโอ อัซเตกา ทำให้เม็กซิโกดูเหนือกว่า แอฟริกาใต้จะเน้นเกมโต้กลับเร็ว แต่ประสบการณ์ในแนวรุกของเม็กซิโกจะช่วยให้พวกเขาเบียดคว้าชัยชนะ",
};

export const aiSummary =
  "การแข่งขันยังไม่เริ่มต้นขึ้น มาร่วมลุ้นผลการแข่งขันนัดเปิดสนามฟุตบอลโลก 2026 ไปพร้อมกันเมื่อเกมเริ่มเตะ";

export const fanReactions = [
  { emoji: "🔥", count: 12400, label: "ร้อนแรง" },
  { emoji: "😱", count: 8900, label: "ตะลึง" },
  { emoji: "👏", count: 15600, label: "ปรบมือ" },
  { emoji: "😢", count: 3200, label: "เศร้า" },
];
