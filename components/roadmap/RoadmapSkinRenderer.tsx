"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SKIN_CONFIGS, SkinId } from "@/lib/types/skins";
import { RoadmapDefinition, RoadmapNode } from "@/lib/store";
import { CyberNeonSkin } from "./skins/CyberNeonSkin";
import { ForestQuestSkin } from "./skins/ForestQuestSkin";
import { SpaceOdysseySkin } from "./skins/SpaceOdysseySkin";
import { DragonsLairSkin } from "./skins/DragonsLairSkin";
import { OceanDepthsSkin } from "./skins/OceanDepthsSkin";
import { BaseSkinProps } from "./skins/BaseSkin";

interface RoadmapSkinRendererProps {
    selectedSkin: SkinId;
    roadmapDefinitions: RoadmapDefinition[];
    roadmapProgress: Record<string, RoadmapNode>;
    selectedNodeId: string | null;
    onNodeSelect: (nodeId: string) => void;
}

export function RoadmapSkinRenderer({
    selectedSkin,
    roadmapDefinitions,
    roadmapProgress,
    selectedNodeId,
    onNodeSelect,
}: RoadmapSkinRendererProps) {
    const skinConfig = SKIN_CONFIGS[selectedSkin];
    const commonProps: BaseSkinProps = {
        skinConfig,
        roadmapDefinitions,
        roadmapProgress,
        selectedNodeId,
        onNodeSelect,
    };

    const renderSkin = () => {
        switch (selectedSkin) {
            case "cyber-neon":
                return <CyberNeonSkin {...commonProps} />;
            case "forest-quest":
                return <ForestQuestSkin {...commonProps} />;
            case "space-odyssey":
                return <SpaceOdysseySkin {...commonProps} />;
            case "dragons-lair":
                return <DragonsLairSkin {...commonProps} />;
            case "ocean-depths":
                return <OceanDepthsSkin {...commonProps} />;
            default:
                return <CyberNeonSkin {...commonProps} />;
        }
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={selectedSkin}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                {renderSkin()}
            </motion.div>
        </AnimatePresence>
    );
}

