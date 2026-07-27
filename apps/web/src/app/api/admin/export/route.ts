import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin-session";
import { CSVExportService } from "@/services/csv-export";

export async function GET(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session?.admin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    let stream: ReadableStream | string;
    let filename: string;

    switch (type) {
      case "bookings":
        stream = await CSVExportService.exportBookings();
        filename = "bookings.csv";
        break;
      case "travelers":
        stream = await CSVExportService.exportTravelers();
        filename = "travelers.csv";
        break;
      case "revenue":
        stream = await CSVExportService.exportRevenue();
        filename = "revenue.csv";
        break;
      default:
        return new NextResponse("Invalid export type", { status: 400 });
    }

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
