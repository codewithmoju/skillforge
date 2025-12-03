import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of protected routes that require authentication
const protectedRoutes = [
    '/dashboard',
    '/roadmap',
    '/courses',
    '/messages',
    '/achievements',
    '/social',
    '/create',
    '/settings',
    '/notifications',
    '/projects',
    '/challenges',
    '/groups',
];

// List of auth routes (should redirect to dashboard if already logged in)
const authRoutes = ['/login', '/signup'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get the user session from cookies
    // Note: We're using Firebase auth, so we check for the Firebase auth token
    const authToken = request.cookies.get('__session')?.value;
    const isAuthenticated = !!authToken;

    // Check if the current route is protected
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    );

    // Check if the current route is an auth route
    const isAuthRoute = authRoutes.some(route =>
        pathname.startsWith(route)
    );

    // Redirect to login if trying to access protected route without auth
    if (isProtectedRoute && !isAuthenticated) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect to dashboard if trying to access auth routes while authenticated
    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Allow the request to proceed
    return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
