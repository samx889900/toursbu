"use client";

import { motion } from "framer-motion";
import {
  IndianRupee,
  CalendarCheck,
  MapPin,
  Users,
  Clock,
  CalendarCheck2,
  UserPlus,
  XCircle,
  RotateCcw,
  Globe,
} from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { dashboardStats, revenueData, topTrips, recentActivities } from "@/lib/data/dashboard";
import { bookings } from "@/lib/data/bookings";
import { users } from "@/lib/data/users";
import { trips } from "@/lib/data/trips";
import { formatCurrency, getInitials } from "@/lib/utils";
import Link from "next/link";

const iconMap: Record<string, React.ElementType> = {
  CalendarCheck: CalendarCheck2,
  IndianRupee: IndianRupee,
  MapPin: MapPin,
  UserPlus: UserPlus,
  XCircle: XCircle,
  RotateCcw: RotateCcw,
  Globe: Globe,
  Clock: Clock,
};

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[hsl(var(--foreground))] sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
          Welcome back! Here&apos;s your operations overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(dashboardStats.totalRevenue)}
          icon={IndianRupee}
          trend={{ value: 12, label: "vs last month", direction: "up" }}
          iconColor="text-emerald-500"
        />
        <StatCard
          title="Today's Bookings"
          value={dashboardStats.todayBookings.toString()}
          icon={CalendarCheck}
          trend={{ value: 8, label: "vs yesterday", direction: "up" }}
          iconColor="text-blue-500"
        />
        <StatCard
          title="Upcoming Trips"
          value={dashboardStats.upcomingTrips.toString()}
          icon={MapPin}
          iconColor="text-purple-500"
        />
        <StatCard
          title="Seat Occupancy"
          value={`${dashboardStats.seatOccupancy}%`}
          icon={Users}
          trend={{ value: 5, label: "vs last month", direction: "up" }}
          iconColor="text-amber-500"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">Revenue Overview</h2>
            <select className="text-xs rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-1.5 text-[hsl(var(--muted-foreground))]">
              <option>Last 7 months</option>
              <option>Last 12 months</option>
            </select>
          </div>
          {/* Chart bars */}
          <div className="flex items-end gap-3 h-48">
            {revenueData.map((d) => {
              const maxRevenue = Math.max(...revenueData.map((r) => r.revenue));
              const height = (d.revenue / maxRevenue) * 100;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
                    {formatCurrency(d.revenue)}
                  </span>
                  <div className="w-full relative group">
                    <div
                      className="w-full rounded-lg bg-[hsl(var(--primary)/0.15)] transition-colors group-hover:bg-[hsl(var(--primary)/0.25)]"
                      style={{ height: `${height}%`, minHeight: "8px" }}
                    >
                      <div
                        className="absolute bottom-0 w-full rounded-lg gradient-bg opacity-80"
                        style={{ height: `${height * 0.7}%`, minHeight: "4px" }}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-[hsl(var(--muted-foreground))]">
                    {d.month}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"
        >
          <h2 className="text-base font-semibold text-[hsl(var(--foreground))] mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4 max-h-[380px] overflow-y-auto scrollbar-thin pr-1">
            {recentActivities.map((activity) => {
              const IconComponent = iconMap[activity.icon] ?? Clock;
              return (
                <div key={activity.id} className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--muted))] shrink-0">
                    <IconComponent className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[hsl(var(--foreground))] leading-relaxed">
                      {activity.message}
                    </p>
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5">
                      {new Date(activity.timestamp).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Trips */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">Top Trips</h2>
            <Link href="/admin/trips" className="text-xs text-[hsl(var(--primary))] hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {topTrips.slice(0, 5).map((trip, i) => (
              <div key={trip.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[hsl(var(--muted)/0.5)] transition-colors">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[hsl(var(--muted))] text-xs font-bold text-[hsl(var(--muted-foreground))]">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[hsl(var(--foreground))] truncate">{trip.title}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">{trip.bookings} bookings</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[hsl(var(--foreground))]">{formatCurrency(trip.revenue)}</p>
                  <div className="flex items-center justify-end gap-1">
                    <div className="w-16 h-1.5 rounded-full bg-[hsl(var(--muted))] overflow-hidden">
                      <div
                        className="h-full rounded-full gradient-bg"
                        style={{ width: `${trip.occupancy}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-[hsl(var(--muted-foreground))]">{trip.occupancy}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[hsl(var(--foreground))]">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-xs text-[hsl(var(--primary))] hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {bookings.slice(0, 5).map((booking) => {
              const user = users.find((u) => u.id === booking.userId);
              const trip = trips.find((t) => t.id === booking.tripId);
              return (
                <div key={booking.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[hsl(var(--muted)/0.5)] transition-colors">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] text-xs font-bold shrink-0">
                    {getInitials(user?.name ?? "?")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[hsl(var(--foreground))] truncate">{user?.name ?? "Unknown"}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">{trip?.title ?? "Unknown Trip"}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <StatusBadge status={booking.status} />
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">{booking.bookingId}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
