"use client";

import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { trips } from "@/lib/data/trips";
import { StatusBadge } from "@/components/shared/status-badge";
import { PageHeader } from "@/components/shared/page-header";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useState } from "react";

export default function AdminTripsPage() {
  const [search, setSearch] = useState("");

  const filteredTrips = trips.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Trips"
        description={`${trips.length} trips total · ${trips.filter((t) => t.tripStatus === "PUBLISHED").length} published`}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Trips" },
        ]}
        actions={
          <Link
            href="/admin/trips/new"
            className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-4 py-2.5 text-sm font-medium transition-all hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Create Trip
          </Link>
        }
      />

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
        <input
          type="text"
          placeholder="Search trips..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.5)]">
                <th className="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Trip</th>
                <th className="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Location</th>
                <th className="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Date</th>
                <th className="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Price</th>
                <th className="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Seats</th>
                <th className="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Status</th>
                <th className="px-4 py-3 text-right font-medium text-[hsl(var(--muted-foreground))]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--border))]">
              {filteredTrips.map((trip) => (
                <tr key={trip.id} className="hover:bg-[hsl(var(--muted)/0.3)] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[hsl(var(--foreground))] truncate max-w-[200px]">{trip.title}</p>
                  </td>
                  <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{trip.location}</td>
                  <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{formatDate(trip.startDate)}</td>
                  <td className="px-4 py-3 font-medium text-[hsl(var(--foreground))]">{formatCurrency(trip.price)}</td>
                  <td className="px-4 py-3">
                    <span className="text-[hsl(var(--foreground))]">{trip.availableSeats}</span>
                    <span className="text-[hsl(var(--muted-foreground))]"> / {trip.totalSeats}</span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={trip.tripStatus} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/trips/${trip.id}`}
                      className="text-xs font-medium text-[hsl(var(--primary))] hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
