// import { Outlet } from 'react-router-dom';
// import Scene from '../components/canvas/error/Scene';

// const ErrorLayout = () => {

//   return (
//     <>
//       <p>Sou o ErrorLayout</p>

//       <div className="relative">
//           <Scene />
//       </div>
      
//       <Outlet/>
//     </>
//   )
// };

// export default ErrorLayout;

import { Outlet, useNavigate } from 'react-router-dom';
import Scene from '../components/canvas/error/Scene';
import { Button } from '../components/ui/button';

const ErrorLayout = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Volta para a página anterior
  };

  return (
    <>

      <div className="relative">
        <Scene />
      </div>

      {/* Botão de voltar */}

      <div className="pointer-events-none absolute w-full h-full top-0 left-0 z-10 ">
          <div className="pt-16 pl-10 space-y-6">
            <p>Sou o ErrorLayout</p>
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
