import type { Metadata } from "next";
import { Kanit, Prompt } from "next/font/google";
import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/BottomNav";
import "./globals.css";

const kanit = Kanit({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-kanit",
});

const prompt = Prompt({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-prompt",
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
    locale: "th_TH",
  },
  twitter: {
    card: "summary_large_image",
    title: "World Cup 2026 — Live Match Center",
    description: "Premium live match center for FIFA World Cup 2026",
  },
};

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className="dark">
      <body className={`${kanit.variable} ${prompt.variable} font-body`}>
        <AuthProvider>
          <Sidebar />
          <main className="min-h-screen pb-20 md:ml-64 md:pb-0">{children}</main>
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
