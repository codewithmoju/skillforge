
import { UserProgressDocument, createUserProgressDocument } from '@/lib/models/userProgress';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Get user progress from Firestore
 */
export async function getUserProgress(userId: string): Promise<UserProgressDocument | null> {
    try {
        const docRef = doc(db, 'userProgress', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as UserProgressDocument;
        }

        return null;
    } catch (error) {
        console.error('Error getting user progress:', error);
        return null;
    }
}

/**
 * Initialize user progress document
 */
export async function initializeUserProgress(userId: string): Promise<void> {
    try {
        const existing = await getUserProgress(userId);
        if (existing) {
            return; // Already initialized
        }

        const newProgress = createUserProgressDocument(userId);
        const docRef = doc(db, 'userProgress', userId);
        await setDoc(docRef, newProgress);
    } catch (error) {
        console.error('Error initializing user progress:', error);
        throw error;
    }
}

/**
 * Update roadmap progress in Firestore
 */
export async function updateRoadmapProgress(
    userId: string,
    roadmapId: string,
    data: {
        topic?: string;
        learningAreas?: any[];
        prerequisites?: string[];
        goal?: string;
        completedKeyPoints?: string[];
        completedSubtopics?: string[];
        roadmapDefinitions?: any[];
        roadmapProgress?: any;
    }
): Promise<void> {
    try {
        const docRef = doc(db, 'userProgress', userId);
        const updates: any = {
            roadmaps: {
                [roadmapId]: {
                    ...data,
                    updatedAt: serverTimestamp(),
                }
            },
            updatedAt: serverTimestamp(),
            lastSyncedAt: serverTimestamp(),
        };

        if (data.topic) {
            updates.currentTopic = data.topic;
        }

        await setDoc(docRef, updates, { merge: true });
    } catch (error) {
        console.error('Error updating roadmap progress:', error);
        throw error;
    }
}

/**
 * Update course progress in Firestore
 */
export async function updateCourseProgress(
    userId: string,
    courseId: string,
    data: {
        topic?: string;
        completedLessons?: string[];
        currentLesson?: string;
        progress?: number;
    }
): Promise<void> {
    try {
        const docRef = doc(db, 'userProgress', userId);
        const updates = {
            courses: {
                [courseId]: {
                    ...data,
                    courseId,
                    lastAccessed: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                }
            },
            updatedAt: serverTimestamp(),
            lastSyncedAt: serverTimestamp(),
        };
        await setDoc(docRef, updates, { merge: true });
    } catch (error) {
        console.error('Error updating course progress:', error);
        throw error;
    }
}

/**
 * Update user achievements
 */
export async function updateAchievements(
    userId: string,
    achievements: any[]
): Promise<void> {
    try {
        const docRef = doc(db, 'userProgress', userId);
        await setDoc(docRef, {
            achievements,
            updatedAt: serverTimestamp(),
            lastSyncedAt: serverTimestamp(),
        }, { merge: true });
    } catch (error) {
        console.error('Error updating achievements:', error);
        throw error;
    }
}

/**
 * Update user stats (XP, level, streak, etc.)
 */
export async function updateUserStats(
    userId: string,
    stats: {
        xp?: number;
        level?: number;
        streak?: number;
        totalLessonsCompleted?: number;
        completedRoadmaps?: number;
    }
): Promise<void> {
    try {
        const docRef = doc(db, 'userProgress', userId);
        await setDoc(docRef, {
            ...stats,
            updatedAt: serverTimestamp(),
            lastSyncedAt: serverTimestamp(),
        }, { merge: true });
    } catch (error) {
        console.error('Error updating user stats:', error);
        throw error;
    }
}

/**
 * Complete a lesson and update progress
 */
export async function completeLesson(
    userId: string,
    courseId: string,
    lessonId: string
): Promise<void> {
    try {
        const progress = await getUserProgress(userId);
        if (!progress) {
            throw new Error('User progress not initialized');
        }

        const courseProgress = progress.courses[courseId] || {
            completedLessons: [],
            progress: 0,
        };

        if (!courseProgress.completedLessons.includes(lessonId)) {
            courseProgress.completedLessons.push(lessonId);

            // Update progress percentage (you'd calculate based on total lessons)
            // For now, just increment total lessons completed
            await updateCourseProgress(userId, courseId, {
                completedLessons: courseProgress.completedLessons,
            });

            await updateUserStats(userId, {
                totalLessonsCompleted: (progress.totalLessonsCompleted || 0) + 1,
            });
        }
    } catch (error) {
        console.error('Error completing lesson:', error);
        throw error;
    }
}

/**
 * Delete roadmap progress from Firestore
 */
export async function deleteRoadmapProgress(userId: string): Promise<void> {
    try {
        const { deleteField } = await import('firebase/firestore');
        const docRef = doc(db, 'userProgress', userId);

        await updateDoc(docRef, {
            currentTopic: deleteField(),
            // We don't delete the history in 'roadmaps' map to preserve record of past attempts,
            // but removing currentTopic effectively "closes" the active roadmap in the UI.
        });
    } catch (error) {
        console.error('Error deleting roadmap progress:', error);
        // If document doesn't exist, that's fine, nothing to delete
    }
}
