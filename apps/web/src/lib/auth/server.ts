import { headers } from "next/headers";

/**
 * Utility for getting the active session in Server Components and Route Handlers.
 * Uses HTTP fetch to ensure 100% compatibility with Next.js Edge Runtime (Middleware).
 */
export const getSession = async () => {
  try {
    const reqHeaders = await headers();
    const cookieHeader = reqHeaders.get("cookie") || "";
    
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/auth/get-session`, {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data && data.session ? data : null;
  } catch (error) {
    console.error("[getSession] Error:", error);
    return null;
  }
};
