import { NextResponse } from "next/server";
import { WaitlistService } from "@/services/waitlist";

export async function GET(request: Request) {
  try {
    // In production on Vercel, check the CRON_SECRET header
    const authHeader = request.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const expiredCount = await WaitlistService.expirePromotedWaitlists();
    
    return NextResponse.json({ success: true, expired: expiredCount });
  } catch (error) {
    console.error("Waitlist Cron Job Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
