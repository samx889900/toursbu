import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getBookingById } from "@/lib/data/bookings";
import { getTripById } from "@/lib/data/trips";
import { getPaymentsByBookingId } from "@/lib/data/payments";
import { currentUser } from "@/lib/data/users";
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
import type { Day } from "@toursbu/types";
import { Button } from "@/components/ui/button";

export default async function TripJourneyPage(props: {
  params: Promise<{ bookingId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  
  const booking = getBookingById(params.bookingId);
  if (!booking || booking.userId !== currentUser.id) {
    notFound();
  }

  const trip = getTripById(booking.tripId);
  if (!trip) {
    notFound();
  }

  const payments = getPaymentsByBookingId(booking.id);
  const activeTab = (searchParams.tab as string) || "overview";

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "itinerary", label: "Itinerary" },
    { id: "payments", label: "Payments" },
    { id: "travel", label: "Travel" },
    { id: "community", label: "Community" },
    { id: "documents", label: "Documents" },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Back button & Header */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-caption font-medium text-[var(--tbu-muted)] hover:text-[var(--tbu-ink)] mb-4 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-display-sm text-[var(--tbu-ink)]">{trip.title}</h1>
            <div className="mt-2 flex items-center gap-4 text-caption text-[var(--tbu-muted)]">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {trip.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={cn(
              "rounded-full px-3 py-1 text-caption-sm font-bold uppercase tracking-wider",
              booking.status === "CONFIRMED" ? "bg-[var(--tbu-green-soft)] text-[var(--tbu-green)]" :
              booking.status === "WAITLISTED" ? "bg-orange-500/10 text-orange-600" :
              booking.status === "PENDING_PAYMENT" ? "bg-[var(--tbu-blue-soft)] text-[var(--tbu-blue)]" :
              "bg-[var(--tbu-surface)] text-[var(--tbu-muted)]"
            )}>
              {booking.status.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation (Scrollable on mobile) */}
      <div className="sticky top-16 z-20 -mx-4 overflow-x-auto px-4 pb-2 sm:static sm:mx-0 sm:overflow-visible sm:px-0 sm:pb-0 bg-[var(--tbu-background)] border-b border-[var(--tbu-hairline)]">
        <nav className="flex space-x-8 min-w-max">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={`/dashboard/trips/${booking.id}?tab=${tab.id}`}
              className={cn(
                "whitespace-nowrap pb-3 text-body-sm font-medium transition-colors border-b-2",
                activeTab === tab.id
                  ? "border-[var(--tbu-ink)] text-[var(--tbu-ink)]"
                  : "border-transparent text-[var(--tbu-muted)] hover:border-[var(--tbu-surface)] hover:text-[var(--tbu-ink)]"
              )}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="pt-2">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-8">
              <div className="overflow-hidden rounded-2xl border border-[var(--tbu-hairline)] relative h-72 w-full shadow-sm">
                <Image src={trip.images?.[0]?.url || trip.coverImage || "/placeholder.jpg"} alt={trip.title} fill className="object-cover" />
              </div>
              
              <section>
                <h2 className="text-heading-md text-[var(--tbu-ink)] mb-4">About this trip</h2>
                <p className="text-body text-[var(--tbu-muted)] leading-relaxed text-balance">
                  {trip.description}
                </p>
              </section>
            </div>
            
            <div className="space-y-8">
              {/* Checklist */}
              <div className="rounded-2xl border border-[var(--tbu-hairline)] bg-[var(--tbu-canvas)] p-6 shadow-tbu-1">
                <h3 className="text-heading-sm text-[var(--tbu-ink)] mb-6">Before You Travel</h3>
                <div className="relative space-y-0 before:absolute before:inset-0 before:ml-[1.15rem] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[var(--tbu-hairline)] before:to-transparent">
                  
                  {/* Step 1: Pay Remaining */}
                  <div className="relative flex items-center justify-between group py-3">
                    <div className={cn("flex items-center justify-center w-10 h-10 rounded-full border-2 border-[var(--tbu-canvas)] shadow shrink-0 z-10 transition-colors", booking.remainingAmount === 0 ? "bg-[var(--tbu-green)] text-white" : "bg-[var(--tbu-surface)] text-[var(--tbu-muted)]")}>
                      {booking.remainingAmount === 0 ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                    </div>
                    <div className="w-[calc(100%-3.5rem)] ml-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className={cn("text-body-sm font-semibold", booking.remainingAmount === 0 ? "text-[var(--tbu-muted)] line-through" : "text-[var(--tbu-ink)]")}>
                          Final Payment
                        </p>
                        {booking.remainingAmount > 0 && (
                          <Link href={`?tab=payments`} className="text-[10px] uppercase tracking-wider font-bold text-[var(--tbu-blue)] bg-[var(--tbu-blue-soft)] px-2 py-0.5 rounded-sm hover:bg-[var(--tbu-blue)] hover:text-white transition-colors">
                            Pay ₹{booking.remainingAmount.toLocaleString()}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Step 2: WhatsApp */}
                  <div className="relative flex items-center justify-between group py-3">
                    <div className={cn("flex items-center justify-center w-10 h-10 rounded-full border-2 border-[var(--tbu-canvas)] shadow shrink-0 z-10 transition-colors", booking.whatsappJoined ? "bg-[var(--tbu-green)] text-white" : "bg-[var(--tbu-surface)] text-[var(--tbu-muted)]")}>
                      {booking.whatsappJoined ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                    </div>
                    <div className="w-[calc(100%-3.5rem)] ml-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className={cn("text-body-sm font-semibold", booking.whatsappJoined ? "text-[var(--tbu-muted)] line-through" : "text-[var(--tbu-ink)]")}>
                          Join WhatsApp
                        </p>
                        {!booking.whatsappJoined && (
                          <Link href={`?tab=community`} className="text-[10px] uppercase tracking-wider font-bold text-[var(--tbu-green)] bg-[var(--tbu-green-soft)] px-2 py-0.5 rounded-sm hover:bg-[var(--tbu-green)] hover:text-white transition-colors">
                            Join Now
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Step 3: Emergency Contacts */}
                  <div className="relative flex items-center justify-between group py-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[var(--tbu-canvas)] bg-[var(--tbu-green)] text-white shadow shrink-0 z-10">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div className="w-[calc(100%-3.5rem)] ml-4">
                      <p className="text-body-sm font-semibold text-[var(--tbu-muted)] line-through">Save Contacts</p>
                    </div>
                  </div>
                  
                  {/* Step 4: ID Upload */}
                  <div className="relative flex items-center justify-between group py-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[var(--tbu-canvas)] bg-[var(--tbu-surface)] text-[var(--tbu-muted)] shadow shrink-0 z-10">
                      <Circle className="h-5 w-5" />
                    </div>
                    <div className="w-[calc(100%-3.5rem)] ml-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-body-sm font-semibold text-[var(--tbu-ink)]">Upload Govt ID</p>
                        <Link href={`?tab=documents`} className="text-[10px] uppercase tracking-wider font-bold text-[var(--tbu-ink)] bg-[var(--tbu-surface)] px-2 py-0.5 rounded-sm hover:bg-[var(--tbu-hairline)] transition-colors">
                          Upload
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ITINERARY TAB */}
        {activeTab === "itinerary" && (
          <div className="max-w-3xl space-y-8">
            <h2 className="text-heading-md text-[var(--tbu-ink)]">Trip Itinerary</h2>
            <div className="space-y-8 border-l-2 border-[var(--tbu-hairline)] ml-3 pl-8">
              {(trip.days || []).map((day: Day, idx: number) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[41px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--tbu-blue)] ring-4 ring-[var(--tbu-background)]">
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  </div>
                  <h3 className="text-heading-sm text-[var(--tbu-ink)]">Day {day.dayNumber}: {day.title}</h3>
                  <p className="mt-3 text-body-sm text-[var(--tbu-muted)] leading-relaxed">{day.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === "payments" && (
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-heading-md text-[var(--tbu-ink)]">Payment Timeline</h2>
              
              <div className="space-y-0 pl-2">
                {/* Timeline item 1 */}
                <div className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--tbu-green-soft)] text-[var(--tbu-green)] ring-4 ring-[var(--tbu-background)]">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div className="h-16 w-0.5 bg-[var(--tbu-green-soft)] my-1" />
                  </div>
                  <div className="pt-2">
                    <h4 className="text-body font-bold text-[var(--tbu-ink)]">₹{booking.amountPaid.toLocaleString()} Paid</h4>
                    <p className="text-caption text-[var(--tbu-muted)] mt-1">Advance payment successful</p>
                  </div>
                </div>
                
                {/* Timeline item 2 */}
                <div className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-full ring-4 ring-[var(--tbu-background)]", booking.status === "CONFIRMED" ? "bg-[var(--tbu-green-soft)] text-[var(--tbu-green)]" : "bg-orange-500/20 text-orange-600")}>
                      {booking.status === "CONFIRMED" ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                    </div>
                    <div className={cn("h-16 w-0.5 my-1", booking.status === "CONFIRMED" ? "bg-[var(--tbu-green-soft)]" : "bg-[var(--tbu-hairline)]")} />
                  </div>
                  <div className="pt-2">
                    <h4 className="text-body font-bold text-[var(--tbu-ink)]">Booking {booking.status === "CONFIRMED" ? "Confirmed" : "Processing"}</h4>
                    <p className="text-caption text-[var(--tbu-muted)] mt-1">Your seat is secured.</p>
                  </div>
                </div>
                
                {/* Timeline item 3 */}
                <div className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-full ring-4 ring-[var(--tbu-background)]", booking.remainingAmount === 0 ? "bg-[var(--tbu-green-soft)] text-[var(--tbu-green)]" : "bg-[var(--tbu-surface)] text-[var(--tbu-muted)]")}>
                      {booking.remainingAmount === 0 ? <CheckCircle2 className="h-5 w-5" /> : <CreditCard className="h-4 w-4" />}
                    </div>
                  </div>
                  <div className="pt-2">
                    <h4 className="text-body font-bold text-[var(--tbu-ink)]">₹{booking.remainingAmount.toLocaleString()} Due</h4>
                    <p className="text-caption text-[var(--tbu-muted)] mt-1">Final payment before departure</p>
                    {booking.remainingAmount > 0 && (
                      <Button className="mt-4 rounded-full shadow-tbu-1" size="sm">
                        Pay Now
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-heading-md text-[var(--tbu-ink)]">Transaction History</h2>
              <div className="rounded-2xl border border-[var(--tbu-hairline)] bg-[var(--tbu-canvas)] overflow-hidden shadow-sm">
                <div className="divide-y divide-[var(--tbu-hairline)]">
                  {payments.length === 0 ? (
                    <div className="p-8 text-center text-[var(--tbu-muted)]">No transactions yet</div>
                  ) : (
                    payments.map(p => (
                      <div key={p.id} className="p-5 flex items-center justify-between hover:bg-[var(--tbu-surface)] transition-colors">
                        <div>
                          <p className="font-semibold text-body-sm text-[var(--tbu-ink)]">₹{p.amount.toLocaleString()}</p>
                          <p className="text-caption text-[var(--tbu-muted)] mt-0.5">{new Date(p.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider", 
                            p.status === "PAID" ? "bg-[var(--tbu-green-soft)] text-[var(--tbu-green)]" : "bg-[var(--tbu-surface)] text-[var(--tbu-muted)]"
                          )}>
                            {p.status}
                          </span>
                          {p.receiptUrl && (
                            <button className="text-caption-sm text-[var(--tbu-blue)] hover:underline flex items-center gap-1 font-medium">
                              <Download className="h-3 w-3" /> Receipt
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TRAVEL TAB */}
        {activeTab === "travel" && (
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-heading-md text-[var(--tbu-ink)]">Logistics</h2>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[var(--tbu-hairline)] bg-[var(--tbu-canvas)] p-6 text-center shadow-sm">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--tbu-blue-soft)]">
                    <Bus className="h-7 w-7 text-[var(--tbu-blue)]" />
                  </div>
                  <p className="text-caption text-[var(--tbu-muted)] mb-1">Bus Allocation</p>
                  <p className="font-bold text-heading-sm text-[var(--tbu-ink)]">{booking.busAllocation || "Pending"}</p>
                </div>
                
                <div className="rounded-2xl border border-[var(--tbu-hairline)] bg-[var(--tbu-canvas)] p-6 text-center shadow-sm">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--tbu-blue-soft)]">
                    <Bed className="h-7 w-7 text-[var(--tbu-blue)]" />
                  </div>
                  <p className="text-caption text-[var(--tbu-muted)] mb-1">Room Allocation</p>
                  <p className="font-bold text-heading-sm text-[var(--tbu-ink)]">{booking.roomAllocation || "Pending"}</p>
                </div>
              </div>
              
              <div className="rounded-2xl border border-[var(--tbu-hairline)] bg-[var(--tbu-canvas)] p-6 shadow-sm">
                <h3 className="text-heading-sm text-[var(--tbu-ink)] mb-4">Pickup Point</h3>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[var(--tbu-muted)] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-body-sm text-[var(--tbu-ink)]">University Main Gate</p>
                    <p className="text-caption text-[var(--tbu-muted)] mt-1">Reporting Time: {new Date(trip.startDate).toLocaleDateString()} at 05:00 AM</p>
                    <a href="#" className="text-caption-sm text-[var(--tbu-blue)] hover:underline mt-3 inline-block font-medium">Open in Google Maps</a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-heading-md text-[var(--tbu-ink)]">Emergency Contacts</h2>
              <div className="space-y-4">
                <div className="rounded-2xl border border-[var(--tbu-hairline)] bg-[var(--tbu-canvas)] p-5 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="font-bold text-body-sm text-[var(--tbu-ink)]">Trip Captain (Priya)</p>
                    <p className="text-caption text-[var(--tbu-muted)] mt-0.5">Primary Organizer</p>
                  </div>
                  <a href="tel:1234567890" className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--tbu-surface)] text-[var(--tbu-ink)] transition-colors hover:bg-[var(--tbu-hairline)]">
                    <Phone className="h-5 w-5" />
                  </a>
                </div>
                
                <div className="rounded-2xl border border-[var(--tbu-hairline)] bg-[var(--tbu-canvas)] p-5 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="font-bold text-body-sm text-[var(--tbu-ink)]">Bus Driver (Ramesh)</p>
                    <p className="text-caption text-[var(--tbu-muted)] mt-0.5">Emergency Only</p>
                  </div>
                  <a href="tel:1234567890" className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--tbu-surface)] text-[var(--tbu-ink)] transition-colors hover:bg-[var(--tbu-hairline)]">
                    <Phone className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COMMUNITY TAB */}
        {activeTab === "community" && (
          <div className="max-w-3xl space-y-8">
            <h2 className="text-heading-md text-[var(--tbu-ink)]">Community & Updates</h2>
            
            <div className="rounded-3xl bg-[#25D366]/10 border border-[#25D366]/20 p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md">
                  <MessageCircle className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-bold text-heading-sm text-[#128C7E]">Official WhatsApp Group</h3>
                  <p className="text-body-sm text-[#128C7E]/80 mt-1">Join to get real-time updates and connect with others.</p>
                </div>
              </div>
              <Button className="rounded-full bg-[#25D366] text-white hover:bg-[#20bd5a] shadow-md hover:shadow-lg whitespace-nowrap px-8">
                Join Group
              </Button>
            </div>
            
            <div className="mt-10">
              <h3 className="text-heading-sm text-[var(--tbu-ink)] mb-6">Announcements</h3>
              <div className="space-y-4">
                <div className="rounded-2xl border border-[var(--tbu-hairline)] bg-[var(--tbu-canvas)] p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                  <div className="flex items-center gap-3 mb-3">
                    <span className="rounded bg-red-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-500">Important</span>
                    <span className="text-caption text-[var(--tbu-muted)]">2 days ago</span>
                  </div>
                  <h4 className="font-bold text-body text-[var(--tbu-ink)] mb-2">Carry heavy woolens</h4>
                  <p className="text-body-sm text-[var(--tbu-muted)] leading-relaxed">Temperatures in Manali are dropping to -2°C. Please ensure you carry adequate thermal wear and heavy jackets.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === "documents" && (
          <div className="max-w-3xl space-y-8">
            <h2 className="text-heading-md text-[var(--tbu-ink)]">Trip Documents</h2>
            
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-2xl border border-[var(--tbu-hairline)] bg-[var(--tbu-canvas)] p-5 hover:border-[var(--tbu-blue-soft)] hover:shadow-sm transition-all group">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-body-sm text-[var(--tbu-ink)]">Trip Brochure</h4>
                    <p className="text-caption text-[var(--tbu-muted)] mt-0.5">PDF • 2.4 MB</p>
                  </div>
                </div>
                <button className="text-[var(--tbu-muted)] group-hover:text-[var(--tbu-blue)] group-hover:bg-[var(--tbu-blue-soft)] p-2 rounded-full transition-all">
                  <Download className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-[var(--tbu-hairline)] bg-[var(--tbu-canvas)] p-5 hover:border-[var(--tbu-blue-soft)] hover:shadow-sm transition-all group">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-body-sm text-[var(--tbu-ink)]">Packing List</h4>
                    <p className="text-caption text-[var(--tbu-muted)] mt-0.5">PDF • 1.1 MB</p>
                  </div>
                </div>
                <button className="text-[var(--tbu-muted)] group-hover:text-[var(--tbu-blue)] group-hover:bg-[var(--tbu-blue-soft)] p-2 rounded-full transition-all">
                  <Download className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex items-center justify-between rounded-2xl border border-[var(--tbu-hairline)] bg-[var(--tbu-canvas)] p-5 hover:border-[var(--tbu-blue-soft)] hover:shadow-sm transition-all group">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-body-sm text-[var(--tbu-ink)]">Consent Form</h4>
                    <p className="text-caption text-[var(--tbu-muted)] mt-0.5">Required Signature</p>
                  </div>
                </div>
                <button className="text-[var(--tbu-muted)] group-hover:text-[var(--tbu-blue)] group-hover:bg-[var(--tbu-blue-soft)] p-2 rounded-full transition-all">
                  <Download className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="mt-8 rounded-3xl border-2 border-dashed border-[var(--tbu-hairline)] bg-[var(--tbu-surface)] p-10 text-center hover:bg-[var(--tbu-canvas)] transition-colors cursor-pointer group">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--tbu-background)] group-hover:scale-110 transition-transform duration-300">
                <FileText className="h-8 w-8 text-[var(--tbu-muted)]" />
              </div>
              <h4 className="font-bold text-heading-sm text-[var(--tbu-ink)]">Upload Government ID</h4>
              <p className="text-body-sm text-[var(--tbu-muted)] mt-2 mb-6 max-w-sm mx-auto">Aadhar Card or College ID is required for hotel check-in.</p>
              <Button variant="outline" className="rounded-full shadow-sm">
                Choose File
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
