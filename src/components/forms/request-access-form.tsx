import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "../../components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form"
import { Input } from "../../components/ui/input"
import { toast } from "../ui/use-toast"
import { Textarea } from "../ui/textarea"
import { HttpClient, HttpRequestError, HttpRequestResponse } from '@getinsight.it/getinsight-common';
import { RequestService } from "../../services/request/request-service"
import { useEffect, useState } from "react"
import { clientService } from '../../services/client';
import { roleService } from '../../services/role';
import useAuthStore from "../../store/authStore"
import { httpClient } from "../../config/http/http"

interface Client {
  id: number;
  clientId: string;
}

interface Role {
  id: number;
  name: string;
}

const formSchema = z.object({
  // clientId: z
  //   .string({
  //     required_error: "Selecione um sistema.",
  //   }),
  roleId: z
    .string({
      required_error: "Selecione uma função.",
    }),
  description: z
    .string()
    .min(10, {
      message: "Deve conter ao menos 10 caracteres.",
    })
    .max(160, {
      message: "Não deve exceder 30 caracteres.",
    }),
  attachments: z.array(z.instanceof(File)).optional(),
})

export function RequestAccessForm() {

  const [roles, setRoles] = useState<Role[]>([]); // inicializa como um array vazio
  const [clients, setClients] = useState<Client[]>([]); // inicializa como um array vazio

  const [attachments, setAttachments] = useState<File[]>([]);

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);

  const getClients = async () => {
    try {
      const fetchedClients = await clientService.getClients(); // faz a requisição
      setClients(fetchedClients); // atualiza o estado com os clients
      // console.log(fetchedClients)
    } catch (error) {
      console.error('Erro ao carregar clients:', error);
    }
  };

  const getRolesByClientId = async (clientId: string) => {
    try {
      const fetchedRoles = await roleService.getRolesByClientId(clientId); // faz a requisição com clientId
      setRoles(fetchedRoles); // atualiza o estado com as roles
      // console.log(fetchedRoles)
    } catch (error) {
      console.error('Erro ao carregar roles:', error);
    }
  };
  
  useEffect(() => {
    if (isAuthenticated) {
      getClients();
      // O clientId deve ser passado aqui quando o usuário selecionar um cliente no formulário
    }
  }, [isAuthenticated]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  })

  // async function onSubmit(data: z.infer<typeof formSchema>) {
  //   try {
  //     const requestService = new RequestService(new HttpClient());
  
  //     const response = await requestService.createRequest({
  //       // clientId: data.clientId,
  //       roleId: data.roleId,
  //       description: data.description,
  //     }, attachments);
  
  //     if (response instanceof HttpRequestResponse) {
  //       toast({
  //         title: "Solicitação enviada com sucesso!",
  //         description: "Sua solicitação foi processada.",
  //       });
  //     } else {
  //       toast({
  //         title: "Erro ao enviar solicitação",
  //         description: "Por favor, tente novamente.",
  //       });
  //     }
  //   } catch (error) {
  //     toast({
  //       title: "Erro",
  //       description: "Ocorreu um erro ao processar sua solicitação.",
  //     });
  //   }
  // }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const requestService = new RequestService(httpClient);
  
      // Verifique o conteúdo do data e attachments
      console.log("Data do formulário:", data);
      console.log("Attachments:", attachments);
  
      // Cria um novo objeto FormData
      const formData = new FormData();
      
      formData.append("request", JSON.stringify({roleId: data.roleId, description: data.description}));

      // formData.append("roleId", data.roleId);
      // formData.append("description", data.description);
  
      // Adiciona os arquivos ao FormData
      if (attachments.length > 0) {
        attachments.forEach((file) => {
          formData.append("attachments", file);
        });
      }
  
      // Verifique o conteúdo do FormData antes de enviar
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
  
      const headers = new Map<string, string>();
      headers.set('Content-Type', 'multipart/form-data');

      const response = await requestService.createRequest(formData, headers);
  
      if (response instanceof HttpRequestResponse) {
        toast({
          title: "Solicitação enviada com sucesso!",
          description: "Sua solicitação foi processada.",
        });
      } else {
        toast({
          title: "Erro ao enviar solicitação",
          description: "Por favor, tente novamente.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar sua solicitação.",
      });
    }
  }
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sistema</FormLabel>
              <Select onValueChange={(value) => {
                  field.onChange(value);
                  // Chame getRolesByClientId com o clientId selecionado
                  getRolesByClientId(value);
                }} 
                defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um sistema" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients.length > 0 ? (
                    clients.map((client) => (
                      <SelectItem key={client.id} value={client.clientId}>
                        {client.clientId}
                      </SelectItem>
                    ))
                  ) : (
                    <p>Nenhum sistema encontrado</p>
                  )}
                </SelectContent>
              </Select>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roles.length > 0 ? (
                    roles.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.name.toString()}
                      </SelectItem>
                    ))
                  ) : (
                    // <SelectItem value="user">Usuário</SelectItem>
                    <p>Nenhuma função encontrada</p>
                  )}
                </SelectContent>
              </Select>
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}


