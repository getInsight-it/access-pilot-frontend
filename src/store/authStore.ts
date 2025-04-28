import { KeycloakRoles } from "@getinsight.it/getinsight-common";
import { create } from "zustand";
import { NotificationModel } from "../common/types/notification/notification.model.ts";

interface UserInfo {
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  isApprover?: boolean;
  externalId?: string;
}

interface NotificationInfo {
  unread: number;
  notifications: NotificationModel[];
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  roles: KeycloakRoles | null;
  notification: NotificationInfo | null;
  setIsAuthenticated: (authenticated: boolean) => void;
  setUserInfo: (user: UserInfo) => void;
  setRoles: (roles: KeycloakRoles | undefined) => void;
  setNotificationInfo: (notification: NotificationInfo | undefined) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  roles: null,
  notification: null,
  setIsAuthenticated: (authenticated: boolean) => set(() => ({
    isAuthenticated: authenticated
  })),
  setUserInfo: (user: UserInfo) => set(() => ({
    user
  })),
  setRoles: (roles: KeycloakRoles | undefined) => set(() => ({
    roles
  })),
  setNotificationInfo: (notification: NotificationInfo | undefined) => set(() => ({
    notification
  }))
}));

export default useAuthStore;
