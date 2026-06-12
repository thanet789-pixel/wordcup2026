"use client";

import { useState, useEffect } from "react";
import { PageTransition } from "@/components/PageTransition";
import { NewsCard } from "@/components/NewsCard";
import { news as mockNews, NewsItem } from "@/data/mock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

const categories = [
  { value: "all", label: "ทั้งหมด" },
  { value: "news", label: "ข่าวเด่น" },
  { value: "video", label: "วิดีโอ" },
  { value: "highlight", label: "ไฮไลท์" },
  { value: "transfer", label: "ตลาดนักเตะ" },
];

export default function NewsPage() {
  const [filter, setFilter] = useState("all");
  const [newsState, setNewsState] = useState<NewsItem[]>(mockNews);

  useEffect(() => {
    if (!db) {
      console.warn("Firebase Firestore is not initialized. Please configure environment variables.");
      return;
    }
    const unsubNews = onSnapshot(
      collection(db, "news"),
      (snap) => {
        const newsList: NewsItem[] = [];
        snap.forEach((doc) => {
          newsList.push(doc.data() as NewsItem);
        });
        if (newsList.length > 0) {
          // Sort news by date descending to show newest first
          newsList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setNewsState(newsList);
        }
      },
      (err) => {
        console.error("Error listening to news in NewsPage:", err);
      }
    );

    return () => unsubNews();
  }, []);

  const featured = newsState.find((n) => n.featured) || newsState[0] || mockNews[0];

  const filtered =
    filter === "all"
      ? newsState.filter((n) => n.id !== featured?.id)
      : newsState.filter((n) => n.category === filter && n.id !== featured?.id);

  return (
    <PageTransition>
      <div className="p-4 md:p-8">
        <h1 className="font-heading text-3xl tracking-wide text-white md:text-4xl">ข่าวสาร</h1>
        <p className="mt-1 text-sm text-white/50">ข่าวสารล่าสุดเกี่ยวกับฟุตบอลโลก 2026</p>

        {featured && (
          <div className="mt-6">
            <NewsCard item={featured} featured />
          </div>
        )}

        <Tabs value={filter} onValueChange={setFilter} className="mt-8">
          <TabsList>
            {categories.map((c) => (
              <TabsTrigger key={c.value} value={c.value}>
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((c) => (
            <TabsContent key={c.value} value={c.value}>
              <div className="mt-4 space-y-3">
                {(c.value === "all"
                  ? newsState.filter((n) => n.id !== featured?.id)
                  : filtered
                ).map((n) => (
                  <NewsCard key={n.id} item={n} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </PageTransition>
  );
}
