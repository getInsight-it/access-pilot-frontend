import React, { ReactNode, useEffect, useState } from "react";
import { useAuth } from "./AuthContext.tsx";
import { Navigate, useLocation } from "react-router-dom";
import { AUTH_ROUTES, ERROR_ROUTES } from "../../constants/routes.ts";
import HighlightLoader from "../../../components/highlightloader/HighLightLoader.tsx";

interface RoleGuardProps {
  children: ReactNode;
}

export const ApproverGuard: React.FC<RoleGuardProps> = ({ children }) => {
  const authData = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname) {
      sessionStorage.setItem('lastApproverRoute', location.pathname + location.search);
    }
  }, [location]);

  useEffect(() => {
    let timeoutId: number;
    let maxWaitTimeoutId: number;

    if (authData.isAuthenticated !== undefined && authData.user !== null) {
      setIsLoading(false);
    } else {
      timeoutId = window.setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      maxWaitTimeoutId = window.setTimeout(() => {
        setHasTimedOut(true);
        setIsLoading(false);
      }, 10000);
    }

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(maxWaitTimeoutId);
    };
  }, [authData.isAuthenticated, authData.user]);

  useEffect(() => {
    if (authData.isAuthenticated !== undefined && authData.user !== null) {
      setIsLoading(false);
    }
  }, [authData.isAuthenticated, authData.user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <HighlightLoader />
      </div>
    );
  }

  if (hasTimedOut) {
    return <Navigate to={ERROR_ROUTES.ERROR} replace />;
  }

  if (!authData.isAuthenticated) {
    return <Navigate to={AUTH_ROUTES.LOGIN} replace />;
  }

  if (!authData.isApprover) {
    return <Navigate to={ERROR_ROUTES.NOT_FOUND} replace />;
  }

  return <>{children}</>;
};

export const ApproverComponentGuard: React.FC<RoleGuardProps> = ({ children }) => {
  const { isApprover } = useAuth();
  return isApprover ? <>{children}</> : <></>;
};
