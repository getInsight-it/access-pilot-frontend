import { FormProvider } from "react-hook-form";
import { FormControl, FormField, FormItem } from "@ui/form.tsx";
import { ScrollArea } from "@ui/scroll-area.tsx";

import { motion } from "framer-motion";
import { HeaderContainer } from "@common/components/heading/heading.tsx";
import { ArrowLeft, ArrowRight, Loader2, Lock, Save } from "lucide-react";
import { SectionLoader } from "@components/loading/section-loader/SectionLoader.tsx";
import { Toggle } from "@common/components/toggle/Toggle.tsx";
import { PRIVATE_ROUTES } from "@constants/routes.ts";
import { useSystemFormData, useFormNavigation, useAttachmentConfigs } from "./useSystemForm.ts";
import { useNavigate } from "react-router-dom";
import { ClientStatusEnum } from "@features/client/common/enum/client-status.enum.ts";
import { AttachmentConfigurationForm } from "@features/client/common/components/AttachmentConfigurationForm.tsx";
import { useI18n } from "@common/context/i18n/I18nContext.tsx";
import "./SystemForm.scss";

const STEP_ITEMS = ["Detalhes do sistema", "Configuração de anexos"];
const DESCRIPTION_MAX_LENGTH = 150;

export default function SystemForm() {
  const { t } = useI18n();
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
  const descriptionValue = methods.watch("description") || "";
  const descriptionCount = descriptionValue.length;
  const pageTitle = initialLoading
    ? t("Carregando sistema...")
    : isEditing ? t("Editar sistema") : t("Novo sistema");
  const pageDescription = initialLoading
    ? t("Aguarde enquanto os dados do sistema são carregados.")
    : t("Preencha os dados gerais e avance para configurar os anexos.");

  const renderStepHeader = () => (
    <div className="system-form__card-header">
      <div className="system-form__steps">
        {STEP_ITEMS.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              className={`system-form__step-item${isActive ? " system-form__step-item--active" : ""}`}
              key={item}
            >
              <span className="system-form__step-number">{index + 1}</span>
              <span className="system-form__step-label">{t(item)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  if(initialLoading) {
    return (
      <motion.div
        className="system-form"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}>

        <HeaderContainer className="system-form__header-container">
          <div className="system-form__header">
            <div className="system-form__header-main">
              <button
                type="button"
                className="system-form__back-button"
                onClick={() => navigate(PRIVATE_ROUTES.SYSTEMS)}
              >
                <ArrowLeft size={18} />
              </button>

              <div className="system-form__heading-content">
                <div className="system-form__title-row">
                  <h2 className="system-form__title">{pageTitle}</h2>
                </div>
                <p className="system-form__description">{pageDescription}</p>
              </div>
            </div>
          </div>
        </HeaderContainer>

        <ScrollArea className="system-form__scroll-area" viewportClassName="system-form__scroll-viewport">
          <div className="system-form__content-wrapper">
            <div className="system-form__card">
              {renderStepHeader()}

              <div className="system-form__card-content">
                <SectionLoader />
              </div>
            </div>
            <div className="system-form__actions">
              <button
                type="button"
                className="ui-button ui-button--white system-form__action-button system-form__action-button--white"
                disabled
              >
                <span>{t("Voltar")}</span>
              </button>
              <button
                type="button"
                className="ui-button ui-button--primary system-form__action-button system-form__action-button--primary"
                disabled
              >
                <span className="system-form__footer-action-content">
                  <Loader2 size={16} />
                  <span>{t("Carregando...")}</span>
                </span>
              </button>
            </div>
          </div>
        </ScrollArea>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="system-form"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}>

      <HeaderContainer className="system-form__header-container">
        <div className="system-form__header">
          <div className="system-form__header-main">
            <button
              type="button"
              className="system-form__back-button"
              onClick={() => navigate(PRIVATE_ROUTES.SYSTEMS)}
            >
              <ArrowLeft size={18} />
            </button>

            <div className="system-form__heading-content">
              <div className="system-form__title-row">
                <h2 className="system-form__title">{pageTitle}</h2>
              </div>
              <p className="system-form__description">{pageDescription}</p>
            </div>
          </div>
        </div>
      </HeaderContainer>

      <ScrollArea className="system-form__scroll-area" viewportClassName="system-form__scroll-viewport">
        <div className="system-form__content-wrapper">
          <div className="system-form__card">
            {renderStepHeader()}

            <div className="system-form__card-content">
              {activeIndex === 1 && (
                <motion.div
                  className="system-form__attachment-step"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}>
                  <AttachmentConfigurationForm
                    currentClientId={methods.watch("clientId") || ""}
                    configurations={attachmentConfigs}
                    onAddConfiguration={handleAddAttachmentConfig}
                    onDeleteConfiguration={handleDeleteAttachmentConfig}
                  />
                </motion.div>
              )}

              {activeIndex === 0 && (
                <motion.div
                  className="system-form__form-step"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}>
                  <FormProvider {...methods}>
                    <form className="system-form__form" onSubmit={methods.handleSubmit(onSubmit)}>
                      <div className="system-form__form-row">
                        <FormField
                          control={methods.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="system-form__field">
                              <label className="system-form__label" htmlFor="name">
                                {t("Nome")} <span className="system-form__required">*</span>
                              </label>
                              <FormControl>
                                <input
                                  id="name"
                                  type="text"
                                  disabled={loading}
                                  placeholder={t("Nome do sistema")}
                                  {...field}
                                  className={`app-input system-form__input${methods.formState.errors.name ? " system-form__input--error" : ""}`}
                                />
                              </FormControl>
                              {methods.formState.errors.name && (
                                <p className="system-form__error">{t(methods.formState.errors.name?.message?.toString() || "")}</p>
                              )}
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={methods.control}
                          name="clientId"
                          render={({ field }) => (
                            <FormItem className="system-form__field">
                              <label className="system-form__label" htmlFor="clientId">
                                {t("Client Id")} <span className="system-form__required">*</span>
                              </label>
                              <FormControl>
                                <div className={`system-form__input-wrap${isEditing ? " system-form__input-wrap--readonly" : ""}`}>
                                  <input
                                    id="clientId"
                                    type="text"
                                    disabled={loading}
                                    readOnly={isEditing}
                                    aria-readonly={isEditing}
                                    placeholder={t("ClientId do IDP")}
                                    {...field}
                                    className={`app-input system-form__input${methods.formState.errors.clientId ? " system-form__input--error" : ""}${isEditing ? " system-form__input--readonly" : ""}`}
                                  />
                                  {isEditing && (
                                    <Lock className="system-form__input-lock" aria-hidden="true" />
                                  )}
                                </div>
                              </FormControl>
                              {methods.formState.errors.clientId && (
                                <p className="system-form__error">{t(methods.formState.errors.clientId?.message?.toString() || "")}</p>
                              )}
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={methods.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className="system-form__field">
                            <label className="system-form__label" htmlFor="description">
                              {t("Descrição")} <span className="system-form__required">*</span>
                            </label>
                            <FormControl>
                              <textarea
                                id="description"
                                disabled={loading}
                                placeholder={t("Descrição do sistema")}
                                maxLength={DESCRIPTION_MAX_LENGTH}
                                {...field}
                                className={`app-textarea system-form__textarea${methods.formState.errors.description ? " system-form__textarea--error" : ""}`}
                              />
                            </FormControl>
                            {methods.formState.errors.description && (
                              <p className="system-form__error">{t(methods.formState.errors.description?.message?.toString() || "")}</p>
                            )}
                            <p className="system-form__counter">{descriptionCount}/{DESCRIPTION_MAX_LENGTH}</p>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={methods.control}
                        name="baseUrl"
                        render={({ field }) => (
                          <FormItem className="system-form__field">
                            <label className="system-form__label" htmlFor="baseUrl">
                              {t("Url")} <span className="system-form__required">*</span>
                            </label>
                            <FormControl>
                              <input
                                id="baseUrl"
                                type="text"
                                disabled={loading}
                                placeholder={t("Url do sistema")}
                                {...field}
                                className={`app-input system-form__input${methods.formState.errors.baseUrl ? " system-form__input--error" : ""}`}
                              />
                            </FormControl>
                            {methods.formState.errors.baseUrl && (
                              <p className="system-form__error">{t(methods.formState.errors.baseUrl?.message?.toString() || "")}</p>
                            )}
                          </FormItem>
                        )}
                      />

                      <div className="system-form__toggle-row">
                        <FormField
                          control={methods.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem className="system-form__toggle-field">
                              <div className="system-form__toggle-control">
                                <FormControl>
                                  <Toggle
                                    checked={field.value === ClientStatusEnum.PUBLISHED}
                                    onCheckedChange={(checked) => {
                                      field.onChange(checked ? ClientStatusEnum.PUBLISHED : ClientStatusEnum.UNPUBLISHED);
                                    }}
                                    disabled={loading}
                                  />
                                </FormControl>
                                <span className="system-form__toggle-value">
                                  {field.value === ClientStatusEnum.PUBLISHED ? t("Publicado") : t("Não publicado")}
                                </span>
                              </div>

                              <span className="system-form__toggle-description">{t("Ative para indicar o status publicado.")}</span>
                              {methods.formState.errors.status && (
                                <p className="system-form__error">{t(methods.formState.errors.status?.message?.toString() || "")}</p>
                              )}
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={methods.control}
                          name="managed"
                          render={({ field }) => (
                            <FormItem className="system-form__toggle-field">
                              <div className="system-form__toggle-control">
                                <FormControl>
                                  <Toggle checked={field.value} onCheckedChange={field.onChange} disabled={loading} />
                                </FormControl>
                                <span className="system-form__toggle-value">{field.value ? t("Gerenciado") : t("Não gerenciado")}</span>
                              </div>

                              <span className="system-form__toggle-description">{t("Ative para indicar que o sistema é gerenciado.")}</span>
                              {methods.formState.errors.managed && (
                                <p className="system-form__error">{t(methods.formState.errors.managed?.message?.toString() || "")}</p>
                              )}
                            </FormItem>
                          )}
                        />
                      </div>
                    </form>
                  </FormProvider>
                </motion.div>
              )}
            </div>
          </div>
          <div className="system-form__actions">
            <button
              type="button"
              className="ui-button ui-button--white system-form__action-button system-form__action-button--white"
              disabled={activeIndex === 0}
              onClick={handleBack}
            >
              <span>{t("Voltar")}</span>
            </button>

            {activeIndex === 0 && (
              <button
                type="button"
                className="ui-button ui-button--primary system-form__action-button system-form__action-button--primary"
                onClick={handleNext}
              >
                <span className="system-form__footer-action-content">
                  <ArrowRight className="system-form__continue-icon" />
                  <span>{t("Continuar")}</span>
                </span>
              </button>
            )}

            {activeIndex === 1 && (
              <button
                type="button"
                className="ui-button ui-button--primary system-form__action-button system-form__action-button--primary"
                onClick={methods.handleSubmit(onSubmit)}
                disabled={loading}
              >
                <span className="system-form__footer-action-content">
                  {loading ? <Loader2 size={16} /> : <Save size={16} />}
                  <span>{loading ? t("Salvando...") : t("Salvar")}</span>
                </span>
              </button>
            )}
          </div>
        </div>
      </ScrollArea>
    </motion.div>
  );
}
