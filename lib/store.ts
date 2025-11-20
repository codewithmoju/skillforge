import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
    position: { x: number; y: number };
    description?: string;
}

export interface RoadmapNode {
    id: string;
    status: "locked" | "active" | "completed";
    completedLessons: number;
}

export interface UserState {
    // User Stats
    xp: number;
    level: number;
    streak: number;
    name: string;

    // Data
    projects: Project[];
    roadmapProgress: Record<string, RoadmapNode>;
    roadmapDefinitions: RoadmapDefinition[];
    currentTopic: string;
    achievements: string[]; // Unlocked achievement IDs
    totalLessonsCompleted: number;
    completedRoadmaps: number;

    // Actions
    addXp: (amount: number) => void;
    addProject: (project: Project) => void;
    updateProjectProgress: (id: string, progress: number) => void;
    completeLesson: (nodeId: string) => void;
    setRoadmap: (topic: string, definitions: RoadmapDefinition[]) => void;
    setUserName: (name: string) => void;
    unlockAchievement: (achievementId: string) => void;
    loadUserData: (data: Partial<UserState>) => void;
    resetToDefaults: () => void;
}

const defaultState = {
    xp: 0,
    level: 1,
    streak: 0,
    name: "Learner",
    projects: [],
    roadmapProgress: {},
    roadmapDefinitions: [],
    currentTopic: "",
    achievements: [],
    totalLessonsCompleted: 0,
    completedRoadmaps: 0,
};

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            ...defaultState,

            addXp: (amount: number) => {
                set((state) => {
                    const newXp = state.xp + amount;
                    const newLevel = Math.floor(newXp / 500) + 1;
                    return { xp: newXp, level: newLevel };
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
                set((state) => {
                    const node = state.roadmapProgress[nodeId];
                    const definition = state.roadmapDefinitions.find(d => d.id === nodeId);

                    if (!node || !definition) return state;

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

                    return {
                        roadmapProgress: updatedProgress,
                        xp: state.xp + 50,
                        level: Math.floor((state.xp + 50) / 500) + 1,
                        totalLessonsCompleted: state.totalLessonsCompleted + 1,
                    };
                });
            },

            setRoadmap: (topic: string, definitions: RoadmapDefinition[]) => {
                const initialProgress: Record<string, RoadmapNode> = {};
                definitions.forEach((def, index) => {
                    initialProgress[def.id] = {
                        id: def.id,
                        status: index === 0 ? "active" : "locked",
                        completedLessons: 0,
                    };
                });

                set({
                    currentTopic: topic,
                    roadmapDefinitions: definitions,
                    roadmapProgress: initialProgress,
                });
            },

            setUserName: (name: string) => {
                set({ name });
            },

            unlockAchievement: (achievementId: string) => {
                set((state) => {
                    if (state.achievements.includes(achievementId)) return state;
                    return {
                        achievements: [...state.achievements, achievementId],
                    };
                });
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
            name: 'skillforge-storage',
        }
    )
);
