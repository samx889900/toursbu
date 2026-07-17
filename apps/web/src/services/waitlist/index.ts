import { prisma } from "@/lib/prisma";
import { EventType, WaitlistStatus, BookingStatus } from "@prisma/client";
import { NotificationService } from "../notifications";

export class WaitlistService {
  /**
   * Promotes a waitlist entry to a DRAFT booking and sends a payment link.
   */
  static async promoteEntry(waitlistId: string, adminId: string) {
    const entry = await prisma.waitlistEntry.findUnique({
      where: { id: waitlistId },
      include: { trip: true, user: true },
    });

    if (!entry) throw new Error("Waitlist entry not found");
    if (entry.status !== WaitlistStatus.WAITING) {
      throw new Error(`Cannot promote waitlist in status: ${entry.status}`);
    }

    // 1. Mark waitlist as promoted
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    await prisma.waitlistEntry.update({
      where: { id: waitlistId },
      data: {
        status: WaitlistStatus.PROMOTED,
        promotedAt: new Date(),
        expiresAt,
      },
    });

    // 2. Create DRAFT booking
    // Calculate total amount based on travelerCount and trip price.
    // In a real scenario, you'd pull basePrice from the Trip model.
    const basePrice = entry.trip.price || 0; 
    const advanceAmount = entry.trip.advanceAmount || 0;
    const totalAmount = basePrice * entry.travelerCount;

    const booking = await prisma.booking.create({
      data: {
        bookingNumber: `TBU-WL-${Date.now().toString().slice(-6)}`,
        tripId: entry.tripId,
        userId: entry.userId,
        status: BookingStatus.DRAFT,
        totalAmount,
        advanceAmount: advanceAmount * entry.travelerCount,
        travelerCount: entry.travelerCount,
      },
    });

    // 3. Log events
    await prisma.bookingEvent.createMany({
      data: [
        {
          bookingId: booking.id,
          actorId: adminId,
          eventType: EventType.WAITLIST_PROMOTED,
          metadata: { waitlistId: entry.id },
        },
        {
          bookingId: booking.id,
          actorId: adminId,
          eventType: EventType.PAYMENT_LINK_SENT,
          metadata: { expiresAt },
        },
      ],
    });

    // 4. Send Notification
    const paymentUrl = `/trips/${entry.trip.slug}/book/payment?bookingId=${booking.id}`;
    
    await NotificationService.createInAppNotification({
      userId: entry.userId,
      title: "Waitlist Approved!",
      message: `Your waitlist for ${entry.trip.title} has been approved. You have 24 hours to complete the payment.`,
      type: "WAITLIST_PROMOTED",
      actionUrl: paymentUrl,
    });

    // Email would be sent here
    console.log(`[WaitlistService] Sending payment link to ${entry.user.email} for Booking ${booking.id}`);

    return { booking, entry };
  }

  /**
   * Called by a cron job or scheduled task to expire promoted waitlists that weren't paid.
   */
  static async expirePromotedWaitlists() {
    const expiredEntries = await prisma.waitlistEntry.findMany({
      where: {
        status: WaitlistStatus.PROMOTED,
        expiresAt: { lt: new Date() },
      },
    });

    for (const entry of expiredEntries) {
      await prisma.waitlistEntry.update({
        where: { id: entry.id },
        data: { status: WaitlistStatus.CANCELLED },
      });

      // Find the associated DRAFT booking and cancel it
      const booking = await prisma.booking.findFirst({
        where: {
          tripId: entry.tripId,
          userId: entry.userId,
          status: BookingStatus.DRAFT,
        },
      });

      if (booking) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { status: BookingStatus.CANCELLED },
        });

        await prisma.bookingEvent.create({
          data: {
            bookingId: booking.id,
            eventType: EventType.WAITLIST_EXPIRED,
          },
        });
      }

      await NotificationService.createInAppNotification({
        userId: entry.userId,
        title: "Waitlist Expired",
        message: "Your waitlist promotion has expired due to non-payment.",
        type: "WAITLIST_EXPIRED",
      });
    }

    return expiredEntries.length;
  }
}
