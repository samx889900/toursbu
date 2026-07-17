import { prisma } from "@/lib/prisma";
import { BookingStatus, RoomType } from "@prisma/client";

export class AllocationService {
  static async autoAllocateBuses(tripId: string) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { buses: { include: { allocations: true } } },
    });
    if (!trip) throw new Error("Trip not found");

    const validStatuses = [BookingStatus.CONFIRMED, BookingStatus.ADVANCE_PAID, BookingStatus.FULLY_PAID];

    const travelers = await prisma.bookingTraveler.findMany({
      where: {
        booking: {
          tripId,
          status: { in: validStatuses },
        },
        busAllocation: null, // Unallocated only
      },
      include: { booking: true },
      orderBy: { booking: { createdAt: "asc" } },
    });

    if (travelers.length === 0) return { success: true, allocated: 0 };

    let allocatedCount = 0;
    const allocationsToCreate: { travelerId: string; busId: string; seatNumber: string; bookingId: string; }[] = [];

    for (const traveler of travelers) {
      // Find a bus with space
      const availableBus = trip.buses.find(b => {
        const currentCount = b.allocations.length + allocationsToCreate.filter(a => a.busId === b.id).length;
        return currentCount < b.capacity;
      });

      if (availableBus) {
        allocationsToCreate.push({
          travelerId: traveler.id,
          busId: availableBus.id,
          seatNumber: `Seat-${availableBus.allocations.length + allocationsToCreate.filter(a => a.busId === availableBus.id).length + 1}`,
          bookingId: traveler.bookingId
        });
        allocatedCount++;
      }
    }

    if (allocationsToCreate.length > 0) {
      await prisma.busAllocation.createMany({
        data: allocationsToCreate,
      });
    }

    return { success: true, allocated: allocatedCount };
  }

  static async autoAllocateRooms(tripId: string) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { rooms: { include: { allocations: true } } },
    });
    if (!trip) throw new Error("Trip not found");

    const validStatuses = [BookingStatus.CONFIRMED, BookingStatus.ADVANCE_PAID, BookingStatus.FULLY_PAID];

    const travelers = await prisma.bookingTraveler.findMany({
      where: {
        booking: {
          tripId,
          status: { in: validStatuses },
        },
        roomAllocation: null, // Unallocated only
      },
      include: { booking: true },
      orderBy: { booking: { createdAt: "asc" } },
    });

    if (travelers.length === 0) return { success: true, allocated: 0 };

    let allocatedCount = 0;
    const allocationsToCreate: { travelerId: string; roomId: string; bookingId: string; }[] = [];

    // Group by booking to keep people together
    const bookingGroups = travelers.reduce((acc, traveler) => {
      if (!acc[traveler.bookingId]) acc[traveler.bookingId] = [];
      acc[traveler.bookingId].push(traveler);
      return acc;
    }, {} as Record<string, typeof travelers>);

    for (const [bookingId, groupTravelers] of Object.entries(bookingGroups)) {
      // Try to find a single room with enough capacity for the whole group
      const availableRoom = trip.rooms.find(r => {
        const currentCount = r.allocations.length + allocationsToCreate.filter(a => a.roomId === r.id).length;
        return (r.capacity - currentCount) >= groupTravelers.length;
      });

      if (availableRoom) {
        for (const traveler of groupTravelers) {
          allocationsToCreate.push({
            travelerId: traveler.id,
            roomId: availableRoom.id,
            bookingId: traveler.bookingId
          });
          allocatedCount++;
        }
      } else {
        // Fallback: allocate individually
        for (const traveler of groupTravelers) {
          const room = trip.rooms.find(r => {
            const currentCount = r.allocations.length + allocationsToCreate.filter(a => a.roomId === r.id).length;
            return currentCount < r.capacity;
          });
          if (room) {
            allocationsToCreate.push({
              travelerId: traveler.id,
              roomId: room.id,
              bookingId: traveler.bookingId
            });
            allocatedCount++;
          }
        }
      }
    }

    if (allocationsToCreate.length > 0) {
      await prisma.roomAllocation.createMany({
        data: allocationsToCreate,
      });
    }

    return { success: true, allocated: allocatedCount };
  }
}
