import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "../../config/lib/utils";
import { useTheme } from "../../theme/theme-provider.tsx";
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
  pageSize?: number;
  totalItems?: number;
}

export function PageDropdown({
  value,
  totalPages,
  onChange,
}: {
  value: number;
  totalPages: number;
  onChange: (v: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="flex items-center font-bold px-2 py-1 rounded focus:outline-none min-w-[48px] justify-between bg-transparent border-0 shadow-none"
        onClick={() => setOpen((v) => !v)}
      >
        {value}
        <ChevronDown
          className={`ml-2 transition-transform duration-200 text-primary-700 ${open ? "rotate-0" : "rotate-180"}`}
          size={18}
        />
      </button>
      {open && (
        <div className="absolute left-0 bottom-full mb-2 w-full bg-white border rounded shadow-lg z-10">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <div
              key={page}
              className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                page === value ? "bg-blue-600 text-white" : ""
              }`}
              onClick={() => {
                onChange(page);
                setOpen(false);
              }}
            >
              {page}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function PaginationWrapper({
  currentPage,
  totalPages,
  onPageChange,
  className,
  pageSize = 10,
  totalItems = 0,
}: PaginationWrapperProps) {
  const { theme } = useTheme();

  if (theme === "govbr") {
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    return (
      <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full", className)}>
        {/* Center: Item range */}
        <div className="text-sm text-gray-700">
          {startItem}–{endItem} de {totalItems} itens
        </div>

        {/* Right: Page selector and arrows */}
        <div className="flex items-center gap-2">
          <span>Página</span>
          <PageDropdown value={currentPage} totalPages={totalPages} onChange={onPageChange} />
          <div className="h-10 w-px bg-gray-300 mx-2" />
          <Pagination className="!mx-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  showText={false}
                  onClick={e => {
                    e.preventDefault();
                    if (currentPage > 1) onPageChange(currentPage - 1);
                  }}
                  className={cn(
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed border-none ml-0 py-5 pl-3 pr-3"
                      : "cursor-pointer border-none ml-0 py-5 pl-3 pr-3"
                  )}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  showText={false}
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    if (currentPage < totalPages) onPageChange(currentPage + 1);
                  }}
                  className={cn(
                    `border-none ml-0 py-5 pl-3 pr-3 ${currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer border-none"
                    }`
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    );
  }

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 3;

    items.push(
      <PaginationItem key={currentPage} className="md:hidden">
        <PaginationLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
          }}
          isActive={true}
          className={cn(
            "border border-gray-300 dark:border-gray-700",
            "bg-gray-50 dark:bg-gray-800"
          )}
        >
          {currentPage}
        </PaginationLink>
      </PaginationItem>
    );

    if(totalPages <= 7) {
      for(let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={`desktop-${i}`} className="hidden md:flex">
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
        <PaginationItem key="desktop-1" className="hidden md:flex">
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
          <PaginationItem key="ellipsis-start" className="hidden md:flex">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for(let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={`desktop-${i}`} className="hidden md:flex">
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
          <PaginationItem key="ellipsis-end" className="hidden md:flex">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      if(totalPages > 1) {
        items.push(
          <PaginationItem key={`desktop-${totalPages}`} className="hidden md:flex">
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
