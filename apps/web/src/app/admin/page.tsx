import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { StatCard } from "@/components/shared/stat-card";
import {
  IndianRupee,
  CalendarCheck,
  MapPin,
  Users,
  Clock,
  ListOrdered
} from "lucide-react";
import Link from "next/link";
import { BookingStatus } from "@prisma/client";

export default async function AdminDashboard() {
  // Total Revenue
  const revenueResult = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { status: "SUCCESS" }
  });
  const totalRevenue = revenueResult._sum.amount || 0;

  // Today's Bookings
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayBookings = await prisma.booking.count({
    where: { createdAt: { gte: today } }
  });

  // Waitlisted Count
  const waitlistCount = await prisma.booking.count({
    where: { status: BookingStatus.WAITLISTED }
  });

  // Upcoming Trips
  const upcomingTrips = await prisma.trip.count({
    where: { startDate: { gte: new Date() } } // Or we can look for PUBLISHED
  });

  // Total Passengers booked in upcoming trips vs Capacity
  const upcomingTripsData = await prisma.trip.findMany({
    where: { startDate: { gte: new Date() } },
    select: { capacity: true, id: true }
  });
  
  const upcomingTripIds = upcomingTripsData.map(t => t.id);
  const totalCapacity = upcomingTripsData.reduce((acc, t) => acc + (t.capacity || 0), 0);
  
  const bookedPassengers = await prisma.booking.aggregate({
    _sum: { travelerCount: true },
    where: { 
      tripId: { in: upcomingTripIds },
      status: { in: [BookingStatus.CONFIRMED, BookingStatus.ADVANCE_PAID, BookingStatus.FULLY_PAID] }
    }
  });
  
  const totalBooked = bookedPassengers._sum.travelerCount || 0;
  const occupancyRate = totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;

  // Recent Activity
  const recentEvents = await prisma.bookingEvent.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: { booking: { include: { user: true } } }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
          Welcome back! Here's your operations overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={IndianRupee}
          iconColor="text-emerald-500"
        />
        <StatCard
          title="Today's Bookings"
          value={todayBookings.toString()}
          icon={CalendarCheck}
          iconColor="text-blue-500"
        />
        <StatCard
          title="Waitlist"
          value={waitlistCount.toString()}
          icon={ListOrdered}
          iconColor="text-orange-500"
        />
        <StatCard
          title="Upcoming Trips"
          value={upcomingTrips.toString()}
          icon={MapPin}
          iconColor="text-purple-500"
        />
        <StatCard
          title="Seat Occupancy"
          value={`${occupancyRate}%`}
          icon={Users}
          iconColor="text-amber-500"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Placeholder for Revenue Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 flex flex-col items-center justify-center min-h-[300px]">
          <h2 className="text-lg font-semibold text-gray-400 mb-2">Revenue Chart</h2>
          <p className="text-sm text-gray-500">More data required to generate historical charting.</p>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 flex flex-col max-h-[500px]">
          <h2 className="text-base font-semibold text-[hsl(var(--foreground))] mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4 overflow-y-auto scrollbar-thin pr-1 flex-1">
            {recentEvents.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No recent activity.</p>
            ) : (
              recentEvents.map((event) => (
                <div key={event.id} className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--muted))] shrink-0">
                    <Clock className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[hsl(var(--foreground))] leading-relaxed">
                      <span className="font-semibold">{event.booking?.user?.name || "System"}</span>{" "}
                      triggered <span className="font-mono text-[10px] bg-gray-100 px-1 py-0.5 rounded">{event.eventType}</span>
                      {event.booking && ` for Booking ${event.booking.bookingNumber}`}
                    </p>
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5">
                      {new Date(event.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
