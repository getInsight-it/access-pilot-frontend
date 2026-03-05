import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../../config/lib/utils.ts"
import "./button.scss"

const buttonVariants = cva(
  "ui-button",
  {
    variants: {
      variant: {
        default: "ui-button--primary",
        white: "ui-button--white",
        destructive: "ui-button--primary",
        success: "ui-button--primary",
        warning: "ui-button--primary",
        outline: "ui-button--primary",
        secondary: "ui-button--primary",
        ghost: "ui-button--primary",
        link: "ui-button--primary"
      },
      size: {
        sm: "ui-button--sm",
        default: "ui-button--default",
        lg: "ui-button--lg",
        xl: "ui-button--xl",
        icon: "ui-button--icon"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
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
