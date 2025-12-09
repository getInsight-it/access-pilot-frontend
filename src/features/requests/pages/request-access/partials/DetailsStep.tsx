import { ClipboardList, FileText, User } from "lucide-react";
import { FileAttachment } from "./AttachmentStep.tsx";
import AttachmentConfigurationPresentation
  from "../../../../../common/components/AttachmentConfigurationPresentation.tsx";
import { RoleResponseInterface } from "../../../../role/common/types/role.model.ts";

interface DetailsStepProps {
  selectedClient: string | null;
  selectedRole: string | null;
  reason: string;
  roles: RoleResponseInterface[];
  attachments: FileAttachment[];
}

export const DetailsStep = ({ selectedClient, selectedRole, reason, roles, attachments }: DetailsStepProps) => {
  return (
    <div className="bg-background shadow-lg rounded-[var(--card-border-radius)] p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold">Resumo da solicitação</h3>
      <p className="mt-1 mb-3 sm:mb-4 text-sm sm:text-base text-muted-foreground">Revise suas escolhas antes de enviar:</p>
      <ul className="space-y-3 sm:space-y-4">
        <li className="flex gap-2 sm:gap-3">
          <ClipboardList className="text-blue-500 w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <strong className="text-sm sm:text-base">Sistema</strong>
            {selectedClient ? (
              <p className="text-sm sm:text-base break-words">
                {selectedClient}
              </p>
            ) : (
              <p className="text-xs sm:text-sm text-gray-500 italic">
                Sistema não selecionado.
              </p>
            )}
          </div>
        </li>
        <li className="flex gap-2 sm:gap-3">
          <User className="text-blue-500 w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <strong className="text-sm sm:text-base">Papel</strong>
            <p className="text-sm sm:text-base break-words">{roles.find(role => role.id.toString() === selectedRole)?.name}</p>
          </div>
        </li>
        <li className="flex gap-2 sm:gap-3">
          <FileText className="text-blue-500 w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <strong className="text-sm sm:text-base">Motivo</strong>
            <p className="text-sm sm:text-base break-words">{reason}</p>
          </div>
        </li>
        <div>
          <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Anexos:</h4>
          <AttachmentConfigurationPresentation attachments={attachments} direction="column" />
        </div>
      </ul>
    </div>
  );
};
