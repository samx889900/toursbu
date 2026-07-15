"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, Heart } from "lucide-react";
import { formatCurrency, formatDateRange } from "@/lib/utils";
import type { Trip } from "@toursbu/types";
import { Button } from "@/components/ui/button";

interface TripCardProps {
  trip: Trip;
  /** Whether to use whileInView animation (for scroll-triggered) or animate (for filter-triggered) */
  animationMode?: "scroll" | "instant";
  /** Animation delay index */
  index?: number;
  /** CTA label text */
  ctaLabel?: string;
  /** Whether to show the trip description */
  showDescription?: boolean;
}

export function TripCard({
  trip,
  animationMode = "scroll",
  index = 0,
  ctaLabel = "Explore",
}: TripCardProps) {
  const motionProps =
    animationMode === "scroll"
      ? {
          initial: { opacity: 0, y: 24 } as const,
          whileInView: { opacity: 1, y: 0 } as const,
          viewport: { once: true } as const,
          transition: { duration: 0.5, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] as const },
        }
      : {
          initial: { opacity: 0, y: 20 } as const,
          animate: { opacity: 1, y: 0 } as const,
          transition: { duration: 0.4, delay: index * 0.05, ease: [0.21, 0.47, 0.32, 0.98] as const },
        };

  const seatsFilling = trip.availableSeats <= 15 && trip.availableSeats > 0;
  const soldOut = trip.availableSeats === 0;

  return (
    <motion.div {...motionProps} className="group relative rounded-[14px] bg-[var(--tbu-canvas)] transition-all duration-300 hover:shadow-tbu-2 hover:-translate-y-1">
      <Link href={`/trips/${trip.slug}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbu-ring)] rounded-[14px]">
        
        {/* Photo Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-[14px] bg-[var(--tbu-surface)]">
          {/* Fallback pattern */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-50">
            <MapPin className="h-10 w-10 text-blue-200" />
          </div>
          
          {/* Difficulty badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-medium text-[var(--tbu-ink)] backdrop-blur-md">
              {trip.difficulty}
            </span>
          </div>

          {/* Wishlist Heart */}
          <button 
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full text-white hover:scale-110 active:scale-95 transition-transform"
            aria-label="Save to wishlist"
            onClick={(e) => e.preventDefault()}
          >
            <Heart className="h-5 w-5 drop-shadow-md" strokeWidth={2} />
          </button>

          {/* Seats badge */}
          {seatsFilling && (
            <div className="absolute bottom-3 left-3">
              <span className="rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-[var(--tbu-ink)] shadow-sm">
                Only {trip.availableSeats} seats left
              </span>
            </div>
          )}
          
          {/* Sold out overlay */}
          {soldOut && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-gray-900">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-heading-sm truncate group-hover:text-[var(--tbu-blue)] transition-colors">
              {trip.title}
            </h3>
          </div>
          
          <div className="text-caption truncate mb-1">
            {trip.location}
          </div>

          <div className="text-caption mb-3">
            {formatDateRange(trip.startDate, trip.endDate)}
          </div>

          <div className="flex items-center justify-between mt-4">
            <div>
              <span className="text-heading-md tabular-nums">{formatCurrency(trip.price)}</span>
              <span className="text-caption-sm ml-1">per person</span>
            </div>
            
            <Button variant="secondary" size="sm" className="rounded-full" asChild>
              <span>{ctaLabel}</span>
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
