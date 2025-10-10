import React, { ReactNode, useEffect } from "react";
import { AuthContextType, useAuth } from "./AuthContext.tsx";
import { Navigate, useLocation } from "react-router-dom";
import { AUTH_ROUTES, ERROR_ROUTES } from "../../constants/routes.ts";
import HighlightLoader from "../../components/loading/HighLightLoader.tsx";
import { KeycloakClientRoles } from "@getinsight.it/getinsight-common/dist/auth/interface/KeycloakRoles";
import { UserRoleEnum } from "../../types/user/user.model.ts";
import { KeycloackSystemsEnum } from "../../types/keycloack/keycloack-systems.enum.ts";

interface RoleGuardProps {
  children: ReactNode;
  roles?: string[];
}


/**
 * Checks if the user has any of the required roles
 * @param roles - The roles required for access
 * @param authData - The authentication context data
 * @returns true if the user has any of the required roles or if no roles are required
 */
const hasRequiredRoles = (roles: string[] | undefined, authData: AuthContextType): boolean => {
  if(!roles || roles.length === 0) return true;

  const userRoles: string[] = [];

  const isAdmin: boolean = authData.roles?.clientRoles
    ?.find((role: KeycloakClientRoles) => Object.keys(role)[0] === KeycloackSystemsEnum.ACCESS_PILOT)
    ?.[KeycloackSystemsEnum.ACCESS_PILOT].includes(UserRoleEnum.ADMIN) ?? false;

  if(isAdmin) userRoles.push(UserRoleEnum.ADMIN);
  if(authData.isApprover) userRoles.push(UserRoleEnum.APPROVER);

  return roles
    ? roles.every((role) => userRoles.some(userRole => userRole === role))
    : true;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, roles }) => {
  const authData = useAuth();
  const location = useLocation();

  useEffect(() => {
    if(location.pathname) {
      sessionStorage.setItem("lastApproverRoute", location.pathname + location.search);
    }
  }, [location]);

  if(!authData.isAuthenticated || !authData.user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <HighlightLoader />
      </div>
    );
  }

  if(!authData.isAuthenticated) {
    return <Navigate to={AUTH_ROUTES.LOGIN} replace />;
  }

  if(!authData.user) {
    console.log('user is null');
  }

  if(!hasRequiredRoles(roles, authData)) {
    return <Navigate to={ERROR_ROUTES.NOT_FOUND} replace />;
  }

  return <>{children}</>;
};

export const RoleComponentGuard: React.FC<RoleGuardProps> = ({ children, roles }) => {
  const authData = useAuth();
  return hasRequiredRoles(roles, authData) ? <>{children}</> : <></>;
};
