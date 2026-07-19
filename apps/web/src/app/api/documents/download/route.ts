import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import { StorageService } from "@/services/storage";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get("id");

    if (!documentId) {
      return NextResponse.json({ error: "Missing document ID" }, { status: 400 });
    }

    // Find the document and its associated booking
    const document = await prisma.travelerDocument.findUnique({
      where: { id: documentId },
      include: {
        traveler: {
          include: {
            booking: true
          }
        }
      }
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Validate ownership (or if user is admin - assuming we have a role field in the future, for now just owner)
    // For admin verification, we can check session.user.role === 'admin' later.
    if (document.traveler.booking.userId !== session.user.id && (session.user as any).role !== "ADMIN" && (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized to access this document" }, { status: 403 });
    }

    // Generate signed URL (valid for 5 minutes)
    // Note: We need to add getSignedUrl to StorageService
    const signedUrl = await StorageService.getSignedUrl("booking-documents", document.storagePath, 300);

    return NextResponse.redirect(signedUrl);

  } catch (error: any) {
    console.error("Document Download API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
