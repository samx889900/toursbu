"use server";

import { getSession } from "@/lib/auth/server";
import { TripService } from "@/services/trips";
import { revalidatePath } from "next/cache";

/**
 * Creates a new draft trip from the Admin CMS.
 * Checks for RBAC permissions internally.
 */
export async function createTripAction(formData: FormData) {
  const session = await getSession();

  // Basic RBAC verification - ensure only ADMIN or SUPER_ADMIN can create trips
  // In a real production app, we'd reuse our canAccess() logic for robust backend protection
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
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
