import { Breadcrumbs } from "../../../../common/components/breadcrumbs.tsx";
import { ScrollArea } from "../../../../common/external/ui/scroll-area.tsx";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore, { AuthState } from "../../../../store/authStore.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { HeaderContainer, Heading } from "../../../../common/components/heading.tsx";
import { Separator } from "../../../../common/external/ui/separator.tsx";
import { Button } from "../../../../common/external/ui/button.tsx";
import { FormControl, FormField, FormItem } from "../../../../common/external/ui/form.tsx";
import { Input } from "../../../../common/external/ui/input.tsx";
import { Textarea } from "../../../../common/external/ui/textarea.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../common/external/ui/select.tsx";
import { IconPicker } from "../../../../common/components/icon/IconPicker.tsx";
import { Label } from "../../../../common/external/ui/label.tsx";
import { goToPreviousRoute } from "../../../../common/utils/NavigationStateManager.ts";
import HighlightLoader from "../../../../common/components/loading/HighLightLoader.tsx";
import { formSchema, RoleFormData, useNewRoleData, useRoleSubmit, useRoleNavigation } from "./useNewRole.ts";

const defaultValues: RoleFormData = {
  name: "",
  description: "",
  label: "",
  levelId: "",
  icon: ""
};

export default function NewRole() {
  const isAuthenticated = useAuthStore((state: AuthState) => state.isAuthenticated);
  const navigate = useNavigate();

  const {
    client,
    levels,
    loading,
    setLoading,
    dataLoading,
    setDataLoading,
    loadingLevels,
    initialData,
    isEditing,
    clientId,
    loadData
  } = useNewRoleData();

  const methods = useForm<RoleFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
    mode: "onChange"
  });

  const { onSubmit } = useRoleSubmit(client, initialData, isEditing, setLoading);
  const { navigateToSystemDetails } = useRoleNavigation(clientId);

  useEffect(() => {
    const initializeData = async () => {
      if (isAuthenticated) {
        const roleData = await loadData();
        setDataLoading(false);
        
        if (roleData) {
          methods.reset(roleData);
        }
      }
    };

    initializeData();
  }, [isAuthenticated, loadData, methods, setDataLoading]);

  const breadcrumbItems = [
    { title: isEditing ? "Editar papel" : "Adicionar novo papel", link: "" }
  ];

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

        <ScrollArea className="flex-grow bg-gray-0 dark:bg-gray-900 border-b">
          <div className="h-full flex items-center justify-center">
            <div className="flex items-center justify-center min-h-[60vh]">
              <HighlightLoader />
            </div>
          </div>
        </ScrollArea>

        <footer className="px-6 h-[88px] flex items-center justify-end bg-white dark:bg-gray-800 border-t">
          <Button disabled>
            {isEditing ? "Atualizando..." : "Criando..."}
          </Button>
        </footer>
      </motion.div>
    );
  }

  return (
    <ScrollArea className="h-full">
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
                    onClick={navigateToSystemDetails}
                    className="text-primary-600 cursor-pointer underline">{client?.clientId || ""}</span>
                  </span>
                }
                code={ isEditing ? client?.id?.toString() || "" : null}
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
                      control={methods.control}
                      name="icon"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="text-sm font-normal text-gray-700 dark:text-gray-300">
                            Ícone <span className="italic text-sm">(opcional)</span>
                          </Label>
                          <FormControl>
                            <div className="mt-2">
                              <IconPicker value={field.value} onChange={field.onChange} />
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

        <footer className="px-6 h-[88px] flex items-center justify-end bg-white dark:bg-gray-800 border-t">
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

