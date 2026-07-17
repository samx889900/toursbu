import { Resend } from "resend";
import { render } from "@react-email/render";
import { OTPEmail } from "@/emails/otp";
import { env } from "@/env";
import * as React from "react";

const resend = new Resend(env.RESEND_API_KEY || "dummy_key");

export const sendOTPEmail = async (email: string, otp: string) => {
  if (!env.RESEND_API_KEY) {
    console.log(`[Development Mode] OTP for ${email}: ${otp}`);
    return;
  }

  try {
    const html = await render(React.createElement(OTPEmail, { otp }));

    await resend.emails.send({
      from: "ToursBU <auth@toursbu.com>",
      to: email,
      subject: "Your ToursBU Verification Code",
      html: html,
    });
  } catch (error) {
    console.error("Failed to send OTP email", error);
    throw new Error("Failed to send verification email");
  }
};
