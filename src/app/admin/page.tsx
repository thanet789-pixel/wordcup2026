"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { PageTransition } from "@/components/PageTransition";
import NewsManager from "./NewsManager";
import CommentaryConsole from "./CommentaryConsole";
import { Radio, Newspaper, ShieldAlert, LogIn, Key, Sparkles } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminPage() {
  const { user, isAdmin, loading, loginWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState<"commentary" | "news">("commentary");
  const [granting, setGranting] = useState(false);

  // Simulates/Writes Admin permission to active user document in Firestore
  const handleGrantAdmin = async () => {
    if (!user || !db) return;
    setGranting(true);

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { role: "admin" });
      alert("🎉 เปิดสิทธิ์ Admin สำเร็จ! ข้อมูลสิทธิ์ได้อัปเดตใน Firestore เรียบร้อยแล้ว ระบบจะทำการอัปเดตหน้าอัตโนมัติ");
      // The real-time snapshot in AuthContext will automatically trigger, but reloading ensures fresh states
      window.location.reload();
    } catch (err: any) {
      alert(`ไม่สามารถปรับปรุงสิทธิ์ได้: ${err.message}`);
    } finally {
      setGranting(false);
    }
  };

  // 1. Session Loading State
  if (loading) {
    return (
      <PageTransition>
        <div className="flex min-h-[70vh] flex-col items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-neon border-t-transparent" />
          <p className="mt-4 text-sm text-white/50 animate-pulse">กำลังตรวจสอบสิทธิ์การเข้าถึง...</p>
        </div>
      </PageTransition>
    );
  }

  // 2. Access Denied State (Not logged in or not admin)
  if (!user || !isAdmin) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-md p-4 mt-10 md:mt-20">
          <div className="rounded-card border border-red-500/25 bg-red-500/5 p-6 text-center backdrop-blur-xl space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <ShieldAlert className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h2 className="font-heading text-2xl text-white">⛔ ขออภัย สิทธิ์เข้าถึงไม่ถูกต้อง</h2>
              <p className="text-sm text-white/60 leading-relaxed">
                หน้านี้สงวนลิขสิทธิ์ไว้เฉพาะผู้ดูแลระบบ (Admin) เท่านั้น บัญชีของคุณในระบบไม่มีสิทธิ์เข้าถึงส่วนนี้
              </p>
            </div>

            {!user ? (
              <div className="pt-2">
                <p className="text-xs text-white/40 mb-3">กรุณาเข้าสู่ระบบด้วยบัญชีแอดมินก่อนดำเนินการ</p>
                <button
                  onClick={loginWithGoogle}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-neon/30 bg-neon/10 py-3 text-sm font-semibold text-neon transition-all hover:bg-neon hover:text-navy hover:shadow-[0_0_12px_rgba(34,197,94,0.4)]"
                >
                  <LogIn className="h-4 w-4" /> เข้าสู่ระบบด้วย Google
                </button>
              </div>
            ) : (
              <div className="border-t border-glass-border pt-4 space-y-3">
                <div className="flex gap-2 items-start text-left bg-gold/5 border border-gold/20 rounded-lg p-3 text-xs text-gold">
                  <Sparkles className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>
                    <strong>สำหรับผู้ทดสอบระบบ:</strong> คุณล็อกอินแล้ว แต่ยังไม่มีสิทธิ์ในระบบ คุณสามารถคลิกปุ่มด้านล่างเพื่อเขียนสิทธิ์แอดมินลงใน Firestore ของคุณได้ทันที
                  </p>
                </div>
                <button
                  disabled={granting}
                  onClick={handleGrantAdmin}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-gold/30 bg-gold/15 py-3 text-sm font-bold text-gold transition-all hover:bg-gold hover:text-navy hover:shadow-[0_0_12px_rgba(218,165,32,0.4)] disabled:opacity-50"
                >
                  <Key className="h-4 w-4" /> 
                  {granting ? "กำลังบันทึกสิทธิ์..." : "🔓 จำลองสิทธิ์แอดมินลง Firestore ของฉัน"}
                </button>
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    );
  }

  // 3. Admin Main View
  return (
    <PageTransition>
      <div className="space-y-6 p-4 md:p-8 pb-24 md:pb-8">
        
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-card border border-glass-border bg-glass/60 p-6 backdrop-blur-xl">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-neon/10 blur-3xl" />
          <div className="absolute left-0 bottom-0 -ml-16 -mb-16 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1 rounded-full bg-neon/10 px-3 py-1 text-xs font-semibold text-neon border border-neon/30">
              ⚙️ แผงควบคุมระบบ (Admin Panel)
            </span>
            <h1 className="mt-2 font-heading text-3xl tracking-wide text-white md:text-4xl">
              ระบบจัดการหลังบ้านแอดมิน
            </h1>
            <p className="mt-2 text-sm text-white/60">
              ควบคุมถ่ายทอดสด พิมพ์รายงานพากย์บอลนาทีต่อนาที อัปเดตสถิติ และแก้ไขบทความข่าวสารแบบเรียลไทม์
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-glass-border">
          <button
            onClick={() => setActiveTab("commentary")}
            className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold transition-all border-b-2 ${
              activeTab === "commentary"
                ? "border-neon text-neon bg-neon/5"
                : "border-transparent text-white/50 hover:text-white/80 hover:bg-white/5"
            }`}
          >
            <Radio className="h-4 w-4" /> พากย์การแข่งขันสด (Live Commentary)
          </button>
          
          <button
            onClick={() => setActiveTab("news")}
            className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold transition-all border-b-2 ${
              activeTab === "news"
                ? "border-neon text-neon bg-neon/5"
                : "border-transparent text-white/50 hover:text-white/80 hover:bg-white/5"
            }`}
          >
            <Newspaper className="h-4 w-4" /> จัดการบทความข่าวสาร (News Articles)
          </button>
        </div>

        {/* Active Tab View */}
        <div className="mt-4">
          {activeTab === "commentary" ? <CommentaryConsole /> : <NewsManager />}
        </div>

      </div>
    </PageTransition>
  );
}
