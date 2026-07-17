"use server";

import { BookingService } from "@/services/bookings";
import { getSession } from "@/lib/auth/server";
import { headers } from "next/headers";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getRemainingSeatsAction(tripId: string) {
  try {
    const seats = await BookingService.getRemainingSeats(tripId);
    return { success: true, data: seats };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function acquireLockAction(tripId: string, travelerCount: number) {
  try {
    const session = await getSession();
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const lock = await BookingService.acquireLock(tripId, session.user.id, travelerCount);
    
    return {
      success: true,
      data: {
        lockId: lock.id,
        expiresAt: lock.expiresAt,
      },
    };
  } catch (error: any) {
    console.error("Acquire Lock Error:", error);
    return { success: false, error: error.message };
  }
}

export async function createDraftBookingAction(data: {
  tripId: string;
  travelerCount: number;
  totalAmount: number;
  advanceAmount: number;
  travelers: any[];
  emergencyContacts: any[];
  lockId?: string;
}) {
  try {
    // 1. Authenticate user
    const session = await getSession();
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    // 2. Map payload correctly
    const payload = {
      ...data,
      userId: session.user.id,
      travelers: data.travelers.map((t, index) => ({
        name: t.name,
        email: t.email,
        phone: t.phone,
        gender: t.gender,
        dateOfBirth: t.dateOfBirth ? new Date(t.dateOfBirth) : undefined,
        governmentIdType: t.governmentIdType,
        governmentIdNumber: t.governmentIdNumber,
        dietaryPreference: t.dietaryPreference,
        isPrimary: index === 0, // First traveler is primary
        medicalInfo: t.medicalInfo,
      })),
      emergencyContacts: data.emergencyContacts.map(ec => ({
        name: ec.name,
        relation: ec.relation,
        phone: ec.phone,
      })),
      lockId: data.lockId,
    };

    // 3. Create Draft Booking via Service
    const booking = await BookingService.createDraftBooking(payload);
    
    // 4. Revalidate necessary pages
    revalidatePath(`/trips/${data.tripId}`);

    return { success: true, data: booking };
  } catch (error: any) {
    console.error("Failed to create draft booking:", error);
    return { success: false, error: error.message || "Failed to create booking" };
  }
}
