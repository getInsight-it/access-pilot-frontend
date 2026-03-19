import { ScrollArea } from "@common/external/ui/scroll-area.tsx";
import { useToast } from "@common/external/ui/use-toast.ts";
import { ContentLoader } from "@common/components/ContentLoader.tsx";
import { RequestJustificationStep } from "../../common/components/request-justification-step/RequestJustificationStep.tsx";
import { RequestReviewStep } from "../../common/components/request-review-step/RequestReviewStep.tsx";
import { RequestRoleStep } from "../../common/components/request-role-step/RequestRoleStep.tsx";
import { RequestStepLayout } from "../../common/components/request-step-layout/RequestStepLayout.tsx";
import { RequestStepper } from "../../common/components/request-stepper/RequestStepper.tsx";
import { RequestSystemStep } from "../../common/components/request-system-step/RequestSystemStep.tsx";
import { FileAttachment, RequestStepItem } from "../../common/types/access-request.model.ts";
import { useState } from "react";
import { useMyInviteRequest } from "./useMyInviteRequest.ts";
import "./my-invite-request.scss";

export default function MyInviteRequest() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const {
    invitePreview,
    isLoading,
    errorMessage
  } = useMyInviteRequest();

  const steps: RequestStepItem[] = [
    {
      id: 1,
      number: 1,
      title: "Sistema",
      description: "Para qual sistema você precisa de acesso"
    },
    {
      id: 2,
      number: 2,
      title: "Papel",
      description: "Qual seria seu papel?"
    },
    {
      id: 3,
      number: 3,
      title: "Justificativa",
      description: "Por que você precisa desse acesso"
    },
    {
      id: 4,
      number: 4,
      title: "Revisão",
      description: "Confira os detalhes antes de enviar."
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
        currentCodeItem={invitePreview?.sphereLabel || ""}
        onSelectRole={() => undefined}
        onSelectSphere={() => undefined}
        onClearSphereError={() => undefined}
        readOnly={true}
        lockedSphereLabel={invitePreview?.sphereLabel || ""}
      />
    ),
    (
      <RequestJustificationStep
        onAttach={setAttachments}
        initialAttachments={attachments}
        initialReason={invitePreview?.reason || ""}
        requiredAttachments={[]}
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
      />
    )
  ];

  const panelTitles = [
    "Confira o sistema previamente definido para este convite:",
    "Confira o papel definido para este convite:",
    "Confira a justificativa vinculada ao convite:",
    "Revise as informações antes de aceitar:"
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((previousStep) => previousStep + 1);
      return;
    }

    toast({
      title: "Integração pendente",
      description: "O envio do aceite do convite será conectado quando o backend estiver disponível."
    });
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
              <h1 className="my-invite-request__status-title">Convite indisponível</h1>
              <p className="my-invite-request__status-description">
                {errorMessage || "Não foi possível carregar os dados do convite."}
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
            <p className="my-invite-request__eyebrow">{invitePreview.eyebrow}</p>
            <h1 className="my-invite-request__title">{invitePreview.title}</h1>
            <p className="my-invite-request__description">
              {invitePreview.description}
            </p>
          </div>

          <RequestStepper currentStep={currentStep} steps={steps} />

          <div className="my-invite-request__step-content">
            <RequestStepLayout
              title={panelTitles[currentStep - 1]}
              onBack={handleBack}
              onNext={handleNext}
              backButtonDisabled={currentStep === 1}
              nextButtonLabel={currentStep < steps.length ? "Próximo" : "Aceitar convite"}
              showNextIcon={currentStep < steps.length}
            >
              {stepContent[currentStep - 1]}
            </RequestStepLayout>
          </div>
        </div>
      </ScrollArea>
    </section>
  );
}
