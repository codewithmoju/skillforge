import { Achievement, AchievementCategory, AchievementRarity } from '../types/gamification';

/**
 * Achievement definitions with 5-star progression
 */
export const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'currentProgress' | 'totalXpEarned'>[] = [
    // ROADMAP GENERATION ACHIEVEMENTS
    {
        id: 'pathfinder',
        name: 'Pathfinder',
        description: 'Generated your first roadmap',
        category: 'generation',
        rarity: 'common',
        icon: '🗺️',
        stars: [
            { star: 1, requirement: 1, xpReward: 100, unlocked: false },
            { star: 2, requirement: 3, xpReward: 250, unlocked: false },
            { star: 3, requirement: 10, xpReward: 500, unlocked: false },
            { star: 4, requirement: 50, xpReward: 1000, unlocked: false },
            { star: 5, requirement: 100, xpReward: 2000, unlocked: false },
        ],
    },
    {
        id: 'specialist',
        name: 'Domain Expert',
        description: 'Generated roadmaps in multiple domains',
        category: 'generation',
        rarity: 'rare',
        icon: '🎯',
        stars: [
            { star: 1, requirement: 2, xpReward: 150, unlocked: false },
            { star: 2, requirement: 5, xpReward: 300, unlocked: false },
            { star: 3, requirement: 10, xpReward: 600, unlocked: false },
            { star: 4, requirement: 20, xpReward: 1200, unlocked: false },
            { star: 5, requirement: 50, xpReward: 2500, unlocked: false },
        ],
    },

    // ROADMAP COMPLETION ACHIEVEMENTS
    {
        id: 'finisher',
        name: 'Journey Complete',
        description: 'Completed entire roadmaps',
        category: 'completion',
        rarity: 'rare',
        icon: '✅',
        stars: [
            { star: 1, requirement: 1, xpReward: 200, unlocked: false },
            { star: 2, requirement: 3, xpReward: 400, unlocked: false },
            { star: 3, requirement: 10, xpReward: 800, unlocked: false },
            { star: 4, requirement: 25, xpReward: 1600, unlocked: false },
            { star: 5, requirement: 50, xpReward: 3200, unlocked: false },
        ],
    },
    {
        id: 'speedrunner',
        name: 'Quick Learner',
        description: 'Completed roadmaps in record time',
        category: 'completion',
        rarity: 'epic',
        icon: '⚡',
        stars: [
            { star: 1, requirement: 1, xpReward: 300, unlocked: false },
            { star: 2, requirement: 3, xpReward: 600, unlocked: false },
            { star: 3, requirement: 5, xpReward: 1200, unlocked: false },
            { star: 4, requirement: 10, xpReward: 2400, unlocked: false },
            { star: 5, requirement: 20, xpReward: 4800, unlocked: false },
        ],
    },

    // ENGAGEMENT ACHIEVEMENTS
    {
        id: 'consistency',
        name: 'Dedicated Scholar',
        description: 'Maintained learning streaks',
        category: 'engagement',
        rarity: 'epic',
        icon: '🔥',
        stars: [
            { star: 1, requirement: 7, xpReward: 100, unlocked: false },
            { star: 2, requirement: 30, xpReward: 300, unlocked: false },
            { star: 3, requirement: 90, xpReward: 900, unlocked: false },
            { star: 4, requirement: 180, xpReward: 1800, unlocked: false },
            { star: 5, requirement: 365, xpReward: 3600, unlocked: false },
        ],
    },
    {
        id: 'explorer',
        name: 'Curious Mind',
        description: 'Explored diverse learning paths',
        category: 'engagement',
        rarity: 'common',
        icon: '🌟',
        stars: [
            { star: 1, requirement: 10, xpReward: 50, unlocked: false },
            { star: 2, requirement: 25, xpReward: 150, unlocked: false },
            { star: 3, requirement: 50, xpReward: 400, unlocked: false },
            { star: 4, requirement: 100, xpReward: 1000, unlocked: false },
            { star: 5, requirement: 250, xpReward: 2500, unlocked: false },
        ],
    },

    // SOCIAL ACHIEVEMENTS
    {
        id: 'influencer',
        name: 'Knowledge Sharer',
        description: 'Shared roadmaps with community',
        category: 'social',
        rarity: 'rare',
        icon: '👥',
        stars: [
            { star: 1, requirement: 1, xpReward: 100, unlocked: false },
            { star: 2, requirement: 5, xpReward: 250, unlocked: false },
            { star: 3, requirement: 15, xpReward: 600, unlocked: false },
            { star: 4, requirement: 50, xpReward: 1500, unlocked: false },
            { star: 5, requirement: 100, xpReward: 3000, unlocked: false },
        ],
    },
    {
        id: 'collaborator',
        name: 'Team Player',
        description: 'Participated in group learning',
        category: 'social',
        rarity: 'rare',
        icon: '💬',
        stars: [
            { star: 1, requirement: 1, xpReward: 75, unlocked: false },
            { star: 2, requirement: 3, xpReward: 200, unlocked: false },
            { star: 3, requirement: 10, xpReward: 500, unlocked: false },
            { star: 4, requirement: 5, xpReward: 1200, unlocked: false }, // Created 5 groups
            { star: 5, requirement: 10, xpReward: 2800, unlocked: false }, // Led 10 groups
        ],
    },

    // SPECIAL ACHIEVEMENTS
    {
        id: 'pioneer',
        name: 'Pioneer',
        description: 'Among the first 100 users',
        category: 'special',
        rarity: 'legendary',
        icon: '🏅',
        stars: [
            { star: 5, requirement: 1, xpReward: 5000, unlocked: false },
        ],
    },
    {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: '100% completion on 10 roadmaps',
        category: 'special',
        rarity: 'legendary',
        icon: '💎',
        stars: [
            { star: 5, requirement: 10, xpReward: 4000, unlocked: false },
        ],
    },
    {
        id: 'night_owl',
        name: 'Night Owl',
        description: 'Generated roadmap at 3 AM',
        category: 'special',
        rarity: 'rare',
        icon: '🦉',
        stars: [
            { star: 3, requirement: 1, xpReward: 500, unlocked: false },
        ],
    },
    {
        id: 'early_bird',
        name: 'Early Bird',
        description: 'Generated roadmap at 6 AM',
        category: 'special',
        rarity: 'rare',
        icon: '🐦',
        stars: [
            { star: 3, requirement: 1, xpReward: 500, unlocked: false },
        ],
    },
    {
        id: 'polymath',
        name: 'Polymath',
        description: 'Completed roadmaps in 10+ different categories',
        category: 'special',
        rarity: 'legendary',
        icon: '🎓',
        stars: [
            { star: 5, requirement: 10, xpReward: 3500, unlocked: false },
        ],
    },
];

