import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/BottomNav";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "World Cup 2026 — Live Match Center",
    template: "%s | World Cup 2026",
  },
  description:
    "Premium live match center for FIFA World Cup 2026. Live scores, standings, teams, news, and AI predictions.",
  openGraph: {
    title: "World Cup 2026 — Live Match Center",
    description: "Premium live match center for FIFA World Cup 2026",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "World Cup 2026 — Live Match Center",
    description: "Premium live match center for FIFA World Cup 2026",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${bebas.variable} ${inter.variable} font-body`}>
        <Sidebar />
        <main className="min-h-screen pb-20 md:ml-64 md:pb-0">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
