"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/server";
import { revalidatePath } from "next/cache";

export async function completeOnboarding(formData: FormData) {
  const session = await getSession();

  if (!session) {
    return { success: false, error: "Not authenticated" };
  }

  const phone = formData.get("phone") as string;
  const college = formData.get("college") as string;
  const emergencyContact = formData.get("emergencyContact") as string;

  if (!phone || !college || !emergencyContact) {
    return { success: false, error: "All fields are required" };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        phone,
        college,
        emergencyContact,
        onboardingCompleted: true,
      },
    });

    revalidatePath("/", "layout"); // Revalidate everything to update session caches
    return { success: true };
  } catch (error) {
    console.error("Failed to complete onboarding:", error);
    return { success: false, error: "Failed to update profile. Please try again." };
  }
}
