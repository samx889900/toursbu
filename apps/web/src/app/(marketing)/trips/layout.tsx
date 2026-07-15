import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Trips",
  description:
    "Browse all upcoming student trips. Filter by destination, price, and difficulty. Book your next adventure with ToursBU.",
};

export default function TripsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
