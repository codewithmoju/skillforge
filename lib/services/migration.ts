import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { updateCourseProgress, updateRoadmapProgress, updateAchievements, updateUserStats } from './userProgress';

export async function migrateLocalStorageToFirestore(userId: string) {
    if (typeof window === 'undefined') return;

    try {
        console.log('Checking migration status...');
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        // If migration flag exists, skip
        if (userDoc.exists() && userDoc.data().migrationCompleted) {
            console.log('Migration already completed.');
            return;
        }

        console.log('Starting migration from localStorage to Firestore...');

        // 1. Migrate Course Progress
        // Look for keys like 'progress-{slug}'
        const courseKeys = Object.keys(localStorage).filter(key => key.startsWith('progress-'));
        for (const key of courseKeys) {
            try {
                const courseId = key.replace('progress-', '');
                const rawData = localStorage.getItem(key);
                if (!rawData) continue;

                const completedLessons = JSON.parse(rawData);
                if (Array.isArray(completedLessons) && completedLessons.length > 0) {
                    console.log(`Migrating course ${courseId}...`);
                    await updateCourseProgress(userId, courseId, {
                        completedLessons,
                        // We don't have exact progress % here, but completedLessons is the source of truth
                    });
                }
            } catch (e) {
                console.error(`Failed to migrate course key ${key}`, e);
            }
        }

        // 2. Migrate Active Roadmap
        try {
            const roadmapData = localStorage.getItem('roadmap-data');
            const roadmapProgress = localStorage.getItem('roadmap-progress');

            if (roadmapData) {
                const roadmap = JSON.parse(roadmapData);
                const progress = roadmapProgress ? JSON.parse(roadmapProgress) : {};

                // Use a generic ID or the topic as ID if available, otherwise 'current'
                const roadmapId = roadmap.topic ? roadmap.topic.toLowerCase().replace(/\s+/g, '-') : 'current-roadmap';

                console.log(`Migrating roadmap ${roadmapId}...`);
                await updateRoadmapProgress(userId, roadmapId, {
                    topic: roadmap.topic,
                    roadmapDefinitions: roadmap.roadmap, // Assuming the structure matches
                    roadmapProgress: progress,
                    // Add other fields if necessary
                });
            }
        } catch (e) {
            console.error('Failed to migrate roadmap', e);
        }

        // 3. Migrate User Stats & Achievements (from Zustand persistence)
        try {
            const storage = localStorage.getItem('skillforge-storage');
            if (storage) {
                const parsed = JSON.parse(storage);
                const state = parsed.state;

                if (state) {
                    console.log('Migrating user stats and achievements...');

                    // Update Stats
                    await updateUserStats(userId, {
                        xp: state.xp || 0,
                        level: state.level || 1,
                        streak: state.streakData?.currentStreak || 0,
                        // Add other stats if available in state
                    });

                    // Update Achievements
                    if (state.achievements && Array.isArray(state.achievements)) {
                        await updateAchievements(userId, state.achievements);
                    }
                }
            }
        } catch (e) {
            console.error('Failed to migrate store data', e);
        }

        // Mark migration as complete
        await setDoc(userRef, {
            migrationCompleted: true,
            migrationDate: serverTimestamp()
        }, { merge: true });

        console.log('Migration completed successfully.');

    } catch (error) {
        console.error('Migration failed:', error);
    }
}
