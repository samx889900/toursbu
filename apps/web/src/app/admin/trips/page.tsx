import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth/admin-session";
import { redirect } from "next/navigation";
import { TripsClient } from "./client";

export default async function AdminTripsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const trips = await prisma.trip.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { bookings: true },
      },
    },
  });

  return <TripsClient initialTrips={trips} />;
}
