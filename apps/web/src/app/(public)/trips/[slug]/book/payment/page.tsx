import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/server";
import { PaymentCheckout } from "@/components/booking/payment-checkout";
import { BookingStatus } from "@prisma/client";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ bookingId: string }>;
};

export default async function PaymentPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { bookingId } = await searchParams;

  if (!bookingId) {
    redirect(`/trips/${slug}`);
  }

  const session = await getSession();
  if (!session?.user) {
    redirect(`/login?callbackUrl=/trips/${slug}/book/payment?bookingId=${bookingId}`);
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { trip: true, user: true },
  });

  if (!booking) {
    notFound();
  }

  if (booking.userId !== session.user.id) {
    redirect(`/trips/${slug}`);
  }

  if (booking.trip.slug !== slug) {
    redirect(`/trips/${booking.trip.slug}/book/payment?bookingId=${bookingId}`);
  }

  if (booking.status !== BookingStatus.DRAFT && booking.status !== BookingStatus.PENDING_PAYMENT) {
    // If already paid or confirmed, send to success/dashboard
    redirect(`/bookings/${booking.id}/success`);
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <PaymentCheckout 
        bookingId={booking.id}
        amount={booking.advanceAmount}
        userName={booking.user.name}
        userEmail={booking.user.email}
        userPhone={booking.user.phone || ""}
      />
    </div>
  );
}
