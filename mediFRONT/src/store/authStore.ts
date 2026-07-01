import { create } from 'zustand';
import { getAuthUser, clearAuthSession } from '../auth/authCookies';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  login: (credentials: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!getAuthUser(),
  user: getAuthUser(),
  login: (credentials: any) => {
    // Legacy support, in real flow we use AuthContext
    set({
      isAuthenticated: true,
      user: credentials,
    });
  },
  logout: () => {
    clearAuthSession();
    set({ isAuthenticated: false, user: null });
  },
}));


