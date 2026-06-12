import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMatchTime(date: string) {
  return new Date(date).toLocaleTimeString("th-TH", {
    timeZone: "Asia/Bangkok",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }) + " น.";
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("th-TH-u-ca-gregory", {
    timeZone: "Asia/Bangkok",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatMatchDateTime(dateStr: string) {
  const date = new Date(dateStr);
  const dateFormatted = date.toLocaleDateString("th-TH-u-ca-gregory", {
    timeZone: "Asia/Bangkok",
    day: "numeric",
    month: "short",
  });
  const timeFormatted = date.toLocaleTimeString("th-TH", {
    timeZone: "Asia/Bangkok",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }) + " น.";
  return `${dateFormatted} - ${timeFormatted}`;
}

export function getMatchStatusLabel(status: string) {
  const labels: Record<string, string> = {
    scheduled: "กำหนดการ",
    live: "สด",
    finished: "จบเกม",
    halftime: "ครึ่งเวลา",
  };
  const s = (status || "").toLowerCase();
  return labels[s] ?? status;
}

export function isSameDayBangkok(dateStr1: string, dateStr2: Date | string) {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(new Date(dateStr1)) === formatter.format(new Date(dateStr2));
  } catch (e) {
    return false;
  }
}

