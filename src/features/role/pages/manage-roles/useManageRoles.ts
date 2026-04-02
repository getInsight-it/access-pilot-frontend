import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "../../../../common/external/ui/use-toast.ts";
import { roleService } from "../../common/service/role-service.ts";
import { clientService } from "../../../client/common/service/client-service.ts";
import { RoleResponseInterface } from "../../common/types/role.model.ts";
import { ClientResponseInterface } from "../../../client/common/model/client.model.ts";
import { formatErrorMessages } from "../../../../common/utils/error-utils.ts";
import { savePreviousRoute } from "../../../../common/utils/NavigationStateManager.ts";
import { PRIVATE_ROUTES } from "../../../../common/constants/routes.ts";
import { PAGINATION } from "../../../../common/constants/pagination.ts";
import { useI18n } from "../../../../common/context/i18n/I18nContext.tsx";

export const useManageRolesData = (clientId?: string) => {
  const { t } = useI18n();
  const [allRoles, setAllRoles] = useState<RoleResponseInterface[]>([]);
  const [paginatedRoles, setPaginatedRoles] = useState<RoleResponseInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageSize] = useState(PAGINATION.DEFAULT_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [systemName, setSystemName] = useState<string>("");
  const [client, setClient] = useState<ClientResponseInterface>();

  const updatePaginatedRoles = useCallback((roles: RoleResponseInterface[], page: number) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = roles.slice(startIndex, endIndex);
    setPaginatedRoles(paginatedData);
  }, [pageSize]);

  const getClientData = useCallback(async () => {
    if (!clientId) return;

    try {
      const response = await clientService.fetchByClientId(clientId);
      if (response) {
        setClient(response);

        if (response.name) {
          setSystemName(response.name);
        }
      }
    } catch (error: unknown) {
      const errorMessage: string = formatErrorMessages(error);
      toast({
        title: t("Erro ao buscar dados do sistema"),
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [clientId, t]);

  const getData = useCallback(async () => {
    if (!clientId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [roles] = await Promise.all([
        roleService.getRolesByClientId(clientId),
        systemName ? Promise.resolve() : getClientData()
      ]);
      setAllRoles(roles);

      const totalPages = Math.ceil(roles.length / pageSize);
      setTotalPages(totalPages);
      updatePaginatedRoles(roles, currentPage);
    } catch (error: unknown) {
      const errorMessage: string = formatErrorMessages(error);
      toast({
        title: t("Erro ao buscar papéis"),
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [clientId, currentPage, getClientData, pageSize, systemName, t, updatePaginatedRoles]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return {
    allRoles,
    paginatedRoles,
    loading,
    pageSize,
    currentPage,
    totalPages,
    systemName,
    handlePageChange,
    getData,
    client,
    getClientData
  };
};

export const useRoleNavigation = (clientId?: string) => {
  const navigate = useNavigate();

  const navigateToNewRole = useCallback(() => {
    if (!clientId) return;

    savePreviousRoute(location.pathname + location.search);
    navigate(PRIVATE_ROUTES.NEW_ROLE.replace(":clientId", clientId));
  }, [navigate, clientId]);

  const navigateToEditRole = useCallback((roleId: number) => {
    if (!clientId) return;

    savePreviousRoute(location.pathname + location.search);
    navigate(
      PRIVATE_ROUTES.ROLES_EDIT
        .replace(":clientId", clientId)
        .replace(":id", roleId.toString())
    );
  }, [navigate, clientId]);

  const navigateToSystemDetails = useCallback(() => {
    if (!clientId) return;

    navigate(PRIVATE_ROUTES.SYSTEMS_DETAILS.replace(":clientId", clientId));
  }, [navigate, clientId]);

  return {
    navigateToNewRole,
    navigateToEditRole,
    navigateToSystemDetails
  };
};
