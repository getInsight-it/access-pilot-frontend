import * as z from 'zod';
import React, {useState} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {FormProvider, useForm} from 'react-hook-form';
import {Trash} from 'lucide-react';
import {useNavigate, useParams} from 'react-router-dom';
import {Input} from '../../components/ui/input';
import {Button} from '../../components/ui/button';
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from '../../components/ui/form';
import {Separator} from '../../components/ui/separator';
import {Heading} from '../../components/ui/heading';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '../../components/ui/select';
import {toast, useToast} from '../ui/use-toast';
import {clientService} from "../../services/client";
import { Checkbox } from '../ui/checkbox';

const ImgSchema = z.object({
  fileName: z.string(),
  name: z.string(),
  fileSize: z.number(),
  size: z.number(),
  fileKey: z.string(),
  key: z.string(),
  fileUrl: z.string(),
  url: z.string()
});

export const IMG_MAX_LIMIT = 3;

const formSchema = z.object({
  name: z
    .string()
    .min(3, {message: 'O nome do sistema deve conter no mínimo 3 caracteres'}),
  clientId: z.string().min(3, {message: 'O client Id do sistema deve conter no mínimo 3 caracteres'}).regex(/^[a-z][a-z0-9-]*$/, {message: 'client Id deve ser separado por hífen'}),
  description: z
    .string()
    .min(3, {message: 'A descrição do sistema deve conter no mínimo 3 caracteres'}),
  status: z.string().min(1, {message: 'Selecione um status'}),
  managed: z.boolean().default(false)
});

interface SystemFormProps {
  initialData: any | null,
  onSuccessSubmit: () => any
}

export const SystemForm: React.FC<SystemFormProps> = ({
                                                        initialData,
                                                        onSuccessSubmit
                                                      }) => {
  const params = useParams();
  const navigate = useNavigate();
  const {toast} = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const title = initialData ? 'Editar sistema' : 'Adicionar sistema';
  const description = initialData ? 'Editar um sistema.' : 'Adicionar um novo sistema.';
  const action = initialData ? 'Salvar alterações' : 'Adicionar sistema';

  const status = [
    {_id: 'PUBLISHED', name: 'Publicado'},
    {_id: 'UNPUBLISHED', name: 'Não Publicado'}]

  const defaultValues = initialData || {
    id: '',
    name: '',
    label: '',
    clientId: '',
    description: '',
    managed: false,
    imgUrl: [],
    status: ''
  };

  const onSubmit = async (form) => {
    try {
      setLoading(true);
      if (initialData?.id) {
        form = {...form, id: initialData.id};
        await clientService.updateClient(initialData.id, form).then(() => {
          toast({
            title: "Sistema atualizado",
            description: 'O sistema foi atualizado com sucesso',
          });
          onSuccessSubmit();
        });
      } else {
        await clientService.createClient(form).then(() => {
          toast({
            title: "Sistema criado",
            description: 'O sistema foi criado com sucesso',
          });
          onSuccessSubmit();
        });
      }
    } catch (error: any) {
      if (error.response) {
        toast({
          title: 'Erro ao realizar operação sistema',
          description: error.response.data.message,
          variant: 'destructive',
        });
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      //   await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      navigate(`/${params.storeId}/products`);
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
  });
  return (
    <>
      <div className="flex items-center justify-between pt-6">
        {/* <Heading title={title} description={description}/> */}
        <div className="flex flex-col">
          <h2 className="text-left text-2xl font-bold leading-tight md:text-2xl md:leading-tight">
            {title}
          </h2>
          {/* <p>
            {description}
          </p> */}
        </div>
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4"/>
          </Button>
        )}
      </div>

      {/* <Separator/> */}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="">
            <div className="flex flex-col gap-y-4">
              <FormField
                name="name"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Nome do sistema"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                name="clientId"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Client Id</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="ClientId do IDP"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                name="description"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Descrição do sistema"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                name="managed"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Gerenciado</FormLabel>
                    <FormControl className="flex flex-col">
                      <Checkbox
                        className="w-10 h-10 grid items-center"
                        {...field}
                        disabled={loading}
                      />
                      {/* <Input {...field}
                        type="checkbox"
                        placeholder="Gerenciado"
                        disabled={loading}/> */}
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                name="status"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
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
                            placeholder="Selecione um status"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* @ts-ignore  */}
                        {status.map((status) => (
                          <SelectItem key={status._id} value={status._id}>
                            {status.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
            {/*<SystemImageUpload />*/}
            
          </div>
          <div className="mt-10">
            <Button disabled={loading} className="" type="submit">
              {action}
            </Button>
          </div>
        </form>
      </FormProvider>
      {/* <Separator /> */}
      
    </>
  );
};
