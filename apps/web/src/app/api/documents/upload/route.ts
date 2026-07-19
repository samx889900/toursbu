import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { StorageService } from "@/services/storage";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const bookingId = formData.get("bookingId") as string | null;
    const travelerId = formData.get("travelerId") as string | null;
    const documentType = formData.get("type") as string | null;

    if (!file || !bookingId || !travelerId || !documentType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Validate Booking Ownership
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        travelers: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized to access this booking" }, { status: 403 });
    }

    // 2. Validate Traveler exists in this booking
    const traveler = booking.travelers.find((t) => t.id === travelerId);
    if (!traveler) {
      return NextResponse.json({ error: "Traveler not found in this booking" }, { status: 400 });
    }

    // 3. Upload File (Validation for size/mime happens in StorageService)
    try {
      const uploadResult = await StorageService.uploadTravelerDocument(file, booking.tripId, travelerId);
      
      // 4. Save metadata to Database
      const document = await prisma.travelerDocument.create({
        data: {
          travelerId,
          type: documentType as any,
          fileName: file.name,
          storagePath: uploadResult.path,
          mimeType: uploadResult.mimeType,
          size: uploadResult.size,
        },
      });

      return NextResponse.json({ success: true, document });
    } catch (uploadError: any) {
      return NextResponse.json({ error: uploadError.message }, { status: 400 });
    }

  } catch (error: any) {
    console.error("Document Upload API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
