"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, Globe, Moon, Star, RefreshCw, Users, LogIn, LogOut } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { Switch } from "@/components/ui/switch";
import { teams } from "@/data/mock";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [goalAlerts, setGoalAlerts] = useState(true);
  const [language, setLanguage] = useState("th");
  const [favoriteTeam, setFavoriteTeam] = useState("bra");

  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [firebaseStatus, setFirebaseStatus] = useState("กำลังตรวจสอบการเชื่อมต่อ...");

  const { user, isAdmin, favorites, loginWithGoogle, logout, loading } = useAuth();

  useEffect(() => {
    if (!db) {
      setFirebaseStatus("❌ ไม่พบการตั้งค่า Firebase (กรุณาเช็ก Environment Variables บน Vercel หรือดึงค่าผ่าน vercel env pull)");
      return;
    }

    async function checkConnection() {
      try {
        const snap = await getDocs(collection(db, "matches"));
        if (snap.size > 0) {
          setFirebaseStatus("✅ เชื่อมต่อ Firestore สำเร็จ และพบข้อมูลแมตช์!");
        } else {
          setFirebaseStatus("⚠️ เชื่อมต่อ Firestore ได้ แต่ไม่พบข้อมูลใน matches");
        }
      } catch (err: any) {
        setFirebaseStatus(`❌ เชื่อมต่อล้มเหลว: ${err.message}`);
      }
    }
    checkConnection();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    setSyncError(null);
    try {
      const res = await fetch("/api/sync");
      const data = await res.json();
      if (data.success) {
        setSyncResult(data.message);
      } else {
        setSyncError(data.error);
      }
    } catch (err: any) {
      setSyncError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์เพื่อซิงก์ข้อมูลได้");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <PageTransition>
      <div className="p-4 md:p-8">
        <h1 className="font-heading text-3xl tracking-wide text-white md:text-4xl">Settings</h1>
        <p className="mt-1 text-sm text-white/50">Customize your experience</p>

        <div className="mt-8 space-y-6">
          {/* User Profile Section */}
          <section className="glass-card p-4">
            <h2 className="flex items-center gap-2 font-heading text-lg text-white">
              <Users className="h-5 w-5 text-neon" /> โปรไฟล์ผู้ใช้งาน
            </h2>
            <div className="mt-4">
              {loading ? (
                <div className="h-20 w-full animate-pulse rounded bg-white/5" />
              ) : user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 rounded-lg border border-glass-border bg-navy-light/40 p-4">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/20">
                      <Image
                        src={user.photoURL || "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=120&h=120&fit=crop"}
                        alt={user.displayName || "Avatar"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-white">{user.displayName || "แฟนบอล"}</p>
                      <p className="text-xs text-white/50">{user.email || ""}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        <span className="rounded bg-neon/10 px-2 py-0.5 text-[10px] font-medium text-neon">
                          {isAdmin ? "ผู้ดูแลระบบ" : "สมาชิก"}
                        </span>
                        <Link href="/leaderboard" className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-medium text-purple-300 hover:bg-purple-500 hover:text-white transition-all">
                          🏆 ดูอันดับทายผลบอล
                        </Link>
                        {isAdmin && (
                          <Link href="/admin" className="rounded bg-gold/10 px-2 py-0.5 text-[10px] font-medium text-gold hover:bg-gold hover:text-navy transition-all">
                            ไปที่หน้าแอดมิน
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Favorite Teams */}
                  <div>
                    <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider">ทีมชาติที่คุณกดติดตาม ⭐</h3>
                    {favorites.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {favorites.map((favId) => {
                          const t = teams.find((team) => team.id === favId);
                          if (!t) return null;
                          return (
                            <div key={favId} className="flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs text-gold">
                              <span className="text-base">{t.flag}</span>
                              <span>{t.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="mt-2 text-xs text-white/40">ยังไม่ได้กดติดตามทีมชาติใดๆ สามารถไปกดติดตามได้ที่หน้า &quot;รายชื่อทีม&quot;</p>
                    )}
                  </div>

                  <button
                    onClick={logout}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 py-2.5 text-sm font-semibold text-red-400 transition-all hover:bg-red-500 hover:text-white"
                  >
                    <LogOut className="h-4 w-4" /> ออกจากระบบ
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-white/60 mb-4">เข้าสู่ระบบเพื่อกดติดตามข่าวสารแมตช์ของทีมโปรด และร่วมทายผลชิงรางวัล</p>
                  <button
                    onClick={loginWithGoogle}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-neon/30 bg-neon/10 py-3 text-sm font-semibold text-neon transition-all hover:bg-neon hover:text-navy hover:shadow-[0_0_12px_rgba(34,197,94,0.4)]"
                  >
                    <LogIn className="h-4 w-4" /> เข้าสู่ระบบด้วย Google
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Data Synchronization */}
          <section className="glass-card p-4">
            <h2 className="flex items-center gap-2 font-heading text-lg text-white">
              <RefreshCw className={`h-5 w-5 text-neon ${syncing ? "animate-spin" : ""}`} /> Data Synchronization
            </h2>
            <div className="mt-4 space-y-3">
              <div className="rounded border border-glass-border bg-navy-light/40 p-3">
                <p className="text-xs font-semibold text-white/70">สถานะการเชื่อมต่อฐานข้อมูล:</p>
                <p className="mt-1.5 text-xs font-medium text-white/90">{firebaseStatus}</p>
              </div>
              <p className="text-xs text-white/50">
                เชื่อมต่อและอัปเดตข้อมูลตารางแข่ง ผลบอล และตารางคะแนนจาก football-data.org มายังฐานข้อมูล Firestore ของคุณโดยตรง
              </p>
              <button
                disabled={syncing}
                onClick={handleSync}
                className="w-full rounded-card bg-neon px-4 py-2.5 text-sm font-semibold text-black transition-all hover:bg-neon-light focus:outline-none focus:ring-2 focus:ring-neon disabled:opacity-50"
              >
                {syncing ? "กำลังซิงก์ข้อมูล..." : "ซิงก์ข้อมูลฟุตบอลโลก"}
              </button>
              {syncResult && (
                <p className="text-xs text-emerald-400 font-medium bg-emerald-950/20 border border-emerald-900/30 p-2 rounded">
                  ✅ {syncResult}
                </p>
              )}
              {syncError && (
                <p className="text-xs text-rose-400 font-medium bg-rose-950/20 border border-rose-900/30 p-2 rounded">
                  ❌ {syncError}
                </p>
              )}
            </div>
          </section>

          {/* Appearance */}
          <section className="glass-card p-4">
            <h2 className="flex items-center gap-2 font-heading text-lg text-white">
              <Moon className="h-5 w-5 text-neon" /> Appearance
            </h2>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Dark Mode</p>
                <p className="text-xs text-white/40">Cinematic dark theme</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
          </section>

          {/* Notifications */}
          <section className="glass-card p-4">
            <h2 className="flex items-center gap-2 font-heading text-lg text-white">
              <Bell className="h-5 w-5 text-gold" /> Notifications
            </h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">Push Notifications</p>
                  <p className="text-xs text-white/40">Match start & final score alerts</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">Goal Alerts</p>
                  <p className="text-xs text-white/40">Instant goal notifications</p>
                </div>
                <Switch checked={goalAlerts} onCheckedChange={setGoalAlerts} />
              </div>
            </div>
          </section>

          {/* Language */}
          <section className="glass-card p-4">
            <h2 className="flex items-center gap-2 font-heading text-lg text-white">
              <Globe className="h-5 w-5 text-neon" /> Language
            </h2>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-4 w-full rounded-card border border-glass-border bg-navy-light px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-neon"
            >
              <option value="en">English</option>
              <option value="th">ไทย (Thai)</option>
              <option value="es">Español</option>
              <option value="pt">Português</option>
              <option value="fr">Français</option>
            </select>
          </section>

          {/* Favorite Team */}
          <section className="glass-card p-4">
            <h2 className="flex items-center gap-2 font-heading text-lg text-white">
              <Star className="h-5 w-5 text-gold" /> Favorite Team
            </h2>
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
              {teams.slice(0, 12).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setFavoriteTeam(t.id)}
                  className={`flex flex-col items-center gap-1 rounded-card border p-2 transition-all ${
                    favoriteTeam === t.id
                      ? "border-gold bg-gold/10 shadow-gold"
                      : "border-glass-border hover:border-neon/30"
                  }`}
                >
                  <Image src={t.flag} alt={t.name} width={32} height={22} className="rounded-sm" />
                  <span className="text-[10px] text-white/60">{t.code}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
