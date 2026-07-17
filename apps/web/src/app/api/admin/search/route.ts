import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    // Simplified role check for demo (should verify SUPER_ADMIN or ADMIN)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const results = [];

    // Search Bookings (by bookingNumber)
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { bookingNumber: { contains: query, mode: "insensitive" } },
          { user: { name: { contains: query, mode: "insensitive" } } },
          { user: { email: { contains: query, mode: "insensitive" } } }
        ]
      },
      include: { user: true },
      take: 5
    });

    for (const b of bookings) {
      results.push({
        title: `Booking ${b.bookingNumber}`,
        subtitle: `User: ${b.user.name} | Status: ${b.status}`,
        url: `/admin/bookings/${b.id}`
      });
    }

    // Search Trips
    const trips = await prisma.trip.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { location: { contains: query, mode: "insensitive" } }
        ]
      },
      take: 3
    });

    for (const t of trips) {
      results.push({
        title: `Trip: ${t.title}`,
        subtitle: `Location: ${t.location}`,
        url: `/admin/trips/${t.id}`
      });
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
