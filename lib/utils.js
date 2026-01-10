import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNowStrict, format } from "date-fns";

/**
 * Tailwind CSS ক্লাসগুলোকে মার্জ করার জন্য
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * তারিখকে রিলেটিভ টাইমে ফরম্যাট করার জন্য
 */
export function formatDate(date) {
  if (!date) return "";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const diffInDays = Math.abs(
    (new Date().getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
  );

  // যদি ৭ দিনের বেশি হয় তবে ফুল ডেট দেখাবে
  if (diffInDays > 7) {
    return format(d, "MMM d, yyyy");
  }

  // ছোট ফরম্যাটে রিলেটিভ টাইম (5m, 2h, 1d)
  return formatDistanceToNowStrict(d, { addSuffix: true })
    .replace("minutes", "m")
    .replace("minute", "m")
    .replace("hours", "h")
    .replace("hour", "h")
    .replace("days", "d")
    .replace("day", "d");
}

/**
 * বড় সংখ্যাকে ফরম্যাট করার জন্য (যেমন: 1500 -> 1.5K)
 */
export function formatNumber(num) {
  if (num === undefined || num === null || isNaN(num)) return "0";

  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

/**
 * নামের প্রথম অক্ষর (Initials) বের করার জন্য
 */
export function getInitials(name) {
  if (!name || typeof name !== "string") return "";

  const initials = name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return initials.slice(0, 2);
}
