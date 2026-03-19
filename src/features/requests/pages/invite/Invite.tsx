import { ScrollArea } from "@common/external/ui/scroll-area.tsx";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactNode, useCallback, useEffect, useState } from "react";

import { StepLoader } from "@common/components/loading/StepLoader.tsx";
import { PRIVATE_ROUTES } from "@common/constants/routes.ts";
import { useToast } from "@common/external/ui/use-toast.ts";
import { formatErrorMessages } from "@common/utils/error-utils.ts";
import { clientService } from "@features/client/common/service/client-service.ts";
import { ClientResponseInterface } from "@features/client/common/model/client.model.ts";
import { roleService } from "@features/role/common/service/role-service.ts";
import { RoleResponseInterface } from "@features/role/common/types/role.model.ts";
import useAuthStore from "@store/authStore.ts";
import { RequestJustificationStep } from "../../common/components/request-justification-step/RequestJustificationStep.tsx";
import { RequestReviewStep } from "../../common/components/request-review-step/RequestReviewStep.tsx";
import { RequestRoleStep } from "../../common/components/request-role-step/RequestRoleStep.tsx";
import { RequestInviteEmailsStep } from "../../common/components/request-invite-emails-step/RequestInviteEmailsStep.tsx";
import { RequestStepLayout } from "../../common/components/request-step-layout/RequestStepLayout.tsx";
import { RequestStepper } from "../../common/components/request-stepper/RequestStepper.tsx";
import { RequestSystemStep } from "../../common/components/request-system-step/RequestSystemStep.tsx";
import { invitationService } from "../../common/api/invitation-service.ts";
import "./invite.scss";

export interface InviteFormFieldInterface {
  [key: string]: {
    invalid: boolean;
    error: string | null;
    value: any;
  };
}

export type InviteFormFieldType =
  | "clientId"
  | "roleId"
  | "codeItem"
  | "externalCode"
  | "reason"
  | "emails"
  | "emailDraft";

interface InviteStepConfig {
  id: number;
  number: number;
  title: string;
  description: string;
  panelTitle: string;
  content: ReactNode;
}

