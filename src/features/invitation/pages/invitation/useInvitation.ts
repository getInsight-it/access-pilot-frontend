import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { PUBLIC_ROUTES } from "@constants/routes.ts";
import { STORAGE_KEYS } from "@constants/storage.ts";
import { useToast } from "@ui/use-toast.ts";
import { formatErrorMessages } from "@utils/error-utils.ts";
import { authService } from "@features/auth/common/AuthService.ts";
import {
  InvitationAuthIntentInterface,
  InvitationDetailsInterface,
  InvitationStatus
} from "@features/invitation/common/model/invitation.model.ts";
import { invitationService } from "@features/invitation/common/service/invitation-service.ts";

const VALID_INVITATION_STATUS: InvitationStatus = "VALID";

const isValidInvitationStatus = (status?: InvitationStatus) => status === VALID_INVITATION_STATUS;

const shouldRedirectToLogin = (authIntent: InvitationAuthIntentInterface) =>
  authIntent.nextStep === "REDIRECT_TO_LOGIN";

const shouldRedirectToRegistration = (authIntent: InvitationAuthIntentInterface) =>
  authIntent.nextStep.includes("REGISTER");

const getInvitationRedirectUri = (invitationUuid: string) => {
  const invitationUrl = new URL(PUBLIC_ROUTES.INVITATION, window.location.origin);
  invitationUrl.searchParams.set("token", invitationUuid);
  return invitationUrl.toString();
};

const formatInvitationExpiry = (expiresAt?: string) => {
  if (!expiresAt) {
    return "Considere somente mensagens recebidas pelos canais oficiais da sua organização.";
  }

  const date = new Date(expiresAt);

  if (Number.isNaN(date.getTime())) {
    return "Considere somente mensagens recebidas pelos canais oficiais da sua organização.";
  }

  return `Este convite expira em ${new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(date)}. Se você não reconhece esta organização, pode ignorar este e-mail.`;
};

export const useInvitation = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [invitation, setInvitation] = useState<InvitationDetailsInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const invitationUuid = searchParams.get("token") ?? searchParams.get("invitationUuid");

  const loadInvitation = useCallback(async () => {
    if (!invitationUuid) {
      setInvitation(null);
      setErrorMessage("Convite inválido. O token não foi informado.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await invitationService.getInvitationDetails(invitationUuid);

      if (!isValidInvitationStatus(response.status)) {
        setInvitation(response);
        setErrorMessage("Este convite não está mais disponível.");
        return;
      }

      setInvitation(response);
    } catch (error: unknown) {
      setInvitation(null);
      setErrorMessage(formatErrorMessages(error));
    } finally {
      setIsLoading(false);
    }
  }, [invitationUuid]);

  useEffect(() => {
    void loadInvitation();
  }, [loadInvitation]);

  const handleAcceptInvitation = useCallback(async () => {
    if (!invitationUuid) {
      setErrorMessage("Convite inválido. O token não foi informado.");
      return;
    }

    try {
      setIsSubmitting(true);

      const authIntent = await invitationService.getInvitationAuthIntent(invitationUuid);

      if (!isValidInvitationStatus(authIntent.status)) {
        setErrorMessage("Este convite não está mais disponível.");
        return;
      }

      sessionStorage.setItem(STORAGE_KEYS.INVITATION_UUID, authIntent.invitationUuid);

      const redirectUri = getInvitationRedirectUri(authIntent.invitationUuid);

      if (shouldRedirectToLogin(authIntent)) {
        await authService.signIn(redirectUri);
        return;
      }

      if (shouldRedirectToRegistration(authIntent)) {
        await authService.register(redirectUri);
        return;
      }

      throw new Error("Fluxo de autenticação do convite não suportado.");
    } catch (error: unknown) {
      const formattedError = formatErrorMessages(error);
      setErrorMessage(formattedError);
      toast({
        title: "Erro ao aceitar convite",
        description: formattedError,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [toast, invitationUuid]);

  const clientLabel = invitation?.client.label || invitation?.client.name || "-";
  const roleLabel = invitation?.role.label || invitation?.role.name || "-";
  const footerMessage = useMemo(
    () => formatInvitationExpiry(invitation?.expiresAt),
    [invitation?.expiresAt]
  );

  return {
    invitationUuid,
    invitation,
    clientLabel,
    roleLabel,
    footerMessage,
    isLoading,
    isSubmitting,
    errorMessage,
    isValidInvitation: Boolean(invitation && isValidInvitationStatus(invitation.status) && invitationUuid),
    handleAcceptInvitation
  };
};
