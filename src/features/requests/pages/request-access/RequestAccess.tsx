import { Breadcrumbs } from "../../../../components/breadcrumbs.tsx";
import { ScrollArea } from "../../../../components/ui/scroll-area.tsx";
import { Heading } from "../../../../components/ui/heading.tsx";
import { Separator } from "@radix-ui/react-separator";
import { motion } from "framer-motion";
import { PilotoForm } from "../../../../components/canvas/PilotoForm.tsx";
import { cn } from "../../../../config/lib/utils.ts";
import { Check } from "lucide-react";
import { AutoHeight } from "../../../../common/components/AutoHeigth.tsx";
import { CardContent, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card.tsx";
import { Button } from "../../../../components/ui/button.tsx";
import { ErrorFeedback } from "./partials/ErrorFeedbackComponent.tsx";
import { SuccessFeedback } from "./partials/SuccessFeedbackForm.tsx";
import { StepLoader } from "../../../../components/steploader/StepLoader.tsx";
import { ConfirmRequestDialog } from "./partials/ConfirmRequestDialog.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { RoleResponseInterface } from "../../../role/common/types/role.model.ts";
import { ClientResponseInterface } from "../../../client/common/model/client.model.ts";
import useAuthStore from "../../../../store/authStore.ts";
import { useToast } from "../../../../components/ui/use-toast.ts";
import { clientService } from "../../../client/common/service/client-service.ts";
import { roleService } from "../../../role/common/service/role-service.ts";
import useWindowSize from "../../../../common/hooks/use-window-size.ts";
import { ClientStep } from "./partials/ClientSelectionStep.tsx";
import { RoleStep } from "./partials/RoleSelectionStep.tsx";
import AttachmentStep, { FileAttachment } from "./partials/AttachmentStep.tsx";
import { DetailsStep } from "./partials/DetailsStep.tsx";
import { RequestService } from "../../common/api/request-service.ts";
import { httpClient } from "../../../../config/http/http.ts";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Solicitar acesso", link: "/dashboard/request-access/create" }
];

type ActionName = "idle" | "headshake" | "hiphop";

export interface BasicFormFieldInterface {
  [key: string]: {
    invalid: boolean;
    error: string | null;
    value: any;
  };
}

