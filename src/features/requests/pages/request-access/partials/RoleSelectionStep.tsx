import { Popover, PopoverContent, PopoverTrigger } from "../../../../../common/external/ui/popover.tsx";
import { CustomInput } from "../../../../../common/external/ui/custom-input.tsx";
import { TruncatedDescription } from "../../../../../common/components/TruncateDescription.tsx";
import { Check, Plus, Users } from "lucide-react";
import { ScrollArea } from "../../../../../common/external/ui/scroll-area.tsx";
import { useEffect, useRef, useState } from "react";
import { RoleResponseInterface } from "../../../../role/common/types/role.model.ts";
import IconRenderer from "../../../../../common/components/icon/IconRenderer.tsx";
import DynamicSphereForm from "../../../../level/common/components/DynamicSphereForm.tsx";
import { BasicFormFieldInterface, RequestFormFieldType } from "../RequestAccess.tsx";

interface RoleStepProps {
  form: BasicFormFieldInterface;
  roles: RoleResponseInterface[];
  selectedRole: string | null;
  handlerSelectedRole: (role: RoleResponseInterface) => void;
  handlerSelectedSphere: (codeItem: string, externalCode?: string) => void;
  handlerClearSphereHierarchyError: () => void;
  isLargeScreen: boolean;
  isFormSubmitted?: boolean;
  selectedClientId?: string;
}

export const RoleStep = ({
  form,
  roles,
  handlerSelectedRole,
  handlerSelectedSphere,
  handlerClearSphereHierarchyError,
  isLargeScreen,
}: RoleStepProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showError, setShowError] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const hierarchyNotCompletedRef = useRef(false);
  const currentCodeItemRef = useRef<string>("");

  const roleField: RequestFormFieldType = "roleId";
  const codeItemField: RequestFormFieldType = "codeItem";
  const selectedRole = form[roleField].value;
  const selectedRoleObject = roles.find(role => role.id.toString() === selectedRole);
  const [codeItemHasError, setCodeItemHasError] = useState(false);

  useEffect(() => {
    setShowError(!!form[roleField].error);
  }, [form[roleField].error]);

  useEffect(() => {
    setCodeItemHasError(!!form[codeItemField]?.error);
  }, [form[codeItemField]?.error]);

  useEffect(() => {
    currentCodeItemRef.current = form[codeItemField]?.value || "";
  }, [form[codeItemField]?.value]);

  const handleHierarchyNotCompleted = () => {
    if(currentCodeItemRef.current && !hierarchyNotCompletedRef.current) {
      hierarchyNotCompletedRef.current = true;
      handlerSelectedSphere("");
    }
  };

  useEffect(() => {
    hierarchyNotCompletedRef.current = false;
  }, [selectedRole]);

  const handleHierarchyComplete = (codeItem: number, externalCode?: string) => {
    const codeItemStr = codeItem.toString();

    if(currentCodeItemRef.current !== codeItemStr) {
      hierarchyNotCompletedRef.current = false;
      handlerSelectedSphere(codeItemStr, externalCode);
    }
  };

  const handleRoleSelection = (role: RoleResponseInterface) => {
    setIsPopoverOpen(false);
    handlerSelectedRole(role);
  };

  return (
    <>
      <div>
        <h4>Escolha o tipo de acesso que você precisa:</h4>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <div>
              <div>
                {!selectedRole && !showError && <Plus />}
                {!selectedRole && showError && <Plus />}
                {selectedRole && <Check />}

                <div>
                  {selectedRole && (
                    <>
                      <IconRenderer
                        iconName={selectedRoleObject!.icon}
                        showPlaceholder={true}
                      />
                      <p>
                        {selectedRoleObject!.label}
                      </p>
                    </>
                  )}
                </div>

                {selectedRole &&
                  <TruncatedDescription
                    description={roles.find(role => role.id.toString() === selectedRole)?.description || "Sem descrição disponível"} />
                }
              </div>
              {showError && !selectedRole && (
                <p>Por favor, selecione um tipo de acesso</p>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent
            side={isLargeScreen ? "right" : "bottom"}
            align={isLargeScreen ? "start" : "end"}>
            <div>
              <CustomInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar..."
              />
              {searchTerm && (
                <p>
                  Você está pesquisando por: <strong>{searchTerm}</strong>
                </p>
              )}
            </div>

            <ScrollArea>
              <div>
                {roles && roles.length > 0 ? (
                  roles
                    .filter((role) =>
                      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
                    )
                    .map((role) => (
                      <div
                        key={role.id}
                        onClick={() => handleRoleSelection(role)}>

                        <div>
                          <IconRenderer
                            iconName={role.icon}
                            showPlaceholder={true}
                          />
                          <p>{role.label}</p>
                          {(selectedRole === role.id.toString()) && <Check />}
                        </div>

                        <TruncatedDescription description={role.description || "Sem descrição disponível"} />
                      </div>
                    ))
                ) : (
                  <div>
                    <div>
                      <Users size={20} />
                    </div>
                    <p>Nenhum papel encontrado para este sistema.</p>
                    <p>
                      A configuração ainda não foi realizada pelo administrador.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>

      {selectedRole && selectedRoleObject?.level && (
        <div>
          <h4>Preencha os detalhes da esfera:</h4>
          <DynamicSphereForm
            initialId={roles.find(role => role.id.toString() === selectedRole)!.level.id}
            onHierarchyNotCompleted={handleHierarchyNotCompleted}
            onHierarchyComplete={handleHierarchyComplete}
            hasError={codeItemHasError}
            onErrorClear={() => {
              handlerClearSphereHierarchyError();
            }}
          />
        </div>
      )}
    </>
  );
};
