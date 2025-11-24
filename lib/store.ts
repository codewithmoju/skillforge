import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Achievement, StreakData, XPGainEvent } from './types/gamification';
import { ACHIEVEMENT_DEFINITIONS } from './utils/achievementSystem';
import { SkinId, DEFAULT_SKIN } from './types/skins';

export interface Project {
    id: string;
    title: string;
    description: string;
    status: "Draft" | "In Progress" | "Completed";
    stack: string[];
    progress: number;
    createdAt: Date;
}

// Hierarchical Roadmap Interfaces (Universal Domain Support)
export interface Prerequisite {
    name: string;
    description?: string; // Detailed 2-3 sentence explanation of what this prerequisite is
    reason: string; // Why this prerequisite is essential
    estimatedTime?: string; // How long to learn this prerequisite
    resources?: string[]; // Learning resources
}

export interface Subtopic {
    id: string;
    name: string;
    description?: string; // Detailed 2-3 sentence description
    why: string; // Why this subtopic matters
    estimatedTime?: string; // Time to learn
    keyPoints?: string[]; // Key learning points
    examples?: string[]; // Concrete examples
}

export interface Topic {
    id: string;
    name: string;
    description?: string; // Detailed 2-3 sentence description
    why: string; // Why this topic is important
    estimatedTime?: string; // Time to learn this topic
    difficulty?: string; // Beginner/Intermediate/Advanced
    keyConcepts?: string[]; // Key concepts to master
    practicalApplications?: string[]; // Real-world applications
    subtopics: Subtopic[];
}

export interface LearningArea {
    id: string;
    name: string;
    order: number;
    description?: string; // Detailed 3-4 sentence description
    why: string; // Why this area is crucial
    estimatedDuration?: string; // Time to complete this area
    difficulty?: string; // Beginner/Intermediate/Advanced
    learningObjectives?: string[]; // Clear, actionable objectives
    topics: Topic[];
}

export interface RoadmapDefinition {
    id: string;
    title: string;
    level: number;
    lessons: number;
    lessonTitles?: string[];
    learningAreas?: LearningArea[]; // Hierarchical breakdown
    learningPath?: string[]; // Sequential list of areas
    topics?: string[]; // Legacy support - list of topic names

    // Roadmap Overview
    overview?: string; // Comprehensive overview of learning journey
    goalEstimatedDuration?: string; // Total estimated time
    goalDifficultyLevel?: string; // Overall difficulty
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
    weekendCompletions: number; // Roadmaps completed on weekends

    // Data
    projects: Project[];
    roadmapProgress: Record<string, RoadmapNode>;
    roadmapDefinitions: RoadmapDefinition[];
    currentTopic: string;
    completedTopics: string[];
    completedSubtopics: string[];
    completedKeyPoints: string[]; // Format: "subtopicId-index"
    // Guide Mode Data
    learningAreas: LearningArea[];
    prerequisites: Prerequisite[];
    roadmapGoal: string;
    totalLessonsCompleted: number;
    lessonCache: Record<string, any>; // Cache for generated lessons

    // Social Stats
    postsCount: number;
    likesGivenCount: number;
    commentsCount: number;
    savesCount: number;
    followingCount: number;
    followersCount: number;
    socialInteractionsTotal: number;
    challengesJoined: number;
    challengesCompleted: number;
    activeDays: string[];

    // Skins
    selectedSkin: string;
    ownedSkins: string[];

    // Actions
    addXp: (amount: number, source: "social" | "roadmap_generation" | "roadmap_completion" | "module_completion" | "achievement" | "streak" | "daily_login", multiplier?: number) => void;
    addProject: (project: Project) => void;
    updateProjectProgress: (id: string, progress: number) => void;
    completeLesson: (lessonId: string) => void;
    completeRoadmap: (roadmapId: string) => void;
    setUserName: (name: string) => void;
    updateAchievementProgress: (achievementId: string, progress: number) => void;
    setSkin: (skinId: string) => void;
    loadUserData: () => Promise<void>;
    resetToDefaults: () => void;
    prefetchLesson: (topic: string, moduleTitle: string, lessonTitle: string, userLevel: string) => Promise<void>;

