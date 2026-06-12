"use client";

import { cn } from "@/lib/utils";

interface StatBarProps {
  label: string;
  homeValue: number;
  awayValue: number;
  homeLabel?: string;
  awayLabel?: string;
  suffix?: string;
}

export function StatBar({
  label,
  homeValue,
  awayValue,
  homeLabel,
  awayLabel,
  suffix = "",
}: StatBarProps) {
  const total = homeValue + awayValue || 1;
  const homePct = (homeValue / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-neon">
          {homeValue}
          {suffix}
        </span>
        <span className="text-white/60">{label}</span>
        <span className="font-semibold text-gold">
          {awayValue}
          {suffix}
        </span>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-neon to-neon/60 transition-all duration-700"
          style={{ width: `${homePct}%` }}
        />
        <div
          className="absolute right-0 top-0 h-full rounded-full bg-gradient-to-l from-gold to-gold/60 transition-all duration-700"
          style={{ width: `${100 - homePct}%` }}
        />
      </div>
      {(homeLabel || awayLabel) && (
        <div className="flex justify-between text-[10px] text-white/40">
          <span>{homeLabel}</span>
          <span>{awayLabel}</span>
        </div>
      )}
    </div>
  );
}

interface MomentumGraphProps {
  data: number[];
  className?: string;
}

export function MomentumGraph({ data, className }: MomentumGraphProps) {
  const max = Math.max(...data.map(Math.abs), 1);
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 50 - (v / max) * 40;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className={cn("rounded-card border border-glass-border bg-glass p-4", className)}>
      <p className="mb-3 text-xs uppercase tracking-widest text-white/50">โมเมนตัมการบุก</p>
      <svg viewBox="0 0 100 100" className="h-24 w-full" preserveAspectRatio="none">
        <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <polyline
          fill="none"
          stroke="url(#momentumGrad)"
          strokeWidth="1.5"
          points={points}
        />
        <defs>
          <linearGradient id="momentumGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00D4FF" />
            <stop offset="100%" stopColor="#F8C14A" />
          </linearGradient>
        </defs>
      </svg>
      <div className="mt-2 flex justify-between text-[10px] text-white/40">
        <span>ทีมเหย้า</span>
        <span>90&apos;</span>
        <span>ทีมเยือน</span>
      </div>
    </div>
  );
}
