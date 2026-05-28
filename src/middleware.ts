import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/payment',
  '/refunds',
  '/resources',
  '/documents',
  '/products/documents',
  '/products/lawyers',
  '/products/ai-chat',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Allow static files
  if (pathname.startsWith('/_next/') || pathname.startsWith('/favicon')) {
    return NextResponse.next();
  }

  // Check if route requires auth (dashboard routes)
  const isDashboardRoute = pathname.startsWith('/dashboard');

  if (!isDashboardRoute) {
    return NextResponse.next();
  }

  // Check for auth token cookie (set by auth store on login)
  const token = request.cookies.get('cl_token')?.value;

  // Also check for NextAuth session token
  const nextAuthToken = request.cookies.get('next-auth.session-token')?.value;

  // Check for Zustand persisted auth (consultlegal-auth cookie contains JSON)
  const zustandAuth = request.cookies.get('consultlegal-auth')?.value;
  let hasZustandAuth = false;

  if (zustandAuth) {
    try {
      const parsed = JSON.parse(decodeURIComponent(zustandAuth));
      // Zustand persist wraps state in { state: { isAuthenticated: true } }
      hasZustandAuth = parsed?.state?.isAuthenticated === true;
    } catch {
      // Try parsing as direct JSON
      try {
        const parsed = JSON.parse(zustandAuth);
        hasZustandAuth = parsed?.isAuthenticated === true;
      } catch {
        // Ignore parse errors
      }
    }
  }

  if (!token && !nextAuthToken && !hasZustandAuth) {
    // Redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|logo.svg).*)'],
};
