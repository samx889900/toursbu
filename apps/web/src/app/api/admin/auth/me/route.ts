import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin-session";

export async function GET() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.json({
    id: session.admin.id,
    email: session.admin.email,
    fullName: session.admin.fullName,
    role: session.admin.role,
    mustChangePassword: session.admin.mustChangePassword,
  });
}
