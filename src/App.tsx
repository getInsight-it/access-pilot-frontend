import { AppRouter } from './App.router.tsx';
import { useEffect } from 'react';
import { authService } from './services/auth';
import { useNavigate } from 'react-router-dom';
import useAuthStore from './store/authStore.ts';
import { AUTH_ROUTES, ERROR_ROUTES, PRIVATE_ROUTES } from './constants/routes.ts';

import './App.scss'
import { AuthInitEvent } from '@getinsight.it/getinsight-common';
import { ThemeProvider } from './components/layout/ThemeToggle/theme-provider.tsx';

function App() {

  const navigate = useNavigate();

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const setIsAuthenticated = useAuthStore((state: any) => state.setIsAuthenticated);

  // const init = () => {
  //   authService.isAuthenticated().subscribe(authenticated => {
  //     setIsAuthenticated(authenticated);
  //     if (authenticated) {
  //       navigate(PRIVATE_ROUTES.DASHBOARD);
  //     }
  //   });

  //   authService.onInitEvent().subscribe(event => {
  //     if (event !== AuthInitEvent.INITIALIZE) {
  //       // TODO: Esconder loader
  //     }

  //     if (event === AuthInitEvent.ERROR) {
  //       navigate(ERROR_ROUTES.ERROR);
  //     }
  //   });

  //   authService.onSignOutEvent().subscribe(userSignedOut => {
  //     if (userSignedOut) {
  //       navigate(AUTH_ROUTES.LOGIN);
  //     }
  //   });
  // };

  const init = () => {
    authService.isAuthenticated().subscribe(authenticated => {
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        // Verifique se a navegação já está em uma rota válida
        const currentRoute = window.location.pathname;
        
        // Evite redirecionar para o dashboard se já estiver em uma página interna
        if (currentRoute !== PRIVATE_ROUTES.DASHBOARD && currentRoute.startsWith('/dashboard')) {
          return; // Já está em uma rota válida do dashboard, não redirecionar
        }
  
        navigate(PRIVATE_ROUTES.DASHBOARD);
      }
    });
  
    authService.onInitEvent().subscribe(event => {
      if (event !== AuthInitEvent.INITIALIZE) {
        // TODO: Esconder loader
      }
  
      if (event === AuthInitEvent.ERROR) {
        navigate(ERROR_ROUTES.ERROR);
      }
    });
  
    authService.onSignOutEvent().subscribe(userSignedOut => {
      if (userSignedOut) {
        navigate(AUTH_ROUTES.LOGIN);
      }
    });
  };

  
  useEffect(() => {
    init();
  }, []);

  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  )
}

export default App
