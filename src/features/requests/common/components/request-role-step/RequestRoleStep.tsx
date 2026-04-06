import React, { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronRight, Search } from "lucide-react";
import IconRenderer from "@common/components/icon/IconRenderer.tsx";
import { useI18n } from "@common/context/i18n/I18nContext.tsx";
import DynamicSphereForm from "@features/level/common/components/DynamicSphereForm.tsx";
import { ItemHierarchyInterface } from "@features/level/common/types/item-hierarchy.model.ts";
import { RoleResponseInterface } from "@features/role/common/types/role.model.ts";
import "./request-role-step.scss";

const ROLE_PARENT_TOOLTIP_DELAY_MS = 1500;

interface RequestRoleStepProps {
  roles: RoleResponseInterface[];
  selectedRoleId: string | null;
  roleError?: string | null;
  currentCodeItem?: string;
  codeItemError?: boolean;
  onSelectRole: (role: RoleResponseInterface) => void | Promise<void>;
  onSelectSphere: (codeItem: string, externalCode?: string) => void;
  onClearSphereError: () => void;
  readOnly?: boolean;
  lockedSphereLabel?: string | null;
  lockedSphereHierarchy?: ItemHierarchyInterface[];
}

export const RequestRoleStep: React.FC<RequestRoleStepProps> = ({
  roles,
  selectedRoleId,
  roleError,
  currentCodeItem = "",
  codeItemError = false,
  onSelectRole,
  onSelectSphere,
  onClearSphereError,
  readOnly = false,
  lockedSphereLabel,
  lockedSphereHierarchy = []
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleTooltipRoleId, setVisibleTooltipRoleId] = useState<number | null>(null);
  const { t } = useI18n();
  const hierarchyNotCompletedRef = useRef(false);
  const currentCodeItemRef = useRef<string>(currentCodeItem);
  const hoverTimeoutRef = useRef<number | null>(null);
  const selectedRoleObject = roles.find((role) => role.id.toString() === selectedRoleId);
  const hasHierarchyRequirement = Boolean(selectedRoleObject?.level?.id);
  const hasLockedSphereData = Boolean(lockedSphereLabel || currentCodeItem);
  const hasLockedSphereHierarchy = lockedSphereHierarchy.length > 0;
  const lastLockedSphereItem = hasLockedSphereHierarchy
    ? lockedSphereHierarchy[lockedSphereHierarchy.length - 1]
    : null;
  const shouldShowHierarchySection = Boolean(selectedRoleObject) && (
    readOnly
      ? hasHierarchyRequirement || hasLockedSphereData || hasLockedSphereHierarchy
      : hasHierarchyRequirement
  );

  useEffect(() => {
    currentCodeItemRef.current = currentCodeItem || "";
  }, [currentCodeItem]);

  useEffect(() => {
    hierarchyNotCompletedRef.current = false;
  }, [selectedRoleId]);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current !== null) {
        window.clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const filteredRoles = useMemo(() => {
    if (readOnly) {
      return roles;
    }

    const normalizedSearch = searchTerm.toLowerCase();

    return roles.filter((role) => {
      const roleName = role.name.toLowerCase();
      const roleLabel = role.label.toLowerCase();
      const roleDescription = (role.description || "").toLowerCase();
      return (
        roleName.includes(normalizedSearch) ||
        roleLabel.includes(normalizedSearch) ||
        roleDescription.includes(normalizedSearch)
      );
    });
  }, [readOnly, roles, searchTerm]);

  const handleHierarchyNotCompleted = () => {
    if (readOnly) {
      return;
    }

    if(currentCodeItemRef.current && !hierarchyNotCompletedRef.current) {
      hierarchyNotCompletedRef.current = true;
      onSelectSphere("");
    }
  };

  const handleHierarchyComplete = (codeItem: number, externalCode?: string) => {
    if (readOnly) {
      return;
    }

    const codeItemAsString = codeItem.toString();

    if(currentCodeItemRef.current !== codeItemAsString) {
      hierarchyNotCompletedRef.current = false;
      onSelectSphere(codeItemAsString, externalCode);
    }
  };

  const handleRoleMouseEnter = (role: RoleResponseInterface) => {
    if (!role.roleParent) {
      return;
    }

    if (hoverTimeoutRef.current !== null) {
      window.clearTimeout(hoverTimeoutRef.current);
    }

    hoverTimeoutRef.current = window.setTimeout(() => {
      setVisibleTooltipRoleId(role.id);
    }, ROLE_PARENT_TOOLTIP_DELAY_MS);
  };

  const handleRoleMouseLeave = () => {
    if (hoverTimeoutRef.current !== null) {
      window.clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    setVisibleTooltipRoleId(null);
  };

  return (
    <div className="request-role-step">
      {!readOnly && (
        <div className="request-role-step__filter">
          <div className="app-input-group app-input-group--icon-left">
            <Search className="app-input-group__icon" />
            <input
              className="app-input request-role-step__search-input"
              placeholder={t("Filtrar papéis")}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </div>
      )}

      {roleError && (
        <p className="request-role-step__error">{roleError}</p>
      )}

      {filteredRoles.length > 0 ? (
        <div className="request-role-step__grid">
          {filteredRoles.map((role) => {
            const isActive = selectedRoleId === role.id.toString();
            const isTooltipVisible = visibleTooltipRoleId === role.id && Boolean(role.roleParent);

            return (
              <button
                key={role.id}
                type="button"
                className={`request-role-step__card${isActive ? " request-role-step__card--active" : ""}${readOnly ? " request-role-step__card--locked" : ""}`}
                onMouseEnter={() => handleRoleMouseEnter(role)}
                onMouseLeave={handleRoleMouseLeave}
                onClick={() => {
                  handleRoleMouseLeave();
                  void onSelectRole(role);
                }}
                disabled={readOnly}
              >
                <div className="request-role-step__card-main">
                  <div className="request-role-step__icon-box">
                    <IconRenderer iconName={role.icon} className="request-role-step__icon" showPlaceholder={true} />
                  </div>

                  <div className="request-role-step__card-text">
                    <p className="request-role-step__name">{role.label}</p>
                    <p className="request-role-step__description">{role.description || t("Sem descrição disponível.")}</p>
                  </div>
                </div>

                {isActive && (
                  <span className="request-role-step__selected-indicator">
                    <Check className="request-role-step__selected-icon" />
                  </span>
                )}

                {isTooltipVisible && role.roleParent && (
                  <span className="request-role-step__tooltip" role="note">
                    <div className="request-role-step__tooltip-row">
                      <span className="request-role-step__tooltip-title">{t("Papel pai: ")}</span>
                      <span className="request-role-step__tooltip-value">{role.roleParent.label}</span>
                    </div>
                    <div className="request-role-step__tooltip-row">
                      <span className="request-role-step__tooltip-title">{t("Descrição: ")}</span>
                      <span className="request-role-step__tooltip-value">
                        {role.roleParent.description || t("Sem descrição disponível.")}
                      </span>
                    </div>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="request-role-step__empty-state">{t("Nenhum papel encontrado para este sistema.")}</p>
      )}

      {shouldShowHierarchySection && selectedRoleObject && (
        <div className="request-role-step__hierarchy-section">
          <h4 className="request-role-step__hierarchy-title">{t("Preencha os detalhes da esfera:")}</h4>
          {readOnly ? (
            <div className="request-role-step__locked-sphere">
              <p className="request-role-step__hierarchy-info">
                {lastLockedSphereItem?.name || lockedSphereLabel || currentCodeItem || t("Esfera previamente definida para este convite.")}
              </p>
              {hasLockedSphereHierarchy && (
                <div className="request-role-step__locked-sphere-trail" aria-label={t("Hierarquia preenchida")}>
                  {lockedSphereHierarchy.map((item, index) => (
                    <div key={`${item.level?.id || item.id}-${item.id}-${index}`} className="request-role-step__locked-sphere-item">
                      <span className="request-role-step__locked-sphere-item-label">{item.name}</span>
                      {index < lockedSphereHierarchy.length - 1 && (
                        <ChevronRight className="request-role-step__locked-sphere-separator" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : hasHierarchyRequirement ? (
            <DynamicSphereForm
              initialId={selectedRoleObject.level.id}
              onHierarchyNotCompleted={handleHierarchyNotCompleted}
              onHierarchyComplete={handleHierarchyComplete}
              hasError={codeItemError}
              onErrorClear={onClearSphereError}
            />
          ) : null}
        </div>
      )}

      {!selectedRoleObject && readOnly && (lockedSphereLabel || currentCodeItem || hasLockedSphereHierarchy) && (
        <div className="request-role-step__hierarchy-section">
          <h4 className="request-role-step__hierarchy-title">{t("Detalhes da esfera:")}</h4>
          <div className="request-role-step__locked-sphere">
            <p className="request-role-step__hierarchy-info">
              {lastLockedSphereItem?.name || lockedSphereLabel || currentCodeItem}
            </p>
            {hasLockedSphereHierarchy && (
              <div className="request-role-step__locked-sphere-trail" aria-label={t("Hierarquia preenchida")}>
                {lockedSphereHierarchy.map((item, index) => (
                  <div key={`${item.level?.id || item.id}-${item.id}-${index}`} className="request-role-step__locked-sphere-item">
                    <span className="request-role-step__locked-sphere-item-label">{item.name}</span>
                    {index < lockedSphereHierarchy.length - 1 && (
                      <ChevronRight className="request-role-step__locked-sphere-separator" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
