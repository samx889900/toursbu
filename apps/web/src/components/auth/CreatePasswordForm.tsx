"use client";

import { useState } from "react";
import { Lock, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreatePasswordFormProps {
  onSubmit: (password: string) => void;
  loading: boolean;
  error?: string | null;
}

export function CreatePasswordForm({ onSubmit, loading, error: externalError }: CreatePasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    if (password.length < 8) return "Password must be at least 8 characters";
    if (password !== confirmPassword) return "Passwords do not match";
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
    onSubmit(password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="Create a password"
            disabled={loading}
            autoComplete="new-password"
            autoFocus
            className={cn(
              "flex h-14 w-full rounded-full",
              "border bg-transparent pl-12 pr-4 text-[15px]",
              "transition-all duration-200",
              "placeholder:text-[var(--tbu-faint)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbu-ring)] focus-visible:border-[var(--tbu-ring)]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error || externalError
                ? "border-[var(--tbu-danger)] focus-visible:ring-[var(--tbu-danger)]"
                : "border-[var(--tbu-hairline-strong)]"
            )}
          />
        </div>
      </div>

      <div>
        <div className="relative">
          <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[var(--tbu-faint)]" />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Confirm password"
            disabled={loading}
            autoComplete="new-password"
            className={cn(
              "flex h-14 w-full rounded-full",
              "border bg-transparent pl-12 pr-4 text-[15px]",
              "transition-all duration-200",
              "placeholder:text-[var(--tbu-faint)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbu-ring)] focus-visible:border-[var(--tbu-ring)]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error || externalError
                ? "border-[var(--tbu-danger)] focus-visible:ring-[var(--tbu-danger)]"
                : "border-[var(--tbu-hairline-strong)]"
            )}
          />
        </div>
      </div>

      {(error || externalError) && (
        <p className="ml-4 text-[12px] text-[var(--tbu-danger)] animate-in fade-in slide-in-from-top-1 duration-200" role="alert">
          {error || externalError}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !password || !confirmPassword}
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
            Save Password
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
