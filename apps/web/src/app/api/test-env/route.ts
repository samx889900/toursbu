import { NextResponse } from "next/server";
import { env } from "@/env";

export async function GET() {
  return NextResponse.json({
    googleId: env.GOOGLE_CLIENT_ID || "missing",
    googleSecret: env.GOOGLE_CLIENT_SECRET ? "exists" : "missing",
  });
}
