import { KeycloakRoles } from '@getinsight.it/getinsight-common';
import { create } from 'zustand'

interface UserInfo {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  roles: KeycloakRoles | null;
  setIsAuthenticated: (authenticated: boolean) => void;
  setUserInfo: (user: UserInfo) => void;
  setRoles: (roles: KeycloakRoles | undefined) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  roles: null,
  setIsAuthenticated: (authenticated: boolean) => set(() => ({
    isAuthenticated: authenticated
  })),
  setUserInfo: (user: UserInfo) => set(() => ({
    user
  })),
  setRoles: (roles: KeycloakRoles | undefined) => set(() => ({
    roles
  }))
}));

export default useAuthStore;
