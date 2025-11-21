"use client";

import { motion } from "framer-motion";
import { Check, Lock, Star, Leaf } from "lucide-react";
import { BaseSkin, BaseSkinProps } from "./BaseSkin";
import { cn } from "@/lib/utils";

export function ForestQuestSkin(props: BaseSkinProps) {
    const { skinConfig, roadmapDefinitions, roadmapProgress, selectedNodeId, onNodeSelect } = props;

    // Tree branch layout: nodes branch out from root
    const getNodePosition = (index: number, total: number) => {
        if (index === 0) return { x: 0, y: 0 }; // Root at center
        
        // Simple branching: alternate left/right with increasing depth
        const depth = Math.floor((index + 1) / 2);
        const isLeft = index % 2 === 1;
        const branchOffset = isLeft ? -150 : 150;
        const branchSpread = depth * 50;
        
        return {
            x: branchOffset + (isLeft ? -branchSpread : branchSpread),
            y: depth * 180,
        };
    };

    return (
        <BaseSkin {...props}>
            {/* Forest Background */}
            <div 
                className="absolute inset-0"
                style={{
                    background: `radial-gradient(circle at 20% 50%, ${skinConfig.colors.primary}10 0%, transparent 50%),
                                 radial-gradient(circle at 80% 80%, ${skinConfig.colors.secondary}10 0%, transparent 50%)`,
                }}
            />

            {/* Animated Leaf Particles */}
            {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute"
                    style={{
                        left: `${20 + i * 10}%`,
                        top: `${10 + (i % 3) * 30}%`,
                    }}
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 15, 0],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 3 + i * 0.5,
                        repeat: Infinity,
                        delay: i * 0.3,
                    }}
                >
                    <Leaf 
                        className="w-4 h-4"
                        style={{ color: skinConfig.colors.primary }}
                    />
                </motion.div>
            ))}

            {/* Premium Tree Branch Connections */}
            <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                {roadmapDefinitions.map((def, index) => {
                    if (index === 0) return null;
                    const nodeState = roadmapProgress[def.id];
                    const prevNode = roadmapDefinitions[index - 1];
                    const prevState = roadmapProgress[prevNode.id];
                    
                    const currentPos = getNodePosition(index, roadmapDefinitions.length);
                    const prevPos = getNodePosition(index - 1, roadmapDefinitions.length);
                    
                    const isPathActive = prevState?.status === "completed" || prevState?.status === "active";
                    
                    // Calculate line properties
                    const centerX = 50; // percentage
                    const startY = prevPos.y + 100;
                    const endY = currentPos.y + 100;
                    const deltaX = currentPos.x;
                    const deltaY = endY - startY;
                    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
                    
                    return (
                        <div
                            key={`branch-${def.id}`}
                            className="absolute"
                            style={{
                                left: `${centerX}%`,
                                top: `${startY}px`,
                                width: `${length}px`,
                                height: "4px",
                                transformOrigin: "0 50%",
                                transform: `rotate(${angle}deg)`,
                            }}
                        >
                            {/* Background track */}
                            <div
                                className="absolute inset-0 rounded-full"
                                style={{
                                    backgroundColor: `${skinConfig.colors.nodeLocked}30`,
                                }}
                            />
                            {/* Active glowing branch */}
                            {isPathActive && (
                                <motion.div
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        background: `linear-gradient(90deg, ${skinConfig.colors.primary}, ${skinConfig.colors.secondary})`,
                                        boxShadow: `0 0 15px ${skinConfig.colors.primary}60, 0 0 30px ${skinConfig.colors.secondary}40`,
                                    }}
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.8, delay: index * 0.1 }}
                                />
                            )}
                            {/* Dashed locked path */}
                            {!isPathActive && (
                                <div
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        background: `repeating-linear-gradient(90deg, ${skinConfig.colors.nodeLocked}40 0px, ${skinConfig.colors.nodeLocked}40 8px, transparent 8px, transparent 16px)`,
                                    }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Nodes as Tree Branches */}
            <div className="relative z-10 w-full h-full flex items-start justify-center pt-10">
                <div className="relative" style={{ width: "100%", maxWidth: "800px", minHeight: "800px" }}>
                    {roadmapDefinitions.map((def, index) => {
                        const nodeState = roadmapProgress[def.id] || { status: "locked", completedLessons: 0 };
                        const isSelected = selectedNodeId === def.id;
                        const position = getNodePosition(index, roadmapDefinitions.length);

                        return (
                            <motion.div
                                key={def.id}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.15 }}
                                className="absolute"
                                style={{
                                    left: `calc(50% + ${position.x}px)`,
                                    top: `${position.y + 100}px`,
                                    transform: "translate(-50%, -50%)",
                                }}
                            >
                                <button
                                    onClick={() => onNodeSelect(def.id)}
                                    className={cn(
                                        "relative z-10 w-20 h-20 rounded-full flex items-center justify-center border-4 transition-all duration-300 hover:scale-110",
                                        nodeState.status === "completed" && "shadow-lg",
                                        nodeState.status === "active" && "animate-pulse"
                                    )}
                                    style={{
                                        backgroundColor: nodeState.status === "completed"
                                            ? skinConfig.colors.nodeCompleted
                                            : nodeState.status === "active"
                                            ? skinConfig.colors.nodeActive
                                            : skinConfig.colors.nodeLocked,
                                        borderColor: nodeState.status === "completed"
                                            ? skinConfig.colors.nodeCompleted
                                            : nodeState.status === "active"
                                            ? skinConfig.colors.nodeActive
                                            : skinConfig.colors.nodeLocked,
                                        boxShadow: nodeState.status === "completed"
                                            ? `0 0 25px ${skinConfig.colors.nodeCompleted}50`
                                            : nodeState.status === "active"
                                            ? `0 0 30px ${skinConfig.colors.nodeActive}60`
                                            : undefined,
                                    }}
                                >
                                    {nodeState.status === "completed" ? (
                                        <Check className="w-10 h-10 text-white" />
                                    ) : nodeState.status === "locked" ? (
                                        <Lock className="w-8 h-8 text-white opacity-50" />
                                    ) : (
                                        <Star className="w-10 h-10 text-white fill-white" />
                                    )}

                                    {/* Leaf decoration for completed nodes */}
                                    {nodeState.status === "completed" && (
                                        <motion.div
                                            className="absolute -top-2 -right-2"
                                            animate={{ rotate: [0, 15, -15, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <Leaf className="w-6 h-6" style={{ color: skinConfig.colors.accent }} />
                                        </motion.div>
                                    )}

                                    {/* Label */}
                                    <div className={cn(
                                        "absolute top-full mt-4 left-1/2 -translate-x-1/2 w-48 text-center transition-all whitespace-nowrap",
                                        isSelected ? "opacity-100 scale-110" : "opacity-70 scale-100"
                                    )}>
                                        <div 
                                            className="text-base font-bold mb-1"
                                            style={{ color: skinConfig.colors.textPrimary }}
                                        >
                                            {def.title}
                                        </div>
                                        <div 
                                            className="text-xs"
                                            style={{ color: skinConfig.colors.textSecondary }}
                                        >
                                            Level {def.level}
                                        </div>
                                    </div>
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </BaseSkin>
    );
}

