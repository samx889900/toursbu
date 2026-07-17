"use client";

import { useState } from "react";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmailFormProps {
  onSubmit: (email: string) => void;
  loading: boolean;
  disabled?: boolean;
}

export function EmailForm({ onSubmit, loading, disabled }: EmailFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const validate = (value: string) => {
    if (!value) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email";
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate(email);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    onSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[var(--tbu-faint)]" />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            placeholder="your@email.com"
            disabled={loading || disabled}
            autoComplete="email"
            autoFocus
            className={cn(
              "flex h-14 w-full rounded-full",
              "border bg-transparent pl-12 pr-4 text-[15px]",
              "transition-all duration-200",
              "placeholder:text-[var(--tbu-faint)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbu-ring)] focus-visible:border-[var(--tbu-ring)]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error
                ? "border-[var(--tbu-danger)] focus-visible:ring-[var(--tbu-danger)]"
                : "border-[var(--tbu-hairline-strong)]"
            )}
            aria-label="Email address"
            aria-invalid={!!error}
            aria-describedby={error ? "email-error" : undefined}
          />
        </div>
        {error && (
          <p
            id="email-error"
            className="mt-1.5 ml-4 text-[12px] text-[var(--tbu-danger)] animate-in fade-in slide-in-from-top-1 duration-200"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || disabled || !email}
        className={cn(
          "flex w-full items-center justify-center gap-2",
          "h-14 rounded-full text-[15px] font-semibold",
          "bg-[var(--tbu-blue)] text-white shadow-tbu-blue",
          "transition-all duration-200 btn-press",
          "hover:bg-[var(--tbu-blue-hover)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbu-ring)] focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        )}
        aria-label="Continue with email"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            Continue
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
