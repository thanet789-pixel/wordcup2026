"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { ScoreBoard } from "@/components/ScoreBoard";
import { StatBar, MomentumGraph } from "@/components/StatBar";
import { LiveBadge } from "@/components/LiveBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Match, getTeam, aiSummary } from "@/data/mock";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

const momentumData = [10, 25, 15, -10, 30, 20, -5, 40, 15, -20, 10, 35, 20, -15, 25];

export default function MatchDetailClient({ match }: { match: Match }) {
  const home = getTeam(match.homeTeamId)!;
  const away = getTeam(match.awayTeamId)!;
  const stats = match.stats;

  const { user, loginWithGoogle } = useAuth();
  const [userPrediction, setUserPrediction] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user || !db) return;

    const predictionId = `${match.id}_${user.uid}`;
    const unsub = onSnapshot(doc(db, "predictions", predictionId), (docSnap) => {
      if (docSnap.exists()) {
        setUserPrediction(docSnap.data().prediction);
      }
    });

    return () => unsub();
  }, [user, match.id]);

  const handlePredict = async (choice: "home" | "draw" | "away") => {
    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อนร่วมทายผลการแข่งขัน");
      loginWithGoogle();
      return;
    }

    if (match.status?.toLowerCase() === "finished") {
      alert("แมตช์นี้จบการแข่งขันแล้ว ไม่สามารถทายผลได้");
      return;
    }

    setSubmitting(true);
    const predictionId = `${match.id}_${user.uid}`;

    try {
      await setDoc(
        doc(db, "predictions", predictionId),
        {
          uid: user.uid,
          displayName: user.displayName || "แฟนบอล",
          photoURL: user.photoURL || "",
          matchId: match.id,
          prediction: choice,
          status: "pending",
          points: 0,
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err: any) {
      alert(`เกิดข้อผิดพลาดในการส่งข้อมูล: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-card border border-glass-border bg-glass p-6 backdrop-blur-xl">
          <div className="absolute inset-0 stadium-lights opacity-50" />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-white/50">
                <MapPin className="h-4 w-4" />
                {match.stadium}, {match.city}
              </div>
              {match.status?.toLowerCase() === "live" && <LiveBadge />}
            </div>
            <ScoreBoard match={match} large animate />
            <div className="mt-4 flex justify-center gap-3">
              {match.status?.toLowerCase() === "live" && (
                <Button asChild variant="live">
                  <Link href={`/live/${match.id}`}>รับชมพากย์สดแบบเรียลไทม์</Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <div className="mt-6 glass-card p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold" />
            <h3 className="font-heading text-lg text-white">วิเคราะห์แมตช์โดย AI</h3>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-white/60">{aiSummary}</p>
        </div>

        {/* Match Predictor Card */}
        <div className="mt-6 overflow-hidden rounded-card border border-glass-border bg-glass/80 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-glass-border pb-3">
            <h3 className="font-heading text-lg text-gold flex items-center gap-2">
              🏆 ทายผลการแข่งขันสะสมคะแนน
            </h3>
            <span className="text-[10px] uppercase tracking-wider text-white/40">
              ทายถูกรับ 3 คะแนน
            </span>
          </div>

          <div className="mt-4">
            {match.status?.toLowerCase() === "finished" ? (
              <div className="text-center py-4 bg-navy-light/20 rounded-lg border border-glass-border">
                <p className="text-sm text-white/50">จบการแข่งขันแล้ว — สิ้นสุดเวลาร่วมทายผล</p>
                {userPrediction ? (
                  <div className="mt-3 inline-block rounded-full bg-gold/10 px-4 py-1 text-xs font-semibold text-gold border border-gold/30">
                    คุณทายผลว่า: {userPrediction === "home" ? home.name : userPrediction === "away" ? away.name : "เสมอ"}
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-white/30">คุณไม่ได้ร่วมทายผลแมตช์นี้</p>
                )}
              </div>
            ) : !user ? (
              <div className="text-center py-4 bg-navy-light/20 rounded-lg border border-glass-border">
                <p className="text-sm text-white/60 mb-3">เข้าสู่ระบบเพื่อร่วมทายผลและสะสมคะแนนจัดอันดับแฟนบอลอันดับหนึ่ง!</p>
                <button
                  onClick={loginWithGoogle}
                  className="rounded-lg border border-neon/30 bg-neon/10 px-6 py-2 text-xs font-semibold text-neon transition-all hover:bg-neon hover:text-navy hover:shadow-[0_0_12px_rgba(34,197,94,0.4)]"
                >
                  เข้าสู่ระบบเพื่อร่วมสนุก
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-white/60 text-center">คุณทายว่าทีมใดจะเป็นฝ่ายชนะในแมตช์นี้?</p>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    disabled={submitting}
                    onClick={() => handlePredict("home")}
                    className={`flex flex-col items-center justify-center gap-2 rounded-lg border p-3 transition-all ${
                      userPrediction === "home"
                        ? "border-neon bg-neon/10 text-neon shadow-neon"
                        : "border-glass-border bg-navy-light/10 text-white/80 hover:border-white/20 hover:bg-white/5"
                    }`}
                  >
                    <span className="text-2xl">{home.flag}</span>
                    <span className="text-xs font-medium truncate w-full text-center">{home.name} ชนะ</span>
                  </button>

                  <button
                    disabled={submitting}
                    onClick={() => handlePredict("draw")}
                    className={`flex flex-col items-center justify-center gap-2 rounded-lg border p-3 transition-all ${
                      userPrediction === "draw"
                        ? "border-gold bg-gold/10 text-gold shadow-gold"
                        : "border-glass-border bg-navy-light/10 text-white/80 hover:border-white/20 hover:bg-white/5"
                    }`}
                  >
                    <span className="text-2xl">🤝</span>
                    <span className="text-xs font-medium text-center">เสมอ</span>
                  </button>

                  <button
                    disabled={submitting}
                    onClick={() => handlePredict("away")}
                    className={`flex flex-col items-center justify-center gap-2 rounded-lg border p-3 transition-all ${
                      userPrediction === "away"
                        ? "border-neon bg-neon/10 text-neon shadow-neon"
                        : "border-glass-border bg-navy-light/10 text-white/80 hover:border-white/20 hover:bg-white/5"
                    }`}
                  >
                    <span className="text-2xl">{away.flag}</span>
                    <span className="text-xs font-medium truncate w-full text-center">{away.name} ชนะ</span>
                  </button>
                </div>
                {userPrediction && (
                  <p className="text-[10px] text-center text-neon font-medium animate-pulse">
                    ✨ บันทึกการทายผลของคุณเรียบร้อยแล้ว (คุณสามารถเปลี่ยนคำตอบได้ก่อนเริ่มการแข่งขัน)
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="mt-6">
          <TabsList>
            <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
            <TabsTrigger value="timeline">ไทม์ไลน์</TabsTrigger>
            <TabsTrigger value="lineups">รายชื่อนักเตะ</TabsTrigger>
            <TabsTrigger value="stats">สถิติ</TabsTrigger>
            <TabsTrigger value="h2h">สถิติพบกัน</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <MomentumGraph data={momentumData} />
          </TabsContent>

          <TabsContent value="timeline">
            <div className="space-y-3">
              {match.events?.slice().reverse().map((e) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-4 rounded-card border border-glass-border bg-glass p-3"
                >
                  <span className="font-heading text-lg text-neon">{e.minute}&apos;</span>
                  <span
                    className={`text-lg ${
                      e.type === "goal"
                        ? "text-gold"
                        : e.type === "yellow"
                          ? "text-yellow-400"
                          : e.type === "red"
                            ? "text-live"
                            : "text-white/60"
                    }`}
                  >
                    {e.type === "goal" ? "⚽" : e.type === "yellow" ? "🟨" : e.type === "red" ? "🟥" : "🔄"}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">{e.player}</p>
                    {e.detail && <p className="text-xs text-white/40">{e.detail}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="lineups">
            <div className="grid gap-4 md:grid-cols-2">
              {[home, away].map((team) => (
                <div key={team.id} className="glass-card p-4">
                  <h4 className="font-heading text-lg text-white">{team.name}</h4>
                  <p className="text-xs text-white/40">แผนการเล่น: 4-3-3</p>
                  <div className="mt-4 space-y-2">
                    {["GK - อลิสซอน", "DF - ดานิโล", "DF - มาร์ควินญอส", "DF - มิลิเตา", "DF - อเล็กซ์ ซานโดร", "MF - คาเซมิโร่", "MF - ปาเกต้า", "MF - บรูโน่ กิมาไรส์", "FW - วินิซิอุส จูเนียร์", "FW - เนย์มาร์ จูเนียร์", "FW - ริชาร์ลิซอน"].map(
                      (p) => (
                        <p key={p} className="text-sm text-white/70">
                          {p}
                        </p>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stats">
            {stats && (
              <div className="space-y-4 glass-card p-4">
                <StatBar label="การครองบอล" homeValue={stats.possession[0]} awayValue={stats.possession[1]} suffix="%" homeLabel={home.name} awayLabel={away.name} />
                <StatBar label="โอกาสยิงทั้งหมด" homeValue={stats.shots[0]} awayValue={stats.shots[1]} />
                <StatBar label="ยิงเข้ากรอบ" homeValue={stats.shotsOnTarget[0]} awayValue={stats.shotsOnTarget[1]} />
                <StatBar label="เตะมุม" homeValue={stats.corners[0]} awayValue={stats.corners[1]} />
                <StatBar label="ฟาวล์" homeValue={stats.fouls[0]} awayValue={stats.fouls[1]} />
                <StatBar label="ใบเหลือง" homeValue={stats.yellowCards[0]} awayValue={stats.yellowCards[1]} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="h2h">
            <div className="glass-card p-4">
              <p className="text-sm text-white/60">พบกัน 5 นัดล่าสุด</p>
              <div className="mt-4 space-y-3">
                {[
                  { score: "2-1", winner: "บราซิล", date: "2024" },
                  { score: "1-1", winner: "เสมอ", date: "2023" },
                  { score: "0-1", winner: "อาร์เจนตินา", date: "2022" },
                  { score: "3-0", winner: "บราซิล", date: "2021" },
                  { score: "1-2", winner: "อาร์เจนตินา", date: "2019" },
                ].map((h) => (
                  <div key={h.date} className="flex justify-between border-b border-white/5 pb-2 text-sm">
                    <span className="text-white">{h.score}</span>
                    <span className="text-white/40">{h.winner}</span>
                    <span className="text-white/30">{h.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}
