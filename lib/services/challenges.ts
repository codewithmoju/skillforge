import { db } from '../firebase';
import { collection, doc, addDoc, getDocs, getDoc, query, where, orderBy, limit, updateDoc, increment, arrayUnion } from 'firebase/firestore';

export interface Challenge {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    participantsCount: number;
    participants: string[]; // Array of user IDs
    xpReward: number;
    imageUrl?: string;
    status: 'upcoming' | 'active' | 'completed';
    type: 'coding' | 'design' | 'learning';
}

export async function getChallenges(status?: Challenge['status']): Promise<Challenge[]> {
    try {
        let q;
        if (status) {
            q = query(
                collection(db, 'challenges'),
                where('status', '==', status),
                orderBy('endDate', 'asc')
            );
        } else {
            q = query(
                collection(db, 'challenges'),
                orderBy('endDate', 'desc')
            );
        }

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Challenge));
    } catch (error) {
        console.error('Error getting challenges:', error);
        return [];
    }
}

export async function getChallenge(challengeId: string): Promise<Challenge | null> {
    try {
        const docRef = doc(db, 'challenges', challengeId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Challenge;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting challenge:', error);
        return null;
    }
}

export async function joinChallenge(userId: string, challengeId: string): Promise<void> {
    try {
        const challengeRef = doc(db, 'challenges', challengeId);

        await updateDoc(challengeRef, {
            participants: arrayUnion(userId),
            participantsCount: increment(1),
        });
    } catch (error) {
        console.error('Error joining challenge:', error);
        throw error;
    }
}

// Helper function to seed some initial challenges if none exist
export async function seedChallenges(): Promise<void> {
    try {
        const snapshot = await getDocs(collection(db, 'challenges'));
        if (!snapshot.empty) return;

        const challenges = [
            {
                title: "30 Days of Code",
                description: "Commit code every day for 30 days. Build a habit and improve your skills.",
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                participantsCount: 0,
                participants: [],
                xpReward: 500,
                status: 'active',
                type: 'coding'
            },
            {
                title: "UI Design Sprint",
                description: "Design 5 different landing pages in one week. Focus on aesthetics and usability.",
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                participantsCount: 0,
                participants: [],
                xpReward: 300,
                status: 'active',
                type: 'design'
            },
            {
                title: "React Mastery",
                description: "Complete the Advanced React course and build a final project.",
                startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                participantsCount: 0,
                participants: [],
                xpReward: 1000,
                status: 'upcoming',
                type: 'learning'
            }
        ];

        for (const challenge of challenges) {
            await addDoc(collection(db, 'challenges'), challenge);
        }
    } catch (error) {
        console.error('Error seeding challenges:', error);
    }
}
