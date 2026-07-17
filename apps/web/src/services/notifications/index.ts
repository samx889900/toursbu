import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { env } from "@/env";
import { EventType } from "@prisma/client";

const resend = new Resend(env.RESEND_API_KEY || "dummy_key");

export class NotificationService {
  /**
   * Sends a transactional email and logs it to the database for tracking.
   */
  static async sendEmail(params: {
    to: string;
    subject: string;
    html: string;
    bookingId?: string; // Optional context
  }) {
    const { to, subject, html } = params;

    try {
      // Dev mode shortcut
      if (!env.RESEND_API_KEY) {
        console.log(`[Development Mode] Mock Email to ${to}: ${subject}`);
        await this.logEmail(to, subject, "SENT", "mock_id");
        return;
      }

      const response = await resend.emails.send({
        from: "ToursBU <no-reply@toursbu.com>",
        to,
        subject,
        html,
      });

      if (response.error) {
        await this.logEmail(to, subject, "FAILED", null);
        throw new Error(response.error.message);
      }

      await this.logEmail(to, subject, "SENT", response.data?.id || null);
    } catch (error) {
      console.error("Failed to send email:", error);
      await this.logEmail(to, subject, "FAILED", null);
      throw error;
    }
  }

  /**
   * Internal method to persist email logs.
   */
  private static async logEmail(to: string, subject: string, status: string, providerId: string | null) {
    return prisma.emailLog.create({
      data: {
        to,
        subject,
        status,
        providerId,
      },
    });
  }

  /**
   * Sends a WhatsApp joining link (architecture foundation).
   */
  static async sendWhatsAppJoinLink(bookingId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        trip: {
          include: { whatsappGroup: true }
        },
        travelers: { where: { isPrimary: true } }
      }
    });

    if (!booking) return;

    const group = booking.trip.whatsappGroup;
    if (!group) return;

    const primaryTraveler = booking.travelers[0];
    if (!primaryTraveler || !primaryTraveler.phone) return;

    // Eventually connect to an official WhatsApp API like Meta / Twilio
    console.log(`[WhatsApp Mock] Sending join link ${group.inviteLink} to ${primaryTraveler.phone}`);

    // Log the event
    await prisma.bookingEvent.create({
      data: {
        bookingId: booking.id,
        eventType: EventType.WHATSAPP_SHARED,
        metadata: {
          phone: primaryTraveler.phone,
          link: group.inviteLink
        }
      }
    });
  }

  // ─── IN-APP NOTIFICATIONS ────────────────────────────────────

  /**
   * Creates an in-app notification in the database.
   */
  static async createInAppNotification(input: {
    userId: string;
    title: string;
    message: string;
    type: string;
    actionUrl?: string;
  }) {
    return prisma.notification.create({
      data: {
        userId: input.userId,
        title: input.title,
        message: input.message,
        type: input.type,
        actionUrl: input.actionUrl,
      },
    });
  }

  /**
   * Fetches the latest notifications for a user
   */
  static async getForUser(userId: string, limit = 10) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  /**
   * Marks a notification as read
   */
  static async markAsRead(notificationId: string, userId: string) {
    return prisma.notification.update({
      where: { id: notificationId, userId },
      data: { read: true },
    });
  }

  /**
   * Gets the count of unread notifications
   */
  static async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: { userId, read: false },
    });
  }
}
