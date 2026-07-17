import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-[440px] mx-auto",
        "bg-[var(--tbu-canvas)] rounded-[24px] shadow-tbu-3",
        "p-8 sm:p-10",
        "animate-in fade-in slide-in-from-bottom-4 duration-500",
        className
      )}
    >
      {children}
    </div>
  );
}