// import * as z from 'zod';
// import { useState } from 'react';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { Trash } from 'lucide-react';
// // import { useParams, useRouter } from 'next/navigation';
// import { Button } from '../../components/ui/button';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage
// } from '../../components/ui/form';
// import { Separator } from '../../components/ui/separator';
// import { Heading } from '../../components/ui/heading';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '../../components/ui/select';
// import { useToast } from '../ui/use-toast';
// import { Textarea } from '../ui/textarea';
// import { SuccessModal } from '../modal/success-modal';
// import { FileUploadDemo } from '../FileUploadDemo';
// import { StepLoader } from '../steploader/StepLoader';
// export const IMG_MAX_LIMIT = 3;
// const formSchema = z.object({
//   name: z
//     .string()
//     .min(3, { message: 'O nome do sistema deve conter no mínimo 3 caracteres' }),
//   description: z
//     .string()
//     .min(3, { message: 'A descrição do motivo deve conter no mínimo 3 caracteres' }),
//   status: z.string().min(1, { message: 'Selecione uma opção' }),
//   systems: z.string().min(1, { message: 'Selecione uma opção' }),
//   roles: z.string().min(1, { message: 'Selecione uma opção' })
// });

// type RequestAccessFormValues = z.infer<typeof formSchema>;

// interface RequestAccessFormProps {
//   initialData: any | null;
//   systems: any;
//   roles: any;
// }


// export const RequestAccessForm: React.FC<RequestAccessFormProps> = ({
//   initialData,
//   systems,
//   roles,
// }) => {
//   // const params = useParams();
//   // const router = useRouter();
//   const { toast } = useToast();
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [showContent, setShowContent] = useState(true); // Adicionado para controlar a visibilidade do conteúdo
//   const title = initialData ? 'Editar solicitação de acesso' : 'Solicitar acesso';
//   const description = initialData ? 'Editar uma solicitação.' : 'Adicionar uma nova solicitação.';
//   const toastMessage = initialData ? 'Solicitação de acesso atualizada.' : 'Acesso solicitado.';
//   const action = initialData ? 'Salvar alterações' : 'Solicitar acesso';

//   const defaultValues = initialData
//     ? initialData
//     : {
//         name: '',
//         description: '',
//         status: '',
//         systems: '',
//         roles: '',
//       };

//   const form = useForm<RequestAccessFormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues
//   });

