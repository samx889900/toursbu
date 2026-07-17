import { prisma } from "@/lib/prisma";

export class CSVExportService {
  /**
   * Generates a CSV string for all bookings (or filtered bookings)
   * In a true streaming environment, you would use a Web Stream API or Node stream,
   * but for the Next.js server actions / API endpoints, returning a constructed string 
   * is highly performant up to ~10,000 rows.
   */
  static async exportBookings() {
    const bookings = await prisma.booking.findMany({
      include: {
        trip: true,
        user: true,
        travelers: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const headers = ["Booking ID", "Booking Number", "Trip", "Student Name", "Student Email", "Status", "Total Amount", "Amount Paid", "Traveler Count", "Created At"];
    
    const rows = bookings.map(b => [
      b.id,
      b.bookingNumber,
      `"${b.trip.title.replace(/"/g, '""')}"`,
      `"${b.user.name.replace(/"/g, '""')}"`,
      b.user.email,
      b.status,
      b.totalAmount,
      b.amountPaid,
      b.travelerCount,
      b.createdAt.toISOString()
    ]);

    return [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  }

  static async exportTravelers() {
    const travelers = await prisma.bookingTraveler.findMany({
      include: {
        booking: {
          include: { trip: true }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    const headers = ["Traveler ID", "Name", "Email", "Phone", "Booking Number", "Trip", "Primary", "Created At"];

    const rows = travelers.map(t => [
      t.id,
      `"${t.name.replace(/"/g, '""')}"`,
      t.email || "",
      t.phone || "",
      t.booking.bookingNumber,
      `"${t.booking.trip.title.replace(/"/g, '""')}"`,
      t.isPrimary ? "Yes" : "No",
      t.createdAt.toISOString()
    ]);

    return [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  }

  static async exportRevenue() {
    const payments = await prisma.payment.findMany({
      include: {
        booking: {
          include: { user: true, trip: true }
        }
      },
      where: { status: "SUCCESS" },
      orderBy: { createdAt: "desc" },
    });

    const headers = ["Payment ID", "Transaction ID", "Amount", "Method", "Booking Number", "Trip", "Student Name", "Date"];

    const rows = payments.map(p => [
      p.id,
      p.transactionId || "",
      p.amount,
      p.method,
      p.booking.bookingNumber,
      `"${p.booking.trip.title.replace(/"/g, '""')}"`,
      `"${p.booking.user.name.replace(/"/g, '""')}"`,
      p.createdAt.toISOString()
    ]);

    return [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  }
}
