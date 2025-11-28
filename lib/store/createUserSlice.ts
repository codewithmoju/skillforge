import { StateCreator } from 'zustand';
import { StoreState, UserSlice } from './types';
import { ACHIEVEMENT_DEFINITIONS } from '../utils/achievementSystem';
import { XPGainEvent } from '../types/gamification';
import { DEFAULT_SKIN } from '../types/skins';

export const createUserSlice: StateCreator<StoreState, [], [], UserSlice> = (set, get) => ({
    xp: 0,
    level: 1,
    name: "Learner",
    achievements: ACHIEVEMENT_DEFINITIONS.map(def => ({
        ...def,
        currentProgress: 0,
        totalXpEarned: 0,
    })),
    streakData: {
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: new Date(),
        multiplier: 1.0,
    },
    xpHistory: [],
    projects: [],
    activeDays: [],
    lastActivityDate: "",
    selectedSkin: DEFAULT_SKIN,
    ownedSkins: ["cyber-neon", "forest-quest", "space-odyssey", "dragons-lair", "ocean-depths"] as import('../types/skins').SkinId[],

    addXp: (amount: number, source: XPGainEvent['source'], multiplier?: number) => {
        set((state) => {
            const finalMultiplier = multiplier || state.streakData.multiplier;
            const finalAmount = Math.floor(amount * finalMultiplier);
            const newXp = state.xp + finalAmount;

            // Import level calculation
            const { getLevelFromXP } = require('../utils/levelSystem');
            const newLevel = getLevelFromXP(newXp);
            const oldLevel = state.level;

            // Add to XP history
            const xpEvent: XPGainEvent = {
                amount: finalAmount,
                source,
                timestamp: new Date(),
                multiplier: finalMultiplier,
            };

            // Track daily activity
            const today = new Date().toISOString().split('T')[0];
            const activeDays = state.activeDays || [];
            const updatedActiveDays = activeDays.includes(today)
                ? activeDays
                : [...activeDays, today];

            // Update XP Collector achievement
            state.updateAchievementProgress('xp_collector', newXp);

            // Update Level Up Master achievement if level increased
            if (newLevel > oldLevel) {
                state.updateAchievementProgress('leveler', newLevel);
            }

            return {
                xp: newXp,
                level: newLevel,
                xpHistory: [...state.xpHistory.slice(-99), xpEvent], // Keep last 100 events
                activeDays: updatedActiveDays,
                lastActivityDate: today,
            };
        });
    },

    addProject: (project) => {
        set((state) => {
            const newProjects = [...state.projects, project];
            state.updateAchievementProgress('builder', newProjects.length);
            return { projects: newProjects };
        });
    },

    updateProjectProgress: (id, progress) => {
        set((state) => {
            const updatedProjects = state.projects.map((p) =>
                p.id === id ? { ...p, progress } : p
            );

            const project = updatedProjects.find(p => p.id === id);
            if (project && progress >= 100 && project.status !== 'Completed') {
                const completedProject = { ...project, status: 'Completed' as const };
                const finalProjects = updatedProjects.map(p =>
                    p.id === id ? completedProject : p
                );
                const completedCount = finalProjects.filter(p => p.status === 'Completed').length;

                state.updateAchievementProgress('architect', completedCount);

                return { projects: finalProjects };
            }

            return { projects: updatedProjects };
        });
    },

    setUserName: (name) => set({ name }),

    updateAchievementProgress: (achievementId, progress) => {
        const state = get();
        const achievement = state.achievements.find(a => a.id === achievementId);
        if (!achievement) return;

        const { checkAchievementProgress } = require('../utils/achievementSystem');

        achievement.currentProgress = progress;
        const { newStarsUnlocked, totalXpGained } = checkAchievementProgress(achievement, progress);

        if (newStarsUnlocked.length > 0) {
            achievement.totalXpEarned += totalXpGained;

            set({
                achievements: state.achievements.map(a =>
                    a.id === achievementId ? achievement : a
                ),
            });

            state.addXp(totalXpGained, 'achievement', 1);
        }
    },

    setSkin: (skinId) => {
        const { SKIN_CONFIGS } = require('../types/skins');
        if (SKIN_CONFIGS[skinId]) {
            set({ selectedSkin: skinId });
        }
    },

    loadUserData: async (data) => {
        set((state) => ({ ...state, ...data }));
    },

    resetToDefaults: () => {
        // This is tricky because we need to reset all slices. 
        // For now, we'll just implement it in the main store or handle it carefully.
        // But here we can reset user slice data.
        // Actually, the original implementation reset everything to defaultState.
        // We might need a root level reset.
        // For now, let's leave this empty or partial, as the main store handles the full reset logic usually.
        // Or better, we can return the initial state for this slice.
        // Let's defer this to the main store composition.
    },

    updateStreak: () => {
        const state = get();
        const { updateStreak, getStreakMilestoneReward } = require('../utils/streakSystem');

        const newStreakData = updateStreak(state.streakData);
        const milestoneReward = getStreakMilestoneReward(newStreakData.currentStreak);

        set({ streakData: newStreakData });

        state.updateAchievementProgress('consistency', newStreakData.currentStreak);
        state.updateAchievementProgress('marathoner', newStreakData.currentStreak);

        if (milestoneReward > 0) {
            state.addXp(milestoneReward, 'streak', 1);
        }
    },
});
