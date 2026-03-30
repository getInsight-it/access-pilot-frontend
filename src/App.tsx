import { AppRouter } from "./App.router.tsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "./store/authStore.ts";
import { AUTH_ROUTES, ERROR_ROUTES, PRIVATE_ROUTES, PUBLIC_ROUTES } from "./common/constants/routes.ts";
import { AuthInitEvent } from "@getinsight.it/getinsight-common";
import { ThemeProvider } from "./theme/theme-provider.tsx";
import { registerHttpAuthorization } from "./config/http/http.ts";
import { motion } from "framer-motion";
import "./App.scss";
import HighlightLoader from "./common/components/loading/HighLightLoader.tsx";
import { authService } from "./features/auth/common/AuthService.ts";
import { userService } from "./common/service/user-service.ts";
import { initMobileViewportFix } from "./common/utils/mobileViewportFix.ts";
import { STORAGE_KEYS } from "./common/constants/storage.ts";

function App() {
  const navigate = useNavigate();
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const setUserRoles = useAuthStore((state) => state.setRoles);
  const setUserInfo = useAuthStore((state) => state.setUserInfo);

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

        const currentRoute = window.location.pathname;
        const invitationUuid = sessionStorage.getItem(STORAGE_KEYS.INVITATION_UUID);
        const shouldRedirectToInviteRequest = Boolean(
          invitationUuid &&
          (
            currentRoute === "/" ||
            currentRoute === AUTH_ROUTES.LOGIN ||
            currentRoute === PUBLIC_ROUTES.INVITATION
          )
        );

        if(shouldRedirectToInviteRequest) {
          navigate(PRIVATE_ROUTES.MY_INVITE_REQUEST);
          return;
        }

        if(currentRoute === "/" || currentRoute === AUTH_ROUTES.LOGIN) {
          navigate(PRIVATE_ROUTES.DASHBOARD);
        }
      }
    });

    authService.onInitEvent().subscribe((event) => {
      if(event !== AuthInitEvent.INITIALIZE) {
        setIsInitialized(true);
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
    init();
    initMobileViewportFix();
  }, []);

  return (
    <ThemeProvider>
      {!isInitialized ? (
        <motion.div
          className="app-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}>
          <HighlightLoader size="lg" />
        </motion.div>
      ) : (
        <AppRouter />
      )}
    </ThemeProvider>
  );
}

export default App;
