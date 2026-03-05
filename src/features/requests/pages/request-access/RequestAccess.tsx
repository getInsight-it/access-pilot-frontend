import { ScrollArea } from "../../../../common/external/ui/scroll-area.tsx";
import { HeaderContainer, Heading } from "@common/components/heading/heading.tsx";
import { motion } from "framer-motion";
import { cn } from "../../../../config/lib/utils.ts";
import { Check } from "lucide-react";
import { AutoHeight } from "../../../../common/components/AutoHeigth.tsx";
import { CardContent, CardFooter, CardHeader, CardTitle } from "../../../../common/external/ui/card.tsx";
import { Button } from "../../../../common/external/ui/button.tsx";
import { ErrorFeedback } from "./partials/ErrorFeedbackComponent.tsx";
import { SuccessFeedback } from "./partials/SuccessFeedbackForm.tsx";
import { StepLoader } from "../../../../common/components/loading/StepLoader.tsx";
import { ConfirmRequestDialog } from "./partials/ConfirmRequestDialog.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { RoleResponseInterface } from "../../../role/common/types/role.model.ts";
import { ClientResponseInterface } from "../../../client/common/model/client.model.ts";
import useAuthStore from "../../../../store/authStore.ts";
import { useToast } from "../../../../common/external/ui/use-toast.ts";
import { clientService } from "../../../client/common/service/client-service.ts";
import { roleService } from "../../../role/common/service/role-service.ts";
import useWindowSize from "../../../../common/hooks/use-window-size.ts";
import { ClientStep } from "./partials/ClientSelectionStep.tsx";
import { RoleStep } from "./partials/RoleSelectionStep.tsx";
import AttachmentStep, { FileAttachment } from "./partials/AttachmentStep.tsx";
import { DetailsStep } from "./partials/DetailsStep.tsx";
import { requestService } from "../../common/api/request-service.ts";
import { Separator } from "../../../../common/external/ui/separator.tsx";
import { formatErrorMessages } from "../../../../common/utils/error-utils.ts";
import { PRIVATE_ROUTES } from "../../../../common/constants/routes.ts";

export interface BasicFormFieldInterface {
  [key: string]: {
    invalid: boolean;
    error: string | null;
    value: any;
  };
}

export type RequestFormFieldType = "clientId" | "roleId" | "codeItem" | "externalCode" | "reason" | "attachments";

