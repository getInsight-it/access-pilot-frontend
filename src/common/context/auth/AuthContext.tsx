import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { KeycloakRoles } from "@getinsight.it/getinsight-common/dist/auth/interface/KeycloakRoles";
import useAuthStore, { UserInfo, NotificationInfo } from "../../../store/authStore.ts";

export interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInfo | null;
  roles: KeycloakRoles | null;
  notification: NotificationInfo | null;
  isApprover: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  setUserInfo: (user: UserInfo) => void;
  setRoles: (roles: KeycloakRoles | undefined) => void;
  setNotificationInfo: (info: NotificationInfo | undefined) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
