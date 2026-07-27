import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { TripEditClient } from "./client";

export default async function TripGeneralEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const trip = await prisma.trip.findUnique({
    where: { id },
  });

  if (!trip) {
    notFound();
  }

  return <TripEditClient trip={trip} />;
}
