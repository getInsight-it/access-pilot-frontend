import { cn } from "@config/lib/utils.ts";
import { useI18n } from "@common/context/i18n/I18nContext.tsx";
import "./TablePagination.scss";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  align?: "center" | "end";
}

type PaginationItem = number | "ellipsis";

const MAX_VISIBLE_PAGES = 7;

function buildPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>();
  pages.add(1);
  pages.add(totalPages);
  pages.add(currentPage);
  pages.add(currentPage - 1);
  pages.add(currentPage + 1);

  if (currentPage <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }

  if (currentPage >= totalPages - 2) {
    pages.add(totalPages - 1);
    pages.add(totalPages - 2);
    pages.add(totalPages - 3);
  }

  const sortedPages = Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((left, right) => left - right);

  const items: PaginationItem[] = [];

  sortedPages.forEach((page, index) => {
    if (index > 0 && page - sortedPages[index - 1] > 1) {
      items.push("ellipsis");
    }
    items.push(page);
  });

  return items;
}

export function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  align = "center",
}: TablePaginationProps) {
  const { t } = useI18n();

  if (totalPages <= 0) {
    return null;
  }

  const items = buildPaginationItems(currentPage, totalPages);
  const canGoToPrevious = currentPage > 1;
  const canGoToNext = currentPage < totalPages;

  return (
    <nav
      className={cn("table-pagination", align === "end" && "table-pagination--align-end", className)}
      aria-label={t("Paginação")}
    >
      <button
        type="button"
        className="table-pagination__control table-pagination__control--previous"
        onClick={() => {
          if (canGoToPrevious) {
            onPageChange(currentPage - 1);
          }
        }}
        disabled={!canGoToPrevious}
      >
        {t("Voltar")}
      </button>

      <ul className="table-pagination__pages">
        {items.map((item, index) => {
          if (item === "ellipsis") {
            return (
              <li key={`ellipsis-${index}`} className="table-pagination__item">
                <span className="table-pagination__ellipsis">...</span>
              </li>
            );
          }

          const isActive = item === currentPage;

          return (
            <li key={item} className="table-pagination__item">
              <button
                type="button"
                className={cn("table-pagination__page", isActive && "table-pagination__page--active")}
                onClick={() => {
                  if (!isActive) {
                    onPageChange(item);
                  }
                }}
                aria-current={isActive ? "page" : undefined}
              >
                {item}
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className="table-pagination__control table-pagination__control--next"
        onClick={() => {
          if (canGoToNext) {
            onPageChange(currentPage + 1);
          }
        }}
        disabled={!canGoToNext}
      >
        {t("Próxima")}
      </button>
    </nav>
  );
}
