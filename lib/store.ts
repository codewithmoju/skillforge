import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Achievement, StreakData, XPGainEvent } from './types/gamification';
import { ACHIEVEMENT_DEFINITIONS } from './utils/achievementSystem';

export interface Project {
    id: string;
    title: string;
    description: string;
    status: "Draft" | "In Progress" | "Completed";
    stack: string[];
    progress: number;
    createdAt: Date;
}

export interface RoadmapDefinition {
    id: string;
    title: string;
    level: number;
    lessons: number;
    lessonTitles?: string[];
    position: { x: number; y: number };
    description?: string;
}

export interface RoadmapNode {
    id: string;
    status: "locked" | "active" | "completed";
    completedLessons: number;
}

export interface RoadmapHistory {
    id: string;
    topic: string;
    generatedAt: Date;
    completedAt?: Date;
    completionTime?: number; // in days
    category: string;
}

export interface UserState {
    // User Stats
    xp: number;
    level: number;
    name: string;

    // Gamification
    achievements: Achievement[];
    streakData: StreakData;
    xpHistory: XPGainEvent[];

    // Roadmap Tracking
    roadmapHistory: RoadmapHistory[];
    totalRoadmapsGenerated: number;
    totalRoadmapsCompleted: number;
    uniqueDomainsExplored: string[];
    roadmapsViewedCount: number;

    // Data
    projects: Project[];
    roadmapProgress: Record<string, RoadmapNode>;
    roadmapDefinitions: RoadmapDefinition[];
    currentTopic: string;
    totalLessonsCompleted: number;
    lessonCache: Record<string, any>; // Cache for generated lessons

    // Actions
    addXp: (amount: number, source: XPGainEvent['source'], multiplier?: number) => void;
    addProject: (project: Project) => void;
    updateProjectProgress: (id: string, progress: number) => void;
    completeLesson: (nodeId: string) => void;
    prefetchLesson: (topic: string, moduleTitle: string, lessonTitle: string, userLevel: string) => Promise<void>;
    setRoadmap: (topic: string, definitions: RoadmapDefinition[], category: string) => void;
    completeRoadmap: (roadmapId: string) => void;
    setUserName: (name: string) => void;
    updateAchievementProgress: (achievementId: string, progress: number) => { newStarsUnlocked: number[]; totalXpGained: number };
    updateStreak: () => void;
    loadUserData: (data: Partial<UserState>) => void;
    resetToDefaults: () => void;
}

