import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs"; // Usually better-auth uses bcrypt or we can just use bcryptjs directly

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { password } = body;

    if (!password || password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    // Hash the password (better-auth uses standard bcrypt/argon2, bcrypt is standard)
    // Actually, better-auth v1 uses `bcrypt` format if we use standard emailAndPassword.
    // Let's use bcrypt.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update or create the credential account for this user
    // Better auth looks for providerId: "credential" when using emailAndPassword
    const existingAccount = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        providerId: "credential",
      }
    });

    if (existingAccount) {
      await prisma.account.update({
        where: { id: existingAccount.id },
        data: { password: hashedPassword }
      });
    } else {
      await prisma.account.create({
        data: {
          userId: session.user.id,
          accountId: session.user.id,
          providerId: "credential",
          password: hashedPassword,
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[set-password] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
