import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { env } from "@/env";
import { getAuthPlugins, getSocialProviders } from "./providers";
import { getAuthCallbacks } from "./callbacks";

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  advanced: {
    cookiePrefix: "toursbu",
    defaultCookieAttributes: {
      secure: true,
      httpOnly: true,
      sameSite: "lax",
    },
  },
  user: {
    additionalFields: {
      role: { type: "string", required: false },
      phone: { type: "string", required: false },
      college: { type: "string", required: false },
      emergencyContact: { type: "string", required: false },
      onboardingCompleted: { type: "boolean", required: false },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: getSocialProviders(),
  plugins: getAuthPlugins(),
  databaseHooks: getAuthCallbacks(),
});
