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

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
      >
        {value}
        <ChevronDown
          size={18}
        />
      </button>
      {open && (
        <div>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <div
              key={page}
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

  if (theme === "gov" || theme === "govbr") {
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    return (
      <div className={cn(className)}>
        <div>
          {startItem}–{endItem} de {totalItems} itens
        </div>

        <div>
          <span>Página</span>
          <PageDropdown value={currentPage} totalPages={totalPages} onChange={onPageChange} />
          <div />
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  showText={false}
                  onClick={e => {
                    e.preventDefault();
                    if (currentPage > 1) onPageChange(currentPage - 1);
                  }}
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
      <PaginationItem key={currentPage}>
        <PaginationLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
          }}
          isActive={true}
        >
          {currentPage}
        </PaginationLink>
      </PaginationItem>
    );

    if(totalPages <= 7) {
      for(let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={`desktop-${i}`}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(i);
              }}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key="desktop-1">
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(1);
            }}
            isActive={currentPage === 1}
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
          <PaginationItem key={`desktop-${i}`}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(i);
              }}
              isActive={currentPage === i}
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
          <PaginationItem key={`desktop-${totalPages}`}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(totalPages);
              }}
              isActive={currentPage === totalPages}
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
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
