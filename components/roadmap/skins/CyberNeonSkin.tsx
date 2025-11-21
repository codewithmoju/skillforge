"use client";

import { motion } from "framer-motion";
import { Check, Lock, Star } from "lucide-react";
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
            {/* Background Grid */}
            <div 
                className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
                style={{ opacity: 0.3 }}
            />

            {/* Animated Glow Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
                style={{ backgroundColor: skinConfig.colors.primary }}
            />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
                style={{ backgroundColor: skinConfig.colors.accent }}
            />

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
                    {/* Animated particles along the path */}
                    {roadmapDefinitions.map((def, index) => {
                        const nodeState = roadmapProgress[def.id];
                        const isActive = nodeState?.status === "active" || nodeState?.status === "completed";
                        if (!isActive) return null;
                        
                        const position = (index / (roadmapDefinitions.length - 1)) * progressPercentage;
                        
                        return (
                            <motion.div
                                key={`particle-${def.id}`}
                                className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
                                style={{
                                    top: `${position}%`,
                                    backgroundColor: skinConfig.colors.accent,
                                    boxShadow: `0 0 10px ${skinConfig.colors.accent}`,
                                }}
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: index * 0.2,
                                }}
                            />
                        );
                    })}
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
                                    "relative z-10 w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center border-4 transition-all duration-300 hover:scale-110 active:scale-95",
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
                                {nodeState.status === "completed" ? (
                                    <Check className="w-6 h-6 md:w-8 md:h-8" />
                                ) : nodeState.status === "locked" ? (
                                    <Lock className="w-5 h-5 md:w-6 md:h-6 opacity-70" />
                                ) : (
                                    <Star className="w-6 h-6 md:w-8 md:h-8 fill-white" />
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
                                    </>
                                )}

                                {/* Premium Label - Responsive */}
                                <div className={cn(
                                    "absolute left-full md:left-20 top-1/2 -translate-y-1/2 w-40 md:w-48 text-left pl-2 md:pl-4 transition-all pointer-events-none",
                                    isSelected ? "opacity-100 translate-x-0" : "opacity-60 translate-x-[-5px] md:translate-x-[-10px]"
                                )}>
                                    <div 
                                        className="text-sm md:text-lg font-bold truncate"
                                        style={{ color: skinConfig.colors.textPrimary }}
                                    >
                                        {def.title}
                                    </div>
                                    <div 
                                        className="text-xs md:text-xs"
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
        </BaseSkin>
    );
}

