import { prisma } from "@/lib/prisma";
import { BookingStatus, EventType, Prisma } from "@prisma/client";

/**
 * Service to handle Booking-related business logic.
 */
export class BookingService {
  /**
   * Calculates the remaining seats for a given trip.
   * Capacity constraint: Capacity - Confirmed Bookings
   * Confirmed Bookings includes ADVANCE_PAID, FULLY_PAID, CONFIRMED
   */
  static async getRemainingSeats(tripId: string): Promise<number> {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      select: { capacity: true },
    });

    if (!trip || trip.capacity === null) {
      // If capacity is null, it's unlimited (or not set)
      // ponytail: returning a high number for unlimited trips
      return 9999;
    }

    const confirmedStatuses: BookingStatus[] = [
      BookingStatus.ADVANCE_PAID,
      BookingStatus.FULLY_PAID,
      BookingStatus.CONFIRMED,
    ];

    const bookings = await prisma.booking.aggregate({
      where: {
        tripId,
        status: { in: confirmedStatuses },
        isArchived: false,
        deletedAt: null,
      },
      _sum: {
        travelerCount: true,
      },
    });

    const confirmedCount = bookings._sum.travelerCount || 0;

    // Also deduct currently active booking locks
    const activeLocks = await prisma.bookingLock.aggregate({
      where: {
        tripId,
        expiresAt: { gt: new Date() },
      },
      _sum: {
        travelerCount: true,
      },
    });
    const lockedCount = activeLocks._sum.travelerCount || 0;

    return trip.capacity - (confirmedCount + lockedCount);
  }

  /**
   * Creates a Booking Lock to reserve seats temporarily before checkout.
   */
  static async acquireLock(tripId: string, userId: string, travelerCount: number) {
    const remaining = await this.getRemainingSeats(tripId);
    if (remaining < travelerCount) {
      throw new Error(`Only ${remaining} seats remaining.`);
    }

    // Lock for 15 minutes
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    const lock = await prisma.bookingLock.create({
      data: {
        tripId,
        userId,
        travelerCount,
        expiresAt,
      }
    });

    return lock;
  }

  /**
   * Generates a unique booking number (e.g., TBU-XXXXXX).
   */
  static generateBookingNumber(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'TBU-';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Appends an event to the booking lifecycle.
   */
  static async logEvent(
    bookingId: string,
    eventType: EventType,
    actorId?: string,
    metadata?: any
  ) {
    return prisma.bookingEvent.create({
      data: {
        bookingId,
        eventType,
        actorId,
        metadata: metadata ? (metadata as Prisma.InputJsonValue) : undefined,
      },
    });
  }

  /**
   * Creates a draft booking.
   * Atomic operation within a transaction is used for checking capacity during actual payment initialization,
   * but creating a DRAFT does not reserve seats.
   */
  static async createDraftBooking(data: {
    tripId: string;
    userId: string;
    travelerCount: number;
    totalAmount: number;
    advanceAmount: number;
    travelers: Omit<Prisma.BookingTravelerCreateWithoutBookingInput, "id" | "createdAt" | "updatedAt">[];
    emergencyContacts: Omit<Prisma.EmergencyContactCreateWithoutBookingInput, "id" | "createdAt" | "updatedAt">[];
    lockId?: string;
  }) {
    let expiresAt: Date | undefined;

    // 1. If lockId is provided, verify it
    if (data.lockId) {
      const lock = await prisma.bookingLock.findUnique({ where: { id: data.lockId } });
      if (!lock) throw new Error("Booking lock not found");
      if (lock.userId !== data.userId) throw new Error("Unauthorized lock");
      if (lock.expiresAt < new Date()) throw new Error("Booking lock expired");
      expiresAt = lock.expiresAt;
    } else {
      // Validate basic capacity if no lock
      const remaining = await this.getRemainingSeats(data.tripId);
      if (remaining < data.travelerCount) {
        throw new Error(`Only ${remaining} seats remaining.`);
      }
    }

    // 2. Create booking
    const booking = await prisma.booking.create({
      data: {
        bookingNumber: this.generateBookingNumber(),
        tripId: data.tripId,
        userId: data.userId,
        expiresAt,
        status: BookingStatus.DRAFT,
        travelerCount: data.travelerCount,
        totalAmount: data.totalAmount,
        advanceAmount: data.advanceAmount,
        amountPaid: 0,
        travelers: {
          create: data.travelers,
        },
        emergencyContacts: {
          create: data.emergencyContacts,
        },
      },
    });

    // 3. Log event
    await this.logEvent(booking.id, EventType.BOOKING_CREATED, data.userId);

    // 4. Update trip analytics (ponytail: async background update)
    prisma.trip.update({
      where: { id: data.tripId },
      data: { bookingStarted: { increment: 1 } },
    }).catch(console.error);

    return booking;
  }

  /**
   * Promotes booking status
   */
  static async updateStatus(
    bookingId: string, 
    newStatus: BookingStatus, 
    actorId?: string, 
    metadata?: any
  ) {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: newStatus },
    });

    // We don't have a specific event for every status change yet, 
    // but we can map some if needed.
    return booking;
  }
}
