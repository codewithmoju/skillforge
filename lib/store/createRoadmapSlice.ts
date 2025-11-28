import { StateCreator } from 'zustand';
import { StoreState, RoadmapSlice, RoadmapNode, RoadmapHistory } from './types';

export const createRoadmapSlice: StateCreator<StoreState, [], [], RoadmapSlice> = (set, get) => ({
    roadmapHistory: [],
    totalRoadmapsGenerated: 0,
    totalRoadmapsCompleted: 0,
    uniqueDomainsExplored: [],
    roadmapsViewedCount: 0,
    weekendCompletions: 0,
    roadmapProgress: {},
    roadmapDefinitions: [],
    currentTopic: "",
    completedTopics: [],
    completedSubtopics: [],
    completedKeyPoints: [],
    learningAreas: [],
    prerequisites: [],
    roadmapGoal: "",
    totalLessonsCompleted: 0,
    lessonCache: {},

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

    prefetchLesson: async (topic, moduleTitle, lessonTitle, userLevel) => {
        const state = get();
        const cacheKey = `${topic}-${moduleTitle}-${lessonTitle}`;

        if (state.lessonCache[cacheKey]) return;

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

    setRoadmap: (topic, definitions, category, learningAreas = [], prerequisites = [], goal = "") => {
        const state = get();
        const initialProgress: Record<string, RoadmapNode> = {};
        definitions.forEach((def, index) => {
            initialProgress[def.id] = {
                id: def.id,
                status: index === 0 ? "active" : "locked",
                completedLessons: 0,
            };
        });

        const roadmapEntry: RoadmapHistory = {
            id: `roadmap_${Date.now()}`,
            topic,
            generatedAt: new Date(),
            category,
        };

        const currentDomains = Array.isArray(state.uniqueDomainsExplored)
            ? state.uniqueDomainsExplored
            : [];

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
            uniqueDomainsExplored: Array.from(newDomains),
            // Reset progress for new roadmap (Fix for persistence bug)
            completedTopics: [],
            completedSubtopics: [],
            completedKeyPoints: [],
        });

        state.addXp(50, 'roadmap_generation');

        state.updateAchievementProgress('pathfinder', state.totalRoadmapsGenerated + 1);
        state.updateAchievementProgress('specialist', newDomains.size);
        state.updateAchievementProgress('explorer', state.roadmapsViewedCount + 1);
        state.updateAchievementProgress('jack_of_all_trades', newDomains.size);
        state.updateAchievementProgress('hundred_club', state.totalRoadmapsGenerated + 1);

        const hour = new Date().getHours();
        if (hour === 3) {
            state.updateAchievementProgress('night_owl', 1);
        } else if (hour === 6) {
            state.updateAchievementProgress('early_bird', 1);
        }
    },

    updateLearningArea: (areaId, details) => {
        set((state) => ({
            learningAreas: state.learningAreas.map(area =>
                area.id === areaId ? { ...area, ...details } : area
            )
        }));
    },

    completeRoadmap: (roadmapId) => {
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

        state.addXp(200, 'roadmap_completion');

        state.updateAchievementProgress('finisher', newTotalCompleted);
        state.updateAchievementProgress('hundred_club', state.totalRoadmapsGenerated);

        if (completionTime < 7) {
            const speedRuns = updatedHistory.filter(
                r => r.completedAt && r.completionTime && r.completionTime < 7
            ).length;
            state.updateAchievementProgress('speedrunner', speedRuns);
        }

        const allNodesCompleted = Object.values(state.roadmapProgress).every(
            node => node.status === 'completed'
        );
        if (allNodesCompleted) {
            const perfectCompletions = updatedHistory.filter(r => r.completedAt).length;
            state.updateAchievementProgress('perfectionist', perfectCompletions);
        }

        if (isWeekend) {
            state.updateAchievementProgress('weekend_warrior', newWeekendCompletions);
            state.updateAchievementProgress('weekend_learner', newWeekendCompletions);
        }

        const totalLessonsAcrossRoadmaps = state.totalLessonsCompleted;
        state.updateAchievementProgress('scholar', totalLessonsAcrossRoadmaps);
    },

    toggleSubtopicCompletion: (topicId, subtopicId) => {
        set((state) => {
            const key = `${topicId}-${subtopicId}`;
            const completed = new Set(state.completedSubtopics || []);
            if (completed.has(key)) {
                completed.delete(key);
            } else {
                completed.add(key);
                state.addXp(50, 'lesson_completion');
            }
            return { completedSubtopics: Array.from(completed) };
        });
    },

    toggleKeyPointCompletion: (topicId, subtopicId, pointIndex) => {
        set((state) => {
            const key = `${topicId}-${subtopicId}-${pointIndex}`;
            const completed = new Set(state.completedKeyPoints || []);

            if (completed.has(key)) {
                completed.delete(key);
            } else {
                completed.add(key);
                state.addXp(10, 'lesson_completion');
            }

            return { completedKeyPoints: Array.from(completed) };
        });
    },
});