    // Social Tracking
    incrementPostCount: () => void;
    incrementShares: () => void; // For Knowledge Sharer achievement
    incrementLikesGiven: () => void;
    incrementComments: () => void;
    incrementSaves: () => void;
    incrementFollowing: () => void;
    incrementFollowers: () => void;
    updatePostLikes: (likes: number) => void; // For trendsetter achievement
    // Challenge actions
    incrementChallengesJoined: () => void;
    incrementChallengesCompleted: () => void;
    toggleSubtopicCompletion: (subtopicId: string) => void;
    toggleKeyPointCompletion: (subtopicId: string, pointIndex: number) => void;

    // Guide Mode Actions
    setRoadmap: (topic: string, definitions: RoadmapDefinition[], category: string, learningAreas: LearningArea[], prerequisites: Prerequisite[], goal: string) => void;
    updateLearningArea: (areaId: string, details: Partial<LearningArea>) => void;
    updateStreak: () => void;
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
    weekendCompletions: 0,
    // Data
    projects: [],
    roadmapProgress: {},
    roadmapDefinitions: [],
    currentTopic: "",
    completedTopics: [],
    completedSubtopics: [],
    completedKeyPoints: [],
    // Guide Mode Data
    learningAreas: [],
    prerequisites: [],
    roadmapGoal: "",
    totalLessonsCompleted: 0,
    lessonCache: {},
    postsCount: 0,
    likesGivenCount: 0,
    commentsCount: 0,
    savesCount: 0,
    followingCount: 0,
    followersCount: 0,
    socialInteractionsTotal: 0,
    challengesJoined: 0,
    challengesCompleted: 0,
    activeDays: [],
    lastActivityDate: "",
    selectedSkin: DEFAULT_SKIN,
    ownedSkins: ["cyber-neon", "forest-quest", "space-odyssey", "dragons-lair", "ocean-depths"], // All skins unlocked for everyone
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
                    const oldLevel = state.level;

                    // Add to XP history
                    const xpEvent: XPGainEvent = {
                        amount: finalAmount,
                        source,
                        timestamp: new Date(),
                        multiplier: finalMultiplier,
                    };

                    // Track daily activity
                    const today = new Date().toISOString().split('T')[0];
                    const activeDays = state.activeDays || [];
                    const updatedActiveDays = activeDays.includes(today)
                        ? activeDays
                        : [...activeDays, today];

                    // Update XP Collector achievement
                    state.updateAchievementProgress('xp_collector', newXp);

                    // Update Level Up Master achievement if level increased
                    if (newLevel > oldLevel) {
                        state.updateAchievementProgress('leveler', newLevel);
                    }