const defaultState = {
    xp: 0,
    level: 1,
    name: "Learner",
    achievements: ACHIEVEMENT_DEFINITIONS.map(def => ({
        ...def,
        currentProgress: 0,
        totalXpEarned: 0,
    })),
    streakData: {
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: new Date(),
        multiplier: 1.0,
    },
    xpHistory: [],
    roadmapHistory: [],
    totalRoadmapsGenerated: 0,
    totalRoadmapsCompleted: 0,
    uniqueDomainsExplored: [],
    roadmapsViewedCount: 0,
    projects: [],
    roadmapProgress: {},
    roadmapDefinitions: [],
    currentTopic: "",
    totalLessonsCompleted: 0,
    lessonCache: {},
};

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            ...defaultState,

            addXp: (amount: number, source: XPGainEvent['source'], multiplier?: number) => {
                set((state) => {
                    const finalMultiplier = multiplier || state.streakData.multiplier;
                    const finalAmount = Math.floor(amount * finalMultiplier);
                    const newXp = state.xp + finalAmount;

                    // Import level calculation
                    const { getLevelFromXP } = require('./utils/levelSystem');
                    const newLevel = getLevelFromXP(newXp);

                    // Add to XP history
                    const xpEvent: XPGainEvent = {
                        amount: finalAmount,
                        source,
                        timestamp: new Date(),
                        multiplier: finalMultiplier,
                    };

                    return {
                        xp: newXp,
                        level: newLevel,
                        xpHistory: [...state.xpHistory.slice(-99), xpEvent], // Keep last 100 events
                    };
                });
            },

            addProject: (project: Project) => {
                set((state) => ({
                    projects: [...state.projects, project],
                }));
            },

            updateProjectProgress: (id: string, progress: number) => {
                set((state) => ({
                    projects: state.projects.map((p) =>
                        p.id === id ? { ...p, progress } : p
                    ),
                }));
            },

            completeLesson: (nodeId: string) => {
                const state = get();
                const node = state.roadmapProgress[nodeId];
                const definition = state.roadmapDefinitions.find(d => d.id === nodeId);

                if (!node || !definition) return;

                const newCompletedLessons = node.completedLessons + 1;
                const isNodeComplete = newCompletedLessons >= definition.lessons;

                const updatedProgress = {
                    ...state.roadmapProgress,
                    [nodeId]: {
                        ...node,
                        completedLessons: newCompletedLessons,
                        status: isNodeComplete ? "completed" as const : node.status,
                    },
                };

                // Unlock next node if current is completed
                if (isNodeComplete) {
                    const currentIndex = state.roadmapDefinitions.findIndex(d => d.id === nodeId);
                    const nextNode = state.roadmapDefinitions[currentIndex + 1];
                    if (nextNode && updatedProgress[nextNode.id]?.status === "locked") {
                        updatedProgress[nextNode.id] = {
                            ...updatedProgress[nextNode.id],
                            status: "active",
                        };
                    }
                }

                set({
                    roadmapProgress: updatedProgress,
                    totalLessonsCompleted: state.totalLessonsCompleted + 1,
                });

                // Add XP for module completion
                state.addXp(75, 'module_completion');
            },

            prefetchLesson: async (topic: string, moduleTitle: string, lessonTitle: string, userLevel: string) => {
                const state = get();
                const cacheKey = `${topic}-${moduleTitle}-${lessonTitle}`;

                if (state.lessonCache[cacheKey]) return; // Already cached

                try {
                    const res = await fetch("/api/generate-lesson", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ topic, moduleTitle, lessonTitle, userLevel }),
                    });
                    const data = await res.json();
                    if (data && !data.error) {
                        set((state) => ({
                            lessonCache: {
                                ...state.lessonCache,
                                [cacheKey]: data
                            }
                        }));
                    }
                } catch (error) {
                    console.error("Prefetch failed:", error);
                }
            },

            setRoadmap: (topic: string, definitions: RoadmapDefinition[], category: string) => {
                const state = get();
                const initialProgress: Record<string, RoadmapNode> = {};
                definitions.forEach((def, index) => {
                    initialProgress[def.id] = {
                        id: def.id,
                        status: index === 0 ? "active" : "locked",
                        completedLessons: 0,
                    };
                });

                // Create roadmap history entry
                const roadmapEntry: RoadmapHistory = {
                    id: `roadmap_${Date.now()}`,
                    topic,
                    generatedAt: new Date(),
                    category,
                };

                // Update unique domains
                const currentDomains = state.uniqueDomainsExplored instanceof Set
                    ? Array.from(state.uniqueDomainsExplored)
                    : (Array.isArray(state.uniqueDomainsExplored) ? state.uniqueDomainsExplored : []);

                const newDomains = new Set(currentDomains);
                newDomains.add(category);

                set({
                    currentTopic: topic,
                    roadmapDefinitions: definitions,
                    roadmapProgress: initialProgress,
                    roadmapHistory: [...state.roadmapHistory, roadmapEntry],
                    totalRoadmapsGenerated: state.totalRoadmapsGenerated + 1,
                    uniqueDomainsExplored: Array.from(newDomains), // Store as array
                });

                // Add XP for roadmap generation
                state.addXp(50, 'roadmap_generation');

                // Update achievements
                state.updateAchievementProgress('pathfinder', state.totalRoadmapsGenerated + 1);
                state.updateAchievementProgress('specialist', newDomains.size);
                state.updateAchievementProgress('explorer', state.roadmapsViewedCount + 1);

                // Check for time-based achievements
                const hour = new Date().getHours();
                if (hour === 3) {
                    state.updateAchievementProgress('night_owl', 1);
                } else if (hour === 6) {
                    state.updateAchievementProgress('early_bird', 1);
                }
            },

            completeRoadmap: (roadmapId: string) => {
                const state = get();
                const roadmap = state.roadmapHistory.find(r => r.id === roadmapId);
                if (!roadmap || roadmap.completedAt) return;

                const completionTime = Math.floor(
                    (new Date().getTime() - new Date(roadmap.generatedAt).getTime()) / (1000 * 60 * 60 * 24)
                );

                const updatedHistory = state.roadmapHistory.map(r =>
                    r.id === roadmapId
                        ? { ...r, completedAt: new Date(), completionTime }
                        : r
                );

                set({
                    roadmapHistory: updatedHistory,
                    totalRoadmapsCompleted: state.totalRoadmapsCompleted + 1,
                });

                // Add XP for completion
                state.addXp(200, 'roadmap_completion');

                // Update achievements
                state.updateAchievementProgress('finisher', state.totalRoadmapsCompleted + 1);

                // Check for speed runner achievement (< 7 days)
                if (completionTime < 7) {
                    const speedRuns = state.roadmapHistory.filter(
                        r => r.completedAt && r.completionTime && r.completionTime < 7
                    ).length;
                    state.updateAchievementProgress('speedrunner', speedRuns + 1);
                }

                // Check for perfectionist achievement
                const allNodesCompleted = Object.values(state.roadmapProgress).every(
                    node => node.status === 'completed'
                );
                if (allNodesCompleted) {
                    const perfectCompletions = state.roadmapHistory.filter(r => {
                        // This would need more complex logic to track perfect completions
                        return r.completedAt;
                    }).length;
                    state.updateAchievementProgress('perfectionist', perfectCompletions);
                }
            },

            setUserName: (name: string) => {
                set({ name });
            },

            updateAchievementProgress: (achievementId: string, progress: number) => {
                const state = get();
                const achievement = state.achievements.find(a => a.id === achievementId);
                if (!achievement) return { newStarsUnlocked: [], totalXpGained: 0 };

                const { checkAchievementProgress } = require('./utils/achievementSystem');

                // Update progress
                achievement.currentProgress = progress;

                // Check for new stars
                const { newStarsUnlocked, totalXpGained } = checkAchievementProgress(achievement, progress);

                if (newStarsUnlocked.length > 0) {
                    achievement.totalXpEarned += totalXpGained;

                    set({
                        achievements: state.achievements.map(a =>
                            a.id === achievementId ? achievement : a
                        ),
                    });

                    // Add XP from achievement
                    state.addXp(totalXpGained, 'achievement', 1); // No multiplier for achievement XP
                }

                return { newStarsUnlocked, totalXpGained };
            },

            updateStreak: () => {
                const state = get();
                const { updateStreak, getStreakMilestoneReward } = require('./utils/streakSystem');

                const newStreakData = updateStreak(state.streakData);
                const milestoneReward = getStreakMilestoneReward(newStreakData.currentStreak);

                set({ streakData: newStreakData });

                // Update streak achievement
                state.updateAchievementProgress('consistency', newStreakData.currentStreak);

                // Add milestone reward if applicable
                if (milestoneReward > 0) {
                    state.addXp(milestoneReward, 'streak', 1);
                }
            },

            loadUserData: (data: Partial<UserState>) => {
                set((state) => ({
                    ...state,
                    ...data,
                }));
            },

            resetToDefaults: () => {
                set(defaultState);
            },
        }),
        {
            name: 'edumate-storage',
            onRehydrateStorage: () => (state) => {
                if (state) {
                    // Ensure all achievement definitions are present
                    const existingAchievementIds = new Set(state.achievements.map(a => a.id));
                    const missingAchievements = ACHIEVEMENT_DEFINITIONS.filter(
                        def => !existingAchievementIds.has(def.id)
                    ).map(def => ({
                        ...def,
                        currentProgress: 0,
                        totalXpEarned: 0,
                    }));

                    if (missingAchievements.length > 0) {
                        state.achievements = [...state.achievements, ...missingAchievements];
                    }
                }
            },
        }
    )
);
