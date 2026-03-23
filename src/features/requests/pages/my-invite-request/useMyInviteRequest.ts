import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { STORAGE_KEYS } from "@constants/storage.ts";
import { formatErrorMessages } from "@common/utils/error-utils.ts";
import { ClientResponseInterface } from "@features/client/common/model/client.model.ts";
import { RoleResponseInterface } from "@features/role/common/types/role.model.ts";
import { invitationService } from "../../common/api/invitation-service.ts";
import {
  InvitationDetailsInterface,
  InvitationRequestContextInterface
} from "../../common/types/invitation.model.ts";

type InviteRequestSource = "token" | "id";

interface InviteRequestPreview {
  client: ClientResponseInterface;
  role: RoleResponseInterface;
  reason: string;
  sphereLabel: string;
  expiresAt?: string;
  title: string;
  description: string;
  protocolCode?: string;
  source: InviteRequestSource;
}

const createInviteClient = (
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
  description: description || "Os dados deste sistema foram vinculados diretamente ao convite.",
  configurations: [],
  allowedItemsHierarchy: []
});

const createInviteRole = (
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
  description: description || "O papel foi preenchido automaticamente a partir do convite.",
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

const formatSphereLabel = (levelName?: string, codeItem?: string) => {
  if (levelName && codeItem) {
    return `${levelName}: ${codeItem}`;
  }

  return levelName || codeItem || "Nenhuma esfera vinculada ao convite.";
};

const mapTokenContextToPreview = (
  invitationContext: InvitationRequestContextInterface
): InviteRequestPreview => ({
  client: createInviteClient(
    invitationContext.clientId,
    invitationContext.clientLabel,
    invitationContext.description
  ),
  role: createInviteRole(
    invitationContext.roleId,
    invitationContext.roleLabel,
    invitationContext.clientLabel,
    invitationContext.description,
    invitationContext.levelId,
    invitationContext.levelName
  ),
  reason: invitationContext.description || "Solicitação vinculada automaticamente ao convite.",
  sphereLabel: formatSphereLabel(invitationContext.levelName, invitationContext.codeItem),
  expiresAt: invitationContext.expiresAt,
  title: "Solicitação de convite",
  description: "Os dados abaixo foram carregados a partir do token salvo na sua sessão.",
  source: "token"
});

const mapInvitationToPreview = (invitation: InvitationDetailsInterface): InviteRequestPreview => ({
  client: createInviteClient(invitation.clientId, invitation.clientLabel, invitation.description),
  role: createInviteRole(
    invitation.roleId,
    invitation.roleLabel,
    invitation.clientLabel,
    invitation.description
  ),
  reason: invitation.description || "Solicitação vinculada automaticamente ao convite.",
  sphereLabel: formatSphereLabel(undefined, invitation.codeItem),
  expiresAt: invitation.expiresAt,
  title: "Solicitação de convite",
  description: "Os dados abaixo foram carregados a partir do convite selecionado em Meus convites.",
  protocolCode: invitation.protocolCode,
  source: "id"
});

export const useMyInviteRequest = () => {
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
        setInvitePreview(mapInvitationToPreview(invitation));
        return;
      }

      const invitationToken = sessionStorage.getItem(STORAGE_KEYS.INVITATION_TOKEN);

      if (!invitationToken) {
        setInvitePreview(null);
        setErrorMessage("Nenhum convite foi encontrado na sua sessão atual.");
        return;
      }

      const invitationContext = await invitationService.getInvitationRequestContext(invitationToken);
      sessionStorage.setItem(STORAGE_KEYS.INVITATION_TOKEN, invitationContext.invitationToken);
      setInvitePreview(mapTokenContextToPreview(invitationContext));
    } catch (error: unknown) {
      setInvitePreview(null);
      setErrorMessage(formatErrorMessages(error));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadInviteRequest();
  }, [loadInviteRequest]);

  return {
    invitePreview,
    isLoading,
    errorMessage
  };
};
