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
  if (!team) return { title: "ไม่พบข้อมูลทีมชาติ" };
  
  const titleStr = `ทีมชาติ${team.name} (กลุ่มตัวแทน)`;
  const descStr = `ส่องทำเนียบรายชื่อนักเตะชุดลุยศึกฟุตบอลโลก 2026 ข้อมูลความพร้อม และอันดับฟีฟ่าล่าสุดของทัพ ${team.name} (FIFA Ranking #${team.ranking})`;

  return {
    title: team.name,
    description: descStr,
    openGraph: {
      title: `${titleStr} | ฟุตบอลโลก 2026`,
      description: descStr,
      type: "profile",
      images: [
        {
          url: team.flag,
          width: 320,
          height: 240,
          alt: `ธงชาติ ${team.name}`,
        }
      ],
      siteName: "ศูนย์ฟุตบอลโลก 2026",
    },
    twitter: {
      card: "summary",
      title: `${titleStr} | ฟุตบอลโลก 2026`,
      description: descStr,
      images: [team.flag],
    },
  };
}

export default async function TeamDetailPage({ params }: Props) {
  const { id } = await params;
  const team = getTeam(id);
  if (!team) notFound();
  return <TeamDetailClient team={team} />;
}
