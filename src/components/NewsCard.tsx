"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { NewsItem } from "@/data/mock";

interface NewsCardProps {
  item: NewsItem;
  featured?: boolean;
}

export function NewsCard({ item, featured = false }: NewsCardProps) {
  const categoryColors = {
    news: "text-neon",
    video: "text-gold",
    highlight: "text-live",
    transfer: "text-purple-400",
  };

  const isExternal = !!item.link;
  const linkHref = item.link || "/news";
  const linkProps = isExternal 
    ? { href: linkHref, target: "_blank", rel: "noopener noreferrer" } 
    : { href: linkHref };

  if (featured) {
    return (
      <motion.div whileHover={{ scale: 1.01 }} className="group relative overflow-hidden rounded-card">
        <Link {...linkProps}>
          <div className="relative aspect-[16/9]">
            <Image src={item.image} alt={item.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-hero-gradient" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className={`text-xs font-semibold uppercase ${categoryColors[item.category]}`}>
                {item.category}
                {isExternal && <span className="text-white/60 normal-case font-normal ml-2">• ไทยรัฐออนไลน์</span>}
              </span>
              <h2 className="mt-2 font-heading text-2xl leading-tight tracking-wide text-white md:text-3xl">
                {item.title}
              </h2>
              <p className="mt-2 line-clamp-2 text-sm text-white/60">{item.excerpt}</p>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div whileHover={{ x: 4 }} className="group">
      <Link
        {...linkProps}
        className="flex gap-3 rounded-card border border-glass-border bg-glass p-3 backdrop-blur-xl transition-all hover:border-neon/30"
      >
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg">
          <Image src={item.image} alt={item.title} fill className="object-cover" />
        </div>
        <div className="flex flex-1 flex-col justify-center">
          <span className={`text-[10px] font-semibold uppercase ${categoryColors[item.category]}`}>
            {item.category}
            {isExternal && <span className="text-white/40 normal-case font-normal ml-1.5">• ไทยรัฐออนไลน์</span>}
          </span>
          <h3 className="mt-1 line-clamp-2 text-sm font-medium text-white group-hover:text-neon">
            {item.title}
          </h3>
          <p className="mt-1 text-xs text-white/40">
            {new Date(item.date).toLocaleDateString("th-TH", {
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
