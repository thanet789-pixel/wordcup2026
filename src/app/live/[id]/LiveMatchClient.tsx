"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { ScoreBoard } from "@/components/ScoreBoard";
import { StatBar } from "@/components/StatBar";
import { LiveBadge } from "@/components/LiveBadge";
import { Match, getTeam, fanReactions, CommentaryLine } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { doc, onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function LiveMatchClient({ match: initialMatch }: { match: Match }) {
  const [match, setMatch] = useState<Match>(initialMatch);
  const [commentaryList, setCommentaryList] = useState<CommentaryLine[]>([]);
  const [flash, setFlash] = useState(false);
  const [reactions, setReactions] = useState(fanReactions);

  const home = getTeam(match.homeTeamId)!;
  const away = getTeam(match.awayTeamId)!;
  const stats = match.stats;

  useEffect(() => {
    // 1. Listen to Match score and stats updates
    const matchDocRef = doc(db, "matches", initialMatch.id);
    const unsubMatch = onSnapshot(matchDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setMatch(docSnap.data() as Match);
      }
    });

    // 2. Listen to Match commentary updates (stored as subcollection "commentary" under match document)
    const commentaryColRef = collection(db, "matches", initialMatch.id, "commentary");
    const commentaryQuery = query(commentaryColRef, orderBy("minute", "desc"));
    const unsubCommentary = onSnapshot(commentaryQuery, (querySnap) => {
      const list: CommentaryLine[] = [];
      querySnap.forEach((doc) => {
        list.push(doc.data() as CommentaryLine);
      });
      setCommentaryList(list);
    });

    return () => {
      unsubMatch();
      unsubCommentary();
    };
  }, [initialMatch.id]);

  const triggerGoalFlash = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 600);
  };

  const addReaction = (emoji: string) => {
    setReactions((prev) =>
      prev.map((r) => (r.emoji === emoji ? { ...r, count: r.count + 1 } : r))
    );
  };

  return (
    <PageTransition>
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-50 bg-gold/30"
          />
        )}
      </AnimatePresence>

      <div className="relative min-h-screen">
        <div className="absolute inset-0 stadium-lights" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-10" />

        <div className="relative z-10 p-4 md:p-8">
          <div className="flex items-center justify-between">
            <LiveBadge />
            <div className="flex items-center gap-1 text-sm text-white/50">
              <MapPin className="h-4 w-4" />
              {match.stadium}
            </div>
          </div>

          <div className="mt-8">
            <ScoreBoard match={match} large animate />
          </div>

          <section className="mt-8 glass-card p-4">
            <h3 className="font-heading text-lg text-neon">พากย์การแข่งขันสด</h3>
            <div className="mt-3 max-h-48 space-y-2 overflow-y-auto">
              {commentaryList.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex gap-3 text-sm ${
                    c.type === "goal"
                      ? "font-semibold text-gold"
                      : c.type === "important"
                        ? "text-neon"
                        : "text-white/60"
                  }`}
                >
                  <span className="shrink-0 font-heading text-neon">{c.minute}&apos;</span>
                  <span>{c.text}</span>
                </motion.div>
              ))}
            </div>
          </section>

          {stats && (
            <section className="mt-6 glass-card p-4">
              <h3 className="mb-4 font-heading text-lg text-white">สถิติการเล่นสด</h3>
              <StatBar
                label="การครองบอล"
                homeValue={stats.possession[0]}
                awayValue={stats.possession[1]}
                suffix="%"
                homeLabel={home.name}
                awayLabel={away.name}
              />
              <div className="mt-3 space-y-3">
                <StatBar label="โอกาสยิงทั้งหมด" homeValue={stats.shots[0]} awayValue={stats.shots[1]} />
                <StatBar label="เตะมุม" homeValue={stats.corners[0]} awayValue={stats.corners[1]} />
              </div>
            </section>
          )}

          <section className="mt-6 glass-card p-4">
            <h3 className="font-heading text-lg text-white">ไทม์ไลน์แมตช์</h3>
            <div className="mt-3 space-y-2">
              {match.events?.slice().reverse().map((e) => (
                <div key={e.id} className="flex items-center gap-3 text-sm">
                  <span className="font-heading text-neon">{e.minute}&apos;</span>
                  <span className="text-white">{e.player}</span>
                  <span className="text-white/40">{e.type === "goal" ? "ทำประตู" : e.type === "yellow" ? "ใบเหลือง" : e.type === "red" ? "ใบแดง" : "เปลี่ยนตัว"}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-6 glass-card p-4">
            <h3 className="font-heading text-lg text-white">ปฏิกิริยาแฟนบอล</h3>
            <div className="mt-3 flex flex-wrap gap-3">
              {reactions.map((r) => (
                <Button
                  key={r.emoji}
                  variant="outline"
                  size="sm"
                  onClick={() => addReaction(r.emoji)}
                  className="gap-2"
                >
                  <span className="text-lg">{r.emoji}</span>
                  <span className="text-xs">{r.count.toLocaleString()}</span>
                </Button>
              ))}
            </div>
          </section>

          <div className="mt-6 flex justify-center">
            <Button variant="gold" onClick={triggerGoalFlash}>
              จำลองช็อตทำประตู ⚽
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
