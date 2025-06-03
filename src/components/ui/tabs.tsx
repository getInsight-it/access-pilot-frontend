import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../config/lib/utils.ts"

const tabsListVariants = cva(
  "inline-flex items-center justify-center rounded-lg p-[3px] w-fit",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
        outline: "border border-gray-300 bg-transparent dark:border-gray-600",
        pills: "bg-transparent gap-1 p-0"
      },
      size: {
        sm: "h-8 p-[2px]",
        default: "h-9 p-[3px]",
        lg: "h-10 p-1"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "text-gray-700 hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:text-gray-300 dark:hover:text-gray-100 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100",
        outline: "text-gray-700 hover:bg-gray-50 data-[state=active]:bg-gray-50 data-[state=active]:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-primary-400",
        pills: "text-gray-700 hover:bg-gray-100 data-[state=active]:bg-primary-600 data-[state=active]:text-white data-[state=active]:shadow-sm dark:text-gray-300 dark:hover:bg-gray-800 dark:data-[state=active]:bg-primary-600"
      },
      size: {
        sm: "px-2 py-0.5 text-xs h-6",
        default: "px-3 py-1 text-sm h-7",
        lg: "px-4 py-1.5 text-sm h-8"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

export interface TabsProps extends React.ComponentProps<typeof TabsPrimitive.Root> {}

function Tabs({ className, ...props }: TabsProps) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

export interface TabsListProps
  extends React.ComponentProps<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

function TabsList({ className, variant, size, ...props }: TabsListProps) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(tabsListVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export interface TabsTriggerProps
  extends React.ComponentProps<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}

function TabsTrigger({ className, variant, size, ...props }: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export interface TabsContentProps extends React.ComponentProps<typeof TabsPrimitive.Content> {}

function TabsContent({ className, ...props }: TabsContentProps) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants, tabsTriggerVariants }
