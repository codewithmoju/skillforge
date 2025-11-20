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

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { setUserName } = useUserStore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser?.displayName) {
                setUserName(currentUser.displayName);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [setUserName]);

    const loginWithGoogle = async () => {
        setError(null);
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
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
            await signInWithEmailAndPassword(auth, email, password);
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
