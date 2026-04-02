import { Button } from "../../../../../common/external/ui/button.tsx";
import { FlipWords } from "../../../../../common/external/ui/flip-words.tsx";
import { Link } from "react-router-dom";
import { FileAttachment } from "../components/request-justification-step/RequestJustificationStep.tsx";
import { PRIVATE_ROUTES } from "../../../../../common/constants/routes.ts";
import { useI18n } from "../../../../../common/context/i18n/I18nContext.tsx";

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
  const { t } = useI18n();

  return (
    <>
      <div>
        <div>
          <div>
            {t("Solicitação criada")}
            <FlipWords words={words} />
          </div>
        </div>
        <div></div>

        <div>
          <div>
            <p>{t("Sistema")}:</p>
            <p>{t("Papel solicitado")}:</p>
            <p>{t("Motivo")}:</p>
            {attachments.length > 0 && <p>{t("Anexos")}:</p>}
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
        {t("Listar solicitações")}
      </Link>
      <Button onClick={onRequestNew}>
        {t("Solicitar novo acesso")}
      </Button>
    </>
  );
};
