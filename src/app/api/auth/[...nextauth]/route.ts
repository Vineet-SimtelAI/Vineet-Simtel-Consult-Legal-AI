import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

// Check if real Google OAuth credentials are configured
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const hasGoogleOAuth = !!(
  googleClientId &&
  googleClientSecret &&
  googleClientId !== 'placeholder' &&
  googleClientId.length > 10
);

// Build providers list
const providers: any[] = [
  Credentials({
    name: 'Phone OTP',
    credentials: {
      phone: { label: 'Phone', type: 'text' },
      otp: { label: 'OTP', type: 'text' },
      name: { label: 'Name', type: 'text' },
    },
    async authorize(credentials: any) {
      try {
        const API_BASE = process.env.API_URL || 'http://localhost:4000/api/v1';
        const res = await fetch(`${API_BASE}/auth/otp/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: credentials.phone,
            otp: credentials.otp,
            name: credentials.name,
          }),
        });

        const data = await res.json();

        if (data.success && data.data?.user && data.data?.accessToken) {
          return {
            id: data.data.user.id,
            name: data.data.user.name,
            email: data.data.user.email || '',
            image: data.data.user.avatarUrl || '',
          };
        }
        return null;
      } catch {
        return null;
      }
    },
  }),
];

// Initialize NextAuth
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 7 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET || 'consultlegal-nextauth-secret-2024',
});

// Export route handlers - handlers is { GET, POST }
export const { GET, POST } = handlers;
