import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronDown, Lock, Users } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { HeaderContainer } from "@common/components/heading/heading.tsx";
import { IconPicker } from "@common/components/icon/IconPicker.tsx";
import { Toggle } from "@common/components/toggle/Toggle.tsx";
import { ScrollArea } from "@common/external/ui/scroll-area.tsx";
import { Button } from "@common/external/ui/button.tsx";
import { SectionLoader } from "@common/components/loading/section-loader/SectionLoader.tsx";
import { PRIVATE_ROUTES } from "@common/constants/routes.ts";
import { useI18n } from "@common/context/i18n/I18nContext.tsx";
import useAuthStore, { AuthState } from "../../../../store/authStore.ts";
import { formSchema, RoleFormData, useNewRoleData, useRoleNavigation, useRoleSubmit } from "./useNewRole.ts";
import "./NewRole.scss";

const defaultValues: RoleFormData = {
  name: "",
  description: "",
  label: "",
  levelId: "",
  icon: "",
  autoApprovalEnabled: false,
  lateralApprovalEnabled: false,
  lateralTargets: []
};

export default function NewRole() {
  const { t } = useI18n();
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
    roleDetails,
    clientRoles,
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
  const { navigateToSystemDetails, navigateToRoleHierarchy } = useRoleNavigation(clientId);

  const pageTitle = isEditing ? t("Editar papel") : t("Novo papel");
  const pageDescription = isEditing
    ? t("Atualize os dados do papel e salve as alterações.")
    : t("Preencha os dados para criar um novo papel para o sistema selecionado.");

  const rolesRoute = clientId
    ? PRIVATE_ROUTES.ROLES.replace(":clientId", clientId)
    : PRIVATE_ROUTES.SYSTEMS;

  const descriptionValue = methods.watch("description", "");
  const autoApprovalEnabledValue = methods.watch("autoApprovalEnabled", false);
  const lateralApprovalEnabledValue = methods.watch("lateralApprovalEnabled", false);
  const lateralTargets = methods.watch("lateralTargets", []);
  const parentRoleLabel = roleDetails?.roleParent?.label || roleDetails?.roleParent?.name || "";
  const hasParentApproval = Boolean(parentRoleLabel);
  const parentRoleId = roleDetails?.roleParent?.id;
  const currentRoleLevelId = roleDetails?.level?.id ?? null;
  const siblingRoles = parentRoleId
    ? clientRoles.filter((role) => {
      const siblingLevelId = role.level?.id ?? null;
      return role.id !== roleDetails?.id
        && role.roleParent?.id === parentRoleId
        && siblingLevelId === currentRoleLevelId;
    })
    : [];

  const getLateralTarget = (roleId: number) =>
    lateralTargets.find((target) => Number(target.roleId) === Number(roleId));

  const handleToggleLateralTarget = (roleId: number, enabled: boolean) => {
    const currentTargets = methods.getValues("lateralTargets") || [];
    if (enabled) {
      if (currentTargets.some((target) => Number(target.roleId) === Number(roleId))) {
        return;
      }
      methods.setValue("lateralTargets", [
        ...currentTargets,
        { roleId, canApprove: true, canReject: true, canRevoke: false }
      ], { shouldDirty: true, shouldTouch: true });
      return;
    }

    methods.setValue(
      "lateralTargets",
      currentTargets.filter((target) => Number(target.roleId) !== Number(roleId)),
      { shouldDirty: true, shouldTouch: true }
    );
  };

  const handleToggleLateralPermission = (
    roleId: number,
    permission: "canApprove" | "canReject" | "canRevoke",
    enabled: boolean
  ) => {
    const currentTargets = methods.getValues("lateralTargets") || [];
    const targetIndex = currentTargets.findIndex((target) => Number(target.roleId) === Number(roleId));

    if (targetIndex < 0) {
      if (!enabled) {
        return;
      }
      methods.setValue("lateralTargets", [
        ...currentTargets,
        {
          roleId,
          canApprove: permission === "canApprove",
          canReject: permission === "canReject",
          canRevoke: permission === "canRevoke"
        }
      ], { shouldDirty: true, shouldTouch: true });
      return;
    }

    const updatedTargets = currentTargets.map((target, index) => (
      index === targetIndex ? { ...target, [permission]: enabled } : target
    ));
    methods.setValue("lateralTargets", updatedTargets, { shouldDirty: true, shouldTouch: true });
  };

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

  useEffect(() => {
    if (!lateralTargets?.length) {
      return;
    }
    const allowedRoleIds = new Set(siblingRoles.map((role) => Number(role.id)));
    const validTargets = lateralTargets.filter((target) => allowedRoleIds.has(Number(target.roleId)));
    if (validTargets.length !== lateralTargets.length) {
      methods.setValue("lateralTargets", validTargets, { shouldDirty: true, shouldTouch: true });
    }
  }, [lateralTargets, siblingRoles, methods]);

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
                {t("Sistema")}:
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
                      {t("Nome")} <span className="new-role__required">*</span>
                    </label>
                    <Controller
                      name="name"
                      control={methods.control}
                      render={({ field }) => (
                        <input
                          id="name"
                          placeholder={t("Nome do papel")}
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
                      <p className="new-role__error">{t(methods.formState.errors.name.message?.toString() || "")}</p>
                    )}
                  </div>

                  <div className="new-role__field">
                    <label className="new-role__label" htmlFor="label">
                      {t("Label")} <span className="new-role__required">*</span>
                    </label>
                    <input
                      id="label"
                      placeholder={t("Label do papel")}
                      disabled={loading}
                      className={`app-input new-role__input${methods.formState.errors.label ? " new-role__input--error" : ""}`}
                      {...methods.register("label")}
                    />
                    {methods.formState.errors.label && (
                      <p className="new-role__error">{t(methods.formState.errors.label.message?.toString() || "")}</p>
                    )}
                  </div>

                  <div className="new-role__field">
                    <label className="new-role__label" htmlFor="levelId">
                      {t("Esfera")}
                    </label>
                    <div className="app-select-field">
                      <select
                        id="levelId"
                        disabled={loading}
                        className={`app-input app-select new-role__select${methods.formState.errors.levelId ? " new-role__select--error" : ""}`}
                        {...methods.register("levelId")}
                      >
                        <option value="">{t("Nenhuma esfera")}</option>
                        {levels.map((level) => (
                          <option key={level.id} value={level.id.toString()}>
                            {`${level.name} (${level.type})`}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="app-select-field__icon" />
                    </div>
                    {methods.formState.errors.levelId && (
                      <p className="new-role__error">{t(methods.formState.errors.levelId.message?.toString() || "")}</p>
                    )}
                  </div>
                </div>

                <div className="new-role__field">
                  <label className="new-role__label" htmlFor="description">
                    {t("Descrição")} <span className="new-role__required">*</span>
                  </label>
                  <textarea
                    id="description"
                    placeholder={t("Descrição do papel")}
                    disabled={loading}
                    maxLength={200}
                    className={`app-textarea new-role__textarea${methods.formState.errors.description ? " new-role__textarea--error" : ""}`}
                    {...methods.register("description")}
                  />
                  {methods.formState.errors.description ? (
                    <p className="new-role__error">{t(methods.formState.errors.description.message?.toString() || "")}</p>
                  ) : (
                    <p className="new-role__counter">{descriptionValue.length}/200 {t("caracteres")}</p>
                  )}
                </div>

                <div className="new-role__field new-role__field--icon">
                  <label className="new-role__label" htmlFor="icon-picker-trigger">
                    {t("Ícone")} <span className="new-role__optional">{t("(opcional)")}</span>
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

                <div className="new-role__policy-section">
                  <h3 className="new-role__policy-title">Políticas de aprovação</h3>
                  <p className="new-role__policy-description">
                    Configure regras de aprovação para este papel.
                  </p>

                  <div className="new-role__policy-grid">
                    <div className="new-role__policy-card new-role__policy-card--readonly">
                      <div className="new-role__policy-card-header">
                        <span className="new-role__policy-card-title">
                          <Lock size={16} />
                          Aprovação por hierarquia
                        </span>
                      </div>
                      <span className="new-role__policy-card-status">
                        Aprovador padrão
                      </span>
                      <span className="new-role__policy-card-status new-role__policy-card-status--strong">
                        {hasParentApproval
                          ? parentRoleLabel
                          : "Fallback administrativo"}
                      </span>
                      <span className="new-role__toggle-description">
                        A hierarquia de papéis define quem aprova quando a autoaprovação estiver desativada.
                      </span>
                      <Button
                        type="button"
                        variant="white"
                        className="new-role__policy-card-action"
                        onClick={navigateToRoleHierarchy}
                      >
                        Gerenciar hierarquia
                      </Button>
                    </div>

                    <Controller
                      name="lateralApprovalEnabled"
                      control={methods.control}
                      render={({ field }) => (
                        <div className="new-role__policy-card new-role__policy-card--lateral">
                          <div className="new-role__policy-card-header">
                            <div className="new-role__policy-card-header-text">
                              <h4 className="new-role__policy-card-heading">
                                <Users size={14} />
                                Aprovação lateral
                                <span className="new-role__policy-card-heading-status">
                                  {lateralApprovalEnabledValue ? "Ativada" : "Desativada"}
                                </span>
                              </h4>
                              <span className="new-role__policy-card-caption">
                                Papéis irmãos com permissão complementar de decisão
                              </span>
                            </div>
                            <div className="new-role__toggle-control">
                              <Toggle
                                checked={Boolean(field.value)}
                                onCheckedChange={field.onChange}
                                disabled={loading}
                                aria-label="Ativar aprovação lateral para este papel"
                              />
                            </div>
                          </div>
                          <span className="new-role__toggle-description">
                            Política complementar. Não sobrescreve a aprovação por hierarquia.
                          </span>

                          {lateralApprovalEnabledValue && (
                            <div className="new-role__lateral-config">
                              {!hasParentApproval && (
                                <span className="new-role__toggle-description">
                                  Configure a hierarquia deste papel para definir as irmãs elegíveis para aprovação lateral.
                                </span>
                              )}

                              {hasParentApproval && siblingRoles.length === 0 && (
                                <span className="new-role__toggle-description">
                                  Não há papéis irmãos da mesma esfera disponíveis para este papel.
                                </span>
                              )}

                              {hasParentApproval && siblingRoles.length > 0 && (
                                <div className="app-table app-table--no-filter app-table--no-footer new-role__lateral-table">
                                  <div className="app-table__header">
                                    <div className="app-table__row">
                                      <div className="app-table__cell app-table__cell--content new-role__lateral-table-cell new-role__lateral-table-cell--role">
                                        <span>Papel</span>
                                      </div>
                                      <div className="app-table__cell app-table__cell--content new-role__lateral-table-cell new-role__lateral-table-cell--action">
                                        <span>Aprovar</span>
                                      </div>
                                      <div className="app-table__cell app-table__cell--content new-role__lateral-table-cell new-role__lateral-table-cell--action">
                                        <span>Rejeitar</span>
                                      </div>
                                      <div className="app-table__cell app-table__cell--content new-role__lateral-table-cell new-role__lateral-table-cell--action">
                                        <span>Revogar</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="app-table__body">
                                    {siblingRoles.map((siblingRole) => {
                                      const target = getLateralTarget(siblingRole.id);
                                      const isSelected = Boolean(target);
                                      return (
                                        <div key={siblingRole.id} className="app-table__row new-role__lateral-table-row">
                                          <div className="app-table__cell app-table__cell--content new-role__lateral-table-cell new-role__lateral-table-cell--role">
                                            <div className="new-role__lateral-role-cell">
                                              <Toggle
                                                checked={isSelected}
                                                onCheckedChange={(checked) => handleToggleLateralTarget(siblingRole.id, checked)}
                                                disabled={loading}
                                                aria-label={`Habilitar ${siblingRole.label || siblingRole.name} como aprovador lateral`}
                                              />
                                              <div className="new-role__lateral-role-text">
                                                <span className="new-role__lateral-item-title">
                                                  {siblingRole.label || siblingRole.name}
                                                </span>
                                                <span className="new-role__lateral-item-code">
                                                  {siblingRole.name}
                                                </span>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="app-table__cell app-table__cell--content new-role__lateral-table-cell new-role__lateral-table-cell--action">
                                            <div className="new-role__lateral-action-cell">
                                              <input
                                                type="checkbox"
                                                className="new-role__lateral-checkbox"
                                                checked={Boolean(target?.canApprove)}
                                                onChange={(event) => handleToggleLateralPermission(siblingRole.id, "canApprove", event.target.checked)}
                                                disabled={loading || !isSelected}
                                                aria-label={`Permitir aprovar para ${siblingRole.label || siblingRole.name}`}
                                              />
                                            </div>
                                          </div>
                                          <div className="app-table__cell app-table__cell--content new-role__lateral-table-cell new-role__lateral-table-cell--action">
                                            <div className="new-role__lateral-action-cell">
                                              <input
                                                type="checkbox"
                                                className="new-role__lateral-checkbox"
                                                checked={Boolean(target?.canReject)}
                                                onChange={(event) => handleToggleLateralPermission(siblingRole.id, "canReject", event.target.checked)}
                                                disabled={loading || !isSelected}
                                                aria-label={`Permitir rejeitar para ${siblingRole.label || siblingRole.name}`}
                                              />
                                            </div>
                                          </div>
                                          <div className="app-table__cell app-table__cell--content new-role__lateral-table-cell new-role__lateral-table-cell--action">
                                            <div className="new-role__lateral-action-cell">
                                              <input
                                                type="checkbox"
                                                className="new-role__lateral-checkbox"
                                                checked={Boolean(target?.canRevoke)}
                                                onChange={(event) => handleToggleLateralPermission(siblingRole.id, "canRevoke", event.target.checked)}
                                                disabled={loading || !isSelected}
                                                aria-label={`Permitir revogar para ${siblingRole.label || siblingRole.name}`}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    />

                    <Controller
                      name="autoApprovalEnabled"
                      control={methods.control}
                      render={({ field }) => (
                        <div className="new-role__policy-card">
                          <div className="new-role__policy-card-header">
                            <div className="new-role__policy-card-header-text">
                              <h4 className="new-role__policy-card-heading">
                                Autoaprovação
                                <span className="new-role__policy-card-heading-status">
                                  {autoApprovalEnabledValue ? "Ativada" : "Desativada"}
                                </span>
                              </h4>
                            </div>
                            <div className="new-role__toggle-control">
                              <Toggle
                                checked={Boolean(field.value)}
                                onCheckedChange={field.onChange}
                                disabled={loading}
                                aria-label="Ativar autoaprovação para este papel"
                              />
                            </div>
                          </div>
                          <span className="new-role__toggle-description">
                            Quando ativado, solicitações deste papel entram já aprovadas e essa política
                            tem prioridade sobre a aprovação por hierarquia.
                          </span>
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="new-role__actions">
              <Button type="submit" className="new-role__action-button" disabled={loading}>
                {loading ? (isEditing ? t("Atualizando...") : t("Criando...")) : (isEditing ? t("Atualizar papel") : t("Adicionar papel"))}
              </Button>
            </div>
          </form>
        </div>
      </ScrollArea>
    </motion.div>
  );
}
