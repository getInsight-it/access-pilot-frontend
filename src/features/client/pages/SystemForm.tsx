import { AttachmentConfigurationForm } from "../common/components/AttachmentConfigurationForm.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../common/external/ui/use-toast.ts";
import { AttachmentConfigurationInterface } from "../common/model/configuration.model.ts";
import { clientService } from "../common/service/client-service.ts";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormControl, FormField, FormItem } from "../../../common/external/ui/form.tsx";
import { Input } from "../../../common/external/ui/input.tsx";
import { Breadcrumbs } from "../../../common/components/breadcrumbs.tsx";
import { ScrollArea } from "../../../common/external/ui/scroll-area.tsx";

import { motion } from "framer-motion";
import { HeaderContainer, Heading } from "../../../common/components/heading.tsx";
import { Separator } from "../../../common/external/ui/separator.tsx";
import { useEffect, useState } from "react";
import { Button } from "../../../common/external/ui/button.tsx";
import { ArrowRight, Loader2, Save } from "lucide-react";
import HighlightLoader from "../../../common/components/loading/HighLightLoader.tsx";
import { Textarea } from "../../../common/external/ui/textarea.tsx";
import { ClientStatusEnum } from "../common/enum/client-status.enum.ts";
import { Switch } from "../../../common/external/ui/switch.tsx";
import { Label } from "../../../common/external/ui/label.tsx";
import { ClientResponseInterface } from "../common/model/client.model.ts";
import { PRIVATE_ROUTES } from "../../../common/constants/routes.ts";
import { formatErrorMessages } from "../../../common/utils/error-utils.ts";

const breadcrumbItems = [
  { title: "Gerenciar sistemas", link: PRIVATE_ROUTES.SYSTEMS },
  { title: "Adicionar novo sistema", link: "" }
];

const formSchema = z.object({
  name: z.string().min(3, { message: "O nome do sistema deve conter no mínimo 3 caracteres" }),
  clientId: z
    .string()
    .min(3, { message: "O client Id do sistema deve conter no mínimo 3 caracteres" })
    .regex(/^[a-z][a-z0-9-]*$/, { message: "client Id deve ser separado por hífen" }),
  description: z.string().min(3, { message: "A descrição do sistema deve conter no mínimo 3 caracteres" }),
  baseUrl: z
    .string()
    .min(3, { message: "O baseUrl do sistema deve conter no mínimo 3 caracteres" })
    .regex(/^(https|http?:\/\/)?([\w.-:?-]+)$/, { message: "baseUrl inválido" }),
  managed: z.boolean().default(true),
  status: z.string().optional().nullable().default(ClientStatusEnum.UNPUBLISHED)
});

