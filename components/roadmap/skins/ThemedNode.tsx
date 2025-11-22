"use client";

import { motion } from "framer-motion";
import { Check, Lock, Star, Zap, Leaf, Rocket, Flame, Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import { SkinConfig } from "@/lib/types/skins";

interface ThemedNodeProps {
    id: string;
    title: string;
    level: number;
    status: 'locked' | 'active' | 'completed';
    onClick: () => void;
    isSelected: boolean;
    skin: SkinConfig;
    position: { x: number; y: number };
}

export function ThemedNode({ id, title, level, status, onClick, isSelected, skin, position }: ThemedNodeProps) {
    // Get theme-specific icon
    const getIcon = () => {
        if (status === 'completed') return <Check className="w-6 h-6" />;
        if (status === 'locked') return <Lock className="w-5 h-5" />;

        // Active state - theme-specific icons
        switch (skin.id) {
            case 'cyber-neon':
                return <Zap className="w-6 h-6 fill-current" />;
            case 'forest-quest':
                return <Leaf className="w-6 h-6 fill-current" />;
            case 'space-odyssey':
                return <Rocket className="w-6 h-6 fill-current" />;
            case 'dragons-lair':
                return <Flame className="w-6 h-6 fill-current" />;
            case 'ocean-depths':
                return <Waves className="w-6 h-6 fill-current" />;
            default:
                return <Star className="w-6 h-6 fill-current" />;
        }
    };

    // Get theme-specific node styling
    const getNodeClass = () => {
        const baseClass = "relative z-10 w-16 h-16 flex items-center justify-center border-4 transition-all duration-300";

        switch (skin.id) {
            case 'cyber-neon':
                return cn(
                    baseClass,
                    "rounded-2xl",
                    status === 'completed' && `bg-slate-900 border-[${skin.colors.nodeCompleted}] text-[${skin.colors.nodeCompleted}] shadow-[0_0_20px_rgba(34,197,94,0.3)]`,
                    status === 'active' && `bg-slate-900 border-[${skin.colors.nodeActive}] text-[${skin.colors.nodeActive}] shadow-[0_0_30px_rgba(6,182,212,0.4)] animate-pulse-slow`,
                    status === 'locked' && `bg-slate-800 border-[${skin.colors.nodeLocked}] text-[${skin.colors.nodeLocked}] grayscale`
                );

            case 'forest-quest':
                return cn(
                    baseClass,
                    "rounded-full",
                    status === 'completed' && "bg-gradient-to-br from-green-900 to-emerald-900 border-green-500 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.4)]",
                    status === 'active' && "bg-gradient-to-br from-green-800 to-emerald-800 border-green-400 text-green-300 shadow-[0_0_30px_rgba(34,197,94,0.5)]",
                    status === 'locked' && "bg-slate-800 border-slate-600 text-slate-500 grayscale"
                );

            case 'space-odyssey':
                return cn(
                    baseClass,
                    "rounded-full",
                    status === 'completed' && "bg-gradient-to-br from-purple-900 to-pink-900 border-purple-500 text-purple-300 shadow-[0_0_25px_rgba(168,85,247,0.5)]",
                    status === 'active' && "bg-gradient-to-br from-purple-800 to-pink-800 border-pink-500 text-pink-300 shadow-[0_0_35px_rgba(236,72,153,0.6)] animate-pulse",
                    status === 'locked' && "bg-slate-800 border-slate-600 text-slate-500 grayscale"
                );

            case 'dragons-lair':
                return cn(
                    baseClass,
                    "rounded-lg rotate-45",
                    status === 'completed' && "bg-gradient-to-br from-red-900 to-orange-900 border-orange-500 text-orange-300 shadow-[0_0_25px_rgba(249,115,22,0.5)]",
                    status === 'active' && "bg-gradient-to-br from-red-800 to-orange-800 border-red-500 text-red-300 shadow-[0_0_35px_rgba(239,68,68,0.6)]",
                    status === 'locked' && "bg-slate-800 border-slate-600 text-slate-500 grayscale"
                );

            case 'ocean-depths':
                return cn(
                    baseClass,
                    "rounded-full",
                    status === 'completed' && "bg-gradient-to-br from-cyan-900 to-teal-900 border-teal-500 text-teal-300 shadow-[0_0_20px_rgba(20,184,166,0.4)]",
                    status === 'active' && "bg-gradient-to-br from-cyan-800 to-teal-800 border-cyan-500 text-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.5)]",
                    status === 'locked' && "bg-slate-800 border-slate-600 text-slate-500 grayscale"
                );

            default:
                return baseClass;
        }
    };

    // Animation variants based on skin
    const getAnimationVariants = () => {
        const { animations } = skin;

        switch (animations.nodeEntry.type) {
            case 'glow':
                return {
                    initial: { opacity: 0, scale: 0.8, filter: "brightness(0.5)" },
                    animate: { opacity: 1, scale: 1, filter: "brightness(1)" },
                };
            case 'bounce':
                return {
                    initial: { opacity: 0, y: -50 },
                    animate: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.5 } },
                };
            case 'scale':
                return {
                    initial: { opacity: 0, scale: 0 },
                    animate: { opacity: 1, scale: 1 },
                };
            case 'slide':
                return {
                    initial: { opacity: 0, x: -50 },
                    animate: { opacity: 1, x: 0 },
                };
            default:
                return {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                };
        }
    };

    const variants = getAnimationVariants();

    // Custom rendering for Forest Quest
    if (skin.id === 'forest-quest') {
        return (
            <motion.div
                className="absolute z-20"
                style={{
                    left: `calc(50% + ${position.x}px)`,
                    top: `${position.y}px`,
                    transform: 'translate(-50%, 0)',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: level * 0.1, type: "spring" }}
            >
                <motion.button
                    onClick={onClick}
                    className="relative w-20 h-20 flex items-center justify-center group"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {/* Visuals based on status */}
                    {status === 'locked' && (
                        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                            {/* Stone Bud */}
                            <path d="M50 20 C30 20 20 50 20 70 C20 90 40 95 50 95 C60 95 80 90 80 70 C80 50 70 20 50 20 Z" fill="#374151" stroke="#1f2937" strokeWidth="2" />
                            <path d="M50 20 C50 20 45 50 50 95" stroke="#1f2937" strokeWidth="1" opacity="0.5" />
                            <path d="M30 60 L40 70 M70 60 L60 70" stroke="#1f2937" strokeWidth="2" opacity="0.3" />
                        </svg>
                    )}

                    {status === 'active' && (
                        <div className="relative w-full h-full">
                            {/* Pulsing Glow */}
                            <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-xl animate-pulse" />
                            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]">
                                {/* Blooming Flower */}
                                <g className="animate-[spin_10s_linear_infinite]">
                                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                                        <path
                                            key={i}
                                            d="M50 50 Q30 20 50 10 Q70 20 50 50"
                                            fill="#10b981"
                                            stroke="#065f46"
                                            strokeWidth="1"
                                            transform={`rotate(${angle} 50 50)`}
                                        />
                                    ))}
                                </g>
                                <circle cx="50" cy="50" r="15" fill="#fcd34d" className="animate-pulse" />
                            </svg>
                        </div>
                    )}

                    {status === 'completed' && (
                        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
                            {/* Golden Fruit */}
                            <circle cx="50" cy="50" r="35" fill="url(#goldGradient)" stroke="#b45309" strokeWidth="2" />
                            <defs>
                                <radialGradient id="goldGradient" cx="30%" cy="30%" r="70%">
                                    <stop offset="0%" stopColor="#fcd34d" />
                                    <stop offset="100%" stopColor="#d97706" />
                                </radialGradient>
                            </defs>
                            {/* Shine */}
                            <ellipse cx="35" cy="35" rx="10" ry="5" fill="white" opacity="0.4" transform="rotate(-45 35 35)" />
                        </svg>
                    )}

                    {/* Icon Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center text-white drop-shadow-md pointer-events-none">
                        {status === 'locked' && <Lock className="w-6 h-6 text-slate-400" />}
                        {status === 'active' && <Leaf className="w-8 h-8 text-emerald-900" />}
                        {status === 'completed' && <Check className="w-8 h-8 text-amber-900" />}
                    </div>
                </motion.button>

                {/* Organic Label */}
                <div
                    className={cn(
                        "absolute left-1/2 -translate-x-1/2 top-full mt-2 w-40 text-center transition-all",
                        isSelected ? "opacity-100 scale-100" : "opacity-70 scale-90"
                    )}
                >
                    <div className="bg-[#1a2f16]/80 backdrop-blur-sm border border-[#2d4a22] px-3 py-1 rounded-lg shadow-lg">
                        <div className="text-sm font-bold text-[#e2d5c3] font-serif leading-tight">
                            {title}
                        </div>
                        <div className="text-[10px] text-emerald-400 uppercase tracking-wider mt-0.5">
                            Level {level}
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Default rendering for other skins
    return (
        <motion.div
            className="absolute"
            style={{
                left: `calc(50% + ${position.x}px)`,
                top: `${position.y}px`,
                transform: 'translate(-50%, 0)',
            }}
            initial={variants.initial}
            animate={variants.animate}
            transition={{
                duration: skin.animations.nodeEntry.duration / 1000,
                delay: level * skin.animations.nodeEntry.delay / 1000,
            }}
        >
            <motion.button
                onClick={onClick}
                className={getNodeClass()}
                whileHover={{
                    scale: skin.animations.hover.scale,
                    transition: { duration: skin.animations.hover.duration / 1000 },
                }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Icon - counter-rotate for dragon's lair */}
                <div className={skin.id === 'dragons-lair' ? '-rotate-45' : ''}>
                    {getIcon()}
                </div>

                {/* Glow effect for active nodes */}
                {status === 'active' && skin.effects.glow.enabled && (
                    <div
                        className="absolute inset-0 rounded-full blur-xl opacity-50"
                        style={{
                            background: skin.effects.glow.color,
                            filter: `blur(${skin.effects.glow.intensity * 20}px)`,
                        }}
                    />
                )}
            </motion.button>

            {/* Node Label */}
            <div
                className={cn(
                    "absolute left-20 top-1/2 -translate-y-1/2 w-48 text-left pl-4 transition-all",
                    isSelected ? "opacity-100 translate-x-0" : "opacity-50 translate-x-[-10px]"
                )}
            >
                <div className="text-lg font-bold" style={{ color: skin.colors.textPrimary }}>
                    {title}
                </div>
                <div className="text-xs" style={{ color: skin.colors.textSecondary }}>
                    Level {level}
                </div>
            </div>
        </motion.div>
    );
}
