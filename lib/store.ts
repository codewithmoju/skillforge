import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { StoreState } from './store/types';
import { createUserSlice } from './store/createUserSlice';
import { createRoadmapSlice } from './store/createRoadmapSlice';
import { createSocialSlice } from './store/createSocialSlice';

// Re-export types for backward compatibility
export * from './store/types';

export const useUserStore = create<StoreState>()(
    persist(
        (...a) => ({
            ...createUserSlice(...a),
            ...createRoadmapSlice(...a),
            ...createSocialSlice(...a),
            _hasHydrated: false,
            setHasHydrated: (state) => {
                const set = a[0];
                set({ _hasHydrated: state });
            },
        }),
        {
            name: 'skillforge-storage',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
