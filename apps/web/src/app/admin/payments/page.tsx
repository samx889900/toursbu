import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { formatCurrency, cn } from "@/lib/utils";
import { IndianRupee, CreditCard, AlertCircle, RotateCcw, Download } from "lucide-react";
import Link from "next/link";

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({
    include: {
      booking: {
        include: { user: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const totalCollected = payments.filter((p) => p.status === "SUCCESS").reduce((a, p) => a + p.amount, 0);
  const totalPending = payments.filter((p) => p.status === "PENDING").reduce((a, p) => a + p.amount, 0);
  const totalFailed = payments.filter((p) => p.status === "FAILED").reduce((a, p) => a + p.amount, 0);

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
        <StatCard title="Failed Attempts" value={formatCurrency(totalFailed)} icon={RotateCcw} iconColor="text-red-500" />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.5)]">
                <th className="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Transaction ID</th>
                <th className="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Booking ID</th>
                <th className="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Traveler</th>
                <th className="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Method</th>
                <th className="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Status</th>
                <th className="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--border))]">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-[hsl(var(--muted)/0.3)] transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-[hsl(var(--muted-foreground))]">{p.transactionId || "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[hsl(var(--muted-foreground))]">
                    <Link href={`/admin/bookings/${p.bookingId}`} className="hover:text-blue-600 hover:underline">
                      {p.booking.bookingNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-medium text-[hsl(var(--foreground))]">{p.booking.user.name}</td>
                  <td className="px-4 py-3 font-semibold text-[hsl(var(--foreground))]">{formatCurrency(p.amount)}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--muted))] px-2.5 py-0.5 text-xs font-medium text-[hsl(var(--foreground))]">
                      <CreditCard className="h-3 w-3" />
                      {p.method}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      p.status === "SUCCESS" ? "bg-green-100 text-green-700" :
                      p.status === "FAILED" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-700"
                    )}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[hsl(var(--muted-foreground))]">{new Date(p.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">No payments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
