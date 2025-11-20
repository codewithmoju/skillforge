import { db } from '../firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

export async function checkUsernameAvailability(username: string): Promise<boolean> {
    try {
        const usernameDoc = await getDoc(doc(db, 'usernames', username.toLowerCase()));
        return !usernameDoc.exists();
    } catch (error) {
        console.error('Error checking username:', error);
        return false;
    }
}

export async function reserveUsername(username: string, uid: string): Promise<void> {
    try {
        await setDoc(doc(db, 'usernames', username.toLowerCase()), {
            uid,
            createdAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error reserving username:', error);
        throw error;
    }
}

export async function releaseUsername(username: string): Promise<void> {
    try {
        await deleteDoc(doc(db, 'usernames', username.toLowerCase()));
    } catch (error) {
        console.error('Error releasing username:', error);
        throw error;
    }
}

export function validateUsername(username: string): { valid: boolean; error?: string } {
    if (!username || username.length < 3) {
        return { valid: false, error: 'Username must be at least 3 characters' };
    }

    if (username.length > 20) {
        return { valid: false, error: 'Username must be less than 20 characters' };
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return { valid: false, error: 'Username can only contain letters, numbers, and underscores' };
    }

    return { valid: true };
}
