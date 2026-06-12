"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Medal, Crown, Star, Award, ShieldAlert, Sparkles, User as UserIcon } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { getTeam } from "@/data/mock";

interface LeaderboardUser {
  uid: string;
  name: string;
  photoURL: string;
  totalPoints?: number;
  favorites?: string[];
  role?: string;
}

const mockLeaderboard: LeaderboardUser[] = [
  { uid: "mock1", name: "สมชาย สายลุย (AI แฟนบอล)", photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop", totalPoints: 45, favorites: ["bra"] },
  { uid: "mock2", name: "วิชัย สับหลอก (AI แฟนบอล)", photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop", totalPoints: 39, favorites: ["ger"] },
  { uid: "mock3", name: "ปิยะพงษ์ ทะยานฟ้า (AI แฟนบอล)", photoURL: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop", totalPoints: 36, favorites: ["jpn"] },
  { uid: "mock4", name: "เกียรติศักดิ์ ตีลังกา (AI แฟนบอล)", photoURL: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop", totalPoints: 30, favorites: ["esp"] },
  { uid: "mock5", name: "อนันต์ ลูกหนัง (AI แฟนบอล)", photoURL: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop", totalPoints: 27, favorites: ["fra"] },
  { uid: "mock6", name: "ธีรศิลป์ มุ้ยหล่อ (AI แฟนบอล)", photoURL: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&h=80&fit=crop", totalPoints: 24, favorites: ["mex"] },
  { uid: "mock7", name: "ชนาธิป เจแปน (AI แฟนบอล)", photoURL: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop", totalPoints: 18, favorites: ["kor"] }
];

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMockData, setIsMockData] = useState(false);

  useEffect(() => {
    if (!db) {
      console.warn("Firebase Firestore is not initialized. Using mock leaderboard data.");
      setUsers(mockLeaderboard);
      setIsMockData(true);
      setLoading(false);
      return;
    }

    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("totalPoints", "desc"), limit(50));

    const unsubscribe = onSnapshot(q, (snap) => {
      const usersList: LeaderboardUser[] = [];
      snap.forEach((doc) => {
        const data = doc.data();
        // Only show users with totalPoints defined or if they have points > 0
        // To keep the leaderboard clean, we include them if they have points, or default to 0
        usersList.push({
          uid: doc.id,
          name: data.name || "แฟนบอลไม่มีชื่อ",
          photoURL: data.photoURL || "",
          totalPoints: data.totalPoints || 0,
          favorites: data.favorites || [],
          role: data.role || "user"
        });
      });

      // If no users have points or no users in Firestore yet, fallback to mock users + registered users
      if (usersList.length === 0 || usersList.every(u => (u.totalPoints || 0) === 0)) {
        // We will combine actual users with mock users to make it look full and lively
        const mergedList = [...usersList];
        
        mockLeaderboard.forEach(mu => {
          if (!mergedList.some(u => u.uid === mu.uid)) {
            mergedList.push(mu);
          }
        });
        
        mergedList.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
        setUsers(mergedList);
        setIsMockData(true);
      } else {
        setUsers(usersList);
        setIsMockData(false);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error listening to leaderboard:", error);
      // Fallback on error
      setUsers(mockLeaderboard);
      setIsMockData(true);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/20 text-gold border border-gold/30 shadow-[0_0_8px_rgba(218,165,32,0.4)]">
            <Crown className="h-4.5 w-4.5 animate-bounce" style={{ animationDuration: "3s" }} />
          </div>
        );
      case 1:
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-300/20 text-slate-300 border border-slate-300/30">
            <Medal className="h-4.5 w-4.5" />
          </div>
        );
      case 2:
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-700/20 text-amber-600 border border-amber-700/30">
            <Medal className="h-4.5 w-4.5" />
          </div>
        );
      default:
        return (
          <span className="text-sm font-semibold text-white/50 w-8 text-center">
            {index + 1}
          </span>
        );
    }
  };

  const getRankRowStyle = (index: number) => {
    switch (index) {
      case 0:
        return "border-gold/30 bg-gold/5 shadow-[inset_0_0_12px_rgba(218,165,32,0.05)]";
      case 1:
        return "border-slate-300/20 bg-slate-300/5";
      case 2:
        return "border-amber-700/20 bg-amber-700/5";
      default:
        return "border-glass-border hover:bg-white/5";
    }
  };

  // Find current user's rank in the list
  const currentUserRankIndex = user ? users.findIndex(u => u.uid === user.uid) : -1;
  const currentUserRank = currentUserRankIndex !== -1 ? users[currentUserRankIndex] : null;

  return (
    <PageTransition>
      <div className="space-y-6 p-4 md:p-8 pb-24 md:pb-8">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-card border border-glass-border bg-glass/60 p-6 backdrop-blur-xl">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-neon/10 blur-3xl" />
          <div className="absolute left-0 bottom-0 -ml-16 -mb-16 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold border border-gold/30">
                <Trophy className="h-3.5 w-3.5" /> ลีกทายผลบอลโลก 2026
              </span>
              <h1 className="mt-2 font-heading text-3xl tracking-wide text-white md:text-4xl">
                ทำเนียบแฟนบอลยอดนักทาย
              </h1>
              <p className="mt-2 text-sm text-white/60">
                ทายผลแมตช์การแข่งขันสะสมคะแนนไต่อันดับกระดานผู้นำ ทายถูกรับแมตช์ละ 3 คะแนน!
              </p>
            </div>

            {/* User Personal Rank Stats Widget */}
            {user && (
              <div className="flex items-center gap-4 rounded-xl border border-glass-border bg-navy-light/10 p-4 backdrop-blur-md shrink-0">
                <div className="relative h-12 w-12 overflow-hidden rounded-full border border-neon/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                  {user.photoURL ? (
                    <Image src={user.photoURL} alt={user.displayName || "Avatar"} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-white/5 text-white/40">
                      <UserIcon className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/40">อันดับของคุณ</p>
                  <h3 className="font-heading text-xl text-neon flex items-center gap-1.5">
                    {currentUserRankIndex !== -1 ? (
                      `อันดับที่ ${currentUserRankIndex + 1}`
                    ) : (
                      <span className="text-white/40 text-sm">ยังไม่มีอันดับ</span>
                    )}
                  </h3>
                  <p className="text-xs text-white/60">
                    คะแนนรวม: <span className="font-bold text-gold">{currentUserRank?.totalPoints || 0}</span> คะแนน
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Warning Banner for Mock Data */}
        {isMockData && (
          <div className="flex items-center gap-3 rounded-lg border border-gold/20 bg-gold/5 p-4 text-xs text-gold/90 backdrop-blur-md">
            <Sparkles className="h-5 w-5 shrink-0 text-gold animate-pulse" />
            <div>
              <p className="font-bold">✨ กำลังแสดงกระดานผู้นำจำลอง</p>
              <p className="mt-0.5 text-white/60">ระบบใช้ข้อมูลจำลองร่วมกับบัญชีจริงของคุณ เนื่องจากยังไม่มีการจัดอันดับ หรือยังไม่ได้เชื่อมต่อระบบฐานข้อมูลหลัก</p>
            </div>
          </div>
        )}

        {/* Leaderboard Table Container */}
        <div className="overflow-hidden rounded-card border border-glass-border bg-glass/40 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-glass-border bg-white/5 text-xs font-semibold uppercase tracking-wider text-white/60">
                  <th className="px-6 py-4 text-center w-20">อันดับ</th>
                  <th className="px-6 py-4">แฟนบอล</th>
                  <th className="px-6 py-4 hidden sm:table-cell">ทีมโปรด</th>
                  <th className="px-6 py-4 text-right pr-8">คะแนนทายผล</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border/30">
                {loading ? (
                  // Skeleton Loading Rows
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4 text-center">
                        <div className="mx-auto h-6 w-6 rounded bg-white/10" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-white/10" />
                          <div className="space-y-2">
                            <div className="h-4 w-32 rounded bg-white/10" />
                            <div className="h-3 w-20 rounded bg-white/10" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <div className="h-6 w-16 rounded bg-white/10" />
                      </td>
                      <td className="px-6 py-4 text-right pr-8">
                        <div className="ml-auto h-6 w-12 rounded bg-white/10" />
                      </td>
                    </tr>
                  ))
                ) : (
                  users.map((item, index) => {
                    const isSelf = user && item.uid === user.uid;
                    const favoriteTeamId = item.favorites && item.favorites.length > 0 ? item.favorites[0] : null;
                    const favTeam = favoriteTeamId ? getTeam(favoriteTeamId) : null;

                    return (
                      <tr
                        key={item.uid}
                        className={`transition-all border-b border-glass-border/10 ${getRankRowStyle(index)} ${
                          isSelf ? "ring-1 ring-neon/40 shadow-[inset_0_0_15px_rgba(34,197,94,0.08)] bg-neon/5" : ""
                        }`}
                      >
                        {/* Rank */}
                        <td className="px-6 py-5 text-center">
                          <div className="flex justify-center items-center">
                            {getRankBadge(index)}
                          </div>
                        </td>

                        {/* Fan Info */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10">
                              {item.photoURL ? (
                                <Image
                                  src={item.photoURL}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-white/5 text-white/30">
                                  <UserIcon className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className={`text-sm font-semibold text-white ${isSelf ? "text-neon font-bold" : ""}`}>
                                  {item.name}
                                </span>
                                {isSelf && (
                                  <span className="rounded bg-neon/20 px-1.5 py-0.5 text-[9px] font-bold text-neon uppercase">
                                    คุณ
                                  </span>
                                )}
                                {item.role === "admin" && (
                                  <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[9px] font-bold text-red-400 uppercase">
                                    Admin
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-white/40 block sm:hidden">
                                {favTeam ? `ทีมโปรด: ${favTeam.name}` : "ไม่มีทีมโปรด"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Favorite Team (Desktop only) */}
                        <td className="px-6 py-5 hidden sm:table-cell">
                          {favTeam ? (
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{favTeam.flag}</span>
                              <span className="text-xs text-white/80">{favTeam.name}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-white/30">-</span>
                          )}
                        </td>

                        {/* Score */}
                        <td className="px-6 py-5 text-right pr-8">
                          <span className={`font-heading text-lg ${
                            index === 0 ? "text-gold glow-gold" : index === 1 ? "text-slate-300" : index === 2 ? "text-amber-600" : "text-white"
                          }`}>
                            {item.totalPoints || 0}
                          </span>
                          <span className="text-[10px] text-white/40 ml-1">คะแนน</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* How to play information */}
        <section className="glass-card p-5 border border-glass-border bg-glass/20">
          <h3 className="font-heading text-lg text-gold flex items-center gap-2 mb-3">
            📖 กติกาและวิธีกระสมคะแนน
          </h3>
          <ul className="space-y-2.5 text-xs text-white/70">
            <li className="flex items-start gap-2">
              <span className="text-neon mt-0.5">▪</span>
              <span><strong>ร่วมสนุกฟรี:</strong> เพียงเข้าสู่ระบบผ่านบัญชี Google ก็ร่วมทายผลบอลได้ทันที</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neon mt-0.5">▪</span>
              <span><strong>การคิดคะแนน:</strong> ทายถูกรับทันที <strong className="text-gold">3 คะแนน</strong> ต่อแมตช์ ทายผิดหรือไม่ได้ส่งทายผลได้ 0 คะแนน</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neon mt-0.5">▪</span>
              <span><strong>เงื่อนไขการส่ง:</strong> สามารถส่งและแก้ไขผลการทายได้ตลอดเวลาก่อนแมตช์เริ่มแข่งขันเท่านั้น เมื่อแมตช์เริ่มแข่ง (สถานะ LIVE หรือ FINISHED) จะล็อคผลทันที</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neon mt-0.5">▪</span>
              <span><strong>การแสดงผล:</strong> ตารางอันดับจะอัปเดตทุกๆ 5 นาที หลังจากมีผลการแข่งขันสิ้นสุด</span>
            </li>
          </ul>
        </section>
      </div>
    </PageTransition>
  );
}
