import * as z from 'zod';
import React, {useState} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {FormProvider, useForm} from 'react-hook-form';
import {useToast} from '../../../components/ui/use-toast.ts';
import {Button} from "../../../components/ui/button.tsx";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "../../../components/ui/form.tsx";
import {Input} from "../../../components/ui/input.tsx";
import {RoleDTO} from "../../../services/role/role-dto.ts";
import {roleService} from "../../../services/role";
import {catchError, finalize, from, tap} from "rxjs";
import {ClientDTO} from "../../../services/client/client-dto.ts";
import {useNavigate} from "react-router-dom";
import { Separator } from '../../../components/ui/separator.tsx';
import { IconPicker } from '../../../components/icon-picker/IconPicker.tsx';

const formSchema = z.object({
  name: z
    .string()
    .min(3, {message: 'O nome do sistema deve conter no mínimo 3 caracteres'}),
  description: z
    .string()
    .min(3, {message: 'A descrição do sistema deve conter no mínimo 3 caracteres'}),
  label: z.string().min(3, {message: 'O label do sistema deve conter no mínimo 3 caracteres'}),
  icon: z.string().min(3, {message: 'O icon do sistema deve conter no mínimo 3 caracteres'}),
});

interface RoleFormProps {
  client?: ClientDTO,
  onSuccessSubmit?: () => any,
  initialData: RoleDTO | null,
  readonly : boolean,
}

export const RoleForm: React.FC<RoleFormProps> = ({client, initialData, readonly , onSuccessSubmit}) => {
  const {toast} = useToast();
  const [loading, setLoading] = useState(false);
  const toastMessage = initialData ? 'Papel atualizado.' : 'Papel criado.';
  const navigate = useNavigate();
  const defaultValues = initialData || {name: '', description: ''};

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
  });

  function getActionStyle() {
    if (readonly) {
      return 'DETAIL';
    } else if (initialData && !readonly) {
      return 'EDIT';
    }else{
      return 'CREATE';
    }
  }

  function isReadOnly() {
    return getActionStyle() === 'DETAIL';
  }

  const titleMap = {
    DETAIL: 'Detalhes da papel',
    EDIT: 'Editar papel',
    CREATE: 'Criar novo papel'
  }


  const actionMap = {
    DETAIL: '',
    EDIT: 'Salvar alterações',
    CREATE: 'Adicionar papel'
  }

  const onSubmit = async (form: RoleDTO) => {
    const role = {
      ...form,
    } as RoleDTO;
    role.client = client;
    from(initialData ? roleService.updateRole(initialData?.id, role) : roleService.createRole(role)).pipe(
      tap(() => {
        toast({
          title: toastMessage,
          description: `O papel ${role.name} foi ${initialData ? 'atualizado' : 'criado'} com sucesso.`,
        });
        onSuccessSubmit?.();
      }),
      catchError((error) => {
        toast({
          title: `Erro ao ${toastMessage}`,
          description: `O papel ${role.name} não foi ${initialData ? 'atualizado' : 'criado'}.`,
          variant: 'destructive',
        });
        console.error(error);
        return [];
      }), finalize(() => setLoading(false))
    ).subscribe();
  };

  return (
    <>
      {/* <div className="flex items-center justify-between pt-6">
        <div className="flex flex-col">
          <h2 className="text-left text-2xl font-bold leading-tight md:text-2xl md:leading-tight">
            {titleMap[getActionStyle()]}
          </h2>
        </div>
      </div> */}

      <FormProvider {...methods} >
        <form onSubmit={methods.handleSubmit(onSubmit)} >
          <div className="">
            <div className="flex flex-col gap-y-4">
              <FormField
                name="name"
                render={({field}) => (
                  <FormItem className="mb-2">
                    <FormLabel className="text-lg font-bold">Nome</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading || isReadOnly()}
                        placeholder="Nome do papel"
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
                        disabled={loading || isReadOnly()}
                        placeholder="Descrição do papel"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                name="label"
                render={({field}) => (
                  <FormItem className="mb-2">
                    <FormLabel className="text-lg font-bold">Label</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading || isReadOnly()}
                        placeholder="Label do papel"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                name="icon"
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <FormLabel className="text-lg font-bold">Ícone</FormLabel>
                    <br />
                    <FormControl>
                      {/* <IconPicker value={field.value} onChange={field.onChange} disabled={loading || isReadOnly()} /> */}
                      <IconPicker />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                name="icon"
                render={({field}) => (
                  <FormItem className="mb-2">
                    <FormLabel className="text-lg font-bold">Ícone</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading || isReadOnly()}
                        placeholder="Ícone do papel"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              /> */}
            </div>
          </div>
          <Separator className="mt-10" />
          <div className="mt-6 flex justify-between">
            <Button
              className=""
              onClick={() => navigate(-1)}
              variant="ghost"
            >
              Voltar
            </Button>
            { getActionStyle() === 'DETAIL' ? null :
              <Button disabled={loading || isReadOnly()} className="" type="submit">
                {actionMap[getActionStyle()]}
              </Button>
            }
          </div>
        </form>
      </FormProvider>
    </>
  );
};
