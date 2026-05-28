import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  avatarUrl?: string;
  company?: string;
  creditBalance: number;
  emailVerified: boolean;
  phoneVerified: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  _hydrated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateCredits: (balance: number) => void;
  setHydrated: (v: boolean) => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hydrated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      setHydrated: (_hydrated) => set({ _hydrated }),

      login: (user, token) => {
        set({ user, token, isAuthenticated: true, _hydrated: true });
        // Store token in cookie for middleware
        if (typeof document !== 'undefined') {
          document.cookie = `cl_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        }
      },

      logout: async () => {
        const { token } = get();
        try {
          if (token) {
            await fetch(`${API_BASE}/auth/logout`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` },
            });
          }
        } catch {
          // Ignore logout API errors
        }
        set({ user: null, token: null, isAuthenticated: false, _hydrated: true });
        if (typeof document !== 'undefined') {
          document.cookie = 'cl_token=; path=/; max-age=0';
        }
      },

      updateCredits: (balance) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, creditBalance: balance } });
        }
      },
    }),
    {
      name: 'consultlegal-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hydrated = true;
        }
      },
    },
  ),
);
