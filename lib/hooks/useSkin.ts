import { useUserStore } from "@/lib/store";
import { getSkinConfig } from "@/lib/types/skins";

export function useSkin() {
    const selectedSkin = useUserStore((state) => state.selectedSkin);
    const skinConfig = getSkinConfig(selectedSkin);

    return {
        skinConfig,
        colors: skinConfig.colors,
        skin: skinConfig,
    };
}
