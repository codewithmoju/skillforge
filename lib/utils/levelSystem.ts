import { LevelTier, UserLevel } from '../types/gamification';

// Level tier definitions
export const LEVEL_TIERS: LevelTier[] = [
    {
        minLevel: 1,
        maxLevel: 5,
        title: 'Novice Explorer',
        color: '#3b82f6',
        glowIntensity: 'minimal',
        unlocks: ['Basic roadmap generation (1 at a time)'],
    },
    {
        minLevel: 6,
        maxLevel: 10,
        title: 'Apprentice Learner',
        color: '#a855f7',
        glowIntensity: 'slight',
        unlocks: ['Multiple roadmaps (up to 3)'],
    },
    {
        minLevel: 11,
        maxLevel: 20,
        title: 'Skilled Navigator',
        color: '#06b6d4',
        glowIntensity: 'medium',
        unlocks: ['Advanced roadmap customization'],
    },
    {
        minLevel: 21,
        maxLevel: 35,
        title: 'Master Strategist',
        color: '#6366f1',
        glowIntensity: 'strong',
        unlocks: ['Community roadmap sharing'],
    },
    {
        minLevel: 36,
        maxLevel: 50,
        title: 'Elite Pathfinder',
        color: '#fbbf24',
        glowIntensity: 'intense',
        unlocks: ['Custom achievement creation'],
    },
    {
        minLevel: 51,
        maxLevel: 75,
        title: 'Legendary Sage',
        color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        glowIntensity: 'epic',
        unlocks: ['Mentor features', 'Exclusive badges'],
    },
    {
        minLevel: 76,
        maxLevel: 100,
        title: 'Grandmaster',
        color: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        glowIntensity: 'legendary',
        unlocks: ['All features', 'Special cosmetics'],
    },
];

/**
 * Calculate level from total XP using exponential growth formula
 */
export function getLevelFromXP(xp: number): number {
    if (xp < 2500) return Math.floor(xp / 500) + 1; // Levels 1-5
    if (xp < 5000) return Math.floor((xp - 2500) / 500) + 6; // Levels 6-10
    if (xp < 10000) return Math.floor((xp - 5000) / 500) + 11; // Levels 11-20
    if (xp < 20000) return Math.floor((xp - 10000) / 667) + 21; // Levels 21-35
    if (xp < 35000) return Math.floor((xp - 20000) / 1000) + 36; // Levels 36-50
    if (xp < 60000) return Math.floor((xp - 35000) / 1000) + 51; // Levels 51-75
    return Math.min(100, Math.floor((xp - 60000) / 1600) + 76); // Levels 76-100
}

/**
 * Calculate XP required for a specific level
 */
export function getXPForLevel(level: number): number {
    if (level <= 1) return 0;
    if (level <= 5) return (level - 1) * 500;
    if (level <= 10) return 2500 + (level - 6) * 500;
    if (level <= 20) return 5000 + (level - 11) * 500;
    if (level <= 35) return 10000 + (level - 21) * 667;
    if (level <= 50) return 20000 + (level - 36) * 1000;
    if (level <= 75) return 35000 + (level - 51) * 1000;
    return 60000 + (level - 76) * 1600;
}

/**
 * Get level tier for a given level
 */
export function getLevelTier(level: number): LevelTier {
    return LEVEL_TIERS.find(
        (tier) => level >= tier.minLevel && level <= tier.maxLevel
    ) || LEVEL_TIERS[0];
}

/**
 * Calculate user level data from total XP
 */
export function calculateUserLevel(totalXp: number): UserLevel {
    const level = getLevelFromXP(totalXp);
    const tier = getLevelTier(level);
    const currentLevelXp = getXPForLevel(level);
    const nextLevelXp = getXPForLevel(level + 1);
    const xpToNextLevel = nextLevelXp - totalXp;

    return {
        level,
        currentXp: totalXp - currentLevelXp,
        xpToNextLevel,
        tier,
        totalXpEarned: totalXp,
    };
}

/**
 * Check if user leveled up after gaining XP
 */
export function checkLevelUp(oldXp: number, newXp: number): {
    leveledUp: boolean;
    oldLevel: number;
    newLevel: number;
    tierChanged: boolean;
} {
    const oldLevel = getLevelFromXP(oldXp);
    const newLevel = getLevelFromXP(newXp);
    const leveledUp = newLevel > oldLevel;
    const tierChanged = leveledUp && getLevelTier(oldLevel).title !== getLevelTier(newLevel).title;

    return {
        leveledUp,
        oldLevel,
        newLevel,
        tierChanged,
    };
}
