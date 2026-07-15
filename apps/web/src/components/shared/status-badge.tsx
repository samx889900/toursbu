import { cn } from "@/lib/utils";

type StatusType = string;

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  // Booking statuses
  PENDING_PAYMENT: { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-700 dark:text-amber-400", dot: "bg-amber-500" },
  PAYMENT_RECEIVED: { bg: "bg-blue-50 dark:bg-blue-950/30", text: "text-blue-700 dark:text-blue-400", dot: "bg-blue-500" },
  CONFIRMED: { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
  WAITLISTED: { bg: "bg-purple-50 dark:bg-purple-950/30", text: "text-purple-700 dark:text-purple-400", dot: "bg-purple-500" },
  CHECKED_IN: { bg: "bg-teal-50 dark:bg-teal-950/30", text: "text-teal-700 dark:text-teal-400", dot: "bg-teal-500" },
  COMPLETED: { bg: "bg-gray-50 dark:bg-gray-950/30", text: "text-gray-700 dark:text-gray-400", dot: "bg-gray-500" },
  CANCELLED: { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400", dot: "bg-red-500" },
  REFUNDED: { bg: "bg-orange-50 dark:bg-orange-950/30", text: "text-orange-700 dark:text-orange-400", dot: "bg-orange-500" },

  // Payment statuses
  PENDING: { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-700 dark:text-amber-400", dot: "bg-amber-500" },
  PAID: { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
  FAILED: { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400", dot: "bg-red-500" },

  // Trip statuses
  DRAFT: { bg: "bg-gray-50 dark:bg-gray-950/30", text: "text-gray-700 dark:text-gray-400", dot: "bg-gray-500" },
  PUBLISHED: { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
};

const statusLabels: Record<string, string> = {
  PENDING_PAYMENT: "Pending Payment",
  PAYMENT_RECEIVED: "Payment Received",
  CONFIRMED: "Confirmed",
  WAITLISTED: "Waitlisted",
  CHECKED_IN: "Checked In",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
  PENDING: "Pending",
  PAID: "Paid",
  FAILED: "Failed",
  DRAFT: "Draft",
  PUBLISHED: "Published",
};

interface StatusBadgeProps {
  status: StatusType;
  showDot?: boolean;
  className?: string;
}

export function StatusBadge({
  status,
  showDot = true,
  className,
}: StatusBadgeProps) {
  const style = statusStyles[status] ?? statusStyles.PENDING!;
  const label = statusLabels[status] ?? status;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        style.bg,
        style.text,
        className
      )}
    >
      {showDot && (
        <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
      )}
      {label}
    </span>
  );
}
