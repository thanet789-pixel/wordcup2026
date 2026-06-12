import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MatchDetailClient from "./MatchDetailClient";
import { getMatch, getTeam } from "@/data/mock";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const match = getMatch(id);
  if (!match) return { title: "Match Not Found" };
  const home = getTeam(match.homeTeamId)!;
  const away = getTeam(match.awayTeamId)!;
  return {
    title: `${home.name} vs ${away.name}`,
    description: `Live match center for ${home.name} vs ${away.name} at ${match.stadium}`,
    openGraph: {
      title: `${home.name} vs ${away.name} | World Cup 2026`,
      description: `Match at ${match.stadium}, ${match.city}`,
    },
  };
}

export default async function MatchDetailPage({ params }: Props) {
  const { id } = await params;
  const match = getMatch(id);
  if (!match) notFound();
  return <MatchDetailClient match={match} />;
}
