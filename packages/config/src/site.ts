// ============================================================
// @toursbu/config — Shared site configuration
// ============================================================

export const siteConfig = {
  name: "ToursBU",
  tagline: "Travel Together. Explore More.",
  description:
    "ToursBU is the modern platform for discovering, booking, and managing student trips. Browse curated destinations, reserve your seat online, and travel with your college community.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://toursbu.com",
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
  ogImage: "/og.png",
  creator: "ToursBU",
  keywords: [
    "student travel",
    "college trips",
    "group tours",
    "adventure trips",
    "student booking platform",
    "ToursBU",
  ],

  colors: {
    primary: "#2563EB",
    accent: "#0EA5E9",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
  },

  social: {
    instagram: "https://instagram.com/toursbu",
    whatsapp: "https://wa.me/919999999999",
    twitter: "https://twitter.com/toursbu",
    email: "hello@toursbu.com",
  },

  support: {
    email: "support@toursbu.com",
    phone: "+91 99999 99999",
  },
} as const;

export type SiteConfig = typeof siteConfig;
