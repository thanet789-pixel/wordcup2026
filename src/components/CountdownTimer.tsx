"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  targetDate: string;
  className?: string;
}

export function CountdownTimer({ targetDate, className }: CountdownTimerProps) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };
    setTime(calc());
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const units = [
    { label: "วัน", value: time.days },
    { label: "ชั่วโมง", value: time.hours },
    { label: "นาที", value: time.minutes },
    { label: "วินาที", value: time.seconds },
  ];

  return (
    <div className={`flex gap-3 ${className ?? ""}`}>
      {units.map((u) => (
        <motion.div
          key={u.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <span className="font-heading text-3xl md:text-5xl text-neon tabular-nums">
            {String(u.value).padStart(2, "0")}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-white/50">{u.label}</span>
        </motion.div>
      ))}
    </div>
  );
}
