import { ScrollArea } from "../../../common/external/ui/scroll-area.tsx";
import { motion } from "framer-motion";
import { HeaderContainer, Heading } from "@common/components/heading/heading.tsx";
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
import { ClientCard } from "./partials/client-card/ClientCard.tsx";
import { MOTION_DIV_DEFAULT_ANIMATION_CONFIG } from "../../../common/constants/animation.ts";
import { SummaryCardData } from "./types/status-card-data.model.ts";
import { StatusCardData } from "./types/summary-card-data.model.ts";
import { EmptyState } from "./partials/empty-state/EmptyState.tsx";
import { formatErrorMessages } from "../../../common/utils/error-utils.ts";
import useAuthStore, { UserInfo } from "../../../store/authStore.ts";
import { RoleComponentGuard } from "../../../common/context/auth/RoleGuard.tsx";
import { UserRoleEnum } from "../../../common/types/user/user.model.ts";
import "./Dashboard.scss";

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
      const errorMessage = formatErrorMessages(error);
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
      const errorMessage = formatErrorMessages(error);
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
      const errorMessage = formatErrorMessages(error);
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
      const errorMessage = formatErrorMessages(error);
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
      return;
    }

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
    <motion.div className="dashboard-page" {...MOTION_DIV_DEFAULT_ANIMATION_CONFIG}>
      <div>
        <HeaderContainer className="dashboard-page__header-container">
          <Heading
            className="dashboard-page__heading"
            title={`Olá, ${displayName}`}
            description="Carregando o panorama geral do ambiente."
          />
        </HeaderContainer>
      </div>

      <div className="dashboard-page__loading">
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
      description: "Demandas concluídas e liberadas para uso no ambiente.",
      value: summary?.totalApprovedRequests || 0,
      icon: Users,
      tone: "success"
    },
    {
      title: "Solicitações pendentes",
      description: "Itens aguardando análise ou ação do fluxo de aprovação.",
      value: summary?.totalPendingRequests || 0,
      icon: FileText,
      tone: "warning"
    },
    {
      title: "Sistemas monitorados",
      description: "Sistemas disponíveis no ambiente para consulta e solicitação.",
      value: summary?.totalClients || 0,
      icon: TrendingUp,
      tone: "primary"
    }
  ], [summary]);

  const statusCards = useMemo((): StatusCardData[] => [
    {
      label: "usuários com acesso aprovado",
      value: summary?.totalApprovedUsers || 0,
      icon: CheckCircle,
      tone: "success"
    },
    {
      label: "papéis cadastrados",
      value: summary?.totalRoles || 0,
      icon: Clock,
      tone: "primary"
    },
    {
      label: "sistemas monitorados",
      value: summary?.totalClients || 0,
      icon: AlertCircle,
      tone: "violet"
    },
    {
      label: "usuários com solicitações pendentes",
      value: summary?.totalPendingUsers || 0,
      icon: XCircle,
      tone: "danger"
    }
  ], [summary]);

  if (loading) {
    return <LoadingState />;
  }

  const renderRequestActions = (requestId: number) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="dashboard-page__table-actions-button" aria-label="Abrir ações da solicitação">
          <EllipsisVertical size={18} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleNavigateToRequestDetails(requestId)}>
          <ReceiptText size={16} />
          <span>Detalhes</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <motion.div className="dashboard-page" {...MOTION_DIV_DEFAULT_ANIMATION_CONFIG}>
      <div>
        <HeaderContainer className="dashboard-page__header-container">
          <Heading
            className="dashboard-page__heading"
            title={`Olá, ${displayName}`}
            description="Acompanhe solicitações, acessos e sistemas disponíveis em um único lugar."
          />
        </HeaderContainer>
      </div>

      <ScrollArea className="dashboard-page__scroll-area" viewportClassName="dashboard-page__scroll-viewport">
        <div className="max-w-content-container dashboard-page__content">
          <RoleComponentGuard roles={[UserRoleEnum.ADMIN]}>
            <section className="dashboard-page__section">
              <div className="dashboard-page__metrics-grid">
                {summaryCards.map((card) => {
                  const Icon = card.icon;
                  const toneClass = `dashboard-page__metric-card--${card.tone}`;

                  return (
                    <article key={card.title} className={`dashboard-page__metric-card ${toneClass}`}>
                      <div className="dashboard-page__metric-main">
                        <div className="dashboard-page__metric-icon-box">
                          <Icon className="dashboard-page__metric-icon" />
                        </div>
                        <div className="dashboard-page__metric-copy">
                          <p className="dashboard-page__metric-title">{card.title}</p>
                          <p className="dashboard-page__metric-description">{card.description}</p>
                        </div>
                      </div>
                      <p className="dashboard-page__metric-value">{card.value}</p>
                    </article>
                  );
                })}
              </div>

              <div className="dashboard-page__status-grid">
                {statusCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <article key={card.label} className={`dashboard-page__status-card dashboard-page__status-card--${card.tone}`}>
                      <div className="dashboard-page__status-icon-box">
                        <Icon className="dashboard-page__status-icon" />
                      </div>
                      <div className="dashboard-page__status-copy">
                        <p className="dashboard-page__status-value">{card.value}</p>
                        <p className="dashboard-page__status-label">{card.label}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </RoleComponentGuard>

          <RoleComponentGuard roles={[UserRoleEnum.APPROVER]}>
            <section className="dashboard-page__section-card">
              <div className="dashboard-page__section-header">
                <div className="dashboard-page__section-heading">
                  <h3 className="dashboard-page__section-title">Últimas solicitações</h3>
                  <p className="dashboard-page__section-description">
                    Solicitações recentes atribuídas ao seu fluxo de aprovação.
                  </p>
                </div>
                <span className="app-badge app-badge--header">{requests.length}</span>
              </div>

              <div className="dashboard-page__request-cards">
                {requests.length > 0 ? (
                  requests.map((request) => (
                    <article className="dashboard-page__request-card" key={request.id}>
                      <div className="dashboard-page__request-card-header">
                        <span className="dashboard-page__request-card-title">Ações</span>
                        {renderRequestActions(request.id)}
                      </div>
                      <div className="dashboard-page__request-card-content">
                        <div className="dashboard-page__request-card-row">
                          <span className="dashboard-page__request-card-label">Sistema</span>
                          <span className="dashboard-page__request-card-value">{request.role?.client?.name || "-"}</span>
                        </div>
                        <div className="dashboard-page__request-card-row">
                          <span className="dashboard-page__request-card-label">Papel</span>
                          <span className="dashboard-page__request-card-value">{request.role?.name || "-"}</span>
                        </div>
                        <div className="dashboard-page__request-card-row">
                          <span className="dashboard-page__request-card-label">Status</span>
                          <span className="dashboard-page__request-card-badge">{RequestStatusBadge(request.status)}</span>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <EmptyState message="Nenhuma solicitação encontrada" />
                )}
              </div>

              <div className="dashboard-page__requests-table">
                <div className="app-table app-table--icon app-table--no-filter app-table--no-footer dashboard-page__table">
                  <div className="app-table__header">
                    <div className="app-table__row">
                      <div className="app-table__cell app-table__cell--content dashboard-page__table-cell dashboard-page__table-cell--system">
                        <span>Sistema</span>
                      </div>
                      <div className="app-table__cell app-table__cell--content dashboard-page__table-cell dashboard-page__table-cell--role">
                        <span>Papel</span>
                      </div>
                      <div className="app-table__cell app-table__cell--content dashboard-page__table-cell dashboard-page__table-cell--status">
                        <span>Status</span>
                      </div>
                      <div className="app-table__cell app-table__cell--icon dashboard-page__table-cell dashboard-page__table-cell--actions">
                        <span>Ações</span>
                      </div>
                    </div>
                  </div>

                  <div className="app-table__body">
                    {requests.length > 0 ? (
                      requests.map((request) => (
                        <div key={request.id} className="app-table__row">
                          <div className="app-table__cell app-table__cell--content dashboard-page__table-cell dashboard-page__table-cell--system">
                            <span>{request.role?.client?.name || "-"}</span>
                          </div>
                          <div className="app-table__cell app-table__cell--content dashboard-page__table-cell dashboard-page__table-cell--role">
                            <span>{request.role?.name || "-"}</span>
                          </div>
                          <div className="app-table__cell app-table__cell--content dashboard-page__table-cell dashboard-page__table-cell--status">
                            {RequestStatusBadge(request.status)}
                          </div>
                          <div className="app-table__cell app-table__cell--icon dashboard-page__table-cell dashboard-page__table-cell--actions">
                            {renderRequestActions(request.id)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="app-table__row">
                        <div className="app-table__cell dashboard-page__table-empty-state">
                          <EmptyState message="Nenhuma solicitação encontrada" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </RoleComponentGuard>

          <div className="dashboard-page__systems-grid">
            <section className="dashboard-page__section-card">
              <div className="dashboard-page__section-header">
                <div className="dashboard-page__section-heading">
                  <h3 className="dashboard-page__section-title">Sistemas que você tem acesso</h3>
                  <p className="dashboard-page__section-description">
                    Consulte detalhes, permissões e informações dos sistemas já liberados para seu perfil.
                  </p>
                </div>
                <span className="app-badge app-badge--header">{attachedClients.length}</span>
              </div>

              {attachedClients.length > 0 ? (
                <div className="dashboard-page__client-grid">
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
                <EmptyState message="Nenhum sistema com acesso encontrado" />
              )}
            </section>

            <section className="dashboard-page__section-card">
              <div className="dashboard-page__section-header">
                <div className="dashboard-page__section-heading">
                  <h3 className="dashboard-page__section-title">Sistemas para solicitar acesso</h3>
                  <p className="dashboard-page__section-description">
                    Descubra os sistemas disponíveis e inicie uma solicitação com os dados mais relevantes.
                  </p>
                </div>
                <span className="app-badge app-badge--header">{detachedClients.length}</span>
              </div>

              {detachedClients.length > 0 ? (
                <div className="dashboard-page__client-grid">
                  {detachedClients.map((client) => (
                    <ClientCard
                      key={client.clientId}
                      client={client}
                      hasAccess={false}
                      onActionClick={() => handleRequestAccess(client)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState message="Nenhum sistema disponível para solicitação" />
              )}
            </section>
          </div>
        </div>
      </ScrollArea>
    </motion.div>
  );
}
