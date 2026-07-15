"use client";

import { payments } from "@/lib/data/payments";
import { bookings } from "@/lib/data/bookings";
import { users } from "@/lib/data/users";
import { StatusBadge } from "@/components/shared/status-badge";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { IndianRupee, CreditCard, AlertCircle, RotateCcw } from "lucide-react";

export default function AdminPaymentsPage() {
  const totalCollected = payments.filter((p) => p.status === "PAID").reduce((a, p) => a + p.amount, 0);
  const totalPending = payments.filter((p) => p.status === "PENDING").reduce((a, p) => a + p.amount, 0);
  const totalRefunded = payments.filter((p) => p.status === "REFUNDED").reduce((a, p) => a + p.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        description="Track all payment transactions across trips."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Payments" },
        ]}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Total Collected" value={formatCurrency(totalCollected)} icon={IndianRupee} iconColor="text-emerald-500" />
        <StatCard title="Pending Payments" value={formatCurrency(totalPending)} icon={AlertCircle} iconColor="text-amber-500" />
        <StatCard title="Total Refunded" value={formatCurrency(totalRefunded)} icon={RotateCcw} iconColor="text-red-500" />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.5)]">
                <th className="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Payment ID</th>
                <th className="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Traveler</th>
                <th className="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Method</th>
                <th className="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Status</th>
                <th className="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--border))]">
              {payments.map((p) => {
                const booking = bookings.find((b) => b.id === p.bookingId);
                const user = booking ? users.find((u) => u.id === booking.userId) : undefined;
                return (
                  <tr key={p.id} className="hover:bg-[hsl(var(--muted)/0.3)] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[hsl(var(--muted-foreground))]">{p.gatewayPaymentId || "—"}</td>
                    <td className="px-4 py-3 font-medium text-[hsl(var(--foreground))]">{user?.name ?? "—"}</td>
                    <td className="px-4 py-3 font-semibold text-[hsl(var(--foreground))]">{formatCurrency(p.amount)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--muted))] px-2.5 py-0.5 text-xs font-medium text-[hsl(var(--foreground))]">
                        <CreditCard className="h-3 w-3" />
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3 text-xs text-[hsl(var(--muted-foreground))]">{p.paidAt ? formatDate(p.paidAt) : "—"}</td>
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
