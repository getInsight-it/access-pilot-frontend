import { Popover, PopoverContent, PopoverTrigger } from "../../../../../common/external/ui/popover.tsx";
import { CustomInput } from "../../../../../common/external/ui/custom-input.tsx";
import { TruncatedDescription } from "../../../../../common/components/TruncateDescription.tsx";
import { Check, Plus, Users } from "lucide-react";
import { cn } from "../../../../../config/lib/utils.ts";
import { ScrollArea } from "../../../../../common/external/ui/scroll-area.tsx";
import { useEffect, useRef, useState } from "react";
import { RoleResponseInterface } from "../../../../role/common/types/role.model.ts";
import IconRenderer from "../../../../../common/components/icon/IconRenderer.tsx";
import DynamicSphereForm from "../../../../level/common/components/DynamicSphereForm.tsx";
import { BasicFormFieldInterface, RequestFormFieldType } from "../RequestAccess.tsx";
import { useNavigate } from "react-router-dom";
import { PRIVATE_ROUTES } from "../../../../../common/constants/routes.ts";

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
  selectedClientId
}: RoleStepProps) => {
  const navigate = useNavigate();
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
      <div className="space-y-1">
        <h4 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 sm:mb-3 lg:mb-4">Escolha o tipo de acesso que você precisa:</h4>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <div className={`max-w-full sm:max-w-md lg:max-w-96 w-full cursor-pointer ${selectedRole ? " text-primary " : ""}`}>
              <div
                className={cn(
                  "border border-dashed p-3 sm:p-4 lg:p-5 grid items-center min-h-[80px] sm:min-h-[100px] lg:min-h-[120px] h-auto transition-all rounded-[var(--card-border-radius)] relative shadow-md",
                  selectedRole && "border-2 border-primary border-double rounded-[var(--card-border-radius)]",
                  showError && "border border-dashed border-red-500 rounded-[var(--card-border-radius)]"
                )}>
                {!selectedRole && !showError && <Plus className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 mt-1 sm:mt-2 mx-auto text-gray-400" />}
                {!selectedRole && showError && <Plus className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 mt-1 sm:mt-2 mx-auto text-red-500" />}
                {selectedRole && <Check className="absolute top-2 right-2 sm:top-3 sm:right-3 lg:top-4 lg:right-4 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />}

                <div className="flex flex-row items-center">
                  {selectedRole && (
                    <>
                      <IconRenderer
                        iconName={selectedRoleObject!.icon}
                        className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3 lg:mr-4 flex-shrink-0"
                        showPlaceholder={true}
                      />
                      <p className="font-bold text-sm sm:text-base lg:text-lg break-words">
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
                <p className="text-red-500 text-xs sm:text-sm mt-2 sm:mt-4">Por favor, selecione um tipo de acesso</p>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent
            side={isLargeScreen ? "right" : "bottom"}
            align={isLargeScreen ? "start" : "end"}
            className={cn(
              "w-[calc(100vw-2rem)] sm:w-[26em] p-3 sm:p-6",
              isLargeScreen && "ml-[20px]",
              !isLargeScreen && "mb-10"
            )}>
            <div className="relative">
              <CustomInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar..."
                className="pl-10 pr-10 text-sm sm:text-base h-10"
              />
              {searchTerm && (
                <p className="mt-3 sm:mt-4 text-xs sm:text-sm">
                  Você está pesquisando por: <strong>{searchTerm}</strong>
                </p>
              )}
            </div>

            <ScrollArea className="h-[250px] sm:h-[340px] mt-3 sm:mt-4 has-[>[data-state=visible]]:pr-4">
              <div className="space-y-2 grid grid-cols-1 gap-2">
                {roles && roles.length > 0 ? (
                  roles
                    .filter((role) =>
                      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
                    )
                    .map((role) => (
                      <div
                        key={role.id}
                        className={cn(
                          "border p-3 sm:p-5 grid items-center min-h-[80px] sm:min-h-[106px] h-auto cursor-pointer transition-all rounded-[var(--card-border-radius)] shadow-md",
                          selectedRole === role.id.toString() && "border-2 border-primary border-double rounded-[var(--card-border-radius)]"
                        )}
                        onClick={() => handleRoleSelection(role)}>

                        <div className="flex flex-row items-center">
                          <IconRenderer
                            iconName={role.icon}
                            className="w-4 h-4 sm:w-6 sm:h-6 mr-2 sm:mr-4 flex-shrink-0"
                            showPlaceholder={true}
                          />
                          <p className="font-bold text-sm sm:text-lg break-words flex-1 min-w-0">{role.label}</p>
                          {(selectedRole === role.id.toString()) && <Check className="ml-2 flex-shrink-0 w-4 h-4 sm:w-6 sm:h-6" />}
                        </div>

                        <TruncatedDescription description={role.description || "Sem descrição disponível"} />
                      </div>
                    ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2 sm:mb-3">
                      <Users size={20} className="text-gray-400 sm:w-6 sm:h-6" />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Nenhum papel encontrado para este sistema.</p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      <span
                        onClick={() => {
                          if (selectedClientId) {
                            navigate(PRIVATE_ROUTES.ROLES.replace(":clientId", selectedClientId));
                          }
                        }}
                        className="underline text-primary-600 cursor-pointer">
                        Clique aqui
                      </span> para gerenciar os papéis deste sistema.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>

      {selectedRole && selectedRoleObject?.level && (
        <div className="mt-3 sm:mt-4 lg:mt-6">
          <h4 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 sm:mb-3 lg:mb-4">Preencha os detalhes da esfera:</h4>
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
