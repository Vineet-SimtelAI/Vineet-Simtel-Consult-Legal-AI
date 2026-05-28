'use client';

import { useSession } from 'next-auth/react';
import { useAuthStore } from '@/stores/auth-store';
import { useEffect } from 'react';

export function useAuth() {
  const { data: session, status } = useSession();
  const { user, token, isAuthenticated, login, logout, updateCredits, setLoading } = useAuthStore();

  // Sync NextAuth session with Zustand store
  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    if (session?.user && !isAuthenticated) {
      login(
        {
          id: (session as any).user?.id || session.user.id || '',
          name: session.user.name || '',
          email: session.user.email || undefined,
          avatarUrl: session.user.image || undefined,
          role: (session as any).role || 'USER',
          creditBalance: (session as any).creditBalance || 0,
          emailVerified: !!session.user.email,
          phoneVerified: !!(session as any).phone,
          phone: (session as any).phone || undefined,
        },
        (session as any).accessToken || ''
      );
    } else if (!session && isAuthenticated) {
      logout();
    } else if (status !== 'loading') {
      setLoading(false);
    }
  }, [session, status]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading: status === 'loading',
    session,
    login,
    logout,
    updateCredits,
  };
}