/**
 * Check achievement progress and unlock stars
 */
export function checkAchievementProgress(
    achievement: Achievement,
    currentProgress: number
): {
    newStarsUnlocked: number[];
    totalXpGained: number;
} {
    const newStarsUnlocked: number[] = [];
    let totalXpGained = 0;

    achievement.stars.forEach((star) => {
        if (!star.unlocked && currentProgress >= star.requirement) {
            star.unlocked = true;
            star.unlockedAt = new Date();
            newStarsUnlocked.push(star.star);
            totalXpGained += star.xpReward;
        }
    });

    return { newStarsUnlocked, totalXpGained };
}

/**
 * Get achievement by ID
 */
export function getAchievementById(id: string): Achievement | undefined {
    const definition = ACHIEVEMENT_DEFINITIONS.find((a) => a.id === id);
    if (!definition) return undefined;

    return {
        ...definition,
        currentProgress: 0,
        totalXpEarned: 0,
    };
}

/**
 * Get all achievements by category
 */
export function getAchievementsByCategory(category: AchievementCategory): Achievement[] {
    return ACHIEVEMENT_DEFINITIONS.filter((a) => a.category === category).map((def) => ({
        ...def,
        currentProgress: 0,
        totalXpEarned: 0,
    }));
}

/**
 * Calculate total stars earned for an achievement
 */
export function getTotalStarsEarned(achievement: Achievement): number {
    return achievement.stars.filter((s) => s.unlocked).length;
}

/**
 * Get next star requirement
 */
export function getNextStarRequirement(achievement: Achievement): {
    star: number;
    requirement: number;
    xpReward: number;
} | null {
    const nextStar = achievement.stars.find((s) => !s.unlocked);
    if (!nextStar) return null;

    return {
        star: nextStar.star,
        requirement: nextStar.requirement,
        xpReward: nextStar.xpReward,
    };
}
