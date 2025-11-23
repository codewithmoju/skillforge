import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { UserState } from '../store';
import { Achievement, shouldIncrementStreak, shouldResetStreak } from '../utils/achievements';
import { updateLeaderboard } from './leaderboard';

export interface FirestoreUserData {
    uid: string;
    email: string;
    name: string;
    username: string;
    bio?: string;
    profilePicture?: string;
    website?: string;
    location?: string;
    occupation?: string;
    phone?: string;
    isPrivate: boolean;
    followers: number;
    following: number;
    postsCount: number;
    xp: number;
    level: number;
    streak: number;
    lastActive: string;
    roadmapDefinitions: any[];
    roadmapProgress: Record<string, any>;
    currentTopic: string | null;
    projects: any[];
    achievements: string[];
    totalLessonsCompleted: number;
    completedRoadmaps: number;
    createdAt: string;
    updatedAt: string;
    profileComplete: boolean;
}

export async function getUserData(uid: string): Promise<FirestoreUserData | null> {
    try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
            return userDoc.data() as FirestoreUserData;
        }
        return null;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

export async function createUserData(uid: string, email: string, name: string, username?: string, profilePicture?: string): Promise<void> {
    try {
        const now = new Date().toISOString();
        const initialData: FirestoreUserData = {
            uid,
            email,
            name,
            username: username || '',
            bio: '',
            profilePicture: profilePicture || '',
            isPrivate: false,
            followers: 0,
            following: 0,
            postsCount: 0,
            xp: 0,
            level: 1,
            streak: 0,
            lastActive: now,
            roadmapDefinitions: [],
            roadmapProgress: {},
            currentTopic: null,
            projects: [],
            achievements: [],
            totalLessonsCompleted: 0,
            completedRoadmaps: 0,
            createdAt: now,
            updatedAt: now,
            profileComplete: !!username,
        };
        await setDoc(doc(db, 'users', uid), initialData);

        // Initialize leaderboard entry
        await updateLeaderboard(uid, name, 0, 1, 0);
    } catch (error) {
        console.error('Error creating user data:', error);
        throw error;
    }
}

export async function updateUserData(uid: string, data: Partial<UserState> & { achievements?: string[], totalLessonsCompleted?: number, completedRoadmaps?: number, username?: string, bio?: string, profilePicture?: string, website?: string, location?: string, occupation?: string, phone?: string, isPrivate?: boolean, profileComplete?: boolean }): Promise<void> {
    try {
        const now = new Date().toISOString();

        // Get current data to check streak
        const currentData = await getUserData(uid);
        let newStreak = data.streak || currentData?.streak || 0;

        if (currentData) {
            if (shouldResetStreak(currentData.lastActive)) {
                newStreak = 1; // Reset to 1 (today)
            } else if (shouldIncrementStreak(currentData.lastActive)) {
                newStreak = (currentData.streak || 0) + 1;
            } else {
                newStreak = currentData.streak || 0; // Maintain current streak
            }
        }

        const updateData = {
            ...data,
            streak: newStreak,
            updatedAt: now,
            lastActive: now,
        };

        await updateDoc(doc(db, 'users', uid), updateData);

        // Update leaderboard if XP or level changed
        if (data.xp !== undefined || data.level !== undefined || newStreak !== currentData?.streak) {
            await updateLeaderboard(
                uid,
                data.name || currentData?.name || 'User',
                data.xp || currentData?.xp || 0,
                data.level || currentData?.level || 1,
                newStreak
            );
        }
    } catch (error) {
        console.error('Error updating user data:', error);
        throw error;
    }
}

export async function syncUserData(uid: string, localData: Partial<UserState>): Promise<void> {
    try {
        const firestoreData = await getUserData(uid);

        if (!firestoreData) {
            // First time user - create with local data or defaults
            await createUserData(
                uid,
                localData.name || 'User',
                localData.name || 'User'
            );
            // Update with any local data
            if (Object.keys(localData).length > 0) {
                await updateUserData(uid, localData);
            }
        } else {
            // Existing user - merge local changes with Firestore
            const mergedData = {
                ...localData,
                // Preserve Firestore data for critical fields
                createdAt: firestoreData.createdAt,
            };
            await updateUserData(uid, mergedData);
        }
    } catch (error) {
        console.error('Error syncing user data:', error);
        throw error;
    }
}

export async function exportUserData(uid: string): Promise<string> {
    try {
        const data = await getUserData(uid);
        if (!data) throw new Error('User data not found');

        return JSON.stringify(data, null, 2);
    } catch (error) {
        console.error('Error exporting user data:', error);
        throw error;
    }
}

export async function importUserData(uid: string, jsonData: string): Promise<void> {
    try {
        const data = JSON.parse(jsonData) as Partial<FirestoreUserData>;

        // Preserve critical fields
        const currentData = await getUserData(uid);
        if (!currentData) throw new Error('User not found');

        const importData = {
            ...data,
            uid: currentData.uid, // Never change UID
            email: currentData.email, // Never change email
            createdAt: currentData.createdAt, // Never change creation date
            updatedAt: new Date().toISOString(),
            lastActive: new Date().toISOString(),
        };

        await setDoc(doc(db, 'users', uid), importData);
    } catch (error) {
        console.error('Error importing user data:', error);
        throw error;
    }
}

export async function getUserByUsername(username: string): Promise<FirestoreUserData | null> {
    try {
        // First get UID from usernames collection
        const usernameDoc = await getDoc(doc(db, 'usernames', username.toLowerCase()));
        if (!usernameDoc.exists()) return null;

        const uid = usernameDoc.data().uid;
        return await getUserData(uid);
    } catch (error) {
        console.error('Error getting user by username:', error);
        return null;
    }
}

export async function searchUsers(queryText: string, limitCount: number = 10): Promise<FirestoreUserData[]> {
    try {
        const usersRef = collection(db, 'users');
        const lowerCaseQuery = queryText.toLowerCase();

        // Search by username (prefix match)
        const qUsername = query(
            usersRef,
            where('username', '>=', lowerCaseQuery),
            where('username', '<=', lowerCaseQuery + '\uf8ff'),
            limit(limitCount)
        );
        const usernameSnapshot = await getDocs(qUsername);
        let users = usernameSnapshot.docs.map(doc => doc.data() as FirestoreUserData);

        // If not enough results, also search by name (prefix match)
        if (users.length < limitCount) {
            const qName = query(
                usersRef,
                where('name', '>=', queryText),
                where('name', '<=', queryText + '\uf8ff'),
                limit(limitCount)
            );
            const nameSnapshot = await getDocs(qName);
            const nameUsers = nameSnapshot.docs.map(doc => doc.data() as FirestoreUserData);

            // Merge and deduplicate
            const existingUids = new Set(users.map(u => u.uid));
            nameUsers.forEach(u => {
                if (!existingUids.has(u.uid)) {
                    users.push(u);
                }
            });
        }

        return users.slice(0, limitCount);
    } catch (error) {
        console.error('Error searching users:', error);
        return [];
    }
}