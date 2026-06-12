"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  Trophy,
  Users,
  Radio,
  Newspaper,
  Settings,
  Search,
  LogIn,
  LogOut,
  ShieldAlert,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { href: "/home", label: "หน้าแรก", icon: Home },
  { href: "/matches", label: "ตารางการแข่งขัน", icon: Calendar },
  { href: "/standings", label: "ตารางคะแนน", icon: Trophy },
  { href: "/leaderboard", label: "เกมทายผล & อันดับ", icon: Award },
  { href: "/teams", label: "รายชื่อทีม", icon: Users },
  { href: "/live/m1", label: "ถ่ายทอดสด", icon: Radio },
  { href: "/news", label: "ข่าวสาร", icon: Newspaper },
  { href: "/settings", label: "ตั้งค่า", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, isAdmin, loginWithGoogle, logout, loading } = useAuth();

  if (pathname === "/splash") return null;

  const menuItems = [...navItems];
  if (isAdmin) {
    const settingsIdx = menuItems.findIndex((i) => i.href === "/settings");
    if (settingsIdx !== -1) {
      menuItems.splice(settingsIdx, 0, {
        href: "/admin",
        label: "แผงควบคุมแอดมิน",
        icon: ShieldAlert,
      });
    } else {
      menuItems.push({
        href: "/admin",
        label: "แผงควบคุมแอดมิน",
        icon: ShieldAlert,
      });
    }
  }

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-glass-border bg-navy/95 backdrop-blur-xl md:flex">
      <div className="border-b border-glass-border p-6">
        <Link href="/home">
          <h1 className="font-heading text-2xl tracking-wider text-gold">WORLD CUP</h1>
          <p className="text-xs uppercase tracking-widest text-neon">ศูนย์ข้อมูลสด 2026</p>
        </Link>
      </div>

      <div className="px-4 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <Input placeholder="ค้นหา..." className="pl-9" />
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {menuItems.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/home" && pathname.startsWith(href.replace(/\/m1$/, "")));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-card px-4 py-2.5 text-sm transition-all",
                active
                  ? "bg-neon/10 text-neon border border-neon/20 shadow-neon"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-glass-border p-4">
        {loading ? (
          <div className="h-10 w-full animate-pulse rounded bg-white/5" />
        ) : user ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-white/20">
                <Image
                  src={user.photoURL || "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=80&h=80&fit=crop"}
                  alt={user.displayName || "Avatar"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-xs font-semibold text-white">
                  {user.displayName || "แฟนบอล"}
                </span>
                <span className="text-[10px] text-white/40">
                  {isAdmin ? "ผู้ดูแลระบบ" : "สมาชิก"}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="rounded p-1.5 text-white/40 transition-all hover:bg-red-500/10 hover:text-red-400"
              title="ออกจากระบบ"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={loginWithGoogle}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-neon/30 bg-neon/10 py-2.5 text-xs font-medium text-neon transition-all hover:bg-neon hover:text-navy hover:shadow-[0_0_12px_rgba(34,197,94,0.4)]"
          >
            <LogIn className="h-3.5 w-3.5" />
            เข้าสู่ระบบ
          </button>
        )}
        <p className="mt-4 text-[9px] text-white/20">FIFA World Cup 2026™</p>
      </div>
    </aside>
  );
}
