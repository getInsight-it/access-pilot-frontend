// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";

// import { Button } from "../../components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../components/ui/select";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "../../components/ui/form";
// import { Input } from "../../components/ui/input";
// import { toast } from "../ui/use-toast";
// import { Textarea } from "../ui/textarea";
// import { HttpRequestResponse } from "@getinsight.it/getinsight-common";
// import { RequestService } from "../../services/request/request-service";
// import { useEffect, useState } from "react";
// import { clientService } from "../../services/client";
// import { roleService } from "../../services/role";
// import useAuthStore from "../../store/authStore";
// import { httpClient } from "../../config/http/http";
// import { StepLoader } from "../steploader/StepLoader";
// import { Heading } from "../ui/heading";
// import { Separator } from "@radix-ui/react-separator";
// import { Link } from "react-router-dom";
// import { FlipWords } from "../ui/flip-words";

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
//     required_error: "Selecione uma função.",
//   }),
//   description: z
//     .string()
//     .min(10, { message: "Deve conter ao menos 10 caracteres." })
//     .max(160, { message: "Não deve exceder 160 caracteres." }),
//   attachments: z.array(z.instanceof(File)).optional(),
// });

// export function RequestAccessForm() {
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [clients, setClients] = useState<Client[]>([]);
//   const [showContent, setShowContent] = useState(true);
//   const [attachments, setAttachments] = useState<File[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [hasError, setHasError] = useState(false);
//   const [selectedClient, setSelectedClient] = useState<string | null>(null);
//   const [selectedRole, setSelectedRole] = useState<string | null>(null);
//   const [description, setDescription] = useState<string>("");

//   const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);

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
//     setLoading(true);
//     setHasError(false); // Resetamos o erro no início da submissão
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 2000)); // Atraso simulado

//       const requestService = new RequestService(httpClient);
//       const formData = new FormData();
//       formData.append("request", JSON.stringify({ roleId: data.roleId, description: data.description }));

//       if (attachments.length > 0) {
//         attachments.forEach((file) => formData.append("attachments", file));
//       }

//       const headers = new Map<string, string>();
//       headers.set("Content-Type", "multipart/form-data");

//       const response = await requestService.createRequest(formData, headers);

//       if (response instanceof HttpRequestResponse) {
//         toast({
//           title: "Solicitação enviada com sucesso!",
//           description: "Sua solicitação foi processada.",
//         });
//         setShowContent(false);
//         setSelectedClient(clients.find(client => client.clientId === data.clientId)?.clientId || null);
//         setSelectedRole(roles.find(role => role.id.toString() === data.roleId)?.name || null);
//         setDescription(data.description);
//       } else {
//         throw new Error("Erro ao enviar solicitação");
//       }
//     } catch (error) {
//       toast({
//         title: "Erro",
//         description: "Ocorreu um erro ao processar sua solicitação.",
//       });
//       setHasError(true);
//     } finally {
//       setLoading(false);
//     }
//   }

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFiles = Array.from(e.target.files || []);
//     const maxFileSize = 5 * 1024 * 1024; // 5MB em bytes

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
//       clientId: "",  // Valores padrão explícitos para cada campo
//       roleId: "",
//       description: "",
//       attachments: [],
//     });
//     setShowContent(true);
//     setAttachments([]);
//     setSelectedClient(null);
//     setSelectedRole(null);
//     setDescription("");
//     setHasError(false);  // Esconde a mensagem de erro
//   };  

//   const handleLoaderClose = () => {
//     setLoading(false);
//   };

//   const title = "Solicitar acesso";
//   const descriptionText = "Preencha o formulário e solicite acesso a um sistema.";
//   const words = ["com sucesso.", "rapidamente."];
//   const wordsError = ["Tente novamente.", "Vamos tentar de novo!"];

//   return (
//     <>
//       <div className="flex items-center justify-between">
//         <Heading title={title} description={descriptionText} />
//       </div>
      
//       <Separator />

