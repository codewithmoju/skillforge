"use client";

import { createContext, useContext, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useSkin } from "@/lib/hooks/useSkin";
import { SKIN_CONFIGS } from "@/lib/types/skins";

interface SkinContextType {
    colors: ReturnType<typeof useSkin>["colors"];
    skinConfig: ReturnType<typeof useSkin>["skinConfig"];
    isActive: boolean;
    shouldApplySkin: boolean;
}

const SkinContext = createContext<SkinContextType | null>(null);

export function SkinProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const { colors, skinConfig } = useSkin();
    
    // Apply skin only on roadmap pages
    const isRoadmapPage = pathname?.startsWith("/roadmap") || pathname?.startsWith("/lesson");
    const isActive = isRoadmapPage;

    return (
        <SkinContext.Provider value={{ colors, skinConfig, isActive, shouldApplySkin: isActive }}>
            {children}
        </SkinContext.Provider>
    );
}

export function useSkinContext() {
    const context = useContext(SkinContext);
    if (!context) {
        // Return default colors when not in roadmap
        return {
            colors: SKIN_CONFIGS["cyber-neon"].colors,
            skinConfig: SKIN_CONFIGS["cyber-neon"],
            isActive: false,
            shouldApplySkin: false,
        };
    }
    return context;
}
