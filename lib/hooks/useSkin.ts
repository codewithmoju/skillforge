import { useUserStore } from "@/lib/store";
import { SKIN_CONFIGS } from "@/lib/types/skins";

export function useSkin() {
    const { selectedSkin } = useUserStore();
    const skinConfig = SKIN_CONFIGS[selectedSkin];
    
    return {
        skinConfig,
        colors: skinConfig.colors,
    };
}

