import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
        }),
        {
            name: 'skillforge-storage',
        }
    )
);
