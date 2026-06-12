"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Team } from "@/data/mock";

interface TeamCardProps {
  team: Team;
  index?: number;
}

export function TeamCard({ team, index = 0 }: TeamCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(248,193,74,0.2)" }}
    >
      <Link
        href={`/teams/${team.id}`}
        className="block rounded-card border border-glass-border bg-glass p-4 backdrop-blur-xl transition-all hover:border-gold/40"
      >
        <div className="flex items-center gap-3">
          <Image
            src={team.flag}
            alt={team.name}
            width={48}
            height={32}
            className="rounded-sm object-cover shadow-md"
          />
          <div className="flex-1">
            <h3 className="font-heading text-lg tracking-wide text-white">{team.name}</h3>
            <p className="text-xs text-white/50">{team.continent}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase text-white/40">FIFA</p>
            <p className="font-heading text-xl text-gold">#{team.ranking}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
