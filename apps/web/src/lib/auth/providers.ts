import { env } from "@/env";
import { emailOTP } from "better-auth/plugins";
import { sendOTPEmail } from "@/lib/email";

export const getAuthPlugins = () => {
  return [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in" || type === "email-verification") {
          await sendOTPEmail(email, otp);
        }
      },
      expiresIn: 60 * 5, // 5 minutes
    }),
  ];
};

export const getSocialProviders = () => {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    return undefined; // Or throw error in strict mode
  }
  return {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  };
};
