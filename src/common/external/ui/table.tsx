import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../../config/lib/utils.ts"

const Table = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto rounded-table border border-table-border bg-table-background">
    <div
      ref={ref}
      className={cn("w-full text-sm flex flex-col text-text-default", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

export interface TableHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  hasAuxHeader?: boolean
}

const TableHeader = React.forwardRef<
  HTMLDivElement,
  TableHeaderProps
>(({ className, hasAuxHeader, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col bg-table-header-background text-table-header-text",
      !hasAuxHeader && "[&>div:first-child>div:first-child]:rounded-tl-xl",
      !hasAuxHeader && "[&>div:first-child>div:last-child]:rounded-tr-xl",
      "[&>div]:border-b [&>div]:border-table-separator",
      "[&>div]:hover:bg-table-header-background",
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
      "flex flex-col text-text-default",
      "[&>div:last-child]:border-b-0",
      "[&>div:last-child>div:first-child]:rounded-bl-xl",
      "[&>div:last-child>div:last-child]:rounded-br-xl",
      "[&>div:nth-child(odd)]:bg-zebra-background-1",
      "[&>div:nth-child(even)]:bg-zebra-background-2",
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
      "border-t border-table-separator font-medium bg-table-footer-background",
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
      "flex w-full text-text-default border-b border-table-separator text-table-row-text transition-colors hover:bg-table-row-hover",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const tableHeadVariants = cva(
  "flex items-center text-left font-semibold text-table-header-text [&:has([role=checkbox])]:pr-0",
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

export interface TableHeadProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof tableHeadVariants> {
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
  "flex items-center text-text-default dark:text-gray-100 [&:has([role=checkbox])]:pr-0",
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
        width ? "cursor-pointer select-none" : "flex-1 cursor-pointer select-none",
        className
      )}
      style={{ width: width || undefined, flexShrink: width ? 0 : 1, ...style }}
      onClick={onSort}
      {...props}
    >
      <div className="flex items-center space-x-2">
        <span>{children}</span>
        {sortDirection && (
          <span className="text-xs">
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
  tableHeadVariants,
  tableCellVariants
}
