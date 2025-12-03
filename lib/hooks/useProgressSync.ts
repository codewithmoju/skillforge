import { useUserStore } from '@/lib/store';
import {
    getUserProgress,
    initializeUserProgress,
    updateRoadmapProgress,
    updateCourseProgress,
    updateAchievements,
    updateUserStats,
} from '@/lib/services/userProgress';
import { useAuth } from '@/lib/hooks/useAuth';

/**
 * Custom hook to sync Zustand store with Firestore
 * This replaces the current localStorage-only persistence
 */
export function useProgressSync() {
    const { user } = useAuth();
    const store = useUserStore();

    /**
     * Load progress from Firestore on mount
     */
    const loadFromFirestore = async () => {
        if (!user) return;

        try {
            let progress = await getUserProgress(user.uid);

            // Initialize if doesn't exist
            if (!progress) {
                await initializeUserProgress(user.uid);
                progress = await getUserProgress(user.uid);
            }

            if (!progress) return;

            // Sync Firestore data to Zustand store
            if (progress.currentTopic) {
                store.setRoadmap(
                    progress.currentTopic,
                    progress.roadmaps[progress.currentTopic]?.roadmapDefinitions || [],
                    '',
                    progress.roadmaps[progress.currentTopic]?.learningAreas || [],
                    progress.roadmaps[progress.currentTopic]?.prerequisites || [],
                    progress.roadmaps[progress.currentTopic]?.goal || ''
                );
            }

            // Update XP and level
            if (progress.xp !== store.xp) {
                store.addXP(progress.xp - store.xp);
            }

            // Update achievements
            if (progress.achievements) {
                // You'll need to add a setAchievements method to your store
                // store.setAchievements(progress.achievements);
            }
        } catch (error) {
            console.error('Error loading progress from Firestore:', error);
        }
    };

    /**
     * Sync roadmap changes to Firestore
     */
    const syncRoadmap = async () => {
        if (!user || !store.currentTopic) return;

        try {
            await updateRoadmapProgress(user.uid, store.currentTopic, {
                topic: store.currentTopic,
                learningAreas: store.learningAreas,
                prerequisites: store.prerequisites,
                goal: store.roadmapGoal,
                completedKeyPoints: store.completedKeyPoints,
                roadmapDefinitions: store.roadmapDefinitions,
                roadmapProgress: store.roadmapProgress,
            });
        } catch (error) {
            console.error('Error syncing roadmap to Firestore:', error);
        }
    };

    /**
     * Sync XP and stats to Firestore
     */
    const syncStats = async () => {
        if (!user) return;

        try {
            await updateUserStats(user.uid, {
                xp: store.xp,
                level: calculateUserLevel(store.xp).level,
                streak: store.streakData.currentStreak,
            });
        } catch (error) {
            console.error('Error syncing stats to Firestore:', error);
        }
    };

    return {
        loadFromFirestore,
        syncRoadmap,
        syncStats,
    };
}

// Utility function (you may already have this)
function calculateUserLevel(xp: number) {
    const level = Math.floor(xp / 1000) + 1;
    return { level };
}
