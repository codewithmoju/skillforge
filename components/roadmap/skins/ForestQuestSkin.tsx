"use client";

import { motion } from "framer-motion";
import { Check, Lock, Star, Leaf, Flower } from "lucide-react";
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
            {/* Forest Background with Sunlight filtering through */}
            <div 
                className="absolute inset-0 overflow-hidden"
                style={{
                    backgroundColor: "#051a05",
                    backgroundImage: `
                        linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 100%),
                        radial-gradient(circle at 50% 0%, ${skinConfig.colors.primary}30 0%, transparent 70%)
                    `,
                }}
            >
                {/* Sunbeams */}
                <motion.div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full origin-top"
                    style={{
                        background: "conic-gradient(from 0deg at 50% -20%, transparent 45%, rgba(255,255,255,0.05) 48%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 52%, transparent 55%)",
                        filter: "blur(10px)",
                    }}
                    animate={{ rotate: [-5, 5, -5] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* Animated Falling Leaves */}
            {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                    key={`leaf-${i}`}
                    className="absolute"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: "-10%",
                    }}
                    animate={{
                        y: ["0vh", "110vh"],
                        x: [0, (Math.random() - 0.5) * 200],
                        rotate: [0, 360],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: 10 + Math.random() * 10,
                        repeat: Infinity,
                        delay: Math.random() * 10,
                        ease: "linear",
                    }}
                >
                    <Leaf 
                        className="w-4 h-4"
                        style={{
                            color: i % 3 === 0 ? skinConfig.colors.primary :
                                   i % 3 === 1 ? skinConfig.colors.secondary :
                                   skinConfig.colors.accent
                        }}
                    />
                </motion.div>
            ))}

            {/* Fireflies */}
            {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                    key={`firefly-${i}`}
                    className="absolute w-1 h-1 rounded-full bg-yellow-300"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        boxShadow: "0 0 4px #fef08a"
                    }}
                    animate={{
                        x: [0, (Math.random() - 0.5) * 50],
                        y: [0, (Math.random() - 0.5) * 50],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: 2 + Math.random() * 3,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                    }}
                />
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
                    const deltaX = currentPos.x; // Relative to center
                    const deltaY = endY - startY;

                    // Using SVG for curved branches
                    const startX_abs = prevPos.x;
                    const endX_abs = currentPos.x;

                    // Control points for bezier curve to make it look like a branch
                    const cp1x = startX_abs;
                    const cp1y = startY + deltaY * 0.5;
                    const cp2x = endX_abs;
                    const cp2y = startY + deltaY * 0.5;

                    // To draw SVG lines, we need a container. But since we are positioning divs,
                    // let's stick to the rotated div approach but maybe add a sway animation
                    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
                    
                    // Calculate offset to center the line (since prevPos is relative to center, but we need absolute coords roughly)
                    // Actually, let's just use the div positioning logic we had, but improve styling

                    return (
                        <motion.div
                            key={`branch-${def.id}`}
                            className="absolute origin-left"
                            style={{
                                left: `calc(50% + ${prevPos.x}px)`, // Start from previous node center
                                top: `calc(${100 + prevPos.y}px)`,
                                width: `${length}px`,
                                height: "8px",
                                transformOrigin: "0 50%",
                            }}
                            initial={{ rotate: angle }}
                            animate={{ rotate: [angle - 0.5, angle + 0.5, angle - 0.5] }} // Subtle sway
                            transition={{ duration: 5 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            {/* Branch Texture */}
                            <div
                                className="absolute inset-0 rounded-full"
                                style={{
                                    backgroundColor: "#3e2723", // Dark brown wood
                                    backgroundImage: "linear-gradient(90deg, #3e2723 0%, #5d4037 50%, #3e2723 100%)",
                                    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)"
                                }}
                            />

                            {/* Sap/Energy Flow */}
                            {isPathActive && (
                                <motion.div
                                    className="absolute inset-0 rounded-full opacity-50"
                                    style={{
                                        background: `linear-gradient(90deg, transparent, ${skinConfig.colors.primary}, transparent)`,
                                    }}
                                    animate={{ x: ["-100%", "100%"] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                            )}

                            {/* Small leaves on branches */}
                            {isPathActive && (
                                <>
                                    <motion.div className="absolute top-0 left-1/3 -mt-2" animate={{ rotate: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                                        <Leaf className="w-3 h-3 text-green-500 fill-green-700" />
                                    </motion.div>
                                    <motion.div className="absolute bottom-0 right-1/3 -mb-2 scale-x-[-1]" animate={{ rotate: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                                        <Leaf className="w-3 h-3 text-green-400 fill-green-600" />
                                    </motion.div>
                                </>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Nodes as Tree Fruits/Flowers */}
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
                                {/* Swaying animation for the whole node */}
                                <motion.div
                                    animate={{ rotate: [0, 2, -2, 0] }}
                                    transition={{ duration: 4 + Math.random(), repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <button
                                        onClick={() => onNodeSelect(def.id)}
                                        className={cn(
                                            "relative z-10 w-20 h-20 rounded-full flex items-center justify-center border-4 transition-all duration-300 hover:scale-110",
                                            nodeState.status === "active" && "animate-pulse ring-4 ring-green-400/30"
                                        )}
                                        style={{
                                            backgroundColor: nodeState.status === "completed"
                                                ? skinConfig.colors.nodeCompleted
                                                : nodeState.status === "active"
                                                ? skinConfig.colors.nodeActive
                                                : "#2c1810", // Dark wood for locked
                                            borderColor: nodeState.status === "completed"
                                                ? "#064e3b"
                                                : nodeState.status === "active"
                                                ? "#14532d"
                                                : "#3e2723",
                                            boxShadow: "0 4px 6px rgba(0,0,0,0.3), inset 0 -4px 4px rgba(0,0,0,0.2)"
                                        }}
                                    >
                                        {nodeState.status === "completed" ? (
                                            <Flower className="w-10 h-10 text-white fill-pink-200" />
                                        ) : nodeState.status === "locked" ? (
                                            <Lock className="w-8 h-8 text-white opacity-30" />
                                        ) : (
                                            <Star className="w-10 h-10 text-yellow-200 fill-yellow-400 animate-spin-slow" />
                                        )}

                                        {/* Bloom effect for completed nodes */}
                                        {nodeState.status === "completed" && (
                                            <motion.div
                                                className="absolute -inset-6 pointer-events-none"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                            >
                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-pink-400 rounded-full blur-sm" />
                                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-pink-400 rounded-full blur-sm" />
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-pink-400 rounded-full blur-sm" />
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-pink-400 rounded-full blur-sm" />
                                            </motion.div>
                                        )}

                                        {/* Vines for locked nodes */}
                                        {nodeState.status === "locked" && (
                                            <div className="absolute inset-0 rounded-full border-2 border-dashed border-green-900/50" />
                                        )}
                                    </button>
                                </motion.div>

                                {/* Label */}
                                <div className={cn(
                                    "absolute top-full mt-4 left-1/2 -translate-x-1/2 w-48 text-center transition-all whitespace-nowrap bg-black/40 rounded-lg px-2 py-1 backdrop-blur-sm",
                                    isSelected ? "opacity-100 scale-110" : "opacity-70 scale-100"
                                )}>
                                    <div
                                        className="text-base font-bold mb-1"
                                        style={{ color: "#ecfccb" }}
                                    >
                                        {def.title}
                                    </div>
                                    <div
                                        className="text-xs"
                                        style={{ color: "#bef264" }}
                                    >
                                        Grove {def.level}
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
