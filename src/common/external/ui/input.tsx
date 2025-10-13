import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../../config/lib/utils.ts"

const inputVariants = cva(
  "flex w-full rounded-md text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border border-gray-300 bg-background hover:border-gray-400 dark:hover:border-gray-500",
        filled: "border border-gray-200 bg-white hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500",
        ghost: "border-0 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800",
        outline: "border border-gray-300 bg-transparent hover:border-primary-400 dark:border-gray-600 dark:hover:border-primary-500",
        dark: "!border border-gray-300 text-gray-900 placeholder:text-gray-500 hover:border-gray-400 focus-visible:ring-primary-500 focus-visible:ring-offset-0 dark:!bg-table-header-input-background dark:text-gray-100 dark:border-gray-600 dark:placeholder:text-gray-400"
      },
      size: {
        sm: "h-8 px-2 py-1 text-xs",
        default: "h-10 px-3 py-2",
        lg: "h-12 px-4 py-3 text-base"
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
)

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>, VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, size, state, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size, state }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
