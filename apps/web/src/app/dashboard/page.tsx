import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  MapPin,
  Calendar,
  ChevronRight,
  Download,
  MessageCircle,
  CreditCard,
  CheckCircle2,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingStatus } from "@prisma/client";

export default async function DashboardHome() {
  const session = await getSession();
  if (!session?.user) redirect("/auth/signin?callbackUrl=/dashboard");

  const user = session.user;

  // Fetch Upcoming Booking
  const upcomingBooking = await prisma.booking.findFirst({
    where: {
      userId: user.id,
      status: {
        in: [
          BookingStatus.CONFIRMED,
          BookingStatus.ADVANCE_PAID,
          BookingStatus.PENDING_PAYMENT,
          BookingStatus.PARTIALLY_PAID,
        ],
      },
    },
    include: {
      trip: {
        include: {
          images: true,
        }
      }
    },
    orderBy: {
      trip: { startDate: 'asc' }
    }
  });

  // Fetch recent notifications
  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 3
  });

  // Fetch recent bookings (excluding the upcoming one if possible)
  const recentBookings = await prisma.booking.findMany({
    where: {
      userId: user.id,
      ...(upcomingBooking ? { id: { not: upcomingBooking.id } } : {})
    },
    include: {
      trip: {
        include: {
          images: true,
        }
      }
    },
    orderBy: { createdAt: "desc" },
    take: 2
  });

  if (!upcomingBooking) {
    return (
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 overflow-hidden rounded-full border border-[var(--tbu-hairline)] relative shadow-sm bg-gray-200">
            {user.image ? (
              <Image src={user.image} alt={user.name || "User"} fill className="object-cover" />
            ) : null}
          </div>
          <div>
            <h1 className="text-heading-lg text-[var(--tbu-ink)]">Hi, {user.name?.split(" ")[0]}!</h1>
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

  const tripDate = upcomingBooking.trip.startDate ? new Date(upcomingBooking.trip.startDate) : new Date();
  const daysLeft = Math.max(0, Math.ceil((tripDate.getTime() - Date.now()) / (1000 * 3600 * 24)));
  const progressPercent = Math.round((upcomingBooking.amountPaid / upcomingBooking.totalAmount) * 100) || 0;
  const remainingAmount = upcomingBooking.totalAmount - upcomingBooking.amountPaid;

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 overflow-hidden rounded-full border border-[var(--tbu-hairline)] relative shadow-sm bg-gray-200">
          {user.image ? <Image src={user.image} alt={user.name || ""} fill className="object-cover" /> : null}
        </div>
        <div>
          <h1 className="text-heading-lg text-[var(--tbu-ink)]">Hi, {user.name?.split(" ")[0]}!</h1>
          <p className="text-body-sm text-[var(--tbu-muted)]">Your next adventure awaits.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Panel: Upcoming Trip & Progress */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <Card className="overflow-hidden">
            <div className="relative h-48 w-full bg-gray-200">
              {upcomingBooking.trip.images.length > 0 && (
                <Image src={upcomingBooking.trip.images.find(img => img.isCover)?.url || upcomingBooking.trip.images[0]?.url || ""} alt={upcomingBooking.trip.title} fill className="object-cover" />
              )}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                {daysLeft} Days Left
              </div>
            </div>
            <CardContent className="p-6">
              <h2 className="text-heading-md mb-2">{upcomingBooking.trip.title}</h2>
              <div className="flex items-center text-sm text-gray-500 mb-6 gap-4">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {tripDate.toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {upcomingBooking.trip.location || "Multiple"}</span>
              </div>
              
              {/* Payment Progress */}
              <div className="bg-gray-50 p-4 rounded-xl border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Payment Progress</span>
                  <span className="text-sm font-bold">₹{upcomingBooking.amountPaid} / ₹{upcomingBooking.totalAmount}</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--tbu-blue)]" style={{ width: `${progressPercent}%` }} />
                </div>
                {remainingAmount > 0 && (
                  <p className="text-xs text-red-500 mt-2 font-medium">₹{remainingAmount} remaining due</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Center */}
          <Card>
            <CardHeader>
              <CardTitle>Action Center</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {remainingAmount > 0 && (
                <Button className="w-full justify-start gap-2 h-auto py-3" variant="outline" asChild>
                  <Link href={`/dashboard/trips/${upcomingBooking.id}`}>
                    <CreditCard className="w-5 h-5 text-blue-500" />
                    <div className="text-left">
                      <div className="font-semibold">Pay Remaining</div>
                      <div className="text-xs text-gray-500">₹{remainingAmount} pending</div>
                    </div>
                  </Link>
                </Button>
              )}
              
              <Button className="w-full justify-start gap-2 h-auto py-3" variant="outline" asChild>
                <Link href={`/dashboard/trips/${upcomingBooking.id}`}>
                  <MessageCircle className="w-5 h-5 text-green-500" />
                  <div className="text-left">
                    <div className="font-semibold">WhatsApp Group</div>
                    <div className="text-xs text-gray-500">Join to meet fellow travelers</div>
                  </div>
                </Link>
              </Button>

              <Button className="w-full justify-start gap-2 h-auto py-3" variant="outline" asChild>
                <Link href={`/dashboard/trips/${upcomingBooking.id}`}>
                  <Download className="w-5 h-5 text-purple-500" />
                  <div className="text-left">
                    <div className="font-semibold">Download Receipt</div>
                    <div className="text-xs text-gray-500">Get your payment proof</div>
                  </div>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Notifications & Recent Bookings */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="w-4 h-4" /> Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No new notifications</p>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} className="p-3 bg-gray-50 rounded-lg border text-sm">
                    <div className="font-semibold text-gray-900">{notif.title}</div>
                    <div className="text-gray-500 text-xs mt-1">{notif.message}</div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {recentBookings.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No other bookings found</p>
              ) : (
                recentBookings.map((b) => (
                  <Link href={`/dashboard/trips/${b.id}`} key={b.id} className="group block">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-12 h-12 relative rounded-md overflow-hidden bg-gray-200 shrink-0">
                        {b.trip.images.length > 0 && <Image src={b.trip.images.find(img => img.isCover)?.url || b.trip.images[0]?.url || ""} alt="" fill className="object-cover" />}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="font-semibold text-sm truncate group-hover:text-[var(--tbu-blue)]">{b.trip.title}</div>
                        <div className="text-xs text-gray-500">{b.status}</div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
