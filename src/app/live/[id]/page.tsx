"use client";

import { useParams } from "next/navigation";
import LiveMatchClient from "./LiveMatchClient";
import { getMatch } from "@/data/mock";

export default function LiveMatchPage() {
  const params = useParams();
  const id = params.id as string;
  const match = getMatch(id);

  if (!match) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-white/50">Match not found</p>
      </div>
    );
  }

  return <LiveMatchClient match={match} />;
}
