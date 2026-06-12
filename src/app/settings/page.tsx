"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Bell, Globe, Moon, Star, RefreshCw } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { Switch } from "@/components/ui/switch";
import { teams } from "@/data/mock";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [goalAlerts, setGoalAlerts] = useState(true);
  const [language, setLanguage] = useState("en");
  const [favoriteTeam, setFavoriteTeam] = useState("bra");

  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [firebaseStatus, setFirebaseStatus] = useState("กำลังตรวจสอบการเชื่อมต่อ...");

  useEffect(() => {
    const hasKeys = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!hasKeys) {
      setFirebaseStatus("❌ ไม่พบ Firebase API Key (กรุณาเช็ก Environment Variables บน Vercel)");
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
