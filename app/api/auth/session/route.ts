import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth/authHelpers';

const SESSION_COOKIE_NAME = '__session';
const MAX_AGE = 60 * 60 * 24 * 5; // 5 days

/**
 * POST /api/auth/session - Set authentication session cookie
 */
export async function POST(request: NextRequest) {
    try {
        const { idToken } = await request.json();

        if (!idToken) {
            return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
        }

        const user = await verifyAuthToken(idToken);
        if (!user) {
            return NextResponse.json({ error: 'Invalid ID token' }, { status: 401 });
        }

        const response = NextResponse.json({ success: true, uid: user.uid });
        response.cookies.set(SESSION_COOKIE_NAME, idToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: MAX_AGE,
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Error setting session:', error);
        return NextResponse.json({ error: 'Failed to set session' }, { status: 500 });
    }
}

/**
 * DELETE /api/auth/session - Clear authentication session cookie
 */
export async function DELETE() {
    try {
        const response = NextResponse.json({ success: true });
        response.cookies.delete(SESSION_COOKIE_NAME);
        return response;
    } catch (error) {
        console.error('Error clearing session:', error);
        return NextResponse.json({ error: 'Failed to clear session' }, { status: 500 });
    }
}

/**
 * GET /api/auth/session - Verify current session
 */
export async function GET(request: NextRequest) {
    try {
        const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

        if (!sessionCookie) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        const user = await verifyAuthToken(sessionCookie.value);
        if (!user) {
            const response = NextResponse.json({ authenticated: false }, { status: 401 });
            response.cookies.delete(SESSION_COOKIE_NAME);
            return response;
        }

        return NextResponse.json({
            authenticated: true,
            uid: user.uid,
            email: user.email,
        });
    } catch (error) {
        console.error('Error verifying session:', error);
        return NextResponse.json({ error: 'Failed to verify session' }, { status: 500 });
    }
}
