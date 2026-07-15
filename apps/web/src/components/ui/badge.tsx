import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-caption transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--tbu-ring)] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--tbu-blue-soft)] text-[var(--tbu-blue-press)]",
        secondary:
          "bg-[var(--tbu-surface)] text-[var(--tbu-body)] hover:bg-[var(--tbu-hairline)]",
        success:
          "bg-[var(--tbu-green-soft)] text-[var(--tbu-green-hover)]",
        danger:
          "bg-[var(--tbu-danger-soft)] text-[var(--tbu-danger)]",
        warning:
          "bg-[var(--tbu-warning-soft)] text-[var(--tbu-warning)]",
        outline:
          "border border-[var(--tbu-hairline-strong)] text-[var(--tbu-body)] bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
