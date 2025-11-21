"use client";

import { motion } from "framer-motion";
import { Check, Lock, Star, Flame } from "lucide-react";
import { BaseSkin, BaseSkinProps } from "./BaseSkin";
import { cn } from "@/lib/utils";

export function DragonsLairSkin(props: BaseSkinProps) {
    const { skinConfig, roadmapDefinitions, roadmapProgress, selectedNodeId, onNodeSelect } = props;

    // Dungeon path: zigzag stepped path
    const getDungeonPosition = (index: number, total: number) => {
        const stepWidth = 200;
        const stepHeight = 180;
        const zigzagOffset = index % 2 === 0 ? 150 : -150;
        
        return {
            x: (index % 2) * stepWidth + zigzagOffset,
            y: Math.floor(index / 2) * stepHeight,
        };
    };

    return (
        <BaseSkin {...props}>
            {/* Fire/Dungeon Background */}
            <div 
                className="absolute inset-0"
                style={{
                    background: `radial-gradient(circle at 50% 0%, ${skinConfig.colors.primary}15 0%, transparent 50%),
                                 radial-gradient(circle at 50% 100%, ${skinConfig.colors.secondary}10 0%, transparent 50%)`,
                }}
            />

            {/* Fire Particle Effects */}
            {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                    key={`flame-${i}`}
                    className="absolute"
                    style={{
                        left: `${15 + (i % 4) * 25}%`,
                        bottom: `${5 + Math.floor(i / 4) * 30}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.4, 0.8, 0.4],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 2 + (i % 3) * 0.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                    }}
                >
                    <Flame 
                        className="w-6 h-6"
                        style={{ color: skinConfig.colors.accent }}
                    />
                </motion.div>
            ))}

            {/* Premium Dungeon Path (Zigzag Steps) */}
            <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                {roadmapDefinitions.map((def, index) => {
                    if (index === roadmapDefinitions.length - 1) return null;
                    
                    const currentPos = getDungeonPosition(index, roadmapDefinitions.length);
                    const nextPos = getDungeonPosition(index + 1, roadmapDefinitions.length);
                    const nodeState = roadmapProgress[def.id];
                    const isPathActive = nodeState?.status === "completed" || nodeState?.status === "active";
                    
                    // Calculate line properties
                    const deltaX = nextPos.x - currentPos.x;
                    const deltaY = nextPos.y - currentPos.y;
                    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
                    
                    return (
                        <div
                            key={`path-${def.id}`}
                            className="absolute"
                            style={{
                                left: `${currentPos.x + 300}px`,
                                top: `${currentPos.y + 100}px`,
                                width: `${length}px`,
                                height: "5px",
                                transformOrigin: "0 50%",
                                transform: `translate(20px, 20px) rotate(${angle}deg)`,
                            }}
                        >
                            {/* Background track */}
                            <div
                                className="absolute inset-0 rounded-full"
                                style={{
                                    backgroundColor: `${skinConfig.colors.nodeLocked}30`,
                                }}
                            />
                            {/* Active glowing path */}
                            {isPathActive && (
                                <motion.div
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        background: `linear-gradient(90deg, ${skinConfig.colors.primary}, ${skinConfig.colors.accent})`,
                                        boxShadow: `0 0 20px ${skinConfig.colors.primary}70, 0 0 40px ${skinConfig.colors.accent}50`,
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
                                        background: `repeating-linear-gradient(90deg, ${skinConfig.colors.nodeLocked}50 0px, ${skinConfig.colors.nodeLocked}50 8px, transparent 8px, transparent 16px)`,
                                    }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Nodes as Dungeon Rooms */}
            <div className="relative z-10 w-full h-full flex items-start justify-center pt-10">
                <div className="relative" style={{ width: "100%", maxWidth: "800px", minHeight: "800px" }}>
                    {roadmapDefinitions.map((def, index) => {
                        const nodeState = roadmapProgress[def.id] || { status: "locked", completedLessons: 0 };
                        const isSelected = selectedNodeId === def.id;
                        const position = getDungeonPosition(index, roadmapDefinitions.length);

                        return (
                            <motion.div
                                key={def.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.15 }}
                                className="absolute"
                                style={{
                                    left: `${position.x + 300}px`,
                                    top: `${position.y + 100}px`,
                                    transform: "translate(-50%, -50%)",
                                }}
                            >
                                <button
                                    onClick={() => onNodeSelect(def.id)}
                                    className={cn(
                                        "relative z-10 w-20 h-20 rounded-lg flex items-center justify-center border-4 transition-all duration-300 hover:scale-110 rotate-45",
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
                                            ? `0 0 25px ${skinConfig.colors.nodeCompleted}50, inset 0 0 15px ${skinConfig.colors.nodeCompleted}30`
                                            : nodeState.status === "active"
                                            ? `0 0 35px ${skinConfig.colors.nodeActive}70, inset 0 0 20px ${skinConfig.colors.nodeActive}40`
                                            : undefined,
                                    }}
                                >
                                    <div className="rotate-[-45deg]">
                                        {nodeState.status === "completed" ? (
                                            <Check className="w-10 h-10 text-white" />
                                        ) : nodeState.status === "locked" ? (
                                            <Lock className="w-8 h-8 text-white opacity-50" />
                                        ) : (
                                            <Star className="w-10 h-10 text-white fill-white" />
                                        )}
                                    </div>

                                    {/* Fire effect for active nodes */}
                                    {nodeState.status === "active" && (
                                        <motion.div
                                            className="absolute -top-2 -right-2 rotate-[-45deg]"
                                            animate={{ 
                                                rotate: [0, 15, -15, 0],
                                                scale: [1, 1.2, 1],
                                            }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            <Flame className="w-6 h-6" style={{ color: skinConfig.colors.accent }} />
                                        </motion.div>
                                    )}

                                    {/* Castle/Dungeon decoration */}
                                    <div 
                                        className="absolute inset-0 rounded-lg border-2 opacity-30"
                                        style={{ borderColor: skinConfig.colors.textPrimary }}
                                    />
                                </button>

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
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </BaseSkin>
    );
}