const EMAIL_SPLIT_PATTERN = /[\n,;]+/;
const EMAIL_VALIDATION_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Invite() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [currentStep, setCurrentStep] = useState(1);
  const [roles, setRoles] = useState<RoleResponseInterface[]>([]);
  const [clients, setClients] = useState<ClientResponseInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const initialFormState: InviteFormFieldInterface = {
    clientId: { invalid: false, error: "", value: "" },
    roleId: { invalid: false, error: "", value: "" },
    codeItem: { invalid: false, error: "", value: "" },
    externalCode: { invalid: false, error: "", value: "" },
    reason: { invalid: false, error: "", value: "" },
    emails: { invalid: false, error: "", value: [] },
    emailDraft: { invalid: false, error: "", value: "" }
  };
  const [customForm, setCustomForm] = useState<InviteFormFieldInterface>(initialFormState);

  const setFormFieldValue = useCallback(({
    field,
    value,
    error
  }: {
    field: InviteFormFieldType;
    value?: any;
    error: string | null;
  }) => {
    setCustomForm((prev) => ({
      ...prev,
      [field]: { ...prev[field], value, error }
    }));
  }, []);

  const clearError = (field: InviteFormFieldType) => {
    setFormFieldValue({ field, value: customForm[field].value, error: null });
  };

  const getClients = useCallback(async () => {
    try {
      const fetchedClients = await clientService.getClients();
      setClients(fetchedClients);
    } catch (error: unknown) {
      toast({
        title: "Erro ao carregar sistemas",
        description: formatErrorMessages(error),
        variant: "destructive"
      });
    }
  }, [toast]);

  const getRolesByClientId = useCallback(async (clientId: string) => {
    try {
      const fetchedRoles = await roleService.getRolesByClientId(clientId, true);
      setRoles(fetchedRoles);
    } catch (error: unknown) {
      toast({
        title: "Erro ao carregar papéis",
        description: formatErrorMessages(error),
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleSelectRole = useCallback(async (role: RoleResponseInterface) => {
    setFormFieldValue({ field: "roleId", value: role.id.toString(), error: null });
    setFormFieldValue({ field: "codeItem", value: "", error: null });
    setFormFieldValue({ field: "externalCode", value: "", error: null });

    try {
      const roleWithDetails = await roleService.getRoleById(role.id.toString());
      setRoles((prevRoles) => prevRoles.map((item) => (
        item.id === roleWithDetails.id ? roleWithDetails : item
      )));
    } catch (error: unknown) {
      toast({
        title: "Erro ao carregar detalhes do papel",
        description: formatErrorMessages(error),
        variant: "destructive"
      });
    }
  }, [setFormFieldValue, toast]);

  const handleSelectedSystem = useCallback((client: ClientResponseInterface, autoAdvance: boolean = false) => {
    setFormFieldValue({ field: "clientId", value: client.clientId, error: null });
    setFormFieldValue({ field: "roleId", value: "", error: null });
    setFormFieldValue({ field: "codeItem", value: "", error: null });
    setFormFieldValue({ field: "externalCode", value: "", error: null });
    setFormFieldValue({ field: "reason", value: "", error: null });
    setFormFieldValue({ field: "emails", value: [], error: null });
    setFormFieldValue({ field: "emailDraft", value: "", error: null });

    setCurrentStep(autoAdvance ? 2 : 1);
    void getRolesByClientId(client.clientId);
  }, [getRolesByClientId, setFormFieldValue]);

  const init = useCallback(() => {
    if (!isAuthenticated) {
      return;
    }

    void getClients();

    const selectedClient = location.state as ClientResponseInterface | undefined;
    if (selectedClient) {
      handleSelectedSystem(selectedClient, true);
    }
  }, [getClients, handleSelectedSystem, isAuthenticated, location.state]);

  useEffect(() => {
    init();
  }, [init]);

  const parseEmailDraft = useCallback((draft: string) => {
    return draft
      .split(EMAIL_SPLIT_PATTERN)
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);
  }, []);

  const commitDraftEmails = useCallback(() => {
    const draft = String(customForm["emailDraft"].value || "").trim();
    const currentEmails = customForm["emails"].value as string[];

    if (!draft) {
      return {
        isValid: true,
        nextEmails: currentEmails
      };
    }

    const parsedEmails = parseEmailDraft(draft);
    const invalidEmails = parsedEmails.filter((email) => !EMAIL_VALIDATION_PATTERN.test(email));

    if (invalidEmails.length > 0) {
      setFormFieldValue({
        field: "emails",
        value: currentEmails,
        error: "Informe apenas e-mails válidos para continuar."
      });

      return {
        isValid: false,
        nextEmails: currentEmails
      };
    }

    const uniqueEmails = Array.from(new Set([...currentEmails, ...parsedEmails]));
    setFormFieldValue({ field: "emails", value: uniqueEmails, error: null });
    setFormFieldValue({ field: "emailDraft", value: "", error: null });

    return {
      isValid: true,
      nextEmails: uniqueEmails
    };
  }, [customForm, parseEmailDraft, setFormFieldValue]);

  const validationV2 = () => {
    let isValid = true;

    if (currentStep === 1 && !customForm["clientId"].value) {
      setFormFieldValue({ field: "clientId", value: customForm["clientId"].value, error: "Selecione um sistema." });
      isValid = false;
    }

    if (currentStep === 2) {
      if (!customForm["roleId"].value) {
        setFormFieldValue({ field: "roleId", value: customForm["roleId"].value, error: "Selecione um papel." });
        isValid = false;
      }

      const selectedRole = roles.find((role) => role.id.toString() === customForm["roleId"].value);
      if ((customForm["roleId"].value && selectedRole?.level) && !customForm["codeItem"].value) {
        setFormFieldValue({
          field: "codeItem",
          value: customForm["codeItem"].value,
          error: "Preencha a hierarquia de esferas."
        });
        isValid = false;
      }
    }

    if (currentStep === 3 && !customForm["reason"].value) {
      setFormFieldValue({
        field: "reason",
        value: customForm["reason"].value,
        error: "Preencha o motivo da solicitação."
      });
      isValid = false;
    }

    if (currentStep === 4) {
      const { isValid: hasValidDraft, nextEmails } = commitDraftEmails();

      if (!hasValidDraft || nextEmails.length === 0) {
        setFormFieldValue({
          field: "emails",
          value: nextEmails,
          error: hasValidDraft
            ? "Adicione pelo menos um e-mail para enviar o convite."
            : "Informe apenas e-mails válidos para continuar."
        });
        isValid = false;
      }
    }

    if (isValid) {
      setCurrentStep((prevStep) => prevStep + 1);
      return;
    }

    toast({
      title: "Campos obrigatórios",
      description: "Por favor, preencha todos os campos obrigatórios antes de prosseguir.",
      variant: "destructive"
    });
  };

  const steps: InviteStepConfig[] = [
    {
      id: 1,
      number: 1,
      title: "Sistema",
      description: "Para qual sistema você está enviando o convite",
      panelTitle: "Escolha o sistema vinculado a este convite:",
      content: (
        <RequestSystemStep
          clients={clients}
          selectedClientId={customForm["clientId"].value || null}
          errorMessage={customForm["clientId"].error}
          onSelectClient={(client) => handleSelectedSystem(client)}
        />
      )
    },
    {
      id: 2,
      number: 2,
      title: "Papel",
      description: "Defina o papel que será concedido",
      panelTitle: "Escolha o papel que será enviado no convite:",
      content: (
        <RequestRoleStep
          roles={roles}
          selectedRoleId={customForm["roleId"].value || null}
          roleError={customForm["roleId"].error}
          currentCodeItem={customForm["codeItem"].value}
          codeItemError={!!customForm["codeItem"].error}
          onSelectRole={handleSelectRole}
          onSelectSphere={(codeItem, externalCode) => {
            if (codeItem) {
              setFormFieldValue({ field: "codeItem", value: codeItem, error: null });
              setFormFieldValue({ field: "externalCode", value: externalCode || "", error: null });
              return;
            }

            setFormFieldValue({
              field: "codeItem",
              value: "",
              error: "Preencha a hierarquia de esferas."
            });
            setFormFieldValue({ field: "externalCode", value: "", error: null });
          }}
          onClearSphereError={() => {
            clearError("codeItem");
          }}
        />
      )
    },
    {
      id: 3,
      number: 3,
      title: "Justificativa",
      description: "Explique o motivo do convite",
      panelTitle: "Descreva a justificativa deste convite:",
      content: (
        <RequestJustificationStep
          onReasonChange={(reason: string) => {
            setFormFieldValue({ field: "reason", value: reason, error: null });
          }}
          initialReason={customForm["reason"].value}
          hasError={{
            reason: !!customForm["reason"].error
          }}
        />
      )
    },
    {
      id: 4,
      number: 4,
      title: "E-mails",
      description: "Informe os destinatários do convite",
      panelTitle: "Adicione os e-mails que receberão este convite:",
      content: (
        <RequestInviteEmailsStep
          emails={customForm["emails"].value}
          emailDraft={customForm["emailDraft"].value}
          errorMessage={customForm["emails"].error}
          onDraftChange={(draft) => {
            setFormFieldValue({ field: "emailDraft", value: draft, error: null });
            if (customForm["emails"].error) {
              setFormFieldValue({ field: "emails", value: customForm["emails"].value, error: null });
            }
          }}
          onAddDraftEmails={() => {
            commitDraftEmails();
          }}
          onRemoveEmail={(email) => {
            const nextEmails = (customForm["emails"].value as string[]).filter((item) => item !== email);
            setFormFieldValue({ field: "emails", value: nextEmails, error: null });
          }}
        />
      )
    },
    {
      id: 5,
      number: 5,
      title: "Revisão",
      description: "Confira os dados do convite antes de enviar",
      panelTitle: "Revise as informações antes de enviar:",
      content: (
        <RequestReviewStep
          selectedClient={customForm["clientId"].value}
          selectedRole={customForm["roleId"].value}
          reason={customForm["reason"].value}
          roles={roles}
          attachments={[]}
          emails={customForm["emails"].value}
        />
      )
    }
  ];

  const handleSubmitForm = async () => {
    setLoading(true);

    try {
      await invitationService.createInvitation({
        emails: customForm["emails"].value,
        roleId: Number(customForm["roleId"].value),
        codeItem: customForm["externalCode"].value || customForm["codeItem"].value || "",
        description: customForm["reason"].value
      });

      toast({
        title: "Convite enviado com sucesso!",
        description: "Os destinatários informados já podem receber o convite."
      });

      navigate(PRIVATE_ROUTES.MANAGE_INVITES);
    } catch (error: unknown) {
      toast({
        title: "Erro ao enviar convite",
        description: formatErrorMessages(error),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoaderClose = () => {
    setLoading(false);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  return (
    <motion.div
      className="invite-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}
    >
      <ScrollArea className="invite-page__scroll-area" viewportClassName="invite-page__scroll-viewport">
        <div className="invite-page__content">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.3, delay: 0.3, ease: "easeInOut" }
            }}
          >
            <RequestStepper
              currentStep={currentStep}
              steps={steps.map((step) => ({
                id: step.id,
                number: step.number,
                title: step.title,
                description: step.description
              }))}
            />

            <div className="invite-page__step-content">
              <RequestStepLayout
                title={steps[currentStep - 1].panelTitle}
                onBack={handleBack}
                onNext={currentStep < steps.length ? validationV2 : handleSubmitForm}
                backButtonDisabled={currentStep === 1}
                nextButtonLabel={currentStep < steps.length ? "Próximo" : "Enviar convite"}
                showNextIcon={currentStep < steps.length}
              >
                {steps[currentStep - 1].content}
              </RequestStepLayout>
            </div>
          </motion.div>

          <StepLoader loading={loading} onClose={handleLoaderClose} />
        </div>
      </ScrollArea>
    </motion.div>
  );
}
