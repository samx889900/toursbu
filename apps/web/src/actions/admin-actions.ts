"use server";

import { WaitlistService } from "@/services/waitlist";
import { AllocationService } from "@/services/allocations";
import { getSession } from "@/lib/auth/server";

export async function promoteWaitlistAction(waitlistId: string) {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");
  await WaitlistService.promoteEntry(waitlistId, session.user.id);
  return { success: true };
}

export async function autoAllocateBusesAction(tripId: string) {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");
  return await AllocationService.autoAllocateBuses(tripId);
}

export async function autoAllocateRoomsAction(tripId: string) {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");
  return await AllocationService.autoAllocateRooms(tripId);
}

export async function verifyDocumentAction(documentId: string, verified: boolean) {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");
  
  // Note: in a real app, verify the user is an admin
  const { prisma } = await import("@/lib/prisma");
  await prisma.travelerDocument.update({
    where: { id: documentId },
    data: { verified }
  });
  
  return { success: true };
}
