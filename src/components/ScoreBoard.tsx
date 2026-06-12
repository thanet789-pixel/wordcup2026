"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Match, getTeam } from "@/data/mock";
import { LiveBadge } from "./LiveBadge";

interface ScoreBoardProps {
  match: Match;
  large?: boolean;
  animate?: boolean;
}

export function ScoreBoard({ match, large = false, animate = false }: ScoreBoardProps) {
  const home = getTeam(match.homeTeamId)!;
  const away = getTeam(match.awayTeamId)!;

  return (
    <div className={`flex items-center justify-center gap-4 md:gap-8 ${large ? "py-6" : "py-3"}`}>
      <div className="flex flex-1 flex-col items-center gap-2">
        <Image
          src={home.flag}
          alt={home.name}
          width={large ? 64 : 40}
          height={large ? 44 : 28}
          className="rounded-sm object-cover"
        />
        <span className={`font-medium text-white ${large ? "text-lg" : "text-sm"}`}>
          {home.name}
        </span>
      </div>

      <div className="flex flex-col items-center gap-1">
        {match.status?.toLowerCase() === "live" && <LiveBadge />}
        {match.status?.toLowerCase() === "scheduled" ? (
          <div className={large ? "font-heading text-4xl text-white/30" : "font-heading text-2xl text-white/30"}>
            VS
          </div>
        ) : (
          <motion.div
            key={`${match.homeScore}-${match.awayScore}`}
            initial={animate ? { scale: 1.3, color: "#F8C14A" } : false}
            animate={{ scale: 1, color: "#FFFFFF" }}
            transition={{ duration: 0.5 }}
            className={`font-heading tabular-nums text-white ${large ? "text-6xl md:text-8xl" : "text-4xl"}`}
          >
            {match.homeScore ?? 0} - {match.awayScore ?? 0}
          </motion.div>
        )}
        {match.minute && (
          <span className="font-heading text-xl text-neon">{match.minute}&apos;</span>
        )}
      </div>

      <div className="flex flex-1 flex-col items-center gap-2">
        <Image
          src={away.flag}
          alt={away.name}
          width={large ? 64 : 40}
          height={large ? 44 : 28}
          className="rounded-sm object-cover"
        />
        <span className={`font-medium text-white ${large ? "text-lg" : "text-sm"}`}>
          {away.name}
        </span>
      </div>
    </div>
  );
}
