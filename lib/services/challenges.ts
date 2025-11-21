import { db } from '@/lib/firebase';
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    Timestamp
} from 'firebase/firestore';

export interface DailyChallenge {
    id: string;
    title: string;
    description: string;
    target: number;
    progress: number;
    completed: boolean;
    xpReward: number;
    type: 'message_count' | 'reaction_count' | 'new_conversation';
}

export interface UserDailyChallenges {
    userId: string;
    date: string; // YYYY-MM-DD
    challenges: DailyChallenge[];
    lastUpdated: Timestamp;
}

const CHALLENGE_TEMPLATES: Omit<DailyChallenge, 'progress' | 'completed'>[] = [
    {
        id: 'daily_msg_5',
        title: 'Social Butterfly',
        description: 'Send 5 messages today',
        target: 5,
        xpReward: 50,
        type: 'message_count'
    },
    {
        id: 'daily_react_3',
        title: 'Express Yourself',
        description: 'React to 3 messages',
        target: 3,
        xpReward: 30,
        type: 'reaction_count'
    },
    {
        id: 'daily_new_conv',
        title: 'New Connections',
        description: 'Start a new conversation',
        target: 1,
        xpReward: 100,
        type: 'new_conversation'
    }
];

export async function getDailyChallenges(userId: string): Promise<DailyChallenge[]> {
    const today = new Date().toISOString().split('T')[0];
    const docId = `${userId}_${today}`;
    const docRef = doc(db, 'dailyChallenges', docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data().challenges as DailyChallenge[];
    }

    // Create new challenges for today
    const newChallenges: DailyChallenge[] = CHALLENGE_TEMPLATES.map(t => ({
        ...t,
        progress: 0,
        completed: false
    }));

    await setDoc(docRef, {
        userId,
        date: today,
        challenges: newChallenges,
        lastUpdated: Timestamp.now()
    });

    return newChallenges;
}

export async function updateChallengeProgress(
    userId: string,
    type: DailyChallenge['type'],
    incrementBy: number = 1
): Promise<{ xpGained: number; completedChallenges: DailyChallenge[] }> {
    const today = new Date().toISOString().split('T')[0];
    const docId = `${userId}_${today}`;
    const docRef = doc(db, 'dailyChallenges', docId);

    // We need to read first to update correctly
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
        await getDailyChallenges(userId); // Initialize if missing
        return updateChallengeProgress(userId, type, incrementBy); // Retry
    }

    const data = docSnap.data() as UserDailyChallenges;
    let xpGained = 0;
    const completedChallenges: DailyChallenge[] = [];

    const updatedChallenges = data.challenges.map(challenge => {
        if (challenge.type === type && !challenge.completed) {
            const newProgress = Math.min(challenge.progress + incrementBy, challenge.target);
            const isCompleted = newProgress >= challenge.target;

            if (isCompleted) {
                xpGained += challenge.xpReward;
                completedChallenges.push({ ...challenge, progress: newProgress, completed: true });
                return { ...challenge, progress: newProgress, completed: true };
            }

            return { ...challenge, progress: newProgress };
        }
        return challenge;
    });

    if (xpGained > 0 || updatedChallenges !== data.challenges) {
        await updateDoc(docRef, {
            challenges: updatedChallenges,
            lastUpdated: Timestamp.now()
        });
    }

    return { xpGained, completedChallenges };
}
