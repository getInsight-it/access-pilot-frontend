import { ScrollArea } from "../../../common/external/ui/scroll-area.tsx";
import { motion } from "framer-motion";
import { Separator } from "../../../common/external/ui/separator.tsx";
import { HeaderContainer, Heading } from "../../../common/components/heading.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../common/external/ui/table.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../../../common/external/ui/dropdown-menu.tsx";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  EllipsisVertical,
  FileText,
  ReceiptText,
  TrendingUp,
  Users,
  XCircle
} from "lucide-react";
import { savePreviousRoute } from "../../../common/utils/NavigationStateManager.ts";
import { PRIVATE_ROUTES } from "../../../common/constants/routes.ts";
import { RequestStatusBadge } from "../../requests/common/components/RequestStatusBadge.tsx";
import { SummaryModel } from "../common/model/summary.model.ts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { summaryService } from "../common/api/summary-service.ts";
import { toast } from "../../../common/external/ui/use-toast.ts";
import { useNavigate } from "react-router-dom";
import { RequestInterface } from "../../requests/common/types/request.model.ts";
import { requestService } from "../../requests/common/api/request-service.ts";
import { clientService } from "../../client/common/service/client-service.ts";
import { ClientResponseInterface } from "../../client/common/model/client.model.ts";
import HighlightLoader from "../../../common/components/loading/HighLightLoader.tsx";
import { ClientCard } from "./partials/ClientCard.tsx";
import { MOTION_DIV_DEFAULT_ANIMATION_CONFIG } from "../../../common/constants/animation.ts";
import { SummaryCardData } from "./types/status-card-data.model.ts";
import { StatusCardData } from "./types/summary-card-data.model.ts";
import { EmptyState } from "./partials/EmptyState.tsx";

const REQUEST_PAGINATION = {
  PAGE: 1,
  SIZE: 10,
  SORT_FIELD: "id",
  SORT_ORDER: "desc" as const,
  FILTER: "assigned"
};

const useDashboardData = () => {
  const [requests, setRequests] = useState<RequestInterface[]>([]);
  const [summary, setSummary] = useState<SummaryModel | null>(null);
  const [attachedClients, setAttachedClients] = useState<ClientResponseInterface[]>([]);
  const [detachedClients, setDetachedClients] = useState<ClientResponseInterface[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async (): Promise<void> => {
    try {
      const pageResponse = await requestService.getRequestsMePaginated(
        REQUEST_PAGINATION.PAGE,
        REQUEST_PAGINATION.SIZE,
        REQUEST_PAGINATION.SORT_FIELD,
        REQUEST_PAGINATION.SORT_ORDER,
        REQUEST_PAGINATION.FILTER
      );
      setRequests(pageResponse?.items || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as solicitações",
        variant: "destructive"
      });
    }
  }, []);

  const fetchClients = useCallback(async (
    attached: boolean,
    setter: (clients: ClientResponseInterface[]) => void
  ): Promise<void> => {
    try {
      const clients = await clientService.getClientsAssociates(attached);
      setter(clients || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        title: "Erro",
        description: "Erro ao buscar sistemas.",
        variant: "destructive"
      });
    }
  }, []);

  const fetchSummary = useCallback(async (): Promise<void> => {
    try {
      const summaryData = await summaryService.getSummary();
      setSummary(summaryData);
    } catch (error) {
      console.error("Error fetching summary:", error);
      toast({
        title: "Erro",
        description: "Erro ao buscar sumário.",
        variant: "destructive"
      });
    }
  }, []);

  const loadAllData = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      await Promise.all([
        fetchClients(true, setAttachedClients),
        fetchClients(false, setDetachedClients),
        fetchSummary(),
        fetchRequests()
      ]);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchClients, fetchSummary, fetchRequests]);

  return {
    requests,
    summary,
    attachedClients,
    detachedClients,
    loading,
    loadAllData
  };
};

