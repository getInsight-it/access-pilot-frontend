import { FormProvider } from "react-hook-form";
import { FormControl, FormField, FormItem } from "@ui/form.tsx";
import { Input } from "@ui/input.tsx";
import { Breadcrumbs } from "@components/breadcrumbs.tsx";
import { ScrollArea } from "@ui/scroll-area.tsx";

import { motion } from "framer-motion";
import { HeaderContainer, Heading } from "@components/heading.tsx";
import { Separator } from "@ui/separator.tsx";
import { Button } from "@ui/button.tsx";
import { ArrowRight, Loader2, Save } from "lucide-react";
import HighlightLoader from "@components/loading/HighLightLoader.tsx";
import { Textarea } from "@ui/textarea.tsx";
import { Switch } from "@ui/switch.tsx";
import { Label } from "@ui/label.tsx";
import { PRIVATE_ROUTES } from "@constants/routes.ts";
import { useSystemFormData,useFormNavigation, useAttachmentConfigs } from "./useSystemForm.ts";
import { useNavigate } from "react-router-dom";
import { ClientStatusEnum } from "@features/client/common/enum/client-status.enum.ts";
import { AttachmentConfigurationForm } from "@features/client/common/components/AttachmentConfigurationForm.tsx";

const breadcrumbItems = [
  { title: "Gerenciar sistemas", link: PRIVATE_ROUTES.SYSTEMS },
  { title: "Adicionar novo sistema", link: "" }
];

export default function SystemForm() {
  const {
    methods,
    activeIndex,
    setActiveIndex,
    loading,
    initialLoading,
    isEditing,
    attachmentConfigs,
    setAttachmentConfigs,
    onSubmit
  } = useSystemFormData();
  const { handleNext, handleBack } = useFormNavigation(activeIndex, setActiveIndex, methods as any);
  const { handleAddAttachmentConfig, handleDeleteAttachmentConfig } = useAttachmentConfigs(setAttachmentConfigs);
  const navigate = useNavigate();

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

        <ScrollArea className="flex-grow bg-gray-0 dark:bg-gray-900 border-b" viewportClassName="px-3 sm:px-5 md:px-7">
          <div className="h-full flex items-center justify-center">
            <div className="flex items-center justify-center min-h-[60vh]">
              <HighlightLoader />
            </div>
          </div>
        </ScrollArea>

        <footer className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 h-[72px] sm:h-[80px] md:h-[88px] flex items-center justify-between dark:bg-gray-900 border-t gap-2">
          <Button variant="outline" disabled className="text-sm sm:text-base">
            <span>Voltar</span>
          </Button>
          <Button disabled className="text-sm sm:text-base">
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

      <ScrollArea className="flex-grow bg-gray-0 dark:bg-gray-900 border-b" viewportClassName="px-3 sm:px-5 md:px-7">
        <div className="py-4 sm:py-5 md:py-6 max-w-content-container m-auto">
          {activeIndex === 1 && (
            <motion.div
              className="px-2 sm:px-4 md:px-6"
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
              className="px-2 sm:px-4 md:px-6"
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

      <footer className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 h-[72px] sm:h-[80px] md:h-[88px] flex items-center justify-between dark:bg-gray-900 border-t gap-2">
        <Button variant="outline" disabled={activeIndex === 0} onClick={handleBack} className="text-sm sm:text-base">
          <span>Voltar</span>
        </Button>

        {activeIndex === 0 && (
          <Button onClick={handleNext} className="text-sm sm:text-base">
            <div className="flex flex-row items-center gap-2">
              <ArrowRight size={16}></ArrowRight>
              <span>Continuar</span>
            </div>
          </Button>
        )}

        {activeIndex === 1 && (
          <Button onClick={methods.handleSubmit(onSubmit)} disabled={loading} className="text-sm sm:text-base">
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
