import { db } from '../firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

export interface LeaderboardEntry {
    uid: string;
    name: string;
    xp: number;
    level: number;
    streak: number;
    updatedAt: string;
}

export async function updateLeaderboard(uid: string, name: string, xp: number, level: number, streak: number): Promise<void> {
    try {
        await setDoc(doc(db, 'leaderboard', uid), {
            uid,
            name,
            xp,
            level,
            streak,
            updatedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error updating leaderboard:', error);
    }
}

export async function getTopLeaderboard(limitCount: number = 100): Promise<LeaderboardEntry[]> {
    try {
        const q = query(
            collection(db, 'leaderboard'),
            orderBy('xp', 'desc'),
            limit(limitCount)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as LeaderboardEntry);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
    }
}

export async function getUserRank(uid: string): Promise<number> {
    try {
        const leaderboard = await getTopLeaderboard(1000);
        const index = leaderboard.findIndex(entry => entry.uid === uid);
        return index !== -1 ? index + 1 : -1;
    } catch (error) {
        console.error('Error getting user rank:', error);
        return -1;
    }
}
