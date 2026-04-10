import { useCallback, useMemo, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { PRIVATE_ROUTES } from "../../../../common/constants/routes.ts";
import { useI18n } from "../../../../common/context/i18n/I18nContext.tsx";
import { requestService } from "../../common/api/request-service.ts";
import { RequestInterface } from "../../common/types/request.model.ts";
import { toast } from "../../../../common/external/ui/use-toast.ts";
import { useDebounce } from "../../../../common/hooks/use-debounce.ts";
import { savePreviousRoute } from "../../../../common/utils/NavigationStateManager.ts";
import { formatErrorMessages } from "../../../../common/utils/error-utils.ts";

interface PaginationParams {
  page: number;
  size: number;
  sortField: string;
  sortOrder: "asc" | "desc";
  filter?: string;
}

const DEFAULT_PAGINATION = {
  PAGE_SIZE: 10,
  SORT_FIELD: "id",
  SORT_ORDER: "desc" as const,
  INITIAL_PAGE: 1
};

const DEBOUNCE_DELAY = 500;

export const useRequestType = () => {
  const isMyAccessRequestsRoute = useMatch(PRIVATE_ROUTES.MY_ACCESS_REQUESTS);

  return useMemo(() => {
    return isMyAccessRequestsRoute ? "created" : "assigned";
  }, [isMyAccessRequestsRoute]);
};

export const useSearchFilter = () => {
  const [searchFilter, setSearchFilter] = useState("");
  const debouncedSearchFilter = useDebounce(searchFilter, DEBOUNCE_DELAY);

  const handleSearchChange = useCallback((value: string): void => {
    setSearchFilter(value);
  }, []);

  return {
    searchFilter,
    debouncedSearchFilter,
    handleSearchChange
  };
};

export const useRequestListData = (requestType: string) => {
  const { t } = useI18n();
  const [requests, setRequests] = useState<RequestInterface[]>([]);
  const [totalRequests, setTotalRequests] = useState(0);
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGINATION.INITIAL_PAGE);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchRequests = useCallback(async (params: PaginationParams): Promise<void> => {
    setLoading(true);
    try {
      const pageResponse = await requestService.getRequestsMePaginated(
        params.page,
        params.size,
        params.sortField,
        params.sortOrder,
        requestType,
        params.filter
      );

      setCurrentPage(params.page);
      setRequests(pageResponse?.items || []);
      setTotalRequests(pageResponse?.total ?? 0);
      setTotalPages(Math.ceil((pageResponse?.total ?? 0) / params.size));
    } catch (error: unknown) {
      const errorMessage: string = formatErrorMessages(error);
      toast({
        title: t("Erro ao buscar solicitações"),
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [requestType, t]);

  const handlePageChange = useCallback((page: number, filter?: string): void => {
    void fetchRequests({
      page,
      size: DEFAULT_PAGINATION.PAGE_SIZE,
      sortField: DEFAULT_PAGINATION.SORT_FIELD,
      sortOrder: DEFAULT_PAGINATION.SORT_ORDER,
      filter
    });
  }, [fetchRequests]);

  const resetToFirstPage = useCallback((filter?: string): void => {
    void fetchRequests({
      page: DEFAULT_PAGINATION.INITIAL_PAGE,
      size: DEFAULT_PAGINATION.PAGE_SIZE,
      sortField: DEFAULT_PAGINATION.SORT_FIELD,
      sortOrder: DEFAULT_PAGINATION.SORT_ORDER,
      filter
    });
  }, [fetchRequests]);

  return {
    requests,
    totalRequests,
    currentPage,
    totalPages,
    loading,
    handlePageChange,
    resetToFirstPage
  };
};

export const useRequestNavigation = (requestType: string) => {
  const navigate = useNavigate();

  const handleNavigateToDetails = useCallback((requestId: number): void => {
    savePreviousRoute(PRIVATE_ROUTES.ACCESS_REQUESTS, requestType);
    navigate(PRIVATE_ROUTES.ACCESS_REQUESTS_WITH_ID.replace(":id", requestId.toString()));
  }, [navigate, requestType]);

  return { handleNavigateToDetails };
};

export const useRequestFormatting = () => {
  const { language } = useI18n();

  const formatDate = useCallback((date: string): string => {
    return new Date(date).toLocaleString(language, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).replace(",", " -");
  }, [language]);

  return { formatDate };
};
