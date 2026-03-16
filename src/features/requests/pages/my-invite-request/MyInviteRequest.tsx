import { ScrollArea } from "@common/external/ui/scroll-area.tsx";
import { useToast } from "@common/external/ui/use-toast.ts";
import { RequestJustificationStep } from "../../common/components/request-justification-step/RequestJustificationStep.tsx";
import { RequestReviewStep } from "../../common/components/request-review-step/RequestReviewStep.tsx";
import { RequestRoleStep } from "../../common/components/request-role-step/RequestRoleStep.tsx";
import { RequestStepLayout } from "../../common/components/request-step-layout/RequestStepLayout.tsx";
import { RequestStepper } from "../../common/components/request-stepper/RequestStepper.tsx";
import { RequestSystemStep } from "../../common/components/request-system-step/RequestSystemStep.tsx";
import { FileAttachment, RequestStepItem } from "../../common/types/access-request.model.ts";
import { ClientResponseInterface } from "@features/client/common/model/client.model.ts";
import { RoleResponseInterface } from "@features/role/common/types/role.model.ts";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "./my-invite-request.scss";

const createLockedInvitePreview = (token?: string) => {
  const tokenSuffix = token?.slice(-6).toUpperCase() || "TOKEN";

  const client: ClientResponseInterface = {
    id: 1,
    label: "Sistema convidado",
    clientId: `invite-${tokenSuffix.toLowerCase()}`,
    clientUUID: `invite-${tokenSuffix}`,
    managed: true,
    name: "Sistema do convite",
    description: "A seleção do sistema será preenchida pelo token do convite.",
    configurations: [],
    allowedItemsHierarchy: []
  };

  const role: RoleResponseInterface = {
    id: 1,
    roleExternalId: `role-${tokenSuffix}`,
    name: "invited-role",
    label: "Papel do convite",
    icon: "shield",
    description: "O papel será carregado a partir do vínculo do convite.",
    clientName: client.name || client.clientId,
    level: {
      id: 0,
      uuid: `level-${tokenSuffix}`,
      sigla: "INV",
      name: "Esfera do convite",
      description: "Esfera previamente selecionada para o convite.",
      type: "BUSINESS"
    }
  };

  return {
    client,
    role,
    sphereLabel: `Esfera pré-selecionada para o convite ${tokenSuffix}`,
    reason: "Motivo da solicitação previamente definido pelo convite.",
    attachments: [] as FileAttachment[]
  };
};

export default function MyInviteRequest() {
  const { token } = useParams();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const invitePreview = useMemo(() => createLockedInvitePreview(token), [token]);

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
        clients={[invitePreview.client]}
        selectedClientId={invitePreview.client.clientId}
        onSelectClient={() => undefined}
        readOnly={true}
      />
    ),
    (
      <RequestRoleStep
        roles={[invitePreview.role]}
        selectedRoleId={invitePreview.role.id.toString()}
        currentCodeItem={invitePreview.sphereLabel}
        onSelectRole={() => undefined}
        onSelectSphere={() => undefined}
        onClearSphereError={() => undefined}
        readOnly={true}
        lockedSphereLabel={invitePreview.sphereLabel}
      />
    ),
    (
      <RequestJustificationStep
        onAttach={setAttachments}
        initialAttachments={attachments}
        initialReason={invitePreview.reason}
        requiredAttachments={[]}
        hasError={{ attachments: false, reason: false }}
        readOnlyReason={true}
      />
    ),
    (
      <RequestReviewStep
        selectedClient={invitePreview.client.name || invitePreview.client.clientId}
        selectedRole={invitePreview.role.id.toString()}
        reason={invitePreview.reason}
        roles={[invitePreview.role]}
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

  return (
    <section className="my-invite-request">
      <ScrollArea className="my-invite-request__scroll-area" viewportClassName="my-invite-request__scroll-viewport">
        <div className="my-invite-request__content">
          <div className="my-invite-request__header">
            <p className="my-invite-request__eyebrow">Convite vinculado ao token</p>
            <h1 className="my-invite-request__title">Meus convites</h1>
            <p className="my-invite-request__description">
              Os dados das etapas abaixo serão preenchidos futuramente pelo token recebido.
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
