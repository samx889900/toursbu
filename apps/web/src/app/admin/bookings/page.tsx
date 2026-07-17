import { prisma } from "@/lib/prisma";
import { BookingsClient } from "./client";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: {
      user: true,
      trip: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return <BookingsClient initialBookings={bookings} />;
}
