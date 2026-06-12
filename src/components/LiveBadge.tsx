"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LiveBadgeProps {
  className?: string;
  size?: "sm" | "md";
}

export function LiveBadge({ className, size = "md" }: LiveBadgeProps) {
  return (
    <motion.span
      animate={{ opacity: [1, 0.4, 1] }}
      transition={{ duration: 1.0, repeat: Infinity, ease: "easeInOut" }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-card bg-red-600 font-extrabold uppercase text-white border border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]",
        size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3.5 py-1 text-sm tracking-wider",
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
      </span>
      <span>สด</span>
    </motion.span>
  );
}
