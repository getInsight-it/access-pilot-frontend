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
    <div className="bg-background shadow-lg rounded-[var(--card-border-radius)] p-6">
      <h3 className="text-lg font-semibold">Resumo da solicitação</h3>
      <p className="mt-1 mb-4 text-gray-900">Revise suas escolhas antes de enviar:</p>
      <ul className="space-y-4">
        <li className="flex items-center gap-3">
          <ClipboardList className="text-blue-500 w-5 h-5 " />
          <div>
            <strong>Sistema</strong>
            {selectedClient ? (
              <p>
                {selectedClient}
              </p>
            ) : (
              <p className="text-sm text-gray-500 italic">
                Sistema não selecionado.
              </p>
            )}
          </div>
        </li>
        <li className="flex items-center gap-3">
          <User className="text-blue-500 w-5 h-5" />
          <div>
            <strong>Papel</strong>
            <p>{roles.find(role => role.id.toString() === selectedRole)!.name}</p>
          </div>
        </li>
        <li className="flex items-center gap-3">
          <FileText className="text-blue-500 w-5 h-5" />
          <div>
            <strong>Motivo</strong>
            <p>{reason}</p>
          </div>
        </li>
        <div>
          <h4 className="text-lg font-semibold mb-4">Anexos:</h4>
          <AttachmentConfigurationPresentation attachments={attachments} direction="column" />
        </div>
      </ul>
    </div>
  );
};
