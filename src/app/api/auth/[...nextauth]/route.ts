import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';

const API_BASE = process.env.API_URL || 'http://localhost:4000/api/v1';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || 'placeholder',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder',
    }),
    Credentials({
      name: 'Phone OTP',
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        otp: { label: 'OTP', type: 'text' },
        name: { label: 'Name', type: 'text' },
      },
      async authorize(credentials) {
        try {
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
              email: data.data.user.email,
              image: data.data.user.avatarUrl,
              accessToken: data.data.accessToken,
              role: data.data.user.role,
              creditBalance: data.data.user.creditBalance,
              phone: data.data.user.phone,
            };
          }

          return null;
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google OAuth
      if (account?.provider === 'google' && profile) {
        try {
          const res = await fetch(`${API_BASE}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              googleId: profile.sub,
              email: profile.email,
              name: profile.name,
              avatarUrl: profile.picture,
            }),
          });

          const data = await res.json();

          if (data.success && data.data?.user && data.data?.accessToken) {
            (user as any).accessToken = data.data.accessToken;
            (user as any).role = data.data.user.role;
            (user as any).creditBalance = data.data.user.creditBalance;
            (user as any).phone = data.data.user.phone;
            (user as any).dbId = data.data.user.id;
            return true;
          }

          return false;
        } catch {
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.role = (user as any).role;
        token.creditBalance = (user as any).creditBalance;
        token.phone = (user as any).phone;
        token.dbId = (user as any).dbId || user.id;
      }

      // Update credit balance on session update
      if (trigger === 'update' && session?.creditBalance !== undefined) {
        token.creditBalance = session.creditBalance;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.dbId as string;
        (session as any).accessToken = token.accessToken;
        (session as any).role = token.role;
        (session as any).creditBalance = token.creditBalance;
        (session as any).phone = token.phone;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'consultlegal-nextauth-secret-2024',
});

export { handlers as GET, handlers as POST };
