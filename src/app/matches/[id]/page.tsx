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
  if (!match) return { title: "ไม่พบข้อมูลแมตช์" };
  const home = getTeam(match.homeTeamId)!;
  const away = getTeam(match.awayTeamId)!;
  
  const titleStr = `วิเคราะห์สด: ${home.name} พบ ${away.name} (กลุ่ม ${match.group})`;
  const descStr = `ศูนย์ข้อมูลการแข่งขันสดและร่วมทายผลบอลคู่ระหว่าง ${home.name} พบ ${away.name} แข่งขันกันที่สนาม ${match.stadium} เมือง ${match.city}`;
  const ogImageUrl = "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&h=630&fit=crop";

  return {
    title: titleStr,
    description: descStr,
    openGraph: {
      title: `${titleStr} | ฟุตบอลโลก 2026`,
      description: descStr,
      type: "article",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${home.name} vs ${away.name}`,
        }
      ],
      siteName: "ศูนย์ฟุตบอลโลก 2026",
    },
    twitter: {
      card: "summary_large_image",
      title: `${titleStr} | ฟุตบอลโลก 2026`,
      description: descStr,
      images: [ogImageUrl],
    },
  };
}

export default async function MatchDetailPage({ params }: Props) {
  const { id } = await params;
  const match = getMatch(id);
  if (!match) notFound();
  return <MatchDetailClient match={match} />;
}
