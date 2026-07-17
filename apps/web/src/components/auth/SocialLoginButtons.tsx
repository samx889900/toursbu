"use client";

import { Loader2 } from "lucide-react";
import type { AuthProvider } from "@/services/auth";
import { cn } from "@/lib/utils";

/* ─── Official Provider SVG Icons ─────────────────────────── */

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function MicrosoftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#F25022" d="M1 1h10v10H1z" />
      <path fill="#7FBA00" d="M13 1h10v10H13z" />
      <path fill="#00A4EF" d="M1 13h10v10H1z" />
      <path fill="#FFB900" d="M13 13h10v10H13z" />
    </svg>
  );
}

/* ─── Provider Config ─────────────────────────────────────── */

interface ProviderConfig {
  provider: AuthProvider;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  className: string;
}

const PROVIDERS: ProviderConfig[] = [
  {
    provider: "google",
    label: "Continue with Google",
    icon: GoogleIcon,
    // Google is visually emphasized — white bg, strong border
    className:
      "bg-white text-[#1f1f1f] border-2 border-[var(--tbu-hairline-strong)] hover:bg-[var(--tbu-parchment)] hover:border-[var(--tbu-ink)] dark:bg-white dark:text-[#1f1f1f] dark:hover:bg-gray-100",
  },
  {
    provider: "apple",
    label: "Continue with Apple",
    icon: AppleIcon,
    className:
      "bg-black text-white border border-black hover:bg-[#1a1a1a] dark:bg-white dark:text-black dark:border-white dark:hover:bg-gray-100",
  },
  {
    provider: "microsoft",
    label: "Microsoft Account",
    icon: MicrosoftIcon,
    className:
      "bg-transparent text-[var(--tbu-ink)] border border-[var(--tbu-hairline-strong)] hover:bg-[var(--tbu-surface)] hover:border-[var(--tbu-ink)]",
  },
];

/* ─── Component ───────────────────────────────────────────── */

interface SocialLoginButtonsProps {
  onProviderClick: (provider: AuthProvider) => void;
  loading: boolean;
  activeProvider: AuthProvider | null;
  disabled?: boolean;
}

export function SocialLoginButtons({
  onProviderClick,
  loading,
  activeProvider,
  disabled,
}: SocialLoginButtonsProps) {
  return (
    <div className="space-y-3">
      {PROVIDERS.map(({ provider, label, icon: Icon, className }) => {
        const isActive = loading && activeProvider === provider;
        const isDisabled = disabled || (loading && activeProvider !== null);

        return (
          <button
            key={provider}
            type="button"
            onClick={() => onProviderClick(provider)}
            disabled={isDisabled}
            className={cn(
              "relative flex w-full items-center justify-center gap-3",
              "h-14 rounded-full text-[15px] font-semibold",
              "transition-all duration-200 btn-press",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbu-ring)] focus-visible:ring-offset-2",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
              className
            )}
            aria-label={label}
          >
            {isActive ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Icon className="h-5 w-5 shrink-0" />
                <span>{label}</span>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}
