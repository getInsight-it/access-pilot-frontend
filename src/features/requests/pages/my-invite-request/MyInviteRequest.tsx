import { ScrollArea } from "@common/external/ui/scroll-area.tsx";
import { useToast } from "@common/external/ui/use-toast.ts";
import { ContentLoader } from "@common/components/ContentLoader.tsx";
import { StepLoader } from "@common/components/loading/StepLoader.tsx";
import { PRIVATE_ROUTES } from "@common/constants/routes.ts";
import { STORAGE_KEYS } from "@common/constants/storage.ts";
import { formatErrorMessages } from "@common/utils/error-utils.ts";
import { CalendarDays, Clock3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@common/context/i18n/I18nContext.tsx";
import { RequestJustificationStep } from "../../common/components/request-justification-step/RequestJustificationStep.tsx";
import { RequestReviewStep } from "../../common/components/request-review-step/RequestReviewStep.tsx";
import { RequestRoleStep } from "../../common/components/request-role-step/RequestRoleStep.tsx";
import { RequestStepLayout } from "../../common/components/request-step-layout/RequestStepLayout.tsx";
import { RequestStepper } from "../../common/components/request-stepper/RequestStepper.tsx";
import { RequestSystemStep } from "../../common/components/request-system-step/RequestSystemStep.tsx";
import { FileAttachment, RequestStepItem } from "../../common/types/access-request.model.ts";
import { useState } from "react";
import { requestService } from "../../common/api/request-service.ts";
import { useMyInviteRequest } from "./useMyInviteRequest.ts";
import "./my-invite-request.scss";

const getInviteExpirationDetails = (language: string, expiresAt?: string) => {
  if (!expiresAt) {
    return null;
  }

  const expirationDate = new Date(expiresAt);

  if (Number.isNaN(expirationDate.getTime())) {
    return null;
  }

  return {
    date: new Intl.DateTimeFormat(language, {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }).format(expirationDate),
    time: new Intl.DateTimeFormat(language, {
      hour: "2-digit",
      minute: "2-digit"
    }).format(expirationDate)
  };
};

export default function MyInviteRequest() {
  const { t, language } = useI18n();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(4);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    invitePreview,
    isLoading,
    errorMessage
  } = useMyInviteRequest();
  const expirationDetails = getInviteExpirationDetails(language, invitePreview?.expiresAt);

  const steps: RequestStepItem[] = [
    {
      id: 1,
      number: 1,
      title: t("Sistema"),
      description: t("Para qual sistema você precisa de acesso")
    },
    {
      id: 2,
      number: 2,
      title: t("Papel"),
      description: t("Qual seria seu papel?")
    },
    {
      id: 3,
      number: 3,
      title: t("Justificativa"),
      description: t("Por que você precisa desse acesso")
    },
    {
      id: 4,
      number: 4,
      title: t("Revisão"),
      description: t("Confira os detalhes antes de enviar.")
    }
  ];

  const stepContent = [
    (
      <RequestSystemStep
        clients={invitePreview ? [invitePreview.client] : []}
        selectedClientId={invitePreview?.client.clientId || null}
        onSelectClient={() => undefined}
        readOnly={true}
      />
    ),
    (
      <RequestRoleStep
        roles={invitePreview ? [invitePreview.role] : []}
        selectedRoleId={invitePreview?.role.id.toString() || null}
        currentCodeItem={invitePreview?.codeItem || ""}
        onSelectRole={() => undefined}
        onSelectSphere={() => undefined}
        onClearSphereError={() => undefined}
        readOnly={true}
        lockedSphereLabel={invitePreview?.sphereLabel || ""}
        lockedSphereHierarchy={invitePreview?.sphereHierarchy || []}
      />
    ),
    (
      <RequestJustificationStep
        onAttach={setAttachments}
        initialAttachments={attachments}
        initialReason={invitePreview?.reason || ""}
        requiredAttachments={invitePreview?.client.configurations || []}
        hasError={{ attachments: false, reason: false }}
        readOnlyReason={true}
      />
    ),
    (
      <RequestReviewStep
        selectedClient={invitePreview?.client.name || invitePreview?.client.clientId || null}
        selectedRole={invitePreview?.role.id.toString() || null}
        reason={invitePreview?.reason || ""}
        roles={invitePreview ? [invitePreview.role] : []}
        attachments={attachments}
        sphereLabel={invitePreview?.sphereLabel || ""}
        sphereHierarchy={invitePreview?.sphereHierarchy || []}
      />
    )
  ];

  const panelTitles = [
    t("Confira o sistema previamente definido para este convite:"),
    t("Confira o papel definido para este convite:"),
    t("Confira a justificativa vinculada ao convite:"),
    t("Revise as informações antes de aceitar:")
  ];

  const handleSubmit = async () => {
    if (!invitePreview?.invitationUuid) {
      toast({
        title: t("Token do convite não encontrado"),
        description: t("Não foi possível identificar o token do convite para concluir o aceite."),
        variant: "destructive"
      });
      return;
    }

    const requiredAttachments = invitePreview.client.configurations.filter((configuration) => configuration.required);
    const missingRequiredAttachments = requiredAttachments.filter((configuration) => {
      const attachment = attachments.find((item) => item.key === configuration.key);
      return !attachment || attachment.files.length === 0;
    });

    if (missingRequiredAttachments.length > 0) {
      setCurrentStep(3);
      toast({
        title: t("Anexos obrigatórios pendentes"),
        description: t("Inclua todos os anexos exigidos antes de aceitar o convite."),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payloadFormData = new FormData();
      const request = {
        clientId: invitePreview.client.clientId,
        roleId: invitePreview.role.id,
        ...(invitePreview.codeItem ? { codeItem: invitePreview.codeItem } : {}),
        description: invitePreview.reason,
        invitationUuid: invitePreview.invitationUuid
      };

      payloadFormData.append("request", JSON.stringify(request));
      attachments.forEach((attachment) => {
        attachment.files.forEach((file) => {
          payloadFormData.append(attachment.key, file);
        });
      });

      await requestService.createRequest(payloadFormData);
      sessionStorage.removeItem(STORAGE_KEYS.INVITATION_UUID);

      toast({
        title: t("Convite aceito com sucesso!"),
        description: t("A solicitação de acesso foi enviada para processamento.")
      });
      navigate(PRIVATE_ROUTES.MY_ACCESS_REQUESTS);
    } catch (error: unknown) {
      toast({
        title: t("Erro ao aceitar convite"),
        description: formatErrorMessages(error),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((previousStep) => previousStep + 1);
      return;
    }

    void handleSubmit();
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((previousStep) => previousStep - 1);
    }
  };

  if (isLoading) {
    return (
      <section className="my-invite-request">
        <ScrollArea className="my-invite-request__scroll-area" viewportClassName="my-invite-request__scroll-viewport">
          <div className="my-invite-request__content">
            <ContentLoader />
          </div>
        </ScrollArea>
      </section>
    );
  }

  if (!invitePreview) {
    return (
      <section className="my-invite-request">
        <ScrollArea className="my-invite-request__scroll-area" viewportClassName="my-invite-request__scroll-viewport">
          <div className="my-invite-request__content">
            <div className="my-invite-request__status-card my-invite-request__status-card--error" role="alert">
              <h1 className="my-invite-request__status-title">{t("Convite indisponível")}</h1>
              <p className="my-invite-request__status-description">
                {errorMessage || t("Não foi possível carregar os dados do convite.")}
              </p>
            </div>
          </div>
        </ScrollArea>
      </section>
    );
  }

  return (
    <section className="my-invite-request">
      <ScrollArea className="my-invite-request__scroll-area" viewportClassName="my-invite-request__scroll-viewport">
        <div className="my-invite-request__content">
          <div className="my-invite-request__header">
            <h1 className="my-invite-request__title">{invitePreview.title}</h1>
            <p className="my-invite-request__description">
              {invitePreview.description}
            </p>

            {expirationDetails && (
              <div className="my-invite-request__meta" aria-label={t("Validade do convite")}>
                <article className="my-invite-request__meta-card">
                  <CalendarDays className="my-invite-request__meta-icon" />
                  <div className="my-invite-request__meta-content">
                    <span className="my-invite-request__meta-label">{t("Data de expiração")}</span>
                    <span className="my-invite-request__meta-value">{expirationDetails.date}</span>
                  </div>
                </article>

                <article className="my-invite-request__meta-card">
                  <Clock3 className="my-invite-request__meta-icon" />
                  <div className="my-invite-request__meta-content">
                    <span className="my-invite-request__meta-label">{t("Horário limite")}</span>
                    <span className="my-invite-request__meta-value">{expirationDetails.time}</span>
                  </div>
                </article>
              </div>
            )}
          </div>

          <RequestStepper currentStep={currentStep} steps={steps} />

          <div className="my-invite-request__step-content">
            <RequestStepLayout
              title={panelTitles[currentStep - 1]}
              onBack={handleBack}
              onNext={handleNext}
              backButtonDisabled={currentStep === 1}
              nextButtonLabel={currentStep < steps.length ? t("Próximo") : t("Aceitar")}
              showNextIcon={currentStep < steps.length}
            >
              {stepContent[currentStep - 1]}
            </RequestStepLayout>
          </div>
        </div>
      </ScrollArea>

      <StepLoader loading={isSubmitting} onClose={() => setIsSubmitting(false)} />
    </section>
  );
}
