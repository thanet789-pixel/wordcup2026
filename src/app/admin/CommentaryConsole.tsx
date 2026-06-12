"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { Radio, RefreshCw, Send, Trash2, ShieldAlert, Trophy, Clock, Plus } from "lucide-react";
import { Match, getTeam, CommentaryLine, MatchEvent } from "@/data/mock";

export default function CommentaryConsole() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState("");
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [commentaries, setCommentaries] = useState<CommentaryLine[]>([]);
  const [loading, setLoading] = useState(true);

  // Match control states
  const [homeScore, setHomeScore] = useState<number>(0);
  const [awayScore, setAwayScore] = useState<number>(0);
  const [status, setStatus] = useState<Match["status"]>("scheduled");
  const [minute, setMinute] = useState<number>(0);
  const [updatingMatch, setUpdatingMatch] = useState(false);

  // Commentary input states
  const [commentaryText, setCommentaryText] = useState("");
  const [commentaryMinute, setCommentaryMinute] = useState(0);
  const [commentaryType, setCommentaryType] = useState<CommentaryLine["type"]>("normal");
  const [submittingCommentary, setSubmittingCommentary] = useState(false);

  // Timeline Event input states
  const [eventPlayer, setEventPlayer] = useState("");
  const [eventMinute, setEventMinute] = useState(0);
  const [eventType, setEventType] = useState<MatchEvent["type"]>("goal");
  const [submittingEvent, setSubmittingEvent] = useState(false);

  // 1. Fetch matches
  useEffect(() => {
    if (!db) return;

    const unsub = onSnapshot(collection(db, "matches"), (snap) => {
      const list: Match[] = [];
      snap.forEach((doc) => {
        list.push(doc.data() as Match);
      });
      // Sort matches by date
      list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setMatches(list);
      setLoading(false);
    }, (err) => {
      console.error("Error loading matches:", err);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // 2. Fetch selected match details & commentary subcollection
  useEffect(() => {
    if (!selectedMatchId || !db) {
      setSelectedMatch(null);
      setCommentaries([]);
      return;
    }

    // Match document listener
    const unsubMatch = onSnapshot(doc(db, "matches", selectedMatchId), (docSnap) => {
      if (docSnap.exists()) {
        const m = docSnap.data() as Match;
        setSelectedMatch(m);
        setHomeScore(m.homeScore !== null ? Number(m.homeScore) : 0);
        setAwayScore(m.awayScore !== null ? Number(m.awayScore) : 0);
        setStatus(m.status || "scheduled");
        setMinute(m.minute || 0);
        setCommentaryMinute(m.minute || 0);
        setEventMinute(m.minute || 0);
      }
    });

    // Commentary subcollection listener
    const commentaryCol = collection(db, "matches", selectedMatchId, "commentary");
    const unsubCommentary = onSnapshot(commentaryCol, (snap) => {
      const list: CommentaryLine[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as any);
      });
      // Sort by minute desc, then timestamp desc
      list.sort((a: any, b: any) => {
        if (b.minute !== a.minute) return b.minute - a.minute;
        return new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime();
      });
      setCommentaries(list);
    });

    return () => {
      unsubMatch();
      unsubCommentary();
    };
  }, [selectedMatchId]);

  // Update Score, Status, Minute
  const handleUpdateMatchInfo = async () => {
    if (!selectedMatchId || !db) return;
    setUpdatingMatch(true);

    try {
      await updateDoc(doc(db, "matches", selectedMatchId), {
        homeScore,
        awayScore,
        status,
        minute
      });
      alert("อัปเดตข้อมูลแมตช์การแข่งขันเรียบร้อย!");
    } catch (err: any) {
      alert(`ล้มเหลว: ${err.message}`);
    } finally {
      setUpdatingMatch(false);
    }
  };

  // Add Live Commentary Line
  const handleAddCommentary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatchId || !commentaryText.trim() || !db) return;
    setSubmittingCommentary(true);

    const commId = `comm_${Date.now()}`;
    const newComm = {
      minute: Number(commentaryMinute),
      text: commentaryText.trim(),
      type: commentaryType,
      timestamp: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, "matches", selectedMatchId, "commentary", commId), newComm);
      setCommentaryText("");
      // Automatically focus back on text input for speed
    } catch (err: any) {
      alert(`ไม่สามารถเพิ่มคำพากย์: ${err.message}`);
    } finally {
      setSubmittingCommentary(false);
    }
  };

  // Delete Commentary Line
  const handleDeleteCommentary = async (commentaryId: string) => {
    if (!selectedMatchId || !db) return;
    if (!confirm("ลบคำพากย์บรรทัดนี้หรือไม่?")) return;

    try {
      await deleteDoc(doc(db, "matches", selectedMatchId, "commentary", commentaryId));
    } catch (err: any) {
      alert(`ไม่สามารถลบได้: ${err.message}`);
    }
  };

  // Add Match Event (Goal, Card, Sub) to Timeline
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatchId || !eventPlayer.trim() || !db) return;
    setSubmittingEvent(true);

    const eventId = `ev_${Date.now()}`;
    const newEvent: MatchEvent = {
      id: eventId,
      minute: Number(eventMinute),
      player: eventPlayer.trim(),
      type: eventType,
      teamId: eventType === "goal" ? "home" : "home" // default helper, in production we can specify team
    };

    try {
      // Add event to array in matches/{matchId} document
      await updateDoc(doc(db, "matches", selectedMatchId), {
        events: arrayUnion(newEvent)
      });
      setEventPlayer("");
      alert("เพิ่มเหตุการณ์ลงไทม์ไลน์แล้ว!");
    } catch (err: any) {
      alert(`ล้มเหลว: ${err.message}`);
    } finally {
      setSubmittingEvent(false);
    }
  };

  // Delete Event from Timeline
  const handleDeleteEvent = async (ev: MatchEvent) => {
    if (!selectedMatchId || !db) return;
    if (!confirm("ต้องการลบเหตุการณ์นี้ออกจากไทม์ไลน์แมตช์หรือไม่?")) return;

    try {
      await updateDoc(doc(db, "matches", selectedMatchId), {
        events: arrayRemove(ev)
      });
    } catch (err: any) {
      alert(`ล้มเหลว: ${err.message}`);
    }
  };

  const getTeamDetails = (id: string) => {
    return getTeam(id) || { name: id, flag: "🏳️" };
  };

  return (
    <div className="space-y-6">
      {/* Selection Section */}
      <div className="glass-card p-4 border border-glass-border bg-glass/60">
        <label className="text-sm font-semibold text-white block mb-2">⚽ เลือกแมตช์ที่ต้องการอัปเดต / พากย์สด</label>
        {loading ? (
          <div className="h-10 w-full animate-pulse rounded bg-white/5" />
        ) : (
          <select
            value={selectedMatchId}
            onChange={(e) => setSelectedMatchId(e.target.value)}
            className="w-full rounded bg-navy-light/40 border border-glass-border p-3 text-sm text-white focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon"
          >
            <option value="">-- กรุณาเลือกแมตช์การแข่งขัน --</option>
            {matches.map((m) => {
              const home = getTeamDetails(m.homeTeamId);
              const away = getTeamDetails(m.awayTeamId);
              const isLive = m.status === "live" || m.status === "halftime";
              return (
                <option key={m.id} value={m.id}>
                  {isLive ? "🔴 [สด] " : ""} {home.name} พบ {away.name} (กลุ่ม {m.group} - {m.status})
                </option>
              );
            })}
          </select>
        )}
      </div>

      {selectedMatch && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Match Score & Status Controller */}
          <div className="space-y-6">
            <div className="glass-card p-5 border border-glass-border bg-glass/50">
              <h3 className="font-heading text-md text-gold flex items-center gap-2 mb-4 border-b border-glass-border pb-2">
                <Trophy className="h-4 w-4" /> แผงควบคุมสกอร์และสถานะเกมสด
              </h3>

              <div className="space-y-4">
                {/* Score Controller */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-white/5 border border-glass-border p-3 text-center">
                    <span className="text-xl mr-1">{getTeamDetails(selectedMatch.homeTeamId).flag}</span>
                    <span className="text-xs text-white/70 block mt-1">{getTeamDetails(selectedMatch.homeTeamId).name} (เหย้า)</span>
                    <div className="flex items-center justify-center gap-3 mt-2">
                      <button
                        onClick={() => setHomeScore(Math.max(0, homeScore - 1))}
                        className="h-8 w-8 rounded bg-white/10 hover:bg-white/20 text-white font-bold text-lg"
                      >
                        -
                      </button>
                      <span className="font-heading text-2xl text-white w-8">{homeScore}</span>
                      <button
                        onClick={() => setHomeScore(homeScore + 1)}
                        className="h-8 w-8 rounded bg-white/10 hover:bg-white/20 text-white font-bold text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="rounded-lg bg-white/5 border border-glass-border p-3 text-center">
                    <span className="text-xl mr-1">{getTeamDetails(selectedMatch.awayTeamId).flag}</span>
                    <span className="text-xs text-white/70 block mt-1">{getTeamDetails(selectedMatch.awayTeamId).name} (เยือน)</span>
                    <div className="flex items-center justify-center gap-3 mt-2">
                      <button
                        onClick={() => setAwayScore(Math.max(0, awayScore - 1))}
                        className="h-8 w-8 rounded bg-white/10 hover:bg-white/20 text-white font-bold text-lg"
                      >
                        -
                      </button>
                      <span className="font-heading text-2xl text-white w-8">{awayScore}</span>
                      <button
                        onClick={() => setAwayScore(awayScore + 1)}
                        className="h-8 w-8 rounded bg-white/10 hover:bg-white/20 text-white font-bold text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status Selection */}
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1">สถานะการแข่งขัน</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Match["status"])}
                    className="w-full rounded bg-navy-light/30 border border-glass-border p-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="scheduled">ยังไม่เริ่มแข่ง (scheduled)</option>
                    <option value="live">🔴 กำลังแข่งครึ่งแรก/ครึ่งหลัง (live)</option>
                    <option value="halftime">⏸️ พักครึ่งเวลา (halftime)</option>
                    <option value="finished">🏁 จบการแข่งขัน (finished)</option>
                  </select>
                </div>

                {/* Match Minute */}
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1">นาทีการแข่งขันปัจจุบัน</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={minute}
                      onChange={(e) => setMinute(Number(e.target.value))}
                      className="w-24 rounded bg-navy-light/30 border border-glass-border p-2.5 text-xs text-white font-mono text-center"
                    />
                    <div className="flex gap-1">
                      <button onClick={() => setMinute(Math.max(0, minute - 5))} className="px-2.5 py-1.5 rounded bg-white/5 hover:bg-white/10 text-[10px] text-white border border-glass-border">-5 นาที</button>
                      <button onClick={() => setMinute(minute + 1)} className="px-2.5 py-1.5 rounded bg-white/5 hover:bg-white/10 text-[10px] text-white border border-glass-border">+1 นาที</button>
                      <button onClick={() => setMinute(minute + 5)} className="px-2.5 py-1.5 rounded bg-white/5 hover:bg-white/10 text-[10px] text-white border border-glass-border">+5 นาที</button>
                    </div>
                  </div>
                </div>

                <button
                  disabled={updatingMatch}
                  onClick={handleUpdateMatchInfo}
                  className="w-full rounded bg-neon py-2.5 text-xs font-bold text-navy hover:bg-neon-light transition-all flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className={`h-4 w-4 ${updatingMatch ? "animate-spin" : ""}`} /> บันทึกการอัปเดตตัวเลขแมตช์
                </button>
              </div>
            </div>

            {/* Match Event Timeline Writer */}
            <div className="glass-card p-5 border border-glass-border bg-glass/50">
              <h3 className="font-heading text-md text-white flex items-center gap-2 mb-4 border-b border-glass-border pb-2">
                <Clock className="h-4 w-4 text-neon" /> บันทึกเหตุการณ์สำคัญลงไทม์ไลน์
              </h3>

              <form onSubmit={handleAddEvent} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-white/70 block mb-1">ประเภทเหตุการณ์</label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value as MatchEvent["type"])}
                      className="w-full rounded bg-navy-light/30 border border-glass-border p-2.5 text-xs text-white focus:outline-none"
                    >
                      <option value="goal">⚽ ทำประตู (Goal)</option>
                      <option value="yellow">🟨 ใบเหลือง (Yellow Card)</option>
                      <option value="red">🟥 ใบแดง (Red Card)</option>
                      <option value="substitution">🔄 เปลี่ยนตัวผู้เล่น (Substitution)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/70 block mb-1">นาทีที่เกิดเหตุ</label>
                    <input
                      type="number"
                      value={eventMinute}
                      onChange={(e) => setEventMinute(Number(e.target.value))}
                      className="w-full rounded bg-navy-light/30 border border-glass-border p-2.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1">ชื่อผู้เล่นและรายละเอียด</label>
                  <input
                    type="text"
                    value={eventPlayer}
                    onChange={(e) => setEventPlayer(e.target.value)}
                    className="w-full rounded bg-navy-light/30 border border-glass-border p-2.5 text-xs text-white"
                    placeholder="เช่น L. Messi, N. Mazraoui (ออก) -> S. Amrabat (เข้า)..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingEvent}
                  className="w-full rounded bg-purple-500 py-2.5 text-xs font-bold text-white hover:bg-purple-400 transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="h-4 w-4" /> บันทึกไทม์ไลน์
                </button>
              </form>

              {/* Event Timeline list */}
              <div className="mt-4 border-t border-glass-border pt-3">
                <span className="text-xs font-bold text-white/50 block mb-2">ประวัติไทม์ไลน์ปัจจุบัน:</span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 text-xs">
                  {selectedMatch.events && selectedMatch.events.length > 0 ? (
                    selectedMatch.events.map((e) => (
                      <div key={e.id} className="flex justify-between items-center bg-white/5 rounded p-1.5 border border-white/5">
                        <div className="flex items-center gap-2">
                          <span className="text-neon font-mono">{e.minute}&apos;</span>
                          <span className="text-white/40">[{e.type === "goal" ? "⚽ ประตู" : e.type === "yellow" ? "🟨 ใบเหลือง" : e.type === "red" ? "🟥 ใบแดง" : "🔄 เปลี่ยนตัว"}]</span>
                          <span className="text-white font-semibold">{e.player}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteEvent(e)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <span className="text-white/30 text-xs block text-center py-2">ยังไม่มีเหตุการณ์ถูกบันทึก</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Live Text Commentary Section */}
          <div className="space-y-6">
            <div className="glass-card p-5 border border-glass-border bg-glass/50 flex flex-col h-full justify-between">
              <div>
                <h3 className="font-heading text-md text-neon flex items-center gap-2 mb-4 border-b border-glass-border pb-2">
                  <Radio className="h-4 w-4 animate-pulse text-live" /> ห้องควบคุมพากย์บอลสด
                </h3>

                <form onSubmit={handleAddCommentary} className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-1">
                      <label className="text-xs font-semibold text-white/70 block mb-1">นาทีที่พากย์</label>
                      <input
                        type="number"
                        value={commentaryMinute}
                        onChange={(e) => setCommentaryMinute(Number(e.target.value))}
                        className="w-full rounded bg-navy-light/30 border border-glass-border p-2.5 text-xs text-white font-mono text-center font-bold"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-semibold text-white/70 block mb-1">ประเภทสถานการณ์</label>
                      <select
                        value={commentaryType}
                        onChange={(e) => setCommentaryType(e.target.value as CommentaryLine["type"])}
                        className="w-full rounded bg-navy-light/30 border border-glass-border p-2.5 text-xs text-white focus:outline-none"
                      >
                        <option value="normal">💬 คำอธิบายทั่วไป (normal)</option>
                        <option value="goal">⚽ ทำประตูสำเร็จ! (goal)</option>
                        <option value="card">🟨🟥 ใบเหลือง/ใบแดง (card)</option>
                        <option value="important">⭐️ ช็อตสำคัญ/โอกาสลุ้น (important)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-white/70 block mb-1">ข้อความคำพากย์สด</label>
                    <textarea
                      value={commentaryText}
                      onChange={(e) => setCommentaryText(e.target.value)}
                      rows={3}
                      className="w-full rounded bg-navy-light/30 border border-glass-border p-2.5 text-sm text-white focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon"
                      placeholder="เช่น บราซิลได้ลุ้นจากฟรีคิกทางขวา เนย์มาร์ปั่นโค้งๆ เสียบเสาแรกเข้าประตูไปอย่างสวยงาม!!!"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingCommentary || !commentaryText.trim()}
                    className="w-full rounded bg-neon py-2.5 text-xs font-bold text-navy hover:bg-neon-light transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" /> ส่งคำพากย์ขึ้นหน้าเว็บสด
                  </button>
                </form>
              </div>

              {/* Commentary Feed list in real-time */}
              <div className="mt-6 border-t border-glass-border pt-4 flex-1">
                <span className="text-xs font-bold text-white/50 block mb-2">ประวัติการพากย์สดที่เผยแพร่แล้ว:</span>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {commentaries.length === 0 ? (
                    <p className="text-center py-6 text-xs text-white/30">ยังไม่มีการพากย์สดแมตช์นี้ สามารถพิมพ์คำพากย์ได้ที่กล่องด้านบน</p>
                  ) : (
                    commentaries.map((c: any) => (
                      <div
                        key={c.id}
                        className={`flex justify-between items-start p-2.5 rounded border transition-all ${
                          c.type === "goal"
                            ? "bg-gold/10 border-gold/20 text-gold"
                            : c.type === "important"
                              ? "bg-neon/5 border-neon/15 text-neon"
                              : "bg-white/5 border-white/5 text-white/80"
                        }`}
                      >
                        <div className="flex gap-2 text-xs min-w-0">
                          <span className="font-heading font-mono text-neon shrink-0">{c.minute}&apos;</span>
                          <span className="break-all">{c.text}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteCommentary(c.id)}
                          className="text-red-400 hover:text-red-300 p-1 shrink-0 ml-2"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