const useNavigation = () => {
  const navigate = useNavigate();

  const handleRequestAccess = useCallback((): void => {
    navigate(PRIVATE_ROUTES.REQUEST_ACCESS);
  }, [navigate]);

  const handleSeeClientDetails = useCallback((clientId: string): void => {
    savePreviousRoute(PRIVATE_ROUTES.DASHBOARD);
    navigate(PRIVATE_ROUTES.SYSTEMS_DETAILS.replace(":clientId", clientId));
  }, [navigate]);

  const handleNavigateToRequestDetails = useCallback((requestId: number): void => {
    savePreviousRoute(PRIVATE_ROUTES.DASHBOARD, "assigned");
    navigate(PRIVATE_ROUTES.ACCESS_REQUESTS_WITH_ID.replace(":id", requestId.toString()));
  }, [navigate]);

  return {
    handleRequestAccess,
    handleSeeClientDetails,
    handleNavigateToRequestDetails
  };
};

const LoadingState = () => (
  <motion.div
    className="flex flex-col h-full"
    {...MOTION_DIV_DEFAULT_ANIMATION_CONFIG}>
    <div className="flex-none">
      <HeaderContainer>
        <div className="pl-1 flex items-start justify-between">
          <Heading title="Olá, teste" />
        </div>
      </HeaderContainer>
      <Separator />
    </div>
    <div className="flex items-center justify-center min-h-[60vh]">
      <HighlightLoader />
    </div>
  </motion.div>
);

