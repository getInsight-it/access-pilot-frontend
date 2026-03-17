import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { HeaderContainer } from "@common/components/heading/heading.tsx";
import { IconPicker } from "@common/components/icon/IconPicker.tsx";
import { ScrollArea } from "@common/external/ui/scroll-area.tsx";
import { Button } from "@common/external/ui/button.tsx";
import { SectionLoader } from "@common/components/loading/section-loader/SectionLoader.tsx";
import { PRIVATE_ROUTES } from "@common/constants/routes.ts";
import useAuthStore, { AuthState } from "../../../../store/authStore.ts";
import { formSchema, RoleFormData, useNewRoleData, useRoleNavigation, useRoleSubmit } from "./useNewRole.ts";
import "./NewRole.scss";

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
    defaultValues,
    mode: "onChange"
  });

  const { onSubmit } = useRoleSubmit(client, initialData, isEditing, setLoading);
  const { navigateToSystemDetails } = useRoleNavigation(clientId);

  const pageTitle = isEditing ? "Editar papel" : "Novo papel";
  const pageDescription = isEditing
    ? "Atualize os dados do papel e salve as alterações."
    : "Preencha os dados para criar um novo papel para o sistema selecionado.";

  const rolesRoute = clientId
    ? PRIVATE_ROUTES.ROLES.replace(":clientId", clientId)
    : PRIVATE_ROUTES.SYSTEMS;

  const descriptionValue = methods.watch("description", "");

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

    void initializeData();
  }, [isAuthenticated, loadData, methods, setDataLoading]);

  if (dataLoading || loadingLevels) {
    return (
      <div className="new-role__loader">
        <SectionLoader />
      </div>
    );
  }

  return (
    <motion.div
      className="new-role"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3, ease: "easeOut" } }}
    >
      <HeaderContainer className="new-role__header-container">
        <div className="new-role__header">
          <div className="new-role__header-main">
            <button
              type="button"
              className="new-role__back-button"
              onClick={() => navigate(rolesRoute)}
            >
              <ArrowLeft size={18} />
            </button>

            <div className="new-role__heading-content">
              <div className="new-role__title-row">
                <h2 className="new-role__title">{pageTitle}</h2>
              </div>
              <p className="new-role__description">{pageDescription}</p>
              <p className="new-role__context">
                Sistema:
                <button
                  type="button"
                  className="new-role__system-link"
                  onClick={navigateToSystemDetails}
                >
                  {client?.name || "-"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </HeaderContainer>

      <ScrollArea className="new-role__scroll-area" viewportClassName="new-role__scroll-viewport">
        <div className="new-role__content-wrapper">
          <form className="new-role__form" onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="new-role__card">
              <div className="new-role__card-content">
                <div className="new-role__row">
                  <div className="new-role__field">
                    <label className="new-role__label" htmlFor="name">
                      Nome <span className="new-role__required">*</span>
                    </label>
                    <Controller
                      name="name"
                      control={methods.control}
                      render={({ field }) => (
                        <input
                          id="name"
                          placeholder="Nome do papel"
                          disabled={loading}
                          className={`app-input new-role__input${methods.formState.errors.name ? " new-role__input--error" : ""}`}
                          value={(field.value || "").toUpperCase()}
                          onChange={(event) => {
                            const uppercaseName = event.target.value.toUpperCase();
                            field.onChange(uppercaseName);
                          }}
                        />
                      )}
                    />
                    {methods.formState.errors.name && (
                      <p className="new-role__error">{methods.formState.errors.name.message?.toString()}</p>
                    )}
                  </div>

                  <div className="new-role__field">
                    <label className="new-role__label" htmlFor="label">
                      Label <span className="new-role__required">*</span>
                    </label>
                    <input
                      id="label"
                      placeholder="Label do papel"
                      disabled={loading}
                      className={`app-input new-role__input${methods.formState.errors.label ? " new-role__input--error" : ""}`}
                      {...methods.register("label")}
                    />
                    {methods.formState.errors.label && (
                      <p className="new-role__error">{methods.formState.errors.label.message?.toString()}</p>
                    )}
                  </div>

                  <div className="new-role__field">
                    <label className="new-role__label" htmlFor="levelId">
                      Esfera
                    </label>
                    <div className="app-select-field">
                      <select
                        id="levelId"
                        disabled={loading}
                        className={`app-input app-select new-role__select${methods.formState.errors.levelId ? " new-role__select--error" : ""}`}
                        {...methods.register("levelId")}
                      >
                        <option value="">Nenhuma esfera</option>
                        {levels.map((level) => (
                          <option key={level.id} value={level.id.toString()}>
                            {`${level.name} (${level.type})`}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="app-select-field__icon" />
                    </div>
                    {methods.formState.errors.levelId && (
                      <p className="new-role__error">{methods.formState.errors.levelId.message?.toString()}</p>
                    )}
                  </div>
                </div>

                <div className="new-role__field">
                  <label className="new-role__label" htmlFor="description">
                    Descrição <span className="new-role__required">*</span>
                  </label>
                  <textarea
                    id="description"
                    placeholder="Descrição do papel"
                    disabled={loading}
                    maxLength={200}
                    className={`app-textarea new-role__textarea${methods.formState.errors.description ? " new-role__textarea--error" : ""}`}
                    {...methods.register("description")}
                  />
                  {methods.formState.errors.description ? (
                    <p className="new-role__error">{methods.formState.errors.description.message?.toString()}</p>
                  ) : (
                    <p className="new-role__counter">{descriptionValue.length}/200 caracteres</p>
                  )}
                </div>

                <div className="new-role__field new-role__field--icon">
                  <label className="new-role__label" htmlFor="icon-picker-trigger">
                    Ícone <span className="new-role__optional">(opcional)</span>
                  </label>
                  <Controller
                    name="icon"
                    control={methods.control}
                    render={({ field }) => (
                      <IconPicker
                        value={field.value}
                        onChange={field.onChange}
                        disabled={loading}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="new-role__actions">
              <Button type="submit" className="new-role__action-button" disabled={loading}>
                {loading ? (isEditing ? "Atualizando..." : "Criando...") : (isEditing ? "Atualizar papel" : "Adicionar papel")}
              </Button>
            </div>
          </form>
        </div>
      </ScrollArea>
    </motion.div>
  );
}
