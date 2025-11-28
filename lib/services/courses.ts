/**
 * Course Services
 * Handles all course-related data operations
 */

import { Course, CourseFilter, UserCourseProgress, CourseEnrollment, CourseRecommendation } from '@/lib/types/courseTypes';
import { mockCourses, getFeaturedCourses, getTrendingCourses, getCoursesByCategory } from '@/lib/data/mockCourses';

/**
 * Fetch all courses with optional filtering
 */
export async function getCourses(filter?: CourseFilter): Promise<Course[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    let courses = [...mockCourses];

    if (!filter) return courses;

    // Apply filters
    if (filter.category) {
        courses = courses.filter(c => c.category === filter.category);
    }

    if (filter.difficulty) {
        courses = courses.filter(c => c.difficulty === filter.difficulty);
    }

    if (filter.isPremium !== undefined) {
        courses = courses.filter(c => c.isPremium === filter.isPremium);
    }

    if (filter.minRating) {
        if (filter.minRating !== undefined) {
            courses = courses.filter(c => c.rating >= filter.minRating!);
        }
    }

    if (filter.searchQuery) {
        const query = filter.searchQuery.toLowerCase();
        courses = courses.filter(c =>
            c.title.toLowerCase().includes(query) ||
            c.description.toLowerCase().includes(query) ||
            c.tags.some(tag => tag.toLowerCase().includes(query))
        );
    }

    // Apply sorting
    if (filter.sortBy) {
        switch (filter.sortBy) {
            case 'popular':
                courses.sort((a, b) => b.studentsEnrolled - a.studentsEnrolled);
                break;
            case 'newest':
                courses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case 'rating':
                courses.sort((a, b) => b.rating - a.rating);
                break;
            case 'trending':
                courses.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
                break;
        }
    }

    return courses;
}

/**
 * Get a single course by ID
 */
export async function getCourseById(id: string): Promise<Course | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockCourses.find(c => c.id === id) || null;
}

/**
 * Get a single course by slug
 */
export async function getCourseBySlug(slug: string): Promise<Course | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockCourses.find(c => c.slug === slug) || null;
}

/**
 * Get featured courses
 */
export async function getCoursesForDisplay(): Promise<{
    featured: Course[];
    trending: Course[];
    byCategory: { [key: string]: Course[] };
}> {
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
        featured: getFeaturedCourses(),
        trending: getTrendingCourses(),
        byCategory: {
            'web-dev': getCoursesByCategory('web-dev'),
            'ai-ml': getCoursesByCategory('ai-ml'),
            'design': getCoursesByCategory('design'),
            'data-science': getCoursesByCategory('data-science'),
        }
    };
}

/**
 * Get user's enrolled courses
 */
export async function getUserEnrolledCourses(userId: string): Promise<Course[]> {
    // TODO: Implement with actual user data
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockCourses.slice(0, 3);
}

/**
 * Get user's course progress
 */
export async function getUserCourseProgress(userId: string, courseId: string): Promise<UserCourseProgress | null> {
    // TODO: Implement with Firestore
    await new Promise(resolve => setTimeout(resolve, 200));

    // Mock progress
    return {
        userId,
        courseId,
        enrolledAt: new Date(),
        lastAccessedAt: new Date(),
        completedLessons: [],
        currentLessonId: null,
        progressPercentage: 0,
        isCompleted: false,
        xpEarned: 0,
        quizScores: {},
        notes: [],
    };
}

/**
 * Enroll user in a course
 */
export async function enrollInCourse(userId: string, courseId: string): Promise<boolean> {
    // TODO: Implement with Firestore
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`User ${userId} enrolled in course ${courseId}`);
    return true;
}

/**
 * Update course progress
 */
export async function updateCourseProgress(
    userId: string,
    courseId: string,
    lessonId: string,
    completed: boolean
): Promise<boolean> {
    // TODO: Implement with Firestore
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log(`Updated progress for user ${userId} in course ${courseId}, lesson ${lessonId}`);
    return true;
}

/**
 * Get AI-powered course recommendations
 */
export async function getCourseRecommendations(userId: string): Promise<CourseRecommendation[]> {
    // TODO: Implement actual AI recommendations
    await new Promise(resolve => setTimeout(resolve, 400));

    const recommendations: CourseRecommendation[] = mockCourses.slice(0, 4).map((course, index) => ({
        course,
        confidence: 0.95 - (index * 0.1),
        reasons: [
            'Matches your learning goals',
            'Popular with similar learners',
            'Builds on your existing skills',
        ]
    }));

    return recommendations;
}

/**
 * Search courses with advanced filtering
 */
export async function searchCourses(query: string, filters?: CourseFilter): Promise<Course[]> {
    return getCourses({
        ...filters,
        searchQuery: query,
    });
}
