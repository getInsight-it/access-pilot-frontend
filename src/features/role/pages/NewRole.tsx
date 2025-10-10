import { Breadcrumbs } from "../../../common/components/breadcrumbs.tsx";
import { ScrollArea } from "../../../common/external/ui/scroll-area.tsx";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { catchError, from, tap } from "rxjs";
import useAuthStore from "../../../store/authStore.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useToast } from "../../../common/external/ui/use-toast.ts";
import { motion } from "framer-motion";
import { HeaderContainer, Heading } from "../../../common/components/heading.tsx";
import { Separator } from "../../../common/external/ui/separator.tsx";
import { Button } from "../../../common/external/ui/button.tsx";
import { FormControl, FormField, FormItem } from "../../../common/external/ui/form.tsx";
import { Input } from "../../../common/external/ui/input.tsx";
import { Textarea } from "../../../common/external/ui/textarea.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../common/external/ui/select.tsx";
import { IconPicker } from "../../../common/components/icon/IconPicker.tsx";
import { Label } from "../../../common/external/ui/label.tsx";
import { clientService } from "../../client/common/service/client-service.ts";
import { ClientResponseInterface } from "../../client/common/model/client.model.ts";
import { roleService } from "../common/service/role-service.ts";
import { RoleResponseInterface } from "../common/types/role.model.ts";
import { LevelInterface } from "../../level/common/types/level.model.ts";
import { levelService } from "../../level/common/api/level-service.ts";
import { PRIVATE_ROUTES } from "../../../common/constants/routes.ts";
import { goToPreviousRoute } from "../../../common/utils/NavigationStateManager.ts";

import HighlightLoader from "../../../common/components/loading/HighLightLoader.tsx";
import { formatErrorMessages } from "../../../common/utils/error-utils.ts";

import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(3, { message: "O nome do sistema deve conter no mínimo 3 caracteres" }),
  description: z.string().min(3, { message: "A descrição do sistema deve conter no mínimo 3 caracteres" }),
  label: z.string().min(3, { message: "A label do sistema deve conter no mínimo 3 caracteres" }),
  levelId: z.string().optional()
});

