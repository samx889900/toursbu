import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getAdminSession, logAdminAction } from "@/lib/auth/admin-session";

/** GET /api/admin/admins — list all admins (SUPER_ADMIN only) */
export async function GET() {
  const session = await getAdminSession();
  if (!session || session.admin.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admins = await prisma.admin.findMany({
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(admins);
}

/** POST /api/admin/admins — create a new admin (SUPER_ADMIN only) */
export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session || session.admin.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { email, fullName, password, role } = await request.json();

  if (!email || !fullName || !password) {
    return NextResponse.json(
      { error: "Email, full name, and password are required" },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  // Cannot create another SUPER_ADMIN
  if (role === "SUPER_ADMIN") {
    return NextResponse.json(
      { error: "Cannot create a SUPER_ADMIN through the UI" },
      { status: 400 }
    );
  }

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An admin with this email already exists" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.admin.create({
    data: {
      email,
      fullName,
      passwordHash,
      role: role || "ADMIN",
      mustChangePassword: true,
    },
  });

  await logAdminAction("ADMIN_CREATED", session.adminId, "admin", admin.id, {
    email: admin.email,
    role: admin.role,
  });

  return NextResponse.json({
    id: admin.id,
    email: admin.email,
    fullName: admin.fullName,
    role: admin.role,
  });
}