//   const onSubmit = async (data: RequestAccessFormValues) => {
//     try {
//       setLoading(true);
//       if (initialData) {
//         // await axios.post(`/api/access-requests/edit-access/${initialData._id}`, data);
//       } else {
//         // const res = await axios.post(`/api/access-requests/create`, data);
//         // console.log("access", res);
//       }
//       // router.refresh();
//       // router.push(`/dashboard/access-requests`);
//       toast({
//         variant: 'destructive',
//         title: 'Algo deu errado.',
//         description: 'Houve um problema com sua solicitação.'
//       });
//     } catch (error: any) {
//       toast({
//         variant: 'destructive',
//         title: 'Algo deu errado.',
//         description: 'Houve um problema com sua solicitação.'
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLoaderClose = () => {
//     setShowContent(false); // Exibe o conteúdo quando o StepLoader é fechado
//   };

//   return (
//     <>
//       <SuccessModal
//         isOpen={open}
//         onClose={() => setOpen(false)}
//         onConfirm={() => {}}
//         loading={loading}
//       />
//       <div className="flex items-center justify-between">
//         <Heading title={title} description={description} />
//         {initialData && (
//           <Button
//             disabled={loading}
//             variant="destructive"
//             size="sm"
//             onClick={() => setOpen(true)}
//           >
//             <Trash className="h-4 w-4" />
//           </Button>
//         )}
//       </div>
//       <Separator />
//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="w-full"
//         >
//           {showContent && (
//             <div className="gap-x-8 gap-y-4 md:grid grid-cols-1 lg:grid-cols-2 max-w-5xl">
//               <div className="flex flex-col gap-y-4">
//                 <FormField
//                   control={form.control}
//                   name="systems"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Sistema</FormLabel>
//                       <Select
//                         disabled={loading}
//                         onValueChange={field.onChange}
//                         value={field.value}
//                         defaultValue={field.value}
//                       >
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue
//                               defaultValue={field.value}
//                               placeholder="Selecione um sistema"
//                             />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {/* @ts-ignore  */}
//                           {systems.map((system) => (
//                             <SelectItem key={system._id} value={system._id}>
//                               {system.name}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="roles"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Função</FormLabel>
//                       <Select
//                         disabled={loading}
//                         onValueChange={field.onChange}
//                         value={field.value}
//                         defaultValue={field.value}
//                       >
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue
//                               defaultValue={field.value}
//                               placeholder="Selecione uma função"
//                             />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {/* @ts-ignore  */}
//                           {roles.map((role) => (
//                             <SelectItem key={role._id} value={role._id}>
//                               {role.name}
//                             </SelectItem>
//                           ))}
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
//                           id="description"
//                           // name="description"
//                           placeholder="Descreva o motivo de sua solicitação."
//                           className="col-span-4"
//                           disabled={loading}
//                           {...field}
//                           // onValueChange={field.onChange}
//                           // value={field.value}
//                           // defaultValue={field.value}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 {/* <Button disabled={loading} className="hidden lg:block mr-auto mt-6" type="submit" onClick={() => setOpen(true)}>
//                   {action}
//                 </Button> */}
//                 <div className="hidden lg:block mr-auto mt-6">
//                   <StepLoader onClose={handleLoaderClose} />
//                 </div>
//               </div>
//               <FileUploadDemo />
//             </div>
//           )}
//           {!showContent && (
//             <div className="gap-x-8 gap-y-4 md:grid grid-cols-1 max-w-5xl">
              
//               <p className="bg-green-500 p-4 rounded-xl text-black font-bold mt-4">
//                 Sucesso!
//                 Sua solicitação de acesso foi enviada.
//                 Sua solicitação será analisada e você será notificado sobre quaisquer atualizações por e-mail e pela plataforma Access Pilot.
//               </p>
//               <div className="grid grid-cols-2 gap-5 pt-10 pb-6">
//                 <div className="font-bold space-y-3">
//                   <p>Solicitação de acesso</p>
//                   <p>Sistema:</p>
//                   <p>Função solicitada:</p>
//                   <p>Status:</p>
//                   <p>Data de envio:</p>
//                   <p>Solicitante:</p>
//                   <p>Gerente:</p>
//                   <p>Motivo do acesso:</p>
//                   <p>Duração:</p>
//                 </div>
//                 <div className="space-y-3">
//                   <p>REQ-2023-06-15-002</p>
//                   <p>Portal RH</p>
//                   <p>Gerente</p>
//                   <p>Em progresso</p>
//                   <p>15 de Junho, 2024</p>
//                   <p>José Maria</p>
//                   <p>Maria José</p>
//                   <p>Gerenciar sistema</p>
//                   <p>3 Meses</p>
//                 </div>
//               </div>
//               <div className="space-y-3">
//                 <p className="font-bold mt-6 mb-2">Fluxo de aprovação:</p>
//                 <p>1 - Revisão inicial pelo Departamento de RH</p>
//                 <p>2 - Aprovação do gerente (asdas)</p>
//                 <p>3 - Aprovação do proprietário do sistema do portal de RH</p>
//                 <p>4 - Revisão final pela equipe de controle de acesso</p>
//               </div>

//             </div>
//           )}
//           {/* <Button disabled={loading} className="block lg:hidden ml-auto mt-8" type="submit" onClick={() => setOpen(true)}>
//             {action}
//           </Button> */}
//           <div className="block lg:hidden mt-6">
//             <StepLoader onClose={handleLoaderClose} />
//           </div>
//         </form>
//       </Form>
//     </>
//   );
// };




// import * as z from 'zod';
// import { useState } from 'react';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { Trash } from 'lucide-react';
// import { Button } from '../../components/ui/button';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage
// } from '../../components/ui/form';
// import { Separator } from '../../components/ui/separator';
// import { Heading } from '../../components/ui/heading';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '../../components/ui/select';
// import { useToast } from '../ui/use-toast';
// import { Textarea } from '../ui/textarea';
// import { SuccessModal } from '../modal/success-modal';
// import { FileUploadDemo } from '../FileUploadDemo';
// import { RequestService } from '../../services/request/request-service';
// export const IMG_MAX_LIMIT = 3;
// const formSchema = z.object({
//   name: z
//     .string()
//     .min(3, { message: 'O nome do sistema deve conter no mínimo 3 caracteres' }),
//   description: z
//     .string()
//     .min(3, { message: 'A descrição do motivo deve conter no mínimo 3 caracteres' }),
//   status: z.string().min(1, { message: 'Selecione uma opção' }),
//   systems: z.string().min(1, { message: 'Selecione uma opção' }),
//   roles: z.string().min(1, { message: 'Selecione uma opção' })
// });

// type RequestAccessFormValues = z.infer<typeof formSchema>;

// interface RequestAccessFormProps {
//   initialData: any | null;
//   systems: any;
//   roles: any;
// }


// export const RequestAccessForm: React.FC<RequestAccessFormProps> = ({
//   initialData,
//   systems,
//   roles,
// }) => {
//   const { toast } = useToast();
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const title = initialData ? 'Editar solicitação de acesso' : 'Solicitar acesso';
//   const description = initialData ? 'Editar uma solicitação.' : 'Adicionar uma nova solicitação.';
//   const toastMessage = initialData ? 'Solicitação de acesso atualizada.' : 'Acesso solicitado.';
//   const action = initialData ? 'Salvar alterações' : 'Solicitar acesso';

//   const defaultValues = initialData
//     ? initialData
//     : {
//         name: '',
//         description: '',
//         status: '',
//         systems: '',
//         roles: '',
//       };

//   const form = useForm<RequestAccessFormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues
//   });

//   const onSubmit = async (data: RequestAccessFormValues) => {
//     try {
//       setLoading(true);
//       const requestData = {
//         name: data.name,
//         description: data.description,
//         systemId: data.systems,
//         roleId: data.roles,
//       };
  
//       if (initialData) {
//         // PUT
//         await RequestService.updateRequest(initialData.id, requestData);
//         toast({
//           variant: 'success',
//           title: 'Solicitação atualizada.',
//           description: 'A solicitação foi atualizada com sucesso.'
//         });
//       } else {
//         // POST
//         await RequestService.createRequest(requestData);
//         toast({
//           variant: 'success',
//           title: 'Acesso solicitado.',
//           description: 'Sua solicitação de acesso foi enviada com sucesso.'
//         });
//       }
  
//     } catch (error: any) {
//       toast({
//         variant: 'destructive',
//         title: 'Algo deu errado.',
//         description: 'Houve um problema com sua solicitação.'
//       });
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   return (
//     <>
//       <SuccessModal
//         isOpen={open}
//         onClose={() => setOpen(false)}
//         onConfirm={() => {}}
//         loading={loading}
//       />
//       <div className="flex items-center justify-between">
//         <Heading title={title} description={description} />
//         {initialData && (
//           <Button
//             disabled={loading}
//             variant="destructive"
//             size="sm"
//             onClick={() => setOpen(true)}
//           >
//             <Trash className="h-4 w-4" />
//           </Button>
//         )}
//       </div>
//       <Separator />
//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="w-full"
//         >
          
//           <div className="gap-x-8 gap-y-4 md:grid grid-cols-1 lg:grid-cols-2 max-w-5xl">
//             <div className="flex flex-col gap-y-4">
//               <FormField
//                 control={form.control}
//                 name="systems"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Sistema</FormLabel>
//                     <Select
//                       disabled={loading}
//                       onValueChange={field.onChange}
//                       value={field.value}
//                       defaultValue={field.value}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue
//                             defaultValue={field.value}
//                             placeholder="Selecione um sistema"
//                           />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {/* @ts-ignore  */}
//                         {systems.map((system) => (
//                           <SelectItem key={system._id} value={system._id}>
//                             {system.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="roles"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Função</FormLabel>
//                     <Select
//                       disabled={loading}
//                       onValueChange={field.onChange}
//                       value={field.value}
//                       defaultValue={field.value}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue
//                             defaultValue={field.value}
//                             placeholder="Selecione uma função"
//                           />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {/* @ts-ignore  */}
//                         {roles.map((role) => (
//                           <SelectItem key={role._id} value={role._id}>
//                             {role.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="description"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Motivo</FormLabel>
//                     <FormControl>
                      
//                       <Textarea
//                         id="description"
//                         // name="description"
//                         placeholder="Descreva o motivo de sua solicitação."
//                         className="col-span-4"
//                         disabled={loading}
//                         {...field}
//                         // onValueChange={field.onChange}
//                         // value={field.value}
//                         // defaultValue={field.value}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <Button
//                 disabled={loading}
//                 className="hidden lg:block mr-auto mt-6"
//                 type="submit"
//               >
//                 {action}
//               </Button>
              
//             </div>
//             {/* <FileUploadDemo /> */}
//           </div>
          
//           {/* mobile */}
//           {/* <Button disabled={loading} className="block lg:hidden ml-auto mt-8" type="submit" onClick={() => setOpen(true)}>
//             {action}
//           </Button> */}

//         </form>
//       </Form>
//     </>
//   );
// };



