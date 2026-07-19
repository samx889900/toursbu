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
import { AuthForm } from "@/components/auth/AuthForm";
import { OTPForm } from "@/components/auth/OTPForm";
import { CreatePasswordForm } from "@/components/auth/CreatePasswordForm";
import { TermsCheckbox } from "@/components/auth/TermsCheckbox";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { LoadingOverlay } from "@/components/auth/LoadingOverlay";
import { ProfileCompletionService } from "@/services/auth/ProfileCompletionService";
import { cn } from "@/lib/utils";

/** Auth page state machine */
type AuthView = "providers" | "otp" | "create_password";
type AuthMode = "signin" | "signup";

const PHOTO_URL =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop";

export default function AuthPage() {
  const router = useRouter();
  const auth = useAuth();

  const [view, setView] = useState<AuthView>("providers");
  const [mode, setMode] = useState<AuthMode>("signin");
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

  const handleAuthSubmit = useCallback(
    (email: string, password?: string) => {
      if (!requireTerms()) return;
      
      if (mode === "signin" && password) {
        auth.signInWithPassword(email, password);
      } else {
        auth.sendOTP(email);
      }
    },
    [requireTerms, auth, mode]
  );

  const handleVerifyOTP = useCallback(
    (code: string) => {
      auth.verifyOTP(code);
    },
    [auth]
  );

  const handleCreatePassword = useCallback(
    (password: string) => {
      auth.setPassword(password);
    },
    [auth]
  );

  const handleChangeEmail = useCallback(() => {
    auth.reset();
    setView("providers");
    setActiveProvider(null);
  }, [auth]);

  // Transition views based on auth state
  if (auth.state === "otp_sent" && view !== "otp") {
    setView("otp");
  }
  
  if (auth.state === "create_password" && view !== "create_password") {
    setView("create_password");
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
                    <div className="flex gap-4 mb-6 border-b border-[var(--tbu-hairline)]">
                      <button
                        onClick={() => { setMode("signin"); auth.clearError(); }}
                        className={cn(
                          "pb-3 text-sm font-semibold transition-colors relative",
                          mode === "signin" ? "text-tbu-blue" : "text-[var(--tbu-muted)] hover:text-[var(--tbu-ink)]"
                        )}
                      >
                        Sign In
                        {mode === "signin" && (
                          <motion.div layoutId="auth-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-tbu-blue" />
                        )}
                      </button>
                      <button
                        onClick={() => { setMode("signup"); auth.clearError(); }}
                        className={cn(
                          "pb-3 text-sm font-semibold transition-colors relative",
                          mode === "signup" ? "text-tbu-blue" : "text-[var(--tbu-muted)] hover:text-[var(--tbu-ink)]"
                        )}
                      >
                        Sign Up
                        {mode === "signup" && (
                          <motion.div layoutId="auth-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-tbu-blue" />
                        )}
                      </button>
                    </div>

                    <AuthHeader
                      title={mode === "signin" ? "Welcome back" : "Create an account"}
                      description={mode === "signin" ? "Sign in to access your bookings." : "Sign up to discover and book curated student trips."}
                    />

                    <SocialLoginButtons
                      onProviderClick={handleProviderClick}
                      loading={isLoading}
                      activeProvider={activeProvider}
                      disabled={auth.state === "success"}
                    />

                    <AuthDivider />

                    <AuthForm
                      mode={mode}
                      onSubmit={handleAuthSubmit}
                      loading={isLoading && activeProvider === null}
                      disabled={auth.state === "success"}
                    />

                    {mode === "signin" && (
                      <div className="mt-4 text-center">
                        <button
                          type="button"
                          onClick={() => setMode("signup")}
                          className="text-xs text-[var(--tbu-muted)] hover:text-[var(--tbu-ink)] underline underline-offset-2"
                        >
                          Forgot password? Sign in with OTP instead
                        </button>
                      </div>
                    )}

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
                ) : view === "otp" ? (
                  <motion.div
                    key="otp"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
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
                      verified={auth.state === "success" || auth.state === "create_password"}
                    />

                    <AuthFooter />
                  </motion.div>
                ) : (
                  <motion.div
                    key="create_password"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AuthHeader
                      title="Create a Password"
                      description="Set a password for your account so you can sign in easily next time."
                    />

                    <CreatePasswordForm
                      onSubmit={handleCreatePassword}
                      loading={auth.state === "loading"}
                      error={auth.error?.message || null}
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
