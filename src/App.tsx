// import { AppRouter } from './App.router.tsx';
// import { useEffect } from 'react';
// import { authService } from './services/auth';
// import { useNavigate } from 'react-router-dom';
// import useAuthStore from './store/authStore.ts';
// import { AUTH_ROUTES, ERROR_ROUTES, PRIVATE_ROUTES } from './constants/routes.ts';

// import './App.scss'
// import { AuthInitEvent } from '@getinsight.it/getinsight-common';
// import { ThemeProvider } from './components/layout/ThemeToggle/theme-provider.tsx';
// import { registerHttpAuthorization } from './config/http/http.ts';

// function App() {

//   const navigate = useNavigate();

//   /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
//   const setIsAuthenticated = useAuthStore((state: any) => state.setIsAuthenticated);

//   // const init = () => {
//   //   authService.isAuthenticated().subscribe(authenticated => {
//   //     setIsAuthenticated(authenticated);
//   //     if (authenticated) {
//   //       navigate(PRIVATE_ROUTES.DASHBOARD);
//   //     }
//   //   });

//   //   authService.onInitEvent().subscribe(event => {
//   //     if (event !== AuthInitEvent.INITIALIZE) {
//   //       // TODO: Esconder loader
//   //     }

//   //     if (event === AuthInitEvent.ERROR) {
//   //       navigate(ERROR_ROUTES.ERROR);
//   //     }
//   //   });

//   //   authService.onSignOutEvent().subscribe(userSignedOut => {
//   //     if (userSignedOut) {
//   //       navigate(AUTH_ROUTES.LOGIN);
//   //     }
//   //   });
//   // };

//   const init = () => {
//     authService.isAuthenticated().subscribe(async (authenticated) => {
//       await registerHttpAuthorization(authenticated);

//       setIsAuthenticated(authenticated);

//       if (authenticated) {
//         // Verifique se a navegação já está em uma rota válida
//         const currentRoute = window.location.pathname;
      
//         // Evite redirecionar para o dashboard se já estiver em uma página interna
//         if (currentRoute !== PRIVATE_ROUTES.DASHBOARD && currentRoute.startsWith('/dashboard')) {
//           return; // Já está em uma rota válida do dashboard, não redirecionar
//         }
      
//         navigate(PRIVATE_ROUTES.DASHBOARD);
//       }
//     });

//     authService.onInitEvent().subscribe(event => {
//       if (event !== AuthInitEvent.INITIALIZE) {
//         // TODO: Esconder loader
//       }

//       if (event === AuthInitEvent.ERROR) {
//         navigate(ERROR_ROUTES.ERROR);
//       }
//     });

//     authService.onSignOutEvent().subscribe(userSignedOut => {
//       if (userSignedOut) {
//         navigate(AUTH_ROUTES.LOGIN);
//       }
//     });
//   };


//   useEffect(() => {
//     init();
//   }, []);

//   return (
//     <ThemeProvider>
//       <AppRouter />
//     </ThemeProvider>
//   )
// }

// export default App



import { AppRouter } from './App.router.tsx';
import { useState, useEffect } from 'react';
import { authService } from './services/auth';
import { useNavigate } from 'react-router-dom';
import useAuthStore from './store/authStore.ts';
import { AUTH_ROUTES, ERROR_ROUTES, PRIVATE_ROUTES } from './constants/routes.ts';
import { AuthInitEvent } from '@getinsight.it/getinsight-common';
import { ThemeProvider } from './components/layout/ThemeToggle/theme-provider.tsx';
import { registerHttpAuthorization } from './config/http/http.ts';
import { motion } from 'framer-motion';
import './App.scss';

function App() {
  const navigate = useNavigate();
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const [isInitialized, setIsInitialized] = useState(false); // Estado de inicialização

  const init = () => {
    authService.isAuthenticated().subscribe(async (authenticated) => {
      await registerHttpAuthorization(authenticated);
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const currentRoute = window.location.pathname;

        if (currentRoute === PRIVATE_ROUTES.DASHBOARD || currentRoute.startsWith('/dashboard')) {
          return;
        }

        // Redirecionar para o dashboard
        navigate(PRIVATE_ROUTES.DASHBOARD);
      }
    });

    authService.onInitEvent().subscribe((event) => {
      if (event !== AuthInitEvent.INITIALIZE) {
        setIsInitialized(true); // Inicialização completa
      }

      if (event === AuthInitEvent.ERROR) {
        navigate(ERROR_ROUTES.ERROR);
      }
    });

    authService.onSignOutEvent().subscribe((userSignedOut) => {
      if (userSignedOut) {
        navigate(AUTH_ROUTES.LOGIN);
      }
    });
  };

  useEffect(() => {
    console.log('Inicializando autenticação');
    init();
  }, []);

  if (!isInitialized) {
    // Retorno do loader
    return (
      <motion.div
        className="flex items-center justify-center h-screen bg-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-16 h-16 border-4 border-t-4 border-gray-200 rounded-full animate-spin"
          style={{ borderTopColor: '#3498db' }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
    );
  }

  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
