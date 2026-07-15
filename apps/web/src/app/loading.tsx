import { PageSkeleton } from "@/components/shared/loading-skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Navbar skeleton */}
      <div className="h-16 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]" />
      <PageSkeleton />
    </div>
  );
}
