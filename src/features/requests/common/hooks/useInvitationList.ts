import { useCallback, useMemo, useState } from "react";

import { toast } from "@common/external/ui/use-toast.ts";
import { useDebounce } from "@common/hooks/use-debounce.ts";
import { formatErrorMessages } from "@common/utils/error-utils.ts";
import { InvitationListItemInterface } from "../types/invitation.model.ts";
import { invitationService } from "../api/invitation-service.ts";

type InvitationListMode = "manage" | "my";

interface FetchInvitationParams {
  page: number;
  size: number;
  sortField: string;
  sortOrder: "asc" | "desc";
  filter?: string;
}

const DEFAULT_PAGINATION = {
  PAGE_SIZE: 10,
  SORT_FIELD: "expiresAt",
  SORT_ORDER: "asc" as const,
  INITIAL_PAGE: 1
};

const DEBOUNCE_DELAY = 500;

export const useInvitationSearchFilter = () => {
  const [searchFilter, setSearchFilter] = useState("");
  const debouncedSearchFilter = useDebounce(searchFilter, DEBOUNCE_DELAY);

  const handleSearchChange = useCallback((value: string) => {
    setSearchFilter(value);
  }, []);

  return {
    searchFilter,
    debouncedSearchFilter,
    handleSearchChange
  };
};

export const useInvitationListData = (mode: InvitationListMode) => {
  const [invitations, setInvitations] = useState<InvitationListItemInterface[]>([]);
  const [totalInvitations, setTotalInvitations] = useState(0);
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGINATION.INITIAL_PAGE);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetcher = useMemo(() => {
    return mode === "manage"
      ? invitationService.getManageInvitationsPaginated.bind(invitationService)
      : invitationService.getMyInvitationsPaginated.bind(invitationService);
  }, [mode]);

  const fetchInvitations = useCallback(async (params: FetchInvitationParams) => {
    setLoading(true);
    try {
      const pageResponse = await fetcher(
        params.page,
        params.size,
        params.sortField,
        params.sortOrder,
        params.filter
      );

      setCurrentPage(params.page);
      setInvitations(pageResponse?.items || []);
      setTotalInvitations(pageResponse?.total ?? 0);
      setTotalPages(Math.ceil((pageResponse?.total ?? 0) / params.size));
    } catch (error: unknown) {
      const errorMessage = formatErrorMessages(error);
      toast({
        title: "Erro ao buscar convites",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  const handlePageChange = useCallback((page: number, filter?: string) => {
    void fetchInvitations({
      page,
      size: DEFAULT_PAGINATION.PAGE_SIZE,
      sortField: DEFAULT_PAGINATION.SORT_FIELD,
      sortOrder: DEFAULT_PAGINATION.SORT_ORDER,
      filter
    });
  }, [fetchInvitations]);

  const resetToFirstPage = useCallback((filter?: string) => {
    void fetchInvitations({
      page: DEFAULT_PAGINATION.INITIAL_PAGE,
      size: DEFAULT_PAGINATION.PAGE_SIZE,
      sortField: DEFAULT_PAGINATION.SORT_FIELD,
      sortOrder: DEFAULT_PAGINATION.SORT_ORDER,
      filter
    });
  }, [fetchInvitations]);

  return {
    invitations,
    totalInvitations,
    currentPage,
    totalPages,
    loading,
    handlePageChange,
    resetToFirstPage
  };
};

export const useInvitationFormatting = () => {
  const formatDate = useCallback((date: string) => {
    return new Date(date).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).replace(",", " -");
  }, []);

  return { formatDate };
};
