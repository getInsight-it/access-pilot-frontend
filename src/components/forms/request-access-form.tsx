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
        // await axios.post(`/api/products/edit-product/${initialData._id}`, data);
      } else {
        // const res = await axios.post(`/api/products/create-product`, data);
        // console.log("product", res);
      }
      router.refresh();
      router.push(`/dashboard/products`);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      });
    } finally {
      setLoading(false);
    }
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
          className="w-full "
        >
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

              <Button disabled={loading} className="hidden lg:block mr-auto mt-6" type="submit" onClick={() => setOpen(true)}>
                {action}
              </Button>
              

            </div>

            

            {/* <FileUpload /> */}
            <FileUploadDemo />

          </div>

          <Button disabled={loading} className="block lg:hidden ml-auto mt-8" type="submit" onClick={() => setOpen(true)}>
            {action}
          </Button>
          <StepLoader />
        
        </form>
      </Form>
    </>
  );
};
