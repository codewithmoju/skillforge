import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SkinId, DEFAULT_SKIN } from '@/lib/types/skins';

interface SkinStore {
    // Current state
    currentSkin: SkinId;
    unlockedSkins: SkinId[];
    previewSkin: SkinId | null;

    // Actions
    setCurrentSkin: (skinId: SkinId) => void;
    unlockSkin: (skinId: SkinId) => void;
    lockSkin: (skinId: SkinId) => void;
    setPreviewSkin: (skinId: SkinId | null) => void;
    isSkinUnlocked: (skinId: SkinId) => boolean;
    resetToDefaults: () => void;
}

const useSkinStore = create<SkinStore>()(
    persist(
        (set, get) => ({
            // Initial state - all skins unlocked by default
            currentSkin: DEFAULT_SKIN,
            unlockedSkins: ['cyber-neon', 'forest-quest', 'space-odyssey', 'dragons-lair', 'ocean-depths'],
            previewSkin: null,

            // Set current active skin (only if unlocked)
            setCurrentSkin: (skinId: SkinId) => {
                const { isSkinUnlocked } = get();
                if (isSkinUnlocked(skinId)) {
                    set({ currentSkin: skinId });
                } else {
                    console.warn(`Skin ${skinId} is locked. Cannot set as current skin.`);
                }
            },

            // Unlock a premium skin (for purchase or rewards)
            unlockSkin: (skinId: SkinId) => {
                set((state) => {
                    if (!state.unlockedSkins.includes(skinId)) {
                        return {
                            unlockedSkins: [...state.unlockedSkins, skinId],
                        };
                    }
                    return state;
                });
            },

            // Lock a skin (for testing or admin purposes)
            lockSkin: (skinId: SkinId) => {
                set((state) => {
                    // Cannot lock the default skin
                    if (skinId === DEFAULT_SKIN) {
                        console.warn('Cannot lock the default skin');
                        return state;
                    }

                    const unlockedSkins = state.unlockedSkins.filter(id => id !== skinId);
                    const currentSkin = state.currentSkin === skinId ? DEFAULT_SKIN : state.currentSkin;

                    return {
                        unlockedSkins,
                        currentSkin,
                    };
                });
            },

            // Set preview skin (for skin selector preview)
            setPreviewSkin: (skinId: SkinId | null) => {
                set({ previewSkin: skinId });
            },

            // Check if a skin is unlocked
            isSkinUnlocked: (skinId: SkinId) => {
                const { unlockedSkins } = get();
                return unlockedSkins.includes(skinId);
            },

            // Reset to default state
            resetToDefaults: () => {
                set({
                    currentSkin: DEFAULT_SKIN,
                    unlockedSkins: ['cyber-neon', 'forest-quest', 'space-odyssey', 'dragons-lair', 'ocean-depths'],
                    previewSkin: null,
                });
            },
        }),
        {
            name: 'skillforge-skin-storage',
            version: 1,
        }
    )
);

export default useSkinStore;

// Helper hooks for common use cases
export const useCurrentSkin = () => useSkinStore((state) => state.currentSkin);
export const useUnlockedSkins = () => useSkinStore((state) => state.unlockedSkins);
export const useIsSkinUnlocked = (skinId: SkinId) => useSkinStore((state) => state.isSkinUnlocked(skinId));
