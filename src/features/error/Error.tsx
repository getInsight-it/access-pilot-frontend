import { useParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useI18n } from "../../common/context/i18n/I18nContext.tsx";

const Error = () => {
  const { errorCode } = useParams<{ errorCode?: string }>();
  const { t } = useI18n();

  const getErrorMessage = (code?: string): string => {
    switch (code) {
      case "404":
        return t("Página não encontrada");
      case "403":
        return t("Acesso negado");
      case "500":
        return t("Erro interno do servidor");
      default:
        return t("Erro genérico");
    }
  };

  return (
    <div>
      <div>
        <div>
          <AlertCircle className="w-24 h-24 text-destructive" />
        </div>

        <div>
          <h1>
            {errorCode || "Error"}
          </h1>
          <p>
            {getErrorMessage(errorCode)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Error;
