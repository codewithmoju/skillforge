import { StreakData } from '../types/gamification';

/**
 * Calculate streak multiplier based on current streak
 */
export function getStreakMultiplier(streak: number): number {
    if (streak >= 365) return 3.0;
    if (streak >= 90) return 2.0;
    if (streak >= 30) return 1.5;
    if (streak >= 7) return 1.25;
    return 1.0;
}

/**
 * Check if streak should continue based on last activity
 */
export function shouldContinueStreak(lastActivityDate: Date): boolean {
    const now = new Date();
    const lastActivity = new Date(lastActivityDate);

    // Reset time to start of day for comparison
    now.setHours(0, 0, 0, 0);
    lastActivity.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(now.getTime() - lastActivity.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Streak continues if activity was today or yesterday
    return diffDays <= 1;
}

/**
 * Update streak data based on new activity
 */
export function updateStreak(currentStreakData: StreakData): StreakData {
    const now = new Date();
    const shouldContinue = shouldContinueStreak(currentStreakData.lastActivityDate);

    let newStreak: number;

    if (shouldContinue) {
        // Check if this is a new day
        const lastActivity = new Date(currentStreakData.lastActivityDate);
        lastActivity.setHours(0, 0, 0, 0);
        now.setHours(0, 0, 0, 0);

        if (now.getTime() > lastActivity.getTime()) {
            // New day, increment streak
            newStreak = currentStreakData.currentStreak + 1;
        } else {
            // Same day, keep streak
            newStreak = currentStreakData.currentStreak;
        }
    } else {
        // Streak broken, reset to 1
        newStreak = 1;
    }

    return {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, currentStreakData.longestStreak),
        lastActivityDate: new Date(),
        multiplier: getStreakMultiplier(newStreak),
    };
}

/**
 * Calculate XP with streak multiplier applied
 */
export function applyStreakMultiplier(baseXp: number, streak: number): number {
    const multiplier = getStreakMultiplier(streak);
    return Math.floor(baseXp * multiplier);
}

/**
 * Get streak milestone rewards
 */
export function getStreakMilestoneReward(streak: number): number {
    const milestones = [7, 30, 90, 180, 365];

    if (milestones.includes(streak)) {
        switch (streak) {
            case 7: return 100;
            case 30: return 300;
            case 90: return 900;
            case 180: return 1800;
            case 365: return 3600;
            default: return 0;
        }
    }

    return 0;
}

/**
 * Initialize streak data for new users
 */
export function initializeStreak(): StreakData {
    return {
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: new Date(),
        multiplier: 1.0,
    };
}
