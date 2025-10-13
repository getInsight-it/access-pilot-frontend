import { Popover, PopoverContent, PopoverTrigger } from "../../../../../common/external/ui/popover.tsx";
import { CustomInput } from "../../../../../common/external/ui/custom-input.tsx";
import { TruncatedDescription } from "../../../../../common/components/TruncateDescription.tsx";
import { Check, Plus } from "lucide-react";
import { cn } from "../../../../../config/lib/utils.ts";
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
  handlerSelectedSphere: (codeItem: string) => void;
  handlerClearSphereHierarchyError: () => void;
  isLargeScreen: boolean;
  isFormSubmitted?: boolean;
}

export const RoleStep = ({
  form,
  roles,
  handlerSelectedRole,
  handlerSelectedSphere,
  handlerClearSphereHierarchyError,
  isLargeScreen
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

  const handleHierarchyComplete = (codeItem: number) => {
    const codeItemStr = codeItem.toString();

    if(currentCodeItemRef.current !== codeItemStr) {
      hierarchyNotCompletedRef.current = false;
      handlerSelectedSphere(codeItemStr);
    }
  };

  const handleRoleSelection = (role: RoleResponseInterface) => {
    setIsPopoverOpen(false);
    handlerSelectedRole(role);
  };

  return (
    <>
      <div className="space-y-1">
        <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Escolha o tipo de acesso que você precisa:</h4>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <div className={`max-w-full sm:max-w-md lg:max-w-96 w-full cursor-pointer ${selectedRole ? " text-primary " : ""}`}>
              <div
                className={cn(
                  "border border-dashed p-4 sm:p-5 grid items-center min-h-[100px] sm:min-h-[120px] h-auto transition-all rounded-[var(--card-border-radius)] relative shadow-md",
                  selectedRole && "border-2 border-primary border-double rounded-[var(--card-border-radius)]",
                  showError && "border border-dashed border-red-500 rounded-[var(--card-border-radius)]"
                )}>
                {!selectedRole && !showError && <Plus className="w-7 h-7 sm:w-8 sm:h-8 mt-2 mx-auto text-gray-400" />}
                {!selectedRole && showError && <Plus className="w-7 h-7 sm:w-8 sm:h-8 mt-2 mx-auto text-red-500" />}
                {selectedRole && <Check className="absolute top-3 right-3 sm:top-4 sm:right-4 flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6" />}

                <div className="flex flex-row items-center">
                  {selectedRole && (
                    <>
                      <IconRenderer
                        iconName={selectedRoleObject!.icon}
                        className="w-5 h-5 sm:w-6 sm:h-6 mr-3 sm:mr-4 flex-shrink-0"
                        showPlaceholder={true}
                      />
                      <p className="font-bold text-base sm:text-lg break-words">
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
                <p className="text-red-500 text-sm mt-2 sm:mt-4">Por favor, selecione um tipo de acesso</p>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent
            side={isLargeScreen ? "right" : "bottom"}
            align={isLargeScreen ? "start" : "end"}
            className={cn(
              "w-[calc(100vw-2rem)] sm:w-[26em]",
              isLargeScreen && "ml-[20px]",
              !isLargeScreen && "mb-10"
            )}>
            <div className="relative">
              <CustomInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar..."
                className="pl-10 pr-10"
              />
              {searchTerm && (
                <p className="mt-4">
                  Você está pesquisando por: <strong>{searchTerm}</strong>
                </p>
              )}
            </div>

            <ScrollArea className="h-[300px] sm:h-[340px] mt-4 has-[>[data-state=visible]]:pr-4">
              <div className="space-y-2 grid grid-cols-1 gap-2">
                {roles && roles
                  .filter((role) =>
                    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map((role) => (
                    <div
                      key={role.id}
                      className={cn(
                        "border p-4 sm:p-5 grid items-center min-h-[90px] sm:min-h-[106px] h-auto cursor-pointer transition-all rounded-[var(--card-border-radius)] shadow-md",
                        selectedRole === role.id.toString() && "border-2 border-primary border-double rounded-[var(--card-border-radius)]"
                      )}
                      onClick={() => handleRoleSelection(role)}>

                      <div className="flex flex-row items-center">
                        <IconRenderer
                          iconName={role.icon}
                          className="w-5 h-5 sm:w-6 sm:h-6 mr-3 sm:mr-4 flex-shrink-0"
                          showPlaceholder={true}
                        />
                        <p className="font-bold text-base sm:text-lg break-words flex-1 min-w-0">{role.label}</p>
                        {(selectedRole === role.id.toString()) && <Check className="ml-2 flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6" />}
                      </div>

                      <TruncatedDescription description={role.description || "Sem descrição disponível"} />
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>

      {selectedRole && selectedRoleObject?.level && (
        <div className="mt-4 sm:mt-6">
          <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Preencha os detalhes da esfera:</h4>
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
