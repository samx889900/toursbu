"use client";

import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log the error to the console to satisfy unused vars and help debugging
  if (error) {
    console.error("Global boundary caught error:", error);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-gradient-to-b from-red-500/5 to-transparent blur-3xl" />
      </div>

      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 dark:bg-red-950/30 mb-8">
        <AlertTriangle className="h-10 w-10 text-red-500" />
      </div>

      <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-2">
        Something went wrong
      </h1>
      <p className="text-[hsl(var(--muted-foreground))] max-w-md mb-8">
        We encountered an unexpected error. Our team has been notified and is
        working on a fix.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-6 py-3 text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98]"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] px-6 py-3 text-sm font-medium transition-all hover:bg-[hsl(var(--muted))]"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
