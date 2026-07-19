import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Calendar,
  CheckCircle2,
  Circle,
  CreditCard,
  MessageCircle,
  Download,
  Phone,
  Bus,
  Bed,
  FileText,
  Clock,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { JoinWhatsAppButton } from "@/components/dashboard/join-whatsapp-button";

export default async function TripJourneyPage(props: {
  params: Promise<{ bookingId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  
  const session = await getSession();
  if (!session?.user) redirect("/auth/signin?callbackUrl=/dashboard/trips");

  const booking = await prisma.booking.findUnique({
    where: { id: params.bookingId },
    include: {
      trip: {
        include: { days: true, whatsappGroup: true }
      },
      travelers: {
        include: { 
          roomAllocation: { include: { room: true } }, 
          busAllocation: { include: { bus: true } },
          documents: true
        }
      },
      emergencyContacts: true,
      payments: { orderBy: { createdAt: "desc" } },
      events: { orderBy: { createdAt: "desc" } },
      invoices: true,
      receipts: true
    }
  });

  if (!booking || booking.userId !== session.user.id) {
    notFound();
  }

  const trip = booking.trip;
  const activeTab = (searchParams.tab as string) || "overview";

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "itinerary", label: "Itinerary" },
    { id: "payments", label: "Payments" },
    { id: "travel", label: "Travel & Rooms" },
    { id: "documents", label: "Documents" },
  ];

  const primaryTraveler = booking.travelers.find(t => t.isPrimary) || booking.travelers[0];
  const remainingAmount = booking.totalAmount - booking.amountPaid;
  const progressPercent = Math.round((booking.amountPaid / booking.totalAmount) * 100) || 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Back button & Header */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 mb-4 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{trip.title}</h1>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {trip.location || "Multiple Locations"}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {trip.startDate ? new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "TBD"}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={cn(
              "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
              booking.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
              booking.status === "WAITLISTED" ? "bg-orange-100 text-orange-700" :
              ["PENDING_PAYMENT", "PARTIALLY_PAID"].includes(booking.status) ? "bg-blue-100 text-blue-700" :
              "bg-gray-100 text-gray-700"
            )}>
              {booking.status.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={`/dashboard/trips/${booking.id}?tab=${tab.id}`}
              className={cn(
                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === tab.id
                  ? "border-[var(--tbu-blue)] text-[var(--tbu-blue)]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === "overview" && (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Payment Progress</h3>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <span className="text-2xl font-bold">₹{booking.amountPaid}</span>
                    <span className="text-gray-500 text-sm"> / ₹{booking.totalAmount}</span>
                  </div>
                  {remainingAmount > 0 && (
                    <span className="text-sm text-red-500 font-medium text-right block">₹{remainingAmount} Remaining</span>
                  )}
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden mt-3">
                  <div className="h-full bg-[var(--tbu-blue)] transition-all" style={{ width: `${progressPercent}%` }} />
                </div>
                {remainingAmount > 0 && (
                  <div className="mt-6 flex gap-3">
                    <Button asChild>
                      <Link href={`/trips/${trip.slug}/book/payment?bookingId=${booking.id}`}>
                        Pay Remaining Balance
                      </Link>
                    </Button>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl border p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-green-500" /> WhatsApp Community
                </h3>
                {trip.whatsappGroup ? (
                  ["CONFIRMED", "ADVANCE_PAID", "PARTIALLY_PAID"].includes(booking.status) ? (
                    <div>
                      <p className="text-sm text-gray-600 mb-4">Join the official WhatsApp group to connect with fellow travelers and get real-time updates from your tour captains.</p>
                      <JoinWhatsAppButton 
                        bookingId={booking.id} 
                        inviteLink={trip.whatsappGroup.inviteLink} 
                        hasJoined={booking.whatsappJoined} 
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">You must complete your advance payment to join the WhatsApp group.</p>
                  )
                ) : (
                  <p className="text-sm text-gray-500">The WhatsApp group for this trip will be created closer to the departure date.</p>
                )}
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl border p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Travelers ({booking.travelerCount})</h3>
                <ul className="space-y-3">
                  {booking.travelers.map(t => (
                    <li key={t.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{t.name} {t.isPrimary && "(Primary)"}</div>
                        {t.phone && <div className="text-xs text-gray-500">{t.phone}</div>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white rounded-xl border p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Emergency Contact</h3>
                {booking.emergencyContacts.length > 0 ? (
                  <div className="text-sm">
                    <div className="font-medium">{booking.emergencyContacts[0].name}</div>
                    <div className="text-gray-500 mb-1">{booking.emergencyContacts[0].relation}</div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" /> {booking.emergencyContacts[0].phone}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-red-500">No emergency contact provided.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "itinerary" && (
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Trip Itinerary</h3>
            {trip.days.length > 0 ? (
              <div className="space-y-6">
                {trip.days.map((day, idx) => (
                  <div key={day.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      {idx !== trip.days.length - 1 && <div className="w-0.5 h-full bg-gray-200 mt-2" />}
                    </div>
                    <div className="pb-6">
                      <h4 className="font-bold text-lg">{day.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Itinerary details will be available soon.</p>
            )}
          </div>
        )}

        {activeTab === "payments" && (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-gray-900">Date</th>
                    <th className="px-6 py-3 font-semibold text-gray-900">Amount</th>
                    <th className="px-6 py-3 font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 font-semibold text-gray-900">Transaction ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {booking.payments.map(payment => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">₹{payment.amount}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          payment.status === "SUCCESS" ? "bg-green-100 text-green-700" :
                          payment.status === "FAILED" ? "bg-red-100 text-red-700" :
                          "bg-gray-100 text-gray-700"
                        )}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-mono text-xs">{payment.transactionId || "-"}</td>
                    </tr>
                  ))}
                  {booking.payments.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No payments recorded yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "travel" && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Bus className="w-5 h-5 text-blue-500" /> Bus Allocation
              </h3>
              <ul className="space-y-4">
                {booking.travelers.map(t => (
                  <li key={t.id} className="flex justify-between items-center pb-3 border-b last:border-0 last:pb-0">
                    <span className="font-medium text-sm">{t.name}</span>
                    {t.busAllocation?.bus ? (
                      <span className="text-sm text-green-600 font-medium">Bus {t.busAllocation.bus.busNumber} {t.busAllocation.seatNumber ? `(Seat ${t.busAllocation.seatNumber})` : ""}</span>
                    ) : (
                      <span className="text-sm text-gray-400">Pending Assignment</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Bed className="w-5 h-5 text-purple-500" /> Room Allocation
              </h3>
              <ul className="space-y-4">
                {booking.travelers.map(t => (
                  <li key={t.id} className="flex justify-between items-center pb-3 border-b last:border-0 last:pb-0">
                    <span className="font-medium text-sm">{t.name}</span>
                    {t.roomAllocation?.room ? (
                      <span className="text-sm text-green-600 font-medium">Room {t.roomAllocation.room.roomNumber} ({t.roomAllocation.room.type})</span>
                    ) : (
                      <span className="text-sm text-gray-400">Pending Assignment</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-6">Government IDs & Documents</h3>
              <div className="space-y-4">
                {booking.travelers.map(t => (
                  <div key={t.id} className="p-4 border rounded-lg bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-gray-900">{t.name}</h4>
                      <p className="text-sm text-gray-500">{t.governmentIdType}: {t.governmentIdNumber}</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      {t.documents && t.documents.length > 0 ? (
                        t.documents.map(doc => (
                          <div key={doc.id} className="flex items-center gap-3">
                            <span className={cn(
                              "text-xs font-bold px-2 py-1 rounded-full",
                              doc.verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                            )}>
                              {doc.verified ? "🟢 Verified" : "🟡 Pending Review"}
                            </span>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/api/documents/download?id=${doc.id}`} target="_blank">
                                <Download className="w-4 h-4 mr-2" /> View
                              </Link>
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-red-500 font-medium">Missing Document</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-6">Booking Receipts</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {booking.receipts.length > 0 ? booking.receipts.map(receipt => (
                  <div key={receipt.id} className="flex items-center justify-between p-4 border rounded-lg hover:border-blue-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-blue-500" />
                      <div>
                        <div className="font-medium text-sm">{receipt.receiptNumber}</div>
                        <div className="text-xs text-gray-500">{new Date(receipt.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    {receipt.pdfUrl ? (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={receipt.pdfUrl} target="_blank"><Download className="w-4 h-4 mr-2" /> Download</Link>
                      </Button>
                    ) : (
                      <span className="text-xs text-gray-400">Generating...</span>
                    )}
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 col-span-2">No receipts generated yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
