import { ScrollArea } from "@common/external/ui/scroll-area.tsx";
import { motion } from "framer-motion";
import { ErrorFeedback } from "./partials/ErrorFeedbackComponent.tsx";
import { SuccessFeedback } from "./partials/SuccessFeedbackForm.tsx";
import { StepLoader } from "@common/components/loading/StepLoader.tsx";
import { ConfirmRequestDialog } from "./partials/ConfirmRequestDialog.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactNode, useEffect, useState, useCallback } from "react";
import { RoleResponseInterface } from "@features/role/common/types/role.model.ts";
import { ClientResponseInterface } from "@features/client/common/model/client.model.ts";
import useAuthStore from "@store/authStore.ts";
import { useToast } from "@common/external/ui/use-toast.ts";
import { clientService } from "@features/client/common/service/client-service.ts";
import { roleService } from "@features/role/common/service/role-service.ts";
import { requestService } from "../../common/api/request-service.ts";
import { formatErrorMessages } from "@common/utils/error-utils.ts";
import { PRIVATE_ROUTES } from "@common/constants/routes.ts";
import { RequestStepper } from "./components/request-stepper/RequestStepper.tsx";
import { RequestStepLayout } from "./components/request-step-layout/RequestStepLayout.tsx";
import { RequestSystemStep } from "./components/request-system-step/RequestSystemStep.tsx";
import { RequestRoleStep } from "./components/request-role-step/RequestRoleStep.tsx";
import { FileAttachment, RequestJustificationStep } from "./components/request-justification-step/RequestJustificationStep.tsx";
import { RequestReviewStep } from "./components/request-review-step/RequestReviewStep.tsx";
import "./RequestAccess.scss";

export interface BasicFormFieldInterface {
  [key: string]: {
    invalid: boolean;
    error: string | null;
    value: any;
  };
}

export type RequestFormFieldType = "clientId" | "roleId" | "codeItem" | "externalCode" | "reason" | "attachments";

interface RequestStepConfig {
  id: number;
  number: number;
  title: string;
  description: string;
  panelTitle: string;
  content: ReactNode;
}

