"use client";

import { ReactNode } from "react";
import { RoadmapDefinition, RoadmapNode } from "@/lib/store";
import { SkinConfig } from "@/lib/types/skins";
import { cn } from "@/lib/utils";

export interface BaseSkinProps {
    skinConfig: SkinConfig;
    roadmapDefinitions: RoadmapDefinition[];
    roadmapProgress: Record<string, RoadmapNode>;
    selectedNodeId: string | null;
    onNodeSelect: (nodeId: string) => void;
    children?: ReactNode;
}

export function BaseSkin({
    skinConfig,
    roadmapDefinitions,
    roadmapProgress,
    selectedNodeId,
    onNodeSelect,
    children,
}: BaseSkinProps) {
    return (
        <div
            className="relative min-h-[600px] md:min-h-[800px] rounded-2xl md:rounded-3xl border overflow-hidden p-4 md:p-8 flex justify-center transition-all duration-500"
            style={{
                backgroundColor: `${skinConfig.colors.background}50`,
                borderColor: `${skinConfig.colors.primary}30`,
                boxShadow: `0 0 40px ${skinConfig.colors.primary}20, inset 0 0 60px ${skinConfig.colors.background}30`,
            }}
        >
            {children}
        </div>
    );
}

