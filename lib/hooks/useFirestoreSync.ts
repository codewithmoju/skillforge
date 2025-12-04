"use client";

import { useEffect, useRef, useState } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';
import { useUserStore } from '../store';
import { getUserData, createUserData, updateUserData } from '../services/firestore';

export function useFirestoreSync() {
    const { user } = useAuth();
    const store = useUserStore();
    const syncedRef = useRef(false);
    const lastSyncRef = useRef<string>('');
    const [needsProfileCompletion, setNeedsProfileCompletion] = useState(false);

    // Load user data from Firestore when user logs in and listen for updates
    useEffect(() => {
        if (!user) return;

        const unsubscribe = onSnapshot(doc(db, 'users', user.uid), async (docSnap: any) => {
            if (docSnap.exists()) {
                const firestoreData = docSnap.data();

                // Check if profile is complete
                if (!firestoreData.profileComplete) {
                    setNeedsProfileCompletion(true);
                    // Don't return here, we might still want to sync other data or keep listening
                } else {
                    setNeedsProfileCompletion(false);
                }

                // Only load data into store if we haven't synced yet or if it's a remote update
                if (!syncedRef.current) {
                    // Sync Roadmap
                    if (firestoreData.currentTopic && firestoreData.roadmaps?.[firestoreData.currentTopic]) {
                        store.loadRoadmap(firestoreData.roadmaps[firestoreData.currentTopic]);
                    }

                    // Sync Achievements
                    if (firestoreData.achievements) {
                        store.loadAchievements(firestoreData.achievements);
                    }

                    store.loadUserData({
                        xp: firestoreData.xp,
                        level: firestoreData.level,
                        streakData: firestoreData.streakData || {
                            currentStreak: firestoreData.streak || 0,
                            longestStreak: 0,
                            lastActivityDate: new Date(),
                            multiplier: 1.0,
                        },
                        name: firestoreData.name,
                        projects: firestoreData.projects,
                        // roadmapProgress: firestoreData.roadmapProgress, // Legacy
                        // roadmapDefinitions: firestoreData.roadmapDefinitions, // Legacy
                        currentTopic: firestoreData.currentTopic || "",
                        totalLessonsCompleted: firestoreData.totalLessonsCompleted || 0,
                        totalRoadmapsCompleted: firestoreData.totalRoadmapsCompleted || firestoreData.completedRoadmaps || 0,
                    });
                    syncedRef.current = true;
                }
            } else {
                // New user - create Firestore document
                if (!syncedRef.current) {
                    await createUserData(
                        user.uid,
                        user.email || '',
                        user.displayName || 'Learner'
                    );
                    setNeedsProfileCompletion(true);
                    syncedRef.current = true;
                }
            }
        }, (error: any) => {
            console.error('Error listening to user data:', error);
        });

        return () => unsubscribe();
    }, [user, store]);

    // Removed: Save to Firestore when store changes
    // We now handle granular updates in the store actions directly to avoid race conditions and full-state overwrites.

    // Reset store when user logs out
    useEffect(() => {
        if (!user && syncedRef.current) {
            store.resetToDefaults();
            syncedRef.current = false;
            lastSyncRef.current = '';
            setNeedsProfileCompletion(false);
        }
    }, [user, store]);

    return {
        needsProfileCompletion,
        user,
        onProfileComplete: () => setNeedsProfileCompletion(false),
    };
}
