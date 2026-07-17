"use client";

import { useState, useCallback } from "react";
import { signIn } from "@/lib/auth/client";
import { AuthState, AuthError, AuthUser, AuthProvider } from "@/services/auth";

// We use the imported types from @/services/auth
// AuthState, AuthError, AuthUser are defined there

export interface UseAuthReturn {
  state: AuthState;
  error: AuthError | null;
  user: AuthUser | null; 
  email: string | null;
  otpExpiresIn: number;
  signInWithProvider: (provider: AuthProvider) => Promise<void>;
  sendOTP: (email: string) => Promise<void>;
  verifyOTP: (code: string) => Promise<void>;
  resendOTP: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>("idle");
  const [error, setError] = useState<AuthError | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [otpExpiresIn, setOtpExpiresIn] = useState(0);

  const clearError = useCallback(() => setError(null), []);

  const reset = useCallback(() => {
    setState("idle");
    setError(null);
    setUser(null);
    setEmail(null);
    setOtpExpiresIn(0);
  }, []);

  const signInWithProvider = useCallback(async (provider: AuthProvider) => {
    setState("loading");
    setError(null);

    // Filter out "email" since it uses sendOTP instead
    if (provider === "email") {
      setState("idle");
      return;
    }

    const { error } = await signIn.social({
      provider: provider as "google" | "apple" | "microsoft",
      callbackURL: "/dashboard", // We'll handle exact redirection in middleware or UI
    });

    if (error) {
      setError({ message: error.message || "Failed to sign in", code: error.status?.toString() || "500", retryable: true } as AuthError);
      setState("error");
    } else {
      // Better auth redirects automatically for social login, but just in case
      setState("success");
    }
  }, []);

  const sendOTP = useCallback(async (emailAddress: string) => {
    setState("loading");
    setError(null);
    setEmail(emailAddress);

    const { error } = await signIn.emailOtp({
      email: emailAddress,
    });

    if (error) {
      setError({ message: error.message || "Failed to send OTP", code: error.status?.toString() || "500", retryable: true } as AuthError);
      setState("error");
    } else {
      setOtpExpiresIn(300); // 5 minutes
      setState("otp_sent");
    }
  }, []);

  const verifyOTP = useCallback(
    async (code: string) => {
      if (!email) return;

      setState("verifying");
      setError(null);

      const { data, error } = await signIn.emailOtp({
        email,
        otp: code,
      });

      if (error) {
        setError({ message: error.message || "Invalid or expired code", code: error.status?.toString() || "400", retryable: true } as AuthError);
        setState("otp_sent"); // stay on OTP screen
      } else {
        setUser(data.user as unknown as AuthUser);
        setState("success");
      }
    },
    [email]
  );

  const resendOTP = useCallback(async () => {
    if (!email) return;
    await sendOTP(email);
  }, [email, sendOTP]);

  return {
    state,
    error,
    user,
    email,
    otpExpiresIn,
    signInWithProvider,
    sendOTP,
    verifyOTP,
    resendOTP,
    clearError,
    reset,
  };
}
