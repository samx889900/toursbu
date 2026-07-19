"use client";

import { useState } from "react";
import { Mail, ArrowRight, Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthFormProps {
  mode: "signin" | "signup";
  onSubmit: (email: string, password?: string) => void;
  loading: boolean;
  disabled?: boolean;
}

export function AuthForm({ mode, onSubmit, loading, disabled }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    if (!email) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email";
    if (mode === "signin" && !password) return "Password is required";
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    if (mode === "signin") {
      onSubmit(email, password);
    } else {
      onSubmit(email);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          />
        </div>
      </div>

      {mode === "signin" && (
        <div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[var(--tbu-faint)]" />
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Password"
              disabled={loading || disabled}
              autoComplete="current-password"
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
              aria-label="Password"
              aria-invalid={!!error}
            />
          </div>
        </div>
      )}

      {error && (
        <p className="ml-4 text-[12px] text-[var(--tbu-danger)] animate-in fade-in slide-in-from-top-1 duration-200" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || disabled || !email || (mode === "signin" && !password)}
        className={cn(
          "flex w-full items-center justify-center gap-2 mt-2",
          "h-14 rounded-full text-[15px] font-semibold",
          "bg-tbu-blue text-white shadow-tbu-blue",
          "transition-all duration-200 btn-press",
          "hover:bg-tbu-blue-hover",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tbu-ring focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        )}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            {mode === "signin" ? "Sign In" : "Continue"}
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
