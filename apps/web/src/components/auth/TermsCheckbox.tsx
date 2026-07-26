"use client";

import { cn } from "@/lib/utils";

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: boolean;
}

export function TermsCheckbox({ checked, onChange, error }: TermsCheckboxProps) {
  return (
    <div className="mt-6">
      <label htmlFor="terms" className="flex items-start gap-3 cursor-pointer group">
        <div className="relative mt-0.5">
          <input
            id="terms"
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer peer"
            aria-label="Accept terms and conditions"
          />
          <div
            className={cn(
              "h-5 w-5 rounded-[6px] border-2 transition-all duration-200",
              "flex items-center justify-center shrink-0",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--tbu-ring)] peer-focus-visible:ring-offset-2",
              checked
                ? "bg-tbu-blue border-tbu-blue"
                : error
                  ? "border-[var(--tbu-danger)]"
                  : "border-[var(--tbu-hairline-strong)] group-hover:border-[var(--tbu-ink)]"
            )}
          >
            {checked && (
              <svg
                className="h-3 w-3 text-white animate-in zoom-in duration-150"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="2.5 6 5 8.5 9.5 3.5" />
              </svg>
            )}
          </div>
        </div>
        <span className="text-caption leading-[1.5] text-[var(--tbu-muted)]">
          By continuing, you agree to the{" "}
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--tbu-ink)] underline underline-offset-2 hover:text-tbu-blue transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Terms &amp; Conditions
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--tbu-ink)] underline underline-offset-2 hover:text-tbu-blue transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Privacy Policy
          </a>
        </span>
      </label>

      {error && !checked && (
        <p
          className="mt-1.5 ml-8 text-[12px] font-medium text-red-600 animate-in fade-in slide-in-from-top-1 duration-200"
          role="alert"
        >
          Please accept the terms to continue
        </p>
      )}
    </div>
  );
}
