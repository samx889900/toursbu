import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");

    if (!type || !id) {
      return new NextResponse("Missing parameters", { status: 400 });
    }

    let bookingId: string | undefined;

    if (type === "receipt") {
      const receipt = await prisma.receipt.findUnique({ where: { id } });
      if (!receipt) return new NextResponse("Not Found", { status: 404 });
      bookingId = receipt.bookingId;
    } else if (type === "invoice") {
      const invoice = await prisma.invoice.findUnique({ where: { id } });
      if (!invoice) return new NextResponse("Not Found", { status: 404 });
      bookingId = invoice.bookingId;
    } else {
      return new NextResponse("Invalid document type", { status: 400 });
    }

    // Verify ownership or admin
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) return new NextResponse("Booking Not Found", { status: 404 });

    // In a real app, also check if session.user is ADMIN or SUPER_ADMIN
    if (booking.userId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Since we are mocking PDFs, we just return a text file acting as a PDF
    const mockContent = `Document Type: ${type.toUpperCase()}\nDocument ID: ${id}\nBooking ID: ${bookingId}\nAmount: ${booking.totalAmount}\n\nThis is a securely generated document.`;
    
    return new NextResponse(mockContent, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${type}-${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Document download error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
