import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../components/ui/use-toast";

import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Textarea } from "../ui/textarea";
import { Check, MonitorIcon as MonitorCog, Plus, FileIcon, FileText, Image, FileAudio, FileVideo, Search, ClipboardList, User, MonitorIcon } from 'lucide-react';
import { ScrollArea } from "../../components/ui/scroll-area";
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
import IconRenderer from "../icons/IconRenderer";
import { PilotoForm } from "../canvas/PilotoForm";

interface Client {
  id: number;
  clientId: string;
  description: string;
}

interface Role {
  id: number;
  name: string;
}

type ActionName = 'idle' | 'headshake' | 'hiphop';

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
  attachments: z
    .array(z.instanceof(File))
    .optional()
    // .refine((val) => !val || val.length > 0, {
    //   message: "Se fornecido, deve conter pelo menos um arquivo.",
    // }),
});

export function RequestAccessForm() {
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
  const [currentAnimation, setCurrentAnimation] = useState<ActionName>('idle');
  const [searchTerm, setSearchTerm] = useState(""); // Added state for search term

  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { description: "" },
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
    if (isAuthenticated) getClients();
  }, [isAuthenticated]);

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

  console.log(clients)

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
                <Popover>
                  <PopoverTrigger asChild>
                    <div
                      className={`max-w-96 w-full cursor-pointer ${selectedClient ? ' text-primary ' : ''}`}
                    >

                      <CardShine>

                        <div
                          className={cn(
                            "border border-dashed p-5 grid items-center min-h-[106px] h-auto transition-all rounded-[var(--card-border-radius)]",
                            selectedClient && "border-2 border-primary border-double rounded-[var(--card-border-radius)]"
                          )}
                        >
                          {!selectedClient && <Plus className="w-8 h-8 mt-2 mx-auto text-gray-400" />}
                          {selectedClient && <Check className="absolute top-4 right-4 flex-shrink-0" />}

                          <div className="flex flex-row items-center">
                            {selectedClient && <MonitorIcon className="w-6 h-6 mr-4" />}
                            <p className="font-bold text-lg">
                              {selectedClient}
                            </p>
                          </div>
                          
                          {selectedClient &&
                            <p className="mt-1 text-sm">
                              {clients.find(client => client.clientId === selectedClient)?.description || "Sem função atribuída"}
                            </p>
                          }
                          
                        </div>

                      </CardShine>
                      
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="relative w-[26em]  ml-0 lg:ml-[400px] -mt-[168px] mb-10" align="start">

                    <Search className="absolute left-6 top-6 text-primary z-10" />

                    <Input
                      type="text"
                      placeholder="Buscar sistema..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="mb-4 pl-10"
                    /> {/* Added search input */}
                    <ScrollArea className="h-[340px]">
                      <div className="space-y-2 grid grid-cols-1 gap-2">
                        {clients
                          .filter((client) =>
                            client.clientId.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map((client) => (
                            <CardShine key={client.id}>

                              <div
                                className={cn(
                                  "border p-5 grid items-center min-h-[106px] h-auto cursor-pointer transition-all rounded-[var(--card-border-radius)]",
                                  selectedClient === client.clientId &&  "border-2 border-primary border-double rounded-[var(--card-border-radius)]"
                                )}
                                onClick={() => {
                                  field.onChange(client.clientId);
                                  setSelectedClient(client.clientId);
                                  getRolesByClientId(client.clientId);
                                }}
                              >
                                {selectedClient && <Check className="absolute top-4 right-4 flex-shrink-0" />}

                                <div className="flex flex-row items-center">
                                  <MonitorIcon className="w-6 h-6 mr-4" />
                                  <p className="font-bold text-lg">
                                    {client.clientId}
                                  </p>
                                </div>
                                
                                <p className="mt-1 text-sm">
                                  {client.description}
                                </p>
                                
                                
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
                <div className="grid grid-cols-1 xl:grid-cols-2 max-w-xl md:flex-row gap-4">
                  {roles.map((role) => (
                    <div className="max-w-96" key={role.id}>

                      <CardShine>
                        <div
                          className={cn(
                            "flex flex-col p-5 cursor-pointer transition-all",
                            selectedRole === role.name && "ring-2 ring-primary rounded-[var(--card-border-radius)]"
                          )}
                          onClick={() => {
                            field.onChange(role.id.toString());
                            setSelectedRole(role.name);
                          }}
                        >
                          
                          <div className="flex flex-row items-center">
                            <IconRenderer className={`${role?.icon} w-6 h-6 mr-4`} />
                            <p className="font-bold text-lg capitalize">
                              {role.name}
                            </p>
                          </div>

                          {selectedRole === role.name && <Check className="absolute top-4 right-4" />}
                          <p className="mt-2 text-sm">
                            {role.label}
                          </p>
                        </div>

                      </CardShine>
                    </div>
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
              <FormItem className="max-w-xl">
                <h4 className="text-lg font-semibold mb-4">Conte-nos o motivo para solicitar este acesso</h4>
                <FormControl>
                  <Textarea
                    placeholder="Explique o motivo."
                    className="resize-none"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setDescription(e.target.value);
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
              <FormItem className="mt-4 max-w-xl">
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
                          <div key={index} className=" bg-white pl-4 pr-2 py-0 rounded flex items-center justify-between">
                            <div className="flex items-center">
                              {getFileIcon(file.name)}
                              {/* <span className="overflow-hidden truncate w-40 text-sm ml-2">{file.name}</span> */}

                              <span
                                className="overflow-hidden truncate w-40 text-sm ml-2"
                                title={file.name} // Nome completo exibido no tooltip
                              >
                                {file.name.length > 16
                                  ? `${file.name.slice(0, 16)}...${file.name.slice(-4)}`
                                  : file.name}
                              </span>
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
        <div className=" max-w-md bg-background shadow-lg rounded-[var(--card-border-radius)] p-6">
          <h3 className="text-lg font-semibold">Resumo da solicitação</h3>
          <p className="mt-1 mb-4 text-gray-900">Revise suas escolhas antes de enviar:</p>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <ClipboardList className="text-blue-500 w-5 h-5 " />
              <div>
                <strong>Sistema</strong>
                {selectedClient ? (
                  <p>
                    {form.getValues("clientId")}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Sistema não selecionado.
                  </p>
                )}
              </div>
            </li>
            <li className="flex items-center gap-3">
              <User className="text-blue-500 w-5 h-5" />
              <div>
                <strong>Papel</strong>
                {selectedRole ? (
                  <p>
                    {roles.find(role => role.id.toString() === form.getValues("roleId"))?.name || form.getValues("roleId")}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Nenhum papel foi selecionado.
                  </p>
                )}
              </div>
            </li>
            <li className="flex items-center gap-3">
              <FileText className="text-blue-500 w-5 h-5" />
              <div>
                <strong>Motivo</strong>
                {description ? (
                  <p>
                    {form.getValues("description")}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Sem descrição.
                  </p>
                )}
              </div>
            </li>
            {attachments.length > 0 && (
              <li className="">
                <strong>Anexos:</strong>
                <ul className="space-y-2 mt-4">
                  {attachments.map((file, index) => (

                    <li key={index} className=" bg-white pl-0 pr-2 py-0 rounded flex items-center justify-between">
                      <div className="flex items-center">

                        {getFileIcon(file.name)}

                        <span
                          className="overflow-hidden truncate w-40 text-sm ml-2"
                          title={file.name} // Nome completo exibido no tooltip
                        >
                          {file.name.length > 16
                            ? `${file.name.slice(0, 16)}...${file.name.slice(-4)}`
                            : file.name}
                        </span>
                      </div>
                    </li>

                  ))}
                </ul>
              </li>
            )}

          </ul>
        </div>
      ),
    },
  ];

  const updateStepState = useCallback(() => {
    setStepsState(prevState => {
      const newState = { ...prevState };
      for (let i = 1; i <= steps.length; i++) {
        if (i === 1) {
          newState[i] = form.getValues("clientId") ? 'completed' : (prevState[i] === 'error' ? 'error' : 'pending');
        } else if (i === 2) {
          newState[i] = form.getValues("roleId") ? 'completed' : (prevState[i] === 'error' ? 'error' : 'pending');
        } else if (i === 3) {
          newState[i] = form.getValues("description").length >= 10 ? 'completed' : (prevState[i] === 'error' ? 'error' : 'pending');
        } else if (i === 4) {
          newState[i] = (form.getValues("clientId") && form.getValues("roleId") && form.getValues("description").length >= 10)
            ? 'completed'
            : (prevState[i] === 'error' ? 'error' : 'pending');
        }
      }
      return newState;
    });

    if (form.getValues("clientId") &&
        form.getValues("roleId") &&
        form.getValues("description").length >= 10) {
      setCurrentAnimation('hiphop');
    } else {
      setCurrentAnimation('idle');
    }
  }, [form, steps.length]);

  useEffect(() => {
    const subscription = form.watch(() => {
      updateStepState();
    });
    return () => subscription.unsubscribe();
  }, [form, updateStepState]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (currentStep < steps.length) {
      goToNextStep();
    }
  }

  const handleFinalSubmit = async () => {
    setIsFormSubmitted(true);
    const isValid = await form.trigger();
    if (!isValid) {
      setStepsState(prevState => {
        const newState = { ...prevState };
        for (let i = 1; i <= steps.length; i++) {
          if (i === 1) {
            newState[i] = form.getValues("clientId") ? 'completed' : 'error';
          } else if (i === 2) {
            newState[i] = form.getValues("roleId") ? 'completed' : 'error';
          } else if (i === 3) {
            newState[i] = form.getValues("description").length >= 10 ? 'completed' : 'error';
          } else if (i === 4) {
            newState[i] = (form.getValues("clientId") && form.getValues("roleId") && form.getValues("description").length >= 10)
              ? 'completed'
              : 'error';
          }
        }
        return newState;
      });
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      setCurrentAnimation('headshake');
      return;
    }

    setCurrentAnimation('hiphop');
    setIsConfirmModalOpen(true);
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
        toast({
          title: "Solicitação enviada com sucesso!",
          description: "Sua solicitação foi processada.",
        });
        // Navegue para a página de listagem de solicitações
        navigate('/dashboard/my-access-requests');
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
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    if (validFiles.length + attachments.length > 3) {
      toast({
        title: "Limite de arquivos excedido",
        description: "O número máximo de arquivos permitidos é 3.",
        variant: "destructive",
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
    setCurrentAnimation('idle');
    setSearchTerm(""); // Reset search term
  };

  const handleLoaderClose = () => {
    setLoading(false);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleStepClick = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    if (!isFormSubmitted) {
      updateStepState();
    }
  };

  const title = "Solicitar acesso";
  const descriptionText = "Preencha o formulário e solicite acesso a um sistema.";
  const words = ["com sucesso.", "rapidamente."];
  const wordsError = ["Tente novamente.", "Vamos tentar de novo!"];

  const goToNextStep = () => {
    if (currentStep < steps.length) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (!isFormSubmitted) {
        updateStepState();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      if (!isFormSubmitted) {
        updateStepState();
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={descriptionText} />
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 relative">

          <motion.div
            initial={{
              opacity: 0,
              x: -500
            }}
            animate={{
              opacity: 1,
              x: 0,
              transition: { duration: 0.8, delay: 0.3, ease: "easeOut" }
            }}
            className={`absolute h-[500px] bottom-0 -left-60 lg:-bottom-20 lg:-left-72 z-10 pointer-events-none ${hasError ? 'hidden lg:-bottom-60 lg:-left-32' : ''} ${!showContent && !hasError ? '-bottom-80 -left-96 lg:-bottom-40 lg:left-2' : ''}`}
          >
            <PilotoForm currentAnimation={currentAnimation} />
          </motion.div>

          {showContent && !hasError && (

            <motion.div
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1,
                transition: { duration: 0.3, delay: 0.3, ease: "easeInOut" }
              }}
              className="  grid grid-cols-1 lg:grid-cols-[360px,1fr] xl:grid-cols-[400px,1fr] gap-4 "
            >


              <div className="relative py-8 rounded-xl space-y-10 sm:space-y-12 min-h-[280px] sm:min-h-[340px]">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    className="block sm:flex items-start relative"
                    initial={false}
                    animate={{
                      opacity: step.id <= currentStep ? 1 : 0.5,
                      transition: { duration: 0.3, ease: "easeInOut" }
                    }}
                  >

                    <motion.div
                      className={cn(
                        "w-10 h-10 hover:bg-gray-200 rounded-full flex items-center justify-center z-10 cursor-pointer",
                        step.id === currentStep
                          ? "hover:bg-primary bg-primary text-primary-foreground"
                          : stepsState[step.id] === 'completed'
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : stepsState[step.id] === 'error'
                          ? "bg-red-500 hover:bg-red-700 text-white"
                          : "bg-[var(--bg-indicator)]"
                      )}
                      // initial={false}
                      initial={{ opacity: 0, x: -500 }}
                      animate={{
                        scale: step.id === currentStep ? 1.1 : 1,
                        transition: { duration: 0.3, ease: "easeOut", delay: 0.3 },
                        opacity: 1, x: 0
                      }}
                      onClick={() => handleStepClick(step.id)}
                    >

                      <motion.span
                        key={step.number}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
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
                        className={`text-md xl:text-lg -mt-8 sm:mt-2 ${step.id === currentStep ? 'font-bold' : ''}`}
                      >
                        {step.title}
                      </h3>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: -100 }}
                      animate={{
                        opacity: 1,
                        y: 0
                      }}
                      transition={{ duration: 2.8 }}

                      className="absolute left-5 top-10 w-[2px] h-[calc(70%+24px)] last:h-[0px] bg-gray-300"
                    >
                      </motion.div>

                    {index < steps.length - 1 && (
                      <motion.div
                        className="absolute left-5 top-10 w-[2px] h-[calc(100%+24px)]"
                        initial={{ backgroundColor: "#b2b2b2", y: -500 }}

                        animate={{
                          backgroundColor: stepsState[step.id] === 'completed' && stepsState[step.id + 1] === 'completed' ? "#22c55e" : "#b2b2b2",
                          opacity: step.id < currentStep ? 1 : 0,
                          y: 0,
                        }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                      />
                    )}

                  </motion.div>
                ))}

              </div>

              <div className="bg-secondary p-6 rounded-xl min-h-[640px] relative">
                <div className="mb-8 min-h-[480px]">
                  <p className="text-gray-600 mb-2">Passo {currentStep}/{steps.length}</p>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      {steps[currentStep - 1].content}
                    </motion.div>
                  </AnimatePresence>
                </div>


                <div className=" absolute bottom-6 flex gap-x-4 mt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    className="bg-secondary text-primary "
                    onClick={handleBack}
                    disabled={currentStep === 1}
                  >
                    Voltar
                  </Button>
                  {currentStep < steps.length ? (
                    <Button
                      className="w-40 bg-primary text-primary-foreground"
                      onClick={goToNextStep}
                    >
                      Próximo
                    </Button>
                  ) : (
                    <Button
                      className="w-40 bg-emerald-500 text-primary-foreground"
                      onClick={handleFinalSubmit}
                    >
                      Enviar
                    </Button>
                  )}
                </div>

              </div>


            </motion.div>
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
            <ul className="space-y-1 text-sm">
              <li><strong>Sistema:</strong> {form.getValues("clientId")}</li>
              <li><strong>Papel:</strong> {roles.find(role => role.id.toString() === form.getValues("roleId"))?.name || form.getValues("roleId")}</li>
              <li><strong>Motivo:</strong> {form.getValues("description")}</li>
              {attachments.length > 0 && (
                <li>
                  <strong>Anexos:</strong>
                  <ul className="">
                    {attachments.map((file, index) => (
                      <li key={index}>- {file.name}</li>
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





// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { useEffect, useState, useCallback } from "react";
// import { Link } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { useToast } from "../../components/ui/use-toast";

// import { Button } from "../../components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "../../components/ui/form";
// import { Input } from "../../components/ui/input";
// import { Textarea } from "../ui/textarea";
// import { Check, MonitorIcon as MonitorCog, Plus, FileIcon, FileText, Image, FileAudio, FileVideo, Search, ClipboardList, User, MonitorIcon } from 'lucide-react';
// import { ScrollArea } from "../../components/ui/scroll-area";
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
// import IconRenderer from "../icons/IconRenderer";
// import { PilotoForm } from "../canvas/PilotoForm";

// interface Client {
//   id: number;
//   clientId: string;
//   description: string;
// }

// interface Role {
//   id: number;
//   name: string;
// }

// type ActionName = 'idle' | 'headshake' | 'hiphop';

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
//   attachments: z
//     .array(z.instanceof(File))
//     .optional()
//     // .refine((val) => !val || val.length > 0, {
//     //   message: "Se fornecido, deve conter pelo menos um arquivo.",
//     // }),
// });

// export function RequestAccessForm() {
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
//   const [stepsState, setStepsState] = useState<Record<number, 'pending' | 'completed' | 'error'>>({
//     1: 'pending',
//     2: 'pending',
//     3: 'pending',
//     4: 'pending'
//   });
//   const [isFormSubmitted, setIsFormSubmitted] = useState(false);
//   const [currentAnimation, setCurrentAnimation] = useState<ActionName>('idle');
//   const [searchTerm, setSearchTerm] = useState(""); // Added state for search term

//   const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
//   const { toast } = useToast();

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: { description: "" },
//   });

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

//   console.log(clients)

//   const steps = [
//     {
//       id: 1,
//       title: "Para qual sistema você quer acesso?",
//       number: 1,
//       description: "Escolha o sistema que você quer se conectar.",
//       content: (
//         <FormField
//           control={form.control}
//           name="clientId"
//           render={({ field }) => (
//             <FormItem>
//               <h4 className="text-lg font-semibold mb-4">Escolha o sistema que você precisa de acesso:</h4>
//               <FormControl>
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <div
//                       className={`max-w-96 w-full cursor-pointer ${selectedClient ? ' text-primary ' : ''}`}
//                     >

//                       <CardShine>

//                         <div
//                           className={cn(
//                             "border border-dashed p-5 grid items-center min-h-[106px] h-auto transition-all rounded-[var(--card-border-radius)]",
//                             selectedClient && "border-2 border-primary border-double rounded-[var(--card-border-radius)]"
//                           )}
//                         >
//                           {!selectedClient && <Plus className="w-8 h-8 mt-2 mx-auto text-gray-400" />}
//                           {selectedClient && <Check className="absolute top-4 right-4 flex-shrink-0" />}

//                           <div className="flex flex-row items-center">
//                             {selectedClient && <MonitorIcon className="w-6 h-6 mr-4" />}
//                             <p className="font-bold text-lg">
//                               {selectedClient}
//                             </p>
//                           </div>
                          
//                           {selectedClient &&
//                             <p className="mt-1 text-sm">
//                               {clients.find(client => client.clientId === selectedClient)?.description || "Sem função atribuída"}
//                             </p>
//                           }
                          
//                         </div>

//                       </CardShine>
                      
//                     </div>
//                   </PopoverTrigger>
//                   <PopoverContent className="relative w-[26em]  ml-0 lg:ml-[400px] -mt-[168px] mb-10" align="start">

//                     <Search className="absolute left-6 top-6 text-primary z-10" />

//                     <Input
//                       type="text"
//                       placeholder="Buscar sistema..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="mb-4 pl-10"
//                     /> {/* Added search input */}
//                     <ScrollArea className="h-[340px]">
//                       <div className="space-y-2 grid grid-cols-1 gap-2">
//                         {clients
//                           .filter((client) =>
//                             client.clientId.toLowerCase().includes(searchTerm.toLowerCase())
//                           )
//                           .map((client) => (
//                             <CardShine key={client.id}>

//                               <div
//                                 className={cn(
//                                   "border p-5 grid items-center min-h-[106px] h-auto cursor-pointer transition-all rounded-[var(--card-border-radius)]",
//                                   selectedClient === client.clientId &&  "border-2 border-primary border-double rounded-[var(--card-border-radius)]"
//                                 )}
//                                 onClick={() => {
//                                   field.onChange(client.clientId);
//                                   setSelectedClient(client.clientId);
//                                   getRolesByClientId(client.clientId);
//                                 }}
//                               >
//                                 {selectedClient && <Check className="absolute top-4 right-4 flex-shrink-0" />}

//                                 <div className="flex flex-row items-center">
//                                   <MonitorIcon className="w-6 h-6 mr-4" />
//                                   <p className="font-bold text-lg">
//                                     {client.clientId}
//                                   </p>
//                                 </div>
                                
//                                 <p className="mt-1 text-sm">
//                                   {client.description}
//                                 </p>
                                
                                
//                               </div>

//                             </CardShine>

//                           ))}
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
//       title: "Qual será o seu papel?",
//       number: 2,
//       description: "Escolha como você irá usar o sistema.",
//       content: (
//         <FormField
//           control={form.control}
//           name="roleId"
//           render={({ field }) => (
//             <FormItem>
//               <h4 className="text-lg font-semibold mb-4">Selecione seu papel no sistema</h4>
//               <FormControl>
//                 <div className="grid grid-cols-1 xl:grid-cols-2 max-w-xl md:flex-row gap-4">
//                   {roles.map((role) => (
//                     <div className="max-w-96" key={role.id}>

//                       <CardShine>
//                         <div
//                           className={cn(
//                             "flex flex-col p-5 cursor-pointer transition-all",
//                             selectedRole === role.name && "ring-2 ring-primary rounded-[var(--card-border-radius)]"
//                           )}
//                           onClick={() => {
//                             field.onChange(role.id.toString());
//                             setSelectedRole(role.name);
//                           }}
//                         >
                          
//                           <div className="flex flex-row items-center">
//                             <IconRenderer className={`${role?.icon} w-6 h-6 mr-4`} />
//                             <p className="font-bold text-lg capitalize">
//                               {role.name}
//                             </p>
//                           </div>

//                           {selectedRole === role.name && <Check className="absolute top-4 right-4" />}
//                           <p className="mt-2 text-sm">
//                             {role.label}
//                           </p>
//                         </div>

//                       </CardShine>
//                     </div>
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
//       title: "Por que você precisa desse acesso?",
//       number: 3,
//       description: "Nos ajude a entender o porquê deste acesso.",
//       content: (
//         <>
//           <FormField
//             control={form.control}
//             name="description"
//             render={({ field }) => (
//               <FormItem className="max-w-xl">
//                 <h4 className="text-lg font-semibold mb-4">Conte-nos o motivo para solicitar este acesso</h4>
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
//                 <p className="text-sm text-gray-500 mt-2">
//                   {field.value.length}/10 caracteres mínimos
//                 </p>
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="attachments"
//             render={({ field }) => (
//               <FormItem className="mt-4 max-w-xl">
//                 <h4 className="text-lg font-semibold mb-4">Adicione arquivos que ajudem a justificar sua solicitação (opcional)</h4>
//                 <FormControl>
//                   <div className="min-h-[100px]">
//                     <Input
//                       type="file"
//                       multiple
//                       onChange={handleFileChange}
//                       accept=".pdf,.doc,.docx,.txt"
//                     />
//                     {attachments.length > 0 && (
//                       <div className="mt-3 space-y-2">
//                         {attachments.map((file, index) => (
//                           <div key={index} className=" bg-white pl-4 pr-2 py-0 rounded flex items-center justify-between">
//                             <div className="flex items-center">
//                               {getFileIcon(file.name)}
//                               {/* <span className="overflow-hidden truncate w-40 text-sm ml-2">{file.name}</span> */}

//                               <span
//                                 className="overflow-hidden truncate w-40 text-sm ml-2"
//                                 title={file.name} // Nome completo exibido no tooltip
//                               >
//                                 {file.name.length > 16
//                                   ? `${file.name.slice(0, 16)}...${file.name.slice(-4)}`
//                                   : file.name}
//                               </span>
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
//       title: "Confira os detalhes antes de enviar!",
//       number: 4,
//       description: "Certifique-se de que está tudo certo antes de enviar.",
//       content: (
//         <div className=" max-w-md bg-background shadow-lg rounded-[var(--card-border-radius)] p-6">
//           <h3 className="text-lg font-semibold">Resumo da solicitação</h3>
//           <p className="mt-1 mb-4 text-gray-900">Revise suas escolhas antes de enviar:</p>
//           <ul className="space-y-4">
//             <li className="flex items-center gap-3">
//               <ClipboardList className="text-blue-500 w-5 h-5 " />
//               <div>
//                 <strong>Sistema</strong>
//                 {selectedClient ? (
//                   <p>
//                     {form.getValues("clientId")}
//                   </p>
//                 ) : (
//                   <p className="text-sm text-gray-500 italic">
//                     Sistema não selecionado.
//                   </p>
//                 )}
//               </div>
//             </li>
//             <li className="flex items-center gap-3">
//               <User className="text-blue-500 w-5 h-5" />
//               <div>
//                 <strong>Papel</strong>
//                 {selectedRole ? (
//                   <p>
//                     {roles.find(role => role.id.toString() === form.getValues("roleId"))?.name || form.getValues("roleId")}
//                   </p>
//                 ) : (
//                   <p className="text-sm text-gray-500 italic">
//                     Nenhum papel foi selecionado.
//                   </p>
//                 )}
//               </div>
//             </li>
//             <li className="flex items-center gap-3">
//               <FileText className="text-blue-500 w-5 h-5" />
//               <div>
//                 <strong>Motivo</strong>
//                 {description ? (
//                   <p>
//                     {form.getValues("description")}
//                   </p>
//                 ) : (
//                   <p className="text-sm text-gray-500 italic">
//                     Sem descrição.
//                   </p>
//                 )}
//               </div>
//             </li>
//             {/* {attachments.length > 0 && (
//               <li>
//                 <strong>Anexos:</strong>
//                 <ul className="">
//                   {attachments.map((file, index) => (
//                     <li className="text-sm" key={index}>- {file.name}</li>
//                   ))}
//                 </ul>
//               </li>
//             )} */}

//             {attachments.length > 0 && (
//               <li className="">
//                 <strong>Anexos:</strong>
//                 <ul className="space-y-2 mt-4">
//                   {attachments.map((file, index) => (

//                     <li key={index} className=" bg-white pl-0 pr-2 py-0 rounded flex items-center justify-between">
//                       <div className="flex items-center">

//                         {getFileIcon(file.name)}

//                         <span
//                           className="overflow-hidden truncate w-40 text-sm ml-2"
//                           title={file.name} // Nome completo exibido no tooltip
//                         >
//                           {file.name.length > 16
//                             ? `${file.name.slice(0, 16)}...${file.name.slice(-4)}`
//                             : file.name}
//                         </span>
//                       </div>
//                     </li>

//                   ))}
//                 </ul>
//               </li>
//             )}

//           </ul>
//         </div>
//       ),
//     },
//   ];

//   const updateStepState = useCallback(() => {
//     setStepsState(prevState => {
//       const newState = { ...prevState };
//       for (let i = 1; i <= steps.length; i++) {
//         if (i === 1) {
//           newState[i] = form.getValues("clientId") ? 'completed' : (prevState[i] === 'error' ? 'error' : 'pending');
//         } else if (i === 2) {
//           newState[i] = form.getValues("roleId") ? 'completed' : (prevState[i] === 'error' ? 'error' : 'pending');
//         } else if (i === 3) {
//           newState[i] = form.getValues("description").length >= 10 ? 'completed' : (prevState[i] === 'error' ? 'error' : 'pending');
//         } else if (i === 4) {
//           newState[i] = (form.getValues("clientId") && form.getValues("roleId") && form.getValues("description").length >= 10)
//             ? 'completed'
//             : (prevState[i] === 'error' ? 'error' : 'pending');
//         }
//       }
//       return newState;
//     });

//     if (form.getValues("clientId") &&
//         form.getValues("roleId") &&
//         form.getValues("description").length >= 10) {
//       setCurrentAnimation('hiphop');
//     } else {
//       setCurrentAnimation('idle');
//     }
//   }, [form, steps.length]);

//   useEffect(() => {
//     const subscription = form.watch(() => {
//       updateStepState();
//     });
//     return () => subscription.unsubscribe();
//   }, [form, updateStepState]);

//   async function onSubmit(data: z.infer<typeof formSchema>) {
//     if (currentStep < steps.length) {
//       goToNextStep();
//     }
//   }

//   const handleFinalSubmit = async () => {
//     setIsFormSubmitted(true);
//     const isValid = await form.trigger();
//     if (!isValid) {
//       setStepsState(prevState => {
//         const newState = { ...prevState };
//         for (let i = 1; i <= steps.length; i++) {
//           if (i === 1) {
//             newState[i] = form.getValues("clientId") ? 'completed' : 'error';
//           } else if (i === 2) {
//             newState[i] = form.getValues("roleId") ? 'completed' : 'error';
//           } else if (i === 3) {
//             newState[i] = form.getValues("description").length >= 10 ? 'completed' : 'error';
//           } else if (i === 4) {
//             newState[i] = (form.getValues("clientId") && form.getValues("roleId") && form.getValues("description").length >= 10)
//               ? 'completed'
//               : 'error';
//           }
//         }
//         return newState;
//       });
//       toast({
//         title: "Erro",
//         description: "Por favor, preencha todos os campos obrigatórios.",
//         variant: "destructive",
//       });
//       setCurrentAnimation('headshake');
//       return;
//     }

//     setCurrentAnimation('hiphop');
//     setIsConfirmModalOpen(true);
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
//           variant: "destructive",
//         });
//         return false;
//       }
//       return true;
//     });

//     if (validFiles.length + attachments.length > 3) {
//       toast({
//         title: "Limite de arquivos excedido",
//         description: "O número máximo de arquivos permitidos é 3.",
//         variant: "destructive",
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
//     setStepsState({
//       1: 'pending',
//       2: 'pending',
//       3: 'pending',
//       4: 'pending'
//     });
//     setIsFormSubmitted(false);
//     setCurrentAnimation('idle');
//     setSearchTerm(""); // Reset search term
//   };

//   const handleLoaderClose = () => {
//     setLoading(false);
//   };

//   const handleRemoveAttachment = (index: number) => {
//     setAttachments(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleStepClick = (stepNumber: number) => {
//     setCurrentStep(stepNumber);
//     if (!isFormSubmitted) {
//       updateStepState();
//     }
//   };

//   const title = "Solicitar acesso";
//   const descriptionText = "Preencha o formulário e solicite acesso a um sistema.";
//   const words = ["com sucesso.", "rapidamente."];
//   const wordsError = ["Tente novamente.", "Vamos tentar de novo!"];

//   const goToNextStep = () => {
//     if (currentStep < steps.length) {
//       const nextStep = currentStep + 1;
//       setCurrentStep(nextStep);
//       if (!isFormSubmitted) {
//         updateStepState();
//       }
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 1) {
//       const prevStep = currentStep - 1;
//       setCurrentStep(prevStep);
//       if (!isFormSubmitted) {
//         updateStepState();
//       }
//     }
//   };

//   return (
//     <>
//       <div className="flex items-center justify-between">
//         <Heading title={title} description={descriptionText} />
//       </div>

//       <Separator />

//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 relative">

//           <motion.div
//             initial={{
//               opacity: 0,
//               x: -500
//             }}
//             animate={{
//               opacity: 1,
//               x: 0,
//               transition: { duration: 0.8, delay: 0.3, ease: "easeOut" }
//             }}
//             className={`absolute h-[500px] bottom-0 -left-60 lg:-bottom-20 lg:-left-72 z-10 pointer-events-none ${hasError ? 'hidden lg:-bottom-60 lg:-left-32' : ''} ${!showContent && !hasError ? '-bottom-80 -left-96 lg:-bottom-40 lg:left-2' : ''}`}
//           >
//             <PilotoForm currentAnimation={currentAnimation} />
//           </motion.div>

//           {showContent && !hasError && (

//             <motion.div
//               initial={{
//                 opacity: 0
//               }}
//               animate={{
//                 opacity: 1,
//                 transition: { duration: 0.3, delay: 0.3, ease: "easeInOut" }
//               }}
//               className="  grid grid-cols-1 lg:grid-cols-[360px,1fr] xl:grid-cols-[400px,1fr] gap-4 "
//             >


//               <div className="relative py-8 rounded-xl space-y-10 sm:space-y-12 min-h-[280px] sm:min-h-[340px]">
//                 {steps.map((step, index) => (
//                   <motion.div
//                     key={step.id}
//                     className="block sm:flex items-start relative"
//                     initial={false}
//                     animate={{
//                       opacity: step.id <= currentStep ? 1 : 0.5,
//                       transition: { duration: 0.3, ease: "easeInOut" }
//                     }}
//                   >

//                     <motion.div
//                       className={cn(
//                         "w-10 h-10 hover:bg-gray-200 rounded-full flex items-center justify-center z-10 cursor-pointer",
//                         step.id === currentStep
//                           ? "hover:bg-primary bg-primary text-primary-foreground"
//                           : stepsState[step.id] === 'completed'
//                           ? "bg-green-500 hover:bg-green-600 text-white"
//                           : stepsState[step.id] === 'error'
//                           ? "bg-red-500 hover:bg-red-700 text-white"
//                           : "bg-[var(--bg-indicator)]"
//                       )}
//                       // initial={false}
//                       initial={{ opacity: 0, x: -500 }}
//                       animate={{
//                         scale: step.id === currentStep ? 1.1 : 1,
//                         transition: { duration: 0.3, ease: "easeOut", delay: 0.3 },
//                         opacity: 1, x: 0
//                       }}
//                       onClick={() => handleStepClick(step.id)}
//                     >

//                       <motion.span
//                         key={step.number}
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         transition={{ duration: 0.2 }}
//                       >
//                         {stepsState[step.id] === 'completed' ? (
//                           <Check className="w-6 h-6" />
//                         ) : (
//                           <span className={stepsState[step.id] === 'completed' ? 'text-white' : ''}>{step.number}</span>
//                         )}
//                       </motion.span>

//                     </motion.div>

//                     <div className="ml-14 sm:mt-0 sm:ml-4">
//                       <h3
//                         className={`text-md xl:text-lg -mt-8 sm:mt-2 ${step.id === currentStep ? 'font-bold' : ''}`}
//                       >
//                         {step.title}
//                       </h3>
//                     </div>

//                     <motion.div
//                       initial={{ opacity: 0, y: -100 }}
//                       animate={{
//                         opacity: 1,
//                         y: 0
//                       }}
//                       transition={{ duration: 2.8 }}

//                       className="absolute left-5 top-10 w-[2px] h-[calc(70%+24px)] last:h-[0px] bg-gray-300"
//                     >
//                       </motion.div>

//                     {index < steps.length - 1 && (
//                       <motion.div
//                         className="absolute left-5 top-10 w-[2px] h-[calc(100%+24px)]"
//                         initial={{ backgroundColor: "#b2b2b2", y: -500 }}

//                         animate={{
//                           backgroundColor: stepsState[step.id] === 'completed' && stepsState[step.id + 1] === 'completed' ? "#22c55e" : "#b2b2b2",
//                           opacity: step.id < currentStep ? 1 : 0,
//                           y: 0,
//                         }}
//                         transition={{ duration: 0.3, delay: 0.5 }}
//                       />
//                     )}

//                   </motion.div>
//                 ))}

//               </div>

//               <div className="bg-secondary p-6 rounded-xl min-h-[640px] relative">
//                 <div className="mb-8 min-h-[480px]">
//                   <p className="text-gray-600 mb-2">Passo {currentStep}/{steps.length}</p>
//                   <AnimatePresence mode="wait">
//                     <motion.div
//                       key={currentStep}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -20 }}
//                       transition={{ duration: 0.3, ease: "easeInOut" }}
//                     >
//                       {steps[currentStep - 1].content}
//                     </motion.div>
//                   </AnimatePresence>
//                 </div>


//                 <div className=" absolute bottom-6 flex gap-x-4 mt-4">
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     className="bg-secondary text-primary "
//                     onClick={handleBack}
//                     disabled={currentStep === 1}
//                   >
//                     Voltar
//                   </Button>
//                   {currentStep < steps.length ? (
//                     <Button
//                       className="w-40 bg-primary text-primary-foreground"
//                       onClick={goToNextStep}
//                     >
//                       Próximo
//                     </Button>
//                   ) : (
//                     <Button
//                       className="w-40 bg-emerald-500 text-primary-foreground"
//                       onClick={handleFinalSubmit}
//                     >
//                       Enviar
//                     </Button>
//                   )}
//                 </div>

//               </div>


//             </motion.div>
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
//             <ul className="space-y-1 text-sm">
//               <li><strong>Sistema:</strong> {form.getValues("clientId")}</li>
//               <li><strong>Papel:</strong> {roles.find(role => role.id.toString() === form.getValues("roleId"))?.name || form.getValues("roleId")}</li>
//               <li><strong>Motivo:</strong> {form.getValues("description")}</li>
//               {attachments.length > 0 && (
//                 <li>
//                   <strong>Anexos:</strong>
//                   <ul className="">
//                     {attachments.map((file, index) => (
//                       <li key={index}>- {file.name}</li>
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

