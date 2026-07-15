"use client";

import { useState } from "react";
import { Search, Download } from "lucide-react";
import { bookings } from "@/lib/data/bookings";
import { users } from "@/lib/data/users";
import { trips } from "@/lib/data/trips";
import { StatusBadge } from "@/components/shared/status-badge";
import { PageHeader } from "@/components/shared/page-header";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

const statusFilters = [
  "ALL", "PENDING_PAYMENT", "PAYMENT_RECEIVED", "CONFIRMED",
  "WAITLISTED", "CHECKED_IN", "COMPLETED", "CANCELLED", "REFUNDED",
] as const;

export default function AdminBookingsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filtered = bookings.filter((b) => {
    const user = users.find((u) => u.id === b.userId);
    const trip = trips.find((t) => t.id === b.tripId);
    const matchesSearch =
      !search ||
      user?.name.toLowerCase().includes(search.toLowerCase()) ||
      b.bookingId.toLowerCase().includes(search.toLowerCase()) ||
      trip?.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bookings"
        description={`${bookings.length} total bookings · ${bookings.filter((b) => b.status === "CONFIRMED").length} confirmed`}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Bookings" },
        ]}
        actions={
          <button className="inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-2.5 text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        }
      />

      {/* Filters */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            placeholder="Search by name, booking ID, trip..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                statusFilter === s
                  ? "bg-[hsl(var(--primary))] text-white"
                  : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--primary)/0.1)]"
              )}
            >
              {s === "ALL" ? "All" : s.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.5)]">
                <th className="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Booking ID</th>
                <th className="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Traveler</th>
                <th className="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Trip</th>
                <th className="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Paid</th>
                <th className="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Remaining</th>
                <th className="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Status</th>
                <th className="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--border))]">
              {filtered.map((b) => {
                const user = users.find((u) => u.id === b.userId);
                const trip = trips.find((t) => t.id === b.tripId);
                return (
                  <tr key={b.id} className="hover:bg-[hsl(var(--muted)/0.3)] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-[hsl(var(--primary))]">{b.bookingId}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-[hsl(var(--foreground))]">{user?.name ?? "—"}</p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">{user?.email ?? "—"}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[hsl(var(--foreground))] truncate max-w-[180px]">{trip?.title ?? "—"}</td>
                    <td className="px-4 py-3 font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(b.amountPaid)}</td>
                    <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{formatCurrency(b.remainingAmount)}</td>
                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                    <td className="px-4 py-3 text-[hsl(var(--muted-foreground))] text-xs">{formatDate(b.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
