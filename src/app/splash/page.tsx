"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

export default function SplashPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => router.push("/home"), 400);
          return 100;
        }
        return p + 2;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-navy">
      {/* Stadium atmosphere */}
      <div className="absolute inset-0 stadium-lights" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-20" />

      {/* Particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-gold/40"
          initial={{
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 400),
            y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
            opacity: 0,
          }}
          animate={{
            y: [null, -100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Trophy className="mb-6 h-20 w-20 text-gold drop-shadow-gold" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-heading text-5xl tracking-[0.2em] text-gradient-gold md:text-7xl"
        >
          WORLD CUP 2026
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-3 text-sm uppercase tracking-[0.4em] text-white/60 md:text-base"
        >
          ศูนย์ข้อมูลสด
        </motion.p>
      </motion.div>

      {/* Progress bar */}
      <div className="absolute bottom-16 left-1/2 z-10 w-64 -translate-x-1/2 md:w-96">
        <div className="h-1 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-neon to-gold"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-center text-xs text-white/40">กำลังโหลดประสบการณ์ฟุตบอลโลก...</p>
      </div>
    </div>
  );
}
