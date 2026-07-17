import PDFDocument from "pdfkit";
import { prisma } from "@/lib/prisma";
import { EventType } from "@prisma/client";

export class DocumentService {
  /**
   * Generates a PDF receipt and invoice record for a successful payment.
   */
  static async generateReceiptAndInvoice(bookingId: string, paymentId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { trip: true, user: true },
    });
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!booking || !payment) throw new Error("Booking or Payment not found");

    // 1. Generate Invoice Record
    const invoiceNumber = `INV-${booking.bookingNumber}-${Date.now().toString().slice(-4)}`;
    const receiptNumber = `RCPT-${booking.bookingNumber}-${Date.now().toString().slice(-4)}`;
    
    const amount = Math.round(payment.amount);
    const gst = Math.round(amount * 0.18); 
    
    const invoice = await prisma.invoice.create({
      data: {
        booking: { connect: { id: bookingId } },
        invoiceNumber,
        amount: amount - gst,
        gst: gst,
        pdfUrl: "", 
      }
    });

    const receipt = await prisma.receipt.create({
      data: {
        booking: { connect: { id: bookingId } },
        receiptNumber,
        amount: amount,
        paymentReference: payment.transactionId,
        pdfUrl: "",
      }
    });

    // 2. Generate Receipt PDF using PDFKit
    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      doc.fontSize(20).text("ToursBU Receipt", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`Receipt No: ${receiptNumber}`);
      doc.text(`Invoice No: ${invoiceNumber}`);
      doc.text(`Date: ${new Date().toLocaleDateString()}`);
      doc.text(`Booking Number: ${booking.bookingNumber}`);
      doc.moveDown();
      doc.text(`Billed To: ${booking.user.name} (${booking.user.email})`);
      doc.moveDown();
      doc.text(`Trip: ${booking.trip.title}`);
      doc.text(`Amount Paid: INR ${amount}`);
      doc.text(`Transaction ID: ${payment.transactionId}`);
      doc.moveDown();
      doc.fontSize(10).text("Thank you for traveling with ToursBU!", { align: "center" });
      
      doc.end();
    });

    // 3. Mock Upload to Supabase Storage
    const mockPdfUrl = `https://storage.toursbu.com/receipts/${receiptNumber}.pdf`;

    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { pdfUrl: mockPdfUrl },
    });

    await prisma.receipt.update({
      where: { id: receipt.id },
      data: { pdfUrl: mockPdfUrl },
    });

    // 4. Log Events
    await prisma.bookingEvent.create({
      data: {
        bookingId: booking.id,
        eventType: EventType.RECEIPT_GENERATED,
        metadata: { invoiceNumber, receiptNumber, url: mockPdfUrl }
      }
    });

    return invoice;
  }
}
