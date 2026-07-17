import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";
import { env } from "@/env";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL, // Points to our Next.js API routes where Better Auth server is hosted
  plugins: [emailOTPClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
