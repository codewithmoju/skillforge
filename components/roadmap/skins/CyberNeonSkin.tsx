"use client";

import { motion } from "framer-motion";
import { Check, Lock, Star, Zap, Cpu } from "lucide-react";
import { BaseSkin, BaseSkinProps } from "./BaseSkin";
import { cn } from "@/lib/utils";

export function CyberNeonSkin(props: BaseSkinProps) {
    const { skinConfig, roadmapDefinitions, roadmapProgress, selectedNodeId, onNodeSelect } = props;

    // Calculate progress percentage for the connecting line
    const totalNodes = roadmapDefinitions.length;
    const completedNodes = Object.values(roadmapProgress).filter(
        node => node.status === "completed"
    ).length;
    const progressPercentage = totalNodes > 0 ? (completedNodes / totalNodes) * 100 : 0;

    return (
        <BaseSkin {...props}>
            {/* Background Grid with Scanline */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
                    style={{ opacity: 0.3 }}
                />
                {/* Moving Scanline */}
                <motion.div
                    className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-primary/10 to-transparent"
                    style={{
                        background: `linear-gradient(to bottom, transparent 0%, ${skinConfig.colors.primary}10 50%, transparent 100%)`,
                        height: "200%",
                    }}
                    animate={{
                        y: ["-100%", "0%"],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            </div>

            {/* Animated Glow Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
                style={{ backgroundColor: skinConfig.colors.primary }}
            />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
                style={{ backgroundColor: skinConfig.colors.accent }}
            />

            {/* Floating Tech Particles (Binary/Squares) */}
            {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                    key={`tech-particle-${i}`}
                    className="absolute text-[10px] font-mono font-bold opacity-20 select-none pointer-events-none"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        color: i % 2 === 0 ? skinConfig.colors.primary : skinConfig.colors.accent,
                    }}
                    animate={{
                        y: [0, -50],
                        opacity: [0, 0.5, 0],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 4,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: "linear",
                    }}
                >
                    {Math.random() > 0.5 ? "1" : "0"}
                </motion.div>
            ))}

            {/* Premium Glowing Path - Vertical Timeline */}
            <div className="absolute inset-0 flex justify-center" style={{ zIndex: 0 }}>
                <div className="relative w-1 h-full">
                    {/* Background track */}
                    <div 
                        className="absolute inset-0 rounded-full"
                        style={{
                            backgroundColor: `${skinConfig.colors.primary}20`,
                        }}
                    />
                    {/* Animated progress line with glow */}
                    <motion.div
                        className="absolute top-0 left-0 right-0 rounded-full"
                        style={{
                            background: `linear-gradient(180deg, ${skinConfig.colors.primary}, ${skinConfig.colors.accent}, ${skinConfig.colors.secondary})`,
                            boxShadow: `0 0 20px ${skinConfig.colors.primary}60, 0 0 40px ${skinConfig.colors.accent}40`,
                        }}
                        initial={{ height: "0%" }}
                        animate={{ height: `${progressPercentage}%` }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />

                    {/* Data Packets Moving Down */}
                    <motion.div
                        className="absolute w-2 h-4 rounded-full"
                        style={{
                            left: "-2px",
                            backgroundColor: skinConfig.colors.textPrimary,
                            boxShadow: `0 0 15px ${skinConfig.colors.textPrimary}`,
                        }}
                        animate={{
                            top: ["0%", "100%"],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                    <motion.div
                        className="absolute w-2 h-4 rounded-full"
                        style={{
                            left: "-2px",
                            backgroundColor: skinConfig.colors.accent,
                            boxShadow: `0 0 15px ${skinConfig.colors.accent}`,
                        }}
                        animate={{
                            top: ["0%", "100%"],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 4.5,
                            repeat: Infinity,
                            delay: 2,
                            ease: "linear",
                        }}
                    />
                </div>
            </div>

            {/* Nodes - Responsive Premium Design */}
            <div className="relative z-10 flex flex-col gap-12 md:gap-20 lg:gap-24 w-full max-w-md items-center pt-6 md:pt-10">
                {roadmapDefinitions.map((def, index) => {
                    const nodeState = roadmapProgress[def.id] || { status: "locked", completedLessons: 0 };
                    const isSelected = selectedNodeId === def.id;

                    return (
                        <motion.div
                            key={def.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className="relative w-full flex justify-center"
                        >
                            <button
                                onClick={() => onNodeSelect(def.id)}
                                className={cn(
                                    "relative z-10 w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center border-4 transition-all duration-300 hover:scale-110 active:scale-95 group",
                                    nodeState.status === "locked" && "grayscale"
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
                                    color: "white",
                                    boxShadow: nodeState.status === "completed"
                                        ? `0 0 25px ${skinConfig.colors.nodeCompleted}50, inset 0 0 15px ${skinConfig.colors.nodeCompleted}30`
                                        : nodeState.status === "active"
                                        ? `0 0 35px ${skinConfig.colors.nodeActive}70, inset 0 0 20px ${skinConfig.colors.nodeActive}40`
                                        : `0 0 10px ${skinConfig.colors.nodeLocked}20`,
                                }}
                            >
                                {/* Corner Accents */}
                                <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: skinConfig.colors.textPrimary }} />
                                <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: skinConfig.colors.textPrimary }} />
                                <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: skinConfig.colors.textPrimary }} />
                                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: skinConfig.colors.textPrimary }} />

                                {nodeState.status === "completed" ? (
                                    <Check className="w-6 h-6 md:w-8 md:h-8" />
                                ) : nodeState.status === "locked" ? (
                                    <Lock className="w-5 h-5 md:w-6 md:h-6 opacity-70" />
                                ) : (
                                    <Cpu className="w-6 h-6 md:w-8 md:h-8 text-white animate-pulse" />
                                )}

                                {/* Premium Glow effect for active nodes */}
                                {nodeState.status === "active" && (
                                    <>
                                        <motion.div
                                            className="absolute inset-0 rounded-xl md:rounded-2xl"
                                            style={{ 
                                                backgroundColor: skinConfig.colors.nodeActive,
                                                filter: "blur(8px)",
                                            }}
                                            animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                        <motion.div
                                            className="absolute -inset-2 rounded-xl md:rounded-2xl"
                                            style={{ 
                                                border: `2px solid ${skinConfig.colors.nodeActive}`,
                                            }}
                                            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                                            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                        />
                                        {/* Glitch Effect Element */}
                                        <motion.div
                                            className="absolute inset-0 rounded-xl md:rounded-2xl opacity-50 mix-blend-screen"
                                            style={{ backgroundColor: skinConfig.colors.accent }}
                                            animate={{
                                                x: [0, -2, 2, 0],
                                                opacity: [0, 0.5, 0],
                                            }}
                                            transition={{
                                                duration: 0.2,
                                                repeat: Infinity,
                                                repeatDelay: 3 + Math.random() * 2
                                            }}
                                        />
                                    </>
                                )}

                                {/* Premium Label - Responsive */}
                                <div className={cn(
                                    "absolute left-full md:left-20 top-1/2 -translate-y-1/2 w-40 md:w-48 text-left pl-2 md:pl-4 transition-all pointer-events-none",
                                    isSelected ? "opacity-100 translate-x-0" : "opacity-60 translate-x-[-5px] md:translate-x-[-10px]"
                                )}>
                                    <div 
                                        className="text-sm md:text-lg font-bold truncate flex items-center gap-2"
                                        style={{ color: skinConfig.colors.textPrimary, textShadow: `0 0 10px ${skinConfig.colors.primary}80` }}
                                    >
                                        {def.title}
                                        {nodeState.status === "active" && <Zap className="w-3 h-3 md:w-4 md:h-4 animate-bounce" style={{ color: skinConfig.colors.warning }} />}
                                    </div>
                                    <div 
                                        className="text-xs md:text-xs font-mono"
                                        style={{ color: skinConfig.colors.textSecondary }}
                                    >
                                        SYSTEM.LEVEL.{def.level}
                                    </div>
                                </div>
                            </button>
                        </motion.div>
                    );
                })}
            </div>
        </BaseSkin>
    );
}
