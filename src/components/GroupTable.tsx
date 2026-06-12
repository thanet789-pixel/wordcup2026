"use client";

import Image from "next/image";
import { StandingRow, getTeam } from "@/data/mock";
import { cn } from "@/lib/utils";

interface GroupTableProps {
  group: string;
  rows: StandingRow[];
}



export function GroupTable({ group, rows }: GroupTableProps) {
  return (
    <div className="overflow-hidden rounded-card border border-glass-border bg-glass backdrop-blur-xl">
      <div className="border-b border-white/5 px-4 py-3">
        <h3 className="font-heading text-lg tracking-wide text-gold">{group}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-navy-light/90 text-xs uppercase text-white/40">
            <tr>
              <th className="px-4 py-2 text-left">ทีม</th>
              <th className="px-2 py-2 text-center">แข่ง</th>
              <th className="px-2 py-2 text-center">ชนะ</th>
              <th className="px-2 py-2 text-center">เสมอ</th>
              <th className="px-2 py-2 text-center">แพ้</th>
              <th className="px-2 py-2 text-center">ได้เสีย</th>
              <th className="px-2 py-2 text-center">แต้ม</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const team = getTeam(row.teamId)!;
              const gd = row.gf - row.ga;
              return (
                <tr
                  key={row.teamId}
                  className="border-t border-white/5 transition-colors hover:bg-white/5"
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm",
                        row.status === "qualified" && "bg-green-500/90 shadow-green-500/25",
                        row.status === "playoff" && "bg-yellow-500/90 shadow-yellow-500/25 text-black",
                        row.status === "eliminated" && "bg-red-500/90 shadow-red-500/25",
                        row.status === "active" && "bg-white/10"
                      )}>
                        {i + 1}
                      </span>
                      <Image src={team.flag} alt="" width={24} height={16} className="rounded-sm object-cover" />
                      <span className="font-medium text-white">{team.name}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2.5 text-center text-white/60">{row.played}</td>
                  <td className="px-2 py-2.5 text-center text-white/60">{row.won}</td>
                  <td className="px-2 py-2.5 text-center text-white/60">{row.drawn}</td>
                  <td className="px-2 py-2.5 text-center text-white/60">{row.lost}</td>
                  <td className="px-2 py-2.5 text-center text-white/60">
                    {gd > 0 ? `+${gd}` : gd}
                  </td>
                  <td className="px-2 py-2.5 text-center font-bold text-neon">{row.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
