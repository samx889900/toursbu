"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import type { AuthProvider } from "@/services/auth";

import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { EmailForm } from "@/components/auth/EmailForm";
import { OTPForm } from "@/components/auth/OTPForm";
import { TermsCheckbox } from "@/components/auth/TermsCheckbox";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { LoadingOverlay } from "@/components/auth/LoadingOverlay";
import { ProfileCompletionService } from "@/services/auth/ProfileCompletionService";

/** Auth page state machine */
type AuthView = "providers" | "otp";

const PHOTO_URL =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop";

export default function AuthPage() {
  const router = useRouter();
  const auth = useAuth();

  const [view, setView] = useState<AuthView>("providers");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [activeProvider, setActiveProvider] = useState<AuthProvider | null>(null);

  const requireTerms = useCallback((): boolean => {
    if (!termsAccepted) {
      setTermsError(true);
      return false;
    }
    setTermsError(false);
    return true;
  }, [termsAccepted]);

  const handleProviderClick = useCallback(
    (provider: AuthProvider) => {
      if (!requireTerms()) return;
      setActiveProvider(provider);
      auth.signInWithProvider(provider);
    },
    [requireTerms, auth]
  );

  const handleEmailSubmit = useCallback(
    (email: string) => {
      if (!requireTerms()) return;
      auth.sendOTP(email);
    },
    [requireTerms, auth]
  );

  const handleVerifyOTP = useCallback(
    (code: string) => {
      auth.verifyOTP(code);
    },
    [auth]
  );

  const handleChangeEmail = useCallback(() => {
    auth.reset();
    setView("providers");
    setActiveProvider(null);
  }, [auth]);

  // Transition to OTP view when OTP is sent
  if (auth.state === "otp_sent" && view !== "otp") {
    setView("otp");
  }

  // Redirect on success after a brief delay for the animation
  if (auth.state === "success" && auth.user) {
    setTimeout(() => {
      const redirectPath = ProfileCompletionService.getRedirectPath(auth.user!);
      router.push(redirectPath);
    }, 1800);
  }

  const isLoading = auth.state === "loading" || auth.state === "verifying";

  return (
    <div className="flex min-h-screen bg-[var(--tbu-parchment)]">
      {/* Left Panel — Auth Card */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative">
        {/* Mobile hero photo */}
        <div
          className="absolute inset-x-0 top-0 h-[30vh] bg-cover bg-center lg:hidden"
          style={{ backgroundImage: `url(${PHOTO_URL})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-[var(--tbu-parchment)]" />
        </div>

        <div className="relative z-10 w-full max-w-[440px] pt-[20vh] lg:pt-0">
          <AuthCard>
            <div className="relative">
              <LoadingOverlay
                visible={auth.state === "success"}
                success
              />

              <AnimatePresence mode="wait">
                {view === "providers" ? (
                  <motion.div
                    key="providers"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AuthHeader
                      title="Welcome"
                      description="Sign in to discover and book curated student trips."
                    />

                    <SocialLoginButtons
                      onProviderClick={handleProviderClick}
                      loading={isLoading}
                      activeProvider={activeProvider}
                      disabled={auth.state === "success"}
                    />

                    <AuthDivider />

                    <EmailForm
                      onSubmit={handleEmailSubmit}
                      loading={isLoading && activeProvider === null}
                      disabled={auth.state === "success"}
                    />

                    <TermsCheckbox
                      checked={termsAccepted}
                      onChange={(checked) => {
                        setTermsAccepted(checked);
                        if (checked) setTermsError(false);
                      }}
                      error={termsError}
                    />

                    {/* Auth error */}
                    {auth.error && auth.state === "error" && (
                      <div className="mt-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 p-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        <p className="text-[13px] text-red-700 dark:text-red-400">
                          {auth.error.message}
                        </p>
                        {auth.error.retryable && (
                          <button
                            type="button"
                            onClick={() => auth.clearError()}
                            className="mt-1 text-[12px] font-semibold text-red-600 dark:text-red-400 hover:underline"
                          >
                            Try again
                          </button>
                        )}
                      </div>
                    )}

                    <AuthFooter />
                  </motion.div>
                ) : (
                  <motion.div
                    key="otp"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AuthHeader
                      title="Verify your email"
                      description="Enter the code we sent to continue."
                    />

                    <OTPForm
                      email={auth.email || ""}
                      onVerify={handleVerifyOTP}
                      onResend={auth.resendOTP}
                      onChangeEmail={handleChangeEmail}
                      loading={auth.state === "verifying"}
                      error={auth.error?.message || null}
                      expiresIn={auth.otpExpiresIn}
                      verified={auth.state === "success"}
                    />

                    <AuthFooter />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </AuthCard>
        </div>
      </div>

      {/* Right Panel — Photography (Desktop only) */}
      <div className="hidden lg:block lg:flex-1 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${PHOTO_URL})` }}
        />
        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Testimonial overlay */}
        <div className="absolute inset-0 flex items-end p-12">
          <div className="max-w-md">
            <blockquote className="text-white/90 text-heading-md leading-relaxed">
              &ldquo;ToursBU made my first solo trip feel like I was travelling with family. The entire experience was seamless.&rdquo;
            </blockquote>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                AP
              </div>
              <div>
                <p className="text-white font-semibold text-body-sm">Aarav Patel</p>
                <p className="text-white/60 text-caption">IIT Bombay &middot; Manali 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
