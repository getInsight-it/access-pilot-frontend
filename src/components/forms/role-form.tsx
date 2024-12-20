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
  label: z.string().min(3, {message: 'O label do sistema deve conter no mínimo 3 caracteres'}),
  icon: z.string().min(3, {message: 'O icon do sistema deve conter no mínimo 3 caracteres'}),
});

interface RoleFormProps {
  client?: ClientDTO,
  onSuccessSubmit?: () => any,
  initialData: RoleDTO | null,
}

export const RoleForm: React.FC<RoleFormProps> = ({client, initialData, onSuccessSubmit}) => {
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

  const onSubmit = async (form: RoleDTO) => {
    const role = {
      ...form,
    } as RoleDTO;
    role.client = client;
    from(initialData ? roleService.updateRole(initialData?.id, role) : roleService.createRole(role)).pipe(
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
          >
            <Trash className="h-4 w-4"/>
          </Button>
        )}
      </div>

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
                name="label"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Label do sistema"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                name="icon"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Icon do sistema"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="mt-10">
            <Button disabled={loading} className="" type="submit">
              {action}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};
