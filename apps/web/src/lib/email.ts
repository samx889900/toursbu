import { Resend } from "resend";
import { render } from "@react-email/render";
import { OTPEmail } from "@/emails/otp";
import { env } from "@/env";
import * as React from "react";

const resend = new Resend(env.RESEND_API_KEY || "dummy_key");

export const sendOTPEmail = async (email: string, otp: string) => {
  if (env.NODE_ENV === "development") {
    console.log(`[Development Mode] OTP for ${email}: ${otp}`);
  }

  if (!env.RESEND_API_KEY) {
    console.log(`[Email Suppressed] No API key detected. Skipping email send.`);
    return;
  }

  try {
    const html = await render(React.createElement(OTPEmail, { otp }));

    const { data, error: resendError } = await resend.emails.send({
      from: "ToursBU <auth@tours.buconfess.in>", // Using verified domain
      to: email,
      subject: "Your ToursBU Verification Code",
      html: html,
    });

    if (resendError) {
      console.error("Resend API Error:", resendError);
      throw new Error(resendError.message || "Failed to send verification email");
    }
  } catch (error) {
    console.error("Failed to send OTP email", error);
    throw new Error("Failed to send verification email");
  }
};
