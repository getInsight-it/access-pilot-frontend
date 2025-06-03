import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../config/lib/utils"

const Table = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
  auxiliaryHeader?: React.ReactNode
}
>(({ className, auxiliaryHeader, ...props }, ref) => (
  <div className="relative w-full overflow-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
    {auxiliaryHeader && (
      <div className="w-full bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
        {auxiliaryHeader}
      </div>
    )}
    <div
      ref={ref}
      className={cn("w-full text-sm flex flex-col", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const tableHeaderVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "bg-gray-50 dark:bg-gray-800",
        primary: "bg-primary-50 dark:bg-primary-900/20",
        secondary: "bg-gray-50 dark:bg-gray-700",
        none: "bg-transparent"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

export interface TableHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tableHeaderVariants> {
  hasAuxHeader?: boolean
}

const TableHeader = React.forwardRef<
  HTMLDivElement,
  TableHeaderProps
>(({ className, variant, hasAuxHeader, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      tableHeaderVariants({ variant }),
      "flex flex-col",
      !hasAuxHeader && "[&>div:first-child>div:first-child]:rounded-tl-xl",
      !hasAuxHeader && "[&>div:first-child>div:last-child]:rounded-tr-xl",
      "[&>div]:border-b [&>div]:border-gray-200 dark:[&>div]:border-gray-700",
      className
    )}
    {...props}
  />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col",
      "[&>div:last-child]:border-b-0",
      "[&>div:last-child>div:first-child]:rounded-bl-xl",
      "[&>div:last-child>div:last-child]:rounded-br-xl",
      className
    )}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col",
      "border-t border-gray-200 bg-gray-50 font-medium dark:border-gray-700 dark:bg-gray-800",
      "[&>div:last-child>div:first-child]:rounded-bl-xl",
      "[&>div:last-child>div:last-child]:rounded-br-xl",
      "[&>div]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex w-full",
      "border-b border-gray-200 dark:border-gray-700",
      "transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50",
      "data-[state=selected]:bg-primary-50 dark:data-[state=selected]:bg-primary-900/20",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const tableHeadVariants = cva(
  "flex items-center text-left font-semibold text-gray-900 dark:text-gray-100 [&:has([role=checkbox])]:pr-0",
  {
    variants: {
      size: {
        sm: "h-10 px-3 text-xs",
        default: "h-12 px-4 text-sm",
        lg: "h-14 px-6 text-base"
      }
    },
    defaultVariants: {
      size: "default"
    }
  }
)

export interface TableHeadProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tableHeadVariants> {
  width?: string
}

const TableHead = React.forwardRef<
  HTMLDivElement,
  TableHeadProps
>(({ className, size, width, style, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(tableHeadVariants({ size }), width ? "" : "flex-1", className)}
      style={{ width: width || undefined, flexShrink: width ? 0 : 1, ...style }}
      {...props}
    />
  )
})
TableHead.displayName = "TableHead"

const tableCellVariants = cva(
  "flex items-center text-gray-900 dark:text-gray-100 [&:has([role=checkbox])]:pr-0",
  {
    variants: {
      size: {
        sm: "p-3 text-xs",
        default: "p-4 text-sm",
        lg: "p-6 text-base"
      }
    },
    defaultVariants: {
      size: "default"
    }
  }
)

export interface TableCellProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tableCellVariants> {
  width?: string
}

const TableCell = React.forwardRef<
  HTMLDivElement,
  TableCellProps
>(({ className, size, width, style, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(tableCellVariants({ size }), width ? "" : "flex-1", className)}
      style={{ width: width || undefined, flexShrink: width ? 0 : 1, ...style }}
      {...props}
    />
  )
})
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-4 text-sm text-gray-600 dark:text-gray-400", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

const TableSortableHead = React.forwardRef<
  HTMLDivElement,
  TableHeadProps & {
  sortDirection?: "asc" | "desc" | null
  onSort?: () => void
}
>(({ className, size, sortDirection, onSort, children, width, style, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        tableHeadVariants({ size }),
        width ? "cursor-pointer select-none hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors" : "flex-1 cursor-pointer select-none hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors",
        className
      )}
      style={{ width: width || undefined, flexShrink: width ? 0 : 1, ...style }}
      onClick={onSort}
      {...props}
    >
      <div className="flex items-center space-x-2">
        <span>{children}</span>
        {sortDirection && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {sortDirection === "asc" ? "↑" : "↓"}
          </span>
        )}
      </div>
    </div>
  )
})
TableSortableHead.displayName = "TableSortableHead"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableSortableHead,
  tableHeaderVariants,
  tableHeadVariants,
  tableCellVariants
}
