import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const session = request.cookies.get('__session');

    // Protected routes pattern
    const protectedPaths = ['/dashboard', '/roadmap', '/courses', '/profile', '/settings'];
    const isProtected = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));

    if (isProtected && !session) {
        const loginUrl = new URL('/login', request.url);
        // Add the original URL as a query param to redirect back after login
        loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/roadmap/:path*',
        '/courses/:path*',
        '/profile/:path*',
        '/settings/:path*',
    ],
};
