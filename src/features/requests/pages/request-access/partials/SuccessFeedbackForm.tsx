import { Button } from "../../../../../common/external/ui/button.tsx";
import { FlipWords } from "../../../../../common/external/ui/flip-words.tsx";
import { Link } from "react-router-dom";
import { FileAttachment } from "../components/request-justification-step/RequestJustificationStep.tsx";
import { PRIVATE_ROUTES } from "../../../../../common/constants/routes.ts";

interface SuccessFeedbackProps {
  words: string[];
  selectedClient: string | null;
  selectedRole: string | null;
  description: string;
  attachments: FileAttachment[];
  onRequestNew: () => void;
}

export const SuccessFeedback = ({
  words,
  selectedClient,
  selectedRole,
  description,
  attachments,
  onRequestNew
}: SuccessFeedbackProps) => {
  return (
    <>
      <div>
        <div>
          <div>
            Solicitação criada
            <FlipWords words={words} />
          </div>
        </div>
        <div></div>

        <div>
          <div>
            <p>Sistema:</p>
            <p>Papel solicitado:</p>
            <p>Motivo:</p>
            {attachments.length > 0 && <p>Anexos:</p>}
          </div>
          <div>
            <p>{selectedClient}</p>
            <p>{selectedRole}</p>
            <p>{description}</p>
            <ul>
              {attachments.map((file, index) => (
                <li key={index}>{file.fileName}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Link
        to={PRIVATE_ROUTES.MY_ACCESS_REQUESTS}>
        Listar solicitações
      </Link>
      <Button onClick={onRequestNew}>
        Solicitar novo acesso
      </Button>
    </>
  );
};
