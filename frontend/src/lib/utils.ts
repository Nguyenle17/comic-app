import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Language } from "@/features/preferences/stores/ui-store";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return num.toString();
}

const timeUnits: Record<Language, { justNow: string; units: [string, string][] }> = {
  vi: {
    justNow: "Vừa xong",
    units: [
      ["phút", "phút"],
      ["giờ", "giờ"],
      ["ngày", "ngày"],
      ["tháng", "tháng"],
      ["năm", "năm"],
    ],
  },
  en: {
    justNow: "Just now",
    units: [
      ["minute", "minutes"],
      ["hour", "hours"],
      ["day", "days"],
      ["month", "months"],
      ["year", "years"],
    ],
  },
};

export function formatTimeAgo(dateString: string, language: Language = "vi"): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const { justNow, units } = timeUnits[language];

  if (diffInSeconds < 60) return justNow;

  const values = [
    Math.floor(diffInSeconds / 60),
    Math.floor(diffInSeconds / 3600),
    Math.floor(diffInSeconds / 86400),
    Math.floor(diffInSeconds / 2592000),
    Math.floor(diffInSeconds / 31536000),
  ];
  const index = values.findIndex((value, i) => {
    const limit = [60, 24, 30, 12, Infinity][i];
    return value < limit;
  });
  const safeIndex = index === -1 ? values.length - 1 : index;
  const [singular, plural] = units[safeIndex];
  const amount = values[safeIndex];
  return language === "en"
    ? `${amount} ${amount === 1 ? singular : plural} ago`
    : `${amount} ${singular} trước`;
}
