import { auth } from '@/lib/firebase';
import { User } from 'firebase/auth';

/**
 * Get the current user's ID token for server-side authentication  
 * Note: This is a client-side helper
 */
export async function getServerAuthToken(): Promise<string | null> {
    try {
        if (typeof window !== 'undefined') {
            const match = document.cookie.match(new RegExp('(^| )__session=([^;]+)'));
            return match ? match[2] : null;
        }
        return null;
    } catch (error) {
        console.error('Error getting server auth token:', error);
        return null;
    }
}

/**
 * Set the authentication cookie when user logs in
 */
export async function setAuthCookie(user: User) {
    try {
        const idToken = await user.getIdToken();

        await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
        });
    } catch (error) {
        console.error('Error setting auth cookie:', error);
        throw error;
    }
}

/**
 * Clear the authentication cookie when user logs out
 */
export async function clearAuthCookie() {
    try {
        await fetch('/api/auth/session', { method: 'DELETE' });
    } catch (error) {
        console.error('Error clearing auth cookie:', error);
        throw error;
    }
}

/**
 * Verify ID token on the server side
 */
export async function verifyAuthToken(idToken: string): Promise<{ uid: string; email: string | null } | null> {
    try {
        const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
        if (!apiKey) {
            console.error('Firebase API key not configured');
            return null;
        }

        const response = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken }),
            }
        );

        if (!response.ok) return null;

        const data = await response.json();
        if (data.users && data.users.length > 0) {
            const user = data.users[0];
            return { uid: user.localId, email: user.email || null };
        }

        return null;
    } catch (error) {
        console.error('Error verifying auth token:', error);
        return null;
    }
}

/**
 * Get the current authenticated user from the request
 */
export async function getAuthUser(request: Request): Promise<{ uid: string; email: string | null } | null> {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }

        const idToken = authHeader.split('Bearer ')[1];
        return await verifyAuthToken(idToken);
    } catch (error) {
        console.error('Error getting auth user:', error);
        return null;
    }
}
