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

        <Card className="text-center py-16 px-8 bg-white border border-gray-100 shadow-xl shadow-gray-200/40 rounded-3xl transition-all hover:shadow-2xl hover:-translate-y-1">
          <CardContent className="flex flex-col items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 mb-6">
              <MapPin className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-black mb-3 text-gray-900 tracking-tight">No upcoming trips</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto text-balance">
              Discover amazing college trips, explore new destinations, and create unforgettable memories with your friends.
            </p>
            <Button size="lg" className="rounded-full shadow-lg bg-black text-white hover:bg-gray-800 gap-2 px-8 py-6 text-lg font-bold" asChild>
              <Link href="/trips">
                Explore Trips
                <ChevronRight className="h-5 w-5" />
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
          <Card className="overflow-hidden rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 bg-white">
            <div className="relative h-64 w-full bg-gray-200">
              {upcomingBooking.trip.images.length > 0 && (
                <Image src={upcomingBooking.trip.images.find(img => img.isCover)?.url || upcomingBooking.trip.images[0]?.url || ""} alt={upcomingBooking.trip.title} fill className="object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div className="text-white">
                  <h2 className="text-3xl font-black mb-2 drop-shadow-md">{upcomingBooking.trip.title}</h2>
                  <div className="flex items-center text-sm text-gray-200 gap-4 font-medium drop-shadow-md">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {tripDate.toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {upcomingBooking.trip.location || "Multiple"}</span>
                  </div>
                </div>
                <div className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold shadow-xl">
                  {daysLeft} Days Left
                </div>
              </div>
            </div>
            <CardContent className="p-8">
              {/* Payment Progress */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 font-medium">Payment Progress</span>
                  <span className="font-black text-gray-900">₹{upcomingBooking.amountPaid.toLocaleString()} <span className="text-gray-400 font-medium">/ ₹{upcomingBooking.totalAmount.toLocaleString()}</span></span>
                </div>
                <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                </div>
                {remainingAmount > 0 && (
                  <p className="text-sm text-red-500 mt-3 font-semibold">₹{remainingAmount.toLocaleString()} remaining due</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Center */}
          <Card className="rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 bg-white overflow-hidden">
            <CardHeader className="bg-gray-50 border-b border-gray-100 p-6">
              <CardTitle className="text-lg font-bold text-gray-900">Action Center</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
              {remainingAmount > 0 && (
                <Button className="w-full justify-start gap-4 h-auto py-4 px-5 rounded-2xl bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors shadow-sm" variant="outline" asChild>
                  <Link href={`/dashboard/trips/${upcomingBooking.id}`}>
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-900">Pay Remaining</div>
                      <div className="text-xs font-medium text-gray-500">₹{remainingAmount.toLocaleString()} pending</div>
                    </div>
                  </Link>
                </Button>
              )}
              
              <Button className="w-full justify-start gap-4 h-auto py-4 px-5 rounded-2xl bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors shadow-sm" variant="outline" asChild>
                <Link href={`/dashboard/trips/${upcomingBooking.id}`}>
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-gray-900">WhatsApp Group</div>
                    <div className="text-xs font-medium text-gray-500">Meet fellow travelers</div>
                  </div>
                </Link>
              </Button>

              <Button className="w-full justify-start gap-4 h-auto py-4 px-5 rounded-2xl bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors shadow-sm" variant="outline" asChild>
                <Link href={`/dashboard/trips/${upcomingBooking.id}?tab=documents`}>
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                    <Download className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-gray-900">Documents</div>
                    <div className="text-xs font-medium text-gray-500">Receipts & IDs</div>
                  </div>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Notifications & Recent Bookings */}
        <div className="flex flex-col gap-6">
          <Card className="rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <Bell className="w-5 h-5 text-gray-700" /> Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {notifications.length === 0 ? (
                <p className="text-sm font-medium text-gray-400 text-center py-4">All caught up!</p>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm">
                    <div className="font-bold text-gray-900 mb-1">{notif.title}</div>
                    <div className="text-gray-500 text-xs font-medium">{notif.message}</div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900">Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {recentBookings.length === 0 ? (
                <p className="text-sm font-medium text-gray-400 text-center py-4">No other bookings found</p>
              ) : (
                recentBookings.map((b) => (
                  <Link href={`/dashboard/trips/${b.id}`} key={b.id} className="group block">
                    <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                      <div className="w-14 h-14 relative rounded-xl overflow-hidden bg-gray-200 shrink-0">
                        {b.trip.images.length > 0 && <Image src={b.trip.images.find(img => img.isCover)?.url || b.trip.images[0]?.url || ""} alt="" fill className="object-cover" />}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="font-bold text-sm text-gray-900 truncate group-hover:text-blue-600 transition-colors">{b.trip.title}</div>
                        <div className="text-xs font-medium text-gray-500 mt-1">{b.status.replace(/_/g, " ")}</div>
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
