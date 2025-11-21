"use client";

import { motion } from "framer-motion";
import { Check, Lock, Star, Flame, Sword, Skull } from "lucide-react";
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
            {/* Fire/Dungeon Background with Stone Texture */}
            <div 
                className="absolute inset-0"
                style={{
                    backgroundColor: "#1a0a0a",
                    backgroundImage: `
                        radial-gradient(circle at 50% 0%, ${skinConfig.colors.primary}20 0%, transparent 60%),
                        repeating-linear-gradient(45deg, #000000 0, #000000 10px, #111111 10px, #111111 20px)
                    `,
                    backgroundBlendMode: "overlay"
                }}
            />

            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at center, transparent 0%, #000 90%)" }} />

            {/* Fire Particle Effects - Smoke and Embers */}
            {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                    key={`ember-${i}`}
                    className="absolute rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        bottom: "0%",
                        width: `${Math.random() * 4 + 2}px`,
                        height: `${Math.random() * 4 + 2}px`,
                        backgroundColor: Math.random() > 0.5 ? skinConfig.colors.primary : skinConfig.colors.accent,
                        filter: "blur(1px)",
                    }}
                    animate={{
                        y: [0, -500],
                        x: [0, (Math.random() - 0.5) * 100],
                        opacity: [1, 0],
                        scale: [1, 0],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 4,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: "easeOut",
                    }}
                />
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
                                height: "16px", // Thicker path for stone look
                                transformOrigin: "0 50%",
                                transform: `translate(20px, 20px) rotate(${angle}deg)`,
                            }}
                        >
                            {/* Stone Path Background */}
                            <div
                                className="absolute inset-0"
                                style={{
                                    backgroundColor: "#333",
                                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='8' height='8' viewBox='0 0 8 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h4v4H0zm4 4h4v4H4z' fill='%23444' fill-opacity='0.4'/%3E%3C/svg%3E\")",
                                    border: "1px solid #555",
                                    boxShadow: "0 5px 10px rgba(0,0,0,0.5)"
                                }}
                            />

                            {/* Lava Flow for Active Path */}
                            {isPathActive && (
                                <motion.div
                                    className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 rounded-full overflow-hidden"
                                    style={{
                                        background: `linear-gradient(90deg, ${skinConfig.colors.primary}, ${skinConfig.colors.accent})`,
                                        boxShadow: `0 0 10px ${skinConfig.colors.primary}`,
                                    }}
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.8, delay: index * 0.1 }}
                                >
                                     <motion.div
                                        className="absolute inset-0 w-full h-full"
                                        style={{
                                            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                                        }}
                                        animate={{ x: ["-100%", "100%"] }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                     />
                                </motion.div>
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
                                {/* Torch Light Effect behind Active Node */}
                                {nodeState.status === "active" && (
                                    <motion.div
                                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full blur-3xl pointer-events-none"
                                        style={{ backgroundColor: skinConfig.colors.secondary, opacity: 0.4 }}
                                        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                                        transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                )}

                                <button
                                    onClick={() => onNodeSelect(def.id)}
                                    className={cn(
                                        "relative z-10 w-20 h-20 rounded-lg flex items-center justify-center border-4 transition-all duration-300 hover:scale-110 rotate-45 overflow-hidden",
                                        nodeState.status === "active" && "ring-4 ring-orange-500/30"
                                    )}
                                    style={{
                                        backgroundColor: "#2a1a1a",
                                        borderColor: nodeState.status === "completed"
                                            ? skinConfig.colors.nodeCompleted
                                            : nodeState.status === "active"
                                            ? skinConfig.colors.nodeActive
                                            : skinConfig.colors.nodeLocked,
                                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0z' fill='%23000000' fill-opacity='0.4'/%3E%3Cpath d='M0 0h10v10H0zM10 10h10v10H10z' fill='%23331111' fill-opacity='0.4'/%3E%3C/svg%3E\")",
                                        boxShadow: "0 10px 20px rgba(0,0,0,0.8), inset 0 2px 10px rgba(255,255,255,0.1)"
                                    }}
                                >
                                    <div className="rotate-[-45deg] relative z-10">
                                        {nodeState.status === "completed" ? (
                                            <Check className="w-10 h-10 text-green-500 drop-shadow-md" />
                                        ) : nodeState.status === "locked" ? (
                                            <Lock className="w-8 h-8 text-gray-500 opacity-50" />
                                        ) : (
                                            <Sword className="w-10 h-10 text-red-500 fill-red-900 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                                        )}
                                    </div>

                                    {/* Fire effect inside active nodes */}
                                    {nodeState.status === "active" && (
                                        <motion.div
                                            className="absolute inset-0 -bottom-full"
                                            style={{
                                                background: "linear-gradient(to top, rgba(255,100,0,0.5), transparent)",
                                            }}
                                            animate={{ y: ["0%", "-50%"] }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        />
                                    )}

                                    {/* Castle/Dungeon decoration */}
                                    <div 
                                        className="absolute inset-0 border-2 border-white/10"
                                    />
                                </button>

                                {/* Boss/Skull Icon for every 5th level or last level */}
                                {(index + 1) % 5 === 0 && (
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                                        <Skull className="w-6 h-6 text-gray-400" />
                                    </div>
                                )}

                                {/* Label */}
                                <div className={cn(
                                    "absolute top-full mt-8 left-1/2 -translate-x-1/2 w-48 text-center transition-all whitespace-nowrap z-20",
                                    isSelected ? "opacity-100 scale-110" : "opacity-70 scale-100"
                                )}>
                                    <div 
                                        className="text-base font-bold mb-1 font-serif tracking-wide"
                                        style={{ color: "#feb" }}
                                    >
                                        {def.title}
                                    </div>
                                    <div 
                                        className="text-xs font-serif italic"
                                        style={{ color: "#ca8" }}
                                    >
                                        Chamber {def.level}
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
