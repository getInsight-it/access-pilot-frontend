import { useParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const Error = () => {
  const { errorCode } = useParams<{ errorCode?: string }>();

  const getErrorMessage = (code?: string): string => {
    switch (code) {
      case "404":
        return "Página não encontrada";
      case "403":
        return "Acesso negado";
      case "500":
        return "Erro interno do servidor";
      default:
        return "Erro genérico";
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
