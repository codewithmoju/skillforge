"use client";

import { motion } from "framer-motion";
import { Check, Lock, Star } from "lucide-react";
import { BaseSkin, BaseSkinProps } from "./BaseSkin";
import { cn } from "@/lib/utils";

export function SpaceOdysseySkin(props: BaseSkinProps) {
    const { skinConfig, roadmapDefinitions, roadmapProgress, selectedNodeId, onNodeSelect } = props;

    // Orbital layout: nodes arranged in circular orbits
    const getOrbitalPosition = (index: number, total: number) => {
        const centerX = 0;
        const centerY = 0;
        
        // Arrange nodes in concentric orbits
        const orbitRadius = 150 + (Math.floor(index / 4) * 180);
        const nodesPerOrbit = Math.min(4, total - Math.floor(index / 4) * 4);
        const angleStep = (Math.PI * 2) / nodesPerOrbit;
        const angle = (index % 4) * angleStep + (Math.floor(index / 4) * 0.3);
        
        return {
            x: centerX + Math.cos(angle) * orbitRadius,
            y: centerY + Math.sin(angle) * orbitRadius,
        };
    };

    return (
        <BaseSkin {...props}>
            {/* Starfield Background */}
            <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 50 }).map((_, i) => (
                    <motion.div
                        key={`star-${i}`}
                        className="absolute rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 3 + 1}px`,
                            height: `${Math.random() * 3 + 1}px`,
                            backgroundColor: skinConfig.colors.textPrimary,
                        }}
                        animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            {/* Nebula Effects */}
            <div 
                className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-30"
                style={{ backgroundColor: skinConfig.colors.primary }}
            />
            <div 
                className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-30"
                style={{ backgroundColor: skinConfig.colors.accent }}
            />

            {/* Premium Orbital Paths */}
            <div className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center" style={{ zIndex: 1 }}>
                {Array.from({ length: Math.ceil(roadmapDefinitions.length / 4) }).map((_, orbitIndex) => {
                    const radius = 150 + orbitIndex * 180;
                    const isOrbitUnlocked = roadmapDefinitions
                        .slice(orbitIndex * 4, (orbitIndex + 1) * 4)
                        .some(def => {
                            const nodeState = roadmapProgress[def.id];
                            return nodeState?.status === "active" || nodeState?.status === "completed";
                        });

                    return (
                        <div
                            key={`orbit-${orbitIndex}`}
                            className="absolute rounded-full"
                            style={{
                                width: `${radius * 2}px`,
                                height: `${radius * 2}px`,
                                border: isOrbitUnlocked ? `3px solid ${skinConfig.colors.primary}` : `2px dashed ${skinConfig.colors.nodeLocked}`,
                                borderColor: isOrbitUnlocked 
                                    ? skinConfig.colors.primary 
                                    : `${skinConfig.colors.nodeLocked}40`,
                                opacity: isOrbitUnlocked ? 0.6 : 0.2,
                                boxShadow: isOrbitUnlocked 
                                    ? `0 0 30px ${skinConfig.colors.primary}50, inset 0 0 30px ${skinConfig.colors.accent}30`
                                    : "none",
                            }}
                        >
                            {isOrbitUnlocked && (
                                <motion.div
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        border: `2px solid ${skinConfig.colors.accent}`,
                                        boxShadow: `0 0 20px ${skinConfig.colors.accent}60`,
                                    }}
                                    animate={{
                                        rotate: 360,
                                        opacity: [0.4, 0.8, 0.4],
                                    }}
                                    transition={{
                                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                                        opacity: { duration: 3, repeat: Infinity },
                                    }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
            {/* Connection lines between nodes */}
            <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                {roadmapDefinitions.map((def, index) => {
                    if (index === 0) return null;
                    const prevNode = roadmapDefinitions[index - 1];
                    const prevState = roadmapProgress[prevNode.id];
                    const isPathActive = prevState?.status === "completed" || prevState?.status === "active";
                    
                    const currentPos = getOrbitalPosition(index, roadmapDefinitions.length);
                    const prevPos = getOrbitalPosition(index - 1, roadmapDefinitions.length);
                    
                    if (!isPathActive) return null;
                    
                    // Calculate line properties
                    const deltaX = currentPos.x - prevPos.x;
                    const deltaY = currentPos.y - prevPos.y;
                    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
                    const centerX = 50; // percentage
                    const centerY = 50; // percentage
                    
                    return (
                        <div
                            key={`connector-${def.id}`}
                            className="absolute"
                            style={{
                                left: `calc(${centerX}% + ${prevPos.x}px)`,
                                top: `calc(${centerY}% + ${prevPos.y}px)`,
                                width: `${length}px`,
                                height: "3px",
                                transformOrigin: "0 50%",
                                transform: `rotate(${angle}deg)`,
                            }}
                        >
                            <motion.div
                                className="absolute inset-0 rounded-full"
                                style={{
                                    background: `linear-gradient(90deg, ${skinConfig.colors.accent}, ${skinConfig.colors.primary})`,
                                    boxShadow: `0 0 10px ${skinConfig.colors.accent}60`,
                                }}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Nodes as Planets */}
            <div className="relative z-10 w-full h-full flex items-center justify-center">
                <div className="relative" style={{ width: "100%", maxWidth: "900px", minHeight: "800px" }}>
                    {roadmapDefinitions.map((def, index) => {
                        const nodeState = roadmapProgress[def.id] || { status: "locked", completedLessons: 0 };
                        const isSelected = selectedNodeId === def.id;
                        const position = getOrbitalPosition(index, roadmapDefinitions.length);

                        return (
                            <motion.div
                                key={def.id}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                                className="absolute"
                                style={{
                                    left: `calc(50% + ${position.x}px)`,
                                    top: `calc(50% + ${position.y}px)`,
                                    transform: "translate(-50%, -50%)",
                                }}
                            >
                                {/* Orbital Animation */}
                                <motion.div
                                    animate={{
                                        rotate: [0, 360],
                                    }}
                                    transition={{
                                        duration: 20 + index * 2,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                    style={{
                                        transformOrigin: "50% 50%",
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
                                                ? `0 0 30px ${skinConfig.colors.nodeCompleted}60, inset 0 0 20px ${skinConfig.colors.nodeCompleted}40`
                                                : nodeState.status === "active"
                                                ? `0 0 40px ${skinConfig.colors.nodeActive}70, inset 0 0 25px ${skinConfig.colors.nodeActive}50`
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

                                        {/* Planet Rings for active nodes */}
                                        {nodeState.status === "active" && (
                                            <>
                                                <motion.div
                                                    className="absolute inset-0 rounded-full border-2"
                                                    style={{ borderColor: skinConfig.colors.nodeActive }}
                                                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                />
                                                <motion.div
                                                    className="absolute inset-0 rounded-full border-2"
                                                    style={{ borderColor: skinConfig.colors.nodeActive }}
                                                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                                                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                                />
                                            </>
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

