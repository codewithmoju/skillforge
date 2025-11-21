"use client";

import { motion } from "framer-motion";
import { Check, Lock, Star, Droplet, Anchor, Shell } from "lucide-react";
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

    return (
        <BaseSkin {...props}>
            {/* Ocean Background with Caustics */}
            <div 
                className="absolute inset-0 overflow-hidden"
                style={{
                    background: `linear-gradient(to bottom, #023e8a 0%, #0077b6 40%, #0096c7 80%, #48cae4 100%)`,
                }}
            >
                {/* Caustic Overlay */}
                <div
                    className="absolute inset-0 opacity-20 mix-blend-overlay"
                    style={{
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.005' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
                        backgroundSize: "cover",
                    }}
                />
                <motion.div
                    className="absolute inset-0 opacity-10"
                     style={{
                        background: "linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.4) 45%, transparent 50%)",
                        backgroundSize: "200% 200%"
                     }}
                     animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                     transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                />
            </div>

            {/* Animated Bubble Particles */}
            {Array.from({ length: 25 }).map((_, i) => (
                <motion.div
                    key={`bubble-${i}`}
                    className="absolute rounded-full border border-white/30 bg-white/10 backdrop-blur-sm"
                    style={{
                        left: `${Math.random() * 100}%`,
                        bottom: "-10%",
                        width: `${Math.random() * 12 + 4}px`,
                        height: `${Math.random() * 12 + 4}px`,
                    }}
                    animate={{
                        y: ["0vh", "-120vh"],
                        x: [0, Math.sin(i) * 50], // Wobbly ascent
                        opacity: [0, 0.6, 0],
                        scale: [1, 1.2],
                    }}
                    transition={{
                        duration: 8 + Math.random() * 10,
                        repeat: Infinity,
                        delay: Math.random() * 10,
                        ease: "linear",
                    }}
                />
            ))}

            {/* Seaweed / Plants (Decorative) */}
            {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                    key={`seaweed-${i}`}
                    className="absolute bottom-0 w-8 origin-bottom opacity-30"
                    style={{
                        left: `${10 + i * 15}%`,
                        height: `${200 + Math.random() * 100}px`,
                        backgroundColor: "#006d77",
                        borderRadius: "50% 50% 0 0",
                        filter: "blur(2px)"
                    }}
                    animate={{
                        skewX: [-5, 5, -5],
                        scaleY: [1, 1.05, 1]
                    }}
                    transition={{
                        duration: 4 + Math.random() * 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.5
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
                                height: "6px",
                                transformOrigin: "0 50%",
                                transform: `translate(20px, 20px) rotate(${angle}deg)`,
                            }}
                        >
                            {/* Water Pipe / Stream Background */}
                            <div
                                className="absolute inset-0 rounded-full"
                                style={{
                                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                                    border: "1px solid rgba(255, 255, 255, 0.2)"
                                }}
                            />
                            {/* Active glowing water flow */}
                            {isPathActive && (
                                <motion.div
                                    className="absolute inset-0 rounded-full overflow-hidden"
                                    style={{
                                        background: `linear-gradient(90deg, ${skinConfig.colors.primary}, ${skinConfig.colors.accent})`,
                                        boxShadow: `0 0 15px ${skinConfig.colors.accent}`,
                                    }}
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.8, delay: index * 0.1 }}
                                >
                                    <motion.div
                                        className="absolute inset-0 bg-white/30"
                                        animate={{ x: ["-100%", "100%"] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    />
                                </motion.div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Nodes as Underwater Treasures/Pearls */}
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
                                            "relative z-10 w-20 h-20 rounded-full flex items-center justify-center border-4 transition-all duration-300 hover:scale-125 backdrop-blur-md",
                                            nodeState.status === "active" && "animate-pulse ring-4 ring-cyan-400/30"
                                        )}
                                        style={{
                                            background: nodeState.status === "completed"
                                                ? "radial-gradient(circle at 30% 30%, #ccfbf1, #0f766e)" // Pearl look
                                                : nodeState.status === "active"
                                                ? "radial-gradient(circle at 30% 30%, #a5f3fc, #0891b2)" // Blue pearl
                                                : "radial-gradient(circle at 30% 30%, #94a3b8, #334155)", // Grey stone
                                            borderColor: "rgba(255,255,255,0.4)",
                                            boxShadow: "0 10px 20px rgba(0,0,0,0.4), inset 0 0 20px rgba(255,255,255,0.5)"
                                        }}
                                    >
                                        {nodeState.status === "completed" ? (
                                            <Check className="w-10 h-10 text-teal-800" />
                                        ) : nodeState.status === "locked" ? (
                                            <Anchor className="w-8 h-8 text-slate-400 opacity-50" />
                                        ) : (
                                            <Shell className="w-10 h-10 text-cyan-900 fill-cyan-100 animate-pulse" />
                                        )}

                                        {/* Ripple effect for active nodes */}
                                        {nodeState.status === "active" && (
                                            <>
                                                <motion.div
                                                    className="absolute inset-0 rounded-full border-2"
                                                    style={{ borderColor: "rgba(255,255,255,0.5)" }}
                                                    animate={{ 
                                                        scale: [1, 1.8],
                                                        opacity: [0.6, 0],
                                                    }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                />
                                                <motion.div
                                                    className="absolute inset-0 rounded-full border-2"
                                                    style={{ borderColor: "rgba(255,255,255,0.3)" }}
                                                    animate={{ 
                                                        scale: [1, 1.8],
                                                        opacity: [0.6, 0],
                                                    }}
                                                    transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
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
                                        className="text-base font-bold mb-1 text-cyan-100 drop-shadow-md"
                                    >
                                        {def.title}
                                    </div>
                                    <div 
                                        className="text-xs text-cyan-300"
                                    >
                                        Depth {def.level}
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
