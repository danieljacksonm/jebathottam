/**
 * Button Component
 * shadcn/ui styled button with variants
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-sm hover:shadow-md",
        destructive: "bg-[var(--error)] text-white hover:bg-red-700 shadow-sm",
        outline: "border border-[var(--border)] bg-transparent hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)]",
        secondary: "bg-[var(--background-secondary)] text-[var(--foreground)] hover:bg-[var(--background-tertiary)]",
        ghost: "hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)]",
        link: "text-[var(--primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
