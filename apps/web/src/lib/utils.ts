import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with clsx. The standard `cn()` pattern.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as Indian Rupee currency.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a date string to a human-readable format.
 */
export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  });
}

/**
 * Format a date range (e.g., "15 Jan – 20 Jan 2026").
 */
export function formatDateRange(
  start: string | Date,
  end: string | Date
): string {
  const s = typeof start === "string" ? new Date(start) : start;
  const e = typeof end === "string" ? new Date(end) : end;
  const sameMonth =
    s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth();

  if (sameMonth) {
    return `${s.getDate()} – ${e.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`;
  }
  return `${formatDate(s)} – ${formatDate(e)}`;
}

/**
 * Get initials from a name.
 */
export function getInitials(name: string, max = 2): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, max)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Format a number with compact notation (1500 → "1.5K").
 */
export function formatCompact(num: number): string {
  return new Intl.NumberFormat("en", { notation: "compact" }).format(num);
}

/**
 * Calculate percentage.
 */
export function percentage(
  value: number,
  total: number,
  decimals = 0
): number {
  if (total === 0) return 0;
  return Number(((value / total) * 100).toFixed(decimals));
}

/**
 * Generate a booking ID like "BU-A3F8K2".
 */
export function generateBookingId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `BU-${code}`;
}
