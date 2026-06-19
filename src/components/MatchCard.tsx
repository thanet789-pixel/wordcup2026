"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Bell, MapPin } from "lucide-react";
import { Match, getTeam } from "@/data/mock";
import { formatMatchDateTime, getMatchStatusLabel } from "@/lib/utils";
import { LiveBadge } from "./LiveBadge";

interface MatchCardProps {
  match: Match;
  index?: number;
}

export function MatchCard({ match, index = 0 }: MatchCardProps) {
  const home = getTeam(match.homeTeamId) || { id: match.homeTeamId, name: match.homeTeamId.toUpperCase(), flag: "https://flagcdn.com/w320/un.png" };
  const away = getTeam(match.awayTeamId) || { id: match.awayTeamId, name: match.awayTeamId.toUpperCase(), flag: "https://flagcdn.com/w320/un.png" };
  const href = match.status?.toLowerCase() === "live" ? `/live/${match.id}` : `/matches/${match.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, boxShadow: "0 0 25px rgba(0,212,255,0.25)" }}
    >
      <Link
        href={href}
        className="block rounded-card border border-glass-border bg-glass p-4 backdrop-blur-xl transition-all hover:border-neon/40"
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs text-white/50">{match.group}</span>
          {match.status?.toLowerCase() === "live" ? (
            <LiveBadge size="sm" />
          ) : (
            <span className="text-xs font-medium text-white/60">
              {match.status?.toLowerCase() === "scheduled"
                ? formatMatchDateTime(match.date)
                : getMatchStatusLabel(match.status)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-1 flex-col items-center gap-2">
            <Image src={home.flag} alt={home.name} width={40} height={28} className="rounded-sm object-cover" />
            <span className="text-center text-sm font-medium text-white">{home.name}</span>
          </div>

          <div className="flex flex-col items-center px-2">
            {match.homeScore !== null ? (
              <span className="font-heading text-3xl text-white">
                {match.homeScore} - {match.awayScore}
              </span>
            ) : (
              <span className="font-heading text-xl text-white/40">VS</span>
            )}
            {match.minute && (
              <span className="text-xs font-semibold text-live">{match.minute}&apos;</span>
            )}
          </div>

          <div className="flex flex-1 flex-col items-center gap-2">
            <Image src={away.flag} alt={away.name} width={40} height={28} className="rounded-sm object-cover" />
            <span className="text-center text-sm font-medium text-white">{away.name}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3 text-xs text-white/40">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {match.stadium}
          </div>
          <Bell className="h-3.5 w-3.5 hover:text-neon" />
        </div>
      </Link>
    </motion.div>
  );
}
