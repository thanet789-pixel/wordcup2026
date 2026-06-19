"use client";

import { useState, useEffect } from "react";
import { PageTransition } from "@/components/PageTransition";
import { MatchCard } from "@/components/MatchCard";
import { matches, Match } from "@/data/mock";
import { formatDate, cn, isSameDayBangkok } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

const groups = [
  "ทั้งหมด",
  "สด",
  "วันนี้",
  "กลุ่ม A",
  "กลุ่ม B",
  "กลุ่ม C",
  "กลุ่ม D",
  "กลุ่ม E",
  "กลุ่ม F",
  "กลุ่ม G",
  "กลุ่ม H",
  "กลุ่ม I",
  "กลุ่ม J",
  "กลุ่ม K",
  "กลุ่ม L",
];

export default function MatchesPage() {
  const [filter, setFilter] = useState("ทั้งหมด");
  const [matchesState, setMatchesState] = useState<Match[]>(matches);
  const [todayDate, setTodayDate] = useState<Date | null>(null);

  useEffect(() => {
    setTodayDate(new Date());
    
    if (!db) {
      console.warn("Firebase Firestore is not initialized. Please configure environment variables.");
      return;
    }
    
    // Real-time matches listener
    const unsub = onSnapshot(collection(db, "matches"), (snap) => {
      const list: Match[] = [];
      snap.forEach((doc) => list.push(doc.data() as Match));
      if (list.length > 0) {
        list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setMatchesState(list);
      }
    }, (err) => {
      console.error("Error listening to matches from Firestore:", err);
    });

    return () => unsub();
  }, []);

  const filtered = matchesState.filter((m) => {
    if (filter === "ทั้งหมด") return true;
    if (filter === "สด") return m.status?.toLowerCase() === "live";
    if (filter === "วันนี้") {
      if (!todayDate) return false;
      return isSameDayBangkok(m.date, todayDate);
    }
    return m.group === filter;
  });

  const grouped = filtered.reduce<Record<string, Match[]>>((acc, m) => {
    const key = formatDate(m.date);
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  return (
    <PageTransition>
      <div className="p-4 md:p-8">
        <h1 className="font-heading text-3xl tracking-wide text-white md:text-4xl">ตารางแข่งขัน</h1>
        <p className="mt-1 text-sm text-white/50">ตารางการแข่งขันฟุตบอลโลก 2026</p>

        <div className="mt-6 overflow-x-auto">
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="w-max">
              {groups.map((g) => (
                <TabsTrigger key={g} value={g} className={cn(g === "สด" && "data-[state=active]:text-live")}>
                  {g}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="mt-8 space-y-8">
          {Object.entries(grouped).map(([date, dateMatches]) => (
            <section key={date}>
              <h2 className="mb-4 font-heading text-lg tracking-wide text-neon">{date}</h2>
              <div className="relative space-y-4 pl-6 before:absolute before:left-2 before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-neon/20">
                {dateMatches.map((m, i) => (
                  <div key={m.id} className="relative">
                    <div className="absolute -left-4 top-6 h-3 w-3 rounded-full border-2 border-neon bg-navy" />
                    <MatchCard match={m} index={i} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
