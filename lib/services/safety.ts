import { db } from '../firebase';
import { collection, doc, setDoc, deleteDoc, getDoc, getDocs, query, where } from 'firebase/firestore';

export interface BlockedUser {
    blockedUserId: string;
    blockedAt: string;
}

/**
 * Block a user
 */
export async function blockUser(userId: string, blockedUserId: string): Promise<void> {
    try {
        const blockId = `${userId}_${blockedUserId}`;
        await setDoc(doc(db, 'blockedUsers', blockId), {
            userId,
            blockedUserId,
            blockedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error blocking user:', error);
        throw error;
    }
}

/**
 * Unblock a user
 */
export async function unblockUser(userId: string, blockedUserId: string): Promise<void> {
    try {
        const blockId = `${userId}_${blockedUserId}`;
        await deleteDoc(doc(db, 'blockedUsers', blockId));
    } catch (error) {
        console.error('Error unblocking user:', error);
        throw error;
    }
}

/**
 * Check if a user is blocked
 */
export async function isUserBlocked(userId: string, blockedUserId: string): Promise<boolean> {
    try {
        const blockId = `${userId}_${blockedUserId}`;
        const docSnap = await getDoc(doc(db, 'blockedUsers', blockId));
        return docSnap.exists();
    } catch (error) {
        console.error('Error checking blocked status:', error);
        return false;
    }
}

/**
 * Get all blocked users for a user
 */
export async function getBlockedUsers(userId: string): Promise<string[]> {
    try {
        const q = query(
            collection(db, 'blockedUsers'),
            where('userId', '==', userId)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data().blockedUserId);
    } catch (error) {
        console.error('Error getting blocked users:', error);
        return [];
    }
}

/**
 * Report content (post, comment, user)
 */
export async function reportContent(
    reporterId: string,
    contentType: 'post' | 'comment' | 'user' | 'discussion',
    contentId: string,
    reason: string,
    details?: string
): Promise<string> {
    try {
        const reportRef = doc(collection(db, 'reports'));
        await setDoc(reportRef, {
            reporterId,
            contentType,
            contentId,
            reason,
            details: details || '',
            status: 'pending',
            createdAt: new Date().toISOString(),
        });
        return reportRef.id;
    } catch (error) {
        console.error('Error reporting content:', error);
        throw error;
    }
}
