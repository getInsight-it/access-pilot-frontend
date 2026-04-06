import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "../common/external/ui/button";

const ErrorLayout = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div>
        <div>
          <h2>
            Algo deu errado.
          </h2>
          <Button
            className="pointer-events-auto"
            onClick={handleGoBack}
          >
            Voltar
          </Button>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default ErrorLayout;
