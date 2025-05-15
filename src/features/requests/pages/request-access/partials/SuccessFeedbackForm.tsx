import { Button } from "../../../../../components/ui/button.tsx";
import { FlipWords } from "../../../../../components/ui/flip-words.tsx";
import { Link } from "react-router-dom";
import { FileAttachment } from "./AttachmentStep.tsx";

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
      <div className="md:grid grid-cols-1 lg:max-w-xl">
        <div className="bg-primary flex px-6 py-6">
          <div className="text-2xl font-normal text-primary-foreground">
            Solicitação criada
            <FlipWords words={words} />
          </div>
        </div>
        <div className="bg-green-500 p-1"></div>

        <div className="grid grid-cols-2 gap-5 mt-6 px-1">
          <div className="font-bold space-y-3">
            <p>Sistema:</p>
            <p>Papel solicitado:</p>
            <p>Motivo:</p>
            {attachments.length > 0 && <p>Anexos:</p>}
          </div>
          <div className="space-y-3">
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
        className="bg-[var(--dashboard-nav-bg)] text-primary rounded-full text-sm font-medium transition-colors hover:bg-[var(--button-hover)] hover:text-[var(--button-hover-text)] h-10 px-4 py-2.5 mt-4"
        to="/dashboard/my-access-requests/">
        Listar solicitações
      </Link>
      <Button className="ml-4 mt-4" onClick={onRequestNew}>
        Solicitar novo acesso
      </Button>
    </>
  );
};