export default function RequestAccess() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [roles, setRoles] = useState<RoleResponseInterface[]>([]);
  const [clients, setClients] = useState<ClientResponseInterface[]>([]);
  const [showContent, setShowContent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { toast } = useToast();
  const location = useLocation();
  const initialFormState: BasicFormFieldInterface = {
    clientId: { invalid: false, error: "", value: "" },
    roleId: { invalid: false, error: "", value: "" },
    codeItem: { invalid: false, error: "", value: "" },
    externalCode: { invalid: false, error: "", value: "" },
    reason: { invalid: false, error: "", value: "" },
    attachments: { invalid: false, error: "", value: [] }
  };

  const [customForm, setCustomForm] = useState<BasicFormFieldInterface>(initialFormState);

  const setBasicFormFieldValue = useCallback(({ field, value, error }: {
    field: RequestFormFieldType,
    value?: any,
    error: string | null
  }) => {
    setCustomForm((prev) => {
      return {
        ...prev,
        [field]: { ...prev[field], value, error }
      };
    });
  }, [setCustomForm]);

  const clearError = (field: RequestFormFieldType) => {
    setBasicFormFieldValue({ field, value: customForm[field].value, error: null });
  };

  const validationV2 = () => {
    let isValid = true;

    if(currentStep === 1 && !customForm["clientId"].value) {
      setBasicFormFieldValue({ field: "clientId", error: "Selecione um sistema." });
      isValid = false;
    }

    if(currentStep === 2) {
      if(!customForm["roleId"].value) {
        setBasicFormFieldValue({ field: "roleId", error: "Selecione um papel." });
        isValid = false;
      }
      const role = roles.find(role => role.id.toString() === customForm["roleId"].value);
      if((customForm["roleId"].value && role!.level) && !customForm["codeItem"].value) {
        setBasicFormFieldValue({ field: "codeItem", error: "Preencha a hierarquia de esferas." });
        isValid = false;
      }
    }

    if(currentStep === 3) {
      if(!customForm["reason"].value) {
        setBasicFormFieldValue({ field: "reason", error: "Preencha o motivo da solicitação." });
        isValid = false;
      }

      const allConfigurations = clients.find(client => client.clientId === customForm["clientId"].value)?.configurations || [];
      const requiredConfigurations = allConfigurations.filter(config => config.required);
      const attachments = customForm["attachments"].value as FileAttachment[];
      const missingRequiredAttachments = requiredConfigurations.filter(config => {
        const attachment = attachments.find(att => att.key === config.key);
        return !attachment || attachment.files.length === 0;
      });

      if(missingRequiredAttachments.length > 0) {
        setBasicFormFieldValue({
          field: "attachments",
          value: customForm["attachments"].value,
          error: "Anexe todos os arquivos necessários."
        });
        isValid = false;
      }
    }

    if(isValid) {
      setCurrentStep(currentStep + 1);
    } else {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios antes de prosseguir.",
        variant: "destructive"
      });
    }
  };

  const getClients = useCallback(async () => {
    try {
      const fetchedClients = await clientService.getClients();
      setClients(fetchedClients);
    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error);

      toast({
        title: "Erro ao carregar sistemas",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [toast]);

  const getRolesByClientId = useCallback(async (clientId: string) => {
    try {
      const fetchedRoles = await roleService.getRolesByClientId(clientId, true);
      setRoles(fetchedRoles);
    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error);

      toast({
        title: "Erro ao carregar papéis",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleSelectRole = useCallback(async (role: RoleResponseInterface) => {
    setBasicFormFieldValue({ field: "roleId", value: role.id.toString(), error: null });
    setBasicFormFieldValue({ field: "codeItem", value: "", error: null });
    setBasicFormFieldValue({ field: "externalCode", value: "", error: null });

    try {
      const roleWithDetails = await roleService.getRoleById(role.id.toString());
      setRoles((prevRoles) => prevRoles.map((item) => (
        item.id === roleWithDetails.id ? roleWithDetails : item
      )));
    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error);
      toast({
        title: "Erro ao carregar detalhes do papel",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [setBasicFormFieldValue, toast]);

  const handlerSelectedClient = useCallback((client: ClientResponseInterface, autoAdvance: boolean = false) => {
    setBasicFormFieldValue({ field: "clientId", value: client.clientId, error: null });
    setBasicFormFieldValue({ field: "roleId", value: "", error: null });
    setBasicFormFieldValue({ field: "codeItem", value: "", error: null });
    setBasicFormFieldValue({ field: "externalCode", value: "", error: null });
    setBasicFormFieldValue({ field: "reason", value: "", error: null });
    setBasicFormFieldValue({ field: "attachments", value: [], error: null });

    if (autoAdvance) {
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }

    getRolesByClientId(client.clientId);
  }, [setBasicFormFieldValue, setCurrentStep, getRolesByClientId]);

  const init = useCallback(() => {
    if(isAuthenticated) {
      void getClients();
      const client = location.state;
      if(client) {
        handlerSelectedClient(client, true);
      }
    }
  }, [isAuthenticated, getClients, location.state, handlerSelectedClient]);

  useEffect(() => {
    init();
  }, [init]);

  const steps: RequestStepConfig[] = [
    {
      id: 1,
      title: "Sistema",
      number: 1,
      description: "Para qual sistema você precisa de acesso",
      panelTitle: "Escolha o sistema que você precisa de acesso:",
      content: (
        <RequestSystemStep
          clients={clients}
          selectedClientId={customForm["clientId"].value || null}
          errorMessage={customForm["clientId"].error}
          onSelectClient={(client) => handlerSelectedClient(client)}
        />
      )
    },
    {
      id: 2,
      title: "Papel",
      number: 2,
      description: "Qual seria seu papel?",
      panelTitle: "Escolha o tipo de acesso que você precisa:",
      content: (
        <RequestRoleStep
          roles={roles}
          selectedRoleId={customForm["roleId"].value || null}
          roleError={customForm["roleId"].error}
          currentCodeItem={customForm["codeItem"].value}
          codeItemError={!!customForm["codeItem"].error}
          onSelectRole={handleSelectRole}
          onSelectSphere={(codeItem, externalCode) => {
            if(codeItem) {
              setBasicFormFieldValue({ field: "codeItem", value: codeItem, error: null });
              setBasicFormFieldValue({ field: "externalCode", value: externalCode || "", error: null });
            } else {
              setBasicFormFieldValue({ field: "codeItem", error: "Preencha a hierarquia de esferas." });
              setBasicFormFieldValue({ field: "externalCode", value: "", error: null });
            }
          }}
          onClearSphereError={() => {
            clearError("codeItem");
          }}
        />
      )
    },
    {
      id: 3,
      title: "Justificativa",
      number: 3,
      description: "Por que você precisa desse acesso",
      panelTitle: "Descreva a justificativa para este acesso:",
      content: (
        <RequestJustificationStep
          onAttach={(attachments: FileAttachment[]) => {
            setBasicFormFieldValue({ field: "attachments", value: attachments, error: null });
          }}
          onReasonChange={(reason: string) => {
            setBasicFormFieldValue({ field: "reason", value: reason, error: null });
          }}
          initialAttachments={customForm["attachments"].value}
          initialReason={customForm["reason"].value}
          requiredAttachments={clients.find(client => client.clientId === customForm["clientId"].value)?.configurations || []}
          hasError={{
            attachments: !!customForm["attachments"].error,
            reason: !!customForm["reason"].error
          }}
        />
      )
    },
    {
      id: 4,
      title: "Revisão",
      number: 4,
      description: "Confira os detalhes antes de enviar.",
      panelTitle: "Revise as informações antes de enviar:",
      content: (
        <RequestReviewStep
          selectedClient={customForm["clientId"].value}
          selectedRole={customForm["roleId"].value}
          reason={customForm["reason"].value}
          roles={roles}
          attachments={customForm["attachments"].value}
        />
      )
    }
  ];

  const handleFinalSubmit = async () => {
    setIsConfirmModalOpen(true);
  };

  const handleSubmitForm = async () => {
    setIsConfirmModalOpen(false);
    setLoading(true);
    setHasError(false);

    try {
      const payloadFormData = new FormData();
      const request = {
        clientId: customForm["clientId"].value,
        roleId: Number(customForm["roleId"].value),
        ...(customForm["externalCode"].value ?
          { codeItem: customForm["externalCode"].value } :
          customForm["codeItem"].value && { codeItem: customForm["codeItem"].value }
        ),
        description: customForm["reason"].value
      };

      payloadFormData.append("request", JSON.stringify(request));
      customForm["attachments"].value.forEach((att: FileAttachment) => {
        att.files.forEach(file => {
          payloadFormData.append(att.key, file);
        });
      });

      await requestService.createRequest(payloadFormData);

      toast({ title: "Solicitação enviada com sucesso!", description: "Sua solicitação foi processada." });
      navigate(PRIVATE_ROUTES.MY_ACCESS_REQUESTS);
      setShowContent(false);
    } catch (error: unknown) {
      const errorMessage: string = formatErrorMessages(error);

      toast({
        title: "Erro ao processar solicitação de acesso",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewRequest = () => {
    setCustomForm(initialFormState);
    setCurrentStep(1);
  };

  const handleLoaderClose = () => {
    setLoading(false);
  };

  const goToNextStep = () => {
    validationV2();
  };

  const handleBack = () => {
    if(currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
    }
  };

  return (
    <motion.div
      className="request-access"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}
    >
      <ScrollArea className="request-access__scroll-area" viewportClassName="request-access__scroll-viewport">
        <div className="request-access__content">
          {showContent && !hasError && (
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

              <div className="request-access__step-content">
                <RequestStepLayout
                  title={steps[currentStep - 1].panelTitle}
                  onBack={handleBack}
                  onNext={currentStep < steps.length ? goToNextStep : handleFinalSubmit}
                  backButtonDisabled={currentStep === 1}
                  nextButtonLabel={currentStep < steps.length ? "Próximo" : "Enviar"}
                  showNextIcon={currentStep < steps.length}
                >
                  {steps[currentStep - 1].content}
                </RequestStepLayout>
              </div>
            </motion.div>
          )}

          {hasError && (
            <ErrorFeedback words={["Tente novamente.", "Vamos tentar de novo!"]} onRetry={handleNewRequest} />)}

          {!showContent && !hasError && (
            <SuccessFeedback
              words={["com sucesso.", "rapidamente."]}
              selectedClient={customForm["clientId"].value}
              selectedRole={roles.find(role => role.id.toString() === customForm["roleId"].value)?.name || ""}
              description={customForm["reason"].value}
              attachments={customForm["attachments"].value}
              onRequestNew={handleNewRequest}
            />
          )}

          <StepLoader loading={loading} onClose={handleLoaderClose} />

          <ConfirmRequestDialog
            isOpen={isConfirmModalOpen}
            onOpenChange={setIsConfirmModalOpen}
            reason={customForm["reason"].value}
            clientId={customForm["clientId"].value}
            roleLabel={roles.find(role => role.id.toString() === customForm["roleId"].value)?.label || ""}
            attachments={customForm["attachments"].value}
            onConfirm={handleSubmitForm}
          />
        </div>
      </ScrollArea>
    </motion.div>
  );
}
