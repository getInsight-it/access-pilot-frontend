import * as z from "zod";
import type React from "react";
import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../../components/ui/select.tsx";
import { LevelInterface } from "../../level/common/types/level.model.ts";
import { levelService } from "../../level/common/api/level-service.ts";
import { goToPreviousRoute } from "../../../common/utils/NavigationStateManager.ts";
import HighlightLoader from "../../../components/highlightloader/HighLightLoader.tsx";

const formSchema = z.object({
  name: z.string().min(3, { message: "O nome do sistema deve conter no mínimo 3 caracteres" }),
  description: z.string().min(3, { message: "A descrição do sistema deve conter no mínimo 3 caracteres" }),
  label: z.string().min(3, { message: "A label do sistema deve conter no mínimo 3 caracteres" }),
  levelId: z.string().optional()
});

interface RoleFormProps {
  client?: ClientResponseInterface;
  onSuccessSubmit?: () => any;
  initialData: RoleResponseInterface | null;
  readonly: boolean;
}

export const RoleForm: React.FC<RoleFormProps> = ({ client, initialData, readonly, onSuccessSubmit }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false); // Para operações de submissão
  const [dataLoading, setDataLoading] = useState(true); // Para carregamento inicial de dados
  const [levels, setLevels] = useState<LevelInterface[]>([]);
  const [loadingLevels, setLoadingLevels] = useState(false);
  const toastMessage = initialData ? "Papel atualizado." : "Papel criado.";
  const navigate = useNavigate();
  const defaultValues = initialData || { name: "", description: "" };

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoadingLevels(true);
      try {
        const response = await levelService.getLevels();
        if (response && response.items) {
          setLevels(response.items);

          if (initialData && initialData.level.id.toString()) {
            methods.setValue("levelId", initialData.level.id.toString());
          }
        }
      } catch (error) {
        console.error("Erro ao carregar esferas:", error);
        toast({
          title: "Erro ao carregar esferas",
          description: "Não foi possível carregar as esferas disponíveis.",
          variant: "destructive"
        });
      } finally {
        setLoadingLevels(false);
        setDataLoading(false);
      }
    };

    fetchData();
  }, [toast, initialData, methods]);

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

  const onSubmit = async (form: any) => {
    const role = {
      ...form,
      levelId: form.levelId === undefined || form.levelId === "empty" ? undefined : Number(form.levelId)
    } as RoleResponseInterface;
    role.client = client;
    setLoading(true);

    try {
      if(initialData) {
        await roleService.updateRole(initialData?.id, role);
      } else {
        await roleService.createRole(role)
      }

      toast({
        title: toastMessage,
        description: `O papel ${role.name} foi ${initialData ? "atualizado" : "criado"} com sucesso.`
      });
      onSuccessSubmit?.();
      navigate(`/dashboard/systems/${client?.clientId}/roles`);
    } catch (error) {
      toast({
        title: `Erro ao ${toastMessage}`,
        description: `O papel ${role.name} não foi ${initialData ? "atualizado" : "criado"}.`,
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Se ainda estiver carregando dados, exibe apenas o loading
  if (dataLoading || loadingLevels) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <HighlightLoader />
      </div>
    );
  }

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-4 md:gap-y-4">
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <FormLabel className="text-base font-semibold">Nome</FormLabel>
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
                name="label"
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <FormLabel className="text-base font-semibold">Label</FormLabel>
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
                name="description"
                render={({ field }) => (
                  <FormItem className="mb-2 col-span-1 md:col-span-2">
                    <FormLabel className="text-base font-semibold">Descrição</FormLabel>
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
                name="levelId"
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <FormLabel className="text-base font-semibold">
                      Esfera <span className="italic text-sm">(opcional)</span>
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Select
                          disabled={loading || isReadOnly() || loadingLevels}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className={methods.formState.errors.levelId ? "border-red-500" : ""}>
                            <SelectValue placeholder="Selecione uma esfera" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="empty">Nenhuma esfera</SelectItem>
                            {!loadingLevels && levels.length > 0 && levels.map((level) => (
                              <SelectItem key={level.id} value={level.id.toString()}>
                                {level.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {methods.formState.errors.levelId && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertCircle
                                className="h-5 w-5 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{methods.formState.errors.levelId?.message?.toString()}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Campo de ícone movido para fora do grid, abaixo dos outros campos */}
            <div className="mt-4">
              <FormField
                name="icon"
                render={() => (
                  <FormItem className="mb-2">
                    <FormLabel className="text-base font-semibold">
                      Ícone <span className="italic text-sm">(opcional)</span>
                    </FormLabel>
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
            <Button type="button" onClick={() => goToPreviousRoute(navigate)} variant="ghost">
              Voltar
            </Button>
            {getActionStyle() === "DETAIL" ? null : (
              <Button disabled={loading || isReadOnly()} type="submit">
                {actionMap[getActionStyle()]}
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </>
  );
};
