// Gamification System Types

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type AchievementCategory = 'generation' | 'completion' | 'engagement' | 'social' | 'special';

export interface AchievementStar {
    star: 1 | 2 | 3 | 4 | 5;
    requirement: number;
    xpReward: number;
    unlocked: boolean;
    unlockedAt?: Date;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    category: AchievementCategory;
    rarity: AchievementRarity;
    icon: string;
    stars: AchievementStar[];
    currentProgress: number;
    totalXpEarned: number;
}

export interface LevelTier {
    minLevel: number;
    maxLevel: number;
    title: string;
    color: string;
    glowIntensity: 'minimal' | 'slight' | 'medium' | 'strong' | 'intense' | 'epic' | 'legendary';
    unlocks: string[];
}

export interface UserLevel {
    level: number;
    currentXp: number;
    xpToNextLevel: number;
    tier: LevelTier;
    totalXpEarned: number;
}

export interface XPGainEvent {
    amount: number;
    source: 'roadmap_generation' | 'roadmap_completion' | 'module_completion' | 'lesson_completion' | 'achievement' | 'streak' | 'daily_login' | 'social';
    timestamp: Date;
    multiplier?: number;
}

export interface StreakData {
    currentStreak: number;
    longestStreak: number;
    lastActivityDate: Date;
    multiplier: number;
}
