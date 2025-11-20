"use client";

import { useEffect, useRef, useState } from 'react';
import { useAuth } from './useAuth';
import { useUserStore } from '../store';
import { getUserData, createUserData, updateUserData } from '../services/firestore';

export function useFirestoreSync() {
    const { user } = useAuth();
    const store = useUserStore();
    const syncedRef = useRef(false);
    const lastSyncRef = useRef<string>('');
    const [needsProfileCompletion, setNeedsProfileCompletion] = useState(false);

    // Load user data from Firestore when user logs in
    useEffect(() => {
        if (!user || syncedRef.current) return;

        const loadData = async () => {
            try {
                const firestoreData = await getUserData(user.uid);

                if (firestoreData) {
                    // Check if profile is complete
                    if (!firestoreData.profileComplete) {
                        setNeedsProfileCompletion(true);
                        syncedRef.current = true;
                        return;
                    }

                    // User exists in Firestore - load their data
                    store.loadUserData({
                        xp: firestoreData.xp,
                        level: firestoreData.level,
                        streak: firestoreData.streak,
                        name: firestoreData.name,
                        projects: firestoreData.projects,
                        roadmapProgress: firestoreData.roadmapProgress,
                        roadmapDefinitions: firestoreData.roadmapDefinitions,
                        currentTopic: firestoreData.currentTopic || "",
                        achievements: firestoreData.achievements || [],
                        totalLessonsCompleted: firestoreData.totalLessonsCompleted || 0,
                        completedRoadmaps: firestoreData.completedRoadmaps || 0,
                    });
                } else {
                    // New user - create Firestore document
                    await createUserData(
                        user.uid,
                        user.email || '',
                        user.displayName || 'Learner'
                    );
                    setNeedsProfileCompletion(true);
                }

                syncedRef.current = true;
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        };

        loadData();
    }, [user, store]);

    // Save to Firestore when store changes
    useEffect(() => {
        if (!user || !syncedRef.current) return;

        const currentState = JSON.stringify({
            xp: store.xp,
            level: store.level,
            streak: store.streak,
            name: store.name,
            projects: store.projects,
            roadmapProgress: store.roadmapProgress,
            roadmapDefinitions: store.roadmapDefinitions,
            currentTopic: store.currentTopic,
            achievements: store.achievements,
            totalLessonsCompleted: store.totalLessonsCompleted,
            completedRoadmaps: store.completedRoadmaps,
        });

        // Only sync if data actually changed
        if (currentState === lastSyncRef.current) return;
        lastSyncRef.current = currentState;

        const saveData = async () => {
            try {
                await updateUserData(user.uid, {
                    xp: store.xp,
                    level: store.level,
                    streak: store.streak,
                    name: store.name,
                    projects: store.projects,
                    roadmapProgress: store.roadmapProgress,
                    roadmapDefinitions: store.roadmapDefinitions,
                    currentTopic: store.currentTopic,
                    achievements: store.achievements,
                    totalLessonsCompleted: store.totalLessonsCompleted,
                    completedRoadmaps: store.completedRoadmaps,
                });
            } catch (error) {
                console.error('Error saving user data:', error);
            }
        };

        // Debounce saves
        const timeoutId = setTimeout(saveData, 1000);
        return () => clearTimeout(timeoutId);
    }, [user, store.xp, store.level, store.streak, store.name, store.projects, store.roadmapProgress, store.roadmapDefinitions, store.currentTopic, store.achievements, store.totalLessonsCompleted, store.completedRoadmaps]);

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
