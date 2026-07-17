import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { env } from "@/env";

export async function GET() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const healthInfo: Record<string, any> = {
    status: "ok",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "0.1.0",
    env: {
      NODE_ENV: env.NODE_ENV,
      appUrl: env.NEXT_PUBLIC_APP_URL,
    },
    checks: {
      database: "checking",
      auth: "checking",
    },
  };

  try {
    // 1. Check Database (Prisma)
    await prisma.$queryRaw`SELECT 1`;
    healthInfo.checks.database = "ok";
  } catch (error) {
    healthInfo.checks.database = "failed";
    healthInfo.status = "degraded";
    healthInfo.error = (error as Error).message;
  }

  try {
    // 2. Check Auth Configuration implicitly
    // If env validation passed on startup, BETTER_AUTH_SECRET and BETTER_AUTH_URL are present
    if (env.BETTER_AUTH_SECRET && env.BETTER_AUTH_URL) {
      healthInfo.checks.auth = "ok";
    } else {
      throw new Error("Missing Auth Env");
    }
  } catch (error) {
    healthInfo.checks.auth = "failed";
    healthInfo.status = "degraded";
  }

  return NextResponse.json(healthInfo, {
    status: healthInfo.status === "ok" ? 200 : 503,
  });
}