export default function NewRole() {
  const { toast } = useToast();
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const params = useParams();
  const navigate = useNavigate();

  const isEditing = window.location.pathname.includes("edit");
  const roleId = isEditing ? params.id : null;

  const [client, setClient] = useState<ClientResponseInterface>();
  const [levels, setLevels] = useState<LevelInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [loadingLevels, setLoadingLevels] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);

  const defaultValues = {
    name: "",
    description: "",
    label: "",
    levelId: ""
  };

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
    mode: "onChange"
  });

  const breadcrumbItems = [
    { title: isEditing ? "Editar papel" : "Adicionar novo papel", link: "" }
  ];

  const getRoleToEdit = async () => {
    console.log("getRoleToEdit");
    if(!roleId || !params.clientId) return;

    try {
      const role: RoleResponseInterface = await roleService.getRoleById(roleId);

      const formData = {
        id: role.id,
        name: role.name || "",
        label: role.label || "",
        description: role.description || "",
        levelId: role.level?.id ? role.level.id.toString() : ""
      };

      setInitialData(formData);
      methods.reset(formData as any);

    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error.error);
      toast({
        title: "Erro ao buscar dados do papel",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const getData = async () => {
    const clientId = params.clientId;
    if(!clientId) return;

    from(clientService.fetchByClientId(params.clientId)).pipe(
      tap((response) => {
        if(response) {
          setClient(response);
        }
      }),
      catchError((error) => {
        const errorMessage: string = formatErrorMessages(error.error);
        toast({
          title: "Erro ao buscar dados do sistema",
          description: errorMessage,
          variant: "destructive"
        });
        return [];
      })
    ).subscribe();
  };

  const fetchLevels = async () => {
    setLoadingLevels(true);
    try {
      const response = await levelService.getLevels();
      if (response && response.items) {
        setLevels(response.items);
      }
    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error.error);
      toast({
        title: "Erro ao carregar esferas",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoadingLevels(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setDataLoading(true);
      if (isEditing && roleId) {
        await Promise.all([getData(), fetchLevels(), getRoleToEdit()]);
      } else {
        await Promise.all([getData(), fetchLevels()]);
      }
      setDataLoading(false);
    };

    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, params.clientId, roleId, isEditing]);

  const onSubmit = async (form: any) => {
    const role = {
      ...form,
      levelId: form.levelId === undefined || form.levelId === "empty" || form.levelId === "" ? undefined : Number(form.levelId)
    } as RoleResponseInterface;
    role.client = client;
    setLoading(true);

    try {
      if(initialData?.id) {
        await roleService.updateRole(initialData.id, role);
        toast({
          title: "Papel atualizado",
          description: `O papel ${role.name} foi atualizado com sucesso.`
        });
      } else {
        await roleService.createRole(role);
        toast({
          title: "Papel criado",
          description: `O papel ${role.name} foi criado com sucesso.`
        });
      }

      navigate(`/dashboard/systems/${client?.clientId}/roles`);
    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error.error);
      toast({
        title: isEditing ? "Erro ao atualizar papel" : "Erro ao criar papel",
        description: errorMessage,
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading || loadingLevels) {
    return (
      <motion.div
        className="flex flex-col h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}>

        <div className="flex-none">
          <HeaderContainer>
            <Breadcrumbs items={breadcrumbItems} />

            <div className="pl-1 flex items-start justify-between">
              <Heading
                title={isEditing ? "Carregando papel..." : "Carregando..."}
                returnButton={true}
                onReturnClick={() => {goToPreviousRoute(navigate);}}
              />
            </div>
          </HeaderContainer>

          <Separator />
        </div>

        <ScrollArea className="flex-grow bg-gray-0 dark:bg-gray-900 border-b" viewportClassName="px-7">
          <div className="h-full flex items-center justify-center">
            <div className="flex items-center justify-center min-h-[60vh]">
              <HighlightLoader />
            </div>
          </div>
        </ScrollArea>

        <footer className="px-6 h-[88px] flex items-center justify-end dark:bg- border-t">
          <Button disabled>
            {isEditing ? "Atualizando..." : "Criando..."}
          </Button>
        </footer>
      </motion.div>
    );
  }

  return (
    <ScrollArea className="h-full" viewportClassName="px-7">
      <motion.div
        className="flex flex-col h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}>

        <div className="flex-none">
          <HeaderContainer>
            <Breadcrumbs items={breadcrumbItems} />

            <div className="pl-1 flex items-start justify-between">
              <Heading
                title={isEditing ? "Editar papel" : "Novo papel"}
                returnButton={true}
                onReturnClick={() => {goToPreviousRoute(navigate);}}
                customDescription={
                  <span className="text-md">
                    Sistema: <span
                    onClick={() => {
                      navigate(PRIVATE_ROUTES.SYSTEMS_DETAILS.replace(":clientId", params.clientId!));
                    }}
                    className="text-primary-600 cursor-pointer underline">{client?.clientId || ""}</span>
                  </span>
                }
              />
            </div>
          </HeaderContainer>

          <Separator />
        </div>

        <ScrollArea className="flex-grow bg-gray-0 dark:bg-gray-900 border-b" viewportClassName="px-6">
          <div className="py-6 max-w-content-container m-auto">
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="w-full mt-4 max-w-content-container m-auto">
                <div className="space-y-4 pb-10">
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <FormField
                      control={methods.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="text-sm font-normal text-gray-700 dark:text-gray-300" htmlFor="name">
                            Nome <span className="text-primary-600">*</span>
                          </Label>
                          <FormControl>
                            <Input
                              id="name"
                              className={`mt-2 ${methods.formState.errors.name ? "border-red-500" : ""}`}
                              placeholder="Nome do papel"
                              disabled={loading}
                              {...field}
                            />
                          </FormControl>
                          {methods.formState.errors.name && (
                            <p className="text-sm text-red-500 mt-1">
                              {methods.formState.errors.name?.message?.toString()}
                            </p>
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={methods.control}
                      name="label"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="text-sm font-normal text-gray-700 dark:text-gray-300" htmlFor="label">
                            Label <span className="text-primary-600">*</span>
                          </Label>
                          <FormControl>
                            <Input
                              id="label"
                              className={`mt-2 ${methods.formState.errors.label ? "border-red-500" : ""}`}
                              placeholder="Label do papel"
                              disabled={loading}
                              {...field}
                            />
                          </FormControl>
                          {methods.formState.errors.label && (
                            <p className="text-sm text-red-500 mt-1">
                              {methods.formState.errors.label?.message?.toString()}
                            </p>
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={methods.control}
                      name="levelId"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="text-sm font-normal text-gray-700 dark:text-gray-300" htmlFor="levelId">
                            Esfera
                          </Label>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={loading}
                            >
                              <SelectTrigger className={`mt-2 ${methods.formState.errors.levelId ? "border-red-500" : ""}`}>
                                <SelectValue placeholder="Selecione uma esfera" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="empty">Nenhuma esfera</SelectItem>
                                {levels && levels.length > 0 && levels.map((level) => (
                                  <SelectItem key={level.id} value={level.id.toString()}>
                                    {level.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          {methods.formState.errors.levelId && (
                            <p className="text-sm text-red-500 mt-1">
                              {methods.formState.errors.levelId?.message?.toString()}
                            </p>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={methods.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="text-sm font-normal text-gray-700 dark:text-gray-300" htmlFor="description">
                            Descrição <span className="text-primary-600">*</span>
                          </Label>
                          <FormControl>
                            <Textarea
                              id="description"
                              placeholder="Descrição do papel"
                              className={`resize-none mt-2 ${methods.formState.errors.description ? "border-red-500" : ""}`}
                              disabled={loading}
                              {...field}
                              maxLength={200}
                            />
                          </FormControl>
                          {methods.formState.errors.description && (
                            <p className="text-sm text-red-500 mt-1">
                              {methods.formState.errors.description?.message?.toString()}
                            </p>
                          )}
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                            {field.value?.length || 0}/200 caracteres
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      name="icon"
                      render={() => (
                        <FormItem>
                          <Label className="text-sm font-normal text-gray-700 dark:text-gray-300">
                            Ícone <span className="italic text-sm">(opcional)</span>
                          </Label>
                          <FormControl>
                            <div className="mt-2">
                              <IconPicker />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </form>
            </FormProvider>
          </div>
        </ScrollArea>

        <footer className="px-6 h-[88px] flex items-center justify-end dark:bg- border-t">
          <Button
            type="submit"
            onClick={methods.handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? (isEditing ? "Atualizando..." : "Criando...") : (isEditing ? "Atualizar papel" : "Adicionar papel")}
          </Button>
        </footer>
      </motion.div>
    </ScrollArea>
  );
}
