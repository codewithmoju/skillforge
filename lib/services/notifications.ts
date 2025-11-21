import { db } from '../firebase';
import { collection, doc, addDoc, getDocs, query, where, orderBy, limit, updateDoc, Timestamp } from 'firebase/firestore';

export interface Notification {
    id: string;
    userId: string; // Recipient
    type: 'follow' | 'like' | 'comment' | 'mention';
    fromUserId: string;
    fromUserName: string;
    fromUserPhoto?: string;
    postId?: string; // For like/comment/mention
    read: boolean;
    createdAt: string;
}

export async function createNotification(
    userId: string,
    type: Notification['type'],
    fromUserId: string,
    fromUserName: string,
    fromUserPhoto?: string,
    postId?: string
): Promise<void> {
    try {
        // Don't notify if user is notifying themselves
        if (userId === fromUserId) return;

        const notificationData = {
            userId,
            type,
            fromUserId,
            fromUserName,
            fromUserPhoto: fromUserPhoto || '',
            postId: postId || null,
            read: false,
            createdAt: new Date().toISOString(),
        };

        await addDoc(collection(db, 'notifications'), notificationData);
    } catch (error) {
        console.error('Error creating notification:', error);
        // Don't throw error to avoid blocking the main action
    }
}

export async function getNotifications(userId: string, limitCount: number = 20): Promise<Notification[]> {
    try {
        const q = query(
            collection(db, 'notifications'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
    } catch (error) {
        console.error('Error getting notifications:', error);
        return [];
    }
}

export async function markAsRead(notificationId: string): Promise<void> {
    try {
        await updateDoc(doc(db, 'notifications', notificationId), {
            read: true,
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
}

export async function markAllAsRead(userId: string): Promise<void> {
    try {
        const q = query(
            collection(db, 'notifications'),
            where('userId', '==', userId),
            where('read', '==', false)
        );
        const snapshot = await getDocs(q);

        const batch = [];
        snapshot.docs.forEach(doc => {
            updateDoc(doc.ref, { read: true });
        });

        // Note: For large numbers, use batch writes. For now, individual updates are okay-ish but parallelized.
        await Promise.all(snapshot.docs.map(doc => updateDoc(doc.ref, { read: true })));
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        throw error;
    }
}
