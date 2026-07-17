"use client";

import { useState } from "react";
import { Search, Download, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { formatCurrency, cn } from "@/lib/utils";
import Link from "next/link";

const statusFilters = [
  "ALL", "DRAFT", "PENDING_PAYMENT", "ADVANCE_PAID", "PARTIALLY_PAID", "FULLY_PAID", "CONFIRMED",
  "WAITLISTED", "COMPLETED", "CANCELLED", "REFUNDED", "NO_SHOW"
] as const;

export function BookingsClient({ initialBookings }: { initialBookings: any[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filtered = initialBookings.filter((b) => {
    const matchesSearch =
      !search ||
      b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.bookingNumber?.toLowerCase().includes(search.toLowerCase()) ||
      b.trip?.title?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = async () => {
    // Basic CSV export
    const headers = ["Booking Number", "Traveler", "Trip", "Paid", "Remaining", "Status", "Date"];
    const rows = filtered.map(b => [
      b.bookingNumber,
      `"${b.user?.name || ""}"`,
      `"${b.trip?.title || ""}"`,
      b.amountPaid,
      b.totalAmount - b.amountPaid,
      b.status,
      new Date(b.createdAt).toLocaleDateString()
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bookings.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bookings"
        description={`${initialBookings.length} total bookings`}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Bookings" },
        ]}
        actions={
          <button onClick={handleExport} className="inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-2.5 text-sm font-medium text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]">
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
                <th className="px-4 py-3 text-right font-medium text-[hsl(var(--muted-foreground))]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--border))]">
              {filtered.map((b) => {
                const remaining = b.totalAmount - b.amountPaid;
                return (
                  <tr key={b.id} className="hover:bg-[hsl(var(--muted)/0.3)] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">{b.bookingNumber}</td>
                    <td className="px-4 py-3 font-medium">{b.user?.name}</td>
                    <td className="px-4 py-3">{b.trip?.title}</td>
                    <td className="px-4 py-3 text-[hsl(var(--primary))] font-medium">{formatCurrency(b.amountPaid)}</td>
                    <td className="px-4 py-3 text-red-500 font-medium">{formatCurrency(remaining)}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {b.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[hsl(var(--muted-foreground))]">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/bookings/${b.id}`} className="inline-flex items-center justify-center rounded-lg p-1.5 hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-[hsl(var(--muted-foreground))]">
                    No bookings found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
