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
      role: { type: "string" },
      phone: { type: "string" },
      college: { type: "string" },
      emergencyContact: { type: "string" },
      onboardingCompleted: { type: "boolean" },
    },
  },
  socialProviders: getSocialProviders(),
  plugins: getAuthPlugins(),
  databaseHooks: getAuthCallbacks(),
});
