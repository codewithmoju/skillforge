/**
 * Firestore Data Models for User Progress
 * These models define the structure of data stored in Firestore
 */

export interface RoadmapNode {
    id: string;
    title: string;
    description: string;
    status: 'locked' | 'active' | 'completed';
    lessons: number;
    completedLessons: number;
    order: number;
}

export interface RoadmapProgress {
    userId: string;
    topic: string;
    learningAreas: Array<{
        id: string;
        name: string;
        topics: any[];
        detailsStatus: 'skeleton' | 'loading' | 'loaded';
    }>;
    prerequisites: string[];
    goal: string;
    completedKeyPoints: string[];
    roadmapDefinitions: RoadmapNode[];
    roadmapProgress: Record<string, {
        status: 'locked' | 'active' | 'completed';
        completedLessons: number;
        totalLessons: number;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

export interface CourseProgress {
    userId: string;
    courseId: string;
    topic: string;
    completedLessons: string[]; // Array of lesson IDs
    currentLesson?: string;
    progress: number; // Percentage 0-100
    lastAccessed: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserAchievement {
    id: string;
    name: string;
    description: string;
    category: 'generation' | 'completion' | 'engagement' | 'social' | 'special';
    stars: Array<{
        star: number;
        requirement: string;
        xpReward: number;
        unlocked: boolean;
        unlockedAt?: Date;
    }>;
    currentProgress: number;
    totalXpEarned: number;
}

export interface UserProgressDocument {
    userId: string;
    // Roadmap data
    currentTopic?: string;
    roadmaps: Record<string, RoadmapProgress>;

    // Course data
    courses: Record<string, CourseProgress>;

    // Achievements
    achievements: UserAchievement[];

    // Stats
    xp: number;
    level: number;
    streak: number;
    totalLessonsCompleted: number;
    completedRoadmaps: number;

    // Metadata
    createdAt: Date;
    updatedAt: Date;
    lastSyncedAt: Date;
}

/**
 * Helper to create a new user progress document
 */
export function createUserProgressDocument(userId: string): UserProgressDocument {
    const now = new Date();
    return {
        userId,
        roadmaps: {},
        courses: {},
        achievements: [],
        xp: 0,
        level: 1,
        streak: 0,
        totalLessonsCompleted: 0,
        completedRoadmaps: 0,
        createdAt: now,
        updatedAt: now,
        lastSyncedAt: now,
    };
}
