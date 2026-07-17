import Link from "next/link";

export function AuthFooter() {
  return (
    <div className="mt-8 text-center">
      <p className="text-caption-sm text-[var(--tbu-faint)]">
        Need help?{" "}
        <Link
          href="/contact"
          className="font-medium text-[var(--tbu-muted)] hover:text-[var(--tbu-ink)] underline underline-offset-2 transition-colors"
        >
          Contact Support
        </Link>
      </p>
    </div>
  );
}
