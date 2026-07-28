import { getAdminSession } from "@/lib/auth/admin-session";
import { redirect, notFound } from "next/navigation";
import { TripService } from "@/services/trips";
import { TripEditClient } from "./client";
import { prisma } from "@/lib/prisma";

export default async function TripEditPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;
  
  const trip = await TripService.getTripForEditor(id);

  if (!trip) {
    notFound();
  }

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" }
  });

  return <TripEditClient trip={trip as any} categories={categories} />;
}
