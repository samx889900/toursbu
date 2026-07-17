"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: {
  name: string;
  phone: string;
  college: string;
  emergencyContact: string;
}) {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: data.name,
      phone: data.phone,
      college: data.college,
      emergencyContact: data.emergencyContact,
    }
  });

  revalidatePath("/dashboard/profile");
  return { success: true };
}
