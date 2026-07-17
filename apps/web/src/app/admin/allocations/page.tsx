import { prisma } from "@/lib/prisma";
import { AllocationsClient } from "./client";

export default async function AdminAllocationsPage() {
  const upcomingTrips = await prisma.trip.findMany({
    where: { startDate: { gte: new Date() } },
    include: {
      rooms: { include: { allocations: { include: { traveler: true } } } },
      buses: { include: { allocations: { include: { traveler: true } } } },
      bookings: {
        where: { status: { in: ["CONFIRMED", "ADVANCE_PAID", "FULLY_PAID"] } },
        include: {
          travelers: {
            include: { roomAllocation: true, busAllocation: true }
          }
        }
      }
    },
    orderBy: { startDate: "asc" }
  });

  return <AllocationsClient trips={upcomingTrips} />;
}
