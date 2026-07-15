import Link from "next/link";
import Image from "next/image";
import { currentUser } from "@/lib/data/users";
import { getBookingsByUserId } from "@/lib/data/bookings";
import { getTripById } from "@/lib/data/trips";
import { PageHeader } from "@/components/shared/page-header";
import { MapPin, ChevronRight } from "lucide-react";
import type { Booking } from "@toursbu/types";

export default function MyTripsPage() {
  const user = currentUser;
  const bookings = getBookingsByUserId(user.id);
  
  // Group bookings
  const upcomingBookings = bookings.filter((b) => 
    ["CONFIRMED", "PENDING_PAYMENT"].includes(b.status)
  );
  
  const pastBookings = bookings.filter((b) => 
    ["COMPLETED"].includes(b.status)
  );
  
  const waitlistedBookings = bookings.filter((b) => 
    ["WAITLISTED"].includes(b.status)
  );

  const cancelledBookings = bookings.filter((b) => 
    ["CANCELLED"].includes(b.status)
  );

  const renderBookingCard = (booking: Booking) => {
    const trip = getTripById(booking.tripId);
    if (!trip) return null;

    return (
      <Link
        key={booking.id}
        href={`/dashboard/trips/${booking.id}`}
        className="group relative flex overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] transition-all hover:shadow-md"
      >
        <div className="relative w-1/3 min-w-[120px] max-w-[140px] sm:w-48 sm:max-w-none">
          <Image
            src={trip.images?.[0]?.url || trip.coverImage || "/placeholder.jpg"}
            alt={trip.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {booking.status === "WAITLISTED" && (
            <div className="absolute top-2 left-2 rounded-full bg-orange-500/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
              WAITLISTED
            </div>
          )}
          {booking.status === "CANCELLED" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <span className="rounded-full bg-red-500/90 px-3 py-1 text-xs font-bold text-white">
                CANCELLED
              </span>
            </div>
          )}
        </div>
        
        <div className="flex flex-1 flex-col justify-between p-4">
          <div>
            <h3 className="line-clamp-1 font-bold text-[hsl(var(--foreground))] sm:text-lg">
              {trip.title}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))] sm:text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {trip.location}
              </span>
            </div>
          </div>
          
          <div className="mt-4 flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">Dates</span>
              <span className="text-xs font-medium sm:text-sm">
                {new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
            
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] transition-transform group-hover:translate-x-1">
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Trips"
        description="All your adventures in one place."
      />

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.3)] py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--muted))]">
            <MapPin className="h-8 w-8 text-[hsl(var(--muted-foreground))]" />
          </div>
          <h3 className="text-lg font-bold">No trips yet</h3>
          <p className="mt-2 mb-6 max-w-sm text-sm text-[hsl(var(--muted-foreground))]">
            You haven&apos;t booked any trips yet. Discover your next adventure and start packing!
          </p>
          <Link
            href="/trips"
            className="rounded-full bg-[hsl(var(--primary))] px-6 py-2.5 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))/0.9]"
          >
            Explore Trips
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {upcomingBookings.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight">Upcoming</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {upcomingBookings.map(renderBookingCard)}
              </div>
            </section>
          )}

          {waitlistedBookings.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight">Waitlisted</h2>
              <div className="grid gap-4 md:grid-cols-2 opacity-90">
                {waitlistedBookings.map(renderBookingCard)}
              </div>
            </section>
          )}

          {pastBookings.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-[hsl(var(--muted-foreground))]">Past Trips</h2>
              <div className="grid gap-4 md:grid-cols-2 opacity-75 grayscale-[0.2]">
                {pastBookings.map(renderBookingCard)}
              </div>
            </section>
          )}
          
          {cancelledBookings.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-[hsl(var(--muted-foreground))]">Cancelled</h2>
              <div className="grid gap-4 md:grid-cols-2 opacity-60 grayscale-[0.5]">
                {cancelledBookings.map(renderBookingCard)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
