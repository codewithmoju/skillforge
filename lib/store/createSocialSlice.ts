import { StateCreator } from 'zustand';
import { StoreState, SocialSlice } from './types';
import { ACHIEVEMENT_DEFINITIONS } from '../utils/achievementSystem';
import { DEFAULT_SKIN } from '../types/skins';
import { SkinId } from '../types/skins';

export const createSocialSlice: StateCreator<StoreState, [], [], SocialSlice> = (set, get) => ({
    postsCount: 0,
    likesGivenCount: 0,
    commentsCount: 0,
    savesCount: 0,
    followingCount: 0,
    followersCount: 0,
    socialInteractionsTotal: 0,
    challengesJoined: 0,
    challengesCompleted: 0,

    incrementPostCount: () => {
        set((state) => {
            const newCount = state.postsCount + 1;
            state.updateAchievementProgress('storyteller', newCount);
            return { postsCount: newCount };
        });
    },

    incrementShares: () => {
        set((state) => {
            const sharesCount = (state.postsCount || 0) + 1;
            state.updateAchievementProgress('influencer', sharesCount);
            return {};
        });
    },

    incrementLikesGiven: () => {
        set((state) => {
            const newCount = state.likesGivenCount + 1;
            const newSocialTotal = state.socialInteractionsTotal + 1;
            state.updateAchievementProgress('appreciator', newCount);
            state.updateAchievementProgress('social_butterfly', newSocialTotal);
            return {
                likesGivenCount: newCount,
                socialInteractionsTotal: newSocialTotal,
            };
        });
    },

    incrementComments: () => {
        set((state) => {
            const newCount = state.commentsCount + 1;
            const newSocialTotal = state.socialInteractionsTotal + 1;
            state.updateAchievementProgress('commentator', newCount);
            state.updateAchievementProgress('social_butterfly', newSocialTotal);
            return {
                commentsCount: newCount,
                socialInteractionsTotal: newSocialTotal,
            };
        });
    },

    incrementSaves: () => {
        set((state) => {
            const newCount = state.savesCount + 1;
            state.updateAchievementProgress('bookmarker', newCount);
            return { savesCount: newCount };
        });
    },

    incrementFollowing: () => {
        set((state) => {
            const newCount = state.followingCount + 1;
            const newSocialTotal = state.socialInteractionsTotal + 1;
            state.updateAchievementProgress('networker', newCount);
            state.updateAchievementProgress('social_butterfly', newSocialTotal);
            return {
                followingCount: newCount,
                socialInteractionsTotal: newSocialTotal,
            };
        });
    },

    incrementFollowers: () => {
        set((state) => {
            const newCount = state.followersCount + 1;
            state.updateAchievementProgress('learning_influencer', newCount);
            return { followersCount: newCount };
        });
    },

    updatePostLikes: (likes) => {
        const state = get();
        if (likes >= 10) {
            state.updateAchievementProgress('trendsetter', likes);
        }
    },

    incrementChallengesJoined: () => {
        set((state) => {
            const newCount = state.challengesJoined + 1;
            state.updateAchievementProgress('challenger', newCount);
            return { challengesJoined: newCount };
        });
    },

    incrementChallengesCompleted: () => {
        set((state) => {
            const newCount = state.challengesCompleted + 1;

            // Ensure all achievement definitions are present
            const existingAchievementIds = new Set(state.achievements.map(a => a.id));
            const missingAchievements = ACHIEVEMENT_DEFINITIONS.filter(
                def => !existingAchievementIds.has(def.id)
            ).map(def => ({
                ...def,
                currentProgress: 0,
                totalXpEarned: 0,
            }));

            let achievements = state.achievements;
            if (missingAchievements.length > 0) {
                achievements = [...state.achievements, ...missingAchievements];
            }

            // Ensure all skins are owned (unlock all skins for everyone)
            const allSkins: SkinId[] = ["cyber-neon", "forest-quest", "space-odyssey", "dragons-lair", "ocean-depths"];
            let ownedSkins = state.ownedSkins;
            if (!ownedSkins || ownedSkins.length < allSkins.length) {
                ownedSkins = allSkins;
            }

            // Ensure selectedSkin is valid
            let selectedSkin = state.selectedSkin;
            if (!selectedSkin) {
                selectedSkin = DEFAULT_SKIN;
            }

            state.updateAchievementProgress('champion', newCount);

            return {
                challengesCompleted: newCount,
                achievements,
                ownedSkins,
                selectedSkin
            };
        });
    },
});