export default function RequestAccess() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [roles, setRoles] = useState<RoleResponseInterface[]>([]);
  const [clients, setClients] = useState<ClientResponseInterface[]>([]);
  const [showContent, setShowContent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [stepsState, setStepsState] = useState<Record<number, "pending" | "completed" | "error">>({
    1: "pending",
    2: "pending",
    3: "pending",
    4: "pending"
  });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
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
      const currentStepAux = currentStep;
      setCurrentStep(currentStep + 1);
      setStepsState((prevState) => {
        const newState = { ...prevState };
        newState[currentStepAux] = "completed";
        return newState;
      });
    } else {
      toast({
        title: "Campos obrigatórios",
        description: `Por favor, preencha todos os campos obrigatórios antes de prosseguir.`,
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

  const handlerSelectedClient = useCallback((client: ClientResponseInterface, autoAdvance: boolean = false) => {
    setBasicFormFieldValue({ field: "clientId", value: client.clientId, error: null });
    setBasicFormFieldValue({ field: "roleId", value: "", error: null });
    setBasicFormFieldValue({ field: "codeItem", value: "", error: null });
    setBasicFormFieldValue({ field: "externalCode", value: "", error: null });
    setBasicFormFieldValue({ field: "reason", value: "", error: null });
    setBasicFormFieldValue({ field: "attachments", value: [], error: null });

    if (autoAdvance) {
      setStepsState({ 1: "completed", 2: "pending", 3: "pending", 4: "pending" });
      setCurrentStep(2);
    } else {
      setStepsState({ 1: "pending", 2: "pending", 3: "pending", 4: "pending" });
      setCurrentStep(1);
    }

    getRolesByClientId(client.clientId);
  }, [setBasicFormFieldValue, setStepsState, setCurrentStep, getRolesByClientId]);

  const init = useCallback(() => {
    if(isAuthenticated) {
      getClients();
      const client = location.state;
      if(client) {
        handlerSelectedClient(client, true);
      }
    }
  }, [isAuthenticated, getClients, location.state, handlerSelectedClient]);

  useEffect(() => {
    init();
  }, [init]);

  const { width } = useWindowSize();
  const isLargeScreen = width >= 1024;

  const steps = [
    {
      id: 1,
      title: "Para qual sistema você quer acesso?",
      number: 1,
      description: "Escolha o sistema que você quer se conectar.",
      content: (
        <ClientStep
          form={customForm}
          clients={clients}
          selectedClient={customForm["clientId"].value}
          handlerSelectedClient={handlerSelectedClient}
          isLargeScreen={isLargeScreen}
          isFormSubmitted={isFormSubmitted}
        />
      )
    },
    {
      id: 2,
      title: "Qual será o seu papel?",
      number: 2,
      description: "Escolha como você irá usar o sistema.",
      content: (
        <RoleStep
          form={customForm}
          roles={roles}
          handlerSelectedRole={(role) => {
            setBasicFormFieldValue({ field: "roleId", value: role.id.toString(), error: null });
          }}
          handlerSelectedSphere={(codeItem, externalCode) => {
            if(codeItem) {
              setBasicFormFieldValue({ field: "codeItem", value: codeItem, error: null });
              setBasicFormFieldValue({ field: "externalCode", value: externalCode || "", error: null });
            } else {
              setBasicFormFieldValue({ field: "codeItem", error: "Preencha a hierarquia de esferas." });
              setBasicFormFieldValue({ field: "externalCode", value: "", error: null });
            }
          }}
          handlerClearSphereHierarchyError={() => {
            clearError("codeItem");
          }}
          isLargeScreen={isLargeScreen}
          isFormSubmitted={isFormSubmitted}
          selectedRole={null}
          selectedClientId={customForm["clientId"].value}
        />
      )
    },
    {
      id: 3,
      title: "Por que você precisa desse acesso?",
      number: 3,
      description: "Nos ajude a entender o porquê deste acesso.",
      content: (
        <AttachmentStep
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
        >
        </AttachmentStep>
      )
    },
    {
      id: 4,
      title: "Confira os detalhes antes de enviar!",
      number: 4,
      description: "Certifique-se de que está tudo certo antes de enviar.",
      content: (
        <DetailsStep
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
    setIsFormSubmitted(true);
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
    setStepsState({ 1: "pending", 2: "pending", 3: "pending", 4: "pending" });
    setIsFormSubmitted(false);
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}>

      <div>
        <HeaderContainer>
          <div>
            <Heading
              title="Solicitar acesso"
              description="Preencha o formulário e solicite o acesso a um sistema."
            />
          </div>
        </HeaderContainer>
      </div>

      <ScrollArea>
        <div className="max-w-content-container">
          <div>
            {showContent && !hasError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.3, delay: 0.3, ease: "easeInOut" }
                }}>

                <div>
                  {steps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={false}
                      animate={{
                        opacity: step.id <= currentStep ? 1 : 0.5,
                        transition: { duration: 0.3, ease: "easeInOut" }
                      }}>
                      <motion.div
                        initial={{ opacity: 0, x: -500 }}
                        animate={{
                          scale: step.id === currentStep ? 1.1 : 1,
                          transition: { duration: 0.3, ease: "easeOut", delay: 0.3 },
                          opacity: 1, x: 0
                        }}>
                        <motion.span
                          key={step.number}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}>
                          {stepsState[step.id] === "completed" ? (
                            <Check />
                          ) : (
                            <span>{step.number}</span>
                          )}
                        </motion.span>
                      </motion.div>

                      <div>
                        <h3>
                          {step.title}
                        </h3>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: -100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 2.8 }}>
                      </motion.div>

                      {index < steps.length - 1 && (
                        <motion.div
                          initial={{ backgroundColor: "var(--color-primary-500)", y: -500 }}
                          animate={{
                            backgroundColor: stepsState[step.id] === "completed" ? "var(--color-primary-500)" : "var(--color-gray-200)",
                            opacity: step.id < currentStep ? 1 : 0,
                            y: 0
                          }}
                          transition={{ duration: 0.3, delay: 0.5 }}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>

                <AutoHeight>
                  <CardHeader>
                    <CardTitle>
                      Passo {currentStep}/{steps.length}
                    </CardTitle>
                    <Separator />
                  </CardHeader>

                  <CardContent>{steps[currentStep - 1].content}</CardContent>

                  <CardFooter>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleBack}
                      disabled={currentStep === 1}>
                      Voltar
                    </Button>
                    {currentStep < steps.length
                      ? (<Button onClick={goToNextStep}>Próximo</Button>)
                      : (<Button onClick={handleFinalSubmit}>Enviar</Button>)
                    }
                  </CardFooter>
                </AutoHeight>
              </motion.div>
            )}

            {hasError && (
              <ErrorFeedback words={["Tente novamente.", "Vamos tentar de novo!"]} onRetry={handleNewRequest} />)}
            {!showContent && !hasError && (
              <SuccessFeedback
                words={["com sucesso.", "rapidamente."]}
                selectedClient={customForm["clientId"].value}
                selectedRole={roles.find(role => role.id.toString() === customForm["roleId"].value)!.name}
                description={customForm["description"].value}
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
        </div>
      </ScrollArea>
    </motion.div>
  );
}
