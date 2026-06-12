import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ข่าวสารล่าสุด",
  description: "ข่าวสารความเคลื่อนไหวล่าสุดเกี่ยวกับฟุตบอลโลก 2026 บทวิเคราะห์ เจาะลึกทีมชาติ และไฮไลท์การแข่งขันสด ส่งตรงจากไทยรัฐออนไลน์",
  openGraph: {
    title: "ข่าวสารล่าสุดฟุตบอลโลก 2026 | Live Match Center",
    description: "ข่าวสารความเคลื่อนไหวล่าสุดเกี่ยวกับฟุตบอลโลก 2026 บทวิเคราะห์ เจาะลึกทีมชาติ และไฮไลท์การแข่งขันสด ส่งตรงจากไทยรัฐออนไลน์",
    images: [
      {
        url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "ฟุตบอลโลก 2026 ข่าวสาร",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ข่าวสารล่าสุดฟุตบอลโลก 2026",
    description: "ข่าวสารความเคลื่อนไหวล่าสุดเกี่ยวกับฟุตบอลโลก 2026 บทวิเคราะห์ เจาะลึกทีมชาติ และไฮไลท์การแข่งขันสด ส่งตรงจากไทยรัฐออนไลน์",
    images: ["https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&h=630&fit=crop"],
  }
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