//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//           {showContent && !hasError && (
//             <>
//               <div className="w-full lg:max-w-xl flex flex-col gap-y-4">
//                 <FormField
//                   control={form.control}
//                   name="clientId"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Sistema</FormLabel>
//                       <Select
//                         onValueChange={(value) => {
//                           field.onChange(value);
//                           setSelectedClient(value);
//                           getRolesByClientId(value);
//                         }}
//                         defaultValue={field.value}
//                       >
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Selecione um sistema" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {clients.length > 0 ? (
//                             clients.map((client) => (
//                               <SelectItem key={client.id} value={client.clientId}>
//                                 {client.clientId}
//                               </SelectItem>
//                             ))
//                           ) : (
//                             <p>Nenhum sistema encontrado</p>
//                           )}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="roleId"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Função</FormLabel>
//                       <Select
//                         onValueChange={(value) => {
//                           field.onChange(value);
//                           setSelectedRole(roles.find(role => role.id.toString() === value)?.name || null);
//                         }}
//                         defaultValue={field.value}
//                       >
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Selecione uma função" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {roles.length > 0 ? (
//                             roles.map((role) => (
//                               <SelectItem key={role.id} value={role.id.toString()}>
//                                 {role.name}
//                               </SelectItem>
//                             ))
//                           ) : (
//                             <p>Nenhuma função encontrada</p>
//                           )}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="description"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Motivo</FormLabel>
//                       <FormControl>
//                         <Textarea
//                           placeholder="Explique o motivo."
//                           className="resize-none"
//                           {...field}
//                           onChange={(e) => {
//                             field.onChange(e);
//                             setDescription(e.target.value);
//                           }}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="attachments"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Anexos</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="file"
//                           multiple
//                           onChange={handleFileChange}
//                           accept=".pdf,.doc,.docx,.txt"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               {!hasError && (
//                 <Button type="submit">Solicitar acesso</Button>
//               )}
//             </>
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
//                     <p>Função solicitada:</p>
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
//     </>
//   );
// }









// trabalhando os cards
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
import { Check } from 'lucide-react';
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
import { CardShine } from "../CardShine";

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
    required_error: "Selecione uma função.",
  }),
  description: z
    .string()
    .min(10, { message: "Deve conter ao menos 10 caracteres." })
    .max(160, { message: "Não deve exceder 160 caracteres." }),
  attachments: z.array(z.instanceof(File)).optional(),
});

export function RequestAccessForm() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [showContent, setShowContent] = useState(true);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");

  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);

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
  };  

  const handleLoaderClose = () => {
    setLoading(false);
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {showContent && !hasError && (
            <>
              <div className="w-full lg:max-w-xl flex flex-col gap-y-4">
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sistema</FormLabel>
                      <FormControl>
                        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                          <div className="flex w-max space-x-4 p-4">
                            
                            {clients.map((client) => (
                              <CardShine
                                key={client.id}
                              >
                                <div
                                  className={`flex items-center justify-between p-4 h-[60px] cursor-pointer transition-all flex-shrink-0 w-[200px] ${selectedClient === client.clientId ? 'ring-2 ring-primary rounded-[var(--card-border-radius)]' : ''}`}
                                  onClick={() => {
                                    field.onChange(client.clientId);
                                    setSelectedClient(client.clientId);
                                    getRolesByClientId(client.clientId);
                                  }}
                                >
                                  
                                  <span className="truncate">{client.clientId}</span>
                                  {selectedClient === client.clientId && <Check className="flex-shrink-0 ml-2" />}
                                </div>
                              </CardShine>
                            ))}
                          </div>
                          <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="roleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Função</FormLabel>
                      <FormControl>
                        <div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {roles.map((role) => (
                              <CardShine 
                                key={role.id}
                              >
                                <div
                                  className={`flex items-center justify-between p-4 cursor-pointer transition-all ${selectedRole === role.name ? 'ring-2 ring-primary rounded-[var(--card-border-radius)]' : ''}`}
                                  onClick={() => {
                                    field.onChange(role.id.toString());
                                    setSelectedRole(role.name);
                                  }}
                              >
                                  <span>{role.name}</span>
                                  {selectedRole === role.name && <Check className="" />}
                                </div>
                              </CardShine>
                            ))}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                          onChange={(e) => {
                            field.onChange(e);
                            setDescription(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="attachments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Anexos</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.txt"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {!hasError && (
                <Button type="submit">Solicitar acesso</Button>
              )}
            </>
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
                    <p>Função solicitada:</p>
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










