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
import { useSystemFormData, useFormNavigation, useAttachmentConfigs } from "./useSystemForm.ts";
import { useNavigate } from "react-router-dom";
import { ClientStatusEnum } from "@features/client/common/enum/client-status.enum.ts";
import { AttachmentConfigurationForm } from "@features/client/common/components/AttachmentConfigurationForm.tsx";

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

  const breadcrumbItems = [
    { title: "Gerenciar sistemas", link: PRIVATE_ROUTES.SYSTEMS },
    { title: isEditing ? "Editar sistema" : "Adicionar novo sistema", link: "" }
  ];

  if(initialLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}>

        <div>
          <HeaderContainer>
            <Breadcrumbs items={breadcrumbItems} />

            <div className="pl-1">
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

        <ScrollArea viewportClassName="px-3 sm:px-5 md:px-7">
          <div>
            <div>
              <HighlightLoader />
            </div>
          </div>
        </ScrollArea>

        <footer>
          <Button variant="outline" disabled>
            <span>Voltar</span>
          </Button>
          <Button disabled>
            <div>
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}>

      <div>
        <HeaderContainer>
          <Breadcrumbs items={breadcrumbItems} />

          <div className="pl-1">
            <Heading
              title={isEditing ? "Editar sistema" : "Novo sistema"}
              headerStepper={true}
              headerStepperActiveIndex={activeIndex}
              headerStepperItems={["Detalhes do sistema", "Configuração de anexos"]}
              returnButton={true}
              onReturnClick={() => {navigate(PRIVATE_ROUTES.SYSTEMS);}}
              code={methods.getValues("id")}
            />
          </div>
        </HeaderContainer>

        <Separator />
      </div>

      <ScrollArea viewportClassName="px-3 sm:px-5 md:px-7">
        <div className="max-w-content-container m-auto">
          {activeIndex === 1 && (
            <motion.div
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}>
              <FormProvider {...methods}>
                <form className="max-w-content-container m-auto" onSubmit={methods.handleSubmit(onSubmit)}>
                  <div>
                    <div>
                      <FormField
                        control={methods.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <Label htmlFor="name">Nome <span className="text-primary-600">*</span></Label>
                            <FormControl>
                              <Input
                                id="name"
                                disabled={loading}
                                placeholder="Nome do sistema"
                                {...field}
                                className={`${methods.formState.errors.name ? "border-red-500" : ""}`}
                              />
                            </FormControl>
                            {methods.formState.errors.name && (
                              <p>{methods.formState.errors.name?.message?.toString()}</p>
                            )}
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={methods.control}
                        name="clientId"
                        render={({ field }) => (
                          <FormItem>
                            <Label htmlFor="clientId">Client
                              Id <span className="text-primary-600">*</span></Label>
                            <FormControl>
                              <Input
                                id="clientId"
                                disabled={loading}
                                placeholder="ClientId do IDP"
                                {...field}
                                className={`${methods.formState.errors.clientId ? "border-red-500" : ""}`}
                              />
                            </FormControl>
                            {methods.formState.errors.clientId && (
                              <p>{methods.formState.errors.clientId?.message?.toString()}</p>
                            )}
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={methods.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className="col-span-1 md:col-span-2">
                            <Label htmlFor="description">Descrição <span className="text-primary-600">*</span></Label>
                            <FormControl>
                              <Textarea
                                id="description"
                                disabled={loading}
                                placeholder="Descrição do sistema"
                                {...field}
                                className={`${methods.formState.errors.description ? "border-red-500" : ""}`}
                              />
                            </FormControl>
                            {methods.formState.errors.description && (
                              <p>{methods.formState.errors.description?.message?.toString()}</p>
                            )}
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={methods.control}
                        name="baseUrl"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <Label htmlFor="baseUrl">Url <span className="text-primary-600">*</span></Label>
                            <FormControl>
                              <Input
                                id="baseUrl"
                                disabled={loading}
                                placeholder="Url do sistema"
                                {...field}
                                className={`${methods.formState.errors.baseUrl ? "border-red-500" : ""}`}
                              />
                            </FormControl>
                            {methods.formState.errors.baseUrl && (
                              <p>{methods.formState.errors.baseUrl?.message?.toString()}</p>
                            )}
                          </FormItem>
                        )}
                      />

                      <div className="col-span-1 md:col-span-2">
                        <FormField
                          control={methods.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <div>
                                <div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value === ClientStatusEnum.PUBLISHED}
                                      onCheckedChange={(checked) => {
                                        field.onChange(checked ? ClientStatusEnum.PUBLISHED : ClientStatusEnum.UNPUBLISHED);
                                      }}
                                      disabled={loading}
                                    />
                                  </FormControl>
                                  <span>{field.value === ClientStatusEnum.PUBLISHED ? "Publicado" : "Não publicado"}</span>
                                </div>
                                <span>Ative para indicar o status publicado.</span>
                                {methods.formState.errors.status && (
                                  <p>{methods.formState.errors.status?.message?.toString()}</p>
                                )}
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={methods.control}
                          name="managed"
                          render={({ field }) => (
                            <FormItem>
                              <div>
                                <div>
                                  <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} disabled={loading} />
                                  </FormControl>
                                  <span>{field.value ? "Gerenciado" : "Não gerenciado"}</span>
                                </div>
                                <span>Ative para indicar que o sistema é gerenciado.</span>
                                {methods.formState.errors.managed && (
                                  <p>{methods.formState.errors.managed?.message?.toString()}</p>
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

      <footer>
        <Button variant="outline" disabled={activeIndex === 0} onClick={handleBack}>
          <span>Voltar</span>
        </Button>

        {activeIndex === 0 && (
          <Button onClick={handleNext}>
            <div>
              <ArrowRight size={16}></ArrowRight>
              <span>Continuar</span>
            </div>
          </Button>
        )}

        {activeIndex === 1 && (
          <Button onClick={methods.handleSubmit(onSubmit)} disabled={loading}>
            <div>
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              <span>{loading ? "Salvando..." : "Salvar"}</span>
            </div>
          </Button>
        )}
      </footer>
    </motion.div>
  );
}
