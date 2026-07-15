import { cn } from "@/lib/utils";
import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
    direction: "up" | "down";
  };
  iconColor?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  iconColor = "text-[var(--tbu-blue)]",
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "group relative transition-all duration-300 hover:shadow-tbu-2",
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-caption">
              {title}
            </p>
            <p className="text-display-md tabular-nums">
              {value}
            </p>
          </div>
          {Icon && (
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--tbu-surface)] transition-colors group-hover:bg-[var(--tbu-blue-soft)]"
              )}
            >
              <Icon className={cn("h-5 w-5", iconColor)} />
            </div>
          )}
        </div>

        {trend && (
          <div className="mt-4 flex items-center gap-1.5">
            {trend.direction === "up" ? (
              <TrendingUp className="h-3.5 w-3.5 text-[var(--tbu-green)]" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-[var(--tbu-danger)]" />
            )}
            <span
              className={cn(
                "text-xs font-medium",
                trend.direction === "up"
                  ? "text-[var(--tbu-green-hover)]"
                  : "text-[var(--tbu-danger)]"
              )}
            >
              {trend.value}%
            </span>
            <span className="text-xs text-[var(--tbu-muted)]">
              {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
