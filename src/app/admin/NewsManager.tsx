"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { Plus, Trash2, Edit2, Save, X, Sparkles, Newspaper, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { NewsItem } from "@/data/mock";

const defaultImages = [
  { label: "สนามแข่งขันสด", url: "https://images.unsplash.com/photo-1574629810360-7ab2e98b8a88?w=800&h=450&fit=crop" },
  { label: "ลูกบอลทองคำ / ถ้วยรางวัล", url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&h=450&fit=crop" },
  { label: "แฟนบอลเชียร์ทีมชาติ", url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=450&fit=crop" },
  { label: "การซ้อมฟุตบอล", url: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?w=800&h=450&fit=crop" },
];

export default function NewsManager() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [editingItem, setEditingItem] = useState<Partial<NewsItem> | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState<NewsItem["category"]>("news");
  const [image, setImage] = useState(defaultImages[0].url);
  const [customImage, setCustomImage] = useState("");
  const [link, setLink] = useState("");
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    if (!db) return;

    const unsub = onSnapshot(collection(db, "news"), (snap) => {
      const list: NewsItem[] = [];
      snap.forEach((doc) => {
        list.push(doc.data() as NewsItem);
      });
      // Sort news by date desc
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setNews(list);
      setLoading(false);
    }, (err) => {
      console.error("Error listening to news in admin:", err);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleEdit = (item: NewsItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setExcerpt(item.excerpt);
    setCategory(item.category);
    setImage(item.image);
    setCustomImage(defaultImages.some(img => img.url === item.image) ? "" : item.image);
    setLink(item.link || "");
    setFeatured(item.featured || false);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setTitle("");
    setExcerpt("");
    setCategory("news");
    setImage(defaultImages[0].url);
    setCustomImage("");
    setLink("");
    setFeatured(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    if (!title.trim() || !excerpt.trim()) {
      alert("กรุณากรอกหัวข้อข่าวและรายละเอียดสั้น");
      return;
    }

    const id = editingItem?.id || `news_${Date.now()}`;
    const finalImage = customImage.trim() || image;

    const newArticle: NewsItem = {
      id,
      title: title.trim(),
      excerpt: excerpt.trim(),
      category,
      image: finalImage,
      date: editingItem?.date || new Date().toISOString(),
      link: link.trim() || undefined,
      featured
    };

    try {
      await setDoc(doc(db, "news", id), newArticle, { merge: true });
      alert(editingItem ? "แก้ไขข่าวสารสำเร็จแล้ว!" : "เพิ่มข่าวสารใหม่สำเร็จแล้ว!");
      handleCancel();
    } catch (err: any) {
      alert(`เกิดข้อผิดพลาด: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!db) return;
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบข่าวสารนี้?")) return;

    try {
      await deleteDoc(doc(db, "news", id));
      alert("ลบข่าวสารสำเร็จ!");
    } catch (err: any) {
      alert(`ไม่สามารถลบข้อมูลได้: ${err.message}`);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Editor Form */}
      <div className="lg:col-span-1 glass-card p-5 border border-glass-border bg-glass/60">
        <h3 className="font-heading text-lg text-gold flex items-center gap-2 mb-4 border-b border-glass-border pb-2">
          {editingItem ? <Edit2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          {editingItem ? "แก้ไขบทความข่าวสาร" : "เขียนข่าวสารใหม่"}
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-white/70 block mb-1">หัวข้อข่าวสาร</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded bg-navy-light/30 border border-glass-border p-2.5 text-sm text-white focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon"
              placeholder="กรอกชื่อหัวข้อข่าวเด่น..."
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-white/70 block mb-1">หมวดหมู่ข่าว</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as NewsItem["category"])}
              className="w-full rounded bg-navy-light/30 border border-glass-border p-2.5 text-sm text-white focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon"
            >
              <option value="news">ข่าวสารทั่วไป (News)</option>
              <option value="video">วิดีโอสัมภาษณ์ (Video)</option>
              <option value="highlight">คลิปไฮไลท์ (Highlight)</option>
              <option value="transfer">ข่าวซื้อขายนักเตะ (Transfer)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-white/70 block mb-1">บทคัดย่อ / รายละเอียดแบบย่อ</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={4}
              className="w-full rounded bg-navy-light/30 border border-glass-border p-2.5 text-sm text-white focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon"
              placeholder="กรอกคำโปรยหรือรายละเอียดข่าวสั้นที่จะแสดงในการ์ดหน้าแรก..."
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-white/70 block mb-1">ภาพหน้าปกข่าว (เลือกรูปภาพเทมเพลต)</label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {defaultImages.map((img) => (
                <button
                  type="button"
                  key={img.url}
                  onClick={() => {
                    setImage(img.url);
                    setCustomImage("");
                  }}
                  className={`border rounded p-1 text-[10px] text-center truncate transition-all ${
                    image === img.url && !customImage
                      ? "border-neon bg-neon/10 text-neon font-bold"
                      : "border-glass-border hover:border-white/20 text-white/60"
                  }`}
                >
                  {img.label}
                </button>
              ))}
            </div>
            
            <label className="text-xs font-semibold text-white/70 block mb-1">หรือระบุ URL รูปภาพเอง (เว้นว่างหากใช้รูปภาพเทมเพลตด้านบน)</label>
            <input
              type="text"
              value={customImage}
              onChange={(e) => setCustomImage(e.target.value)}
              className="w-full rounded bg-navy-light/30 border border-glass-border p-2.5 text-sm text-white focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-white/70 block mb-1">ลิงก์บทความ (ลิงก์ต้นฉบับภายนอก - ไม่จำเป็นต้องมี)</label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full rounded bg-navy-light/30 border border-glass-border p-2.5 text-sm text-white focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon"
              placeholder="https://www.thairath.co.th/..."
            />
          </div>

          <div className="flex items-center gap-2 py-2">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-glass-border text-neon focus:ring-0"
            />
            <label htmlFor="featured" className="text-xs font-semibold text-white/90">ตั้งเป็นข่าวเด่นประจำวัน (Featured News)</label>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="submit"
              className="flex-1 rounded bg-neon px-4 py-2.5 text-xs font-bold text-navy transition-all hover:bg-neon-light flex items-center justify-center gap-1.5"
            >
              <Save className="h-4 w-4" /> บันทึกข่าวสาร
            </button>
            {editingItem && (
              <button
                type="button"
                onClick={handleCancel}
                className="rounded bg-white/5 border border-glass-border px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-white/10"
              >
                ยกเลิก
              </button>
            )}
          </div>
        </form>
      </div>

      {/* News Articles List */}
      <div className="lg:col-span-2 glass-card p-5 border border-glass-border bg-glass/40">
        <h3 className="font-heading text-lg text-white flex items-center gap-2 mb-4 border-b border-glass-border pb-2">
          <Newspaper className="h-5 w-5 text-neon" /> รายชื่อข่าวสารทั้งหมดในระบบ ({news.length} บทความ)
        </h3>

        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 w-full animate-pulse rounded bg-white/5" />
            ))
          ) : news.length === 0 ? (
            <div className="text-center py-10 text-white/40 text-sm">
              ไม่มีข่าวสารในฐานข้อมูล กดเขียนข่าวชิ้นแรกได้ที่กล่องด้านซ้าย
            </div>
          ) : (
            news.map((item) => (
              <div
                key={item.id}
                className={`flex gap-4 p-3 rounded-lg border transition-all ${
                  item.featured
                    ? "border-gold/30 bg-gold/5 shadow-[0_0_10px_rgba(218,165,32,0.05)]"
                    : "border-glass-border/30 bg-navy-light/10 hover:bg-white/5"
                }`}
              >
                {/* Thumbnail */}
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded border border-white/10 bg-black/20">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] uppercase font-bold tracking-wider rounded bg-neon/15 px-1.5 py-0.5 text-neon">
                      {item.category}
                    </span>
                    {item.featured && (
                      <span className="text-[9px] uppercase font-bold tracking-wider rounded bg-gold/20 px-1.5 py-0.5 text-gold flex items-center gap-0.5">
                        <Sparkles className="h-2.5 w-2.5" /> ข่าวเด่น
                      </span>
                    )}
                    <span className="text-[10px] text-white/40">
                      {new Date(item.date).toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white mt-1 truncate">{item.title}</h4>
                  <p className="text-xs text-white/60 line-clamp-1 mt-0.5">{item.excerpt}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-1.5 shrink-0 self-center">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all border border-glass-border/50"
                    title="แก้ไข"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all border border-red-500/20"
                    title="ลบ"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