export default function SystemForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { clientId: urlClientId } = useParams();

  const isEditing = window.location.pathname.includes("edit");
  const clientId = isEditing ? urlClientId : null;

  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [initialData, setInitialData] = useState<any>(null);

  const getClientToEdit = async () => {
    if(!clientId) return;

    try {
      setInitialLoading(true);
      const client: ClientResponseInterface = await clientService.fetchByClientId(clientId);

      const formData = {
        id: client.id,
        name: client.name || "",
        label: client.label || "",
        clientId: client.clientId || "",
        description: client.description || "",
        managed: client.managed || false,
        baseUrl: client.baseUrl || "",
        status: client.status || ClientStatusEnum.UNPUBLISHED
      };

      setInitialData(formData);

      methods.reset(formData as any);

      if(client.configurations) {
        setAttachmentConfigs(client.configurations);
      }

    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error.error);
      toast({
        title: "Erro ao buscar dados do sistema",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const defaultValues = {
    id: "",
    name: "",
    label: "",
    clientId: "",
    description: "",
    managed: false,
    baseUrl: "",
    status: ClientStatusEnum.UNPUBLISHED
  };

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
    mode: "onChange"
  });

  const handleNext = () => {
    if(activeIndex === 0) {
      methods.trigger().then((isValid) => {
        if(isValid) {
          setActiveIndex(activeIndex + 1);
        }
      });
    } else {
      setActiveIndex(activeIndex + 1);
    }
  };

  const handleBack = () => {
    setActiveIndex(activeIndex - 1);
  };

  const [attachmentConfigs, setAttachmentConfigs] = useState<AttachmentConfigurationInterface[]>([]);
  const handleAddAttachmentConfig = (config: AttachmentConfigurationInterface) => {
    setAttachmentConfigs(prev => {
      return [...prev, config];
    });
  };
  const handleDeleteAttachmentConfig = (name: string) => {
    setAttachmentConfigs(prev => {
      return prev.filter(config => config.name !== name);
    });
  };

  const onSubmit = async (form: any) => {
    try {
      setLoading(true);
      const payload = { ...form, configurations: attachmentConfigs };

      if(initialData?.id) {
        payload.id = initialData.id;
        if(initialData.configurations && initialData.configurations.length > 0) {
          const payloadConfigNames = new Set(
            payload.configurations.map((config: AttachmentConfigurationInterface) => config.name)
          );
          const payloadConfigIds = new Set(
            payload.configurations
              .filter((config: AttachmentConfigurationInterface) => config.id)
              .map((config: AttachmentConfigurationInterface) => config.id)
          );
          const configsToDeactivate: AttachmentConfigurationInterface[] = [];
          const deletedConfigs = initialData.configurations.filter(
            (config: AttachmentConfigurationInterface) =>
              !payloadConfigNames.has(config.name)
          );
          const replacedConfigs = initialData.configurations.filter(
            (config: AttachmentConfigurationInterface) =>
              payloadConfigNames.has(config.name) &&
              config.id &&
              !payloadConfigIds.has(config.id)
          );
          configsToDeactivate.push(
            ...deletedConfigs,
            ...replacedConfigs
          );
          if(configsToDeactivate.length > 0) {
            const inactiveConfigs = configsToDeactivate.map(
              (config: AttachmentConfigurationInterface) => ({
                ...config,
                active: false
              })
            );

            payload.configurations = [...payload.configurations, ...inactiveConfigs];
          }
        }

        await clientService.updateClient(initialData.id, payload);
        toast({ title: "Sistema atualizado", description: "O sistema foi atualizado com sucesso" });
        navigate("/dashboard/systems/" + form.clientId + "/details");
      } else {
        await clientService.createClient(payload);
        toast({ title: "Sistema criado", description: "O sistema foi criado com sucesso" });
        navigate("/dashboard/systems/" + form.clientId + "/details");
      }
    } catch (error: any) {
      const errorMessage: string = formatErrorMessages(error.error);
      toast({
        title: "Erro ao realizar operação no sistema",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(isEditing && clientId) {
      getClientToEdit();
    }
  }, [clientId, isEditing]);

  if(initialLoading) {
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
                title="Carregando sistema..."
                headerStepper={true}
                headerStepperActiveIndex={activeIndex}
                headerStepperItems={["Detalhes do sistema", "Configuração de anexos"]}
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

        <footer className="px-6 h-[88px] flex items-center justify-between dark:bg- border-t">
          <Button variant="outline" disabled>
            <span>Voltar</span>
          </Button>
          <Button disabled>
            <div className="flex flex-row items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              <span>Carregando...</span>
            </div>
          </Button>
        </footer>
      </motion.div>
    );
  }

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
              title={isEditing ? "Editar sistema" : "Novo sistema"}
              headerStepper={true}
              headerStepperActiveIndex={activeIndex}
              headerStepperItems={["Detalhes do sistema", "Configuração de anexos"]}
              returnButton={true}
              onReturnClick={() => {navigate(PRIVATE_ROUTES.SYSTEMS);}}
            />
          </div>
        </HeaderContainer>

        <Separator />
      </div>

      <ScrollArea className="flex-grow bg-gray-0 dark:bg-gray-900 border-b" viewportClassName="px-7">
        <div className="py-6 max-w-content-container m-auto">
          {activeIndex === 1 && (
            <motion.div
              className="px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}>
              <AttachmentConfigurationForm
                configurations={attachmentConfigs}
                onAddConfiguration={handleAddAttachmentConfig}
                onDeleteConfiguration={handleDeleteAttachmentConfig}
              />
            </motion.div>
          )}
          {activeIndex === 0 && (
            <motion.div
              className="px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}>
              <FormProvider {...methods}>
                <form className="max-w-content-container m-auto" onSubmit={methods.handleSubmit(onSubmit)}>
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-4 md:gap-y-4">
                      <FormField
                        control={methods.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="mb-2">
                            <Label className="text-sm font-normal text-gray-700 dark:text-gray-300"
                                   htmlFor="name">Nome <span className="text-primary-600">*</span></Label>
                            <FormControl>
                              <Input
                                id="name"
                                disabled={loading}
                                placeholder="Nome do sistema"
                                {...field}
                                className={`mt-2 ${methods.formState.errors.name ? "border-red-500" : ""}`}
                              />
                            </FormControl>
                            {methods.formState.errors.name && (
                              <p
                                className="text-sm text-red-500 mt-1">{methods.formState.errors.name?.message?.toString()}</p>
                            )}
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={methods.control}
                        name="clientId"
                        render={({ field }) => (
                          <FormItem className="mb-2">
                            <Label className="text-sm font-normal text-gray-700 dark:text-gray-300" htmlFor="clientId">Client
                              Id <span className="text-primary-600">*</span></Label>
                            <FormControl>
                              <Input
                                id="clientId"
                                disabled={loading}
                                placeholder="ClientId do IDP"
                                {...field}
                                className={`mt-2 ${methods.formState.errors.clientId ? "border-red-500" : ""}`}
                              />
                            </FormControl>
                            {methods.formState.errors.clientId && (
                              <p
                                className="text-sm text-red-500 mt-1">{methods.formState.errors.clientId?.message?.toString()}</p>
                            )}
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={methods.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className="mb-2 col-span-1 md:col-span-2">
                            <Label className="text-sm font-normal text-gray-700 dark:text-gray-300"
                                   htmlFor="description">Descrição <span className="text-primary-600">*</span></Label>
                            <FormControl>
                              <Textarea
                                id="description"
                                disabled={loading}
                                placeholder="Descrição do sistema"
                                {...field}
                                className={`mt-2 ${methods.formState.errors.description ? "border-red-500" : ""}`}
                              />
                            </FormControl>
                            {methods.formState.errors.description && (
                              <p
                                className="text-sm text-red-500 mt-1">{methods.formState.errors.description?.message?.toString()}</p>
                            )}
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={methods.control}
                        name="baseUrl"
                        render={({ field }) => (
                          <FormItem className="mb-2 md:col-span-2">
                            <Label className="text-sm font-normal text-gray-700 dark:text-gray-300"
                                   htmlFor="baseUrl">Url <span className="text-primary-600">*</span></Label>
                            <FormControl>
                              <Input
                                id="baseUrl"
                                disabled={loading}
                                placeholder="Url do sistema"
                                {...field}
                                className={`mt-2 ${methods.formState.errors.baseUrl ? "border-red-500" : ""}`}
                              />
                            </FormControl>
                            {methods.formState.errors.baseUrl && (
                              <p
                                className="text-sm text-red-500 mt-1">{methods.formState.errors.baseUrl?.message?.toString()}</p>
                            )}
                          </FormItem>
                        )}
                      />

                      <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-6">
                        <FormField
                          control={methods.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem className="mb-2">
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                  <FormControl>
                                    <Switch
                                      checked={field.value === ClientStatusEnum.PUBLISHED}
                                      onCheckedChange={(checked) => {
                                        field.onChange(checked ? ClientStatusEnum.PUBLISHED : ClientStatusEnum.UNPUBLISHED);
                                      }}
                                      disabled={loading}
                                    />
                                  </FormControl>
                                  <span
                                    className="text-sm font-normal text-gray-700 dark:text-gray-300">{field.value === ClientStatusEnum.PUBLISHED ? "Publicado" : "Não publicado"}</span>
                                </div>
                                <span className="text-sm font-normal text-gray-700 dark:text-gray-300">Ative para indicar o status publicado.</span>
                                {methods.formState.errors.status && (
                                  <p
                                    className="text-sm text-red-500">{methods.formState.errors.status?.message?.toString()}</p>
                                )}
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={methods.control}
                          name="managed"
                          render={({ field }) => (
                            <FormItem className="mb-2 flex-1">
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                  <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} disabled={loading} />
                                  </FormControl>
                                  <span
                                    className="text-sm font-normal text-gray-700 dark:text-gray-300">{field.value ? "Gerenciado" : "Não gerenciado"}</span>
                                </div>
                                <span className="text-sm font-normal text-gray-700 dark:text-gray-300">Ative para indicar que o sistema é gerenciado.</span>
                                {methods.formState.errors.managed && (
                                  <p
                                    className="text-sm text-red-500">{methods.formState.errors.managed?.message?.toString()}</p>
                                )}
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </FormProvider>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      <footer className="px-6 h-[88px] flex items-center justify-between dark:bg- border-t">
        <Button variant="outline" disabled={activeIndex === 0} onClick={handleBack}>
          <span>Voltar</span>
        </Button>

        {activeIndex === 0 && (
          <Button onClick={handleNext}>
            <div className="flex flex-row items-center gap-2">
              <ArrowRight size={16}></ArrowRight>
              <span>Continuar</span>
            </div>
          </Button>
        )}

        {activeIndex === 1 && (
          <Button onClick={methods.handleSubmit(onSubmit)} disabled={loading}>
            <div className="flex flex-row items-center gap-2">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              <span>{loading ? "Salvando..." : "Salvar"}</span>
            </div>
          </Button>
        )}
      </footer>
    </motion.div>
  );
}
