import * as z from 'zod';
import React, {useState} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {FormProvider, useForm} from 'react-hook-form';
import {Trash} from 'lucide-react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {Input} from '../../../components/ui/input.tsx';
import {Button} from '../../../components/ui/button.tsx';
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from '../../../components/ui/form.tsx';
import {Separator} from '../../../components/ui/separator.tsx';
import {Heading} from '../../../components/ui/heading.tsx';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '../../../components/ui/select.tsx';
import {toast, useToast} from '../../../components/ui/use-toast.ts';
import {clientService} from "../../../services/client";
import { Checkbox } from '../../../components/ui/checkbox.tsx';
import { Switch } from '../../../components/ui/switch.tsx';

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
  onSuccessSubmit: () => any,
  readonly: boolean
}

export const SystemForm: React.FC<SystemFormProps> = ({
                                                        initialData,
                                                        onSuccessSubmit,
                                                        readonly
                                                      }) => {
  const params = useParams();
  const navigate = useNavigate();
  const {toast} = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  //const description = descriptionMap[getActionStyle()];




  function getActionStyle() {
    if (readonly) {
      return 'DETAIL';
    } else if (initialData && !readonly) {
      return 'EDIT';
    }else{
      return 'CREATE';
    }
  }

  const titleMap = {
    DETAIL: 'Detalhes do sistema',
    EDIT: 'Editar sistema',
    CREATE: 'Adicionar sistema'
  }


  const actionMap = {
    DETAIL: '',
    EDIT: 'Salvar alterações',
    CREATE: 'Adicionar sistema'
  }


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


  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
  });
  return (
    <>
      {/* <div className="flex items-center justify-between pt-6">
        <div className="flex flex-col">
          <h2 className="text-left text-2xl font-bold leading-tight md:text-2xl md:leading-tight">
            {titleMap[getActionStyle()]}
          </h2>

          <p>
            {description}
          </p>
        </div>
      </div> */}

      {/* <Separator/> */}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="">
            <div className="flex flex-col gap-y-4">
              <FormField
                name="name"
                render={({field}) => (
                  <FormItem className="mb-2">
                    <FormLabel className="text-lg font-bold">Nome</FormLabel>
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
                  <FormItem className="mb-2">
                    <FormLabel className="text-lg font-bold">Client Id</FormLabel>
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
                  <FormItem className="mb-2">
                    <FormLabel className="text-lg font-bold">Descrição</FormLabel>
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

              {/* <FormField
                name="managed"
                render={({field}) => (
                  <FormItem className="mb-2">
                    <FormLabel className="text-lg font-bold">Gerenciado</FormLabel>
                    <FormControl className="flex flex-col">
                      <Checkbox
                        className="w-10 h-10 grid items-center"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              /> */}

              <FormField
                name="managed"
                render={({field}) => (
                  <FormItem className="mb-2">
                      <FormLabel className="text-lg font-bold">Gerenciado</FormLabel>
                    <div className="mb-2 flex flex-row items-center justify-between rounded-lg border border-primary p-4">

                      <div className="space-y-0.5">
                        <FormDescription>
                          Ative para indicar que o sistema é gerenciado
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          {...field}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={loading}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                name="status"
                render={({field}) => (
                  <FormItem className="mb-2">
                    <FormLabel className="text-lg font-bold">Status</FormLabel>
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
          </div>
          <div className="mt-10 flex justify-between">
            <Link
              className=""
              type="button"
              onClick={() => navigate(-1)}>Voltar</Link>

            { getActionStyle() === 'DETAIL'
              ? null :
              <Button disabled={loading} className="" type="submit">
                {actionMap[getActionStyle()]}
              </Button>
            }
          </div>
        </form>
      </FormProvider>
    </>
  );
};
