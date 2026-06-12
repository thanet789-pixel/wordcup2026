import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlayerDetailClient from "./PlayerDetailClient";
import { getPlayer, getTeam } from "@/data/mock";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const player = getPlayer(id);
  if (!player) return { title: "Player Not Found" };
  return {
    title: player.name,
    description: `${player.name} - ${player.position}. World Cup 2026 player profile.`,
  };
}

export default async function PlayerDetailPage({ params }: Props) {
  const { id } = await params;
  const player = getPlayer(id);
  if (!player) notFound();
  return <PlayerDetailClient player={player} />;
}
