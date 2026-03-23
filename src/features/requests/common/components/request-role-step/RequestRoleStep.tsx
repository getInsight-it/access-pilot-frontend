import React, { useEffect, useMemo, useRef, useState } from "react";
import { Check, Search } from "lucide-react";
import IconRenderer from "@common/components/icon/IconRenderer.tsx";
import DynamicSphereForm from "@features/level/common/components/DynamicSphereForm.tsx";
import { RoleResponseInterface } from "@features/role/common/types/role.model.ts";
import "./request-role-step.scss";

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
  lockedSphereLabel
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const hierarchyNotCompletedRef = useRef(false);
  const currentCodeItemRef = useRef<string>(currentCodeItem);
  const selectedRoleObject = roles.find((role) => role.id.toString() === selectedRoleId);
  const hasHierarchyRequirement = Boolean(selectedRoleObject?.level?.id);
  const hasLockedSphereData = Boolean(lockedSphereLabel || currentCodeItem);
  const shouldShowHierarchySection = Boolean(selectedRoleObject) && (
    readOnly
      ? hasHierarchyRequirement || hasLockedSphereData
      : hasHierarchyRequirement
  );

  useEffect(() => {
    currentCodeItemRef.current = currentCodeItem || "";
  }, [currentCodeItem]);

  useEffect(() => {
    hierarchyNotCompletedRef.current = false;
  }, [selectedRoleId]);

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

  return (
    <div className="request-role-step">
      {!readOnly && (
        <div className="request-role-step__filter">
          <div className="app-input-group app-input-group--icon-left">
            <Search className="app-input-group__icon" />
            <input
              className="app-input request-role-step__search-input"
              placeholder="Filtrar papéis"
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

            return (
              <button
                key={role.id}
                type="button"
                className={`request-role-step__card${isActive ? " request-role-step__card--active" : ""}${readOnly ? " request-role-step__card--locked" : ""}`}
                onClick={() => {
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
                    <p className="request-role-step__description">{role.description || "Sem descrição disponível."}</p>
                  </div>
                </div>

                {isActive && (
                  <span className="request-role-step__selected-indicator">
                    <Check className="request-role-step__selected-icon" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="request-role-step__empty-state">Nenhum papel encontrado para este sistema.</p>
      )}

      {shouldShowHierarchySection && selectedRoleObject && (
        <div className="request-role-step__hierarchy-section">
          <h4 className="request-role-step__hierarchy-title">Preencha os detalhes da esfera:</h4>
          {readOnly ? (
            <div className="request-role-step__locked-sphere">
              <p className="request-role-step__hierarchy-info">
                {lockedSphereLabel || currentCodeItem || "Esfera previamente definida para este convite."}
              </p>
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

      {!selectedRoleObject && readOnly && (lockedSphereLabel || currentCodeItem) && (
        <div className="request-role-step__hierarchy-section">
          <h4 className="request-role-step__hierarchy-title">Detalhes da esfera:</h4>
          <div className="request-role-step__locked-sphere">
            <p className="request-role-step__hierarchy-info">
              {lockedSphereLabel || currentCodeItem}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
