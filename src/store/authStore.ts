import { create } from 'zustand'

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (authenticated) => set(() => ({
    isAuthenticated: authenticated
  }))
}));

export default useAuthStore;
