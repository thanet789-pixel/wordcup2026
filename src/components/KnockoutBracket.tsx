"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Match, getTeam } from "@/data/mock";
import { cn, formatMatchDateTime } from "@/lib/utils";
import { Trophy, Calendar, MapPin } from "lucide-react";

interface KnockoutBracketProps {
  matches: Match[];
}

const BRACKET_PARENTS: Record<string, { home: string; away: string }> = {
  // Round of 16 (LAST_16)
  "api_537375": { home: "api_537415", away: "api_537416" },
  "api_537376": { home: "api_537417", away: "api_537418" },
  "api_537377": { home: "api_537423", away: "api_537424" },
  "api_537378": { home: "api_537425", away: "api_537426" },
  "api_537379": { home: "api_537421", away: "api_537422" },
  "api_537380": { home: "api_537419", away: "api_537420" },
  "api_537381": { home: "api_537427", away: "api_537428" },
  "api_537382": { home: "api_537429", away: "api_537430" },

  // Quarterfinals (QUARTER_FINALS)
  "api_537383": { home: "api_537376", away: "api_537375" },
  "api_537384": { home: "api_537377", away: "api_537378" },
  "api_537385": { home: "api_537379", away: "api_537380" },
  "api_537386": { home: "api_537381", away: "api_537382" },

  // Semifinals (SEMI_FINALS)
  "api_537387": { home: "api_537383", away: "api_537384" },
  "api_537388": { home: "api_537385", away: "api_537386" },

  // Final (FINAL)
  "api_537390": { home: "api_537387", away: "api_537388" },
  
  // Third Place (THIRD_PLACE)
  "api_537389": { home: "api_537387", away: "api_537388" }
};

