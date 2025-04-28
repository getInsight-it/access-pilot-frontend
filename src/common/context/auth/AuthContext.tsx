import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { KeycloakRoles } from "@getinsight.it/getinsight-common/dist/auth/interface/KeycloakRoles";
import useAuthStore from "../../../store/authStore.ts";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  roles: KeycloakRoles | null;
  notification: any;
  isApprover: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  setUserInfo: (user: any) => void;
  setRoles: (roles: KeycloakRoles | undefined) => void;
  setNotificationInfo: (info: any | undefined) => void;
}

const AuthContext = createContext<AuthContextType>({} as any);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    isAuthenticated,
    user,
    roles,
    notification,
    setIsAuthenticated,
    setUserInfo,
    setRoles,
    setNotificationInfo
  } = useAuthStore();

  const value = useMemo(() => ({
    isAuthenticated,
    user,
    roles,
    notification,
    isApprover: !!user?.isApprover,
    setIsAuthenticated,
    setUserInfo,
    setRoles,
    setNotificationInfo
  }), [isAuthenticated, user, roles, notification, setIsAuthenticated, setUserInfo, setRoles, setNotificationInfo]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth context não encontrado.');
  return ctx;
};
