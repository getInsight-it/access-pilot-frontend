import * as z from "zod";
import type React from "react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useToast } from "../../../components/ui/use-toast.ts";
import { Button } from "../../../components/ui/button.tsx";
import { FormControl, FormField, FormItem, FormLabel } from "../../../components/ui/form.tsx";
import { Input } from "../../../components/ui/input.tsx";
import { catchError, finalize, from, tap } from "rxjs";
import { useNavigate } from "react-router-dom";
import { Separator } from "../../../components/ui/separator.tsx";
import { IconPicker } from "../../../components/icon-picker/IconPicker.tsx";
import { Textarea } from "../../../components/ui/textarea.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip.tsx";
import { AlertCircle } from "lucide-react";
import { roleService } from "../common/service/role-service.ts";
import { RoleResponseInterface } from "../common/types/role.model.ts";
import { ClientResponseInterface } from "../../client/common/model/client.model.ts";

const formSchema = z.object({
  name: z.string().min(3, { message: "O nome do sistema deve conter no mínimo 3 caracteres" }),
  description: z.string().min(3, { message: "A descrição do sistema deve conter no mínimo 3 caracteres" }),
  label: z.string().min(3, { message: "A label do sistema deve conter no mínimo 3 caracteres" })
});

interface RoleFormProps {
  client?: ClientResponseInterface;
  onSuccessSubmit?: () => any;
  initialData: RoleResponseInterface | null;
  readonly: boolean;
}

export const RoleForm: React.FC<RoleFormProps> = ({ client, initialData, readonly, onSuccessSubmit }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const toastMessage = initialData ? "Papel atualizado." : "Papel criado.";
  const navigate = useNavigate();
  const defaultValues = initialData || { name: "", description: "" };

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
  });

  function getActionStyle() {
    if(readonly) {
      return "DETAIL";
    } else if(initialData && !readonly) {
      return "EDIT";
    } else {
      return "CREATE";
    }
  }

  function isReadOnly() {
    return getActionStyle() === "DETAIL";
  }

  const actionMap = {
    DETAIL: "",
    EDIT: "Salvar alterações",
    CREATE: "Adicionar papel"
  };

  const onSubmit = async (form: RoleResponseInterface) => {
    const role = {
      ...form
    } as RoleResponseInterface;
    role.client = client;
    from(initialData ? roleService.updateRole(initialData?.id, role) : roleService.createRole(role))
      .pipe(
        tap(() => {
          toast({
            title: toastMessage,
            description: `O papel ${role.name} foi ${initialData ? "atualizado" : "criado"} com sucesso.`
          });
          onSuccessSubmit?.();
        }),
        catchError((error) => {
          toast({
            title: `Erro ao ${toastMessage}`,
            description: `O papel ${role.name} não foi ${initialData ? "atualizado" : "criado"}.`,
            variant: "destructive"
          });
          console.error(error);
          return [];
        }),
        finalize(() => setLoading(false))
      )
      .subscribe();
  };

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="">
            <div className="flex flex-col gap-y-4">
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <FormLabel className="text-lg font-bold">Nome</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          disabled={loading || isReadOnly()}
                          placeholder="Nome do papel"
                          {...field}
                          className={methods.formState.errors.name ? "border-red-500" : ""}
                        />
                      </FormControl>
                      {methods.formState.errors.name && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertCircle
                                className="h-5 w-5 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{methods.formState.errors.name?.message?.toString()}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                name="description"
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <FormLabel className="text-lg font-bold">Descrição</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Textarea
                          disabled={loading || isReadOnly()}
                          placeholder="Descrição do papel"
                          {...field}
                          className={methods.formState.errors.description ? "border-red-500" : ""}
                        />
                      </FormControl>
                      {methods.formState.errors.description && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertCircle className="h-5 w-5 text-red-500 absolute right-3 top-3" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{methods.formState.errors.description?.message?.toString()}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                name="label"
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <FormLabel className="text-lg font-bold">Label</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          disabled={loading || isReadOnly()}
                          placeholder="Label do papel"
                          {...field}
                          className={methods.formState.errors.label ? "border-red-500" : ""}
                        />
                      </FormControl>
                      {methods.formState.errors.label && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertCircle
                                className="h-5 w-5 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{methods.formState.errors.label?.message?.toString()}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                name="icon"
                render={() => (
                  <FormItem className="mb-2">
                    <FormLabel className="text-lg font-bold">
                      Ícone <span className="italic text-sm">(opcional)</span>
                    </FormLabel>
                    <br />
                    <FormControl>
                      <IconPicker />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Separator className="mt-10" />
          <div className="mt-6 flex justify-between">
            <Button className="" onClick={() => navigate(-1)} variant="ghost">
              Voltar
            </Button>
            {getActionStyle() === "DETAIL" ? null : (
              <Button disabled={loading || isReadOnly()} className="" type="submit">
                {actionMap[getActionStyle()]}
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </>
  );
};

