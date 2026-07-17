"use client";

import { Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
  /** Whether the overlay is visible */
  visible: boolean;
  /** Whether we are in success state */
  success?: boolean;
  /** Message to display */
  message?: string;
}

export function LoadingOverlay({
  visible,
  success,
  message,
}: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <div
      className={cn(
        "absolute inset-0 z-20 flex flex-col items-center justify-center gap-4",
        "bg-[var(--tbu-canvas)]/95 backdrop-blur-sm rounded-[24px]",
        "animate-in fade-in duration-200"
      )}
      role="status"
      aria-live="polite"
    >
      {success ? (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950 animate-in zoom-in duration-300">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-heading-sm text-[var(--tbu-ink)] mt-2">
            Welcome to ToursBU
          </p>
          <p className="text-body-sm text-[var(--tbu-muted)]">
            Preparing your journey...
          </p>
        </>
      ) : (
        <>
          <Loader2 className="h-8 w-8 animate-spin text-[var(--tbu-blue)]" />
          <p className="text-body-sm text-[var(--tbu-muted)]">
            {message || "Signing you in..."}
          </p>
        </>
      )}
    </div>
  );
}
