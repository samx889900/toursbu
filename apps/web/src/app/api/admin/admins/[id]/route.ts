import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession, logAdminAction } from "@/lib/auth/admin-session";

/** PATCH /api/admin/admins/[id] — update admin (toggle active, change role) */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session || session.admin.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const target = await prisma.admin.findUnique({ where: { id } });
  if (!target) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }

  // Protect SUPER_ADMIN
  if (target.role === "SUPER_ADMIN") {
    return NextResponse.json(
      { error: "Cannot modify a SUPER_ADMIN account" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const data: Record<string, unknown> = {};

  if (typeof body.isActive === "boolean") data.isActive = body.isActive;
  if (body.role && body.role !== "SUPER_ADMIN") data.role = body.role;
  if (body.fullName) data.fullName = body.fullName;

  const updated = await prisma.admin.update({ where: { id }, data });

  await logAdminAction("ADMIN_UPDATED", session.adminId, "admin", id, data);

  return NextResponse.json({
    id: updated.id,
    email: updated.email,
    fullName: updated.fullName,
    role: updated.role,
    isActive: updated.isActive,
  });
}

/** DELETE /api/admin/admins/[id] — delete admin (SUPER_ADMIN only, cannot delete SUPER_ADMIN) */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session || session.admin.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const target = await prisma.admin.findUnique({ where: { id } });
  if (!target) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }

  if (target.role === "SUPER_ADMIN") {
    return NextResponse.json(
      { error: "Cannot delete a SUPER_ADMIN account" },
      { status: 403 }
    );
  }

  // Delete all sessions first, then admin
  await prisma.adminSession.deleteMany({ where: { adminId: id } });
  await prisma.admin.delete({ where: { id } });

  await logAdminAction("ADMIN_DELETED", session.adminId, "admin", id, {
    email: target.email,
  });

  return NextResponse.json({ success: true });
}
