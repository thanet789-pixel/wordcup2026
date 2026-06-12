import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TeamDetailClient from "./TeamDetailClient";
import { getTeam } from "@/data/mock";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const team = getTeam(id);
  if (!team) return { title: "Team Not Found" };
  return {
    title: team.name,
    description: `${team.name} - FIFA Ranking #${team.ranking}. World Cup 2026 team profile.`,
  };
}

export default async function TeamDetailPage({ params }: Props) {
  const { id } = await params;
  const team = getTeam(id);
  if (!team) notFound();
  return <TeamDetailClient team={team} />;
}
