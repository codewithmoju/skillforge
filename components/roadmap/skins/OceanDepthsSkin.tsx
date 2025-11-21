"use client";

import { motion } from "framer-motion";
import { Check, Lock, Star, Droplet } from "lucide-react";
import { BaseSkin, BaseSkinProps } from "./BaseSkin";
import { cn } from "@/lib/utils";

export function OceanDepthsSkin(props: BaseSkinProps) {
    const { skinConfig, roadmapDefinitions, roadmapProgress, selectedNodeId, onNodeSelect } = props;

    // Wave layout: curved flowing path
    const getWavePosition = (index: number, total: number) => {
        const waveAmplitude = 120;
        const waveFrequency = 0.5;
        const baseY = index * 180;
        const x = Math.sin(index * waveFrequency) * waveAmplitude;
        
        return {
            x: x,
            y: baseY,
        };
    };

    // Generate wave path for SVG
    const generateWavePath = (definitions: typeof roadmapDefinitions) => {
        if (definitions.length === 0) return "";
        
        const points = definitions.map((_, index) => {
            const pos = getWavePosition(index, definitions.length);
            return `${pos.x + 400},${pos.y + 200}`;
        });
        
        return `M ${points.join(" L ")}`;
    };

    return (
        <BaseSkin {...props}>
            {/* Ocean Background with Depth Gradient */}
            <div 
                className="absolute inset-0"
                style={{
                    background: `linear-gradient(to bottom, 
                        ${skinConfig.colors.primary}10 0%, 
                        ${skinConfig.colors.secondary}15 50%, 
                        ${skinConfig.colors.accent}10 100%)`,
                }}
            />

            {/* Animated Bubble Particles */}
            {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                    key={`bubble-${i}`}
                    className="absolute rounded-full"
                    style={{
                        left: `${10 + (i % 5) * 20}%`,
                        bottom: `${5 + Math.floor(i / 5) * 15}%`,
                        width: `${Math.random() * 8 + 4}px`,
                        height: `${Math.random() * 8 + 4}px`,
                        backgroundColor: skinConfig.colors.accent,
                        opacity: 0.4,
                    }}
                    animate={{
                        y: [0, -400],
                        opacity: [0.4, 0],
                        scale: [1, 1.5],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 3,
                        ease: "easeOut",
                    }}
                />
            ))}

            {/* Premium Wave Path Connection */}
            <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                {roadmapDefinitions.map((def, index) => {
                    if (index === roadmapDefinitions.length - 1) return null;
                    
                    const currentPos = getWavePosition(index, roadmapDefinitions.length);
                    const nextPos = getWavePosition(index + 1, roadmapDefinitions.length);
                    const nodeState = roadmapProgress[def.id];
                    const isPathActive = nodeState?.status === "completed" || nodeState?.status === "active";
                    
                    // Calculate curved path properties
                    const deltaX = nextPos.x - currentPos.x;
                    const deltaY = nextPos.y - currentPos.y;
                    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
                    
                    return (
                        <div
                            key={`wave-${def.id}`}
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
                            {/* Active glowing wave */}
                            {isPathActive && (
                                <motion.div
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        background: `linear-gradient(90deg, ${skinConfig.colors.primary}, ${skinConfig.colors.accent}, ${skinConfig.colors.secondary})`,
                                        boxShadow: `0 0 20px ${skinConfig.colors.primary}60, 0 0 40px ${skinConfig.colors.accent}40`,
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

            {/* Nodes as Underwater Treasures */}
            <div className="relative z-10 w-full h-full flex items-start justify-center pt-10">
                <div className="relative" style={{ width: "100%", maxWidth: "800px", minHeight: "800px" }}>
                    {roadmapDefinitions.map((def, index) => {
                        const nodeState = roadmapProgress[def.id] || { status: "locked", completedLessons: 0 };
                        const isSelected = selectedNodeId === def.id;
                        const position = getWavePosition(index, roadmapDefinitions.length);

                        return (
                            <motion.div
                                key={def.id}
                                initial={{ opacity: 0, scale: 0, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ 
                                    delay: index * 0.1, 
                                    type: "spring", 
                                    stiffness: 150,
                                    damping: 15,
                                }}
                                className="absolute"
                                style={{
                                    left: `${position.x + 300}px`,
                                    top: `${position.y + 100}px`,
                                    transform: "translate(-50%, -50%)",
                                }}
                            >
                                {/* Floating Animation */}
                                <motion.div
                                    animate={{
                                        y: [0, -10, 0],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                >
                                    <button
                                        onClick={() => onNodeSelect(def.id)}
                                        className={cn(
                                            "relative z-10 w-20 h-20 rounded-full flex items-center justify-center border-4 transition-all duration-300 hover:scale-125",
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
                                                ? `0 0 30px ${skinConfig.colors.nodeCompleted}50, inset 0 0 20px ${skinConfig.colors.nodeCompleted}30`
                                                : nodeState.status === "active"
                                                ? `0 0 40px ${skinConfig.colors.nodeActive}70, inset 0 0 25px ${skinConfig.colors.nodeActive}40`
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

                                        {/* Ripple effect for active nodes */}
                                        {nodeState.status === "active" && (
                                            <>
                                                <motion.div
                                                    className="absolute inset-0 rounded-full border-2"
                                                    style={{ borderColor: skinConfig.colors.nodeActive }}
                                                    animate={{ 
                                                        scale: [1, 1.5, 2],
                                                        opacity: [0.6, 0.3, 0],
                                                    }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                />
                                                <motion.div
                                                    className="absolute inset-0 rounded-full border-2"
                                                    style={{ borderColor: skinConfig.colors.nodeActive }}
                                                    animate={{ 
                                                        scale: [1, 1.5, 2],
                                                        opacity: [0.6, 0.3, 0],
                                                    }}
                                                    transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                                                />
                                            </>
                                        )}

                                        {/* Bubble decoration for completed nodes */}
                                        {nodeState.status === "completed" && (
                                            <motion.div
                                                className="absolute -top-1 -right-1"
                                                animate={{ 
                                                    y: [0, -5, 0],
                                                    opacity: [0.7, 1, 0.7],
                                                }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            >
                                                <Droplet className="w-5 h-5" style={{ color: skinConfig.colors.accent }} />
                                            </motion.div>
                                        )}
                                    </button>
                                </motion.div>

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

