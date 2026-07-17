"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/server";
import { BookingStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function markWhatsAppJoinedAction(bookingId: string) {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { userId: true, status: true, whatsappJoined: true }
  });

  if (!booking) throw new Error("Booking not found");
  if (booking.userId !== session.user.id) throw new Error("Unauthorized");

  const allowedStatuses: BookingStatus[] = [BookingStatus.ADVANCE_PAID, BookingStatus.FULLY_PAID, BookingStatus.CONFIRMED];
  if (!allowedStatuses.includes(booking.status)) {
    throw new Error("Must be paid to join WhatsApp group");
  }

  if (booking.whatsappJoined) return { success: true };

  await prisma.booking.update({
    where: { id: bookingId },
    data: { whatsappJoined: true }
  });

  revalidatePath(`/dashboard/trips/${bookingId}`);
  return { success: true };
}
