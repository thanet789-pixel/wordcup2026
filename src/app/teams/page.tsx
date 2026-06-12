"use client";

import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { TeamCard } from "@/components/TeamCard";
import { teams, Team } from "@/data/mock";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const continents = ["ทั้งหมด", "ยุโรป", "อเมริกาใต้", "อเมริกาเหนือ", "เอเชีย"];

export default function TeamsPage() {
  const [search, setSearch] = useState("");
  const [continent, setContinent] = useState("ทั้งหมด");
  const [teamsState, setTeamsState] = useState<Team[]>(teams);

  useEffect(() => {
    if (!db) {
      console.warn("Firebase Firestore is not initialized. Please configure environment variables.");
      return;
    }
    async function fetchTeams() {
      try {
        const snap = await getDocs(collection(db, "teams"));
        const list: Team[] = [];
        snap.forEach((doc) => list.push(doc.data() as Team));
        if (list.length > 0) {
          list.sort((a, b) => a.name.localeCompare(b.name, "th"));
          setTeamsState(list);
        }
      } catch (err) {
        console.error("Error fetching teams from Firestore:", err);
      }
    }
    fetchTeams();
  }, []);

  const filtered = useMemo(() => {
    return teamsState.filter((t) => {
      const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
      const matchContinent = continent === "ทั้งหมด" || t.continent === continent;
      return matchSearch && matchContinent;
    });
  }, [search, continent, teamsState]);

  return (
    <PageTransition>
      <div className="p-4 md:p-8">
        <h1 className="font-heading text-3xl tracking-wide text-white md:text-4xl">รายชื่อทีม</h1>
        <p className="mt-1 text-sm text-white/50">{teamsState.length} ประเทศที่ผ่านเข้าร่วมการแข่งขัน</p>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <Input
              placeholder="ค้นหาทีม..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Tabs value={continent} onValueChange={setContinent}>
            <TabsList className="flex-wrap">
              {continents.map((c) => (
                <TabsTrigger key={c} value={c}>
                  {c}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t, i) => (
            <TeamCard key={t.id} team={t} index={i} />
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
