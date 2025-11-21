import { db } from '../firebase';
import { collection, doc, addDoc, getDocs, query, where, orderBy, limit, updateDoc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    text: string;
    createdAt: string;
    read: boolean;
}

export interface Conversation {
    id: string;
    participants: string[]; // [userId1, userId2]
    lastMessage: string;
    lastMessageAt: string;
    lastMessageBy: string;
    unreadCount: Record<string, number>; // { userId: count }
    participantDetails: Record<string, { name: string; photo?: string }>;
}

export async function sendMessage(conversationId: string, senderId: string, text: string): Promise<void> {
    try {
        const now = new Date().toISOString();

        // Add message
        await addDoc(collection(db, 'messages'), {
            conversationId,
            senderId,
            text,
            createdAt: now,
            read: false,
        });

        // Update conversation
        const conversationRef = doc(db, 'conversations', conversationId);
        const conversationDoc = await getDoc(conversationRef);

        if (conversationDoc.exists()) {
            const data = conversationDoc.data() as Conversation;
            const unreadCount = { ...data.unreadCount };

            // Increment unread count for other participants
            data.participants.forEach(p => {
                if (p !== senderId) {
                    unreadCount[p] = (unreadCount[p] || 0) + 1;
                }
            });

            await updateDoc(conversationRef, {
                lastMessage: text,
                lastMessageAt: now,
                lastMessageBy: senderId,
                unreadCount,
            });
        }
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}

export async function createConversation(participants: string[], participantDetails: Record<string, { name: string; photo?: string }>): Promise<string> {
    try {
        // Check if conversation already exists
        // This is tricky with Firestore, usually we use a deterministic ID or query
        // For 1-on-1, we can sort IDs and join them
        const sortedIds = [...participants].sort();
        const conversationId = sortedIds.join('_');

        const docRef = doc(db, 'conversations', conversationId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return conversationId;
        }

        const now = new Date().toISOString();
        const initialUnreadCount: Record<string, number> = {};
        participants.forEach(p => initialUnreadCount[p] = 0);

        await setDoc(docRef, {
            id: conversationId,
            participants,
            lastMessage: '',
            lastMessageAt: now,
            lastMessageBy: '',
            unreadCount: initialUnreadCount,
            participantDetails,
        });

        return conversationId;
    } catch (error) {
        console.error('Error creating conversation:', error);
        throw error;
    }
}

export function subscribeToConversations(userId: string, callback: (conversations: Conversation[]) => void) {
    const q = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', userId),
        orderBy('lastMessageAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
        const conversations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Conversation));
        callback(conversations);
    });
}

export function subscribeToMessages(conversationId: string, callback: (messages: Message[]) => void) {
    const q = query(
        collection(db, 'messages'),
        where('conversationId', '==', conversationId),
        orderBy('createdAt', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
        callback(messages);
    });
}

export async function markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    try {
        const conversationRef = doc(db, 'conversations', conversationId);
        const conversationDoc = await getDoc(conversationRef);

        if (conversationDoc.exists()) {
            const data = conversationDoc.data() as Conversation;
            const unreadCount = { ...data.unreadCount };

            if (unreadCount[userId] > 0) {
                unreadCount[userId] = 0;
                await updateDoc(conversationRef, {
                    unreadCount,
                });
            }
        }
    } catch (error) {
        console.error('Error marking messages as read:', error);
    }
}
