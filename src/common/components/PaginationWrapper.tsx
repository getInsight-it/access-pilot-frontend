import { cn } from "../../config/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "../external/ui/pagination.tsx";

interface PaginationWrapperProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function PaginationWrapper({
  currentPage,
  totalPages,
  onPageChange
}: PaginationWrapperProps) {
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 3;

    if(totalPages <= 7) {
      for(let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(i);
              }}
              isActive={currentPage === i}
              className={cn(
                "border border-gray-300 dark:border-gray-700",
                currentPage === i
                  ? "bg-gray-50 dark:bg-gray-800"
                  : "bg-white dark:bg-gray-950"
              )}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(1);
            }}
            isActive={currentPage === 1}
            className={cn(
              "border border-gray-300 dark:border-gray-700",
              currentPage === 1
                ? "bg-gray-50 dark:bg-gray-800"
                : "bg-white dark:bg-gray-950"
            )}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if(currentPage > maxVisiblePages + 1) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for(let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(i);
              }}
              isActive={currentPage === i}
              className={cn(
                "border border-gray-300 dark:border-gray-700",
                currentPage === i
                  ? "bg-gray-50 dark:bg-gray-800"
                  : "bg-white dark:bg-gray-950"
              )}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if(currentPage < totalPages - maxVisiblePages) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      if(totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(totalPages);
              }}
              isActive={currentPage === totalPages}
              className={cn(
                "border border-gray-300 dark:border-gray-700",
                currentPage === totalPages
                  ? "bg-gray-50 dark:bg-gray-800"
                  : "bg-white dark:bg-gray-950"
              )}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if(currentPage > 1) {
                onPageChange(currentPage - 1);
              }
            }}
            className={cn(
              "border border-gray-300 dark:border-gray-700",
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer",
              "bg-white dark:bg-gray-950"
            )}
          />
        </PaginationItem>

        {renderPaginationItems()}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if(currentPage < totalPages) {
                onPageChange(currentPage + 1);
              }
            }}
            className={cn(
              "border border-gray-300 dark:border-gray-700",
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer",
              "bg-white dark:bg-gray-950"
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
