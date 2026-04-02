import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "../../../../common/external/ui/use-toast.ts";
import { roleService } from "../../common/service/role-service.ts";
import { clientService } from "../../../client/common/service/client-service.ts";
import { levelService } from "../../../level/common/api/level-service.ts";
import {
  RoleApprovalPolicyRequestInterface,
  RoleApprovalPolicyTargetRequestInterface,
  RoleResponseInterface,
  RoleUpsertInterface
} from "../../common/types/role.model.ts";
import { ClientResponseInterface } from "../../../client/common/model/client.model.ts";
import { LevelInterface } from "../../../level/common/types/level.model.ts";
import { formatErrorMessages } from "../../../../common/utils/error-utils.ts";
import { PRIVATE_ROUTES } from "../../../../common/constants/routes.ts";
import { useI18n } from "../../../../common/context/i18n/I18nContext.tsx";

import * as z from "zod";

export const formSchema = z.object({
  name: z.string().min(3, { message: "O nome do sistema deve conter no mínimo 3 caracteres" }),
  description: z.string().min(3, { message: "A descrição do sistema deve conter no mínimo 3 caracteres" }),
  label: z.string().min(3, { message: "A label do sistema deve conter no mínimo 3 caracteres" }),
  levelId: z.string().optional(),
  icon: z.string().optional(),
  autoApprovalEnabled: z.boolean().default(false),
  lateralApprovalEnabled: z.boolean().default(false),
  lateralTargets: z.array(
    z.object({
      roleId: z.number(),
      canApprove: z.boolean().default(false),
      canReject: z.boolean().default(false),
      canRevoke: z.boolean().default(false)
    })
  ).default([])
});

export type RoleFormData = z.infer<typeof formSchema>;

interface RoleFormDataWithId extends RoleFormData {
  id?: number;
}

const AUTO_APPROVAL_POLICY = "AUTO_APPROVAL";
const LATERAL_APPROVAL_POLICY = "LATERAL_APPROVAL";

const getRolePolicy = (role: RoleResponseInterface, type: string) =>
  role.approvalPolicies?.find(policy => policy.type === type);

