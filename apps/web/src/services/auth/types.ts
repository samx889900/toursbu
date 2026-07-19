// ─── Auth Provider Types ─────────────────────────────────────
// Provider-agnostic type definitions for the ToursBU auth system.
// The UI layer depends ONLY on these types — never on provider internals.

/** Supported authentication providers */
export type AuthProvider = "google" | "apple" | "microsoft" | "email";

export const OTP_LENGTH = 6;
export const OTP_TIMEOUT = 60; // seconds

/** Auth flow state machine */
export type AuthState =
  | "idle"
  | "loading"
  | "otp_sent"
  | "verifying"
  | "create_password"
  | "success"
  | "error";

/** Structured error codes for programmatic handling */
export type AuthErrorCode =
  | "INVALID_EMAIL"
  | "INVALID_OTP"
  | "OTP_EXPIRED"
  | "NETWORK_ERROR"
  | "AUTH_CANCELLED"
  | "PROVIDER_ERROR"
  | "RATE_LIMITED"
  | "TERMS_NOT_ACCEPTED"
  | "UNKNOWN";

/** Auth error object */
export interface AuthError {
  code: AuthErrorCode;
  message: string;
  /** Whether the user can retry the action */
  retryable: boolean;
}

/** User object returned after successful authentication */
export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: "STUDENT" | "ADMIN";
  onboardingCompleted: boolean;
  /** All linked auth providers for this account */
  providers: AuthProvider[];
}

/** Result of an auth operation — either success or error */
export type AuthResult =
  | { success: true; user: AuthUser }
  | { success: false; error: AuthError };

/** Result of sending an OTP */
export type OTPSendResult =
  | { success: true; expiresIn: number }
  | { success: false; error: AuthError };

/** Result of verifying an OTP */
export type OTPVerifyResult = AuthResult;

/** Interface that every auth provider must implement */
export interface IAuthProvider {
  readonly name: AuthProvider;
  readonly displayName: string;
  /** Initiate sign-in with this provider */
  signIn(): Promise<AuthResult>;
}

/** Interface for the email OTP provider (extends base with OTP methods) */
export interface IEmailOTPProvider extends IAuthProvider {
  sendOTP(email: string): Promise<OTPSendResult>;
  verifyOTP(email: string, code: string): Promise<OTPVerifyResult>;
}