export default function Dashboard() {
  const {
    requests,
    summary,
    attachedClients,
    detachedClients,
    loading,
    loadAllData
  } = useDashboardData();

  const {
    handleRequestAccess,
    handleSeeClientDetails,
    handleNavigateToRequestDetails
  } = useNavigation();

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const summaryCards = useMemo((): SummaryCardData[] => [
    {
      title: "Total de Usuários",
      value: summary?.totalRegisteredUsers || 0,
      icon: Users,
      bgColor: "bg-success-25",
      iconBg: "bg-success-100",
      iconColor: "text-success-700",
      textColor: "text-success-900",
      valueColor: "text-success-700"
    },
    {
      title: "Usuários Pendentes",
      value: summary?.totalPendingUsers || 0,
      icon: FileText,
      bgColor: "bg-warning-50",
      iconBg: "bg-warning-100",
      iconColor: "text-warning-700",
      textColor: "text-warning-900",
      valueColor: "text-warning-700"
    },
    {
      title: "Total de Clientes",
      value: summary?.totalClients || 0,
      icon: TrendingUp,
      bgColor: "bg-indigo-25",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-700",
      textColor: "text-indigo-900",
      valueColor: "text-indigo-700"
    }
  ], [summary]);

  const statusCards = useMemo((): StatusCardData[] => [
    {
      label: `${summary?.totalActiveUsers || 0} usuários ativos`,
      icon: CheckCircle,
      bgColor: "bg-success-50",
      borderColor: "border-success-200",
      iconColor: "text-success-500",
      textColor: "text-success-700"
    },
    {
      label: `${summary?.totalRoles || 0} papéis`,
      icon: Clock,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-500",
      textColor: "text-blue-700"
    },
    {
      label: `${summary?.totalClients || 0} sistemas`,
      icon: AlertCircle,
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      iconColor: "text-purple-500",
      textColor: "text-purple-700"
    },
    {
      label: `${summary?.totalInactiveUsers || 0} usuários inativos`,
      icon: XCircle,
      bgColor: "bg-error-50",
      borderColor: "border-error-200",
      iconColor: "text-red-500",
      textColor: "text-error-700"
    }
  ], [summary]);

  const displayedAttachedClients = useMemo(() => attachedClients, [attachedClients]);
  const displayedDetachedClients = useMemo(() => detachedClients, [detachedClients]);

  if(loading) {
    return <LoadingState />;
  }

  return (
    <motion.div
      className="flex flex-col h-full"
      {...MOTION_DIV_DEFAULT_ANIMATION_CONFIG}>

      <div className="flex-none">
        <HeaderContainer>
          <div className="pl-1 flex items-start justify-between">
            <Heading title="Olá, teste" />
          </div>
        </HeaderContainer>
        <Separator />
      </div>

      <ScrollArea className="flex-grow border-r px-2 sm:px-6 pt-6">
        <div className="grid grid-cols-2 gap-4 md:flex flex-row flex-wrap md:gap-6 mb-6">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className={`${card.bgColor} rounded-xl flex flex-row flex-wrap items-center justify-between gap-4 p-4 flex-1`}>
                <div className="flex items-center gap-3">
                  <div className={`${card.iconBg} rounded-full min-w-10 min-h-10 flex items-center justify-center`}>
                    <Icon size={20} className={card.iconColor} />
                  </div>
                  <span className={`${card.textColor} text-base font-normal`}>
                        {card.title}
                      </span>
                </div>
                <span className={`${card.valueColor} text-xl font-bold break-all`}>
                      {card.value}
                    </span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-4 md:flex flex-row flex-wrap md:gap-6 mb-6">
          {statusCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className={`flex items-center flex-1 justify-center gap-2 p-3 rounded border ${card.borderColor} ${card.bgColor}`}>
                <Icon size={12} className={card.iconColor} />
                <span className={`text-sm font-medium ${card.textColor} break-all`}>
                      {card.label}
                    </span>
              </div>
            );
          })}
        </div>

        <h3 className="text-lg font-semibold mb-4">Últimas solicitações</h3>

        <div className="flex flex-col gap-4 lg:hidden w-full sm:w-auto">
          {requests.length > 0 ? (
            requests.map((request, index) => (
              <div className="table-card" key={`dashboard-table-card-${index}`}>
                <div className="table-card__header">
                  <span className="mr-2">Ações</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <EllipsisVertical size={20} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="flex flex-row gap-2"
                        onClick={() => handleNavigateToRequestDetails(request.id)}>
                        <ReceiptText size={16} />
                        <span>Detalhes</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="table-card__content">
                  <div className="table-card__content__row">
                    <span className="table-card__label">Sistema:</span>
                    <span className="table-card__value">{request.role?.client?.name}</span>
                  </div>
                  <div className="table-card__content__row">
                    <span className="table-card__label">Papel:</span>
                    <span className="table-card__value">{request.role?.name}</span>
                  </div>
                  <div className="table-card__content__row">
                    <span className="table-card__label">Status:</span>
                    {RequestStatusBadge(request.status)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <TableRow>
              <TableCell>
                <EmptyState message="Nenhuma solicitação encontrada" />
              </TableCell>
            </TableRow>
          )}
        </div>

        <div className="hidden lg:flex">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead width="calc(33.3% - 33px)">Sistema</TableHead>
                <TableHead width="calc(33.3% - 33px)">Papel</TableHead>
                <TableHead width="calc(33.4% - 34px)">Status</TableHead>
                <TableHead width="100px" className="flex items-center justify-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length > 0 ? (
                requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell width="calc(33.3% - 33px)">{request.role?.client?.name}</TableCell>
                    <TableCell width="calc(33.3% - 33px)">{request.role?.name}</TableCell>
                    <TableCell width="calc(33.4% - 34px)">{RequestStatusBadge(request.status)}</TableCell>
                    <TableCell width="100px" className="flex items-center justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <EllipsisVertical size={20} className="cursor-pointer mx-auto" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="flex flex-row gap-2"
                            onClick={() => handleNavigateToRequestDetails(request.id)}>
                            <ReceiptText size={16} />
                            <span>Detalhes</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell>
                    <EmptyState message="Nenhuma solicitação encontrada" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-row justify-between ">
          <div className="flex flex-col w-full">
            <div className="pt-4 pb-0">
              <h3 className="text-lg font-semibold mb-4">Sistemas que você tem acesso</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {displayedAttachedClients.length > 0 ? (
                displayedAttachedClients.map((client) => (
                  <ClientCard
                    key={client.clientId}
                    client={client}
                    hasAccess={true}
                    onActionClick={() => handleSeeClientDetails(client.clientId)}
                  />
                ))
              ) : (
                <EmptyState message="Nenhum sistema com acesso encontrado" />
              )}
            </div>
          </div>
        </div>

        <div className="h-1/2 flex flex-col">
          <div className="pt-4 pb-0">
            <h3 className="text-lg font-semibold mb-4">Sistemas para solicitar acesso</h3>
          </div>
          <div className="flex flex-col">
            {displayedDetachedClients.length > 0 ? (
              displayedDetachedClients.map((client) => (
                <ClientCard
                  key={client.clientId}
                  client={client}
                  hasAccess={false}
                  onActionClick={handleRequestAccess}
                />
              ))
            ) : (
              <EmptyState message="Nenhum sistema disponível para solicitação" />
            )}
          </div>
        </div>
      </ScrollArea>
    </motion.div>
  );
}
