import { FirestoreUserData } from '@/lib/services/firestore';

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string; // Lucide icon name or image URL
    category: 'achievement' | 'milestone' | 'community';
    condition: (user: FirestoreUserData) => boolean;
}

export const BADGES: Badge[] = [
    // Milestones
    {
        id: 'first_steps',
        name: 'First Steps',
        description: 'Completed your first lesson',
        icon: 'Footprints',
        category: 'milestone',
        condition: (user) => user.totalLessonsCompleted >= 1
    },
    {
        id: 'getting_serious',
        name: 'Getting Serious',
        description: 'Completed 10 lessons',
        icon: 'BookOpen',
        category: 'milestone',
        condition: (user) => user.totalLessonsCompleted >= 10
    },
    {
        id: 'dedicated_learner',
        name: 'Dedicated Learner',
        description: 'Completed 50 lessons',
        icon: 'GraduationCap',
        category: 'milestone',
        condition: (user) => user.totalLessonsCompleted >= 50
    },

    // Streaks
    {
        id: 'week_streak',
        name: 'Week Warrior',
        description: 'Maintained a 7-day streak',
        icon: 'Flame',
        category: 'achievement',
        condition: (user) => user.streak >= 7
    },
    {
        id: 'month_streak',
        name: 'Monthly Master',
        description: 'Maintained a 30-day streak',
        icon: 'Calendar',
        category: 'achievement',
        condition: (user) => user.streak >= 30
    },

    // Social
    {
        id: 'social_butterfly',
        name: 'Social Butterfly',
        description: 'Gained 10 followers',
        icon: 'Users',
        category: 'community',
        condition: (user) => user.followers >= 10
    },
    {
        id: 'influencer',
        name: 'Influencer',
        description: 'Gained 100 followers',
        icon: 'Star',
        category: 'community',
        condition: (user) => user.followers >= 100
    },

    // Content
    {
        id: 'content_creator',
        name: 'Content Creator',
        description: 'Created 5 posts',
        icon: 'PenTool',
        category: 'community',
        condition: (user) => user.postsCount >= 5
    }
];

export function getUnlockedBadges(user: FirestoreUserData): Badge[] {
    return BADGES.filter(badge => badge.condition(user));
}

export function getBadgeById(id: string): Badge | undefined {
    return BADGES.find(b => b.id === id);
}
