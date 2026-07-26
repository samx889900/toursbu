import { NextResponse } from "next/server";
import { getAdminSession, deleteAdminSession, logAdminAction } from "@/lib/auth/admin-session";

export async function POST() {
  try {
    const session = await getAdminSession();
    if (session) {
      await logAdminAction("ADMIN_LOGGED_OUT", session.adminId, "admin", session.adminId);
    }
    await deleteAdminSession();
    return NextResponse.json({ success: true });
  } catch {
    await deleteAdminSession();
    return NextResponse.json({ success: true });
  }
}
