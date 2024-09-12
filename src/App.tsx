import { AppRouter } from './App.router.tsx';
import { useEffect } from 'react';
import { authService } from './services/auth';
import { useNavigate } from 'react-router-dom';
import useAuthStore from './store/authStore.ts';
import { AUTH_ROUTES, ERROR_ROUTES, PRIVATE_ROUTES } from './constants/routes.ts';

import './App.scss'
import { AuthInitEvent } from '@getinsight.it/getinsight-common';

function App() {

  const navigate = useNavigate();

  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);

  const init = () => {
    authService.isAuthenticated().subscribe(authenticated => {
      setIsAuthenticated(authenticated);
      if (authenticated) {
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
    <AppRouter/>
  )
}

export default App
