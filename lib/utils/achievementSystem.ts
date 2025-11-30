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
        description: 'Joined during the Beta phase',
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

    // LESSON COMPLETION ACHIEVEMENTS
    {
        id: 'student',
        name: 'Eager Student',
        description: 'Completed individual lessons',
        category: 'completion',
        rarity: 'common',
        icon: '📚',
        stars: [
            { star: 1, requirement: 10, xpReward: 50, unlocked: false },
            { star: 2, requirement: 50, xpReward: 150, unlocked: false },
            { star: 3, requirement: 100, xpReward: 400, unlocked: false },
            { star: 4, requirement: 250, xpReward: 1000, unlocked: false },
            { star: 5, requirement: 500, xpReward: 2500, unlocked: false },
        ],
    },
    {
        id: 'scholar',
        name: 'Master Scholar',
        description: 'Completed lessons across multiple roadmaps',
        category: 'completion',
        rarity: 'epic',
        icon: '🎓',
        stars: [
            { star: 1, requirement: 25, xpReward: 200, unlocked: false },
            { star: 2, requirement: 75, xpReward: 500, unlocked: false },
            { star: 3, requirement: 150, xpReward: 1200, unlocked: false },
            { star: 4, requirement: 300, xpReward: 2400, unlocked: false },
            { star: 5, requirement: 500, xpReward: 4800, unlocked: false },
        ],
    },

    // PROJECT ACHIEVEMENTS
    {
        id: 'builder',
        name: 'Project Builder',
        description: 'Created and managed projects',
        category: 'generation',
        rarity: 'rare',
        icon: '🏗️',
        stars: [
            { star: 1, requirement: 1, xpReward: 150, unlocked: false },
            { star: 2, requirement: 3, xpReward: 350, unlocked: false },
            { star: 3, requirement: 10, xpReward: 800, unlocked: false },
            { star: 4, requirement: 25, xpReward: 1800, unlocked: false },
            { star: 5, requirement: 50, xpReward: 3500, unlocked: false },
        ],
    },
    {
        id: 'architect',
        name: 'Master Architect',
        description: 'Completed projects successfully',
        category: 'completion',
        rarity: 'epic',
        icon: '🏛️',
        stars: [
            { star: 1, requirement: 1, xpReward: 300, unlocked: false },
            { star: 2, requirement: 5, xpReward: 700, unlocked: false },
            { star: 3, requirement: 15, xpReward: 1500, unlocked: false },
            { star: 4, requirement: 30, xpReward: 3000, unlocked: false },
            { star: 5, requirement: 50, xpReward: 6000, unlocked: false },
        ],
    },

    // DAILY ACTIVITY ACHIEVEMENTS
    {
        id: 'daily_learner',
        name: 'Daily Learner',
        description: 'Active learning days',
        category: 'engagement',
        rarity: 'common',
        icon: '📅',
        stars: [
            { star: 1, requirement: 5, xpReward: 75, unlocked: false },
            { star: 2, requirement: 15, xpReward: 200, unlocked: false },
            { star: 3, requirement: 30, xpReward: 500, unlocked: false },
            { star: 4, requirement: 60, xpReward: 1200, unlocked: false },
            { star: 5, requirement: 100, xpReward: 2500, unlocked: false },
        ],
    },
    {
        id: 'weekend_warrior',
        name: 'Weekend Warrior',
        description: 'Completed roadmaps on weekends',
        category: 'engagement',
        rarity: 'rare',
        icon: '🎮',
        stars: [
            { star: 1, requirement: 1, xpReward: 100, unlocked: false },
            { star: 2, requirement: 5, xpReward: 300, unlocked: false },
            { star: 3, requirement: 15, xpReward: 700, unlocked: false },
            { star: 4, requirement: 30, xpReward: 1500, unlocked: false },
            { star: 5, requirement: 50, xpReward: 3000, unlocked: false },
        ],
    },

    // SOCIAL POST ACHIEVEMENTS
    {
        id: 'storyteller',
        name: 'Storyteller',
        description: 'Shared posts with the community',
        category: 'social',
        rarity: 'common',
        icon: '📝',
        stars: [
            { star: 1, requirement: 1, xpReward: 50, unlocked: false },
            { star: 2, requirement: 5, xpReward: 150, unlocked: false },
            { star: 3, requirement: 20, xpReward: 400, unlocked: false },
            { star: 4, requirement: 50, xpReward: 1000, unlocked: false },
            { star: 5, requirement: 100, xpReward: 2500, unlocked: false },
        ],
    },
    {
        id: 'trendsetter',
        name: 'Trendsetter',
        description: 'Posts that received high engagement',
        category: 'social',
        rarity: 'epic',
        icon: '📈',
        stars: [
            { star: 1, requirement: 10, xpReward: 200, unlocked: false }, // 10 likes on a post
            { star: 2, requirement: 25, xpReward: 500, unlocked: false }, // 25 likes on a post
            { star: 3, requirement: 50, xpReward: 1200, unlocked: false }, // 50 likes on a post
            { star: 4, requirement: 100, xpReward: 2400, unlocked: false }, // 100 likes on a post
            { star: 5, requirement: 250, xpReward: 4800, unlocked: false }, // 250 likes on a post
        ],
    },
    {
        id: 'appreciator',
        name: 'Community Appreciator',
        description: 'Liked posts from other learners',
        category: 'social',
        rarity: 'common',
        icon: '❤️',
        stars: [
            { star: 1, requirement: 5, xpReward: 30, unlocked: false },
            { star: 2, requirement: 25, xpReward: 100, unlocked: false },
            { star: 3, requirement: 100, xpReward: 300, unlocked: false },
            { star: 4, requirement: 250, xpReward: 800, unlocked: false },
            { star: 5, requirement: 500, xpReward: 2000, unlocked: false },
        ],
    },
    {
        id: 'commentator',
        name: 'Active Commentator',
        description: 'Engaged with thoughtful comments',
        category: 'social',
        rarity: 'rare',
        icon: '💬',
        stars: [
            { star: 1, requirement: 5, xpReward: 75, unlocked: false },
            { star: 2, requirement: 20, xpReward: 200, unlocked: false },
            { star: 3, requirement: 50, xpReward: 500, unlocked: false },
            { star: 4, requirement: 100, xpReward: 1200, unlocked: false },
            { star: 5, requirement: 200, xpReward: 2800, unlocked: false },
        ],
    },
    {
        id: 'bookmarker',
        name: 'Knowledge Collector',
        description: 'Saved posts for later learning',
        category: 'social',
        rarity: 'common',
        icon: '🔖',
        stars: [
            { star: 1, requirement: 5, xpReward: 40, unlocked: false },
            { star: 2, requirement: 20, xpReward: 120, unlocked: false },
            { star: 3, requirement: 50, xpReward: 350, unlocked: false },
            { star: 4, requirement: 100, xpReward: 900, unlocked: false },
            { star: 5, requirement: 200, xpReward: 2200, unlocked: false },
        ],
    },

    // FOLLOW/SOCIAL NETWORK ACHIEVEMENTS
    {
        id: 'networker',
        name: 'Network Builder',
        description: 'Followed other learners',
        category: 'social',
        rarity: 'common',
        icon: '👥',
        stars: [
            { star: 1, requirement: 5, xpReward: 50, unlocked: false },
            { star: 2, requirement: 15, xpReward: 150, unlocked: false },
            { star: 3, requirement: 30, xpReward: 400, unlocked: false },
            { star: 4, requirement: 50, xpReward: 1000, unlocked: false },
            { star: 5, requirement: 100, xpReward: 2500, unlocked: false },
        ],
    },
    {
        id: 'learning_influencer',
        name: 'Learning Influencer',
        description: 'Gained followers in the community',
        category: 'social',
        rarity: 'epic',
        icon: '⭐',
        stars: [
            { star: 1, requirement: 10, xpReward: 200, unlocked: false },
            { star: 2, requirement: 25, xpReward: 500, unlocked: false },
            { star: 3, requirement: 50, xpReward: 1200, unlocked: false },
            { star: 4, requirement: 100, xpReward: 2400, unlocked: false },
            { star: 5, requirement: 250, xpReward: 4800, unlocked: false },
        ],
    },

    // CHALLENGE ACHIEVEMENTS
    {
        id: 'challenger',
        name: 'Challenge Seeker',
        description: 'Participated in learning challenges',
        category: 'engagement',
        rarity: 'rare',
        icon: '🎯',
        stars: [
            { star: 1, requirement: 1, xpReward: 150, unlocked: false },
            { star: 2, requirement: 3, xpReward: 350, unlocked: false },
            { star: 3, requirement: 10, xpReward: 800, unlocked: false },
            { star: 4, requirement: 20, xpReward: 1800, unlocked: false },
            { star: 5, requirement: 50, xpReward: 3500, unlocked: false },
        ],
    },
    {
        id: 'champion',
        name: 'Challenge Champion',
        description: 'Completed challenges successfully',
        category: 'completion',
        rarity: 'epic',
        icon: '🏆',
        stars: [
            { star: 1, requirement: 1, xpReward: 300, unlocked: false },
            { star: 2, requirement: 5, xpReward: 700, unlocked: false },
            { star: 3, requirement: 15, xpReward: 1500, unlocked: false },
            { star: 4, requirement: 30, xpReward: 3000, unlocked: false },
            { star: 5, requirement: 50, xpReward: 6000, unlocked: false },
        ],
    },

    // XP & LEVEL ACHIEVEMENTS
    {
        id: 'leveler',
        name: 'Level Up Master',
        description: 'Reached higher levels',
        category: 'engagement',
        rarity: 'rare',
        icon: '⬆️',
        stars: [
            { star: 1, requirement: 5, xpReward: 200, unlocked: false },
            { star: 2, requirement: 10, xpReward: 500, unlocked: false },
            { star: 3, requirement: 20, xpReward: 1200, unlocked: false },
            { star: 4, requirement: 30, xpReward: 2400, unlocked: false },
            { star: 5, requirement: 50, xpReward: 4800, unlocked: false },
        ],
    },
    {
        id: 'xp_collector',
        name: 'XP Collector',
        description: 'Accumulated total XP',
        category: 'engagement',
        rarity: 'epic',
        icon: '💎',
        stars: [
            { star: 1, requirement: 1000, xpReward: 100, unlocked: false },
            { star: 2, requirement: 5000, xpReward: 300, unlocked: false },
            { star: 3, requirement: 10000, xpReward: 900, unlocked: false },
            { star: 4, requirement: 25000, xpReward: 1800, unlocked: false },
            { star: 5, requirement: 50000, xpReward: 3600, unlocked: false },
        ],
    },

    // SPECIAL MILESTONE ACHIEVEMENTS
    {
        id: 'centurion',
        name: 'Centurion',
        description: 'Completed 100 lessons',
        category: 'special',
        rarity: 'legendary',
        icon: '💯',
        stars: [
            { star: 5, requirement: 100, xpReward: 3000, unlocked: false },
        ],
    },
    {
        id: 'marathoner',
        name: 'Marathon Learner',
        description: 'Maintained a 100-day streak',
        category: 'special',
        rarity: 'legendary',
        icon: '🏃',
        stars: [
            { star: 5, requirement: 100, xpReward: 4000, unlocked: false },
        ],
    },
    {
        id: 'jack_of_all_trades',
        name: 'Jack of All Trades',
        description: 'Generated roadmaps in 15+ different categories',
        category: 'special',
        rarity: 'legendary',
        icon: '🎪',
        stars: [
            { star: 5, requirement: 15, xpReward: 3500, unlocked: false },
        ],
    },
    {
        id: 'social_butterfly',
        name: 'Social Butterfly',
        description: 'Reached 500 total social interactions (likes + comments + follows)',
        category: 'special',
        rarity: 'legendary',
        icon: '🦋',
        stars: [
            { star: 5, requirement: 500, xpReward: 3000, unlocked: false },
        ],
    },
    {
        id: 'midnight_learner',
        name: 'Midnight Learner',
        description: 'Completed a lesson between midnight and 2 AM',
        category: 'special',
        rarity: 'rare',
        icon: '🌙',
        stars: [
            { star: 3, requirement: 1, xpReward: 500, unlocked: false },
        ],
    },
    {
        id: 'early_riser',
        name: 'Early Riser',
        description: 'Completed a lesson between 5 AM and 7 AM',
        category: 'special',
        rarity: 'rare',
        icon: '🌅',
        stars: [
            { star: 3, requirement: 1, xpReward: 500, unlocked: false },
        ],
    },
    {
        id: 'weekend_learner',
        name: 'Weekend Devotee',
        description: 'Completed 10 roadmaps on weekends',
        category: 'special',
        rarity: 'epic',
        icon: '🎉',
        stars: [
            { star: 5, requirement: 10, xpReward: 2500, unlocked: false },
        ],
    },
    {
        id: 'first_blood',
        name: 'First Blood',
        description: 'Completed your very first lesson',
        category: 'special',
        rarity: 'common',
        icon: '🎯',
        stars: [
            { star: 1, requirement: 1, xpReward: 100, unlocked: false },
        ],
    },
    {
        id: 'hundred_club',
        name: 'Hundred Club',
        description: 'Reached 100 total roadmaps generated',
        category: 'special',
        rarity: 'legendary',
        icon: '💯',
        stars: [
            { star: 5, requirement: 100, xpReward: 5000, unlocked: false },
        ],
    },
    {
        id: 'veteran',
        name: 'Veteran Learner',
        description: 'Been active for 6 months',
        category: 'special',
        rarity: 'legendary',
        icon: '🎖️',
        stars: [
            { star: 5, requirement: 180, xpReward: 4000, unlocked: false },
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

/**
 * Get achievement guidance/tips for unlocking
 */
export function getAchievementGuidance(achievement: Achievement): string {
    const nextStar = getNextStarRequirement(achievement);
    const currentProgress = achievement.currentProgress;
    const remaining = nextStar ? nextStar.requirement - currentProgress : 0;

    // Generate guidance based on achievement ID
    const guidanceMap: Record<string, string> = {
        // Generation achievements
        'pathfinder': `Generate roadmaps to unlock stars. ${nextStar ? `You need ${remaining} more roadmap${remaining !== 1 ? 's' : ''} for the next star.` : 'Keep generating roadmaps to earn more stars!'}`,
        'specialist': `Explore different categories when generating roadmaps. ${nextStar ? `You need ${remaining} more unique domain${remaining !== 1 ? 's' : ''} for the next star.` : 'Try generating roadmaps in various fields!'}`,
        'builder': `Create projects to track your learning journey. ${nextStar ? `You need ${remaining} more project${remaining !== 1 ? 's' : ''} for the next star.` : 'Keep building amazing projects!'}`,

        // Completion achievements
        'finisher': `Complete entire roadmaps from start to finish. ${nextStar ? `You need ${remaining} more completion${remaining !== 1 ? 's' : ''} for the next star.` : 'Focus on finishing what you start!'}`,
        'speedrunner': `Complete roadmaps quickly (under 7 days) to unlock stars. ${nextStar ? `You need ${remaining} more fast completion${remaining !== 1 ? 's' : ''} for the next star.` : 'Speed up your learning pace!'}`,
        'student': `Complete individual lessons to progress. ${nextStar ? `You need ${remaining} more lesson${remaining !== 1 ? 's' : ''} for the next star.` : 'Every lesson counts!'}`,
        'scholar': `Complete lessons across multiple roadmaps. ${nextStar ? `You need ${remaining} more lesson${remaining !== 1 ? 's' : ''} for the next star.` : 'Diversify your learning!'}`,
        'architect': `Finish your projects completely. ${nextStar ? `You need ${remaining} more completed project${remaining !== 1 ? 's' : ''} for the next star.` : 'Complete your projects to unlock this!'}`,

        // Engagement achievements
        'consistency': `Maintain your learning streak by being active daily. ${nextStar ? `You need ${remaining} more day${remaining !== 1 ? 's' : ''} for the next star.` : 'Keep the streak alive!'}`,
        'explorer': `View and explore different roadmaps. ${nextStar ? `You need ${remaining} more roadmap view${remaining !== 1 ? 's' : ''} for the next star.` : 'Explore more learning paths!'}`,
        'daily_learner': `Be active on different days. ${nextStar ? `You need ${remaining} more active day${remaining !== 1 ? 's' : ''} for the next star.` : 'Come back daily to progress!'}`,
        'weekend_warrior': `Complete roadmaps on weekends (Saturday or Sunday). ${nextStar ? `You need ${remaining} more weekend completion${remaining !== 1 ? 's' : ''} for the next star.` : 'Learn even on weekends!'}`,
        'leveler': `Earn XP to level up. ${nextStar ? `You need to reach level ${nextStar.requirement} for the next star.` : 'Keep leveling up!'}`,
        'xp_collector': `Accumulate total XP through all activities. ${nextStar ? `You need ${remaining.toLocaleString()} more XP for the next star.` : 'Keep earning XP!'}`,

        // Social achievements
        'influencer': `Share your roadmaps with the community by creating posts. ${nextStar ? `You need ${remaining} more share${remaining !== 1 ? 's' : ''} for the next star.` : 'Share your learning journey!'}`,
        'storyteller': `Create posts to share your experiences. ${nextStar ? `You need ${remaining} more post${remaining !== 1 ? 's' : ''} for the next star.` : 'Tell your story!'}`,
        'trendsetter': `Create posts that get high engagement (likes). ${nextStar ? `You need a post with ${nextStar.requirement} likes for the next star.` : 'Create engaging content!'}`,
        'appreciator': `Like posts from other learners. ${nextStar ? `You need ${remaining} more like${remaining !== 1 ? 's' : ''} for the next star.` : 'Show appreciation to others!'}`,
        'commentator': `Engage with thoughtful comments. ${nextStar ? `You need ${remaining} more comment${remaining !== 1 ? 's' : ''} for the next star.` : 'Join the conversation!'}`,
        'bookmarker': `Save posts for later learning. ${nextStar ? `You need ${remaining} more save${remaining !== 1 ? 's' : ''} for the next star.` : 'Build your knowledge library!'}`,
        'networker': `Follow other learners in the community. ${nextStar ? `You need ${remaining} more follow${remaining !== 1 ? 's' : ''} for the next star.` : 'Build your network!'}`,
        'learning_influencer': `Gain followers by sharing valuable content. ${nextStar ? `You need ${remaining} more follower${remaining !== 1 ? 's' : ''} for the next star.` : 'Become an influencer!'}`,
        'collaborator': `Participate in group learning activities. ${nextStar ? `You need ${remaining} more group${remaining !== 1 ? 's' : ''} for the next star.` : 'Join group activities!'}`,

        // Challenge achievements
        'challenger': `Join learning challenges. ${nextStar ? `You need ${remaining} more challenge${remaining !== 1 ? 's' : ''} for the next star.` : 'Take on challenges!'}`,
        'champion': `Complete challenges successfully. ${nextStar ? `You need ${remaining} more completion${remaining !== 1 ? 's' : ''} for the next star.` : 'Win challenges!'}`,

        // Special achievements
        'pioneer': 'Be among the first 100 users to join the platform. This is a one-time achievement!',
        'perfectionist': `Complete roadmaps with 100% completion (all nodes finished). ${nextStar ? `You need ${remaining} more perfect completion${remaining !== 1 ? 's' : ''} for the next star.` : 'Aim for perfection!'}`,
        'night_owl': 'Generate a roadmap between midnight and 2 AM to unlock this achievement.',
        'early_bird': 'Generate a roadmap at 6 AM to unlock this achievement.',
        'polymath': `Complete roadmaps in different categories. ${nextStar ? `You need ${remaining} more category${remaining !== 1 ? 'ies' : 'y'} for the next star.` : 'Master multiple domains!'}`,
        'centurion': `Complete 100 lessons total. ${nextStar ? `You need ${remaining} more lesson${remaining !== 1 ? 's' : ''} for the next star.` : 'Reach the century mark!'}`,
        'marathoner': `Maintain a 100-day learning streak. ${nextStar ? `You need ${remaining} more day${remaining !== 1 ? 's' : ''} for the next star.` : 'Run the marathon!'}`,
        'jack_of_all_trades': `Generate roadmaps in 15+ different categories. ${nextStar ? `You need ${remaining} more category${remaining !== 1 ? 'ies' : 'y'} for the next star.` : 'Explore all domains!'}`,
        'social_butterfly': `Engage socially (likes + comments + follows). ${nextStar ? `You need ${remaining} more interaction${remaining !== 1 ? 's' : ''} for the next star.` : 'Be social!'}`,
        'midnight_learner': 'Complete a lesson between midnight and 2 AM to unlock this achievement.',
        'early_riser': 'Complete a lesson between 5 AM and 7 AM to unlock this achievement.',
        'weekend_learner': `Complete roadmaps on weekends. ${nextStar ? `You need ${remaining} more weekend completion${remaining !== 1 ? 's' : ''} for the next star.` : 'Learn on weekends!'}`,
        'first_blood': 'Complete your very first lesson to unlock this achievement. You\'re almost there!',
        'hundred_club': `Generate 100 roadmaps total. ${nextStar ? `You need ${remaining} more roadmap${remaining !== 1 ? 's' : ''} for the next star.` : 'Join the elite club!'}`,
        'veteran': `Stay active for 6 months (180 days). ${nextStar ? `You need ${remaining} more day${remaining !== 1 ? 's' : ''} for the next star.` : 'Become a veteran!'}`,
    };

    // Return specific guidance or default
    const guidance = guidanceMap[achievement.id];
    if (guidance) {
        return guidance;
    }

    // Default guidance
    return `Keep working towards this achievement! ${nextStar ? `You need ${remaining} more progress for the next star.` : 'You\'ve mastered this achievement!'}`;
}
