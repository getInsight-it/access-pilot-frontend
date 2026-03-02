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
import { formatErrorMessages } from "../../../common/utils/error-utils.ts";
import useAuthStore, { UserInfo } from "../../../store/authStore.ts";
import { RoleComponentGuard } from "../../../common/context/auth/RoleGuard.tsx";
import { UserRoleEnum } from "../../../common/types/user/user.model.ts";

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
    } catch (error: unknown) {
      const errorMessage: string = formatErrorMessages(error);
      toast({
        title: "Erro ao carregar solicitações",
        description: errorMessage,
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
    } catch (error: unknown) {
      const errorMessage: string = formatErrorMessages(error);
      toast({
        title: "Erro ao buscar sistemas",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, []);

  const fetchSummary = useCallback(async (): Promise<void> => {
    try {
      const summaryData = await summaryService.getSummary();
      setSummary(summaryData);
    } catch (error: unknown) {
      const errorMessage: string = formatErrorMessages(error);
      toast({
        title: "Erro ao buscar sumário",
        description: errorMessage,
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
    } catch (error: unknown) {
      const errorMessage: string = formatErrorMessages(error);
      toast({
        title: "Erro ao carregar dados do dashboard",
        description: errorMessage,
        variant: "destructive"
      });
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

  const handleRequestAccess = useCallback((client?: ClientResponseInterface): void => {
    if (client) {
      navigate(PRIVATE_ROUTES.REQUEST_ACCESS, { state: client });
    } else {
      navigate(PRIVATE_ROUTES.REQUEST_ACCESS);
    }
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

/**
 * Gets the display name for a user
 *
 * @param user - User information object
 * @returns Formatted user display name or fallback text
 */
const getUserDisplayName = (user: UserInfo | null | undefined): string => {
  if (user?.firstName && user?.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  if (user?.firstName) {
    return user.firstName;
  }
  if (user?.username) {
    return user.username;
  }
  return "Usuário";
};

const LoadingState = () => {
  const user = useAuthStore((state) => state.user);
  const displayName = getUserDisplayName(user);

  return (
    <motion.div
      {...MOTION_DIV_DEFAULT_ANIMATION_CONFIG}>
      <div>
        <HeaderContainer>
          <div>
            <Heading title={`Olá, ${displayName}`} />
          </div>
        </HeaderContainer>
        <Separator />
      </div>
      <div>
        <HighlightLoader />
      </div>
    </motion.div>
  );
};

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const displayName = getUserDisplayName(user);

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
      title: "Solicitações aprovadas",
      value: summary?.totalApprovedRequests || 0,
      icon: Users,
      bgColor: "bg-success-25",
      iconBg: "bg-success-100",
      iconColor: "text-success-700",
      textColor: "text-success-900",
      valueColor: "text-success-700"
    },
    {
      title: "Solicitações pendentes",
      value: summary?.totalPendingRequests || 0,
      icon: FileText,
      bgColor: "bg-warning-50",
      iconBg: "bg-warning-100",
      iconColor: "text-warning-700",
      textColor: "text-warning-900",
      valueColor: "text-warning-700"
    },
    {
      title: "Total de sistemas",
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
      label: `${summary?.totalApprovedUsers || 0} usuários com acesso aprovado`,
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
      label: `${summary?.totalPendingUsers || 0} usuários com solicitações pendentes`,
      icon: XCircle,
      bgColor: "bg-error-50",
      borderColor: "border-error-200",
      iconColor: "text-red-500",
      textColor: "text-error-700"
    }
  ], [summary]);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <motion.div
      {...MOTION_DIV_DEFAULT_ANIMATION_CONFIG}>

      <div>
        <HeaderContainer>
          <div>
            <Heading title={`Olá, ${displayName}`} />
          </div>
        </HeaderContainer>
        <Separator />
      </div>

      <ScrollArea viewportClassName="px-4 md:px-7">
        <RoleComponentGuard roles={[UserRoleEnum.ADMIN]}>
          <div>
            {summaryCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className={`${card.bgColor}`}>
                  <div>
                    <div className={`${card.iconBg}`}>
                      <Icon size={20} className={card.iconColor} />
                    </div>
                    <span className={`${card.textColor}`}>
                      {card.title}
                    </span>
                  </div>
                  <span className={`${card.valueColor}`}>
                    {card.value}
                  </span>
                </div>
              );
            })}
          </div>

          <div>
            {statusCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className={`border ${card.borderColor} ${card.bgColor}`}>
                  <Icon size={12} className={card.iconColor} />
                  <span className={`${card.textColor}`}>
                    {card.label}
                  </span>
                </div>
              );
            })}
          </div>
        </RoleComponentGuard>

        <RoleComponentGuard roles={[UserRoleEnum.APPROVER]}>
          <h3>Últimas solicitações</h3>

          <div>
            {requests.length > 0 ? (
              requests.map((request, index) => (
                <div className="table-card" key={`dashboard-table-card-${index}`}>
                  <div className="table-card__header">
                    <span>Ações</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <EllipsisVertical size={20} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
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
              <EmptyState message="Nenhuma solicitação encontrada" />
            )}
          </div>

          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead width="calc(33.3% - 33px)">Sistema</TableHead>
                  <TableHead width="calc(33.3% - 33px)">Papel</TableHead>
                  <TableHead width="calc(33.4% - 34px)">Status</TableHead>
                  <TableHead width="100px">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length > 0 ? (
                  requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell width="calc(33.3% - 33px)">{request.role?.client?.name}</TableCell>
                      <TableCell width="calc(33.3% - 33px)">{request.role?.name}</TableCell>
                      <TableCell width="calc(33.4% - 34px)">{RequestStatusBadge(request.status)}</TableCell>
                      <TableCell width="100px">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <EllipsisVertical size={20} className="cursor-pointer mx-auto" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
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
                    <TableCell {...{ colSpan: 4 }}>
                      <div>
                        <EmptyState message="Nenhuma solicitação encontrada" />
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </RoleComponentGuard>
        <div>
          <div>
            <div>
              <h3>Sistemas que você tem acesso</h3>
            </div>
            {attachedClients.length > 0 ? (
              <div>
                {attachedClients.map((client) => (
                  <ClientCard
                    key={client.clientId}
                    client={client}
                    hasAccess={true}
                    onActionClick={() => handleSeeClientDetails(client.clientId)}
                  />
                ))}
              </div>
            ) : (
              <div>
                <EmptyState message="Nenhum sistema com acesso encontrado" />
              </div>
            )}
          </div>
        </div>

        <div>
          <div>
            <h3>Sistemas para solicitar acesso</h3>
          </div>
          <div>
            {detachedClients.length > 0 ? (
              detachedClients.map((client) => (
                <ClientCard
                  key={client.clientId}
                  client={client}
                  hasAccess={false}
                  onActionClick={() => handleRequestAccess(client)}
                />
              ))
            ) : (
              <div>
                <EmptyState message="Nenhum sistema disponível para solicitação" />
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </motion.div>
  );
}
