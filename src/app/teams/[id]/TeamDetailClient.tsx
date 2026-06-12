"use client";

import Image from "next/image";
import { PageTransition } from "@/components/PageTransition";
import { MatchCard } from "@/components/MatchCard";
import { PlayerCard } from "@/components/PlayerCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Team, getTeamMatches, getTeamPlayers } from "@/data/mock";

export default function TeamDetailClient({ team }: { team: Team }) {
  const matches = getTeamMatches(team.id);
  const players = getTeamPlayers(team.id);

  return (
    <PageTransition>
      <div>
        {/* Hero */}
        <div
          className="relative overflow-hidden px-4 py-12 md:px-8 md:py-16"
          style={{
            background: `linear-gradient(135deg, ${team.colors.primary}40 0%, #070B14 60%)`,
          }}
        >
          <div className="absolute inset-0 stadium-lights opacity-30" />
          <div className="relative z-10 flex items-center gap-6">
            <Image
              src={team.flag}
              alt={team.name}
              width={120}
              height={80}
              className="rounded-lg shadow-gold"
            />
            <div>
              <h1 className="font-heading text-4xl tracking-wide text-white md:text-6xl">
                {team.name}
              </h1>
              <p className="mt-1 text-sm text-white/50">
                อันดับฟีฟ่า <span className="font-heading text-2xl text-gold">#{team.ranking}</span>
              </p>
              <p className="mt-1 text-xs text-white/40">{team.continent}</p>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
              <TabsTrigger value="squad">ผู้เล่น</TabsTrigger>
              <TabsTrigger value="fixtures">ตารางแข่ง</TabsTrigger>
              <TabsTrigger value="stats">สถิติ</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="mt-4 glass-card p-6">
                <h3 className="font-heading text-lg text-white">ข้อมูลทีม</h3>
                <p className="mt-3 leading-relaxed text-white/60">{team.overview}</p>
              </div>
              {players.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-4 font-heading text-lg text-gold">ผู้เล่นดาวเด่น</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {players.map((p, i) => (
                      <PlayerCard key={p.id} player={p} index={i} />
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="squad">
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {players.length > 0 ? (
                  players.map((p, i) => <PlayerCard key={p.id} player={p} index={i} />)
                ) : (
                  <p className="text-white/40">รายชื่อผู้เล่นกำลังจะอัปเดตเร็ว ๆ นี้</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="fixtures">
              <div className="mt-4 space-y-3">
                {matches.map((m, i) => (
                  <MatchCard key={m.id} match={m} index={i} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="stats">
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "จำนวนนัดที่แข่ง", value: matches.length },
                  { label: "ประตูที่ยิงได้", value: 8 },
                  { label: "คลีนชีต", value: 2 },
                ].map((s) => (
                  <div key={s.label} className="glass-card p-4 text-center">
                    <p className="text-xs text-white/40">{s.label}</p>
                    <p className="font-heading text-3xl text-neon">{s.value}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
}
