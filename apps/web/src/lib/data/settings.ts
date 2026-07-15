import type { Settings } from "@toursbu/types";

export const settings: Settings[] = [
  { id: "s-1", key: "advanceBookingAmount", value: "2000", description: "Default advance booking amount in INR", updatedAt: "2026-07-01T00:00:00Z" },
  { id: "s-2", key: "supportEmail", value: "support@toursbu.com", description: "Customer support email", updatedAt: "2026-07-01T00:00:00Z" },
  { id: "s-3", key: "supportPhone", value: "+91 99999 99999", description: "Customer support phone", updatedAt: "2026-07-01T00:00:00Z" },
  { id: "s-4", key: "instagram", value: "https://instagram.com/toursbu", description: "Instagram profile URL", updatedAt: "2026-07-01T00:00:00Z" },
  { id: "s-5", key: "whatsapp", value: "https://wa.me/919999999999", description: "WhatsApp contact link", updatedAt: "2026-07-01T00:00:00Z" },
  { id: "s-6", key: "bookingOpen", value: "true", description: "Whether new bookings are accepted", updatedAt: "2026-07-01T00:00:00Z" },
  { id: "s-7", key: "maintenanceMode", value: "false", description: "Site maintenance mode toggle", updatedAt: "2026-07-01T00:00:00Z" },
  { id: "s-8", key: "maxBookingsPerUser", value: "3", description: "Max active bookings per user", updatedAt: "2026-07-01T00:00:00Z" },
];

export function getSetting(key: string): string | undefined {
  return settings.find((s) => s.key === key)?.value;
}
