import Link from "next/link";
import { MapPin } from "lucide-react";

interface AuthHeaderProps {
  title: string;
  description: string;
}

export function AuthHeader({ title, description }: AuthHeaderProps) {
  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <Link
        href="/"
        className="inline-flex items-center gap-2.5 mb-6 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbu-ring)] rounded-lg"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--tbu-blue)] shadow-tbu-1 transition-transform group-hover:scale-105">
          <MapPin className="h-5 w-5 text-white" />
        </div>
        <span className="text-heading-md">
          Tours<span className="text-[var(--tbu-blue)]">BU</span>
        </span>
      </Link>

      {/* Heading */}
      <h1 className="text-display-md !text-[var(--tbu-ink)]">{title}</h1>
      <p className="mt-2 text-body-sm text-[var(--tbu-muted)] max-w-xs mx-auto">
        {description}
      </p>
    </div>
  );
}
