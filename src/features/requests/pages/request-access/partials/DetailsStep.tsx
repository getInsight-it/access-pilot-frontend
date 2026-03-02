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
    <div>
      <h3>Resumo da solicitação</h3>
      <p>Revise suas escolhas antes de enviar:</p>
      <ul>
        <li>
          <ClipboardList />
          <div>
            <strong>Sistema</strong>
            {selectedClient ? (
              <p>
                {selectedClient}
              </p>
            ) : (
              <p>
                Sistema não selecionado.
              </p>
            )}
          </div>
        </li>
        <li>
          <User />
          <div>
            <strong>Papel</strong>
            <p>{roles.find(role => role.id.toString() === selectedRole)?.name}</p>
          </div>
        </li>
        <li>
          <FileText />
          <div>
            <strong>Motivo</strong>
            <p>{reason}</p>
          </div>
        </li>
        <div>
          <h4>Anexos:</h4>
          <AttachmentConfigurationPresentation attachments={attachments} direction="column" />
        </div>
      </ul>
    </div>
  );
};
