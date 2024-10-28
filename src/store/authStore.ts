import { create } from 'zustand'

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (authenticated: boolean) => set(() => ({
    isAuthenticated: authenticated
  }))
}));

export default useAuthStore;
