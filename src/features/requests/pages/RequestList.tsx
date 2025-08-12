import { Breadcrumbs } from "../../../common/components/breadcrumbs.tsx";
import { HeaderContainer, Heading } from "../../../common/components/heading.tsx";
import { Separator } from "../../../common/external/ui/separator.tsx";
import { Link, useMatch, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { buttonVariants } from "../../../common/external/ui/button.tsx";
import { cn } from "../../../config/lib/utils.ts";
import { EllipsisVertical, Plus, ReceiptText } from "lucide-react";
import { PRIVATE_ROUTES } from "../../../common/constants/routes.ts";
import { motion } from "framer-motion";
import { requestService } from "../common/api/request-service.ts";
import { RequestInterface } from "../common/types/request.model.ts";
import { ScrollArea } from "../../../common/external/ui/scroll-area.tsx";
import { Input } from "../../../common/external/ui/input.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "../../../common/external/ui/table.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../../../common/external/ui/dropdown-menu.tsx";
import { PaginationWrapper } from "../../../common/components/PaginationWrapper.tsx";
import { savePreviousRoute } from "../../../common/utils/NavigationStateManager.ts";
import { RequestStatusBadge } from "../common/components/RequestStatusBadge.tsx";
import { toast } from "../../../common/external/ui/use-toast.ts";
import { useDebounce } from "../../../common/hooks/use-debounce.ts";
import { MOTION_DIV_DEFAULT_ANIMATION_CONFIG } from "../../../common/constants/animation.ts";
import { ContentLoader } from "../../../common/components/ContentLoader.tsx";

interface PaginationParams {
  page: number;
  size: number;
  sortField: string;
  sortOrder: "asc" | "desc";
  filter?: string;
}

const BREADCRUMB_ITEMS = [
  { title: "Gerenciar solicitações de acesso", link: "/dashboard/access-requests" }
];

const DEFAULT_PAGINATION = {
  PAGE_SIZE: 10,
  SORT_FIELD: "id",
  SORT_ORDER: "desc" as const,
  INITIAL_PAGE: 1
};

const DEBOUNCE_DELAY = 500;

const useRequestType = () => {
  const isMyAccessRequestsRoute = useMatch(PRIVATE_ROUTES.MY_ACCESS_REQUESTS);

  return useMemo(() => {
    return isMyAccessRequestsRoute ? "created" : "assigned";
  }, [isMyAccessRequestsRoute]);
};

const useSearchFilter = () => {
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

const useRequestListData = (requestType: string) => {
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
    } catch (error: any) {
      console.error("Error fetching requests:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as solicitações",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [requestType]);

  const handlePageChange = useCallback((page: number, filter?: string): void => {
    fetchRequests({
      page,
      size: DEFAULT_PAGINATION.PAGE_SIZE,
      sortField: DEFAULT_PAGINATION.SORT_FIELD,
      sortOrder: DEFAULT_PAGINATION.SORT_ORDER,
      filter
    });
  }, [fetchRequests]);

  const resetToFirstPage = useCallback((filter?: string): void => {
    fetchRequests({
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

const useRequestNavigation = (requestType: string) => {
  const navigate = useNavigate();

  const handleNavigateToDetails = useCallback((requestId: number): void => {
    savePreviousRoute(PRIVATE_ROUTES.ACCESS_REQUESTS, requestType);
    navigate(PRIVATE_ROUTES.ACCESS_REQUESTS_WITH_ID.replace(":id", requestId.toString()));
  }, [navigate, requestType]);

  return { handleNavigateToDetails };
};

const useRequestFormatting = () => {
  const formatDate = useCallback((date: string): string => {
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

export default function RequestList() {
  const requestType = useRequestType();

  const {
    searchFilter,
    debouncedSearchFilter,
    handleSearchChange
  } = useSearchFilter();

  const {
    requests,
    totalRequests,
    currentPage,
    totalPages,
    loading,
    handlePageChange,
    resetToFirstPage
  } = useRequestListData(requestType);

  const { handleNavigateToDetails } = useRequestNavigation(requestType);
  const { formatDate } = useRequestFormatting();

  useEffect(() => {
    resetToFirstPage();
  }, [resetToFirstPage]);

  useEffect(() => {
    resetToFirstPage(debouncedSearchFilter);
  }, [debouncedSearchFilter, resetToFirstPage]);

  const handlePaginationChange = useCallback((page: number) => {
    handlePageChange(page, debouncedSearchFilter);
  }, [handlePageChange, debouncedSearchFilter]);

  return (
    <motion.div
      className="flex flex-col h-full"
      {...MOTION_DIV_DEFAULT_ANIMATION_CONFIG}>

      <div className="flex-none">
        <HeaderContainer>
          <Breadcrumbs items={BREADCRUMB_ITEMS} />

          <div className="pl-1 flex flex-col gap-4 md:flex-row items-start justify-between">
            <Heading
              title="Solicitações"
              badgeValue={totalRequests}
              description="Gerenciar solicitações de acesso para sistemas."
            />
            <Link
              to={PRIVATE_ROUTES.REQUEST_ACCESS}
              className={cn(buttonVariants({ variant: "default" }))}
            >
              <Plus className="mr-2 h-4 w-4" /> Solicitar novo acesso
            </Link>
          </div>
        </HeaderContainer>

        <Separator />
      </div>

      <ScrollArea className="px-6 flex-grow">
        {loading ? (
          <ContentLoader />
        ) : (
          <div className="py-6 max-w-content-container m-auto">
              <div className="flex flex-col gap-4 lg:hidden">
                {requests.map((request, index) => (
                  <div className="table-card" key={`request-table-card-${index}`}>
                    <div className="table-card__header">
                      <span className="mr-2">Ações</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <EllipsisVertical size={20} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="flex flex-row gap-2"
                              onClick={() => handleNavigateToDetails(request.id)}
                            >
                              <ReceiptText size={16} />
                              <span>Detalhes</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="table-card__content">
                      <div className="table-card__content__row">
                        <span className="table-card__label">Protocolo:</span>
                        <span className="table-card__value">{request.protocolCode}</span>
                      </div>
                      <div className="table-card__content__row">
                        <span className="table-card__label">Sistema:</span>
                        <span className="table-card__value">{request.role?.client?.name}</span>
                      </div>
                      <div className="table-card__content__row">
                        <span className="table-card__label">Papel:</span>
                        <span className="table-card__value">{request.role?.label}</span>
                      </div>
                      <div className="table-card__content__row">
                        <span className="table-card__label">Data de submissão:</span>
                        <span className="table-card__value">{formatDate(request.criacao)}</span>
                      </div>
                      <div className="table-card__content__row">
                        <span className="table-card__label">Status:</span>
                        <span className="table-card__value">
                          {RequestStatusBadge(request.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="p-4">
                  <PaginationWrapper
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePaginationChange}
                  />
                </div>
              </div>
              <div className="hidden lg:flex">
                <Table
                auxiliaryHeader={
                  <div className="p-4 w-96">
                    <Input
                      variant="dark"
                      placeholder="Buscar solicitação..."
                      className="h-8 w-full border-0 bg-transparent focus:ring-0 focus:border-primary-300 placeholder:text-gray-400"
                      value={searchFilter}
                      onChange={(e) => handleSearchChange(e.target.value)}
                    />
                  </div>
                }
              >
                <TableHeader>
                  <TableRow>
                    <TableHead width="calc(20% - 20px)">Protocolo</TableHead>
                    <TableHead width="calc(20% - 20px)">Sistema</TableHead>
                    <TableHead width="calc(20% - 20px)">Papel</TableHead>
                    <TableHead width="calc(20% - 20px)">Data de submissão</TableHead>
                    <TableHead width="calc(20% - 20px)">Status</TableHead>
                    <TableHead className="flex align-center justify-center" width="100px">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow className="break-all" key={request.id}>
                      <TableCell width="calc(20% - 20px)">{request.protocolCode}</TableCell>
                      <TableCell width="calc(20% - 20px)">{request.role?.client?.name}</TableCell>
                      <TableCell width="calc(20% - 20px)">{request.role?.label}</TableCell>
                      <TableCell width="calc(20% - 20px)">{formatDate(request.criacao)}</TableCell>
                      <TableCell width="calc(20% - 20px)">{RequestStatusBadge(request.status)}</TableCell>
                      <TableCell className="flex align-center justify-center" width="100px">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <EllipsisVertical size={20} className="cursor-pointer" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="flex flex-row gap-2"
                              onClick={() => handleNavigateToDetails(request.id)}
                            >
                              <ReceiptText size={16} />
                              <span>Detalhes</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <div className="p-4">
                    <PaginationWrapper
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePaginationChange}
                    />
                  </div>
                </TableFooter>
                </Table>
              </div>

          </div>
        )}
      </ScrollArea>
    </motion.div>
  );
}
