"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Player } from "@/data/mock";

interface PlayerCardProps {
  player: Player;
  index?: number;
}

export function PlayerCard({ player, index = 0 }: PlayerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Link
        href={`/players/${player.id}`}
        className="block rounded-card border border-glass-border bg-glass p-4 backdrop-blur-xl transition-all hover:border-neon/40 hover:shadow-neon"
      >
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-neon/30">
            <Image src={player.image} alt={player.name} fill className="object-cover" />
          </div>
          <div>
            <h3 className="font-medium text-white">{player.name}</h3>
            <p className="text-xs text-white/50">
              {player.position} · #{player.number}
            </p>
            <div className="mt-1 flex gap-3 text-xs">
              <span className="text-neon">{player.goals}G</span>
              <span className="text-gold">{player.assists}A</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
