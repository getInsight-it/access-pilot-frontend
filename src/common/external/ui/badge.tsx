import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../config/lib/utils.ts";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary-600 text-white shadow-sm hover:bg-primary-700",
        secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700",
        success: "bg-success-100 text-success-800 border border-success-200 dark:bg-success-900/20 dark:text-success-400 dark:border-success-800",
        warning: "bg-warning-100 text-warning-800 border border-warning-200 dark:bg-warning-900/20 dark:text-warning-400 dark:border-warning-800",
        destructive: "bg-error-100 text-error-800 border border-error-200 dark:bg-error-900/20 dark:text-error-400 dark:border-error-800",
        info: "bg-primary-100 text-primary-800 border border-primary-200 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-800",
        outline: "bg-transparent border border-primary-600 text-primary-700 dark:text-primary-100",
        dot: "bg-gray-100 text-gray-800 pl-2 pr-2.5 dark:bg-gray-800 dark:text-gray-200"
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

const BadgeDot = ({ color = "gray", className }: { color?: string, className?: string }) => (
  <span
    className={cn(
      "mr-1.5 h-1.5 w-1.5 rounded-full",
      {
        "bg-gray-400": color === "gray",
        "bg-primary-500": color === "primary",
        "bg-success-500": color === "success",
        "bg-warning-500": color === "warning",
        "bg-error-500": color === "error"
      },
      className
    )}
  />
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dotColor?: "gray" | "primary" | "success" | "warning" | "error";
}

function Badge({ className, variant, size, dotColor, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {variant === "dot" && <BadgeDot color={dotColor} />}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
