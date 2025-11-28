import { Achievement, StreakData, XPGainEvent } from '../types/gamification';
import { SkinId } from '../types/skins';

export interface Project {
    id: string;
    title: string;
    description: string;
    status: "Draft" | "In Progress" | "Completed";
    stack: string[];
    progress: number;
    createdAt: Date;
}

// Hierarchical Roadmap Interfaces
export interface Prerequisite {
    name: string;
    description?: string;
    reason: string;
    estimatedTime?: string;
    resources?: string[];
}

export interface Subtopic {
    id: string;
    name: string;
    description?: string;
    why: string;
    estimatedTime?: string;
    keyPoints?: string[];
    examples?: string[];
}

export interface Topic {
    id: string;
    name: string;
    description?: string;
    why: string;
    estimatedTime?: string;
    difficulty?: string;
    keyConcepts?: string[];
    practicalApplications?: string[];
    subtopics: Subtopic[];
}

export interface LearningArea {
    id: string;
    name: string;
    order: number;
    description?: string;
    why: string;
    estimatedDuration?: string;
    difficulty?: string;
    learningObjectives?: string[];
    topics: Topic[];
}

export interface RoadmapDefinition {
    id: string;
    title: string;
    level: number;
    lessons: number;
    lessonTitles?: string[];
    learningAreas?: LearningArea[];
    learningPath?: string[];
    topics?: string[];
    overview?: string;
    goalEstimatedDuration?: string;
    goalDifficultyLevel?: string;
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
    completionTime?: number;
    category: string;
}

export interface UserSlice {
    xp: number;
    level: number;
    name: string;
    achievements: Achievement[];
    streakData: StreakData;
    xpHistory: XPGainEvent[];
    projects: Project[];
    activeDays: string[];
    lastActivityDate: string;
    selectedSkin: SkinId;
    ownedSkins: SkinId[];

    addXp: (amount: number, source: XPGainEvent['source'], multiplier?: number) => void;
    addProject: (project: Project) => void;
    updateProjectProgress: (id: string, progress: number) => void;
    setUserName: (name: string) => void;
    updateAchievementProgress: (achievementId: string, progress: number) => void;
    setSkin: (skinId: SkinId) => void;
    loadUserData: (data: Partial<any>) => Promise<void>;
    resetToDefaults: () => void;
    updateStreak: () => void;
}

export interface RoadmapSlice {
    roadmapHistory: RoadmapHistory[];
    totalRoadmapsGenerated: number;
    totalRoadmapsCompleted: number;
    uniqueDomainsExplored: string[];
    roadmapsViewedCount: number;
    weekendCompletions: number;
    roadmapProgress: Record<string, RoadmapNode>;
    roadmapDefinitions: RoadmapDefinition[];
    currentTopic: string;
    completedTopics: string[];
    completedSubtopics: string[];
    completedKeyPoints: string[];
    learningAreas: LearningArea[];
    prerequisites: Prerequisite[];
    roadmapGoal: string;
    totalLessonsCompleted: number;
    lessonCache: Record<string, any>;

    completeLesson: (lessonId: string) => void;
    completeRoadmap: (roadmapId: string) => void;
    prefetchLesson: (topic: string, moduleTitle: string, lessonTitle: string, userLevel: string) => Promise<void>;
    setRoadmap: (topic: string, definitions: RoadmapDefinition[], category: string, learningAreas: LearningArea[], prerequisites: Prerequisite[], goal: string) => void;
    updateLearningArea: (areaId: string, details: Partial<LearningArea>) => void;
    toggleSubtopicCompletion: (topicId: string, subtopicId: string) => void;
    toggleKeyPointCompletion: (topicId: string, subtopicId: string, pointIndex: number) => void;
}

export interface SocialSlice {
    postsCount: number;
    likesGivenCount: number;
    commentsCount: number;
    savesCount: number;
    followingCount: number;
    followersCount: number;
    socialInteractionsTotal: number;
    challengesJoined: number;
    challengesCompleted: number;

    incrementPostCount: () => void;
    incrementShares: () => void;
    incrementLikesGiven: () => void;
    incrementComments: () => void;
    incrementSaves: () => void;
    incrementFollowing: () => void;
    incrementFollowers: () => void;
    updatePostLikes: (likes: number) => void;
    incrementChallengesJoined: () => void;
    incrementChallengesCompleted: () => void;
}

export type StoreState = UserSlice & RoadmapSlice & SocialSlice & {
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
};
export type UserState = StoreState;
