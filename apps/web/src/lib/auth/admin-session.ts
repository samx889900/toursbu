import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "toursbu-admin-session";
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function createAdminSession(
  adminId: string,
  ipAddress?: string | null,
  userAgent?: string | null
) {
  // Clean up expired sessions for this admin
  await prisma.adminSession.deleteMany({
    where: { adminId, expiresAt: { lt: new Date() } },
  });

  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.adminSession.create({
    data: { token, adminId, expiresAt, ipAddress, userAgent },
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return token;
}

export async function getAdminSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const session = await prisma.adminSession.findUnique({
      where: { token },
      include: { admin: true },
    });

    if (!session) return null;
    if (session.expiresAt < new Date()) {
      await prisma.adminSession.delete({ where: { id: session.id } });
      return null;
    }
    if (!session.admin.isActive) return null;

    return session;
  } catch {
    return null;
  }
}

/** For middleware: reads token from request headers directly (no next/headers) */
export async function getAdminSessionFromRequest(cookieHeader: string | null) {
  if (!cookieHeader) return null;

  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`)
  );
  const token = match?.[1];
  if (!token) return null;

  // ponytail: middleware calls this on every admin route; the DB lookup is fine
  // at current scale. If it becomes a bottleneck, cache in Redis.
  const session = await prisma.adminSession.findUnique({
    where: { token },
    include: { admin: { select: { id: true, role: true, isActive: true } } },
  });

  if (!session) return null;
  if (session.expiresAt < new Date()) return null;
  if (!session.admin.isActive) return null;

  return session;
}

export async function deleteAdminSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (token) {
      await prisma.adminSession.deleteMany({ where: { token } });
    }

    cookieStore.set(COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  } catch {
    // Ignore errors during cleanup
  }
}

/** Record a login attempt for auditing and rate limiting */
export async function recordLoginAttempt(
  email: string,
  success: boolean,
  ipAddress?: string | null,
  userAgent?: string | null
) {
  await prisma.adminLoginAttempt.create({
    data: { email, success, ipAddress, userAgent },
  });
}

/** Check if login is rate-limited (5 failed attempts in last 15 minutes) */
export async function isRateLimited(email: string): Promise<boolean> {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

  const failedAttempts = await prisma.adminLoginAttempt.count({
    where: {
      email,
      success: false,
      createdAt: { gte: fifteenMinutesAgo },
    },
  });

  return failedAttempts >= 5;
}

/** Log an admin action to the AuditLog table */
export async function logAdminAction(
  action: string,
  actorId: string,
  resource: string,
  resourceId?: string,
  metadata?: Record<string, unknown>
) {
  await prisma.auditLog.create({
    data: { action, actorId, resource, resourceId, metadata: metadata as any ?? undefined },
  });
}
