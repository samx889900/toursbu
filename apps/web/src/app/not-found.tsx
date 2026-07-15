import Link from "next/link";
import { MapPin, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      {/* Decorative gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-gradient-to-b from-[hsl(var(--primary)/0.08)] to-transparent blur-3xl" />
      </div>

      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[hsl(var(--muted))] mb-8">
        <MapPin className="h-10 w-10 text-[hsl(var(--muted-foreground))]" />
      </div>

      <h1 className="text-7xl font-bold tracking-tighter text-[hsl(var(--foreground))] mb-4">
        404
      </h1>
      <h2 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
        Page not found
      </h2>
      <p className="text-[hsl(var(--muted-foreground))] max-w-md mb-8">
        Looks like this page took a different route. The page you&apos;re looking
        for doesn&apos;t exist or has been moved.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-6 py-3 text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98]"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
        <Link
          href="/trips"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] px-6 py-3 text-sm font-medium transition-all hover:bg-[hsl(var(--muted))] active:scale-[0.98]"
        >
          <ArrowLeft className="h-4 w-4" />
          Explore Trips
        </Link>
      </div>
    </div>
  );
}
