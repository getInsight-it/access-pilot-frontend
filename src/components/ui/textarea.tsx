import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../config/lib/utils";

const textareaVariants = cva(
  "flex min-h-[80px] w-full rounded-md text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical",
  {
    variants: {
      variant: {
        default: "border border-input bg-background hover:border-gray-400 dark:hover:border-gray-500",
        filled: "border border-gray-200 bg-white hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500",
        ghost: "border-0 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800",
        outline: "border border-gray-300 bg-transparent hover:border-primary-400 dark:border-gray-600 dark:hover:border-primary-500",
        dark: "!border border-gray-300 !bg-white text-gray-900 placeholder:text-gray-500 hover:border-gray-400 focus-visible:ring-primary-500 focus-visible:ring-offset-0"
      },
      size: {
        sm: "min-h-[60px] px-2 py-1 text-xs",
        default: "min-h-[80px] px-3 py-2",
        lg: "min-h-[120px] px-4 py-3 text-base"
      },
      state: {
        default: "",
        error: "border-error-500 focus-visible:ring-error-500 dark:border-error-400 dark:focus-visible:ring-error-400",
        success: "border-success-500 focus-visible:ring-success-500 dark:border-success-400 dark:focus-visible:ring-success-400",
        warning: "border-warning-500 focus-visible:ring-warning-500 dark:border-warning-400 dark:focus-visible:ring-warning-400"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      state: "default"
    }
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, size, state, ...props }, ref) => {
    return (
      <textarea
        className={cn(textareaVariants({ variant, size, state }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
