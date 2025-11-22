"use client";

import { useEffect, useState, useMemo } from "react";
import { RoadmapDefinition } from "@/lib/store";
import useSkinStore from "@/lib/store/skinStore";
import { getSkinConfig } from "@/lib/types/skins";
import { calculateNodePositions, preventOverlaps } from "@/lib/utils/skinLayouts";
import { ThemedNode } from "./skins/ThemedNode";
import { ThemedPath } from "./skins/ThemedPath";
import { ParticleSystem } from "./skins/ParticleSystem";

interface RoadmapSkinRendererProps {
    selectedSkin?: string;
    roadmapDefinitions: RoadmapDefinition[];
    roadmapProgress: Record<string, { status: 'locked' | 'active' | 'completed'; completedLessons: number }>;
    selectedNodeId: string | null;
    onNodeSelect: (nodeId: string) => void;
}

export function RoadmapSkinRenderer({
    selectedSkin: propSkin,
    roadmapDefinitions,
    roadmapProgress,
    selectedNodeId,
    onNodeSelect,
}: RoadmapSkinRendererProps) {
    const { currentSkin } = useSkinStore();
    const skin = getSkinConfig(currentSkin);
    const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

    // Handle screen resize
    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Calculate node positions based on current skin
    const layout = useMemo(() => {
        const baseLayout = calculateNodePositions(roadmapDefinitions, skin, screenWidth);

        // Apply overlap prevention if enabled
        if (skin.positioning.preventOverlap) {
            const spacing = skin.positioning.spacing;
            baseLayout.positions = preventOverlaps(baseLayout.positions, spacing.minDistance);
        }

        return baseLayout;
    }, [roadmapDefinitions, skin, screenWidth]);

    // Create path connections
    const paths = useMemo(() => {
        const pathList: Array<{
            from: { x: number; y: number };
            to: { x: number; y: number };
            status: 'inactive' | 'active' | 'completed';
        }> = [];

        for (let i = 0; i < roadmapDefinitions.length - 1; i++) {
            const fromNode = roadmapDefinitions[i];
            const toNode = roadmapDefinitions[i + 1];
            const fromPos = layout.positions.get(fromNode.id);
            const toPos = layout.positions.get(toNode.id);

            if (fromPos && toPos) {
                const fromStatus = roadmapProgress[fromNode.id]?.status || 'locked';
                const toStatus = roadmapProgress[toNode.id]?.status || 'locked';

                // Path is completed if both nodes are completed
                // Path is active if from is completed and to is active
                // Otherwise inactive
                let pathStatus: 'inactive' | 'active' | 'completed' = 'inactive';
                if (fromStatus === 'completed' && toStatus === 'completed') {
                    pathStatus = 'completed';
                } else if (fromStatus === 'completed' && toStatus === 'active') {
                    pathStatus = 'active';
                }

                pathList.push({
                    from: { x: fromPos.x, y: fromPos.y + 32 }, // Offset to center of node
                    to: { x: toPos.x, y: toPos.y + 32 },
                    status: pathStatus,
                });
            }
        }

        return pathList;
    }, [roadmapDefinitions, layout, roadmapProgress]);

    return (
        <div
            className={`relative ${skin.themeClass}`}
            style={{
                width: `${layout.width}px`,
                height: `${layout.height}px`,
                minHeight: '800px',
                background: skin.colors.background,
            }}
        >
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                {skin.effects.background.type === 'animated' && (
                    <div className={skin.effects.background.customClass} />
                )}
                {skin.effects.background.type === 'pattern' && (
                    <div className={skin.effects.background.customClass} />
                )}
            </div>

            {/* Paths */}
            <svg
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{ overflow: 'visible' }}
            >
                {paths.map((path, index) => (
                    <ThemedPath
                        key={`path-${index}`}
                        from={path.from}
                        to={path.to}
                        status={path.status}
                        skin={skin}
                    />
                ))}
            </svg>

            {/* Nodes */}
            {roadmapDefinitions.map((node) => {
                const position = layout.positions.get(node.id);
                if (!position) return null;

                const progress = roadmapProgress[node.id] || { status: 'locked', completedLessons: 0 };

                return (
                    <ThemedNode
                        key={node.id}
                        id={node.id}
                        title={node.title}
                        level={node.level}
                        status={progress.status}
                        onClick={() => onNodeSelect(node.id)}
                        isSelected={selectedNodeId === node.id}
                        skin={skin}
                        position={position}
                    />
                );
            })}

            {/* Particle Effects */}
            {skin.effects.particles.enabled && (
                <div className="absolute inset-0 pointer-events-none">
                    <ParticleSystem skin={skin} />
                </div>
            )}
        </div>
    );
}
