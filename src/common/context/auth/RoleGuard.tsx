import React, { ReactNode, useEffect } from "react";
import { AuthContextType, useAuth } from "./AuthContext.tsx";
import { Navigate, useLocation } from "react-router-dom";
import { ERROR_ROUTES } from "../../constants/routes.ts";
import { STORAGE_KEYS } from "../../constants/storage.ts";
import HighlightLoader from "../../components/loading/HighLightLoader.tsx";
import { KeycloakClientRoles } from "@getinsight.it/getinsight-common/dist/auth/interface/KeycloakRoles";
import { UserRoleEnum } from "../../types/user/user.model.ts";
import { KeycloakSystemsEnum } from "../../types/keycloak/keycloak-systems.enum.ts";

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
    ?.find((role: KeycloakClientRoles) => Object.keys(role)[0] === KeycloakSystemsEnum.ACCESS_PILOT_BACKEND)
    ?.[KeycloakSystemsEnum.ACCESS_PILOT_BACKEND].includes(UserRoleEnum.ADMIN) ?? false;

  if(isAdmin) userRoles.push(UserRoleEnum.ADMIN);
  if(authData.isApprover) userRoles.push(UserRoleEnum.APPROVER);

  return roles
    ? roles.some((role) => userRoles.includes(role))
    : true;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, roles }) => {
  const authData = useAuth();
  const location = useLocation();

  useEffect(() => {
    if(location.pathname) {
      sessionStorage.setItem(STORAGE_KEYS.LAST_APPROVER_ROUTE, location.pathname + location.search);
    }
  }, [location]);

  if(!authData.isAuthenticated || !authData.user) {
    return (
      <div style={{ height: 'calc(var(--mobile-vh, 1vh) * 100)' }}>
        <HighlightLoader />
      </div>
    );
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
