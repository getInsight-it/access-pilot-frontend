import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { X } from 'lucide-react';

import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { toast } from "../ui/use-toast";
import { Textarea } from "../ui/textarea";
import { ScrollArea, ScrollBar } from "../../components/ui/scroll-area";

import { HttpRequestResponse } from "@getinsight.it/getinsight-common";
import { RequestService } from "../../services/request/request-service";
import { clientService } from "../../services/client";
import { roleService } from "../../services/role";
import useAuthStore from "../../store/authStore";
import { httpClient } from "../../config/http/http";
import { StepLoader } from "../steploader/StepLoader";
import { Heading } from "../ui/heading";
import { Separator } from "@radix-ui/react-separator";
import { FlipWords } from "../ui/flip-words";
import Steps from "../steps/StepsHor";
import { SystemSelectionModal } from "../../components/SystemSelectionModal";
import { RoleSelectionModal } from "../../components/RoleSelectionModal";

interface Client {
  id: number;
  clientId: string;
}

interface Role {
  id: number;
  name: string;
}

const formSchema = z.object({
  clientId: z.string().min(1, {message: "Selecione um sistema."}),
  roleId: z.string().min(1, {message: "Selecione um papel."}),
  description: z
    .string()
    .min(10, { message: "Deve conter ao menos 10 caracteres." })
    .max(160, { message: "Não deve exceder 160 caracteres." }),
  attachments: z.array(z.instanceof(File)).optional(),
});

