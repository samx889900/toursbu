"use server";

import { WaitlistService } from "@/services/waitlist";
import { AllocationService } from "@/services/allocations";
import { getAdminSession } from "@/lib/auth/admin-session";
import { prisma } from "@/lib/prisma";

export async function promoteWaitlistAction(waitlistId: string) {
  const session = await getAdminSession();
  if (!session?.admin) throw new Error("Unauthorized");
  await WaitlistService.promoteEntry(waitlistId, session.admin.id);
  return { success: true };
}

export async function autoAllocateBusesAction(tripId: string) {
  const session = await getAdminSession();
  if (!session?.admin) throw new Error("Unauthorized");
  return await AllocationService.autoAllocateBuses(tripId);
}

export async function autoAllocateRoomsAction(tripId: string) {
  const session = await getAdminSession();
  if (!session?.admin) throw new Error("Unauthorized");
  return await AllocationService.autoAllocateRooms(tripId);
}

export async function verifyDocumentAction(documentId: string, verified: boolean) {
  const session = await getAdminSession();
  if (!session?.admin) throw new Error("Unauthorized");
  
  await prisma.travelerDocument.update({
    where: { id: documentId },
    data: { verified }
  });
  
  return { success: true };
}
