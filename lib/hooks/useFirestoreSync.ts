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
                // We use a simple check here to avoid overwriting local unsaved changes
                // In a real app, you might want more complex conflict resolution
                if (!syncedRef.current) {
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
                        roadmapProgress: firestoreData.roadmapProgress,
                        roadmapDefinitions: firestoreData.roadmapDefinitions,
                        currentTopic: firestoreData.currentTopic || "",
                        achievements: firestoreData.achievements || [],
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

    // Save to Firestore when store changes
    useEffect(() => {
        if (!user || !syncedRef.current) return;

        const currentState = JSON.stringify({
            xp: store.xp,
            level: store.level,
            streakData: store.streakData,
            name: store.name,
            projects: store.projects,
            roadmapProgress: store.roadmapProgress,
            roadmapDefinitions: store.roadmapDefinitions,
            currentTopic: store.currentTopic,
            achievements: store.achievements,
            totalLessonsCompleted: store.totalLessonsCompleted,
            totalRoadmapsCompleted: store.totalRoadmapsCompleted,
        });

        // Only sync if data actually changed
        if (currentState === lastSyncRef.current) return;
        lastSyncRef.current = currentState;

        const saveData = async () => {
            try {
                await updateUserData(user.uid, {
                    xp: store.xp,
                    level: store.level,
                    streakData: store.streakData,
                    name: store.name,
                    projects: store.projects,
                    roadmapProgress: store.roadmapProgress,
                    roadmapDefinitions: store.roadmapDefinitions,
                    currentTopic: store.currentTopic,
                    achievements: store.achievements,
                    totalLessonsCompleted: store.totalLessonsCompleted,
                    totalRoadmapsCompleted: store.totalRoadmapsCompleted,
                });
            } catch (error) {
                console.error('Error saving user data:', error);
            }
        };

        // Debounce saves
        const timeoutId = setTimeout(saveData, 1000);
        return () => clearTimeout(timeoutId);
    }, [user, store.xp, store.level, store.streakData, store.name, store.projects, store.roadmapProgress, store.roadmapDefinitions, store.currentTopic, store.achievements, store.totalLessonsCompleted, store.totalRoadmapsCompleted]);

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
