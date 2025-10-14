import { AppRouter } from "./App.router.tsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "./store/authStore.ts";
import { AUTH_ROUTES, ERROR_ROUTES, PRIVATE_ROUTES } from "./common/constants/routes.ts";
import { AuthInitEvent } from "@getinsight.it/getinsight-common";
import { ThemeProvider } from "./theme/theme-provider.tsx";
import { registerHttpAuthorization } from "./config/http/http.ts";
import { motion } from "framer-motion";
import "./App.scss";
import HighlightLoader from "./common/components/loading/HighLightLoader.tsx";
import { filter, from, interval, map, mergeMap, startWith } from "rxjs";
import { authService } from "./features/auth/common/AuthService.ts";
import { userService } from "./common/service/user-service.ts";
import { notificationService } from "./common/service/notification-service.ts";
import { initMobileViewportFix } from "./common/utils/mobileViewportFix.ts";

function App() {
  const navigate = useNavigate();
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const setUserRoles = useAuthStore((state) => state.setRoles);
  const setUserInfo = useAuthStore((state) => state.setUserInfo);
  const setNotificationInfo = useAuthStore((state) => state.setNotificationInfo);

  const [isInitialized, setIsInitialized] = useState(false);

  const getUserInfo = async () => {
    const fetchedUserData = await userService.getUser();
    if(fetchedUserData) {
      const user = {
        id: fetchedUserData.externalId,
        email: fetchedUserData.email,
        isApprover: fetchedUserData.isApprover,
        firstName: fetchedUserData.firstName,
        lastName: fetchedUserData.lastName,
        username: fetchedUserData.username
      };
      if(user) {
        setUserInfo(user);
      }
    }
  };

  const init = () => {
    authService.isAuthenticated().subscribe(async (authenticated) => {
      await registerHttpAuthorization(authenticated);
      setIsAuthenticated(authenticated);

      if(authenticated) {

        getUserInfo();
        setUserRoles(authService.getRoles());
        // TODO remove this comment
        //getNotifications()

        const currentRoute = window.location.pathname;

        if(currentRoute === PRIVATE_ROUTES.DASHBOARD || currentRoute.startsWith("/dashboard")) {
          return;
        }

        navigate(PRIVATE_ROUTES.DASHBOARD);
      }
    });

    authService.onInitEvent().subscribe((event) => {
      if(event !== AuthInitEvent.INITIALIZE) {
        setIsInitialized(true); // Inicialização completa
      }

      if(event === AuthInitEvent.ERROR) {
        navigate(ERROR_ROUTES.ERROR);
      }
    });

    authService.onRefreshTokenEvent().subscribe(async (refreshedToken) => {
      if(refreshedToken) {
        await registerHttpAuthorization(refreshedToken);
      }
    });

    authService.onSignOutEvent().subscribe((userSignedOut) => {
      if(userSignedOut) {
        navigate(AUTH_ROUTES.LOGIN);
      }
    });
  };

  useEffect(() => {
    console.log("Inicializando autenticação");
    init();

    initMobileViewportFix();
  }, []);

  const getNotifications = async () => {
    const polling$ = interval(window.env.NOTIFICATION_REFRESH_INTERVAL || 5000).pipe(
      startWith(0),
      filter(() => useAuthStore?.getState()?.user?.id),
      mergeMap(() => from(notificationService.getNotifications("WEB", 1, 5, "id", "DESC", useAuthStore?.getState()?.user?.id))),
      mergeMap(page =>
        from(notificationService.getSummaryNotifications(useAuthStore?.getState()?.user?.id, "WEB")).pipe(
          map(summary => ({ page, summary }))
        )
      )
    );

    const subscription = polling$.subscribe({
      next: ({ page, summary }) => {
        const notification = {
          notifications: page.items,
          unread: summary.totalUnread
        };
        setNotificationInfo(notification);
      },
      error: (err) => console.error(err)
    });

    return () => subscription.unsubscribe();
  };

  if(!isInitialized) {
    return (
      <motion.div
        className="flex items-center justify-center h-dvh md:h-screen bg-gray-100"
        style={{ height: 'calc(var(--mobile-vh, 1vh) * 100)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}>
        <HighlightLoader />
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
