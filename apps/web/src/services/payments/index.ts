import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";
import { BookingService } from "@/services/bookings";
import crypto from "crypto";
import { PaymentAttemptStatus, PaymentStatus, BookingStatus, EventType } from "@prisma/client";
import { DocumentService } from "@/services/documents";

export class PaymentService {
  /**
   * Initializes a Razorpay order for a booking.
   * Handles capacity check before generating the order to prevent overselling.
   */
  static async createOrder(bookingId: string, amount: number, isAdvance: boolean = false) {
    // 1. Get booking and check if payment is already made or capacity is full
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { trip: true },
    });

    if (!booking) throw new Error("Booking not found");

    // 2. Capacity check (only if creating first order for DRAFT)
    if (booking.status === BookingStatus.DRAFT) {
      const remaining = await BookingService.getRemainingSeats(booking.tripId);
      if (remaining < booking.travelerCount) {
        throw new Error(`Trip sold out. Only ${remaining} seats left.`);
      }
    }

    // 3. Create order on Razorpay
    const options = {
      amount: amount * 100, // Razorpay takes amount in paise/cents
      currency: "INR",
      receipt: `rcpt_${booking.bookingNumber}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order || !order.id) {
      throw new Error("Failed to create Razorpay order");
    }

    // 4. Record PaymentAttempt
    const attempt = await prisma.paymentAttempt.create({
      data: {
        bookingId,
        razorpayOrderId: order.id,
        amount,
        status: PaymentAttemptStatus.CREATED,
      },
    });

    // 5. Update Booking Status if DRAFT
    if (booking.status === BookingStatus.DRAFT) {
      await BookingService.updateStatus(booking.id, BookingStatus.PENDING_PAYMENT);
      await BookingService.logEvent(booking.id, EventType.PAYMENT_STARTED, booking.userId);
    }

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      attemptId: attempt.id,
    };
  }

  /**
   * Verifies the Razorpay webhook signature.
   */
  static verifyWebhookSignature(body: string, signature: string): boolean {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      console.warn("RAZORPAY_WEBHOOK_SECRET is not set");
      return false;
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    return expectedSignature === signature;
  }

  /**
   * Processes a successful payment from a webhook.
   */
  static async processPaymentSuccess(payload: any) {
    const paymentEntity = payload.payload.payment.entity;
    const orderId = paymentEntity.order_id;
    const transactionId = paymentEntity.id;
    // Razorpay sends amount in paise
    const amountPaid = paymentEntity.amount / 100;

    // 1. Find the payment attempt
    const attempt = await prisma.paymentAttempt.findUnique({
      where: { razorpayOrderId: orderId },
      include: { booking: true },
    });

    if (!attempt) {
      throw new Error(`Payment attempt not found for order ${orderId}`);
    }

    if (attempt.status === PaymentAttemptStatus.SUCCESS) {
      // Idempotency: Already processed
      return { status: "already_processed" };
    }

    const booking = attempt.booking;

    const paymentRecord = await prisma.$transaction(async (tx) => {
      // Mark attempt as SUCCESS
      await tx.paymentAttempt.update({
        where: { id: attempt.id },
        data: { status: PaymentAttemptStatus.SUCCESS },
      });

      // Create Payment record
      const paymentRecord = await tx.payment.create({
        data: {
          bookingId: booking.id,
          amount: amountPaid,
          status: PaymentStatus.SUCCESS,
          type: amountPaid >= booking.totalAmount ? "FULL" : (amountPaid === booking.advanceAmount ? "ADVANCE" : "REMAINING"),
          transactionId: transactionId,
        },
      });

      // Update Booking Amount & Status
      const newAmountPaid = booking.amountPaid + amountPaid;
      
      let newStatus = booking.status;
      if (newAmountPaid >= booking.totalAmount) {
        newStatus = BookingStatus.CONFIRMED;
      } else if (newAmountPaid >= booking.advanceAmount) {
        // Technically CONFIRMED if advance is paid, pending remaining
        newStatus = BookingStatus.CONFIRMED; 
      }

      await tx.booking.update({
        where: { id: booking.id },
        data: {
          amountPaid: newAmountPaid,
          status: newStatus,
        },
      });

      // Log events
      await tx.bookingEvent.create({
        data: {
          bookingId: booking.id,
          eventType: newAmountPaid >= booking.advanceAmount ? EventType.PAYMENT_SUCCESS : EventType.BOOKING_CONFIRMED,
          metadata: { transactionId, amountPaid },
        },
      });

      // 3. Release Booking Lock if exists
      await tx.bookingLock.deleteMany({
        where: { tripId: booking.tripId, userId: booking.userId }
      });
      await tx.bookingEvent.create({
        data: { bookingId: booking.id, eventType: EventType.LOCK_RELEASED, metadata: {} },
      });

      // 4. Create Default Booking Checklist
      await tx.bookingChecklistItem.createMany({
        data: [
          { bookingId: booking.id, title: "Advance Payment Completed", completed: true, completedAt: new Date(), order: 1 },
          { bookingId: booking.id, title: "Remaining Payment Pending", completed: newAmountPaid >= booking.totalAmount, order: 2 },
          { bookingId: booking.id, title: "Government ID Upload", completed: false, order: 3 },
          { bookingId: booking.id, title: "WhatsApp Group Pending", completed: false, order: 4 },
          { bookingId: booking.id, title: "Room Allocation Pending", completed: false, order: 5 },
          { bookingId: booking.id, title: "Bus Allocation Pending", completed: false, order: 6 },
          { bookingId: booking.id, title: "Trip Documents Pending", completed: false, order: 7 },
        ]
      });
      await tx.bookingEvent.create({
        data: { bookingId: booking.id, eventType: EventType.CHECKLIST_CREATED, metadata: {} }
      });

      // Analytics
      await tx.trip.update({
        where: { id: booking.tripId },
        data: { paymentSuccess: { increment: 1 }, bookingCompleted: { increment: 1 } },
      });

      return paymentRecord;
    });

    // Generate PDF Receipt & Invoice outside transaction (won't block DB)
    if (paymentRecord) {
      try {
        await DocumentService.generateReceiptAndInvoice(booking.id, paymentRecord.id);
      } catch (error) {
        console.error("Failed to generate receipt:", error);
      }
    }

    return { status: "processed", bookingId: booking.id };
  }

  /**
   * Stores webhook payload permanently for idempotency and replay.
   */
  static async storeWebhookEvent(eventId: string, eventType: string, payload: any) {
    // Upsert to handle potential duplicates cleanly without throwing
    return prisma.paymentWebhookEvent.upsert({
      where: { eventId },
      update: {}, // Do nothing if it exists
      create: {
        eventId,
        eventType,
        payload,
      },
    });
  }

  /**
   * Processes a failed payment from a webhook.
   */
  static async processPaymentFailure(payload: any) {
    const paymentEntity = payload.payload.payment.entity;
    const orderId = paymentEntity.order_id;

    const attempt = await prisma.paymentAttempt.findUnique({
      where: { razorpayOrderId: orderId },
      include: { booking: true },
    });

    if (!attempt) {
      throw new Error(`Payment attempt not found for order ${orderId}`);
    }

    if (attempt.status === PaymentAttemptStatus.FAILED) {
      return { status: "already_processed" };
    }

    await prisma.$transaction(async (tx) => {
      await tx.paymentAttempt.update({
        where: { id: attempt.id },
        data: { status: PaymentAttemptStatus.FAILED },
      });

      await tx.bookingEvent.create({
        data: {
          bookingId: attempt.bookingId,
          eventType: EventType.PAYMENT_FAILED,
          metadata: { error: paymentEntity.error_description },
        },
      });
    });

    return { status: "processed", bookingId: attempt.bookingId };
  }

  /**
   * Marks a webhook event as processed.
   */
  static async markWebhookProcessed(eventId: string) {
    return prisma.paymentWebhookEvent.update({
      where: { eventId },
      data: { processed: true },
    });
  }
}
