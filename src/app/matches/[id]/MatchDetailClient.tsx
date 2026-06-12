"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { ScoreBoard } from "@/components/ScoreBoard";
import { StatBar, MomentumGraph } from "@/components/StatBar";
import { LiveBadge } from "@/components/LiveBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Match, getTeam, aiSummary } from "@/data/mock";

const momentumData = [10, 25, 15, -10, 30, 20, -5, 40, 15, -20, 10, 35, 20, -15, 25];

export default function MatchDetailClient({ match }: { match: Match }) {
  const home = getTeam(match.homeTeamId)!;
  const away = getTeam(match.awayTeamId)!;
  const stats = match.stats;

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
