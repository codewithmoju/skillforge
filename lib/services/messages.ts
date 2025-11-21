import { db } from '../firebase';
import { collection, doc, addDoc, getDocs, query, where, orderBy, limit, updateDoc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';

export interface MessageReaction {
    emoji: string;
    userIds: string[];
    count: number;
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    text: string;
    createdAt: string;
    read: boolean;

    // Reactions support
    reactions?: Record<string, MessageReaction>;

    // Reply support
    replyTo?: {
        messageId: string;
        text: string;
        senderId: string;
        senderName: string;
    };

    // Edit tracking
    edited?: boolean;
    editedAt?: string;
}

export interface ParticipantDetails {
    name: string;
    photo?: string;
    online?: boolean;
    lastSeen?: string;
    typing?: boolean;
}

export interface Conversation {
    id: string;
    participants: string[]; // [userId1, userId2]
    lastMessage: string;
    lastMessageAt: string;
    lastMessageBy: string;

    // Track individual unread message IDs instead of counts
    unreadMessages: Record<string, string[]>; // { userId: [messageId1, messageId2] }

    participantDetails: Record<string, ParticipantDetails>;

    // Conversation stats
    stats?: {
        totalMessages: number;
        createdAt: string;
    };
}

export async function sendMessage(conversationId: string, senderId: string, text: string, replyTo?: Message['replyTo']): Promise<void> {
    try {
        const now = new Date().toISOString();

        // Add message
        const messageRef = await addDoc(collection(db, 'messages'), {
            conversationId,
            senderId,
            text,
            createdAt: now,
            read: false,
            ...(replyTo && { replyTo }),
        });

        // Update conversation
        const conversationRef = doc(db, 'conversations', conversationId);
        const conversationDoc = await getDoc(conversationRef);

        if (conversationDoc.exists()) {
            const data = conversationDoc.data() as Conversation;
            const unreadMessages = data.unreadMessages ? { ...data.unreadMessages } : {};

            // Add this message ID to unread array for other participants
            data.participants.forEach(p => {
                if (p !== senderId) {
                    if (!unreadMessages[p]) {
                        unreadMessages[p] = [];
                    }
                    unreadMessages[p].push(messageRef.id);
                }
            });

            // Update stats
            const stats = data.stats || { totalMessages: 0, createdAt: now };
            stats.totalMessages += 1;

            await updateDoc(conversationRef, {
                lastMessage: text,
                lastMessageAt: now,
                lastMessageBy: senderId,
                unreadMessages,
                stats,
            });
        }
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}

export async function createConversation(participants: string[], participantDetails: Record<string, ParticipantDetails>): Promise<string> {
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
        const initialUnreadMessages: Record<string, string[]> = {};
        participants.forEach(p => initialUnreadMessages[p] = []);

        await setDoc(docRef, {
            id: conversationId,
            participants,
            lastMessage: '',
            lastMessageAt: now,
            lastMessageBy: '',
            unreadMessages: initialUnreadMessages,
            participantDetails,
            stats: {
                totalMessages: 0,
                createdAt: now,
            },
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
            const unreadMessages = data.unreadMessages ? { ...data.unreadMessages } : {};

            if (unreadMessages[userId] && unreadMessages[userId].length > 0) {
                unreadMessages[userId] = [];
                await updateDoc(conversationRef, {
                    unreadMessages,
                });
            }
        }
    } catch (error) {
        console.error('Error marking messages as read:', error);
    }
}

// ============ REACTIONS ============

export async function addReaction(messageId: string, userId: string, emoji: string): Promise<void> {
    try {
        const messageRef = doc(db, 'messages', messageId);
        const messageDoc = await getDoc(messageRef);

        if (messageDoc.exists()) {
            const data = messageDoc.data() as Message;
            const reactions = data.reactions || {};

            if (!reactions[emoji]) {
                reactions[emoji] = { emoji, userIds: [], count: 0 };
            }

            if (!reactions[emoji].userIds.includes(userId)) {
                reactions[emoji].userIds.push(userId);
                reactions[emoji].count += 1;

                await updateDoc(messageRef, { reactions });
            }
        }
    } catch (error) {
        console.error('Error adding reaction:', error);
        throw error;
    }
}

export async function removeReaction(messageId: string, userId: string, emoji: string): Promise<void> {
    try {
        const messageRef = doc(db, 'messages', messageId);
        const messageDoc = await getDoc(messageRef);

        if (messageDoc.exists()) {
            const data = messageDoc.data() as Message;
            const reactions = data.reactions || {};

            if (reactions[emoji]) {
                reactions[emoji].userIds = reactions[emoji].userIds.filter(id => id !== userId);
                reactions[emoji].count = reactions[emoji].userIds.length;

                if (reactions[emoji].count === 0) {
                    delete reactions[emoji];
                }

                await updateDoc(messageRef, { reactions });
            }
        }
    } catch (error) {
        console.error('Error removing reaction:', error);
        throw error;
    }
}

// ============ TYPING INDICATORS ============

export async function updateTypingStatus(conversationId: string, userId: string, typing: boolean): Promise<void> {
    try {
        const conversationRef = doc(db, 'conversations', conversationId);
        const conversationDoc = await getDoc(conversationRef);

        if (conversationDoc.exists()) {
            const data = conversationDoc.data() as Conversation;
            const participantDetails = { ...data.participantDetails };

            if (participantDetails[userId]) {
                participantDetails[userId].typing = typing;
                await updateDoc(conversationRef, { participantDetails });
            }
        }
    } catch (error) {
        console.error('Error updating typing status:', error);
    }
}

// ============ ONLINE PRESENCE ============

export async function updateOnlineStatus(conversationId: string, userId: string, online: boolean): Promise<void> {
    try {
        const conversationRef = doc(db, 'conversations', conversationId);
        const conversationDoc = await getDoc(conversationRef);

        if (conversationDoc.exists()) {
            const data = conversationDoc.data() as Conversation;
            const participantDetails = { ...data.participantDetails };

            if (participantDetails[userId]) {
                participantDetails[userId].online = online;
                if (!online) {
                    participantDetails[userId].lastSeen = new Date().toISOString();
                }
                await updateDoc(conversationRef, { participantDetails });
            }
        }
    } catch (error) {
        console.error('Error updating online status:', error);
    }
}

// ============ MESSAGE EDITING ============

export async function editMessage(messageId: string, newText: string): Promise<void> {
    try {
        const messageRef = doc(db, 'messages', messageId);
        await updateDoc(messageRef, {
            text: newText,
            edited: true,
            editedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error editing message:', error);
        throw error;
    }
}

// ============ MESSAGE DELETION ============

export async function deleteMessage(conversationId: string, messageId: string): Promise<void> {
    try {
        const messageRef = doc(db, 'messages', messageId);
        await updateDoc(messageRef, {
            text: '[Message deleted]',
            edited: true,
            editedAt: new Date().toISOString(),
        });

        // Update conversation last message if this was the last message
        const conversationRef = doc(db, 'conversations', conversationId);
        const conversationDoc = await getDoc(conversationRef);

        if (conversationDoc.exists()) {
            const data = conversationDoc.data() as Conversation;
            if (data.lastMessage) {
                // Get the latest message
                const messagesQuery = query(
                    collection(db, 'messages'),
                    where('conversationId', '==', conversationId),
                    orderBy('createdAt', 'desc'),
                    limit(1)
                );
                const messagesSnapshot = await getDocs(messagesQuery);
                if (!messagesSnapshot.empty) {
                    const latestMessage = messagesSnapshot.docs[0].data() as Message;
                    await updateDoc(conversationRef, {
                        lastMessage: latestMessage.text,
                    });
                }
            }
        }
    } catch (error) {
        console.error('Error deleting message:', error);
        throw error;
    }
}
