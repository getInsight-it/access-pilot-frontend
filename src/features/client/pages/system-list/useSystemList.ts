import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@ui/use-toast.ts";
import { clientService } from "../../common/service/client-service.ts";
import { ClientResponseInterface, ClientSyncSummaryInterface } from "../../common/model/client.model.ts";
import { ClientStatusEnum } from "../../common/enum/client-status.enum.ts";
import { formatErrorMessages } from "@utils/error-utils.ts";
import { savePreviousRoute } from "@utils/NavigationStateManager.ts";
import { PRIVATE_ROUTES } from "@constants/routes.ts";
import { PAGINATION } from "@constants/pagination.ts";

export const useSystemListData = () => {
  const [clients, setClients] = useState<ClientResponseInterface[]>([]);
  const [totalSystems, setTotalSystems] = useState(0);
  const [pageSize] = useState(PAGINATION.DEFAULT_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchFilter, setSearchFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getData = useCallback(async (page: number, size: number, filter: string = "") => {
    setIsLoading(true);
    try {
      const pageResponse = await clientService.getClientsPaginated(page, size, "id", "asc", filter);
      setClients(pageResponse?.items || []);
      setTotalSystems(pageResponse?.total ?? 0);
      setTotalPages(Math.ceil((pageResponse?.total ?? 0) / size));
    } catch (error: unknown) {
      const errorMessage: string = formatErrorMessages(error);
      toast({
        title: "Erro ao carregar sistemas",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setClients, setTotalSystems, setTotalPages]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, [setCurrentPage]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchFilter(value);
    setCurrentPage(1);
  }, [setSearchFilter, setCurrentPage]);

  const init = useCallback(() => {
    getData(currentPage, pageSize, searchFilter);
  }, [currentPage, pageSize, searchFilter, getData]);

  return {
    clients,
    setClients,
    totalSystems,
    pageSize,
    currentPage,
    totalPages,
    searchFilter,
    isLoading,
    handlePageChange,
    handleSearchChange,
    init
  };
};

export const useSystemOperations = (
  setClients: React.Dispatch<React.SetStateAction<ClientResponseInterface[]>>,
  refreshSystems: () => void
) => {
  const [syncAllLoading, setSyncAllLoading] = useState(false);

  const syncClient = useCallback(async (client: ClientResponseInterface) => {
    try {
      await clientService.syncClient(client.clientId);
      toast({
        title: "Sistema sincronizado",
        description: "O sistema foi sincronizado com sucesso"
      });
    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error);
      toast({
        title: "Erro ao sincronizar sistema",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, []);

  const syncAllClients = useCallback(async (syncRoles: boolean): Promise<ClientSyncSummaryInterface | null> => {
    setSyncAllLoading(true);
    try {
      const summary = await clientService.syncAllClients(syncRoles);
      const durationLabel = summary.duration >= 1000
        ? `${(summary.duration / 1000).toFixed(1)}s`
        : `${summary.duration}ms`;

      toast({
        title: "Sincronização concluída",
        description: `Criados ${summary.created} • Atualizados ${summary.updated} • Ignorados ${summary.ignored} • Erros ${summary.errors} • Duração ${durationLabel}`
      });
      refreshSystems();
      return summary;
    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error);
      toast({
        title: "Erro ao sincronizar sistemas",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    } finally {
      setSyncAllLoading(false);
    }
  }, [refreshSystems]);

  const handlePublicationChange = useCallback(async (client: ClientResponseInterface) => {
    if (!client.id) {
      toast({
        title: "Erro",
        description: "ID do sistema não encontrado",
        variant: "destructive"
      });
      return;
    }

    const newStatus = client.status === ClientStatusEnum.PUBLISHED
      ? ClientStatusEnum.UNPUBLISHED
      : ClientStatusEnum.PUBLISHED;
    const toastMessage = client.status === ClientStatusEnum.PUBLISHED
      ? "despublicado"
      : "publicado";

    try {
      const updatedClient = await clientService.updateSystemPublication(client.id, newStatus);

      setClients(prevClients =>
        prevClients.map(c => c.id === updatedClient.id ? updatedClient : c)
      );

      toast({
        title: "Sistema atualizado",
        description: `O sistema foi ${toastMessage} com sucesso!`
      });
    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error);
      toast({
        title: `Erro ao ${toastMessage} sistema`,
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [setClients]);

  return {
    syncClient,
    syncAllClients,
    syncAllLoading,
    handlePublicationChange
  };
};

export const useSystemNavigation = () => {
  const navigate = useNavigate();
  const handleNavigateFromSystems = useCallback((route: string, clientId: string) => {
    savePreviousRoute(PRIVATE_ROUTES.SYSTEMS);
    navigate(route.replace(":clientId", clientId));
  }, [navigate]);

  return {
    handleNavigateFromSystems
  };
};

export const usePopoverState = () => {
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  const handleMouseEnter = useCallback((clientId: string) => {
    setOpenPopoverId(clientId);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setOpenPopoverId(null);
  }, []);

  return {
    openPopoverId,
    handleMouseEnter,
    handleMouseLeave
  };
};
