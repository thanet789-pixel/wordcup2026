"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Medal, Crown, Star, Award, Sparkles, Calendar, TrendingUp, HelpCircle, User as UserIcon } from "lucide-react";
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
  correctPredictions?: number;
  totalPredictions?: number;
  favorites?: string[];
  role?: string;
}

const mockLeaderboard: LeaderboardUser[] = [
  { uid: "mock1", name: "สมชาย แสนดี", photoURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop", totalPoints: 45, correctPredictions: 15, totalPredictions: 20, favorites: ["bra"] },
  { uid: "mock2", name: "วิชัย สับหลอก", photoURL: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&h=80&fit=crop", totalPoints: 36, correctPredictions: 12, totalPredictions: 18, favorites: ["ger"] },
  { uid: "mock3", name: "ปิยะพงษ์ ทะยานฟ้า", photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop", totalPoints: 33, correctPredictions: 11, totalPredictions: 15, favorites: ["jpn"] },
  { uid: "mock4", name: "เกียรติศักดิ์ ซิโก้", photoURL: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop", totalPoints: 30, correctPredictions: 10, totalPredictions: 16, favorites: ["esp"] },
  { uid: "mock5", name: "อนันต์ ปากน้ำ", photoURL: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&h=80&fit=crop", totalPoints: 24, correctPredictions: 8, totalPredictions: 12, favorites: ["fra"] },
  { uid: "mock6", name: "ธีรศิลป์ มุ้ยหล่อ", photoURL: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop", totalPoints: 18, correctPredictions: 6, totalPredictions: 10, favorites: ["mex"] },
  { uid: "mock7", name: "ชนาธิป สปีดเก้า", photoURL: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=80&h=80&fit=crop", totalPoints: 15, correctPredictions: 5, totalPredictions: 9, favorites: ["kor"] }
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
        usersList.push({
          uid: doc.id,
          name: data.name || "แฟนบอลไม่มีชื่อ",
          photoURL: data.photoURL || "",
          totalPoints: data.totalPoints || 0,
          correctPredictions: data.correctPredictions || 0,
          totalPredictions: data.totalPredictions || 0,
          favorites: data.favorites || [],
          role: data.role || "user"
        });
      });

      // If no users have points or no users in Firestore yet, fallback to mock users
      if (usersList.length === 0 || usersList.every(u => (u.totalPoints || 0) === 0)) {
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
      setUsers(mockLeaderboard);
      setIsMockData(true);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getUserTier = (points: number) => {
    if (points >= 30) return { name: "เซียนบอลทองคำ", style: "text-gold bg-gold/10 border-gold/30", icon: "🏆" };
    if (points >= 10) return { name: "กูรูลูกหนัง", style: "text-slate-300 bg-slate-300/10 border-slate-300/20", icon: "🥈" };
    return { name: "แฟนบอลทั่วไป", style: "text-white/60 bg-white/5 border-white/10", icon: "🥉" };
  };

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
        return "border-gold/25 bg-gold/5 shadow-[inset_0_0_12px_rgba(218,165,32,0.05)]";
      case 1:
        return "border-slate-300/15 bg-slate-300/5";
      case 2:
        return "border-amber-700/15 bg-amber-700/5";
      default:
        return "border-glass-border hover:bg-white/5";
    }
  };

  const currentUserRankIndex = user ? users.findIndex(u => u.uid === user.uid) : -1;
  const currentUserData = currentUserRankIndex !== -1 ? users[currentUserRankIndex] : null;

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
                <Trophy className="h-3.5 w-3.5" /> ลีกทายผลฟุตบอลโลก 2026
              </span>
              <h1 className="mt-2 font-heading text-3xl tracking-wide text-white md:text-4xl">
                ทำเนียบเซียนบอลยอดนักทาย
              </h1>
              <p className="mt-2 text-sm text-white/60 max-w-xl">
                สะสมคะแนนจากการทายผลแข่งให้ถูกต้อง (ทายถูกรับ 3 คะแนน) ไต่อันดับขึ้นครองตำแหน่งแฟนบอลยอดนักวิเคราะห์แห่งทัวร์นาเมนต์!
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
                  <p className="text-[10px] uppercase tracking-wider text-white/40">สถานะอันดับของคุณ</p>
                  <h3 className="font-heading text-lg text-neon flex items-center gap-1.5">
                    {currentUserRankIndex !== -1 ? (
                      `อันดับที่ ${currentUserRankIndex + 1}`
                    ) : (
                      <span className="text-white/40 text-xs">ยังไม่มีอันดับ</span>
                    )}
                  </h3>
                  <p className="text-xs text-white/80">
                    คะแนนรวม: <span className="font-bold text-gold">{currentUserData?.totalPoints || 0}</span> คะแนน
                  </p>
                  {currentUserData && (
                    <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] border font-semibold ${getUserTier(currentUserData.totalPoints || 0).style}`}>
                      {getUserTier(currentUserData.totalPoints || 0).icon} {getUserTier(currentUserData.totalPoints || 0).name}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Gamification Guide Rules - Highly understandable */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="glass-card p-4 flex gap-3 items-start border-l-4 border-l-neon">
            <Calendar className="h-6 w-6 text-neon shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-white">1. ทายผลก่อนแข่ง</h4>
              <p className="text-xs text-white/60 mt-1">กดจิ้มทายผลแมตช์ว่าใครจะชนะหรือเสมอ ในรายละเอียดแมตช์ได้ตลอดเวลาก่อนคิกออฟ</p>
            </div>
          </div>
          <div className="glass-card p-4 flex gap-3 items-start border-l-4 border-l-gold">
            <TrendingUp className="h-6 w-6 text-gold shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-white">2. รับ 3 คะแนน</h4>
              <p className="text-xs text-white/60 mt-1">หากทายถูกรับทันที 3 คะแนน หากทายผิดหรือไม่ได้ทายผลจะได้ 0 คะแนน ไม่มีหักลบ</p>
            </div>
          </div>
          <div className="glass-card p-4 flex gap-3 items-start border-l-4 border-l-purple-500">
            <Award className="h-6 w-6 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-white">3. เลื่อนยศไต่อันดับ</h4>
              <p className="text-xs text-white/60 mt-1">สะสมแต้มเลื่อนขั้นเป็น &quot;กูรูลูกหนัง&quot; (10 คะแนนขึ้นไป) และ &quot;เซียนบอลทองคำ&quot; (30 คะแนนขึ้นไป)</p>
            </div>
          </div>
        </div>

        {/* Warning Banner for Mock Data */}
        {isMockData && (
          <div className="flex items-center gap-3 rounded-lg border border-gold/20 bg-gold/5 p-4 text-xs text-gold/90 backdrop-blur-md">
            <Sparkles className="h-5 w-5 shrink-0 text-gold animate-pulse" />
            <div>
              <p className="font-bold">✨ ระบบกำลังใช้ฐานข้อมูลจัดอันดับแฟนบอลแบบเรียลไทม์</p>
              <p className="mt-0.5 text-white/60">เนื่องจากทัวร์นาเมนต์จริงยังไม่เริ่มแข่งขัน หรือยังไม่มีผู้เล่นส่งผลทายระบบจึงแสดงรายชื่อนักวิเคราะห์บอทเพื่อทดสอบระบบ แต่บัญชีของคุณพร้อมบันทึกคะแนนจริงทันทีที่คุณส่งผลทาย!</p>
            </div>
          </div>
        )}

        {/* Call to Action if User hasn't predicted yet */}
        {user && (!currentUserData || (currentUserData.totalPredictions || 0) === 0) && (
          <div className="rounded-card border border-neon/30 bg-neon/5 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-lg">
            <div className="text-center sm:text-left">
              <h4 className="font-heading text-lg text-neon">คุณยังไม่ได้ทายผลฟุตบอลโลกเลย!</h4>
              <p className="text-xs text-white/77 mt-1">ร่วมทายผลบอลเพื่อลงทะเบียนเข้าสู่บอร์ดอันดับแฟนบอลและเริ่มเก็บสะสมคะแนนกันเถอะ</p>
            </div>
            <Link href="/matches">
              <button className="rounded-lg bg-neon px-6 py-2.5 text-xs font-bold text-navy transition-all hover:bg-neon-light hover:shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                ⚽ ไปหน้าทายผลแข่งขันทันที
              </button>
            </Link>
          </div>
        )}

        {/* Leaderboard Table Container */}
        <div className="overflow-hidden rounded-card border border-glass-border bg-glass/40 backdrop-blur-xl">
          <div className="px-6 py-4 border-b border-glass-border bg-white/5 flex items-center justify-between">
            <h3 className="font-heading text-md text-white flex items-center gap-2">
              📊 ตารางสรุปอันดับทายผลสด
            </h3>
            <span className="text-[10px] uppercase tracking-wider text-white/40">
              อัปเดตเรียลไทม์ผ่าน Firestore
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-glass-border bg-navy-light/10 text-xs font-semibold uppercase tracking-wider text-white/60">
                  <th className="px-6 py-4 text-center w-20">อันดับ</th>
                  <th className="px-6 py-4">แฟนบอล / ระดับยศ</th>
                  <th className="px-6 py-4 text-center">สถิติทาย (ถูก / ทั้งหมด)</th>
                  <th className="px-6 py-4 text-center">ความแม่นยำ</th>
                  <th className="px-6 py-4 hidden sm:table-cell">ทีมเชียร์</th>
                  <th className="px-6 py-4 text-right pr-8">คะแนนรวม</th>
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
                      <td className="px-6 py-4 text-center">
                        <div className="mx-auto h-4 w-12 rounded bg-white/10" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="mx-auto h-4 w-24 rounded bg-white/10" />
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
                    
                    const totalPreds = item.totalPredictions || 0;
                    const correctPreds = item.correctPredictions || 0;
                    const accuracy = totalPreds > 0 ? Math.round((correctPreds / totalPreds) * 100) : 0;
                    const tier = getUserTier(item.totalPoints || 0);

                    return (
                      <tr
                        key={item.uid}
                        className={`transition-all border-b border-glass-border/10 ${getRankRowStyle(index)} ${
                          isSelf ? "ring-1 ring-neon/40 shadow-[inset_0_0_15px_rgba(34,197,94,0.08)] bg-neon/5 font-semibold" : ""
                        }`}
                      >
                        {/* Rank */}
                        <td className="px-6 py-5 text-center">
                          <div className="flex justify-center items-center">
                            {getRankBadge(index)}
                          </div>
                        </td>

                        {/* Fan Info & Tier */}
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
                                <div className="flex h-full w-full items-center justify-center bg-white/5 text-white/40">
                                  <UserIcon className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-sm text-white ${isSelf ? "text-neon font-bold" : "font-semibold"}`}>
                                  {item.name}
                                </span>
                                {isSelf && (
                                  <span className="rounded bg-neon/25 px-1.5 py-0.5 text-[8px] font-extrabold text-neon uppercase">
                                    คุณ
                                  </span>
                                )}
                              </div>
                              
                              {/* Player Tier Badge */}
                              <div className="mt-1 flex items-center gap-1">
                                <span className="text-[10px] text-white/50">ยศ:</span>
                                <span className={`px-1.5 py-0.2 rounded text-[9px] border font-bold ${tier.style}`}>
                                  {tier.icon} {tier.name}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Stats: Correct / Total */}
                        <td className="px-6 py-5 text-center">
                          <span className="text-xs text-white/80 font-mono">
                            {correctPreds} / {totalPreds} ครั้ง
                          </span>
                        </td>

                        {/* Visual Accuracy Bar */}
                        <td className="px-6 py-5">
                          <div className="mx-auto max-w-[120px] flex flex-col items-center gap-1">
                            <div className="flex justify-between w-full text-[10px] text-white/50 font-mono">
                              <span>ความแม่น</span>
                              <span className="text-emerald-400 font-bold">{accuracy}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/5">
                              <div
                                className="h-full bg-emerald-500 rounded-full transition-all"
                                style={{ width: `${accuracy}%` }}
                              />
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

                        {/* Total Points */}
                        <td className="px-6 py-5 text-right pr-8">
                          <div className="flex flex-col items-end">
                            <span className={`font-heading text-xl ${
                              index === 0 ? "text-gold glow-gold text-2xl" : index === 1 ? "text-slate-300" : index === 2 ? "text-amber-600" : "text-white"
                            }`}>
                              {item.totalPoints || 0}
                            </span>
                            <span className="text-[9px] uppercase tracking-wider text-white/40 font-semibold">คะแนนสะสม</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dynamic FAQ / Info block to clear up confusion */}
        <section className="glass-card p-5 border border-glass-border bg-glass/20 space-y-4">
          <h3 className="font-heading text-lg text-gold flex items-center gap-2 border-b border-glass-border pb-2">
            <HelpCircle className="h-5 w-5" /> คำถามที่พบบ่อย (FAQ)
          </h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <h4 className="font-bold text-xs text-neon">❓ ต้องเสียเงินในการทายผลหรือไม่?</h4>
              <p className="text-xs text-white/70 leading-relaxed">ไม่ต้องเสียเงินใดๆ ทั้งสิ้นครับ! ระบบทายผลสะสมแต้มนี้จัดทำขึ้นเป็นมินิเกมฟรีสำหรับสมาชิกเพื่อเพิ่มความสนุกสนานในการชมการแข่งขันเท่านั้น</p>
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-xs text-neon">❓ คะแนนมาจากไหน และทายได้เมื่อไหร่?</h4>
              <p className="text-xs text-white/70 leading-relaxed">คะแนนมาจากผลทายผลบอลที่ถูกต้อง เมื่อแมตช์เสร็จสิ้น ระบบหลังบ้านจะนำสกอร์จริงมาคิดคะแนน คุณสามารถจิ้มทายผลได้ก่อนเวลาเตะจริงเท่านั้น หากแมตช์เริ่มแล้วระบบจะบล็อกการแก้ไขผลทันที</p>
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-xs text-neon">❓ ทำไมทายถูกแล้วคะแนนยังไม่ขึ้นในบอร์ด?</h4>
              <p className="text-xs text-white/70 leading-relaxed">ตารางคะแนนจัดอันดับจะคำนวณและประมวลผลผ่านระบบ Sync อัตโนมัติทุกๆ 5 นาที คะแนนของผู้ใช้จะถูกเพิ่มหลังจากแมตช์สิ้นสุดและอัปเดตสถานะเป็น Finished (จบเกม) เรียบร้อยแล้ว</p>
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-xs text-neon">❓ แฟนบอลในบอร์ดบางคนมีป้าย &quot;Admin&quot; คืออะไร?</h4>
              <p className="text-xs text-white/70 leading-relaxed">ป้าย Admin คือผู้ดูแลระบบหรือแอดมินพากย์สดที่ลงทะเบียนในระบบ ซึ่งสามารถร่วมสนุกและทายผลได้เช่นเดียวกับแฟนบอลทั่วไป</p>
            </div>
          </div>
        </section>

      </div>
    </PageTransition>
  );
}