                    return {
                        xp: newXp,
                        level: newLevel,
                        xpHistory: [...state.xpHistory.slice(-99), xpEvent], // Keep last 100 events
                        activeDays: updatedActiveDays,
                        lastActivityDate: today,
                    };
                });
            },

            addProject: (project: Project) => {
                set((state) => {
                    const newProjects = [...state.projects, project];
                    // Update Project Builder achievement
                    state.updateAchievementProgress('builder', newProjects.length);
                    return {
                        projects: newProjects,
                    };
                });
            },

            updateProjectProgress: (id: string, progress: number) => {
                set((state) => {
                    const updatedProjects = state.projects.map((p) =>
                        p.id === id ? { ...p, progress } : p
                    );

                    // Check if project is completed (progress >= 100)
                    const project = updatedProjects.find(p => p.id === id);
                    if (project && progress >= 100 && project.status !== 'Completed') {
                        const completedProject = { ...project, status: 'Completed' as const };
                        const finalProjects = updatedProjects.map(p =>
                            p.id === id ? completedProject : p
                        );
                        const completedCount = finalProjects.filter(p => p.status === 'Completed').length;

                        // Update Master Architect achievement
                        state.updateAchievementProgress('architect', completedCount);

                        return {
                            projects: finalProjects,
                        };
                    }

                    return {
                        projects: updatedProjects,
                    };
                });
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

                const newTotalLessons = state.totalLessonsCompleted + 1;

                set({
                    roadmapProgress: updatedProgress,
                    totalLessonsCompleted: newTotalLessons,
                });

                // Add XP for module completion
                state.addXp(75, 'module_completion');

                // Update lesson completion achievements
                state.updateAchievementProgress('student', newTotalLessons);
                state.updateAchievementProgress('first_blood', newTotalLessons);
                state.updateAchievementProgress('centurion', newTotalLessons);

                // Check for time-based achievements
                const hour = new Date().getHours();
                if (hour >= 0 && hour < 2) {
                    state.updateAchievementProgress('midnight_learner', 1);
                }
                if (hour >= 5 && hour < 7) {
                    state.updateAchievementProgress('early_riser', 1);
                }

                // Track daily activity
                const today = new Date().toISOString().split('T')[0];
                const activeDays = state.activeDays || [];
                if (!activeDays.includes(today)) {
                    const updatedActiveDays = [...activeDays, today];
                    set({ activeDays: updatedActiveDays });
                    state.updateAchievementProgress('daily_learner', updatedActiveDays.length);
                }
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

            setRoadmap: (topic: string, definitions: RoadmapDefinition[], category: string, learningAreas: LearningArea[] = [], prerequisites: Prerequisite[] = [], goal: string = "") => {
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
                    learningAreas,
                    prerequisites,
                    roadmapGoal: goal,
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
                state.updateAchievementProgress('jack_of_all_trades', newDomains.size);
                state.updateAchievementProgress('hundred_club', state.totalRoadmapsGenerated + 1);

                // Check for time-based achievements
                const hour = new Date().getHours();
                if (hour === 3) {
                    state.updateAchievementProgress('night_owl', 1);
                } else if (hour === 6) {
                    state.updateAchievementProgress('early_bird', 1);
                }
            },

            updateLearningArea: (areaId: string, details: Partial<LearningArea>) => {
                set((state) => ({
                    learningAreas: state.learningAreas.map(area =>
                        area.id === areaId ? { ...area, ...details } : area
                    )
                }));
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

                const newTotalCompleted = state.totalRoadmapsCompleted + 1;

                // Check if completed on weekend
                const dayOfWeek = new Date().getDay();
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                const newWeekendCompletions = isWeekend
                    ? state.weekendCompletions + 1
                    : state.weekendCompletions;

                set({
                    roadmapHistory: updatedHistory,
                    totalRoadmapsCompleted: newTotalCompleted,
                    weekendCompletions: newWeekendCompletions,
                });

                // Add XP for completion
                state.addXp(200, 'roadmap_completion');

                // Update achievements
                state.updateAchievementProgress('finisher', newTotalCompleted);
                state.updateAchievementProgress('hundred_club', state.totalRoadmapsGenerated);

                // Check for speed runner achievement (< 7 days)
                if (completionTime < 7) {
                    const speedRuns = updatedHistory.filter(
                        r => r.completedAt && r.completionTime && r.completionTime < 7
                    ).length;
                    state.updateAchievementProgress('speedrunner', speedRuns);
                }

                // Check for perfectionist achievement (100% completion)
                const allNodesCompleted = Object.values(state.roadmapProgress).every(
                    node => node.status === 'completed'
                );
                if (allNodesCompleted) {
                    // Count perfect completions (all nodes completed)
                    const perfectCompletions = updatedHistory.filter(r => r.completedAt).length;
                    state.updateAchievementProgress('perfectionist', perfectCompletions);
                }

                // Weekend achievements
                if (isWeekend) {
                    state.updateAchievementProgress('weekend_warrior', newWeekendCompletions);
                    state.updateAchievementProgress('weekend_learner', newWeekendCompletions);
                }

                // Update Master Scholar achievement (lessons across multiple roadmaps)
                const totalLessonsAcrossRoadmaps = state.totalLessonsCompleted;
                state.updateAchievementProgress('scholar', totalLessonsAcrossRoadmaps);
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
                state.updateAchievementProgress('marathoner', newStreakData.currentStreak);

                // Add milestone reward if applicable
                if (milestoneReward > 0) {
                    state.addXp(milestoneReward, 'streak', 1);
                }
            },

            setSkin: (skinId: SkinId) => {
                const state = get();
                const { SKIN_CONFIGS } = require('./types/skins');
                const skinConfig = SKIN_CONFIGS[skinId];

                if (!skinConfig) return;

                // All skins are unlocked for everyone
                set({ selectedSkin: skinId });
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

            // Social action methods
            incrementPostCount: () => {
                set((state) => {
                    const newCount = state.postsCount + 1;
                    state.updateAchievementProgress('storyteller', newCount);
                    return { postsCount: newCount };
                });
            },

            incrementShares: () => {
                set((state) => {
                    // Track shares for Knowledge Sharer achievement (id: 'influencer')
                    // This should be called when sharing roadmaps/achievements via posts
                    const sharesCount = (state.postsCount || 0) + 1;
                    state.updateAchievementProgress('influencer', sharesCount); // Knowledge Sharer achievement
                    return {};
                });
            },

            incrementLikesGiven: () => {
                set((state) => {
                    const newCount = state.likesGivenCount + 1;
                    const newSocialTotal = state.socialInteractionsTotal + 1;
                    state.updateAchievementProgress('appreciator', newCount);
                    state.updateAchievementProgress('social_butterfly', newSocialTotal);
                    return {
                        likesGivenCount: newCount,
                        socialInteractionsTotal: newSocialTotal,
                    };
                });
            },

            incrementComments: () => {
                set((state) => {
                    const newCount = state.commentsCount + 1;
                    const newSocialTotal = state.socialInteractionsTotal + 1;
                    state.updateAchievementProgress('commentator', newCount);
                    state.updateAchievementProgress('social_butterfly', newSocialTotal);
                    return {
                        commentsCount: newCount,
                        socialInteractionsTotal: newSocialTotal,
                    };
                });
            },

            incrementSaves: () => {
                set((state) => {
                    const newCount = state.savesCount + 1;
                    state.updateAchievementProgress('bookmarker', newCount);
                    return { savesCount: newCount };
                });
            },

            incrementFollowing: () => {
                set((state) => {
                    const newCount = state.followingCount + 1;
                    const newSocialTotal = state.socialInteractionsTotal + 1;
                    state.updateAchievementProgress('networker', newCount);
                    state.updateAchievementProgress('social_butterfly', newSocialTotal);
                    return {
                        followingCount: newCount,
                        socialInteractionsTotal: newSocialTotal,
                    };
                });
            },

            incrementFollowers: () => {
                set((state) => {
                    const newCount = state.followersCount + 1;
                    state.updateAchievementProgress('learning_influencer', newCount);
                    return { followersCount: newCount };
                });
            },

            updatePostLikes: (likes: number) => {
                const state = get();
                if (likes >= 10) {
                    state.updateAchievementProgress('trendsetter', likes);
                }
            },

            // Challenge action methods
            incrementChallengesJoined: () => {
                set((state) => {
                    const newCount = state.challengesJoined + 1;
                    state.updateAchievementProgress('challenger', newCount);
                    return { challengesJoined: newCount };
                });
            },

            incrementChallengesCompleted: () => {
                set((state) => {
                    const newCount = state.challengesCompleted + 1;
                    // Ensure all achievement definitions are present
                    const existingAchievementIds = new Set(state.achievements.map(a => a.id));
                    const missingAchievements = ACHIEVEMENT_DEFINITIONS.filter(
                        def => !existingAchievementIds.has(def.id)
                    ).map(def => ({
                        ...def,
                        currentProgress: 0,
                        totalXpEarned: 0,
                    }));

                    let achievements = state.achievements;
                    if (missingAchievements.length > 0) {
                        achievements = [...state.achievements, ...missingAchievements];
                    }

                    // Ensure all skins are owned (unlock all skins for everyone)
                    const allSkins: SkinId[] = ["cyber-neon", "forest-quest", "space-odyssey", "dragons-lair", "ocean-depths"];
                    let ownedSkins = state.ownedSkins;
                    if (!ownedSkins || ownedSkins.length < allSkins.length) {
                        ownedSkins = allSkins;
                    }

                    // Ensure selectedSkin is valid
                    let selectedSkin = state.selectedSkin;
                    if (!selectedSkin) {
                        selectedSkin = DEFAULT_SKIN;
                    }

                    state.updateAchievementProgress('challenger', newCount);

                    return {
                        challengesCompleted: newCount,
                        achievements,
                        ownedSkins,
                        selectedSkin
                    };
                });
            },

            toggleSubtopicCompletion: (subtopicId: string) => {
                set((state) => {
                    const completed = new Set(state.completedSubtopics || []);
                    if (completed.has(subtopicId)) {
                        completed.delete(subtopicId);
                    } else {
                        completed.add(subtopicId);
                        // Add XP for completing an objective
                        state.addXp(50, 'lesson_complete');
                    }
                    return { completedSubtopics: Array.from(completed) };
                });
            },

            toggleKeyPointCompletion: (subtopicId: string, pointIndex: number) => {
                set((state) => {
                    const key = `${subtopicId}-${pointIndex}`;
                    const completed = new Set(state.completedKeyPoints || []);

                    if (completed.has(key)) {
                        completed.delete(key);
                    } else {
                        completed.add(key);
                        // Add small XP for key point
                        state.addXp(10, 'lesson_complete');
                    }

                    return { completedKeyPoints: Array.from(completed) };
                });
            },
        }),
        {
            name: 'skillforge-storage',
        }
    )
);
