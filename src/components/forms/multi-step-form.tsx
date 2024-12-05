import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../components/ui/use-toast";

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
import { Textarea } from "../ui/textarea";
import { Check, CheckCircle2, MonitorIcon as MonitorCog, Plus, FileIcon, FileText, Image, FileAudio, FileVideo } from 'lucide-react';
import { ScrollArea, ScrollBar } from "../../components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

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
import { CardShine } from "../CardShine";
import { cn } from "../../lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { X } from 'lucide-react';
import { BackgroundBeamsWithCollision } from "../ui/background-beams-with-collision";
import { BackgroundLines } from "../ui/background-lines";

interface Client {
  id: number;
  clientId: string;
}

interface Role {
  id: number;
  name: string;
}

const formSchema = z.object({
  clientId: z.string({
    required_error: "Selecione um sistema.",
  }),
  roleId: z.string({
    required_error: "Selecione um papel.",
  }),
  description: z
    .string()
    .min(10, { message: "Deve conter ao menos 10 caracteres." })
    .max(160, { message: "Não deve exceder 160 caracteres." }),
  attachments: z.array(z.instanceof(File)).optional(),
});

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [roles, setRoles] = useState<Role[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [showContent, setShowContent] = useState(true);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [stepsState, setStepsState] = useState<Record<number, 'pending' | 'completed' | 'error'>>({
    1: 'pending',
    2: 'pending',
    3: 'pending',
    4: 'pending'
  });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false); 

  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const { toast } = useToast();

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
    if (isAuthenticated) getClients();
  }, [isAuthenticated]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { description: "" },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (currentStep < steps.length) {
      goToNextStep();
    }
  }

  const handleFinalSubmit = async () => {
    setIsFormSubmitted(true); 
    const isValid = await form.trigger();
    if (!isValid) {
      
      updateStepStateWithValidation(steps.length);

      
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });

      return;
    }

    
    setStepsState({
      1: 'completed',
      2: 'completed',
      3: 'completed',
      4: 'completed'
    });

    
    setIsConfirmModalOpen(true);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
      case 'doc':
      case 'docx':
      case 'txt':
        return <FileText className="w-5 h-5" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return <Image className="w-5 h-5" />;
      case 'mp3':
      case 'wav':
        return <FileAudio className="w-5 h-5" />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <FileVideo className="w-5 h-5" />;
      default:
        return <FileIcon className="w-5 h-5" />;
    }
  };

  async function handleConfirmSubmit() {
    setIsConfirmModalOpen(false);
    setLoading(true);
    setHasError(false);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const requestService = new RequestService(httpClient);
      const formData = new FormData();
      formData.append("request", JSON.stringify({ 
        roleId: form.getValues("roleId"), 
        description: form.getValues("description") 
      }));

      if (attachments.length > 0) {
        attachments.forEach((file) => formData.append("attachments", file));
      }

      const headers = new Map<string, string>();
      headers.set("Content-Type", "multipart/form-data");

      const response = await requestService.createRequest(formData, headers);

      if (response instanceof HttpRequestResponse) {
        setShowContent(false);
        setSelectedClient(clients.find(client => client.clientId === form.getValues("clientId"))?.clientId || null);
        setSelectedRole(roles.find(role => role.id.toString() === form.getValues("roleId"))?.name || null);
        setDescription(form.getValues("description"));

        
        setTimeout(() => {
          toast({
            title: "Solicitação enviada com sucesso!",
            description: "Sua solicitação foi processada.",
          });
        }, 100);
      } else {
        throw new Error("Erro ao enviar solicitação");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive",
      });
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const maxFileSize = 5 * 1024 * 1024;

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

    setAttachments([...attachments, ...validFiles]);
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
    setCurrentStep(1);
    setStepsState({
      1: 'pending',
      2: 'pending',
      3: 'pending',
      4: 'pending'
    });
    setIsFormSubmitted(false);
  };  

  const handleLoaderClose = () => {
    setLoading(false);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleStepClick = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    if (isFormSubmitted) {
      updateStepStateWithValidation(steps.length);
    } else {
      updateStepState(stepNumber);
    }
  };

  const updateStepState = (currentStep: number) => {
    setStepsState(prevState => {
      const newState = { ...prevState };
      for (let i = 1; i <= currentStep; i++) {
        if (i === 1 && form.getValues("clientId")) {
          newState[i] = 'completed';
        } else if (i === 2 && form.getValues("roleId")) {
          newState[i] = 'completed';
        } else if (i === 3 && form.getValues("description").length >= 10) {
          newState[i] = 'completed';
        } else if (i === 4) {
          if (form.getValues("clientId") && form.getValues("roleId") && form.getValues("description").length >= 10) {
            newState[i] = 'completed';
          } else {
            newState[i] = 'pending';
          }
        } else {
          newState[i] = 'pending';
        }
      }
      return newState;
    });
  };

  const updateStepStateWithValidation = (currentStep: number) => {
    setStepsState(prevState => {
      const newState = { ...prevState };
      for (let i = 1; i <= currentStep; i++) {
        if (i === 1) {
          newState[i] = form.getValues("clientId") ? 'completed' : 'error';
        } else if (i === 2) {
          newState[i] = form.getValues("roleId") ? 'completed' : 'error';
        } else if (i === 3) {
          newState[i] = form.getValues("description").length >= 10 ? 'completed' : 'error';
        } else if (i === 4) {
          newState[i] = (form.getValues("clientId") && form.getValues("roleId") && form.getValues("description").length >= 10) ? 'completed' : 'error';
        }
      }
      return newState;
    });
  };

  const title = "Solicitar acesso";
  const descriptionText = "Preencha o formulário e solicite acesso a um sistema.";
  const words = ["com sucesso.", "rapidamente."];
  const wordsError = ["Tente novamente.", "Vamos tentar de novo!"];

  const goToNextStep = () => {
    if (currentStep < steps.length) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (isFormSubmitted) {
        updateStepStateWithValidation(nextStep);
      } else {
        updateStepState(nextStep);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      if (isFormSubmitted) {
        updateStepStateWithValidation(prevStep);
      } else {
        updateStepState(prevStep);
      }
    }
  };

  const steps = [
    {
      id: 1,
      title: "Para qual sistema você quer acesso?",
      number: 1,
      description: "Escolha o sistema que você quer se conectar.",
      content: (
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <h4 className="text-lg font-semibold mb-4">Escolha o sistema que você precisa de acesso:</h4>
              <FormControl>
                <Popover side="right">
                  <PopoverTrigger asChild>
                    <div
                      className={`border border-primary text-sm w-44 cursor-pointer ${selectedClient ? 'border border-primary text-primary' : ''}`}
                    >
                      <CardShine>
                        <div className="p-4 grid items-center h-[100px]">

                          {!selectedClient && <Plus className="w-8 h-8 mt-3 mx-auto" />}
                          {selectedClient && <Check className="absolute top-3 right-3 flex-shrink-0" />}
                          <p className="text-sm">
                            {selectedClient && <MonitorCog className="w-5 h-5 mb-2" />}
                            {selectedClient}
                          </p>
                        </div>
                      </CardShine>
                    </div>

                  </PopoverTrigger>
                  <PopoverContent className="w-80 ml-48 -mt-28" align="start">
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-2">
                        {clients.map((client) => (
                          <CardShine key={client.id}>
                            <div
                              className={cn(
                                "flex flex-col  justify-between p-4 cursor-pointer transition-all",
                                selectedClient === client.clientId && "border border-primary "
                              )}
                              onClick={() => {
                                field.onChange(client.clientId);
                                setSelectedClient(client.clientId);
                                getRolesByClientId(client.clientId);
                                updateStepState(1);
                              }}
                            >
                              <MonitorCog className="w-5 h-5 mb-2" />
                              <span className="truncate">{client.clientId}</span>
                              {selectedClient === client.clientId && <Check className="absolute top-3 right-3 flex-shrink-0" />}
                            </div>
                          </CardShine>
                        ))}
                      </div>
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      id: 2,
      title: "Qual será o seu papel?",
      number: 2,
      description: "Escolha como você irá usar o sistema.",
      content: (
        <FormField
          control={form.control}
          name="roleId"
          render={({ field }) => (
            <FormItem>
              <h4 className="text-lg font-semibold mb-4">Selecione seu papel no sistema</h4>
              <FormControl>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {roles.map((role) => (
                    <CardShine key={role.id}>
                      <div
                        className={cn(
                          "flex items-center justify-between p-4 cursor-pointer transition-all",
                          selectedRole === role.name && "ring-2 ring-primary rounded-[var(--card-border-radius)]"
                        )}
                        onClick={() => {
                          field.onChange(role.id.toString());
                          setSelectedRole(role.name);
                          updateStepState(2);
                        }}
                      >
                        <span>{role.name}</span>
                        {selectedRole === role.name && <Check className="" />}
                      </div>
                    </CardShine>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      id: 3,
      title: "Por que você precisa desse acesso?",
      number: 3,
      description: "Nos ajude a entender o porquê deste acesso.",
      content: (
        <>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <h4 className="text-lg font-semibold mb-4">Conte-nos o motivo para solicitar este acesso</h4>
                <FormControl>
                  <Textarea
                    placeholder="Explique o motivo."
                    className="resize-none"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setDescription(e.target.value);
                      updateStepState(3);
                    }}
                  />
                </FormControl>
                <FormMessage />
                <p className="text-sm text-gray-500 mt-2">
                  {field.value.length}/10 caracteres mínimos
                </p>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="attachments"
            render={({ field }) => (
              <FormItem className="mt-4">
                <h4 className="text-lg font-semibold mb-4">Adicione arquivos que ajudem a justificar sua solicitação (opcional)</h4>
                <FormControl>
                  <div className="min-h-[100px]">
                    <Input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.txt"
                    />
                    {attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {attachments.map((file, index) => (
                          <div key={index} className="bg-gray-200 pl-4 pr-2 py-0 rounded flex items-center justify-between">
                            <div className="flex items-center">
                              {getFileIcon(file.name)}
                              <span className="truncate text-sm ml-2">{file.name}</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveAttachment(index)}
                              className="w-10 h-10 text-red-500 hover:text-red-700 hover:bg-red-200 rounded-full p-1"
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      ),
    },
    {
      id: 4,
      title: "Confira os detalhes antes de enviar!",
      number: 4,
      description: "Certifique-se de que está tudo certo antes de enviar.",
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Resumo da Solicitação</h3>
          <p className="text-gray-900">Revise suas escolhas antes de enviar:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Sistema: {form.getValues("clientId")}</li>
            <li>Papel: {roles.find(role => role.id.toString() === form.getValues("roleId"))?.name || form.getValues("roleId")}</li>
            <li>Motivo: {form.getValues("description")}</li>
            {attachments.length > 0 && (
              <li>
                Anexos:
                <ul className="list-disc list-inside ml-4">
                  {attachments.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </li>
            )}
          </ul>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={descriptionText} />
      </div>
      
      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 relative">

          {showContent && !hasError && (
            <div className=" bg-blue-100 p-4 grid grid-cols-1 lg:grid-cols-[440px,1fr] gap-8 mt-16">

               
              
              <div className="relative bg-white p-8 rounded-xl space-y-10 sm:space-y-12 min-h-[280px] sm:min-h-[340px]">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    className="block sm:flex items-start relative"
                    initial={false}
                    animate={{
                      opacity: step.id <= currentStep ? 1 : 0.5,
                      transition: { duration: 0.3 }
                    }}
                  >
                    
                    <motion.div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center z-10 cursor-pointer",
                        step.id === currentStep
                          ? "bg-primary text-primary-foreground"
                          : stepsState[step.id] === 'completed'
                          ? "bg-green-500 text-white"
                          : stepsState[step.id] === 'error'
                          ? "bg-red-500 text-white"
                          : "bg-gray-300"
                      )}
                      initial={false}
                      animate={{
                        scale: step.id === currentStep ? 1.1 : 1,
                        transition: { duration: 0.3 }
                      }}
                      onClick={() => handleStepClick(step.id)}
                    >
                        
                      <motion.span
                        key={step.number}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {stepsState[step.id] === 'completed' ? (
                          <Check className="w-6 h-6" />
                        ) : (
                          <span className={stepsState[step.id] === 'completed' ? 'text-white' : ''}>{step.number}</span>
                        )}
                      </motion.span>
                    
                    </motion.div>

                    
                    <div className="ml-14 sm:mt-0 sm:ml-4">
                      <h3
                        className={`text-sm sm:text-lg -mt-8 sm:mt-2 ${step.id === currentStep ? 'font-bold' : ''}`}
                      >
                        {step.title}
                      </h3>
                    </div>
                    
                    <div className="absolute left-5 top-10 w-[2px] h-[calc(70%+24px)] last:h-[0px] bg-gray-300"></div>
                    
                    {index < steps.length - 1 && (
                      <motion.div
                        className="absolute left-5 top-10 w-[2px] h-[calc(100%+24px)]"
                        initial={{ backgroundColor: "#374151" }}
                        animate={{
                          backgroundColor: stepsState[step.id] === 'completed' && stepsState[step.id + 1] === 'completed' ? "#22c55e" : "#4B5563",
                          opacity: step.id < currentStep ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    
                  </motion.div>
                ))}

                
                
              </div>

              

              
              <div className="bg-gray-50 p-8 rounded-xl">
                <div className="mb-8 min-h-[380px]">
                  <p className="text-gray-400 mb-2">Passo {currentStep}/{steps.length}</p>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {steps[currentStep - 1].content}
                    </motion.div>
                  </AnimatePresence>
                </div>


                <div className=" flex gap-x-4 mt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    className="bg-gray-200 text-primary hover:text-white hover:bg-[#000044]"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                  >
                    Voltar
                  </Button>
                  {currentStep < steps.length ? (
                    <Button
                      className="bg-primary hover:bg-accent text-white"
                      onClick={goToNextStep}
                    >
                      Próximo
                    </Button>
                  ) : (
                    <Button
                      className="bg-emerald-500 hover:bg-emerald-600 text-white"
                      onClick={handleFinalSubmit}
                    >
                      Enviar
                    </Button>
                  )}
                </div>
                
              </div>
              

              
            </div>
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

      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar envio</DialogTitle>
            <DialogDescription>
              Você tem certeza que deseja enviar esta solicitação?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <h4 className="text-sm font-medium mb-2">Resumo da solicitação:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Sistema: {form.getValues("clientId")}</li>
              <li>Papel: {roles.find(role => role.id.toString() === form.getValues("roleId"))?.name || form.getValues("roleId")}</li>
              <li>Motivo: {form.getValues("description")}</li>
              {attachments.length > 0 && (
                <li>
                  Anexos:
                  <ul className="list-disc list-inside ml-4">
                    {attachments.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </li>
              )}
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmSubmit}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}












// horizontal
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { useToast } from "../../components/ui/use-toast";

// import { Button } from "../../components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "../../components/ui/form";
// import { Input } from "../../components/ui/input";
// import { Textarea } from "../ui/textarea";
// import { Check, CheckCircle2, MonitorIcon as MonitorCog, Plus, FileIcon, FileText, Image, FileAudio, FileVideo } from 'lucide-react';
// import { ScrollArea, ScrollBar } from "../../components/ui/scroll-area";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "../../components/ui/dialog";

// import { HttpRequestResponse } from "@getinsight.it/getinsight-common";
// import { RequestService } from "../../services/request/request-service";
// import { clientService } from "../../services/client";
// import { roleService } from "../../services/role";
// import useAuthStore from "../../store/authStore";
// import { httpClient } from "../../config/http/http";
// import { StepLoader } from "../steploader/StepLoader";
// import { Heading } from "../ui/heading";
// import { Separator } from "@radix-ui/react-separator";
// import { FlipWords } from "../ui/flip-words";
// import { CardShine } from "../CardShine";
// import { cn } from "../../lib/utils";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "../../components/ui/popover";
// import { X } from 'lucide-react';

// interface Client {
//   id: number;
//   clientId: string;
// }

// interface Role {
//   id: number;
//   name: string;
// }

// const formSchema = z.object({
//   clientId: z.string({
//     required_error: "Selecione um sistema.",
//   }),
//   roleId: z.string({
//     required_error: "Selecione um papel.",
//   }),
//   description: z
//     .string()
//     .min(10, { message: "Deve conter ao menos 10 caracteres." })
//     .max(160, { message: "Não deve exceder 160 caracteres." }),
//   attachments: z.array(z.instanceof(File)).optional(),
// });

// export function MultiStepForm() {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [clients, setClients] = useState<Client[]>([]);
//   const [showContent, setShowContent] = useState(true);
//   const [attachments, setAttachments] = useState<File[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [hasError, setHasError] = useState(false);
//   const [selectedClient, setSelectedClient] = useState<string | null>(null);
//   const [selectedRole, setSelectedRole] = useState<string | null>(null);
//   const [description, setDescription] = useState<string>("");
//   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

//   const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
//   const { toast } = useToast();

//   const getClients = async () => {
//     try {
//       const fetchedClients = await clientService.getClients();
//       setClients(fetchedClients);
//     } catch (error) {
//       console.error("Erro ao carregar clients:", error);
//     }
//   };

//   const getRolesByClientId = async (clientId: string) => {
//     try {
//       const fetchedRoles = await roleService.getRolesByClientId(clientId);
//       setRoles(fetchedRoles);
//     } catch (error) {
//       console.error("Erro ao carregar roles:", error);
//     }
//   };

//   useEffect(() => {
//     if (isAuthenticated) getClients();
//   }, [isAuthenticated]);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: { description: "" },
//   });

//   async function onSubmit(data: z.infer<typeof formSchema>) {
//     if (currentStep < steps.length) {
//       goToNextStep();
//     }
//   }

//   const handleFinalSubmit = async () => {
//     const isValid = await form.trigger();
//     if (!isValid) {
//       // Pintar de vermelho os campos obrigatórios não preenchidos
//       Object.keys(form.formState.errors).forEach((fieldName) => {
//         const element = document.querySelector(`[name="${fieldName}"]`);
//         if (element) {
//           element.classList.add("border-red-500");
//         }
//       });

//       // Mostrar mensagem de erro
//       toast({
//         title: "Erro",
//         description: "Por favor, preencha todos os campos obrigatórios.",
//         variant: "destructive",
//       });

//       return;
//     }

//     // Abrir a modal de confirmação
//     setIsConfirmModalOpen(true);
//   };

//   const getFileIcon = (fileName: string) => {
//     const extension = fileName.split('.').pop()?.toLowerCase();
//     switch (extension) {
//       case 'pdf':
//       case 'doc':
//       case 'docx':
//       case 'txt':
//         return <FileText className="w-5 h-5" />;
//       case 'png':
//       case 'jpg':
//       case 'jpeg':
//       case 'gif':
//         return <Image className="w-5 h-5" />;
//       case 'mp3':
//       case 'wav':
//         return <FileAudio className="w-5 h-5" />;
//       case 'mp4':
//       case 'avi':
//       case 'mov':
//         return <FileVideo className="w-5 h-5" />;
//       default:
//         return <FileIcon className="w-5 h-5" />;
//     }
//   };

//   async function handleConfirmSubmit() {
//     setIsConfirmModalOpen(false);
//     setLoading(true);
//     setHasError(false);
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 2000));

//       const requestService = new RequestService(httpClient);
//       const formData = new FormData();
//       formData.append("request", JSON.stringify({ 
//         roleId: form.getValues("roleId"), 
//         description: form.getValues("description") 
//       }));

//       if (attachments.length > 0) {
//         attachments.forEach((file) => formData.append("attachments", file));
//       }

//       const headers = new Map<string, string>();
//       headers.set("Content-Type", "multipart/form-data");

//       const response = await requestService.createRequest(formData, headers);

//       if (response instanceof HttpRequestResponse) {
//         setShowContent(false);
//         setSelectedClient(clients.find(client => client.clientId === form.getValues("clientId"))?.clientId || null);
//         setSelectedRole(roles.find(role => role.id.toString() === form.getValues("roleId"))?.name || null);
//         setDescription(form.getValues("description"));

//         // Mostrar toast de sucesso após um pequeno delay para garantir que seja visível
//         setTimeout(() => {
//           toast({
//             title: "Solicitação enviada com sucesso!",
//             description: "Sua solicitação foi processada.",
//           });
//         }, 100);
//       } else {
//         throw new Error("Erro ao enviar solicitação");
//       }
//     } catch (error) {
//       toast({
//         title: "Erro",
//         description: "Ocorreu um erro ao processar sua solicitação.",
//         variant: "destructive",
//       });
//       setHasError(true);
//     } finally {
//       setLoading(false);
//     }
//   }

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFiles = Array.from(e.target.files || []);
//     const maxFileSize = 5 * 1024 * 1024;

//     const validFiles = selectedFiles.filter(file => {
//       if (file.size > maxFileSize) {
//         toast({
//           title: "Arquivo muito grande",
//           description: `${file.name} excede o tamanho máximo de 5MB.`,
//         });
//         return false;
//       }
//       return true;
//     });

//     if (validFiles.length + attachments.length > 3) {
//       toast({
//         title: "Limite de arquivos excedido",
//         description: "O número máximo de arquivos permitidos é 3.",
//       });
//       return;
//     }

//     setAttachments([...attachments, ...validFiles]);
//   };

//   const handleNewRequest = () => {
//     form.reset({
//       clientId: "",
//       roleId: "",
//       description: "",
//       attachments: [],
//     });
//     setShowContent(true);
//     setAttachments([]);
//     setSelectedClient(null);
//     setSelectedRole(null);
//     setDescription("");
//     setHasError(false);
//     setCurrentStep(1);
//   };  

//   const handleLoaderClose = () => {
//     setLoading(false);
//   };

//   const handleRemoveAttachment = (index: number) => {
//     setAttachments(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleStepClick = (stepNumber: number) => {
//     setCurrentStep(stepNumber);
//   };

//   const title = "Solicitar acesso";
//   const descriptionText = "Preencha o formulário e solicite acesso a um sistema.";
//   const words = ["com sucesso.", "rapidamente."];
//   const wordsError = ["Tente novamente.", "Vamos tentar de novo!"];

//   const goToNextStep = () => {
//     if (currentStep < steps.length) {
//       setCurrentStep((prevStep) => prevStep + 1);
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 1) {
//       setCurrentStep((prevStep) => prevStep - 1);
//     }
//   };

//   const steps = [
//     {
//       id: 1,
//       title: "Qual sistema você precisa de acesso?",
//       number: 1,
//       description: "Selecione o sistema",
//       content: (
//         <FormField
//           control={form.control}
//           name="clientId"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel className="text-xl font-semibold">Sistema</FormLabel>
//               <FormControl>
//                 <Popover side="right">
//                   <PopoverTrigger asChild>
//                     <div
//                       className={`text-sm w-44 cursor-pointer ${selectedClient ? 'border border-primary text-primary' : ''}`}
//                     >
//                       <CardShine>
//                         <div className="p-4 grid items-center h-[100px]">

//                           {!selectedClient && <Plus className="w-8 h-8 mt-3 mx-auto" />}
//                           {selectedClient && <Check className="absolute top-3 right-3 flex-shrink-0" />}
//                           <p className="text-sm">
//                             {selectedClient && <MonitorCog className="w-5 h-5 mb-2" />}
//                             {selectedClient}
//                           </p>
//                         </div>
//                       </CardShine>
//                     </div>

//                   </PopoverTrigger>
//                   <PopoverContent className="w-80 ml-48 -mt-28" align="start">
//                     <ScrollArea className="h-[300px]">
//                       <div className="space-y-2">
//                         {clients.map((client) => (
//                           <CardShine key={client.id}>
//                             <div
//                               className={cn(
//                                 "flex items-center justify-between p-2 cursor-pointer transition-all rounded-md",
//                                 selectedClient === client.clientId && "bg-primary text-primary-foreground"
//                               )}
//                               onClick={() => {
//                                 field.onChange(client.clientId);
//                                 setSelectedClient(client.clientId);
//                                 getRolesByClientId(client.clientId);
//                               }}
//                             >
//                               <span className="truncate">{client.clientId}</span>
//                               {selectedClient === client.clientId && <Check className="flex-shrink-0 ml-2" />}
//                             </div>
//                           </CardShine>
//                         ))}
//                       </div>
//                     </ScrollArea>
//                   </PopoverContent>
//                 </Popover>
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//       ),
//     },
//     {
//       id: 2,
//       title: "Qual o papel?",
//       number: 2,
//       description: "Defina seu papel",
//       content: (
//         <FormField
//           control={form.control}
//           name="roleId"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Papel</FormLabel>
//               <FormControl>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   {roles.map((role) => (
//                     <CardShine key={role.id}>
//                       <div
//                         className={cn(
//                           "flex items-center justify-between p-4 cursor-pointer transition-all",
//                           selectedRole === role.name && "ring-2 ring-primary rounded-[var(--card-border-radius)]"
//                         )}
//                         onClick={() => {
//                           field.onChange(role.id.toString());
//                           setSelectedRole(role.name);
//                         }}
//                       >
//                         <span>{role.name}</span>
//                         {selectedRole === role.name && <Check className="" />}
//                       </div>
//                     </CardShine>
//                   ))}
//                 </div>
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//       ),
//     },
//     {
//       id: 3,
//       title: "E qual é o motivo?",
//       number: 3,
//       description: "Explique o motivo",
//       content: (
//         <>
//           <FormField
//             control={form.control}
//             name="description"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Motivo</FormLabel>
//                 <FormControl>
//                   <Textarea
//                     placeholder="Explique o motivo."
//                     className="resize-none"
//                     {...field}
//                     onChange={(e) => {
//                       field.onChange(e);
//                       setDescription(e.target.value);
//                     }}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="attachments"
//             render={({ field }) => (
//               <FormItem className="mt-4">
//                 <FormLabel>Anexos</FormLabel>
//                 <FormControl>
//                   <div className="min-h-[100px]">
//                     <Input
//                       type="file"
//                       multiple
//                       onChange={handleFileChange}
//                       accept=".pdf,.doc,.docx,.txt"
//                     />
//                     {attachments.length > 0 && (
//                       <div className="mt-3 space-y-1">
//                         {attachments.map((file, index) => (
//                           <div key={index} className="bg-gray-200 pl-4 pr-2 py-0 rounded flex items-center justify-between">
//                             <div className="flex items-center">
//                               {getFileIcon(file.name)}
//                               <span className="truncate text-sm ml-2">{file.name}</span>
//                             </div>
//                             <Button
//                               type="button"
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => handleRemoveAttachment(index)}
//                               className="w-10 h-10 text-red-500 hover:text-red-700 hover:bg-red-200 rounded-full p-1"
//                             >
//                               <X size={16} />
//                             </Button>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </>
//       ),
//     },
//     {
//       id: 4,
//       title: "Resumo",
//       number: 4,
//       description: "Revise suas escolhas",
//       content: (
//         <div className="space-y-4">
//           <h3 className="text-xl font-semibold">Resumo da Solicitação</h3>
//           <p className="text-gray-900">Revise suas escolhas antes de enviar:</p>
//           <ul className="list-disc list-inside space-y-2 text-gray-700">
//             <li>Sistema: {form.getValues("clientId")}</li>
//             <li>Papel: {roles.find(role => role.id.toString() === form.getValues("roleId"))?.name || form.getValues("roleId")}</li>
//             <li>Motivo: {form.getValues("description")}</li>
//             {attachments.length > 0 && (
//               <li>
//                 Anexos:
//                 <ul className="list-disc list-inside ml-4">
//                   {attachments.map((file, index) => (
//                     <li key={index}>{file.name}</li>
//                   ))}
//                 </ul>
//               </li>
//             )}
//           </ul>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <>
//       <div className="flex items-center justify-between">
//         <Heading title={title} description={descriptionText} />
//       </div>
      
//       <Separator />

//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
//           {showContent && !hasError && (
//             <div className="flex flex-col gap-8 mt-16 max-w-lg">
//               <div className="flex justify-between mb-8">
//                 {steps.map((step, index) => (
//                   <motion.div
//                     key={step.id}
//                     className="flex flex-col items-center relative"
//                     initial={false}
//                     animate={{
//                       opacity: step.id <= currentStep ? 1 : 0.5,
//                       transition: { duration: 0.3 }
//                     }}
//                   >
//                     <motion.div
//                       className={cn(
//                         "w-10 h-10 rounded-full flex items-center justify-center z-10 cursor-pointer",
//                         step.id === currentStep
//                           ? "bg-primary text-primary-foreground"
//                           : step.id < currentStep
//                           ? form.formState.errors[step.id === 2 ? "roleId" : step.id === 1 ? "clientId" : "description"]
//                             ? "bg-red-500 text-white"
//                             : "bg-green-500 text-white"
//                           : "bg-gray-300"
//                       )}
//                       initial={false}
//                       animate={{
//                         scale: step.id === currentStep ? 1.2 : 1,
//                         transition: { duration: 0.3 }
//                       }}
//                       onClick={() => handleStepClick(step.id)}
//                     >
//                       <motion.span
//                         key={step.number}
//                         initial={{ opacity: 0, y: -10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: 10 }}
//                         transition={{ duration: 0.2 }}
//                       >
//                         {step.id < currentStep && !form.formState.errors[step.id === 2 ? "roleId" : step.id === 1 ? "clientId" : "description"]
//                           ? <Check className="w-6 h-6" />
//                           : step.number}
//                       </motion.span>
//                     </motion.div>
//                     <div className="mt-2 text-center">
//                       <h3 className="font-medium text-sm">{step.title}</h3>
//                       <p className="text-xs text-gray-400">{step.description}</p>
//                     </div>
//                     {index < steps.length - 1 && (
//                       <motion.div
//                         className="absolute top-5 left-[50px] h-[2px] w-[calc(100vw/4-50px)]"
//                         initial={{ backgroundColor: "#374151" }}
//                         animate={{
//                           backgroundColor: step.id < currentStep && !form.formState.errors[step.id === 2 ? "roleId" : step.id === 1 ? "clientId" : "description"]
//                             ? "#22c55e"
//                             : "#4B5563",
//                           opacity: step.id < currentStep ? 1 : 0
//                         }}
//                         transition={{ duration: 0.3 }}
//                       />
//                     )}
//                   </motion.div>
//                 ))}
//               </div>

//               <div className="mb-8 min-h-[320px]">
//                 <p className="text-gray-400 mb-2">Passo {currentStep}/{steps.length}</p>
//                 <AnimatePresence mode="wait">
//                   <motion.div
//                     key={currentStep}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -20 }}
//                     transition={{ duration: 0.3 }}
//                   >
//                     {steps[currentStep - 1].content}
//                   </motion.div>
//                 </AnimatePresence>
//               </div>

//               <div className="flex gap-x-4 mt-4">
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   className="bg-gray-200 text-primary hover:text-white hover:bg-[#000044]"
//                   onClick={handleBack}
//                   disabled={currentStep === 1}
//                 >
//                   Voltar
//                 </Button>
//                 {currentStep < steps.length ? (
//                   <Button
//                     className="bg-primary hover:bg-accent text-white"
//                     onClick={goToNextStep}
//                   >
//                     Próximo
//                   </Button>
//                 ) : (
//                   <Button
//                     className="bg-emerald-500 hover:bg-emerald-600 text-white"
//                     onClick={handleFinalSubmit}
//                   >
//                     Enviar
//                   </Button>
//                 )}
//               </div>
//             </div>
//           )}

//           {hasError && (
//             <>
//               <div className="lg:max-w-xl bg-red-900 flex flex-col ">
//                 <div className="text-2xl font-normal text-primary-foreground px-6 py-6">
//                   Ocorreu um erro.
//                   <FlipWords words={wordsError} />
//                 </div>
//                 <div className="lg:max-w-xl bg-red-500 p-1"></div>
//               </div>
//               <Button className="my-2 w-40" onClick={handleNewRequest}>
//                 Tentar novamente
//               </Button>
//             </>
//           )}

//           {!showContent && !hasError && (
//             <>
//               <div className="md:grid grid-cols-1 lg:max-w-xl">
//                 <div className="bg-primary flex px-6 py-6">
//                   <div className="text-2xl font-normal text-primary-foreground">
//                     Solicitação criada
//                     <FlipWords words={words} />
//                   </div>
//                 </div>
//                 <div className="bg-green-500 p-1"></div>
                
//                 <div className="grid grid-cols-2 gap-5 mt-6 px-1">
//                   <div className="font-bold space-y-3">
//                     <p>Sistema:</p>
//                     <p>Papel solicitado:</p>
//                     <p>Motivo:</p>
//                     {attachments.length > 0 && <p>Anexos:</p>}
//                   </div>
//                   <div className="space-y-3">
//                     <p>{selectedClient}</p>
//                     <p>{selectedRole}</p>
//                     <p>{description}</p>
//                     <ul>
//                       {attachments.map((file, index) => (
//                         <li key={index}>{file.name}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               </div>
              
//               <Link
//                 className="bg-[var(--dashboard-nav-bg)] text-primary rounded-full text-sm font-medium transition-colors hover:bg-[var(--button-hover)] hover:text-[var(--button-hover-text)] h-10 px-4 py-2.5 mt-4"
//                 to="/dashboard/my-access-requests/"
//               >
//                 Listar solicitações
//               </Link>
//               <Button className="ml-4 mt-4" onClick={handleNewRequest}>
//                 Solicitar novo acesso
//               </Button>
//             </>
//           )}

//           <StepLoader loading={loading} onClose={handleLoaderClose} />
//         </form>
//       </Form>

//       <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Confirmar envio</DialogTitle>
//             <DialogDescription>
//               Você tem certeza que deseja enviar esta solicitação?
//             </DialogDescription>
//           </DialogHeader>
//           <div className="py-4">
//             <h4 className="text-sm font-medium mb-2">Resumo da solicitação:</h4>
//             <ul className="list-disc list-inside space-y-1 text-sm">
//               <li>Sistema: {form.getValues("clientId")}</li>
//               <li>Papel: {roles.find(role => role.id.toString() === form.getValues("roleId"))?.name || form.getValues("roleId")}</li>
//               <li>Motivo: {form.getValues("description")}</li>
//               {attachments.length > 0 && (
//                 <li>
//                   Anexos:
//                   <ul className="list-disc list-inside ml-4">
//                     {attachments.map((file, index) => (
//                       <li key={index}>{file.name}</li>
//                     ))}
//                   </ul>
//                 </li>
//               )}
//             </ul>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)}>
//               Cancelar
//             </Button>
//             <Button onClick={handleConfirmSubmit}>Confirmar</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }

