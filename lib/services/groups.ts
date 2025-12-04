import { db } from '../firebase';
import { collection, doc, addDoc, getDocs, getDoc, query, where, orderBy, limit, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';

export interface Group {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
    createdBy: string;
    membersCount: number;
    members: string[]; // Array of user IDs
    tags: string[];
    createdAt: string;
}

export interface CreateGroupData {
    name: string;
    description: string;
    image?: string;
    isPrivate: boolean;
    tags: string[];
    createdBy: string;
    members: string[];
    memberCount: number;
}

export async function createGroup(data: CreateGroupData): Promise<string> {
    try {
        const groupData = {
            ...data,
            imageUrl: data.image, // Map image to imageUrl
            createdAt: new Date().toISOString(),
        };
        // Remove 'image' key if it exists to avoid duplication/confusion
        delete (groupData as any).image;

        const docRef = await addDoc(collection(db, 'groups'), groupData);
        return docRef.id;
    } catch (error) {
        console.error('Error creating group:', error);
        throw error;
    }
}

export async function getGroups(limitCount: number = 20): Promise<Group[]> {
    try {
        const q = query(
            collection(db, 'groups'),
            orderBy('membersCount', 'desc'), // Popular groups first
            limit(limitCount)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Group));
    } catch (error) {
        console.error('Error getting groups:', error);
        return [];
    }
}

export async function getGroup(groupId: string): Promise<Group | null> {
    try {
        const docRef = doc(db, 'groups', groupId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Group;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting group:', error);
        return null;
    }
}

export async function joinGroup(userId: string, groupId: string): Promise<void> {
    try {
        const groupRef = doc(db, 'groups', groupId);

        await updateDoc(groupRef, {
            members: arrayUnion(userId),
            membersCount: increment(1),
        });
    } catch (error) {
        console.error('Error joining group:', error);
        throw error;
    }
}

export async function leaveGroup(userId: string, groupId: string): Promise<void> {
    try {
        const groupRef = doc(db, 'groups', groupId);

        await updateDoc(groupRef, {
            members: arrayRemove(userId),
            membersCount: increment(-1),
        });
    } catch (error) {
        console.error('Error leaving group:', error);
        throw error;
    }
}

export async function getUserGroups(userId: string): Promise<Group[]> {
    try {
        const q = query(
            collection(db, 'groups'),
            where('members', 'array-contains', userId)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Group));
    } catch (error) {
        console.error('Error getting user groups:', error);
        return [];
    }
}
