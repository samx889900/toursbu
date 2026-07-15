import { cn } from "@/lib/utils";
import { type LucideIcon, Package, Search, FileX, Inbox } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  variant?: "default" | "compact";
  className?: string;
}

const defaultIcons: Record<string, LucideIcon> = {
  search: Search,
  file: FileX,
  package: Package,
  inbox: Inbox,
};

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  variant = "default",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        variant === "default" ? "py-16 px-6" : "py-8 px-4",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl bg-[hsl(var(--muted))]",
          variant === "default" ? "h-16 w-16 mb-6" : "h-12 w-12 mb-4"
        )}
      >
        <Icon
          className={cn(
            "text-[hsl(var(--muted-foreground))]",
            variant === "default" ? "h-8 w-8" : "h-6 w-6"
          )}
        />
      </div>
      <h3
        className={cn(
          "font-semibold text-[hsl(var(--foreground))]",
          variant === "default" ? "text-lg mb-2" : "text-base mb-1"
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          "text-[hsl(var(--muted-foreground))] max-w-sm",
          variant === "default" ? "text-sm" : "text-xs"
        )}
      >
        {description}
      </p>
      {action && (
        <div className="mt-6">
          {action.href ? (
            <Link
              href={action.href}
              className="inline-flex items-center justify-center rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-5 py-2.5 text-sm font-medium transition-colors hover:opacity-90"
            >
              {action.label}
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className="inline-flex items-center justify-center rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-5 py-2.5 text-sm font-medium transition-colors hover:opacity-90"
            >
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export { defaultIcons };
