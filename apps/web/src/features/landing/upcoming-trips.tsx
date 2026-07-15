"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { publishedTrips } from "@/lib/data/trips";
import { TripCard } from "@/components/shared/trip-card";

export function UpcomingTrips() {
  const featured = publishedTrips.slice(0, 3);

  return (
    <section className="tbu-section bg-[var(--tbu-canvas)]" aria-labelledby="upcoming-heading">
      <div className="tbu-container">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2
              id="upcoming-heading"
              className="text-display-md mb-3"
            >
              Upcoming Trips
            </h2>
            <p className="text-body text-[var(--tbu-muted)]">
              Reserve your spot before seats run out.
            </p>
          </div>
          <Link
            href="/trips"
            className="hidden sm:inline-flex items-center gap-2 text-button text-[var(--tbu-blue)] hover:text-[var(--tbu-blue-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbu-ring)] rounded-lg px-2 py-1 transition-colors"
          >
            View all trips
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((trip, i) => (
            <TripCard
              key={trip.id}
              trip={trip}
              index={i}
              animationMode="scroll"
              ctaLabel="Book Now"
            />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/trips"
            className="inline-flex items-center gap-2 text-button text-[var(--tbu-blue)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbu-ring)] rounded-lg px-2 py-1 transition-colors hover:text-[var(--tbu-blue-hover)]"
          >
            View all trips
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