export type RequestFormFieldType = "clientId" | "roleId" | "codeItem" | "reason" | "attachments";

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
  const [currentAnimation, setCurrentAnimation] = useState<ActionName>("idle");
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const { toast } = useToast();
  const location = useLocation();
  const initialFormState: BasicFormFieldInterface = {
    clientId: { invalid: false, error: "", value: "" },
    roleId: { invalid: false, error: "", value: "" },
    codeItem: { invalid: false, error: "", value: "" },
    reason: { invalid: false, error: "", value: "" },
    attachments: { invalid: false, error: "", value: [] }
  };

  const [customForm, setCustomForm] = useState<BasicFormFieldInterface>(initialFormState);

  const setBasicFormFieldValue = ({ field, value, error }: {
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
  };

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

      const requiredConfigurations = clients.find(client => client.clientId === customForm["clientId"].value)?.configurations;
      if(customForm["attachments"].value.length < (requiredConfigurations?.length || 0)) {
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

  const getClients = async () => {
    try {
      const fetchedClients = await clientService.getClients();
      setClients(fetchedClients as any);
    } catch (error) {
      console.error("Erro ao carregar clients:", error);
    }
  };

  const getRolesByClientId = async (clientId: string) => {
    try {
      const fetchedRoles = await roleService.getRolesByClientId(clientId);
      setRoles(fetchedRoles as any);
    } catch (error) {
      console.error("Erro ao carregar roles:", error);
    }
  };

  function init() {
    if(isAuthenticated) {
      getClients();
      const client = location.state;
      if(client) {
        handlerSelectedClient(client);
      }
    }
  }

  useEffect(() => {
    init();
  }, [isAuthenticated]);

  function handlerSelectedClient(client: ClientResponseInterface) {
    setBasicFormFieldValue({ field: "clientId", value: client.clientId, error: null });
    getRolesByClientId(client.clientId);
  }

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
          handlerSelectedSphere={(codeItem) => {
            setBasicFormFieldValue({ field: "codeItem", value: codeItem, error: null });
          }}
          handlerClearSphereHierarchyError={() => {
            clearError("codeItem");
          }}
          isLargeScreen={isLargeScreen}
          isFormSubmitted={isFormSubmitted} selectedRole={null}
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
      const requestService = new RequestService(httpClient);
      const payloadFormData = new FormData();
      const request = {
        clientId: customForm["clientId"].value,
        roleId: Number(customForm["roleId"].value),
        ...(customForm["codeItem"].value && { codeItem: customForm["codeItem"].value }),
        description: customForm["reason"].value
      };

      payloadFormData.append("request", JSON.stringify(request));
      customForm["attachments"].value.forEach((att: FileAttachment) => {
        att.files.forEach(file => {
          payloadFormData.append(att.key, file);
        });
      });

      await requestService.createRequest(payloadFormData);

      toast({ title: "Solicitação enviada com sucesso!", description: "Sua solicitação foi processada.." });
      navigate("/dashboard/my-access-requests");
      setShowContent(false);
    } catch (error: any) {
      toast({ title: "Erro ao processar solicitação de acesso", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleNewRequest = () => {
    setCustomForm(initialFormState);
    setCurrentStep(1);
    setStepsState({ 1: "pending", 2: "pending", 3: "pending", 4: "pending" });
    setIsFormSubmitted(false);
    setCurrentAnimation("idle");
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
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Breadcrumbs items={breadcrumbItems} />
        <>
          <div className="flex items-center justify-between">
            <Heading title={"Solicitar acesso"} description={"Preencha o formulário e solicite acesso a um sistema."} />
          </div>

          <Separator />

          <div className="space-y-8 relative">
            <motion.div
              initial={{ opacity: 0, x: -500 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: { duration: 0.8, delay: 0.3, ease: "easeOut" }
              }}
              className={`absolute h-[500px] bottom-0 -left-60 lg:-bottom-20 lg:-left-72 z-10 pointer-events-none ${hasError ? "hidden lg:-bottom-60 lg:-left-32" : ""} ${!showContent && !hasError ? "-bottom-80 -left-96 lg:-bottom-40 lg:left-2" : ""}`}>
              <PilotoForm currentAnimation={currentAnimation} />
            </motion.div>

            {showContent && !hasError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.3, delay: 0.3, ease: "easeInOut" }
                }}
                className="grid grid-cols-1 lg:grid-cols-[360px,1fr] xl:grid-cols-[400px,1fr] gap-4 ">

                <div className="relative py-8 rounded-xl space-y-10 sm:space-y-12 md:min-h-[600px] min-h-[500px]">
                  {steps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      className="block sm:flex items-start relative"
                      initial={false}
                      animate={{
                        opacity: step.id <= currentStep ? 1 : 0.5,
                        transition: { duration: 0.3, ease: "easeInOut" }
                      }}>
                      <motion.div
                        className={cn(
                          "w-8 h-8 hover:bg-gray-200 rounded-full flex items-center justify-center z-10",
                          step.id === currentStep
                            ? "hover:bg-primary bg-primary text-primary-foreground"
                            : stepsState[step.id] === "completed"
                              ? "bg-green-500 hover:bg-green-600 text-white"
                              : stepsState[step.id] === "error"
                                ? "bg-red-500 hover:bg-red-700 text-white"
                                : "bg-[var(--bg-indicator)]"
                        )}
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
                            <Check className="w-6 h-6" />
                          ) : (
                            <span
                              className={stepsState[step.id] === "completed" ? "text-white" : ""}>{step.number}</span>
                          )}
                        </motion.span>
                      </motion.div>

                      <div className="ml-14 sm:mt-0 sm:ml-4">
                        <h3
                          className={`text-md xl:text-lg -mt-8 sm:mt-1 ${step.id === currentStep ? "font-bold" : ""}`}>
                          {step.title}
                        </h3>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: -100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 2.8 }}
                        className="absolute left-4 top-8 w-[2px] h-[calc(70%+24px)] last:h-[0px] bg-gray-300">
                      </motion.div>

                      {index < steps.length - 1 && (
                        <motion.div
                          className="absolute left-4 top-8 w-[2px] h-[calc(100%+24px)]"
                          initial={{ backgroundColor: "#b2b2b2", y: -500 }}
                          animate={{
                            backgroundColor: stepsState[step.id] === "completed" && stepsState[step.id + 1] === "completed" ? "#22c55e" : "#b2b2b2",
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
                    <CardTitle className="text-gray-600">
                      Passo {currentStep}/{steps.length}
                    </CardTitle>
                    <Separator />
                  </CardHeader>

                  <CardContent>
                    {steps[currentStep - 1].content}
                  </CardContent>

                  <CardFooter className="flex gap-x-4 mt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      className="bg-secondary text-primary"
                      onClick={handleBack}
                      disabled={currentStep === 1}>
                      Voltar
                    </Button>
                    {currentStep < steps.length ? (
                      <Button className="w-40 bg-primary text-primary-foreground" onClick={goToNextStep}>
                        Próximo
                      </Button>
                    ) : (
                      <Button className="w-40 bg-emerald-500 text-primary-foreground" onClick={handleFinalSubmit}>
                        Enviar
                      </Button>
                    )}
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
          </div>

          <ConfirmRequestDialog
            isOpen={isConfirmModalOpen}
            onOpenChange={setIsConfirmModalOpen}
            reason={customForm["reason"].value}
            clientId={customForm["clientId"].value}
            roleLabel={roles.find(role => role.id.toString() === customForm["roleId"].value)?.label || ""}
            attachments={customForm["attachments"].value}
            onConfirm={handleSubmitForm}
          />
        </>
      </div>
    </ScrollArea>
  );
}
