import { useState, useEffect } from 'react';
import {
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile,
    signOut,
    onAuthStateChanged,
    User
} from 'firebase/auth';
import { auth } from '../firebase';
import { useUserStore } from '../store';
import { setAuthCookie, clearAuthCookie } from '../auth/authHelpers';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { setUserName } = useUserStore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser?.displayName) {
                setUserName(currentUser.displayName);
            }

            // Set or clear session cookie based on auth state
            if (currentUser) {
                try {
                    await setAuthCookie(currentUser);
                } catch (error) {
                    console.error('Failed to set auth cookie:', error);
                }
            } else {
                try {
                    await clearAuthCookie();
                } catch (error) {
                    console.error('Failed to clear auth cookie:', error);
                }
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [setUserName]);

    const loginWithGoogle = async () => {
        setError(null);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            // Session cookie will be set by onAuthStateChanged
            return result;
        } catch (err: any) {
            setError(err.message || "Failed to login with Google");
            throw err;
        }
    };

    const signUpWithEmail = async (email: string, password: string, displayName: string) => {
        setError(null);
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            // Update profile with display name
            if (result.user) {
                await updateProfile(result.user, { displayName });
                setUserName(displayName);
            }
            // Session cookie will be set by onAuthStateChanged
            return result;
        } catch (err: any) {
            const errorMessage = err.code === 'auth/email-already-in-use'
                ? 'Email already in use'
                : err.code === 'auth/weak-password'
                    ? 'Password should be at least 6 characters'
                    : err.message || 'Failed to create account';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const loginWithEmail = async (email: string, password: string) => {
        setError(null);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            // Session cookie will be set by onAuthStateChanged
            return result;
        } catch (err: any) {
            const errorMessage = err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password'
                ? 'Invalid email or password'
                : err.message || 'Failed to login';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const resetPassword = async (email: string) => {
        setError(null);
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (err: any) {
            const errorMessage = err.code === 'auth/user-not-found'
                ? 'No account found with this email'
                : err.message || 'Failed to send reset email';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const logout = async () => {
        setError(null);
        try {
            await signOut(auth);
            await clearAuthCookie();
        } catch (err: any) {
            setError(err.message || "Failed to logout");
            throw err;
        }
    };

    return {
        user,
        loading,
        error,
        loginWithGoogle,
        signUpWithEmail,
        loginWithEmail,
        resetPassword,
        logout
    };
}
