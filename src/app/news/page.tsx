"use client";

import { useState } from "react";
import { PageTransition } from "@/components/PageTransition";
import { NewsCard } from "@/components/NewsCard";
import { news } from "@/data/mock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categories = [
  { value: "all", label: "ทั้งหมด" },
  { value: "news", label: "ข่าวเด่น" },
  { value: "video", label: "วิดีโอ" },
  { value: "highlight", label: "ไฮไลท์" },
  { value: "transfer", label: "ตลาดนักเตะ" },
];

export default function NewsPage() {
  const [filter, setFilter] = useState("all");
  const featured = news.find((n) => n.featured)!;

  const filtered =
    filter === "all" ? news.filter((n) => !n.featured) : news.filter((n) => n.category === filter && !n.featured);

  return (
    <PageTransition>
      <div className="p-4 md:p-8">
        <h1 className="font-heading text-3xl tracking-wide text-white md:text-4xl">ข่าวสาร</h1>
        <p className="mt-1 text-sm text-white/50">ข่าวสารล่าสุดเกี่ยวกับฟุตบอลโลก 2026</p>

        <div className="mt-6">
          <NewsCard item={featured} featured />
        </div>

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
                {(c.value === "all" ? news.filter((n) => !n.featured) : filtered).map((n) => (
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
