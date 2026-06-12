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
import { collection, getDocs, onSnapshot } from "firebase/firestore";
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

    if (!db) {
      console.warn("Firebase Firestore is not initialized. Please configure environment variables.");
      return;
    }

    // 1. Real-time matches listener
    const unsubMatches = onSnapshot(collection(db, "matches"), (snap) => {
      const matchesList: Match[] = [];
      snap.forEach((doc) => matchesList.push(doc.data() as Match));
      if (matchesList.length > 0) {
        matchesList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setMatchesState(matchesList);
      }
    }, (err) => {
      console.error("Error listening to matches:", err);
    });

    // 2. Real-time standings listener
    const unsubStandings = onSnapshot(collection(db, "standings"), (snap) => {
      const standingsMap: Record<string, StandingRow[]> = {};
      snap.forEach((doc) => {
        standingsMap[doc.id] = doc.data().rows as StandingRow[];
      });
      if (Object.keys(standingsMap).length > 0) {
        setStandingsState(standingsMap);
      }
    }, (err) => {
      console.error("Error listening to standings:", err);
    });

    // 3. Real-time news listener
    const unsubNews = onSnapshot(collection(db, "news"), (snap) => {
      const newsList: NewsItem[] = [];
      snap.forEach((doc) => newsList.push(doc.data() as NewsItem));
      if (newsList.length > 0) {
        setNewsState(newsList);
      }
    }, (err) => {
      console.error("Error listening to news:", err);
    });

    return () => {
      unsubMatches();
      unsubStandings();
      unsubNews();
    };
  }, []);

  const getFeaturedMatch = (): Match => {
    const live = matchesState.find(
      (m) => m.status?.toLowerCase() === "live" || m.status?.toLowerCase() === "halftime"
    );
    if (live) return live;

    const scheduled = matchesState
      .filter((m) => m.status?.toLowerCase() === "scheduled")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (scheduled.length > 0) return scheduled[0];

    const finished = matchesState
      .filter((m) => m.status?.toLowerCase() === "finished")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (finished.length > 0) return finished[0];

    return matchesState[0] || matches[0];
  };

  const heroMatch = getFeaturedMatch();
  const home = getTeam(heroMatch.homeTeamId) || { name: heroMatch.homeTeamId, flag: "https://flagcdn.com/w320/un.png", ranking: 100 };
  const away = getTeam(heroMatch.awayTeamId) || { name: heroMatch.awayTeamId, flag: "https://flagcdn.com/w320/un.png", ranking: 100 };

  const getHeroLabel = (match: Match) => {
    if (match.status?.toLowerCase() === "live" || match.status?.toLowerCase() === "halftime") {
      return "กำลังแข่งขันสด (LIVE)";
    }
    if (match.status?.toLowerCase() === "finished") {
      return "จบการแข่งขันแล้ว";
    }
    if (match.id === "m1") {
      return "การแข่งขันนัดเปิดสนาม";
    }
    return "ไฮไลท์แมตช์ถัดไป";
  };

  const getAiPrediction = (match: Match) => {
    if (match.id === "m1") {
      return aiPrediction;
    }
    const homeTeam = getTeam(match.homeTeamId);
    const awayTeam = getTeam(match.awayTeamId);
    if (!homeTeam || !awayTeam) {
      return { winner: "ไม่ระบุ", score: "0-0", confidence: 50 };
    }

    const rankDiff = homeTeam.ranking - awayTeam.ranking;
    let winner = "เสมอ";
    let score = "1-1";
    let confidence = 50;

    if (rankDiff < -10) {
      winner = homeTeam.name;
      score = rankDiff < -30 ? "3-0" : "2-0";
      confidence = Math.min(85, 60 + Math.abs(rankDiff) * 0.5);
    } else if (rankDiff < 0) {
      winner = homeTeam.name;
      score = "2-1";
      confidence = Math.min(70, 55 + Math.abs(rankDiff));
    } else if (rankDiff > 10) {
      winner = awayTeam.name;
      score = rankDiff > 30 ? "0-3" : "0-2";
      confidence = Math.min(85, 60 + Math.abs(rankDiff) * 0.5);
    } else if (rankDiff > 0) {
      winner = awayTeam.name;
      score = "1-2";
      confidence = Math.min(70, 55 + Math.abs(rankDiff));
    } else {
      winner = "เสมอ";
      score = "1-1";
      confidence = 50;
    }

    return {
      winner,
      score,
      confidence: Math.round(confidence),
    };
  };

  const currentPrediction = getAiPrediction(heroMatch);

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
              src="/stadium_hero_bg.png"
              alt="Hero"
              fill
              className="object-cover animate-pulse-live"
              style={{ animationDuration: "10s" }}
              priority
            />
            <div className="absolute inset-0 bg-hero-gradient" />
            <div className="absolute inset-0 stadium-lights" />
          </div>

          <div className="relative z-10 p-6 md:p-10">
            <p className={`text-xs uppercase tracking-widest font-semibold ${
              (heroMatch.status === "live" || heroMatch.status === "halftime") 
                ? "text-live animate-pulse" 
                : "text-neon"
            }`}>
              {getHeroLabel(heroMatch)}
            </p>
            <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="flex items-center gap-5">
                  <Image src={home.flag} alt="" width={84} height={56} className="rounded shadow-lg border border-white/20 object-cover" />
                  <span className="font-heading text-2xl text-white/60 md:text-4xl">VS</span>
                  <Image src={away.flag} alt="" width={84} height={56} className="rounded shadow-lg border border-white/20 object-cover" />
                </div>
                <h1 className="mt-3 font-heading text-2xl tracking-wide text-white md:text-4xl">
                  {home.name} พบ {away.name}
                </h1>
                <p className="mt-2 text-sm text-white/60">
                  {heroMatch.stadium} · {heroMatch.city}
                </p>
                <p className="mt-1.5 text-xs font-semibold text-neon">
                  เริ่มการแข่งขัน: {formatDate(heroMatch.date)} เวลา {formatMatchTime(heroMatch.date)} (เวลาประเทศไทย)
                </p>
              </div>

              {/* Show Live/Finished score or CountdownTimer */}
              {(heroMatch.status === "live" || heroMatch.status === "halftime") ? (
                <div className="flex flex-col items-center justify-center rounded-card bg-live/15 px-6 py-4 border border-live/30 shadow-live animate-pulse">
                  <span className="text-xs uppercase tracking-widest text-live font-bold">กำลังแข่งสด</span>
                  <span className="font-heading text-4xl md:text-6xl text-white mt-1">
                    {heroMatch.homeScore} - {heroMatch.awayScore}
                  </span>
                  {heroMatch.minute && (
                    <span className="text-xs font-semibold text-neon mt-1 animate-pulse">
                      นาทีที่ {heroMatch.minute}&apos;
                    </span>
                  )}
                </div>
              ) : heroMatch.status === "finished" ? (
                <div className="flex flex-col items-center justify-center rounded-card bg-white/5 px-6 py-4 border border-white/10">
                  <span className="text-xs uppercase tracking-widest text-white/50">จบการแข่งขัน</span>
                  <span className="font-heading text-4xl md:text-6xl text-white mt-1">
                    {heroMatch.homeScore} - {heroMatch.awayScore}
                  </span>
                  <span className="text-xs font-semibold text-emerald-400 mt-1">
                    FT
                  </span>
                </div>
              ) : (
                <CountdownTimer targetDate={heroMatch.date} />
              )}
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
              <p className="font-heading text-2xl text-gold">{currentPrediction.winner}</p>
            </div>
            <div>
              <p className="text-xs text-white/40">ทำนายสกอร์</p>
              <p className="font-heading text-2xl text-neon">{currentPrediction.score}</p>
            </div>
            <div>
              <p className="text-xs text-white/40">ความมั่นใจ</p>
              <p className="font-heading text-2xl text-white">{currentPrediction.confidence}%</p>
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
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-2xl tracking-wide text-gold">
                ตารางคะแนนแบ่งกลุ่ม
              </h2>
              <Link href="/standings" className="text-sm text-neon hover:underline">
                ดูทั้งหมด
              </Link>
            </div>
            <GroupTable group="กลุ่ม A" rows={standingsState["กลุ่ม A"] || standings["กลุ่ม A"]} />
            <div className="mt-4">
              <Link href="/standings">
                <button className="w-full rounded-lg border border-gold/30 bg-gold/10 py-2.5 text-center text-sm font-medium text-gold backdrop-blur-xl transition-all hover:bg-gold hover:text-navy hover:shadow-[0_0_15px_rgba(218,165,32,0.4)]">
                  คลิกดูตารางคะแนนทุกกลุ่ม
                </button>
              </Link>
            </div>
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
