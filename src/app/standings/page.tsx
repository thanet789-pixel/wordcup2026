"use client";

import { useState, useEffect } from "react";
import { PageTransition } from "@/components/PageTransition";
import { GroupTable } from "@/components/GroupTable";
import { standings, StandingRow } from "@/data/mock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function StandingsPage() {
  const [standingsState, setStandingsState] = useState<Record<string, StandingRow[]>>(standings);

  useEffect(() => {
    if (!db) {
      console.warn("Firebase Firestore is not initialized. Please configure environment variables.");
      return;
    }
    async function fetchStandings() {
      try {
        const snap = await getDocs(collection(db, "standings"));
        const map: Record<string, StandingRow[]> = {};
        snap.forEach((doc) => {
          map[doc.id] = doc.data().rows as StandingRow[];
        });
        if (Object.keys(map).length > 0) {
          setStandingsState(map);
        }
      } catch (err) {
        console.error("Error fetching standings from Firestore:", err);
      }
    }
    fetchStandings();
  }, []);

  const groups = Object.keys(standingsState);

  return (
    <PageTransition>
      <div className="p-4 md:p-8">
        <h1 className="font-heading text-3xl tracking-wide text-white md:text-4xl">ตารางคะแนน</h1>
        <p className="mt-1 text-sm text-white/50">รอบแบ่งกลุ่ม & รอบน็อคเอาท์</p>

        <Tabs defaultValue="group" className="mt-6">
          <TabsList>
            <TabsTrigger value="group">รอบแบ่งกลุ่ม</TabsTrigger>
            <TabsTrigger value="knockout">รอบน็อคเอาท์</TabsTrigger>
          </TabsList>

          <TabsContent value="group">
            <div className="mt-6 space-y-6">
              {groups.map((g) => (
                <GroupTable key={g} group={g} rows={standingsState[g]} />
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-4 text-xs text-white/40">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-green-500" /> ผ่านเข้ารอบ
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-yellow-500" /> เพลย์ออฟ
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-red-500" /> ตกรอบ
              </span>
            </div>
          </TabsContent>

          <TabsContent value="knockout">
            <div className="mt-6 glass-card p-8 text-center">
              <p className="font-heading text-2xl text-gold">รอบน็อคเอาท์</p>
              <p className="mt-2 text-sm text-white/50">ตารางประกบคู่สายการแข่งขันจะปรากฏหลังจากเสร็จสิ้นรอบแบ่งกลุ่ม</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}
