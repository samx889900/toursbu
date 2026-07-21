"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { cn, formatCurrency } from "@/lib/utils";
import { CheckCircle2, ChevronLeft, Download, ExternalLink, MessageSquare, Plus, Bus, Bed } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { promoteWaitlistAction, verifyDocumentAction } from "@/actions/admin-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "travelers", label: "Travelers" },
  { id: "payments", label: "Payments" },
  { id: "timeline", label: "Timeline" },
  { id: "docs", label: "Documents" },
  { id: "notes", label: "Notes" },
];

export function AdminBookingClient({ booking }: { booking: any }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isPromoting, setIsPromoting] = useState(false);
  const router = useRouter();

  const handlePromote = async () => {
    try {
      setIsPromoting(true);
      await promoteWaitlistAction(booking.id);
      toast.success("Waitlist promoted successfully");
      router.refresh();
    } catch (err) {
      toast.error("Failed to promote waitlist");
    } finally {
      setIsPromoting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/bookings" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4">
          <ChevronLeft className="w-4 h-4" /> Back to Bookings
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Booking {booking.bookingNumber}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              For <Link href={`/admin/trips/${booking.tripId}`} className="text-blue-600 hover:underline">{booking.trip.title}</Link> • Booked by {booking.user.name}
            </p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-bold uppercase tracking-wider flex items-center">
              {booking.status.replace(/_/g, " ")}
            </span>
            {booking.status === "WAITLISTED" && (
              <Button onClick={handlePromote} disabled={isPromoting}>
                {isPromoting ? "Promoting..." : "Promote Waitlist"}
              </Button>
            )}
            <Button variant="outline">Admin Actions</Button>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === tab.id
                  ? "border-[var(--tbu-blue)] text-[var(--tbu-blue)]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="pt-2">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-lg">Financial Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-xl font-bold">{formatCurrency(booking.totalAmount)}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">Amount Paid</p>
                    <p className="text-xl font-bold text-green-700">{formatCurrency(booking.amountPaid)}</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-600">Remaining Balance</p>
                    <p className="text-xl font-bold text-red-700">{formatCurrency(booking.totalAmount - booking.amountPaid)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-lg">Quick Contact</h3>
                <div className="flex flex-col gap-2">
                  <p className="text-sm"><span className="font-medium text-gray-500">Student:</span> {booking.user.name}</p>
                  <p className="text-sm"><span className="font-medium text-gray-500">Email:</span> {booking.user.email}</p>
                  <p className="text-sm"><span className="font-medium text-gray-500">Phone:</span> {booking.user.phone || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "travelers" && (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 font-semibold text-gray-900">Contact</th>
                  <th className="px-6 py-3 font-semibold text-gray-900">Type</th>
                  <th className="px-6 py-3 font-semibold text-gray-900">Allocations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {booking.travelers.map((t: any) => (
                  <tr key={t.id}>
                    <td className="px-6 py-4 font-medium text-gray-900">{t.name}</td>
                    <td className="px-6 py-4 text-gray-500">
                      <div>{t.email}</div>
                      <div>{t.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      {t.isPrimary ? <span className="text-blue-600 font-medium text-xs bg-blue-50 px-2 py-1 rounded">PRIMARY</span> : <span className="text-gray-500 text-xs">GUEST</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="flex items-center gap-1"><Bus className="w-3 h-3"/> {t.busAllocation?.bus ? `Bus ${t.busAllocation.bus.busNumber}` : "Unallocated"}</span>
                        <span className="flex items-center gap-1"><Bed className="w-3 h-3"/> {t.roomAllocation?.room ? `Room ${t.roomAllocation.room.roomNumber}` : "Unallocated"}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-3 font-semibold text-gray-900">Amount</th>
                  <th className="px-6 py-3 font-semibold text-gray-900">Method</th>
                  <th className="px-6 py-3 font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 font-semibold text-gray-900">Txn ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {booking.payments.map((p: any) => (
                  <tr key={p.id}>
                    <td className="px-6 py-4 text-gray-500">{new Date(p.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 font-medium">{formatCurrency(p.amount)}</td>
                    <td className="px-6 py-4 text-gray-500">{p.method}</td>
                    <td className="px-6 py-4">
                      <span className={cn("px-2 py-1 rounded text-xs font-medium", p.status === "SUCCESS" ? "bg-green-100 text-green-700" : p.status === "FAILED" ? "bg-red-100 text-red-700" : "bg-gray-100")}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-gray-500">{p.transactionId || "-"}</td>
                  </tr>
                ))}
                {booking.payments.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No payments found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "timeline" && (
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="space-y-6">
              {booking.events.map((e: any) => (
                <div key={e.id} className="flex gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{e.eventType.replace(/_/g, " ")}</p>
                    <p className="text-xs text-gray-500">{new Date(e.createdAt).toLocaleString()} • {e.actor?.name || "System"}</p>
                    {e.metadata && <pre className="mt-2 text-[10px] bg-gray-50 p-2 rounded text-gray-600">{JSON.stringify(e.metadata, null, 2)}</pre>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "notes" && (
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold">Internal Notes</h3>
              <Button size="sm" variant="outline"><Plus className="w-4 h-4 mr-1"/> Add Note</Button>
            </div>
            <div className="space-y-4">
              {booking.notes.map((n: any) => (
                <div key={n.id} className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{n.content}</p>
                  <p className="text-xs text-gray-500 mt-2">— {n.author.name} on {new Date(n.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
              {booking.notes.length === 0 && <p className="text-sm text-gray-500">No internal notes added.</p>}
            </div>
          </div>
        )}

        {activeTab === "docs" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h3 className="font-bold mb-4">Traveler Documents (Government IDs)</h3>
              <div className="space-y-4">
                {booking.travelers.map((t: any) => (
                  <div key={t.id} className="p-4 bg-gray-50 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="font-bold">{t.name}</p>
                      <p className="text-sm text-gray-500">{t.governmentIdType}: {t.governmentIdNumber}</p>
                    </div>
                    <div>
                      {t.documents && t.documents.length > 0 ? (
                        t.documents.map((doc: any) => (
                          <div key={doc.id} className="flex items-center gap-3">
                            <span className={cn(
                              "text-xs font-bold px-2 py-1 rounded-full",
                              doc.verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                            )}>
                              {doc.verified ? "Verified" : "Pending"}
                            </span>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/api/documents/download?id=${doc.id}`} target="_blank">View</Link>
                            </Button>
                            {!doc.verified ? (
                              <Button variant="default" size="sm" onClick={async () => {
                                const res = await verifyDocumentAction(doc.id, true);
                                if (res.success) {
                                  toast.success("Document verified");
                                  router.refresh();
                                }
                              }}>Verify</Button>
                            ) : (
                              <Button variant="danger" size="sm" onClick={async () => {
                                const res = await verifyDocumentAction(doc.id, false);
                                if (res.success) {
                                  toast.success("Document rejected");
                                  router.refresh();
                                }
                              }}>Reject</Button>
                            )}
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-red-500 font-medium">No document uploaded</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h3 className="font-bold mb-4">Receipts & Invoices</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {booking.receipts.map((r: any) => (
                  <div key={r.id} className="flex items-center justify-between p-4 border rounded-lg hover:border-blue-300 transition-colors">
                    <div>
                      <p className="font-medium text-sm">{r.receiptNumber}</p>
                      <p className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                    {r.pdfUrl ? (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={r.pdfUrl} target="_blank"><Download className="w-4 h-4 mr-2" /> Download</Link>
                      </Button>
                    ) : <span className="text-xs text-gray-400">Processing</span>}
                  </div>
                ))}
                {booking.receipts.length === 0 && <p className="text-sm text-gray-500">No documents found.</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
