import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  createAdminSession,
  recordLoginAttempt,
  isRateLimited,
  logAdminAction,
} from "@/lib/auth/admin-session";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip");
    const ua = request.headers.get("user-agent");

    // Rate limiting
    if (await isRateLimited(email)) {
      return NextResponse.json(
        { error: "Too many failed attempts. Please try again in 15 minutes." },
        { status: 429 }
      );
    }

    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      await recordLoginAttempt(email, false, ip, ua);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!admin.isActive) {
      await recordLoginAttempt(email, false, ip, ua);
      return NextResponse.json(
        { error: "Account is disabled. Contact your administrator." },
        { status: 403 }
      );
    }

    const passwordValid = await bcrypt.compare(password, admin.passwordHash);
    if (!passwordValid) {
      await recordLoginAttempt(email, false, ip, ua);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Success
    await recordLoginAttempt(email, true, ip, ua);

    // Update last login
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date(), lastLoginIp: ip },
    });

    await createAdminSession(admin.id, ip, ua);

    await logAdminAction("ADMIN_LOGGED_IN", admin.id, "admin", admin.id);

    return NextResponse.json({
      id: admin.id,
      email: admin.email,
      fullName: admin.fullName,
      role: admin.role,
      mustChangePassword: admin.mustChangePassword,
    });
  } catch (error) {
    console.error("[Admin Login Error]:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
