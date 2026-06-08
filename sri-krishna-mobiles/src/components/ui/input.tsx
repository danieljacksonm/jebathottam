/**
 * Input Component
 * Form input with validation states
 */

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, helperText, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-[var(--foreground)]">
            {label}
            {props.required && <span className="text-[var(--error)] ml-1">*</span>}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-lg border bg-[var(--background)] px-3 py-2 text-sm",
            "text-[var(--foreground)] placeholder:text-[var(--foreground-muted)]",
            "transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-1",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-[var(--error)] focus-visible:ring-[var(--error)]"
              : "border-[var(--border)] hover:border-[var(--border-hover)]",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-xs text-[var(--error)]">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-xs text-[var(--foreground-muted)]">{helperText}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
