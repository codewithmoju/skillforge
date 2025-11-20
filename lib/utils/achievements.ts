export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    requirement: number;
    type: 'xp' | 'lessons' | 'projects' | 'streak' | 'roadmaps';
    unlockedAt?: string;
}

export const ACHIEVEMENTS: Achievement[] = [
    // XP Achievements
    { id: 'xp_100', title: 'First Steps', description: 'Earn 100 XP', icon: '🌱', requirement: 100, type: 'xp' },
    { id: 'xp_500', title: 'Rising Star', description: 'Earn 500 XP', icon: '⭐', requirement: 500, type: 'xp' },
    { id: 'xp_1000', title: 'Knowledge Seeker', description: 'Earn 1,000 XP', icon: '🔥', requirement: 1000, type: 'xp' },
    { id: 'xp_5000', title: 'Expert Learner', description: 'Earn 5,000 XP', icon: '💎', requirement: 5000, type: 'xp' },
    { id: 'xp_10000', title: 'Master', description: 'Earn 10,000 XP', icon: '👑', requirement: 10000, type: 'xp' },

    // Streak Achievements
    { id: 'streak_3', title: 'Consistent', description: '3 day streak', icon: '🔥', requirement: 3, type: 'streak' },
    { id: 'streak_7', title: 'Dedicated', description: '7 day streak', icon: '⚡', requirement: 7, type: 'streak' },
    { id: 'streak_30', title: 'Unstoppable', description: '30 day streak', icon: '🚀', requirement: 30, type: 'streak' },
    { id: 'streak_100', title: 'Legend', description: '100 day streak', icon: '🏆', requirement: 100, type: 'streak' },

    // Lessons Achievements
    { id: 'lessons_10', title: 'Quick Learner', description: 'Complete 10 lessons', icon: '📚', requirement: 10, type: 'lessons' },
    { id: 'lessons_50', title: 'Bookworm', description: 'Complete 50 lessons', icon: '📖', requirement: 50, type: 'lessons' },
    { id: 'lessons_100', title: 'Scholar', description: 'Complete 100 lessons', icon: '🎓', requirement: 100, type: 'lessons' },

    // Roadmaps Achievements
    { id: 'roadmaps_1', title: 'Pathfinder', description: 'Complete 1 roadmap', icon: '🗺️', requirement: 1, type: 'roadmaps' },
    { id: 'roadmaps_5', title: 'Explorer', description: 'Complete 5 roadmaps', icon: '🧭', requirement: 5, type: 'roadmaps' },
    { id: 'roadmaps_10', title: 'Adventurer', description: 'Complete 10 roadmaps', icon: '🌟', requirement: 10, type: 'roadmaps' },

    // Projects Achievements
    { id: 'projects_1', title: 'Builder', description: 'Create 1 project', icon: '🔨', requirement: 1, type: 'projects' },
    { id: 'projects_5', title: 'Creator', description: 'Create 5 projects', icon: '🎨', requirement: 5, type: 'projects' },
    { id: 'projects_10', title: 'Architect', description: 'Create 10 projects', icon: '🏗️', requirement: 10, type: 'projects' },
];

export function checkAchievements(
    xp: number,
    streak: number,
    totalLessons: number,
    completedRoadmaps: number,
    projectCount: number,
    unlockedAchievements: string[]
): Achievement[] {
    const newlyUnlocked: Achievement[] = [];

    ACHIEVEMENTS.forEach(achievement => {
        if (unlockedAchievements.includes(achievement.id)) return;

        let isUnlocked = false;

        switch (achievement.type) {
            case 'xp':
                isUnlocked = xp >= achievement.requirement;
                break;
            case 'streak':
                isUnlocked = streak >= achievement.requirement;
                break;
            case 'lessons':
                isUnlocked = totalLessons >= achievement.requirement;
                break;
            case 'roadmaps':
                isUnlocked = completedRoadmaps >= achievement.requirement;
                break;
            case 'projects':
                isUnlocked = projectCount >= achievement.requirement;
                break;
        }

        if (isUnlocked) {
            newlyUnlocked.push({
                ...achievement,
                unlockedAt: new Date().toISOString(),
            });
        }
    });

    return newlyUnlocked;
}

export function calculateStreak(lastActive: string): number {
    const now = new Date();
    const lastActiveDate = new Date(lastActive);

    // Reset time to midnight for both dates
    now.setHours(0, 0, 0, 0);
    lastActiveDate.setHours(0, 0, 0, 0);

    const diffTime = now.getTime() - lastActiveDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // If last active was today or yesterday, maintain streak
    // If more than 1 day ago, streak is broken
    return diffDays;
}

export function shouldIncrementStreak(lastActive: string): boolean {
    const daysSinceActive = calculateStreak(lastActive);
    // Increment if last active was yesterday (1 day ago)
    return daysSinceActive === 1;
}

export function shouldResetStreak(lastActive: string): boolean {
    const daysSinceActive = calculateStreak(lastActive);
    // Reset if more than 1 day has passed
    return daysSinceActive > 1;
}
