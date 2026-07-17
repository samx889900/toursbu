import type {
  AuthResult,
  IEmailOTPProvider,
  OTPSendResult,
  OTPVerifyResult,
} from "../types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Demo OTP code for development */
const DEMO_OTP = "123456";

export class EmailOTPProvider implements IEmailOTPProvider {
  readonly name = "email" as const;
  readonly displayName = "Email";

  async signIn(): Promise<AuthResult> {
    // Email provider doesn't support direct signIn — use sendOTP + verifyOTP
    return {
      success: false,
      error: {
        code: "PROVIDER_ERROR",
        message: "Use sendOTP and verifyOTP for email authentication.",
        retryable: false,
      },
    };
  }

  async sendOTP(email: string): Promise<OTPSendResult> {
    // TODO: Replace with real email OTP delivery (Resend / ZeptoMail / Zoho)
    await delay(1000);

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        success: false,
        error: {
          code: "INVALID_EMAIL",
          message: "Please enter a valid email address.",
          retryable: true,
        },
      };
    }

    // Simulate rate limiting (for demo, always succeeds)
    console.log(`[EmailOTPProvider] OTP sent to ${email}. Demo code: ${DEMO_OTP}`);

    return {
      success: true,
      expiresIn: 60, // seconds
    };
  }

  async verifyOTP(email: string, code: string): Promise<OTPVerifyResult> {
    // TODO: Replace with real OTP verification
    await delay(1200);

    // Simulate Rate Limiting (stub)
    // if (tooManyAttempts) {
    //   return {
    //     success: false,
    //     error: {
    //       code: "RATE_LIMITED",
    //       message: "Too many attempts. Try again in 5 minutes.",
    //       retryable: false,
    //     },
    //   };
    // }

    if (code !== DEMO_OTP) {
      return {
        success: false,
        error: {
          code: "INVALID_OTP",
          message: "That code doesn't look right. Please try again.",
          retryable: true,
        },
      };
    }

    return {
      success: true,
      user: {
        id: "email_mock_001",
        email,
        name: null,
        avatar: null,
        role: "STUDENT",
        onboardingCompleted: false,
        providers: ["email"],
      },
    };
  }
}
