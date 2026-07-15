import Link from "next/link";
import Image from "next/image";
import { currentUser } from "@/lib/data/users";
import { getBookingsByUserId } from "@/lib/data/bookings";
import { getTripById } from "@/lib/data/trips";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Calendar,
  ChevronRight,
  Download,
  MessageCircle,
  CreditCard,
  CheckCircle2,
  Circle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardHome() {
  const user = currentUser;
  const bookings = getBookingsByUserId(user.id);
  
  // Find the next upcoming trip (simplified for demo)
  const upcomingBooking = bookings.find(
    (b) => b.status === "CONFIRMED" || b.status === "PENDING_PAYMENT"
  );
  
  const upcomingTrip = upcomingBooking ? getTripById(upcomingBooking.tripId) : null;

  // If no upcoming trip, show Empty State
  if (!upcomingTrip || !upcomingBooking) {
    return (
      <div className="flex flex-col gap-8 max-w-2xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 overflow-hidden rounded-full border border-[var(--tbu-hairline)] relative shadow-sm">
            <Image src={user.avatar} alt={user.name} fill className="object-cover" />
          </div>
          <div>
            <h1 className="text-heading-lg text-[var(--tbu-ink)]">Hi, {user.name.split(" ")[0]}!</h1>
            <p className="text-body-sm text-[var(--tbu-muted)]">Ready for your next adventure?</p>
          </div>
        </div>

        <Card className="text-center py-12 px-6 bg-[var(--tbu-parchment)] border-dashed border-2">
          <CardContent className="flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--tbu-blue-soft)] mb-6 shadow-sm">
              <MapPin className="h-8 w-8 text-[var(--tbu-blue)]" />
            </div>
            <h2 className="text-heading-md mb-2 text-[var(--tbu-ink)]">No upcoming trips</h2>
            <p className="text-body-sm text-[var(--tbu-muted)] mb-8 max-w-sm mx-auto text-balance">
              Discover amazing college trips, explore new destinations, and create unforgettable memories with your friends.
            </p>
            <Button size="lg" className="rounded-full shadow-tbu-1 gap-2" asChild>
              <Link href="/trips">
                Explore Trips
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate days left
  const tripDate = new Date(upcomingTrip.startDate);
  const today = new Date("2026-07-15"); // Mock current date based on demo data
  const daysLeft = Math.ceil((tripDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

  // Calculate Progress (mock logic)
  const totalTasks = 5;
  let completedTasks = 0;
  if (upcomingBooking.status === "CONFIRMED") completedTasks++;
  if (upcomingBooking.amountPaid > 0) completedTasks++;
  if (upcomingBooking.remainingAmount === 0) completedTasks++;
  if (upcomingBooking.whatsappJoined) completedTasks++;
  if (upcomingBooking.roomAllocation) completedTasks++;
  
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 overflow-hidden rounded-full border border-[var(--tbu-hairline)] relative shadow-sm">
          <Image src={user.avatar} alt={user.name} fill className="object-cover" />
        </div>
        <div>
          <h1 className="text-heading-lg text-[var(--tbu-ink)]">Hi, {user.name.split(" ")[0]}!</h1>
          <p className="text-body-sm text-[var(--tbu-muted)]">Your next adventure awaits.</p>
        </div>
      </div>

      {/* Progress Ring / Gamification */}
      <Card className="overflow-hidden">
        <CardContent className="p-4 sm:p-5 flex items-center gap-4 sm:gap-6 bg-gradient-to-r from-[var(--tbu-blue-soft)] to-transparent">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
            <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="var(--tbu-canvas)"
                strokeWidth="3"
                className="opacity-50"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="var(--tbu-blue)"
                strokeWidth="3"
                strokeDasharray={`${progressPercent}, 100`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <span className="text-caption font-bold tabular-nums text-[var(--tbu-ink)]">{progressPercent}%</span>
          </div>
          <div className="flex-1">
            <h3 className="text-heading-sm text-[var(--tbu-ink)]">Trip Ready</h3>
            <p className="text-caption-sm text-[var(--tbu-muted)] mt-1">
              {progressPercent === 100 
                ? "You're all set! Have a great trip." 
                : "Complete the remaining tasks before departure."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Next Trip Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--tbu-hairline)] bg-[var(--tbu-canvas)] shadow-tbu-1">
        <div className="h-56 w-full relative">
          <Image
            src={upcomingTrip.images?.[0]?.url || upcomingTrip.coverImage || "/placeholder.jpg"}
            alt={upcomingTrip.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-caption-sm font-medium backdrop-blur-md tabular-nums border border-white/20">
                <Clock className="h-3.5 w-3.5" />
                {daysLeft} Days Left
              </span>
            </div>
            <h2 className="text-display-md text-white drop-shadow-md">{upcomingTrip.title}</h2>
          </div>
        </div>
        
        {/* Timeline */}
        <div className="p-5 sm:p-6 bg-[var(--tbu-canvas)]">
          <div className="relative space-y-0 before:absolute before:inset-0 before:ml-[1.15rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[var(--tbu-hairline)] before:to-transparent">
            {/* Step 1: Confirmed */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group py-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[var(--tbu-canvas)] bg-[var(--tbu-green)] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ml-4 md:ml-0 md:group-odd:text-right md:group-even:text-left">
                <p className="text-body-sm font-semibold text-[var(--tbu-ink)]">Booking Confirmed</p>
                <p className="text-caption-sm text-[var(--tbu-muted)]">Your seat is reserved.</p>
              </div>
            </div>

            {/* Step 2: Advance Paid */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group py-3">
              <div className={cn("flex items-center justify-center w-10 h-10 rounded-full border-2 border-[var(--tbu-canvas)] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors", upcomingBooking.amountPaid > 0 ? "bg-[var(--tbu-green)] text-white" : "bg-[var(--tbu-surface)] text-[var(--tbu-muted)]")}>
                {upcomingBooking.amountPaid > 0 ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ml-4 md:ml-0 md:group-odd:text-right md:group-even:text-left">
                <p className="text-body-sm font-semibold text-[var(--tbu-ink)]">Advance Paid</p>
                <p className="text-caption-sm text-[var(--tbu-muted)]">Initial booking amount secured.</p>
              </div>
            </div>
            
            {/* Step 3: WhatsApp */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group py-3">
              <div className={cn("flex items-center justify-center w-10 h-10 rounded-full border-2 border-[var(--tbu-canvas)] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors", upcomingBooking.whatsappJoined ? "bg-[var(--tbu-green)] text-white" : "bg-[var(--tbu-surface)] text-[var(--tbu-muted)]")}>
                {upcomingBooking.whatsappJoined ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ml-4 md:ml-0 md:group-odd:text-right md:group-even:text-left">
                <p className="text-body-sm font-semibold text-[var(--tbu-ink)]">WhatsApp Group</p>
                <p className="text-caption-sm text-[var(--tbu-muted)]">Connect with travel buddies.</p>
              </div>
            </div>

            {/* Step 4: Final Payment */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group py-3">
              <div className={cn("flex items-center justify-center w-10 h-10 rounded-full border-2 border-[var(--tbu-canvas)] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors", upcomingBooking.remainingAmount === 0 ? "bg-[var(--tbu-green)] text-white" : "bg-[var(--tbu-surface)] text-[var(--tbu-muted)]")}>
                {upcomingBooking.remainingAmount === 0 ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ml-4 md:ml-0 md:group-odd:text-right md:group-even:text-left">
                <div className="flex items-center gap-2 md:justify-end md:group-even:justify-start">
                  <p className="text-body-sm font-semibold text-[var(--tbu-ink)]">Final Payment</p>
                  {upcomingBooking.remainingAmount > 0 && (
                    <Link href={`/dashboard/trips/${upcomingBooking.id}?tab=payments`} className="text-[10px] uppercase tracking-wider font-bold text-[var(--tbu-blue)] bg-[var(--tbu-blue-soft)] px-2 py-0.5 rounded-sm hover:bg-[var(--tbu-blue)] hover:text-white transition-colors">
                      Pay
                    </Link>
                  )}
                </div>
                <p className="text-caption-sm text-[var(--tbu-muted)] tabular-nums">
                  {upcomingBooking.remainingAmount > 0 ? `₹${upcomingBooking.remainingAmount.toLocaleString()} pending` : "Fully paid"}
                </p>
              </div>
            </div>
          </div>

          <Button size="lg" className="w-full mt-6 rounded-xl shadow-sm gap-2" variant="secondary" asChild>
            <Link href={`/dashboard/trips/${upcomingBooking.id}`}>
              Continue Journey
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-heading-sm text-[var(--tbu-ink)] mb-4 px-1">Quick Resources</h3>
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          <Link
            href={`/dashboard/trips/${upcomingBooking.id}?tab=itinerary`}
            className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-[var(--tbu-hairline)] bg-[var(--tbu-canvas)] p-3 sm:p-4 text-center transition-all hover:-translate-y-1 hover:border-[var(--tbu-blue-soft)] hover:shadow-tbu-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbu-ring)]"
          >
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[var(--tbu-surface)] text-[var(--tbu-muted)] group-hover:bg-[var(--tbu-blue-soft)] group-hover:text-[var(--tbu-blue)] transition-colors">
              <Calendar className="h-5 w-5" />
            </div>
            <span className="text-caption-sm sm:text-caption font-medium text-[var(--tbu-ink)]">Itinerary</span>
          </Link>
          
          <Link
            href={`/dashboard/trips/${upcomingBooking.id}?tab=community`}
            className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-[var(--tbu-hairline)] bg-[var(--tbu-canvas)] p-3 sm:p-4 text-center transition-all hover:-translate-y-1 hover:border-[var(--tbu-green-soft)] hover:shadow-tbu-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbu-ring)]"
          >
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[var(--tbu-surface)] text-[var(--tbu-muted)] group-hover:bg-[var(--tbu-green-soft)] group-hover:text-[var(--tbu-green)] transition-colors">
              <MessageCircle className="h-5 w-5" />
            </div>
            <span className="text-caption-sm sm:text-caption font-medium text-[var(--tbu-ink)]">WhatsApp</span>
          </Link>

          <Link
            href={`/dashboard/trips/${upcomingBooking.id}?tab=documents`}
            className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-[var(--tbu-hairline)] bg-[var(--tbu-canvas)] p-3 sm:p-4 text-center transition-all hover:-translate-y-1 hover:border-[var(--tbu-blue-soft)] hover:shadow-tbu-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbu-ring)]"
          >
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[var(--tbu-surface)] text-[var(--tbu-muted)] group-hover:bg-[var(--tbu-blue-soft)] group-hover:text-[var(--tbu-blue)] transition-colors">
              <Download className="h-5 w-5" />
            </div>
            <span className="text-caption-sm sm:text-caption font-medium text-[var(--tbu-ink)]">Brochure</span>
          </Link>

          <Link
            href={`/dashboard/trips/${upcomingBooking.id}?tab=payments`}
            className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-[var(--tbu-hairline)] bg-[var(--tbu-canvas)] p-3 sm:p-4 text-center transition-all hover:-translate-y-1 hover:border-[var(--tbu-warning)] hover:shadow-tbu-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbu-ring)]"
          >
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[var(--tbu-surface)] text-[var(--tbu-muted)] group-hover:bg-[#fef3c7] group-hover:text-[var(--tbu-warning)] transition-colors">
              <CreditCard className="h-5 w-5" />
            </div>
            <span className="text-caption-sm sm:text-caption font-medium text-[var(--tbu-ink)]">Payments</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
