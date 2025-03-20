import { Outlet, useNavigate } from 'react-router-dom';
// import Scene from '../components/canvas/error/Scene';
import { Button } from '../components/ui/button';
import Head from '../components/canvas/Head';

const ErrorLayout = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>

      <div className="relative w-full h-screen">
        {/* <Scene /> */}
          <Head />
      </div>

      <div className="pointer-events-none absolute w-full h-full top-0 left-0 z-10 ">
          <div className="pt-16 pl-10 space-y-6">            
            <h2 className="text-2xl z-50">
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
