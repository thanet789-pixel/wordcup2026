"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { CountdownTimer } from "@/components/CountdownTimer";
import { MatchCard } from "@/components/MatchCard";
import { GroupTable } from "@/components/GroupTable";
import { NewsCard } from "@/components/NewsCard";
import {
  matches,
  standings,
  news,
  getTeam,
  aiPrediction,
  Match,
  StandingRow,
  NewsItem,
} from "@/data/mock";
import { Button } from "@/components/ui/button";
import { formatDate, formatMatchTime, isSameDayBangkok } from "@/lib/utils";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function HomePage() {
  const [matchesState, setMatchesState] = useState<Match[]>(matches);
  const [standingsState, setStandingsState] = useState<Record<string, StandingRow[]>>(standings);
  const [newsState, setNewsState] = useState<NewsItem[]>(news);
  const [todayDate, setTodayDate] = useState<Date | null>(null);

  useEffect(() => {
    setTodayDate(new Date());
    // Trigger background sync loop on server-side
    fetch("/api/sync").catch((e) => console.error("Initial background sync trigger error:", e));

    async function fetchData() {
      try {
        const matchesSnap = await getDocs(collection(db, "matches"));
        const matchesList: Match[] = [];
        matchesSnap.forEach((doc) => matchesList.push(doc.data() as Match));
        if (matchesList.length > 0) {
          matchesList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          setMatchesState(matchesList);
        }

        const standingsSnap = await getDocs(collection(db, "standings"));
        const standingsMap: Record<string, StandingRow[]> = {};
        standingsSnap.forEach((doc) => {
          standingsMap[doc.id] = doc.data().rows as StandingRow[];
        });
        if (Object.keys(standingsMap).length > 0) {
          setStandingsState(standingsMap);
        }

        const newsSnap = await getDocs(collection(db, "news"));
        const newsList: NewsItem[] = [];
        newsSnap.forEach((doc) => newsList.push(doc.data() as NewsItem));
        if (newsList.length > 0) {
          setNewsState(newsList);
        }
      } catch (err) {
        console.error("Error fetching Firestore data:", err);
      }
    }
    fetchData();
  }, []);

  const heroMatch = matchesState[0] || matches[0];
  const home = getTeam(heroMatch.homeTeamId)!;
  const away = getTeam(heroMatch.awayTeamId)!;
  const liveMatches = matchesState.filter((m) => m.status?.toLowerCase() === "live");
  const todayMatches = matchesState.filter((m) => {
    if (!todayDate) return false;
    return isSameDayBangkok(m.date, todayDate);
  });
  const upcoming = matchesState.filter((m) => m.status?.toLowerCase() === "scheduled");
  const featuredNews = newsState.find((n) => n.featured) || news[0];

  return (
    <PageTransition>
      <div className="space-y-8 p-4 md:p-8">
        {/* Hero Banner */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative overflow-hidden rounded-card border border-glass-border"
        >
          <div className="absolute inset-0">
            <Image
              src="/hero_match_banner.png"
              alt="Hero"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-hero-gradient" />
            <div className="absolute inset-0 stadium-lights" />
          </div>

          <div className="relative z-10 p-6 md:p-10">
            <p className="text-xs uppercase tracking-widest text-neon">การแข่งขันนัดเปิดสนาม</p>
            <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="flex items-center gap-4">
                  <Image src={home.flag} alt="" width={48} height={32} className="rounded-sm" />
                  <span className="font-heading text-3xl text-white md:text-5xl">VS</span>
                  <Image src={away.flag} alt="" width={48} height={32} className="rounded-sm" />
                </div>
                <h1 className="mt-2 font-heading text-4xl tracking-wide text-white md:text-6xl">
                  {home.name} พบ {away.name}
                </h1>
                <p className="mt-2 text-sm text-white/60">
                  {heroMatch.stadium} · {heroMatch.city}
                </p>
                <p className="mt-1.5 text-xs font-semibold text-neon">
                  เริ่มการแข่งขัน: {formatDate(heroMatch.date)} เวลา {formatMatchTime(heroMatch.date)} (เวลาประเทศไทย)
                </p>
              </div>
              <CountdownTimer targetDate={heroMatch.date} />
            </div>
            <div className="mt-6 flex gap-3">
              <Button asChild variant="default">
                <Link href={`/live/${heroMatch.id}`}>
                  รับชมพากย์สด <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={`/matches/${heroMatch.id}`}>ศูนย์ข้อมูลแมตช์</Link>
              </Button>
            </div>
          </div>
        </motion.section>

        {/* AI Prediction */}
        <section className="glass-card p-4 md:p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-gold" />
            <h2 className="font-heading text-xl tracking-wide text-white">วิเคราะห์ผลโดย AI</h2>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs text-white/40">ทำนายผู้ชนะ</p>
              <p className="font-heading text-2xl text-gold">{aiPrediction.winner}</p>
            </div>
            <div>
              <p className="text-xs text-white/40">ทำนายสกอร์</p>
              <p className="font-heading text-2xl text-neon">{aiPrediction.score}</p>
            </div>
            <div>
              <p className="text-xs text-white/40">ความมั่นใจ</p>
              <p className="font-heading text-2xl text-white">{aiPrediction.confidence}%</p>
            </div>
          </div>
        </section>

        {/* Live Matches */}
        {liveMatches.length > 0 && (
          <section>
            <h2 className="mb-4 font-heading text-2xl tracking-wide text-live">แมตช์กำลังแข่งสด</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {liveMatches.map((m, i) => (
                <MatchCard key={m.id} match={m} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Today's Matches */}
        <section>
          <h2 className="mb-4 font-heading text-2xl tracking-wide text-white">
            การแข่งขันวันนี้
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {todayMatches.map((m, i) => (
              <MatchCard key={m.id} match={m} index={i} />
            ))}
          </div>
        </section>

        {/* Standings + Upcoming */}
        <div className="grid gap-6 lg:grid-cols-2">
          <section>
            <h2 className="mb-4 font-heading text-2xl tracking-wide text-gold">
              ตารางคะแนนแบ่งกลุ่ม
            </h2>
            <GroupTable group="กลุ่ม A" rows={standingsState["กลุ่ม A"] || standings["กลุ่ม A"]} />
          </section>
          <section>
            <h2 className="mb-4 font-heading text-2xl tracking-wide text-white">
              ตารางการแข่งขันถัดไป
            </h2>
            <div className="space-y-3">
              {upcoming.slice(0, 3).map((m, i) => (
                <MatchCard key={m.id} match={m} index={i} />
              ))}
            </div>
          </section>
        </div>

        {/* News */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-2xl tracking-wide text-white">ข่าวสารไฮไลท์</h2>
            <Link href="/news" className="text-sm text-neon hover:underline">
              ดูทั้งหมด
            </Link>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <NewsCard item={featuredNews} featured />
            <div className="space-y-3">
              {news.slice(1, 4).map((n) => (
                <NewsCard key={n.id} item={n} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
