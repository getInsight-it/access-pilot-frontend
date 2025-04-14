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
import HighlightLoader from './components/highlightloader/HighLightLoader.tsx';
import { userService } from './services/user'
import {filter, from, interval, startWith, mergeMap, map} from "rxjs";
import {notificationService} from "./services/notification";

function App() {
  const navigate = useNavigate();
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const setUserRoles = useAuthStore((state) => state.setRoles);
  const setUserInfo = useAuthStore((state) => state.setUserInfo);
  const setNotificationInfo = useAuthStore((state) => state.setNotificationInfo);

  const [isInitialized, setIsInitialized] = useState(false); // Estado de inicialização


  const getUserInfo = async () => {
    const fetchedUserData = await userService.getUser()
    console.log("User info:", fetchedUserData)
    if (fetchedUserData) {
      const user = {
        id: fetchedUserData.externalId,
        email: fetchedUserData.email,
        isApprover: fetchedUserData.isApprover,
        // isApprover: true,
      }
      if (user) {
        setUserInfo(user)
      }
    }
  }

  const init = () => {
    authService.isAuthenticated().subscribe(async (authenticated) => {
      await registerHttpAuthorization(authenticated);
      setIsAuthenticated(authenticated);

      if (authenticated) {

        getUserInfo()
        setUserRoles(authService.getRoles());
        console.log(useAuthStore.getState().roles);
        // TODO remove this comment
        //getNotifications()

        const currentRoute = window.location.pathname;

        if (currentRoute === PRIVATE_ROUTES.DASHBOARD || currentRoute.startsWith('/dashboard')) {
          return;
        }

        // Redirecionar para solicitar acesso
        navigate(PRIVATE_ROUTES.REQUEST_ACCESS);
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

    authService.onRefreshTokenEvent().subscribe(async (refreshedToken) => {
      if (refreshedToken) {
        await registerHttpAuthorization(refreshedToken);
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

  const getNotifications = async () => {
    const polling$ = interval(window.env.NOTIFICATION_REFRESH_INTERVAL || 5000).pipe(
      startWith(0),
      filter(() => useAuthStore?.getState()?.user?.id),
      mergeMap(() => from(notificationService.getNotifications('WEB', 1, 5, 'id', 'DESC', useAuthStore?.getState()?.user?.id))),
      mergeMap(page =>
        from(notificationService.getSummaryNotifications(useAuthStore?.getState()?.user?.id, 'WEB')).pipe(
          map(summary => ({ page, summary }))
        )
      )
    );

    const subscription = polling$.subscribe({
      next: ({ page, summary }) => {
        const notification = {
          notifications: page.items,
          unread: summary.totalUnread,
        };
        setNotificationInfo(notification);
      },
      error: (err) => console.error(err),
    });

    return () => subscription.unsubscribe();
  };

  if (!isInitialized) {
    // Retorno do loader
    return (
      <motion.div
        className="flex items-center justify-center h-screen bg-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <HighlightLoader />
        {/* <motion.div
          className="w-16 h-16 border-4 border-t-4 border-gray-200 rounded-full animate-spin"
          style={{ borderTopColor: '#3498db' }}
          transition={{ duration: 0.5 }}
        /> */}
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
