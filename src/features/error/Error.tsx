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
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <AlertCircle className="w-24 h-24 text-destructive" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            {errorCode || "Error"}
          </h1>
          <p className="text-lg text-muted-foreground">
            {getErrorMessage(errorCode)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Error;
