"use server";

import { getAdminSession, logAdminAction } from "@/lib/auth/admin-session";
import { TripService } from "@/services/trips";
import { revalidatePath } from "next/cache";

/**
 * Ensures user is authenticated and has at least Admin role.
 */
async function requireAdmin() {
  const session = await getAdminSession();
  if (!session || (session.admin.role !== "ADMIN" && session.admin.role !== "SUPER_ADMIN" && session.admin.role !== "OPERATIONS_ADMIN")) {
    throw new Error("Unauthorized. Admin access required.");
  }
  return session;
}

/**
 * Ensures user is authenticated and is SUPER_ADMIN.
 */
async function requireSuperAdmin() {
  const session = await getAdminSession();
  if (!session || session.admin.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized. Super Admin access required.");
  }
  return session;
}

export async function createTripAction(formData: FormData) {
  try {
    const session = await requireAdmin();

    const title = formData.get("title") as string;
    if (!title) throw new Error("Title is required");

    const trip = await TripService.createTripDraft({
      title,
      location: (formData.get("location") as string) || null,
      categoryId: (formData.get("categoryId") as string) || null,
      startDate: formData.get("startDate") ? new Date(formData.get("startDate") as string) : null,
      endDate: formData.get("endDate") ? new Date(formData.get("endDate") as string) : null,
      capacity: formData.get("capacity") ? parseInt(formData.get("capacity") as string, 10) : null,
      price: formData.get("price") ? parseInt(formData.get("price") as string, 10) : null,
      advanceAmount: formData.get("advanceAmount") ? parseInt(formData.get("advanceAmount") as string, 10) : null,
      shortDesc: (formData.get("shortDesc") as string) || null,
    });

    await logAdminAction("TRIP_CREATED", session.adminId, "trip", trip.id, { title: trip.title });

    return { success: true, tripId: trip.id };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create trip" };
  }
}

export async function duplicateTripAction(id: string) {
  try {
    const session = await requireSuperAdmin();
    const newTrip = await TripService.duplicateTrip(id);
    
    await logAdminAction("TRIP_DUPLICATED", session.adminId, "trip", newTrip.id, { originalId: id });
    revalidatePath(`/admin/trips`);
    
    return { success: true, tripId: newTrip.id };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to duplicate trip" };
  }
}

export async function updateTripOverviewAction(id: string, formData: FormData) {
  try {
    const session = await requireAdmin();
    
    // Parse array inputs
    const highlightsStr = formData.get("highlights") as string;
    const highlights = highlightsStr ? highlightsStr.split(",").map(s => s.trim()).filter(Boolean) : [];
    
    const tagsStr = formData.get("tags") as string;
    const tags = tagsStr ? tagsStr.split(",").map(s => s.trim()).filter(Boolean) : [];

    const data = {
      title: formData.get("title") as string,
      shortDesc: formData.get("shortDesc") as string || null,
      description: formData.get("description") as string || null,
      categoryId: formData.get("categoryId") as string || null,
      difficulty: formData.get("difficulty") as string || null,
      duration: formData.get("duration") as string || null,
      highlights,
      tags,
      location: formData.get("location") as string || null,
      meetingPoint: formData.get("meetingPoint") as string || null,
      pickupPoint: formData.get("pickupPoint") as string || null,
      dropPoint: formData.get("dropPoint") as string || null,
      googleMapsUrl: formData.get("googleMapsUrl") as string || null,
    };

    await TripService.updateTripOverview(id, data);
    await logAdminAction("TRIP_UPDATED", session.adminId, "trip", id, { tab: "Overview" });
    revalidatePath(`/admin/trips/${id}/edit`);
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update trip overview" };
  }
}

export async function updateTripPricingAction(id: string, formData: FormData) {
  try {
    const session = await requireAdmin();
    
    const parseNumber = (val: FormDataEntryValue | null) => val ? parseInt(val as string, 10) : null;

    const data = {
      price: parseNumber(formData.get("price")),
      advanceAmount: parseNumber(formData.get("advanceAmount")),
      earlyBirdPrice: parseNumber(formData.get("earlyBirdPrice")),
      groupDiscountAmount: parseNumber(formData.get("groupDiscountAmount")),
      gstEnabled: formData.get("gstEnabled") === "true",
    };

    await TripService.updateTripPricing(id, data);
    await logAdminAction("TRIP_UPDATED", session.adminId, "trip", id, { tab: "Pricing" });
    revalidatePath(`/admin/trips/${id}/edit`);
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update trip pricing" };
  }
}