export function StepFormHor() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [showContent, setShowContent] = useState(true);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(0);
  const [isSystemModalOpen, setIsSystemModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([false, false, false, false, false]);
  const [invalidSteps, setInvalidSteps] = useState<boolean[]>([false, false, false, false, false]);
  const steps = [0, 1, 2, 3, 4];

  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: "",
      roleId: "",
      description: "",
      attachments: [],
    },
    mode: "onTouched",
  });

  const getClients = async () => {
    try {
      const fetchedClients = await clientService.getClients();
      setClients(fetchedClients);
    } catch (error) {
      console.error("Erro ao carregar clients:", error);
    }
  };

  const getRolesByClientId = async (clientId: string) => {
    try {
      const fetchedRoles = await roleService.getRolesByClientId(clientId);
      setRoles(fetchedRoles);
    } catch (error) {
      console.error("Erro ao carregar roles:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      getClients();
      handleNewRequest();
    }
  }, [isAuthenticated]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setLoading(true);
    setHasError(false);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const requestService = new RequestService(httpClient);
      const formData = new FormData();
      formData.append("request", JSON.stringify({ roleId: data.roleId, description: data.description }));

      if (attachments.length > 0) {
        attachments.forEach((file) => formData.append("attachments", file));
      }

      const headers = new Map<string, string>();
      headers.set("Content-Type", "multipart/form-data");

      const response = await requestService.createRequest(formData, headers);

      if (response instanceof HttpRequestResponse) {
        toast({
          title: "Solicitação enviada com sucesso!",
          description: "Sua solicitação foi processada.",
        });
        setShowContent(false);
        setSelectedClient(clients.find(client => client.clientId === data.clientId)?.clientId || null);
        setSelectedRole(roles.find(role => role.id.toString() === data.roleId)?.name || null);
        setDescription(data.description);
      } else {
        throw new Error("Erro ao enviar solicitação");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar sua solicitação.",
      });
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    const validFiles = selectedFiles.filter(file => {
      if (file.size > maxFileSize) {
        toast({
          title: "Arquivo muito grande",
          description: `${file.name} excede o tamanho máximo de 5MB.`,
        });
        return false;
      }
      return true;
    });

    if (validFiles.length + attachments.length > 3) {
      toast({
        title: "Limite de arquivos excedido",
        description: "O número máximo de arquivos permitidos é 3.",
      });
      return;
    }

    const newAttachments = [...attachments, ...validFiles];
    setAttachments(newAttachments);
    form.setValue("attachments", newAttachments);
  };

  const handleRemoveAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
    form.setValue("attachments", newAttachments);
  };

  const handleNewRequest = () => {
    form.reset({
      clientId: "",
      roleId: "",
      description: "",
      attachments: [],
    });
    setShowContent(true);
    setAttachments([]);
    setSelectedClient(null);
    setSelectedRole(null);
    setDescription("");
    setHasError(false);
    setCurrentStep(0);
    setRoles([]);
    setCompletedSteps([false, false, false, false, false]);
    setInvalidSteps([false, false, false, false, false]);
  };  

  const handleLoaderClose = () => {
    setLoading(false);
  };

  const handleStepChange = useCallback((step: number) => {
    setCurrentStep(step);
    
    setCompletedSteps(prev => {
      const newCompletedSteps = [...prev];
      if (step > 0 && form.getValues('clientId')) newCompletedSteps[0] = true;
      if (step > 1 && form.getValues('roleId')) newCompletedSteps[1] = true;
      if (step > 2 && form.getValues('description')) newCompletedSteps[2] = true;
      newCompletedSteps[3] = step === 4;
      newCompletedSteps[4] = step === 4;
      return newCompletedSteps;
    });

    if (step === 2) {
      const currentDescription = form.getValues('description');
      if (!currentDescription) {
        form.setValue('description', '');
        setDescription('');
      }
    }
  }, [form]);

  const clearFieldError = (fieldName: keyof z.infer<typeof formSchema>) => {
    if (!form.formState.errors[fieldName]) return;
    form.clearErrors(fieldName);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (currentStep === steps.length - 1) {
      const result = await form.trigger();
      if (result) {
        const formData = form.getValues();
        formData.attachments = attachments;
        await onSubmit(formData);
      } else {
        const errors = form.formState.errors;
        let errorMessage = "Por favor, preencha todos os campos obrigatórios:";
        const newInvalidSteps = [false, false, false, false, false];
        if (errors.clientId) {
          errorMessage += "\n- Sistema";
          newInvalidSteps[0] = true;
        }
        if (errors.roleId) {
          errorMessage += "\n- Papel";
          newInvalidSteps[1] = true;
        }
        if (errors.description) {
          errorMessage += "\n- Motivo";
          newInvalidSteps[2] = true;
        }
        setInvalidSteps(newInvalidSteps);
        toast({
          title: "Erro",
          variant: "destructive",
          description: errorMessage,
        });
      }
    } else {
      handleStepChange(currentStep + 1);
    }
  };

  const handleStepClick = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const renderStep = (step: number) => {
    switch (step) {
      case 0:
        return (
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sistema</FormLabel>
                <FormControl>
                  <div>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        setIsSystemModalOpen(true);
                      }}
                      variant="outline"
                      className="w-full border border-primary justify-start"
                      type="button"
                    >
                      {selectedClient || "Selecione um sistema"}
                    </Button>
                    <SystemSelectionModal
                      isOpen={isSystemModalOpen}
                      onClose={() => setIsSystemModalOpen(false)}
                      systems={clients}
                      selectedSystem={selectedClient}
                      onSelectSystem={(clientId) => {
                        field.onChange(clientId);
                        setSelectedClient(clientId);
                        getRolesByClientId(clientId);
                        clearFieldError('clientId');
                        setCompletedSteps(prev => {
                          const newCompletedSteps = [...prev];
                          newCompletedSteps[0] = true;
                          return newCompletedSteps;
                        });
                        setInvalidSteps(prev => {
                          const newInvalidSteps = [...prev];
                          newInvalidSteps[0] = false;
                          return newInvalidSteps;
                        });
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 1:
        return (
          <FormField
            control={form.control}
            name="roleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Papel</FormLabel>
                <FormControl>
                  <div>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        setIsRoleModalOpen(true);
                      }}
                      variant="outline"
                      className="w-full border border-primary justify-start"
                      type="button"
                    >
                      {selectedRole || "Selecione um papel"}
                    </Button>
                    <RoleSelectionModal
                      isOpen={isRoleModalOpen}
                      onClose={() => setIsRoleModalOpen(false)}
                      roles={roles}
                      selectedRole={selectedRole}
                      onSelectRole={(roleId, roleName) => {
                        field.onChange(roleId);
                        setSelectedRole(roleName);
                        clearFieldError('roleId');
                        setCompletedSteps(prev => {
                          const newCompletedSteps = [...prev];
                          newCompletedSteps[1] = true;
                          return newCompletedSteps;
                        });
                        setInvalidSteps(prev => {
                          const newInvalidSteps = [...prev];
                          newInvalidSteps[1] = false;
                          return newInvalidSteps;
                        });
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 2:
        return (
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Motivo</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Explique o motivo."
                    className="resize-none"
                    {...field}
                    value={field.value}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setDescription(newValue);
                      field.onChange(newValue);
                      if (newValue.length >= 10 && newValue.length <= 160) {
                        clearFieldError('description');
                        setCompletedSteps(prev => {
                          const newCompletedSteps = [...prev];
                          newCompletedSteps[2] = true;
                          return newCompletedSteps;
                        });
                        setInvalidSteps(prev => {
                          const newInvalidSteps = [...prev];
                          newInvalidSteps[2] = false;
                          return newInvalidSteps;
                        });
                      } else {
                        setCompletedSteps(prev => {
                          const newCompletedSteps = [...prev];
                          newCompletedSteps[2] = false;
                          return newCompletedSteps;
                        });
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 3:
        return (
          <FormField
            control={form.control}
            name="attachments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Anexos (opcional)</FormLabel>
                <FormControl>
                  <div>
                    <Input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.txt"
                    />
                    {attachments.length > 0 && (
                      <ul className="mt-2 space-y-2">
                        {attachments.map((file, index) => (
                          <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                            <span className="truncate">{file.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveAttachment(index)}
                              className="w-10 h-10 text-red-500 hover:text-red-700 hover:bg-red-200 rounded-full"
                            >
                              <X size={16} />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 4:
        return (
          <div className="space-y-4 min-h-[140px]">
            <h2 className="text-lg font-semibold">Confirme os dados</h2>
            <div className="grid grid-cols-3 gap-1">
              <p className="font-normal">Sistema:</p>
              <p className="col-span-2">{selectedClient}</p>
              <p className="font-normal">Papel:</p>
              <p className="col-span-2">{selectedRole}</p>
              <p className="font-normal">Motivo:</p>
              <p className="col-span-2">{description}</p>
              {attachments.length > 0 && (
                <>
                  <p className="font-normal">Anexos:</p>
                  <ul>
                    {attachments.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const title = "Solicitar acesso";
  const descriptionText = "Preencha o formulário e solicite acesso a um sistema.";
  const words = ["com sucesso.", "rapidamente."];
  const wordsError = ["Tente novamente.", "Vamos tentar de novo!"];

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={descriptionText} />
      </div>
      
      <Separator />

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {showContent && !hasError && (
            <Steps
              steps={steps.map(renderStep)}
              onStepChange={handleStepChange}
              onSubmit={handleSubmit}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              completedSteps={completedSteps}
              invalidSteps={invalidSteps}
              onStepClick={handleStepClick}
            >
            </Steps>
          )}

          {hasError && (
            <>
              <div className="lg:max-w-xl bg-red-900 flex flex-col ">
                <div className="text-2xl font-normal text-primary-foreground px-6 py-6">
                  Ocorreu um erro.
                  <FlipWords words={wordsError} />
                </div>
                <div className="lg:max-w-xl bg-red-500 p-1"></div>
              </div>
              <Button className="my-2 w-40" onClick={handleNewRequest}>
                Tentar novamente
              </Button>
            </>
          )}

          {!showContent && !hasError && (
            <>
              <div className="md:grid grid-cols-1 lg:max-w-xl">
                <div className="bg-primary flex px-6 py-6">
                  <div className="text-2xl font-normal text-primary-foreground">
                    Solicitação criada
                    <FlipWords words={words} />
                  </div>
                </div>
                <div className="bg-green-500 p-1"></div>
                
                <div className="grid grid-cols-2 gap-5 mt-6 px-1">
                  <div className="font-bold space-y-3">
                    <p>Sistema:</p>
                    <p>Papel solicitado:</p>
                    <p>Motivo:</p>
                    {attachments.length > 0 && <p>Anexos:</p>}
                  </div>
                  <div className="space-y-3">
                    <p>{selectedClient}</p>
                    <p>{selectedRole}</p>
                    <p>{description}</p>
                    <ul>
                      {attachments.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <Link
                className="bg-[var(--dashboard-nav-bg)] text-primary rounded-full text-sm font-medium transition-colors hover:bg-[var(--button-hover)] hover:text-[var(--button-hover-text)] h-10 px-4 py-2.5 mt-4"
                to="/dashboard/my-access-requests/"
              >
                Listar solicitações
              </Link>
              <Button className="ml-4 mt-4" onClick={handleNewRequest}>
                Solicitar novo acesso
              </Button>
            </>
          )}

          <StepLoader loading={loading} onClose={handleLoaderClose} />
        </form>
      </Form>
    </>
  );
}

