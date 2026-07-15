"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  ChevronDown,
  MessageCircle,
  Heart,
  Share2,
  Hotel,
  Bus,
} from "lucide-react";
import { getTripBySlug } from "@/lib/data/trips";
import { formatCurrency, formatDateRange, cn } from "@/lib/utils";
import { useState } from "react";

export default function TripDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const trip = getTripBySlug(slug);

  if (!trip) {
    notFound();
  }

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const included = trip.features?.filter((f) => f.type === "INCLUDED") ?? [];
  const excluded = trip.features?.filter((f) => f.type === "EXCLUDED") ?? [];
  const seatsFilling = trip.availableSeats <= 15 && trip.availableSeats > 0;
  const soldOut = trip.availableSeats === 0;

  return (
    <div className="pt-20 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] mb-6">
          <Link href="/trips" className="hover:text-[hsl(var(--foreground))] transition-colors flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            All Trips
          </Link>
          <span>/</span>
          <span className="text-[hsl(var(--foreground))] font-medium truncate">{trip.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* ──── Main Content ──── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-video rounded-2xl overflow-hidden bg-[hsl(var(--muted))]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-600/30 to-accent-500/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="h-16 w-16 text-white/30" />
              </div>
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm px-3 py-1 text-xs font-medium">
                  {trip.difficulty}
                </span>
                {seatsFilling && (
                  <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
                    {trip.availableSeats} seats left!
                  </span>
                )}
                {soldOut && (
                  <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
                    Sold Out
                  </span>
                )}
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm text-[hsl(var(--muted-foreground))] hover:text-red-500 transition-colors">
                  <Heart className="h-4 w-4" />
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>

            {/* Title & Meta */}
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-3xl lg:text-4xl">
                {trip.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-[hsl(var(--muted-foreground))]">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {trip.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatDateRange(trip.startDate, trip.endDate)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {trip.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {trip.availableSeats} / {trip.totalSeats} seats available
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-3">About This Trip</h2>
              <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">{trip.description}</p>
            </div>

            {/* What's Included / Excluded */}
            {(included.length > 0 || excluded.length > 0) && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {included.length > 0 && (
                  <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
                    <h3 className="text-base font-semibold text-[hsl(var(--foreground))] mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      What&apos;s Included
                    </h3>
                    <ul className="space-y-2.5">
                      {included.map((f) => (
                        <li key={f.id} className="flex items-center gap-2.5 text-sm text-[hsl(var(--foreground))]">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          {f.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {excluded.length > 0 && (
                  <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
                    <h3 className="text-base font-semibold text-[hsl(var(--foreground))] mb-4 flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      Not Included
                    </h3>
                    <ul className="space-y-2.5">
                      {excluded.map((f) => (
                        <li key={f.id} className="flex items-center gap-2.5 text-sm text-[hsl(var(--muted-foreground))]">
                          <XCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />
                          {f.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Itinerary */}
            {trip.days && trip.days.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-6">Day-by-Day Itinerary</h2>
                <div className="space-y-4">
                  {trip.days.map((day) => (
                    <div key={day.id} className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
                      <div className="px-6 py-4 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.5)]">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--primary))] text-white text-xs font-bold">
                            D{day.dayNumber}
                          </span>
                          <div>
                            <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">{day.title}</h3>
                            <p className="text-xs text-[hsl(var(--muted-foreground))]">{day.description}</p>
                          </div>
                        </div>
                      </div>
                      {day.activities && day.activities.length > 0 && (
                        <div className="p-6">
                          <div className="space-y-3">
                            {day.activities.map((activity) => (
                              <div key={activity.id} className="flex gap-4">
                                <span className="text-xs font-medium text-[hsl(var(--primary))] w-16 shrink-0 pt-0.5">
                                  {activity.time}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-[hsl(var(--foreground))]">{activity.title}</p>
                                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{activity.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Accommodation & Travel */}
            {(trip.accommodation || trip.travelDetails) && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {trip.accommodation && (
                  <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Hotel className="h-5 w-5 text-[hsl(var(--primary))]" />
                      <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">Accommodation</h3>
                    </div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{trip.accommodation}</p>
                  </div>
                )}
                {trip.travelDetails && (
                  <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Bus className="h-5 w-5 text-[hsl(var(--primary))]" />
                      <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">Travel Details</h3>
                    </div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{trip.travelDetails}</p>
                  </div>
                )}
              </div>
            )}

            {/* FAQs */}
            {trip.faqs && trip.faqs.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">Trip FAQs</h2>
                <div className="space-y-2">
                  {trip.faqs.map((faq, i) => (
                    <div key={faq.id} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="flex w-full items-center justify-between px-5 py-4 text-left"
                      >
                        <span className="text-sm font-medium text-[hsl(var(--foreground))]">{faq.question}</span>
                        <ChevronDown className={cn("h-4 w-4 text-[hsl(var(--muted-foreground))] transition-transform", openFaq === i && "rotate-180")} />
                      </button>
                      <div className={cn("overflow-hidden transition-all", openFaq === i ? "max-h-40 pb-4" : "max-h-0")}>
                        <p className="px-5 text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cancellation Policy */}
            {trip.cancellationPolicy.length > 0 && (
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
                <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-3">Cancellation Policy</h3>
                <ul className="space-y-2">
                  {trip.cancellationPolicy.map((policy, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[hsl(var(--muted-foreground)/0.4)] shrink-0" />
                      {policy}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ──── Sidebar (Booking Card) ──── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Price Card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-sm"
              >
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-[hsl(var(--foreground))]">
                      {formatCurrency(trip.price)}
                    </span>
                    <span className="text-sm text-[hsl(var(--muted-foreground))]">/ person</span>
                  </div>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                    Reserve with just {formatCurrency(trip.advanceAmount)} advance
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[hsl(var(--muted-foreground))]">Advance Amount</span>
                    <span className="font-medium text-[hsl(var(--foreground))]">{formatCurrency(trip.advanceAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[hsl(var(--muted-foreground))]">Remaining</span>
                    <span className="font-medium text-[hsl(var(--foreground))]">{formatCurrency(trip.price - trip.advanceAmount)}</span>
                  </div>
                  <hr className="border-[hsl(var(--border))]" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-[hsl(var(--foreground))]">Total</span>
                    <span className="font-bold text-[hsl(var(--foreground))]">{formatCurrency(trip.price)}</span>
                  </div>
                </div>

                {soldOut ? (
                  <div className="space-y-3">
                    <button
                      disabled
                      className="w-full rounded-xl bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-6 py-3.5 text-sm font-semibold cursor-not-allowed"
                    >
                      Sold Out
                    </button>
                    <Link
                      href={`/trips/${trip.slug}/waitlist`}
                      className="flex w-full items-center justify-center rounded-xl border border-[hsl(var(--border))] px-6 py-3 text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
                    >
                      Join Waitlist
                    </Link>
                  </div>
                ) : (
                  <Link
                    href={`/trips/${trip.slug}/book`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl gradient-bg text-white px-6 py-3.5 text-sm font-semibold shadow-lg shadow-[hsl(var(--primary)/0.25)] transition-all hover:shadow-xl hover:opacity-95 active:scale-[0.98]"
                  >
                    Book Now — {formatCurrency(trip.advanceAmount)}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}

                {seatsFilling && (
                  <p className="mt-3 text-center text-xs text-red-500 font-medium">
                    ⚡ Only {trip.availableSeats} seats left — filling fast!
                  </p>
                )}
              </motion.div>

              {/* Quick Info */}
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 space-y-4">
                <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">Quick Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-[hsl(var(--primary))]" />
                    <div>
                      <p className="font-medium text-[hsl(var(--foreground))]">Dates</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">{formatDateRange(trip.startDate, trip.endDate)}</p>
                    </div>
                  </div>
                  {trip.pickupPoint && (
                    <div className="flex items-center gap-3">
                      <Bus className="h-4 w-4 text-[hsl(var(--primary))]" />
                      <div>
                        <p className="font-medium text-[hsl(var(--foreground))]">Pickup Point</p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">{trip.pickupPoint}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-[hsl(var(--primary))]" />
                    <div>
                      <p className="font-medium text-[hsl(var(--foreground))]">Group Size</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">{trip.totalSeats} max travelers</p>
                    </div>
                  </div>
                </div>

                {trip.whatsappLink && (
                  <a
                    href={trip.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 text-white px-4 py-2.5 text-sm font-medium transition-all hover:bg-emerald-600"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Join WhatsApp Group
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
