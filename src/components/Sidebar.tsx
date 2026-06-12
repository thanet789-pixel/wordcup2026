"use client";

import Link from "next/link";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";

const navItems = [
  { href: "/home", label: "หน้าแรก", icon: Home },
  { href: "/matches", label: "ตารางการแข่งขัน", icon: Calendar },
  { href: "/standings", label: "ตารางคะแนน", icon: Trophy },
  { href: "/teams", label: "รายชื่อทีม", icon: Users },
  { href: "/live/m1", label: "ถ่ายทอดสด", icon: Radio },
  { href: "/news", label: "ข่าวสาร", icon: Newspaper },
  { href: "/settings", label: "ตั้งค่า", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  if (pathname === "/splash") return null;

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
        {navItems.map(({ href, label, icon: Icon }) => {
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

      <div className="border-t border-glass-border p-4">
        <p className="text-[10px] text-white/30">FIFA World Cup 2026™</p>
      </div>
    </aside>
  );
}
