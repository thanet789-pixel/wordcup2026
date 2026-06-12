"use client";

import Image from "next/image";
import Link from "next/link";
import { PageTransition } from "@/components/PageTransition";
import { StatBar } from "@/components/StatBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Player, getTeam } from "@/data/mock";

export default function PlayerDetailClient({ player }: { player: Player }) {
  const team = getTeam(player.teamId)!;

  return (
    <PageTransition>
      <div>
        {/* Hero */}
        <div className="relative overflow-hidden bg-navy-light px-4 py-8 md:px-8">
          <div className="absolute inset-0 stadium-lights opacity-20" />
          <div className="relative z-10 flex flex-col items-center gap-6 md:flex-row">
            <div className="relative h-48 w-40 overflow-hidden rounded-card border-2 border-neon/30 shadow-neon">
              <Image src={player.image} alt={player.name} fill className="object-cover" />
            </div>
            <div className="text-center md:text-left">
              <Link href={`/teams/${team.id}`} className="text-xs uppercase tracking-widest text-neon hover:underline">
                {team.name}
              </Link>
              <h1 className="font-heading text-4xl tracking-wide text-white md:text-5xl">
                {player.name}
              </h1>
              <p className="mt-1 text-white/50">
                {player.position} · #{player.number}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-4 md:justify-start">
                {[
                  { label: "อายุ", value: player.age },
                  { label: "ส่วนสูง", value: player.height },
                  { label: "น้ำหนัก", value: player.weight },
                  { label: "เท้าข้างถนัด", value: player.foot },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-[10px] uppercase text-white/40">{s.label}</p>
                    <p className="text-sm font-medium text-white">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8">
          {/* Tournament summary */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "ลงเล่น", value: player.matches, color: "text-white" },
              { label: "ทำประตู", value: player.goals, color: "text-neon" },
              { label: "แอสซิสต์", value: player.assists, color: "text-gold" },
              { label: "แมนออฟเดอะแมตช์", value: player.motm, color: "text-live" },
            ].map((s) => (
              <div key={s.label} className="glass-card p-4 text-center">
                <p className="text-xs text-white/40">{s.label}</p>
                <p className={`font-heading text-3xl ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          <Tabs defaultValue="tournament" className="mt-8">
            <TabsList>
              <TabsTrigger value="tournament">สถิติทัวร์นาเมนต์</TabsTrigger>
              <TabsTrigger value="career">สถิติค้าแข้ง</TabsTrigger>
              <TabsTrigger value="history">ประวัติการลงเล่น</TabsTrigger>
            </TabsList>

            <TabsContent value="tournament">
              <div className="mt-4 space-y-4 glass-card p-4">
                <StatBar label="โอกาสยิงทั้งหมด" homeValue={player.shots} awayValue={0} />
                <StatBar label="จำนวนการจ่ายบอล" homeValue={player.passes} awayValue={0} />
                <div>
                  <p className="mb-2 text-sm text-white/60">ความแม่นยำในการผ่านบอล</p>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-neon to-gold"
                      style={{ width: `${player.passAccuracy}%` }}
                    />
                  </div>
                  <p className="mt-1 text-right text-sm text-neon">{player.passAccuracy}%</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="career">
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "จำนวนประตูทั้งหมด", value: 412 },
                  { label: "จำนวนแอสซิสต์ทั้งหมด", value: 198 },
                  { label: "ลงเล่นทีมชาติ (นัด)", value: 128 },
                ].map((s) => (
                  <div key={s.label} className="glass-card p-4 text-center">
                    <p className="text-xs text-white/40">{s.label}</p>
                    <p className="font-heading text-2xl text-gold">{s.value}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="mt-4 space-y-2">
                {[
                  { opponent: "Argentina", score: "2-1", rating: 8.5 },
                  { opponent: "France", score: "1-0", rating: 7.8 },
                  { opponent: "Germany", score: "3-1", rating: 9.1 },
                ].map((m) => (
                  <div key={m.opponent} className="flex justify-between glass-card p-3 text-sm">
                    <span className="text-white">vs {m.opponent}</span>
                    <span className="text-neon">{m.score}</span>
                    <span className="text-gold">Rating: {m.rating}</span>
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
