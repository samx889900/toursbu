import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://toursbu.com"),
  title: {
    default: "ToursBU — Travel Together. Explore More.",
    template: "%s | ToursBU",
  },
  description:
    "ToursBU is the modern platform for discovering, booking, and managing student trips. Browse curated destinations, reserve your seat online, and travel with your college community.",
  keywords: [
    "student travel",
    "college trips",
    "group tours",
    "adventure trips",
    "student booking platform",
    "ToursBU",
  ],
  authors: [{ name: "ToursBU" }],
  creator: "ToursBU",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://toursbu.com",
    siteName: "ToursBU",
    title: "ToursBU — Travel Together. Explore More.",
    description:
      "Discover, book, and manage student trips. Browse curated destinations, reserve your seat online, and travel with your college community.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "ToursBU — Travel Together. Explore More.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ToursBU — Travel Together. Explore More.",
    description:
      "Discover, book, and manage student trips with ToursBU.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://toursbu.com",
  },
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
