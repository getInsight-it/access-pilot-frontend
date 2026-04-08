import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { HeaderContainer } from "@common/components/heading/heading.tsx";
import { ColorPicker } from "@common/components/color-picker/ColorPicker.tsx";
import { SectionLoader } from "../../../../../common/components/loading/section-loader/SectionLoader.tsx";
import { PRIVATE_ROUTES } from "../../../../../common/constants/routes.ts";
import { Button } from "../../../../../common/external/ui/button.tsx";
import { RadioGroup, RadioGroupItem } from "../../../../../common/external/ui/radio-group.tsx";
import { ScrollArea } from "../../../../../common/external/ui/scroll-area.tsx";
import { useI18n } from "../../../../../common/context/i18n/I18nContext.tsx";
import useAuthStore, { AuthState } from "../../../../../store/authStore.ts";
import { useCreateLevelData, useCreateLevelOperations } from "./useCreateLevel.ts";
import "./CreateLevel.scss";

interface FormErrors {
  name?: string;
  sigla?: string;
  description?: string;
  endpoint?: string;
  apiKey?: string;
}

export default function CreateOrEditLevel() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state: AuthState) => state.isAuthenticated);
  const formData = useCreateLevelData();
  const { handleSubmit } = useCreateLevelOperations(formData);
  const { initializeForm } = formData;
  const [errors, setErrors] = useState<FormErrors>({});

  const pageTitle = formData.isEditing ? t("Editar esfera") : t("Nova esfera");
  const pageDescription = formData.isEditing
    ? t("Atualize os dados da esfera e salve as alteracoes.")
    : t("Preencha os dados gerais para criar uma nova esfera.");

  useEffect(() => {
    if (isAuthenticated) {
      initializeForm();
    }
  }, [isAuthenticated, initializeForm]);

  if (formData.loading) {
    return (
      <div className="create-level__loader">
        <SectionLoader />
      </div>
    );
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const name = formData.name?.trim() || "";
    const sigla = formData.sigla?.trim() || "";
    const description = formData.description?.trim() || "";

    if (name.length < 3) {
      newErrors.name = "O nome da esfera deve conter no mínimo 3 caracteres";
    }

    const siglaRegex = /^[A-Za-z0-9]+$/;
    if (sigla.length === 0) {
      newErrors.sigla = "A sigla é obrigatória";
    } else if (!siglaRegex.test(sigla)) {
      newErrors.sigla = "A sigla deve conter apenas letras e números, sem espaços ou caracteres especiais.";
    }

    if (description.length < 3) {
      newErrors.description = "A descrição da esfera deve conter no mínimo 3 caracteres";
    }

    if (formData.type === "EXTERNAL") {
      const endpoint = formData.endpoint?.trim() || "";
      const apiKeyValue = formData.apiKey?.trim() || "";

      if (endpoint.length < 3) {
        newErrors.endpoint = "O endpoint é obrigatório para esferas externas.";
      }

      if (apiKeyValue.length === 0 && !formData.hasExistingApiKey) {
        newErrors.apiKey = "A API Key é obrigatória para esferas externas.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (event?: React.FormEvent) => {
    event?.preventDefault();
    if (!validateForm()) return;
    handleSubmit(event);
  };

  return (
    <motion.div
      className="create-level"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}
    >
      <HeaderContainer className="create-level__header-container">
        <div className="create-level__header">
          <div className="create-level__header-main">
            <button
              type="button"
              className="create-level__back-button"
              onClick={() => navigate(PRIVATE_ROUTES.LEVELS)}
            >
              <ArrowLeft size={18} />
            </button>

            <div className="create-level__heading-content">
              <div className="create-level__title-row">
                <h2 className="create-level__title">{pageTitle}</h2>
              </div>
              <p className="create-level__description">{pageDescription}</p>
            </div>
          </div>
        </div>
      </HeaderContainer>

      <ScrollArea className="create-level__scroll-area" viewportClassName="create-level__scroll-viewport">
        <div className="create-level__content-wrapper">
          <form className="create-level__form" onSubmit={handleSave}>
            <div className="create-level__card">
              <div className="create-level__card-content">
                <div className="create-level__row">
                  <div className="create-level__field">
                    <label className="create-level__label" htmlFor="name">
                      {t("Nome")} <span className="create-level__required">*</span>
                    </label>
                    <input
                      id="name"
                      value={formData.name}
                      placeholder={t("Nome da esfera")}
                      className={`app-input create-level__input${errors.name ? " create-level__input--error" : ""}`}
                      onChange={(event) => {
                        formData.setName(event.target.value);
                        if (errors.name) {
                          setErrors((previous) => ({ ...previous, name: undefined }));
                        }
                      }}
                      required
                    />
                    {errors.name && <p className="create-level__error">{t(errors.name)}</p>}
                  </div>

                  <div className="create-level__field">
                    <label className="create-level__label" htmlFor="sigla">
                      {t("Sigla")} <span className="create-level__required">*</span>
                    </label>
                    <input
                      id="sigla"
                      value={formData.sigla}
                      placeholder={t("Sigla da esfera (ex: FED, EST)")}
                      className={`app-input create-level__input${errors.sigla ? " create-level__input--error" : ""}`}
                      onChange={(event) => {
                        formData.setSigla(event.target.value);
                        if (errors.sigla) {
                          setErrors((previous) => ({ ...previous, sigla: undefined }));
                        }
                      }}
                      required
                    />
                    {errors.sigla ? (
                      <p className="create-level__error">{t(errors.sigla)}</p>
                    ) : (
                      <p className="create-level__hint">
                        {t("A sigla deve conter apenas letras e números, sem espaços ou caracteres especiais.")}
                      </p>
                    )}
                  </div>

                  <div className="create-level__field">
                    <label className="create-level__label" htmlFor="parentSphere">
                      {t("Esfera pai")} <span className="create-level__required">*</span>
                    </label>
                    <div className="app-select-field">
                      <select
                        id="parentSphere"
                        value={formData.parentId ?? "0"}
                        className="app-input app-select create-level__select"
                        onChange={(event) => {
                          const value = event.target.value;
                          formData.setParentId(value);
                          const selectedSphere = formData.allSpheres.find((sphere) => sphere.id === value);
                          formData.setSelectedSphereName(value === "0" ? t("Nenhuma (esfera pai)") : selectedSphere?.name || "");
                        }}
                        disabled={formData.isEditing && formData.hasItems}
                      >
                        <option value="0">{t("Nenhuma (esfera pai)")}</option>
                        {formData.allSpheres
                          .filter((sphere) => sphere.name !== formData.name)
                          .map((sphere) => (
                            <option key={sphere.id} value={sphere.id}>
                              {sphere.name}
                            </option>
                          ))}
                      </select>
                      <ChevronDown className="app-select-field__icon" />
                    </div>
                    {formData.isEditing && formData.hasItems && (
                      <p className="create-level__notice">{t("A esfera pai não pode ser alterada porque esta esfera já possui itens.")}</p>
                    )}
                  </div>
                </div>

                <div className="create-level__field">
                  <label className="create-level__label" htmlFor="description">
                    {t("Descrição")} <span className="create-level__required">*</span>
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    placeholder={t("Escreva uma descrição para a esfera")}
                    maxLength={200}
                    className={`app-textarea create-level__textarea${errors.description ? " create-level__textarea--error" : ""}`}
                    onChange={(event) => {
                      formData.setDescription(event.target.value);
                      if (errors.description) {
                        setErrors((previous) => ({ ...previous, description: undefined }));
                      }
                    }}
                    required
                  />
                  {errors.description ? (
                    <p className="create-level__error">{t(errors.description)}</p>
                  ) : (
                    <p className="create-level__counter">{formData.description.length}/200 {t("caracteres")}</p>
                  )}
                </div>

                <div className="create-level__field">
                  <label className="create-level__label">
                    {t("Tipo")} <span className="create-level__required">*</span>
                  </label>
                  <RadioGroup
                    className="app-option-select create-level__type-group"
                    value={formData.type}
                    onValueChange={(value: "BUSINESS" | "EXTERNAL") => {
                      formData.setType(value);
                      if (value !== "EXTERNAL") {
                        formData.setHasExistingApiKey(false);
                      }
                    }}
                    disabled={formData.isEditing}
                  >
                    <label
                      className={`app-option-select__item${formData.type === "BUSINESS" ? " app-option-select__item--active" : ""}${formData.isEditing ? " app-option-select__item--disabled" : ""}`}
                      htmlFor="BUSINESS"
                    >
                      <RadioGroupItem className="app-option-select__control" value="BUSINESS" id="BUSINESS" disabled={formData.isEditing} />
                      <span className="app-option-select__label">{t("Negocial")}</span>
                    </label>

                    <label
                      className={`app-option-select__item${formData.type === "EXTERNAL" ? " app-option-select__item--active" : ""}${formData.isEditing ? " app-option-select__item--disabled" : ""}`}
                      htmlFor="EXTERNAL"
                    >
                      <RadioGroupItem className="app-option-select__control" value="EXTERNAL" id="EXTERNAL" disabled={formData.isEditing} />
                      <span className="app-option-select__label">{t("Externa")}</span>
                    </label>
                  </RadioGroup>
                  {formData.isEditing && (
                    <p className="create-level__notice">{t("O tipo da esfera não pode ser alterado após a criação.")}</p>
                  )}
                </div>

                <div className="create-level__field">
                  <label className="create-level__label" htmlFor="color-picker-trigger">
                    {t("Cor")} <span className="create-level__optional">{t("(opcional)")}</span>
                  </label>
                  <ColorPicker
                    value={formData.color}
                    options={formData.levelColors}
                    onChange={formData.setColor}
                  />
                </div>

                {formData.type === "EXTERNAL" && (
                  <div className="create-level__external-grid">
                    <div className="create-level__field">
                      <label className="create-level__label" htmlFor="endpoint">
                        {t("Endpoint")} <span className="create-level__required">*</span>
                      </label>
                      <input
                        id="endpoint"
                        value={formData.endpoint}
                        placeholder="https://api.exemplo.com"
                        className={`app-input create-level__input${errors.endpoint ? " create-level__input--error" : ""}`}
                        onChange={(event) => {
                          formData.setEndpoint(event.target.value);
                          if (errors.endpoint) {
                            setErrors((previous) => ({ ...previous, endpoint: undefined }));
                          }
                        }}
                        required
                      />
                      {errors.endpoint && <p className="create-level__error">{t(errors.endpoint)}</p>}
                      <p className="create-level__hint">
                        <span className="create-level__endpoint-link">{t("Clique aqui")}</span>
                        {t("para mais informações sobre a criação do seu endpoint.")}
                      </p>
                    </div>

                    <div className="create-level__field">
                      <label className="create-level__label" htmlFor="apiKey">
                        API Key <span className="create-level__required">*</span>
                      </label>
                      <input
                        id="apiKey"
                        value={formData.apiKey}
                        placeholder={formData.isEditing ? t("Digite apenas para substituir a API Key existente") : "***************************"}
                        className={`app-input create-level__input${errors.apiKey ? " create-level__input--error" : ""}`}
                        onChange={(event) => {
                          formData.setApiKey(event.target.value);
                          if (errors.apiKey) {
                            setErrors((previous) => ({ ...previous, apiKey: undefined }));
                          }
                        }}
                        required={!formData.isEditing}
                      />
                      {errors.apiKey && <p className="create-level__error">{t(errors.apiKey)}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="create-level__actions">
              <Button type="submit" className="create-level__action-button">
                {formData.isEditing ? t("Atualizar esfera") : t("Criar esfera")}
              </Button>
            </div>
          </form>
        </div>
      </ScrollArea>
    </motion.div>
  );
}
