"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface OTPFormProps {
  email: string;
  onVerify: (code: string) => void;
  onResend: () => void;
  onChangeEmail: () => void;
  loading: boolean;
  error: string | null;
  expiresIn: number;
  verified?: boolean;
}

export function OTPForm({
  email,
  onVerify,
  onResend,
  onChangeEmail,
  loading,
  error,
  expiresIn,
  verified,
}: OTPFormProps) {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(expiresIn);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    // The initial state is already set to expiresIn on mount.
    // We only need to start the interval.
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [expiresIn]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Auto-submit when all 6 digits are entered
  const checkAutoSubmit = useCallback(
    (newDigits: string[]) => {
      const code = newDigits.join("");
      if (code.length === 6 && newDigits.every((d) => d !== "")) {
        onVerify(code);
      }
    },
    [onVerify]
  );

  const handleChange = (index: number, value: string) => {
    // Only allow single digits
    const digit = value.replace(/\D/g, "").slice(-1);

    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);

    // Auto-advance to next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    checkAutoSubmit(newDigits);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      // Move to previous input on backspace
      inputRefs.current[index - 1]?.focus();
      const newDigits = [...digits];
      newDigits[index - 1] = "";
      setDigits(newDigits);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 0) return;

    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || "";
    }
    setDigits(newDigits);

    // Focus the next empty input or the last one
    const nextEmpty = newDigits.findIndex((d) => d === "");
    inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();

    checkAutoSubmit(newDigits);
  };

  const handleResend = () => {
    setDigits(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    onResend();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Back / Change Email */}
      <button
        type="button"
        onClick={onChangeEmail}
        className="inline-flex items-center gap-1.5 text-caption text-[var(--tbu-muted)] hover:text-[var(--tbu-ink)] transition-colors mb-4"
        aria-label="Change email address"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Change Email
      </button>

      {/* Instructions */}
      <div className="text-center mb-6">
        <h2 className="text-[20px] font-bold text-[var(--tbu-ink)] mb-2">Verify your email</h2>
        <p className="text-[15px] text-[var(--tbu-body)]">
          We sent a verification code to
        </p>
        <p className="text-[15px] font-semibold text-[var(--tbu-ink)] mt-0.5">
          {email}
        </p>
      </div>

      {/* OTP Inputs */}
      <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            disabled={loading || verified}
            className={cn(
              "w-12 h-14 text-center text-xl font-bold rounded-xl",
              "border transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbu-ring)] focus-visible:border-[var(--tbu-ring)]",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              verified
                ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400 scale-105"
                : error
                  ? "border-[var(--tbu-danger)] animate-[shake_0.3s_ease-in-out]"
                  : "border-[var(--tbu-hairline-strong)] bg-transparent"
            )}
            aria-label={`Digit ${index + 1}`}
          />
        ))}
      </div>

      {/* Success indicator */}
      {verified && (
        <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 animate-in fade-in zoom-in duration-300">
          <CheckCircle2 className="h-5 w-5" />
          <span className="text-body-sm font-semibold">Verified!</span>
        </div>
      )}

      {/* Error */}
      {error && !verified && (
        <p
          className="text-center text-[12px] text-[var(--tbu-danger)] animate-in fade-in slide-in-from-top-1 duration-200"
          role="alert"
        >
          {error}
        </p>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="flex items-center justify-center gap-2 text-[var(--tbu-muted)]">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-caption">Verifying...</span>
        </div>
      )}

      {/* Timer + Resend */}
      {!verified && (
        <div className="text-center">
          {countdown > 0 ? (
            <p className="text-[14px] text-[var(--tbu-faint)]">
              Didn&apos;t receive it? Resend in{" "}
              <span className="font-semibold text-[var(--tbu-muted)]">
                {countdown}s
              </span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className="text-[14px] font-semibold text-[var(--tbu-blue)] hover:underline disabled:opacity-50 transition-colors"
            >
              Resend verification code
            </button>
          )}
        </div>
      )}
    </div>
  );
}
