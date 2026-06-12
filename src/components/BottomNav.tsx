"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Trophy, Users, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/home", label: "หน้าแรก", icon: Home },
  { href: "/matches", label: "ตารางแข่ง", icon: Calendar },
  { href: "/standings", label: "ตารางคะแนน", icon: Trophy },
  { href: "/teams", label: "ทีม", icon: Users },
  { href: "/live/m1", label: "พากย์สด", icon: Radio },
];

export function BottomNav() {
  const pathname = usePathname();

  if (pathname === "/splash") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-glass-border bg-navy/90 backdrop-blur-xl md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href === "/home" && pathname === "/home") ||
            (href !== "/home" && pathname.startsWith(href.split("/")[1] === "live" ? "/live" : href));
          const isLive = label === "พากย์สด";
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] transition-all",
                active ? "text-neon" : "text-white/40 hover:text-white/70",
                isLive && active && "text-live"
              )}
            >
              <Icon className={cn("h-5 w-5", isLive && active && "animate-pulse")} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
