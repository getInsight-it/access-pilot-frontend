'use client';
import * as z from 'zod';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CloudUpload, Trash, Upload } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '../ui/use-toast';
import { Textarea } from '../ui/textarea';
import { SuccessModal } from '../modal/success-modal';
import FileUpload from '../ui/file-upload_V1';
import { FileUploadDemo } from '../FileUploadDemo';
import { StepLoader } from '../steploader/StepLoader';
export const IMG_MAX_LIMIT = 3;
const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'O nome do sistema deve conter no mínimo 3 caracteres' }),
  description: z
    .string()
    .min(3, { message: 'A descrição do motivo deve conter no mínimo 3 caracteres' }),
  status: z.string().min(1, { message: 'Selecione uma opção' }),
  systems: z.string().min(1, { message: 'Selecione uma opção' }),
  roles: z.string().min(1, { message: 'Selecione uma opção' })
});

type RequestAccessFormValues = z.infer<typeof formSchema>;

interface RequestAccessFormProps {
  initialData: any | null;
  systems: any;
  roles: any;
}

// export const RequestAccessForm: React.FC<RequestAccessFormProps> = ({
//   initialData,
//   systems,
//   roles,
// }) => {
//   const params = useParams();
//   const router = useRouter();
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
//       if (initialData) {
//         // await axios.post(`/api/access-requests/edit-access/${initialData._id}`, data);
//       } else {
//         // const res = await axios.post(`/api/access-requests/create`, data);
//         // console.log("access", res);
//       }
//       router.refresh();
//       router.push(`/dashboard/access-requests`);
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
//           className="w-full "
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

//               <Button disabled={loading} className="hidden lg:block mr-auto mt-6" type="submit" onClick={() => setOpen(true)}>
//                 {action}
//               </Button>
              

//             </div>

            

//             {/* <FileUpload /> */}
//             <FileUploadDemo />

//           </div>

//           <Button disabled={loading} className="block lg:hidden ml-auto mt-8" type="submit" onClick={() => setOpen(true)}>
//             {action}
//           </Button>

//           <StepLoader />
        
//         </form>
//       </Form>
//     </>
//   );
// };




export const RequestAccessForm: React.FC<RequestAccessFormProps> = ({
  initialData,
  systems,
  roles,
}) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showContent, setShowContent] = useState(true); // Adicionado para controlar a visibilidade do conteúdo
  const title = initialData ? 'Editar solicitação de acesso' : 'Solicitar acesso';
  const description = initialData ? 'Editar uma solicitação.' : 'Adicionar uma nova solicitação.';
  const toastMessage = initialData ? 'Solicitação de acesso atualizada.' : 'Acesso solicitado.';
  const action = initialData ? 'Salvar alterações' : 'Solicitar acesso';

  const defaultValues = initialData
    ? initialData
    : {
        name: '',
        description: '',
        status: '',
        systems: '',
        roles: '',
      };

  const form = useForm<RequestAccessFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: RequestAccessFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        // await axios.post(`/api/access-requests/edit-access/${initialData._id}`, data);
      } else {
        // const res = await axios.post(`/api/access-requests/create`, data);
        // console.log("access", res);
      }
      router.refresh();
      router.push(`/dashboard/access-requests`);
      toast({
        variant: 'destructive',
        title: 'Algo deu errado.',
        description: 'Houve um problema com sua solicitação.'
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Algo deu errado.',
        description: 'Houve um problema com sua solicitação.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoaderClose = () => {
    setShowContent(false); // Exibe o conteúdo quando o StepLoader é fechado
  };

  return (
    <>
      <SuccessModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {}}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full"
        >
          {showContent && (
            <div className="gap-x-8 gap-y-4 md:grid grid-cols-1 lg:grid-cols-2 max-w-5xl">
              <div className="flex flex-col gap-y-4">
                <FormField
                  control={form.control}
                  name="systems"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sistema</FormLabel>
                      <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="Selecione um sistema"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* @ts-ignore  */}
                          {systems.map((system) => (
                            <SelectItem key={system._id} value={system._id}>
                              {system.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="roles"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Função</FormLabel>
                      <Select
                        disabled={loading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="Selecione uma função"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* @ts-ignore  */}
                          {roles.map((role) => (
                            <SelectItem key={role._id} value={role._id}>
                              {role.name}
                            </SelectItem>
                          ))}
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
                          id="description"
                          // name="description"
                          placeholder="Descreva o motivo de sua solicitação."
                          className="col-span-4"
                          disabled={loading}
                          {...field}
                          // onValueChange={field.onChange}
                          // value={field.value}
                          // defaultValue={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <Button disabled={loading} className="hidden lg:block mr-auto mt-6" type="submit" onClick={() => setOpen(true)}>
                  {action}
                </Button> */}
                <div className="hidden lg:block mr-auto mt-6">
                  <StepLoader onClose={handleLoaderClose} />
                </div>
              </div>
              <FileUploadDemo />
            </div>
          )}
          {!showContent && (
            <div className="gap-x-8 gap-y-4 md:grid grid-cols-1 max-w-5xl">
              
              <p className="bg-green-500 p-4 rounded-xl text-black font-bold mt-4">
                Sucesso!
                Sua solicitação de acesso foi enviada.
                Sua solicitação será analisada e você será notificado sobre quaisquer atualizações por e-mail e pela plataforma Access Pilot.
              </p>
              <div className="grid grid-cols-2 gap-5 pt-10 pb-6">
                <div className="font-bold space-y-3">
                  <p>Solicitação de acesso</p>
                  <p>Sistema:</p>
                  <p>Função solicitada:</p>
                  <p>Status:</p>
                  <p>Data de envio:</p>
                  <p>Solicitante:</p>
                  <p>Gerente:</p>
                  <p>Motivo do acesso:</p>
                  <p>Duração:</p>
                </div>
                <div className="space-y-3">
                  <p>REQ-2023-06-15-002</p>
                  <p>Portal RH</p>
                  <p>Gerente</p>
                  <p>Em progresso</p>
                  <p>15 de Junho, 2024</p>
                  <p>José Maria</p>
                  <p>Maria José</p>
                  <p>Gerenciar sistema</p>
                  <p>3 Meses</p>
                </div>
              </div>
              <div className="space-y-3">
                <p className="font-bold mt-6 mb-2">Fluxo de aprovação:</p>
                <p>1 - Revisão inicial pelo Departamento de RH</p>
                <p>2 - Aprovação do gerente (asdas)</p>
                <p>3 - Aprovação do proprietário do sistema do portal de RH</p>
                <p>4 - Revisão final pela equipe de controle de acesso</p>
              </div>

            </div>
          )}
          {/* <Button disabled={loading} className="block lg:hidden ml-auto mt-8" type="submit" onClick={() => setOpen(true)}>
            {action}
          </Button> */}
          <div className="block lg:hidden mt-6">
            <StepLoader onClose={handleLoaderClose} />
          </div>
        </form>
      </Form>
    </>
  );
};