import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { STORAGE_KEYS } from "@constants/storage.ts";
import { formatErrorMessages } from "@common/utils/error-utils.ts";
import { clientService } from "@features/client/common/service/client-service.ts";
import { ClientResponseInterface } from "@features/client/common/model/client.model.ts";
import { levelService } from "@features/level/common/api/level-service.ts";
import { ItemHierarchyInterface } from "@features/level/common/types/item-hierarchy.model.ts";
import { roleService } from "@features/role/common/service/role-service.ts";
import { RoleResponseInterface } from "@features/role/common/types/role.model.ts";
import { useI18n } from "@common/context/i18n/I18nContext.tsx";
import { invitationService } from "../../common/api/invitation-service.ts";

type InviteRequestSource = "token" | "id";

interface InviteRequestPreview {
  client: ClientResponseInterface;
  role: RoleResponseInterface;
  reason: string;
  codeItem: string;
  sphereLabel: string;
  sphereHierarchy: ItemHierarchyInterface[];
  invitationUuid?: string;
  expiresAt?: string;
  title: string;
  description: string;
  protocolCode?: string;
  source: InviteRequestSource;
}

type TranslationFunction = (key: string, values?: Record<string, string | number>) => string;

const createInviteClient = (
  t: TranslationFunction,
  clientId: string,
  clientLabel: string,
  description?: string
): ClientResponseInterface => ({
  id: 0,
  label: clientLabel,
  clientId,
  clientUUID: clientId,
  managed: true,
  name: clientLabel,
  description: description || t("Os dados deste sistema foram vinculados diretamente ao convite."),
  configurations: [],
  allowedItemsHierarchy: []
});

const createInviteRole = (
  t: TranslationFunction,
  roleId: number,
  roleLabel: string,
  clientLabel: string,
  description?: string,
  levelId?: number,
  levelName?: string
): RoleResponseInterface => ({
  id: roleId,
  roleExternalId: `invitation-role-${roleId}`,
  name: roleLabel,
  label: roleLabel,
  icon: "shield",
  description: description || t("O papel foi preenchido automaticamente a partir do convite."),
  clientName: clientLabel,
  level: {
    id: levelId || 0,
    uuid: levelId ? `invitation-level-${levelId}` : "",
    sigla: "INV",
    name: levelName || "",
    description: levelName || "",
    type: "BUSINESS"
  },
  levelId
});

const formatSphereLabel = (
  t: TranslationFunction,
  levelName?: string,
  codeItem?: string
) => {
  if (levelName && codeItem) {
    return `${levelName}: ${codeItem}`;
  }

  return levelName || codeItem || t("Nenhuma esfera vinculada ao convite.");
};

const formatSphereSummary = (
  t: TranslationFunction,
  sphereHierarchy: ItemHierarchyInterface[],
  fallbackLevelName?: string,
  fallbackCodeItem?: string
) => {
  if (sphereHierarchy.length > 0) {
    return sphereHierarchy.map((item) => item.name).join(" / ");
  }

  return formatSphereLabel(t, fallbackLevelName, fallbackCodeItem);
};

const resolveInviteEntities = async (
  t: TranslationFunction,
  clientId: string,
  clientLabel: string,
  roleId: number,
  roleLabel: string,
  description?: string,
  fallbackLevelId?: number,
  fallbackLevelName?: string
) => {
  const fallbackClient = createInviteClient(t, clientId, clientLabel, description);
  const fallbackRole = createInviteRole(
    t,
    roleId,
    roleLabel,
    clientLabel,
    description,
    fallbackLevelId,
    fallbackLevelName
  );

  const [clientResult, roleResult] = await Promise.allSettled([
    clientService.fetchByClientId(clientId),
    roleService.getRoleById(roleId.toString())
  ]);

  return {
    client: clientResult.status === "fulfilled" ? clientResult.value : fallbackClient,
    role: roleResult.status === "fulfilled" ? roleResult.value : fallbackRole
  };
};

const resolveSphereHierarchy = async (
  levelId: number | undefined,
  codeItem?: string
) => {
  if (!levelId || !codeItem) {
    return [];
  }

  try {
    return await levelService.getItemHierarchy(levelId, codeItem);
  } catch {
    return [];
  }
};

export const useMyInviteRequest = () => {
  const { t } = useI18n();
  const { id } = useParams<{ id?: string }>();
  const [invitePreview, setInvitePreview] = useState<InviteRequestPreview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadInviteRequest = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (id) {
        const invitation = await invitationService.getInvitationById(id);
        const invitationUuid = sessionStorage.getItem(STORAGE_KEYS.INVITATION_UUID) || undefined;
        const { client, role } = await resolveInviteEntities(
          t,
          invitation.clientId,
          invitation.clientLabel,
          invitation.roleId,
          invitation.roleLabel,
          invitation.description
        );
        const sphereHierarchy = await resolveSphereHierarchy(role.level?.id || role.levelId, invitation.codeItem);

        setInvitePreview({
          client,
          role,
          reason: invitation.description || t("Solicitação vinculada automaticamente ao convite."),
          codeItem: invitation.codeItem,
          sphereLabel: formatSphereSummary(t, sphereHierarchy, role.level?.name, invitation.codeItem),
          sphereHierarchy,
          invitationUuid,
          expiresAt: invitation.expiresAt,
          title: t("Solicitação de convite"),
          description: t("Os dados abaixo foram carregados a partir do convite selecionado em Meus convites."),
          protocolCode: invitation.protocolCode,
          source: "id"
        });
        return;
      }

      const invitationUuid = sessionStorage.getItem(STORAGE_KEYS.INVITATION_UUID);

      if (!invitationUuid) {
        setInvitePreview(null);
        setErrorMessage(t("Nenhum convite foi encontrado na sua sessão atual."));
        return;
      }

      const invitationContext = await invitationService.getInvitationRequestContext(invitationUuid);
      sessionStorage.setItem(STORAGE_KEYS.INVITATION_UUID, invitationContext.invitationUuid);
      const { client, role } = await resolveInviteEntities(
        t,
        invitationContext.clientId,
        invitationContext.clientLabel,
        invitationContext.roleId,
        invitationContext.roleLabel,
        invitationContext.description,
        invitationContext.levelId,
        invitationContext.levelName
      );
      const sphereHierarchy = await resolveSphereHierarchy(
        role.level?.id || role.levelId || invitationContext.levelId,
        invitationContext.codeItem
      );

      setInvitePreview({
        client,
        role,
        reason: invitationContext.description || t("Solicitação vinculada automaticamente ao convite."),
        codeItem: invitationContext.codeItem,
        sphereLabel: formatSphereSummary(
          t,
          sphereHierarchy,
          invitationContext.levelName,
          invitationContext.codeItem
        ),
        sphereHierarchy,
        invitationUuid: invitationContext.invitationUuid,
        expiresAt: invitationContext.expiresAt,
        title: t("Solicitação de convite"),
        description: t("Os dados abaixo foram carregados a partir do token salvo na sua sessão."),
        source: "token"
      });
    } catch (error: unknown) {
      setInvitePreview(null);
      setErrorMessage(formatErrorMessages(error));
    } finally {
      setIsLoading(false);
    }
  }, [id, t]);

  useEffect(() => {
    void loadInviteRequest();
  }, [loadInviteRequest]);

  return {
    invitePreview,
    isLoading,
    errorMessage
  };
};
