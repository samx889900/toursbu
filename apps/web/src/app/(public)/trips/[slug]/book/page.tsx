import { TripService } from "@/services/trips";
import { BookingService } from "@/services/bookings";
import { getSession } from "@/lib/auth/server";
import { redirect, notFound } from "next/navigation";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { prisma } from "@/lib/prisma";

export default async function BookTripPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1. Fetch Trip
  const trip = await TripService.getTripBySlug(slug);
  if (!trip) notFound();

  // 2. Auth Check
  const session = await getSession();
  if (!session?.user) {
    redirect(`/auth/signin?callbackUrl=/trips/${slug}/book`);
  }

  // 3. Profile Completion Check
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.onboardingCompleted) {
    // Assuming onboarding page exists at /onboarding
    redirect(`/onboarding?callbackUrl=/trips/${slug}/book`);
  }

  // 4. Eligibility & Capacity Check
  if (trip.status !== "PUBLISHED") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bookings Closed</h2>
          <p className="text-gray-600">This trip is not currently accepting bookings.</p>
        </div>
      </div>
    );
  }

  const remainingSeats = await BookingService.getRemainingSeats(trip.id);
  
  if (remainingSeats <= 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sold Out</h2>
          <p className="text-gray-600">Sorry, there are no more seats available for {trip.title}.</p>
          <div className="mt-6">
            <button className="px-6 py-2 bg-black text-white rounded-lg font-medium">Join Waitlist</button>
          </div>
        </div>
      </div>
    );
  }

  // 5. Render Client Wizard (handles Traveler Count -> Lock -> Details -> Summary)
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <BookingWizard 
          tripId={trip.id} 
          tripTitle={trip.title}
          remainingSeats={remainingSeats} 
          price={trip.price || 0}
          advanceAmount={trip.advanceAmount || 0}
        />
      </div>
    </div>
  );
}
