import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-button transition-colors btn-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbu-ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-[var(--tbu-canvas)]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--tbu-blue)] text-white hover:bg-[var(--tbu-blue-hover)] active:bg-[var(--tbu-blue-press)] shadow-tbu-1",
        secondary:
          "bg-transparent text-[var(--tbu-blue)] border border-[var(--tbu-blue)] hover:bg-[var(--tbu-blue-soft)]",
        ghost:
          "bg-transparent text-[var(--tbu-ink)] hover:underline hover:text-[var(--tbu-blue)]",
        danger:
          "bg-[var(--tbu-danger)] text-white hover:bg-red-600 shadow-tbu-1",
        outline:
          "border border-[var(--tbu-hairline-strong)] bg-transparent hover:bg-[var(--tbu-surface)] text-[var(--tbu-body)]",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 px-4 text-sm",
        lg: "h-14 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
