"use client";

import { motion } from "framer-motion";
import { Check, Lock, Star, Rocket, Sparkles } from "lucide-react";
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
            {/* Parallax Starfield Background */}
            <div className="absolute inset-0 overflow-hidden bg-black">
                {/* Distant Stars */}
                {Array.from({ length: 100 }).map((_, i) => (
                    <motion.div
                        key={`star-dist-${i}`}
                        className="absolute rounded-full bg-white opacity-20"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: "1px",
                            height: "1px",
                        }}
                        animate={{
                            opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 5,
                            repeat: Infinity,
                        }}
                    />
                ))}
                 {/* Moving Stars (Parallax Effect) */}
                 {Array.from({ length: 30 }).map((_, i) => (
                    <motion.div
                        key={`star-move-${i}`}
                        className="absolute rounded-full bg-white"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 2 + 1}px`,
                            height: `${Math.random() * 2 + 1}px`,
                            opacity: Math.random() * 0.5 + 0.3,
                        }}
                        animate={{
                            y: [0, -20],
                            opacity: [0.3, 0.8, 0.3],
                        }}
                        transition={{
                            y: {
                                duration: 10 + Math.random() * 10,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut"
                            },
                            opacity: {
                                duration: 2 + Math.random() * 3,
                                repeat: Infinity
                            }
                        }}
                    />
                ))}

                {/* Shooting Star */}
                <motion.div
                    className="absolute w-[100px] h-[2px] bg-gradient-to-r from-transparent via-white to-transparent"
                    style={{ top: "20%", left: "-10%" }}
                    animate={{
                        x: ["0vw", "120vw"],
                        y: ["0vh", "50vh"],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 5 + Math.random() * 10,
                        ease: "easeIn",
                    }}
                />
            </div>

            {/* Nebula Effects */}
            <div 
                className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[100px] opacity-20 mix-blend-screen"
                style={{ backgroundColor: skinConfig.colors.primary }}
            />
            <div 
                className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[100px] opacity-20 mix-blend-screen"
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
                            className="absolute rounded-full transition-all duration-1000"
                            style={{
                                width: `${radius * 2}px`,
                                height: `${radius * 2}px`,
                                border: isOrbitUnlocked ? `1px solid ${skinConfig.colors.primary}40` : `1px dashed ${skinConfig.colors.nodeLocked}30`,
                                boxShadow: isOrbitUnlocked 
                                    ? `0 0 40px ${skinConfig.colors.primary}20, inset 0 0 40px ${skinConfig.colors.primary}10`
                                    : "none",
                            }}
                        >
                            {isOrbitUnlocked && (
                                <motion.div
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        border: `1px solid ${skinConfig.colors.accent}60`,
                                        borderTopColor: "transparent",
                                        borderBottomColor: "transparent",
                                    }}
                                    animate={{
                                        rotate: 360,
                                    }}
                                    transition={{
                                        duration: 30 + orbitIndex * 10,
                                        repeat: Infinity,
                                        ease: "linear",
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
                                height: "2px",
                                transformOrigin: "0 50%",
                                transform: `rotate(${angle}deg)`,
                            }}
                        >
                            <motion.div
                                className="absolute inset-0 rounded-full"
                                style={{
                                    background: `linear-gradient(90deg, ${skinConfig.colors.accent}, ${skinConfig.colors.primary})`,
                                    boxShadow: `0 0 10px ${skinConfig.colors.accent}80`,
                                }}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                            />
                            {/* Moving light along connection */}
                            <motion.div
                                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white blur-[2px]"
                                animate={{
                                    left: ["0%", "100%"],
                                    opacity: [0, 1, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "linear",
                                    delay: Math.random() * 2
                                }}
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
                                {/* Orbital Animation Container - Makes the planet rotate slowly */}
                                <div className="relative">
                                    <motion.div
                                        animate={{
                                            rotate: [0, 360],
                                        }}
                                        transition={{
                                            duration: 40 + index * 5,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                        className="relative"
                                    >
                                        <button
                                            onClick={() => onNodeSelect(def.id)}
                                            className={cn(
                                                "relative z-10 w-20 h-20 rounded-full flex items-center justify-center border-none transition-all duration-300 hover:scale-125",
                                                nodeState.status === "active" && "animate-pulse"
                                            )}
                                            style={{
                                                background: nodeState.status === "completed"
                                                    ? `radial-gradient(circle at 30% 30%, ${skinConfig.colors.nodeCompleted}, ${skinConfig.colors.backgroundCard})`
                                                    : nodeState.status === "active"
                                                    ? `radial-gradient(circle at 30% 30%, ${skinConfig.colors.nodeActive}, ${skinConfig.colors.backgroundCard})`
                                                    : `radial-gradient(circle at 30% 30%, ${skinConfig.colors.nodeLocked}, #000)`,
                                                boxShadow: nodeState.status === "completed"
                                                    ? `0 0 30px ${skinConfig.colors.nodeCompleted}60`
                                                    : nodeState.status === "active"
                                                    ? `0 0 40px ${skinConfig.colors.nodeActive}70`
                                                    : `inset 0 0 20px #000`,
                                            }}
                                        >
                                            {/* Planet surface texture effect */}
                                            <div className="absolute inset-0 rounded-full opacity-30"
                                                style={{
                                                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
                                                    backgroundSize: "10px 10px"
                                                }}
                                            />

                                            {/* Counter-rotate icon so it stays upright */}
                                            <motion.div
                                                animate={{ rotate: [0, -360] }}
                                                transition={{ duration: 40 + index * 5, repeat: Infinity, ease: "linear" }}
                                                className="relative z-20"
                                            >
                                                {nodeState.status === "completed" ? (
                                                    <Check className="w-10 h-10 text-white drop-shadow-md" />
                                                ) : nodeState.status === "locked" ? (
                                                    <Lock className="w-8 h-8 text-white opacity-50" />
                                                ) : (
                                                    <Rocket className="w-10 h-10 text-white fill-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                                                )}
                                            </motion.div>

                                            {/* Planet Rings for active nodes */}
                                            {nodeState.status === "active" && (
                                                <>
                                                    <motion.div
                                                        className="absolute -inset-4 rounded-full border-[3px]"
                                                        style={{
                                                            borderColor: skinConfig.colors.nodeActive,
                                                            borderLeftColor: "transparent",
                                                            borderRightColor: "transparent",
                                                        }}
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                                    />
                                                    <motion.div
                                                        className="absolute -inset-8 rounded-full border-[1px]"
                                                        style={{
                                                            borderColor: skinConfig.colors.accent,
                                                            borderTopColor: "transparent",
                                                            borderBottomColor: "transparent",
                                                            opacity: 0.5
                                                        }}
                                                        animate={{ rotate: -360 }}
                                                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                                                    />
                                                </>
                                            )}
                                        </button>
                                    </motion.div>

                                    {/* Label - Moved outside the rotating container */}
                                    <div className={cn(
                                        "absolute top-full mt-6 left-1/2 -translate-x-1/2 w-48 text-center transition-all whitespace-nowrap z-30",
                                        isSelected ? "opacity-100 scale-110" : "opacity-70 scale-100"
                                    )}>
                                        <div
                                            className="text-base font-bold mb-1 flex items-center justify-center gap-1"
                                            style={{ color: skinConfig.colors.textPrimary, textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}
                                        >
                                            {def.title}
                                            {isSelected && <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />}
                                        </div>
                                        <div
                                            className="text-xs font-mono bg-black/50 px-2 py-0.5 rounded-full inline-block"
                                            style={{ color: skinConfig.colors.textSecondary }}
                                        >
                                            Sector {def.level}
                                        </div>
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
