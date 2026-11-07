import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "accent" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default:
    "bg-ink text-surface hover:bg-ink-soft border border-ink",
  secondary:
    "bg-surface text-ink border border-line hover:border-line-strong",
  outline:
    "border border-line bg-transparent text-ink hover:border-line-strong hover:bg-surface",
  ghost:
    "bg-transparent text-ink-soft hover:bg-surface hover:text-ink",
  accent:
    "bg-accent text-surface border border-accent hover:bg-accent-strong hover:border-accent-strong",
  danger:
    "border border-accent bg-transparent text-accent hover:bg-accent-soft",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 px-3 text-xs rounded-sm gap-1.5",
  md: "h-10 px-4 text-sm rounded-sm gap-2",
  lg: "h-12 px-6 text-sm rounded-sm gap-2.5",
  icon: "h-11 w-11 p-0 rounded-sm justify-center",
};

export function buttonStyles({
  variant = "default",
  size = "md",
  className,
}: Pick<ButtonProps, "variant" | "size"> & { className?: string } = {}) {
  return cn(
    "inline-flex select-none items-center justify-center font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50",
    variantStyles[variant],
    sizeStyles[size],
    className
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={buttonStyles({ variant, size, className })}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {isLoading && (
          <svg
            className="h-4 w-4 shrink-0 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