export const useNewRoleData = () => {
  const { t } = useI18n();
  const params = useParams<{ clientId: string; id: string }>();

  const isEditing = !!params.id;
  const roleId = params.id;
  const clientId = params.clientId;

  const [client, setClient] = useState<ClientResponseInterface>();
  const [levels, setLevels] = useState<LevelInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [loadingLevels, setLoadingLevels] = useState(false);
  const [initialData, setInitialData] = useState<RoleFormDataWithId | null>(null);
  const [roleDetails, setRoleDetails] = useState<RoleResponseInterface | null>(null);
  const [clientRoles, setClientRoles] = useState<RoleResponseInterface[]>([]);

  const getRoleToEdit = useCallback(async () => {
    if(!roleId || !clientId) return;

    try {
      const role: RoleResponseInterface = await roleService.getRoleById(roleId);
      setRoleDetails(role);

      const autoApprovalPolicy = getRolePolicy(role, AUTO_APPROVAL_POLICY);
      const lateralApprovalPolicy = getRolePolicy(role, LATERAL_APPROVAL_POLICY);

      const formData: RoleFormDataWithId = {
        id: role.id,
        name: role.name || "",
        label: role.label || "",
        description: role.description || "",
        levelId: role.level?.id ? role.level.id.toString() : "",
        icon: role.icon || "",
        autoApprovalEnabled: Boolean(autoApprovalPolicy?.enabled),
        lateralApprovalEnabled: Boolean(lateralApprovalPolicy?.enabled),
        lateralTargets: (lateralApprovalPolicy?.targetRoles || []).map(target => ({
          roleId: Number(target.roleId),
          canApprove: Boolean(target.canApprove),
          canReject: Boolean(target.canReject),
          canRevoke: Boolean(target.canRevoke)
        }))
      };

      setInitialData(formData);
      return formData;
    } catch (error: unknown) {
      const errorMessage: string = formatErrorMessages(error);
      toast({
        title: t("Erro ao buscar dados do papel"),
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    }
  }, [clientId, roleId, t]);

  const getClientData = useCallback(async () => {
    if(!clientId) return;

    try {
      const response = await clientService.fetchByClientId(clientId);
      if(response) {
        setClient(response);
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

  const getClientRoles = useCallback(async () => {
    if(!clientId) return;

    try {
      const roles = await roleService.getRolesByClientId(clientId);
      setClientRoles(roles);
    } catch (error: unknown) {
      const errorMessage: string = formatErrorMessages(error);
      toast({
        title: "Erro ao buscar papéis do sistema",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [clientId]);

  const fetchLevels = useCallback(async () => {
    setLoadingLevels(true);
    try {
      const response = await levelService.getLevels();
      if(response && response.items) {
        setLevels(response.items);
      }
    } catch (error: unknown) {
      const errorMessage: string = formatErrorMessages(error);
      toast({
        title: t("Erro ao carregar esferas"),
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoadingLevels(false);
    }
  }, [t]);

  const loadData = useCallback(async () => {
    setDataLoading(true);
    if(isEditing && roleId) {
      const [, , , roleData] = await Promise.all([
        getClientData(),
        fetchLevels(),
        getClientRoles(),
        getRoleToEdit()
      ]);
      return roleData;
    } else {
      await Promise.all([getClientData(), fetchLevels(), getClientRoles()]);
      return null;
    }
  }, [isEditing, roleId, getClientData, fetchLevels, getClientRoles, getRoleToEdit]);

  return {
    client,
    levels,
    loading,
    setLoading,
    dataLoading,
    setDataLoading,
    loadingLevels,
    initialData,
    roleDetails,
    clientRoles,
    isEditing,
    roleId,
    clientId,
    loadData
  };
};

export const useRoleSubmit = (
  client: ClientResponseInterface | undefined,
  initialData: RoleFormDataWithId | null,
  isEditing: boolean,
  setLoading: (loading: boolean) => void
) => {
  const { t } = useI18n();
  const navigate = useNavigate();

  const onSubmit = useCallback(async (form: RoleFormData) => {
    const levelId = form.levelId === undefined || form.levelId === "empty" || form.levelId === ""
      ? undefined
      : Number(form.levelId);
    const lateralTargets: RoleApprovalPolicyTargetRequestInterface[] = (form.lateralTargets || []).map(target => ({
      roleId: Number(target.roleId),
      canApprove: Boolean(target.canApprove),
      canReject: Boolean(target.canReject),
      canRevoke: Boolean(target.canRevoke)
    }));
    const hasLateralTargets = lateralTargets.length > 0;
    const approvalPolicies: RoleApprovalPolicyRequestInterface[] = [
      {
        type: AUTO_APPROVAL_POLICY,
        enabled: Boolean(form.autoApprovalEnabled),
        targetRoles: []
      },
      {
        type: LATERAL_APPROVAL_POLICY,
        enabled: Boolean(form.lateralApprovalEnabled) && hasLateralTargets,
        targetRoles: lateralTargets
      }
    ];

    const role: RoleUpsertInterface = {
      name: form.name,
      label: form.label,
      description: form.description,
      icon: form.icon,
      levelId,
      approvalPolicies
    };

    role.client = client;
    setLoading(true);

    try {
      if(initialData?.id) {
        await roleService.updateRole(initialData.id, role);
        toast({
          title: t("Papel atualizado"),
          description: t("O papel {{name}} foi atualizado com sucesso.", { name: role.name })
        });
      } else {
        await roleService.createRole(role);
        toast({
          title: t("Papel criado"),
          description: t("O papel {{name}} foi criado com sucesso.", { name: role.name })
        });
      }

      if(client?.clientId) {
        navigate(PRIVATE_ROUTES.ROLES.replace(":clientId", client.clientId));
      }
    } catch (error: unknown) {
      const errorMessage: string = formatErrorMessages(error);
      toast({
        title: isEditing ? t("Erro ao atualizar papel") : t("Erro ao criar papel"),
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [client, initialData, isEditing, navigate, setLoading, t]);

  return { onSubmit };
};

export const useRoleNavigation = (clientId?: string) => {
  const navigate = useNavigate();

  const navigateToSystemDetails = useCallback(() => {
    if(!clientId) return;
    navigate(PRIVATE_ROUTES.SYSTEMS_DETAILS.replace(":clientId", clientId));
  }, [navigate, clientId]);

  const navigateToRoleHierarchy = useCallback(() => {
    if(!clientId) return;
    navigate(`${PRIVATE_ROUTES.ROLES.replace(":clientId", clientId)}?tab=roles_hierarchy`);
  }, [navigate, clientId]);

  return {
    navigateToSystemDetails,
    navigateToRoleHierarchy
  };
};
