/**
 * Course Type Definitions
 * Comprehensive type system for the course section
 */

export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type CourseCategory = 'web-dev' | 'mobile-dev' | 'ai-ml' | 'data-science' | 'design' | 'business' | 'marketing' | 'personal-dev';
export type LessonType = 'video' | 'article' | 'quiz' | 'project' | 'interactive';

export interface CourseInstructor {
    id: string;
    name: string;
    title: string;
    avatar: string;
    bio: string;
    rating: number;
    studentsCount: number;
}

export interface CourseLesson {
    id: string;
    title: string;
    description: string;
    type: LessonType;
    duration: number; // in minutes
    videoUrl?: string;
    articleContent?: string;
    isPreview: boolean;
    order: number;
}

export interface CourseModule {
    id: string;
    title: string;
    description: string;
    lessons: CourseLesson[];
    order: number;
    estimatedDuration: number; // in minutes
}

export interface Course {
    id: string;
    title: string;
    slug: string;
    description: string;
    shortDescription: string;
    thumbnailUrl: string;
    previewVideoUrl?: string;
    category: CourseCategory;
    difficulty: CourseDifficulty;
    instructor: CourseInstructor;
    modules: CourseModule[];

    // Metadata
    rating: number;
    reviewsCount: number;
    studentsEnrolled: number;
    totalDuration: number; // in minutes
    lastUpdated: Date;
    createdAt: Date;

    // Learning outcomes
    learningOutcomes: string[];
    prerequisites: string[];

    // Pricing (for future use)
    price: number;
    isPremium: boolean;
    isFree: boolean;

    // Tags for search
    tags: string[];
}

export interface UserCourseProgress {
    userId: string;
    courseId: string;
    enrolledAt: Date;
    lastAccessedAt: Date;
    completedLessons: string[];
    currentLessonId: string | null;
    progressPercentage: number;
    isCompleted: boolean;
    completedAt?: Date;
    certificateUrl?: string;

    // Gamification
    xpEarned: number;
    quizScores: { [lessonId: string]: number };
    notes: CourseNote[];
}

export interface CourseNote {
    id: string;
    lessonId: string;
    timestamp: number; // for video timestamp
    content: string;
    createdAt: Date;
}

export interface CourseEnrollment {
    courseId: string;
    enrolledAt: Date;
    progress: number;
}

export interface CourseFilter {
    category?: CourseCategory;
    difficulty?: CourseDifficulty;
    isPremium?: boolean;
    searchQuery?: string;
    minRating?: number;
    sortBy?: 'popular' | 'newest' | 'rating' | 'trending';
}

export interface CourseRecommendation {
    course: Course;
    confidence: number; // 0-1
    reasons: string[];
}