export function KnockoutBracket({ matches }: KnockoutBracketProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [hoveredMatchId, setHoveredMatchId] = useState<string | null>(null);

  // Helper to determine winner Team ID
  const getWinnerTeamId = (match: Match | undefined): string | null => {
    if (!match) return null;
    if (match.status !== "finished") return null;
    if (match.winnerTeamId) return match.winnerTeamId;
    if (match.homeScore === null || match.awayScore === null) return null;
    if (match.homeScore > match.awayScore) return match.homeTeamId;
    if (match.awayScore > match.homeScore) return match.awayTeamId;
    return null;
  };

  // Helper to determine loser Team ID
  const getLoserTeamId = (match: Match | undefined): string | null => {
    if (!match) return null;
    if (match.status !== "finished") return null;
    if (match.homeScore === null || match.awayScore === null) return null;
    const winner = getWinnerTeamId(match);
    if (!winner) return null;
    return winner === match.homeTeamId ? match.awayTeamId : match.homeTeamId;
  };

  // Recursive team ID resolver for TBD matches
  const resolveDynamicTeamId = (matchId: string, type: "home" | "away"): string => {
    const match = matches.find((m) => m.id === matchId);
    if (!match) return "tbd";

    const currentTeamId = type === "home" ? match.homeTeamId : match.awayTeamId;
    if (currentTeamId !== "tbd") return currentTeamId;

    const parents = BRACKET_PARENTS[matchId];
    if (!parents) return "tbd";

    const parentMatchId = type === "home" ? parents.home : parents.away;
    const parentMatch = matches.find((m) => m.id === parentMatchId);

    if (matchId === "api_537389") {
      // Third place is for semifinal losers
      const semiparentId = type === "home" ? parents.home : parents.away;
      const semiparent = matches.find((m) => m.id === semiparentId);
      const loser = getLoserTeamId(semiparent);
      return loser || "tbd";
    }

    const winner = getWinnerTeamId(parentMatch);
    return winner || "tbd";
  };

  // Fallback metadata for rendering TBD or dynamically inferred team details
  const getTeamDetails = (matchId: string, type: "home" | "away") => {
    const teamId = resolveDynamicTeamId(matchId, type);
    if (teamId !== "tbd") {
      const t = getTeam(teamId);
      if (t) return t;
      return {
        id: teamId,
        name: teamId.toUpperCase(),
        flag: `https://flagcdn.com/w320/${teamId === "ury" ? "uy" : teamId === "cpv" ? "cv" : teamId === "jpn" ? "jp" : "un"}.png`,
        colors: { primary: "#1e293b", secondary: "#334155" }
      };
    }

    // Still TBD, find details of previous matches to print descriptive TBD text
    const parents = BRACKET_PARENTS[matchId];
    let displayName = "รอผลการแข่งขัน";
    if (parents) {
      const parentMatchId = type === "home" ? parents.home : parents.away;
      if (matchId === "api_537389") {
        displayName = type === "home" ? "ผู้แพ้รองชนะเลิศ 1" : "ผู้แพ้รองชนะเลิศ 2";
      } else {
        const parentMatch = matches.find((m) => m.id === parentMatchId);
        if (parentMatch) {
          const parentHomeId = resolveDynamicTeamId(parentMatchId, "home");
          const parentAwayId = resolveDynamicTeamId(parentMatchId, "away");
          const homeName = parentHomeId !== "tbd" ? (getTeam(parentHomeId)?.name || parentHomeId.toUpperCase()) : "TBD";
          const parentAwayName = parentAwayId !== "tbd" ? (getTeam(parentAwayId)?.name || parentAwayId.toUpperCase()) : "TBD";
          if (homeName !== "TBD" || parentAwayName !== "TBD") {
            displayName = `ผู้ชนะ ${homeName}/${parentAwayName}`;
          } else {
            const roundLabel = parentMatchId.includes("5374") ? "รอบ 32 ทีม" : "รอบ 16 ทีม";
            displayName = `ผู้ชนะจาก${roundLabel}`;
          }
        }
      }
    }

    return {
      id: "tbd",
      name: displayName,
      flag: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="28" viewBox="0 0 40 28"><rect width="100%" height="100%" fill="%230f172a"/><text x="50%" y="60%" font-family="sans-serif" font-size="9" fill="%23475569" font-weight="bold" text-anchor="middle">TBD</text></svg>`,
      colors: { primary: "#0f172a", secondary: "#1e293b" }
    };
  };

  // Render a single Match node in the bracket
  const renderMatchNode = (matchId: string, side: "left" | "right" | "center" = "center") => {
    const match = matches.find((m) => m.id === matchId);
    const home = getTeamDetails(matchId, "home");
    const away = getTeamDetails(matchId, "away");
    const isHovered = hoveredMatchId === matchId;
    
    // Check if parent match is hovered to highlight pathway
    let isParentHovered = false;
    const parents = BRACKET_PARENTS[matchId];
    if (parents && hoveredMatchId) {
      isParentHovered = hoveredMatchId === parents.home || hoveredMatchId === parents.away;
    }

    const hasScore = match && match.homeScore !== null && match.awayScore !== null;
    const winnerId = getWinnerTeamId(match);

    const dateStr = match ? formatMatchDateTime(match.date) : "รอการระบุวันเวลา";

    return (
      <motion.div
        className={cn(
          "relative w-64 rounded-card border p-3 backdrop-blur-xl transition-all duration-300",
          isHovered 
            ? "border-neon bg-neon/10 shadow-neon" 
            : isParentHovered
              ? "border-cyan-400 bg-cyan-950/20 shadow-[0_0_12px_rgba(34,211,238,0.2)]"
              : "border-glass-border bg-navy/60 hover:border-white/20 hover:bg-navy/80"
        )}
        onMouseEnter={() => setHoveredMatchId(matchId)}
        onMouseLeave={() => setHoveredMatchId(null)}
        whileHover={{ y: -2 }}
      >
        <Link href={match ? `/matches/${match.id}` : "#"} className="block space-y-2">
          {/* Match header */}
          <div className="flex items-center justify-between text-[10px] text-white/40">
            <span className="font-semibold">{match?.group || "รอบน็อกเอาต์"}</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {dateStr}
            </span>
          </div>

          {/* Teams and Scores */}
          <div className="space-y-1.5">
            {/* Home Team */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="relative h-5 w-7 shrink-0 overflow-hidden rounded-sm border border-white/10">
                  <Image src={home.flag} alt={home.name} fill className="object-cover" />
                </div>
                <span className={cn(
                  "truncate text-xs font-medium",
                  winnerId === home.id && "text-gold font-bold",
                  winnerId && winnerId !== home.id && "text-white/30",
                  home.id === "tbd" && "text-white/40 italic"
                )}>
                  {home.name}
                </span>
              </div>
              {hasScore && (
                <span className={cn(
                  "font-heading text-sm px-1.5 rounded",
                  winnerId === home.id ? "text-gold bg-gold/10 font-bold" : "text-white/50"
                )}>
                  {match?.homeScore}
                </span>
              )}
            </div>

            {/* Away Team */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="relative h-5 w-7 shrink-0 overflow-hidden rounded-sm border border-white/10">
                  <Image src={away.flag} alt={away.name} fill className="object-cover" />
                </div>
                <span className={cn(
                  "truncate text-xs font-medium",
                  winnerId === away.id && "text-gold font-bold",
                  winnerId && winnerId !== away.id && "text-white/30",
                  away.id === "tbd" && "text-white/40 italic"
                )}>
                  {away.name}
                </span>
              </div>
              {hasScore && (
                <span className={cn(
                  "font-heading text-sm px-1.5 rounded",
                  winnerId === away.id ? "text-gold bg-gold/10 font-bold" : "text-white/50"
                )}>
                  {match?.awayScore}
                </span>
              )}
            </div>
          </div>
          
          {/* Match Footer */}
          {match && match.status?.toLowerCase() === "live" && (
            <div className="flex items-center justify-center rounded bg-live/10 py-0.5 text-[9px] font-bold text-live animate-pulse">
              LIVE • กำลังแข่งขัน
            </div>
          )}
        </Link>
      </motion.div>
    );
  };

  // Group Matches by Stage for Mobile Tab view
  const stagesMap = {
    r32: matches.filter(m => m.stage === "LAST_32").sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    r16: matches.filter(m => m.stage === "LAST_16").sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    qf: matches.filter(m => m.stage === "QUARTER_FINALS").sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    sf: matches.filter(m => m.stage === "SEMI_FINALS").sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    finals: matches.filter(m => m.stage === "FINAL" || m.stage === "THIRD_PLACE").sort((a, b) => a.stage === "FINAL" ? 1 : -1) // Final at bottom
  };

  return (
    <div className="w-full space-y-6">
      {/* Tab Selectors for Mobile / Mode */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-glass-border pb-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("all")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
              activeTab === "all"
                ? "bg-neon/10 text-neon border-neon/30"
                : "border-glass-border text-white/60 hover:border-white/10 hover:text-white"
            )}
          >
            ผังรวมทั้งหมด (Bracket View)
          </button>
          <button
            onClick={() => setActiveTab("r32")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
              activeTab === "r32"
                ? "bg-neon/10 text-neon border-neon/30"
                : "border-glass-border text-white/60 hover:border-white/10 hover:text-white"
            )}
          >
            รอบ 32 ทีม
          </button>
          <button
            onClick={() => setActiveTab("r16")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
              activeTab === "r16"
                ? "bg-neon/10 text-neon border-neon/30"
                : "border-glass-border text-white/60 hover:border-white/10 hover:text-white"
            )}
          >
            รอบ 16 ทีม
          </button>
          <button
            onClick={() => setActiveTab("qf")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
              activeTab === "qf"
                ? "bg-neon/10 text-neon border-neon/30"
                : "border-glass-border text-white/60 hover:border-white/10 hover:text-white"
            )}
          >
            รอบ 8 ทีม
          </button>
          <button
            onClick={() => setActiveTab("sf")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
              activeTab === "sf"
                ? "bg-neon/10 text-neon border-neon/30"
                : "border-glass-border text-white/60 hover:border-white/10 hover:text-white"
            )}
          >
            รอบรองชนะเลิศ
          </button>
          <button
            onClick={() => setActiveTab("finals")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
              activeTab === "finals"
                ? "bg-neon/10 text-neon border-neon/30"
                : "border-glass-border text-white/60 hover:border-white/10 hover:text-white"
            )}
          >
            รอบชิงชนะเลิศ
          </button>
        </div>
        <span className="text-[10px] text-white/30 uppercase tracking-wider">
          ข้อมูลอัปเดตแบบเรียลไทม์
        </span>
      </div>

      {/* 1. VISUAL BRACKET VIEW (ALL) */}
      {activeTab === "all" && (
        <div className="relative overflow-x-auto py-8">
          <div className="flex min-w-[1600px] items-center justify-between px-4 gap-8">
            
            {/* COLUMN 1: LEFT ROUND OF 32 */}
            <div className="flex flex-col justify-around h-[840px]">
              {renderMatchNode("api_537417", "left")}
              {renderMatchNode("api_537418", "left")}
              {renderMatchNode("api_537415", "left")}
              {renderMatchNode("api_537416", "left")}
              {renderMatchNode("api_537423", "left")}
              {renderMatchNode("api_537424", "left")}
              {renderMatchNode("api_537425", "left")}
              {renderMatchNode("api_537426", "left")}
            </div>

            {/* COLUMN 2: LEFT ROUND OF 16 */}
            <div className="flex flex-col justify-around h-[840px] py-12">
              {renderMatchNode("api_537376", "left")}
              {renderMatchNode("api_537375", "left")}
              {renderMatchNode("api_537377", "left")}
              {renderMatchNode("api_537378", "left")}
            </div>

            {/* COLUMN 3: LEFT QUARTERFINALS */}
            <div className="flex flex-col justify-around h-[840px] py-28">
              {renderMatchNode("api_537383", "left")}
              {renderMatchNode("api_537384", "left")}
            </div>

            {/* COLUMN 4: LEFT SEMIFINAL */}
            <div className="flex flex-col justify-center h-[840px]">
              {renderMatchNode("api_537387", "left")}
            </div>

            {/* COLUMN 5: CENTER FINALS */}
            <div className="flex flex-col justify-center gap-12 items-center h-[840px]">
              {/* Cup Icon and title */}
              <div className="text-center space-y-2">
                <Trophy className="h-12 w-12 text-gold mx-auto animate-bounce" />
                <h3 className="font-heading text-gradient-gold text-2xl tracking-widest uppercase">
                  World Cup 2026
                </h3>
                <span className="text-[10px] text-white/50 tracking-widest uppercase">
                  รอบชิงชนะเลิศ
                </span>
              </div>

              {/* Final Node */}
              <div className="space-y-1">
                <div className="text-center text-[10px] font-bold text-gold uppercase tracking-wider mb-1">
                  ชิงชนะเลิศ (Final)
                </div>
                {renderMatchNode("api_537390", "center")}
              </div>

              {/* Third Place Node */}
              <div className="space-y-1 mt-4 opacity-80 hover:opacity-100 transition-opacity">
                <div className="text-center text-[10px] text-white/40 uppercase tracking-wider mb-1">
                  ชิงอันดับสาม (Third Place)
                </div>
                {renderMatchNode("api_537389", "center")}
              </div>
            </div>

            {/* COLUMN 6: RIGHT SEMIFINAL */}
            <div className="flex flex-col justify-center h-[840px]">
              {renderMatchNode("api_537388", "right")}
            </div>

            {/* COLUMN 7: RIGHT QUARTERFINALS */}
            <div className="flex flex-col justify-around h-[840px] py-28">
              {renderMatchNode("api_537385", "right")}
              {renderMatchNode("api_537386", "right")}
            </div>

            {/* COLUMN 8: RIGHT ROUND OF 16 */}
            <div className="flex flex-col justify-around h-[840px] py-12">
              {renderMatchNode("api_537379", "right")}
              {renderMatchNode("api_537380", "right")}
              {renderMatchNode("api_537381", "right")}
              {renderMatchNode("api_537382", "right")}
            </div>

            {/* COLUMN 9: RIGHT ROUND OF 32 */}
            <div className="flex flex-col justify-around h-[840px]">
              {renderMatchNode("api_537421", "right")}
              {renderMatchNode("api_537422", "right")}
              {renderMatchNode("api_537419", "right")}
              {renderMatchNode("api_537420", "right")}
              {renderMatchNode("api_537427", "right")}
              {renderMatchNode("api_537428", "right")}
              {renderMatchNode("api_537429", "right")}
              {renderMatchNode("api_537430", "right")}
            </div>

          </div>
        </div>
      )}

      {/* 2. ROUND LIST VIEWS FOR MOBILE / ZOOM */}
      {activeTab !== "all" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(activeTab === "r32" ? stagesMap.r32 :
            activeTab === "r16" ? stagesMap.r16 :
            activeTab === "qf" ? stagesMap.qf :
            activeTab === "sf" ? stagesMap.sf :
            stagesMap.finals
          ).map((apiMatch) => {
            const home = getTeamDetails(apiMatch.id, "home");
            const away = getTeamDetails(apiMatch.id, "away");
            const hasScore = apiMatch.homeScore !== null && apiMatch.awayScore !== null;
            const winnerId = getWinnerTeamId(apiMatch);

            return (
              <div 
                key={apiMatch.id}
                className="rounded-card border border-glass-border bg-glass p-4 backdrop-blur-xl hover:border-neon/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between text-[11px] text-white/50 mb-3 border-b border-white/5 pb-2">
                  <span className="font-semibold text-neon">
                    {apiMatch.stage === "LAST_32" ? "รอบ 32 ทีม" :
                     apiMatch.stage === "LAST_16" ? "รอบ 16 ทีม" :
                     apiMatch.stage === "QUARTER_FINALS" ? "รอบ 8 ทีม" :
                     apiMatch.stage === "SEMI_FINALS" ? "รอบรองชนะเลิศ" :
                     apiMatch.stage === "THIRD_PLACE" ? "รอบชิงอันดับสาม" : "รอบชิงชนะเลิศ"}
                  </span>
                  <span>{formatMatchDateTime(apiMatch.date)}</span>
                </div>

                <div className="flex items-center justify-between gap-4 py-2">
                  {/* Home */}
                  <div className="flex flex-1 flex-col items-center gap-1 text-center">
                    <div className="relative h-8 w-12 overflow-hidden rounded-sm border border-white/10 shadow-sm">
                      <Image src={home.flag} alt={home.name} fill className="object-cover" />
                    </div>
                    <span className={cn(
                      "text-xs font-semibold mt-1",
                      winnerId === home.id && "text-gold font-bold",
                      home.id === "tbd" && "text-white/40 italic"
                    )}>
                      {home.name}
                    </span>
                  </div>

                  {/* Score or VS */}
                  <div className="flex flex-col items-center">
                    {hasScore ? (
                      <span className="font-heading text-2xl text-white">
                        {apiMatch.homeScore} - {apiMatch.awayScore}
                      </span>
                    ) : (
                      <span className="font-heading text-lg text-white/30">VS</span>
                    )}
                    <span className="text-[10px] text-white/40 mt-1 uppercase">
                      {apiMatch.status}
                    </span>
                  </div>

                  {/* Away */}
                  <div className="flex flex-1 flex-col items-center gap-1 text-center">
                    <div className="relative h-8 w-12 overflow-hidden rounded-sm border border-white/10 shadow-sm">
                      <Image src={away.flag} alt={away.name} fill className="object-cover" />
                    </div>
                    <span className={cn(
                      "text-xs font-semibold mt-1",
                      winnerId === away.id && "text-gold font-bold",
                      away.id === "tbd" && "text-white/40 italic"
                    )}>
                      {away.name}
                    </span>
                  </div>
                </div>

                {/* Match Info */}
                <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2.5 text-[10px] text-white/40">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {apiMatch.stadium}
                  </span>
                  <Link 
                    href={`/matches/${apiMatch.id}`}
                    className="text-neon hover:underline font-semibold"
                  >
                    ดูรายละเอียด
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
