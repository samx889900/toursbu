import type {
  AuthProvider,
  AuthResult,
  AuthUser,
  IAuthProvider,
  IEmailOTPProvider,
  OTPSendResult,
  OTPVerifyResult,
} from "./types";

import { GoogleProvider } from "./providers/GoogleProvider";
import { AppleProvider } from "./providers/AppleProvider";
import { MicrosoftProvider } from "./providers/MicrosoftProvider";
import { EmailOTPProvider } from "./providers/EmailOTPProvider";

/**
 * AuthService — the single entry point for all authentication operations.
 *
 * Usage:
 *   await AuthService.signIn("google")
 *   await AuthService.sendOTP("user@email.com")
 *   await AuthService.verifyOTP("user@email.com", "123456")
 *
 * The UI never interacts with providers directly.
 */
class AuthServiceClass {
  private providers: Record<AuthProvider, IAuthProvider>;
  private emailProvider: IEmailOTPProvider;

  constructor() {
    this.emailProvider = new EmailOTPProvider();
    this.providers = {
      google: new GoogleProvider(),
      apple: new AppleProvider(),
      microsoft: new MicrosoftProvider(),
      email: this.emailProvider,
    };
  }

  /** Sign in with a social provider (Google, Apple, Microsoft) */
  async signIn(provider: AuthProvider): Promise<AuthResult> {
    const p = this.providers[provider];
    if (!p) {
      return {
        success: false,
        error: {
          code: "PROVIDER_ERROR",
          message: `Unknown provider: ${provider}`,
          retryable: false,
        },
      };
    }
    try {
      const result = await p.signIn();
      
      // Architecture Note for Account Linking:
      // When the backend is integrated, if `result.user.email` already exists
      // in our database but under a different provider (e.g., they originally signed up with Email),
      // the backend should link this new OAuth provider to their existing account
      // instead of creating a new one. The frontend simply receives the merged user object.
      // E.g., user.providers = ["email", "google"]
      
      return result;
    } catch {
      return {
        success: false,
        error: {
          code: "NETWORK_ERROR",
          message: "Something went wrong. Please check your connection and try again.",
          retryable: true,
        },
      };
    }
  }

  /** Send an OTP to the given email address */
  async sendOTP(email: string): Promise<OTPSendResult> {
    try {
      return await this.emailProvider.sendOTP(email);
    } catch {
      return {
        success: false,
        error: {
          code: "NETWORK_ERROR",
          message: "Could not send verification code. Please try again.",
          retryable: true,
        },
      };
    }
  }

  /** Verify an OTP code */
  async verifyOTP(email: string, code: string): Promise<OTPVerifyResult> {
    try {
      return await this.emailProvider.verifyOTP(email, code);
    } catch {
      return {
        success: false,
        error: {
          code: "NETWORK_ERROR",
          message: "Verification failed. Please try again.",
          retryable: true,
        },
      };
    }
  }

  /** Sign out the current user */
  async signOut(): Promise<void> {
    // TODO: Clear session/cookies when backend is integrated
    console.log("[AuthService] User signed out");
  }

  /** Delete the current user's session from the backend (used during full logout or account deletion) */
  async deleteSession(): Promise<void> {
    // TODO: Make API call to invalidate the session token on the server
    console.log("[AuthService] Session deleted");
    await this.signOut();
  }

  /** Get the current authenticated user (null if not logged in) */
  async getSession(): Promise<AuthUser | null> {
    // TODO: Check session/cookie when backend is integrated
    return null;
  }

  /** Refresh the current session (useful after onboarding or profile updates) */
  async refreshSession(): Promise<AuthUser | null> {
    // TODO: Make API call to get the latest user data and update local session
    console.log("[AuthService] Session refreshed");
    return this.getSession();
  }

  /** Synchronous check if a user is currently authenticated (based on local state/cookie) */
  isAuthenticated(): boolean {
    // TODO: Check for presence of valid auth cookie or token in memory
    return false;
  }
}

/** Singleton instance */
export const AuthService = new AuthServiceClass();
