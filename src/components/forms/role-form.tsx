import * as z from 'zod';
import {useState} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {FormProvider, useForm} from 'react-hook-form';
import {Trash} from 'lucide-react';
import {useToast} from '../ui/use-toast';
import {Heading} from "../ui/heading.tsx";
import {Button} from "../ui/button.tsx";
import {Separator} from "../ui/separator.tsx";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "../ui/form.tsx";
import {Input} from "../ui/input.tsx";
import {RoleDTO} from "../../services/role/role-dto.ts";
import {roleService} from "../../services/role";
import {catchError, finalize, from, tap} from "rxjs";
import {ClientDTO} from "../../services/client/client-dto.ts";

const formSchema = z.object({
  name: z
    .string()
    .min(3, {message: 'O nome do sistema deve conter no mínimo 3 caracteres'}),
  description: z
    .string()
    .min(3, {message: 'A descrição do sistema deve conter no mínimo 3 caracteres'}),
});

//type RoleFormValues = z.infer<typeof formSchema>;

interface RoleFormProps {
  client?: ClientDTO,
  onSuccessSubmit?: () => any,
  initialData: RoleDTO | null,
}

export const RoleForm: React.FC<RoleFormProps> = ({ client, initialData, onSuccessSubmit}) => {
  const {toast} = useToast();
  const [loading, setLoading] = useState(false);
  const title = initialData ? 'Editar função' : 'Criar nova função';
  const description = initialData ? 'Editar uma função.' : 'Adicionar uma nova função.';
  const toastMessage = initialData ? 'Função atualizada.' : 'Função criada.';
  const action = initialData ? 'Salvar alterações' : 'Criar função';
  const defaultValues = initialData || {name: '', description: ''};

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
  });

  const onSubmit = async (form) => {
    const role = {
      ...form,
    } as RoleDTO;
    role.client = client;
    from(initialData ? roleService.updateRole(initialData.id,role) : roleService.createRole(role) ).pipe(
      tap(() => {
        toast({
          title: toastMessage,
          description: `A função ${role.name} foi ${initialData ? 'atualizada' : 'criada'} com sucesso.`,
        });
        onSuccessSubmit?.();
      }),
      catchError((error) => {
        toast({
          title: `Erro ao ${toastMessage}`,
          description: `A função ${role.name} não foi ${initialData ? 'atualizada' : 'criada'}.`,
          variant: 'destructive',
        });
        console.error(error);
        return [];
      }), finalize(() => setLoading(false))
    ).subscribe();
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description}/>
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
          >
            <Trash className="h-4 w-4"/>
          </Button>
        )}
      </div>
      <Separator/>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="gap-x-8 gap-y-4 md:grid grid-cols-1 lg:grid-cols-2 max-w-5xl">
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
            </div>
          </div>
          <div className="hidden lg:block mr-auto mt-6">
            <Button disabled={loading} className="ml-auto" type="submit">
              {action}
            </Button>
          </div>
        </form>
      </FormProvider>
      <Separator/>
    </>
  );
};