export async function updateTripSEOAction(id: string, formData: FormData) {
  try {
    const session = await requireAdmin();
    
    const data = {
      seoTitle: formData.get("seoTitle") as string || null,
      seoDescription: formData.get("seoDescription") as string || null,
      seoKeywords: formData.get("seoKeywords") as string || null,
      canonicalUrl: formData.get("canonicalUrl") as string || null,
      ogImage: formData.get("ogImage") as string || null,
    };

    await TripService.updateTripSEO(id, data);
    await logAdminAction("TRIP_UPDATED", session.adminId, "trip", id, { tab: "SEO" });
    revalidatePath(`/admin/trips/${id}/edit`);
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update trip SEO" };
  }
}

export async function updateTripSettingsAction(id: string, formData: FormData) {
  try {
    const session = await requireAdmin();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const visibility: any = formData.get("visibility") || "PUBLIC";
    
    const data = {
      visibility,
      bookingEnabled: formData.get("bookingEnabled") === "true",
      waitlistEnabled: formData.get("waitlistEnabled") === "true",
      bookingDeadline: formData.get("bookingDeadline") ? new Date(formData.get("bookingDeadline") as string) : null,
      capacity: formData.get("capacity") ? parseInt(formData.get("capacity") as string, 10) : null,
      startDate: formData.get("startDate") ? new Date(formData.get("startDate") as string) : null,
      endDate: formData.get("endDate") ? new Date(formData.get("endDate") as string) : null,
    };

    await TripService.updateTripSettings(id, data);
    await logAdminAction("TRIP_UPDATED", session.adminId, "trip", id, { tab: "Settings" });
    revalidatePath(`/admin/trips/${id}/edit`);
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update trip settings" };
  }
}

export async function publishTripAction(id: string) {
  try {
    const session = await requireAdmin();
    
    const validation = await TripService.validateTripForPublishing(id);
    if (!validation.valid) {
      return { success: false, error: "Validation failed", details: validation.errors };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await TripService.updateTripSettings(id, { status: "PUBLISHED" as any });
    
    await logAdminAction("TRIP_PUBLISHED", session.adminId, "trip", id, {});
    revalidatePath(`/admin/trips`);
    revalidatePath(`/admin/trips/${id}/edit`);
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to publish trip" };
  }
}

export async function archiveTripAction(id: string) {
  try {
    const session = await requireAdmin();
    await TripService.archiveTrip(id, session.adminId);
    
    await logAdminAction("TRIP_ARCHIVED", session.adminId, "trip", id, {});
    revalidatePath(`/admin/trips`);
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to archive trip" };
  }
}

export async function restoreTripAction(id: string) {
  try {
    const session = await requireAdmin();
    await TripService.restoreTrip(id);
    
    await logAdminAction("TRIP_RESTORED", session.adminId, "trip", id, {});
    revalidatePath(`/admin/trips`);
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to restore trip" };
  }
}

export async function hardDeleteTripAction(id: string) {
  try {
    const session = await requireSuperAdmin();
    await TripService.hardDeleteTrip(id);
    
    await logAdminAction("TRIP_DELETED", session.adminId, "trip", id, {});
    revalidatePath(`/admin/trips`);
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete trip" };
  }
}

export async function updateTripFAQsAction(id: string, faqs: any[]) {
  try {
    const session = await requireAdmin();
    await TripService.updateTripFAQs(id, faqs);
    await logAdminAction("TRIP_UPDATED", session.adminId, "trip", id, { tab: "FAQs" });
    revalidatePath(`/admin/trips/${id}/edit`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update FAQs" };
  }
}

export async function updateTripPoliciesAction(id: string, policies: any[]) {
  try {
    const session = await requireAdmin();
    await TripService.updateTripPolicies(id, policies);
    await logAdminAction("TRIP_UPDATED", session.adminId, "trip", id, { tab: "Policies" });
    revalidatePath(`/admin/trips/${id}/edit`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update policies" };
  }
}

export async function updateTripItineraryAction(id: string, days: any[]) {
  try {
    const session = await requireAdmin();
    await TripService.updateTripItinerary(id, days);
    await logAdminAction("TRIP_UPDATED", session.adminId, "trip", id, { tab: "Itinerary" });
    revalidatePath(`/admin/trips/${id}/edit`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update itinerary" };
  }
}

export async function updateTripGalleryAction(id: string, images: any[]) {
  try {
    const session = await requireAdmin();
    await TripService.updateTripGallery(id, images);
    await logAdminAction("TRIP_UPDATED", session.adminId, "trip", id, { tab: "Gallery" });
    revalidatePath(`/admin/trips/${id}/edit`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update gallery" };
  }
}
