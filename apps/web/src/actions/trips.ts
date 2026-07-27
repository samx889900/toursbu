"use server";

import { getAdminSession } from "@/lib/auth/admin-session";
import { TripService } from "@/services/trips";
import { revalidatePath } from "next/cache";

/**
 * Creates a new draft trip from the Admin CMS.
 * Checks for RBAC permissions internally.
 */
export async function createTripAction(formData: FormData) {
  const session = await getAdminSession();

  // Basic RBAC verification - ensure only ADMIN or SUPER_ADMIN can create trips
  if (!session || (session.admin.role !== "ADMIN" && session.admin.role !== "SUPER_ADMIN" && session.admin.role !== "OPERATIONS_ADMIN")) {
    return { success: false, error: "Unauthorized. Admin access required." };
  }


  const title = formData.get("title") as string;
  const location = formData.get("location") as string;
  const categoryId = formData.get("categoryId") as string | null;
  const startDateStr = formData.get("startDate") as string;

  if (!title) {
    return { success: false, error: "Title is required" };
  }

  try {
    const startDate = startDateStr ? new Date(startDateStr) : null;

    const trip = await TripService.createTripDraft({
      title,
      location: location || null,
      categoryId: categoryId || null,
      startDate,
    });

    // We don't revalidate everything yet, we just return the new ID so the frontend can redirect
    return { success: true, tripId: trip.id };
  } catch (error: unknown) {
    console.error("Failed to create trip draft:", error);
    return { success: false, error: (error as Error).message || "Failed to create trip" };
  }
}

export async function updateTripAction(id: string, formData: FormData) {
  const session = await getAdminSession();
  if (!session || (session.admin.role !== "ADMIN" && session.admin.role !== "SUPER_ADMIN" && session.admin.role !== "OPERATIONS_ADMIN")) {
    return { success: false, error: "Unauthorized. Admin access required." };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const price = formData.get("price") ? parseFloat(formData.get("price") as string) : null;
  const capacity = formData.get("capacity") ? parseInt(formData.get("capacity") as string, 10) : null;

  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.trip.update({
      where: { id },
      data: {
        title,
        description: description || null,
        location: location || null,
        price,
        capacity,
      },
    });

    revalidatePath(`/admin/trips/${id}/edit`);
    revalidatePath(`/admin/trips`);
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to update trip:", error);
    return { success: false, error: (error as Error).message || "Failed to update trip" };
  }
}
