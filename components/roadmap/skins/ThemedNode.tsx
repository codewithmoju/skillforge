"use client";

import { motion } from "framer-motion";
import { Check, Lock, Star, Zap, Leaf, Rocket, Flame, Waves } from "lucide-react";
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
    const getNodeStyle = () => {
        const baseStyle: React.CSSProperties = {
            position: 'relative',
            zIndex: 10,
            width: '64px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: '4px',
            borderStyle: 'solid',
            transition: 'all 0.3s ease',
        };

        switch (skin.id) {
            case 'cyber-neon':
                return {
                    ...baseStyle,
                    borderRadius: '16px',
                    backgroundColor: status === 'locked' ? '#1e293b' : '#0f172a',
                    borderColor: status === 'completed' ? skin.colors.nodeCompleted :
                        status === 'active' ? skin.colors.nodeActive :
                            skin.colors.nodeLocked,
                    color: status === 'completed' ? skin.colors.nodeCompleted :
                        status === 'active' ? skin.colors.nodeActive :
                            skin.colors.nodeLocked,
                    boxShadow: status === 'completed' ? `0 0 20px ${skin.colors.nodeCompleted}40` :
                        status === 'active' ? `0 0 30px ${skin.colors.nodeActive}60` :
                            'none',
                    filter: status === 'locked' ? 'grayscale(1)' : 'none',
                };

            case 'forest-quest':
                return {
                    ...baseStyle,
                    borderRadius: '50%',
                    background: status === 'completed' ? 'linear-gradient(135deg, #14532d, #065f46)' :
                        status === 'active' ? 'linear-gradient(135deg, #166534, #047857)' :
                            '#1e293b',
                    borderColor: status === 'completed' ? '#22c55e' :
                        status === 'active' ? '#4ade80' :
                            '#475569',
                    color: status === 'completed' ? '#86efac' :
                        status === 'active' ? '#bbf7d0' :
                            '#64748b',
                    boxShadow: status === 'completed' ? '0 0 20px rgba(34,197,94,0.4)' :
                        status === 'active' ? '0 0 30px rgba(34,197,94,0.5)' :
                            'none',
                    filter: status === 'locked' ? 'grayscale(1)' : 'none',
                };

            case 'space-odyssey':
                return {
                    ...baseStyle,
                    borderRadius: '50%',
                    background: status === 'completed' ? 'linear-gradient(135deg, #581c87, #9333ea)' :
                        status === 'active' ? 'linear-gradient(135deg, #701a75, #db2777)' :
                            '#1e293b',
                    borderColor: status === 'completed' ? '#a855f7' :
                        status === 'active' ? '#ec4899' :
                            '#475569',
                    color: status === 'completed' ? '#e9d5ff' :
                        status === 'active' ? '#fbcfe8' :
                            '#64748b',
                    boxShadow: status === 'completed' ? '0 0 25px rgba(168,85,247,0.5)' :
                        status === 'active' ? '0 0 35px rgba(236,72,153,0.6)' :
                            'none',
                    filter: status === 'locked' ? 'grayscale(1)' : 'none',
                };

            case 'dragons-lair':
                return {
                    ...baseStyle,
                    borderRadius: '8px',
                    transform: 'rotate(45deg)',
                    background: status === 'completed' ? 'linear-gradient(135deg, #7c2d12, #c2410c)' :
                        status === 'active' ? 'linear-gradient(135deg, #991b1b, #dc2626)' :
                            '#1e293b',
                    borderColor: status === 'completed' ? '#f97316' :
                        status === 'active' ? '#ef4444' :
                            '#475569',
                    color: status === 'completed' ? '#fed7aa' :
                        status === 'active' ? '#fecaca' :
                            '#64748b',
                    boxShadow: status === 'completed' ? '0 0 25px rgba(249,115,22,0.5)' :
                        status === 'active' ? '0 0 35px rgba(239,68,68,0.6)' :
                            'none',
                    filter: status === 'locked' ? 'grayscale(1)' : 'none',
                };

            case 'ocean-depths':
                return {
                    ...baseStyle,
                    borderRadius: '50%',
                    background: status === 'completed' ? 'linear-gradient(135deg, #164e63, #0e7490)' :
                        status === 'active' ? 'linear-gradient(135deg, #155e75, #0891b2)' :
                            '#1e293b',
                    borderColor: status === 'completed' ? '#14b8a6' :
                        status === 'active' ? '#06b6d4' :
                            '#475569',
                    color: status === 'completed' ? '#99f6e4' :
                        status === 'active' ? '#a5f3fc' :
                            '#64748b',
                    boxShadow: status === 'completed' ? '0 0 20px rgba(20,184,166,0.4)' :
                        status === 'active' ? '0 0 30px rgba(6,182,212,0.5)' :
                            'none',
                    filter: status === 'locked' ? 'grayscale(1)' : 'none',
                };

            default:
                return baseStyle;
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
                    animate: {
                        opacity: 1,
                        y: 0,
                    },
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

    // Custom rendering for Forest Quest (Gamified Ruins/Stones)
    if (skin.id === 'forest-quest') {
        return (
            <motion.div
                className="absolute z-20"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transform: 'translate(-50%, -50%)',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: level * 0.1, type: "spring" as const }}
            >
                <motion.button
                    onClick={onClick}
                    className="relative w-24 h-24 flex items-center justify-center group"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {/* LOCKED STATE: Ancient Stone Ruin */}
                    {status === 'locked' && (
                        <div className="relative w-full h-full drop-shadow-xl grayscale opacity-80">
                            {/* Stone Base */}
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                                <path d="M50 15 L85 35 L85 75 L50 95 L15 75 L15 35 Z" fill="#334155" stroke="#1e293b" strokeWidth="4" />
                                {/* Cracks */}
                                <path d="M30 40 L45 55 M70 80 L60 65" stroke="#0f172a" strokeWidth="2" opacity="0.5" />
                                {/* Moss */}
                                <circle cx="30" cy="70" r="8" fill="#14532d" opacity="0.6" />
                                <circle cx="75" cy="40" r="5" fill="#14532d" opacity="0.5" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Lock className="w-8 h-8 text-slate-500" />
                            </div>
                        </div>
                    )}

                    {/* ACTIVE STATE: Glowing Magical Rune Stone */}
                    {status === 'active' && (
                        <div className="relative w-full h-full">
                            {/* Pulsing Aura */}
                            <div className="absolute inset-0 bg-emerald-500/40 rounded-full blur-2xl animate-pulse" />

                            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_20px_rgba(16,185,129,0.8)]">
                                {/* Magical Stone Base */}
                                <path d="M50 10 L90 32 L90 78 L50 100 L10 78 L10 32 Z" fill="#064e3b" stroke="#34d399" strokeWidth="3" />

                                {/* Inner Glow Gradient */}
                                <defs>
                                    <radialGradient id="magicGlow" cx="50%" cy="50%" r="50%">
                                        <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
                                        <stop offset="100%" stopColor="#064e3b" stopOpacity="0" />
                                    </radialGradient>
                                </defs>
                                <circle cx="50" cy="50" r="30" fill="url(#magicGlow)" className="animate-pulse" />

                                {/* Rotating Runes Ring */}
                                <g className="animate-[spin_8s_linear_infinite]">
                                    <circle cx="50" cy="50" r="28" stroke="#34d399" strokeWidth="1" strokeDasharray="4 8" fill="none" />
                                </g>
                            </svg>

                            {/* Floating Icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Leaf className="w-10 h-10 text-emerald-300 drop-shadow-lg animate-bounce" />
                            </div>
                        </div>
                    )}

                    {/* COMPLETED STATE: Golden Temple Artifact */}
                    {status === 'completed' && (
                        <div className="relative w-full h-full">
                            {/* Golden Shine */}
                            <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-xl" />

                            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]">
                                {/* Golden Hexagon */}
                                <path d="M50 5 L95 27 L95 73 L50 95 L5 73 L5 27 Z" fill="url(#goldGradient)" stroke="#b45309" strokeWidth="2" />

                                <defs>
                                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#fcd34d" />
                                        <stop offset="50%" stopColor="#fbbf24" />
                                        <stop offset="100%" stopColor="#d97706" />
                                    </linearGradient>
                                </defs>

                                {/* Decorative Border */}
                                <path d="M50 15 L85 32 L85 68 L50 85 L15 68 L15 32 Z" fill="none" stroke="#78350f" strokeWidth="1" opacity="0.5" />
                            </svg>

                            <div className="absolute inset-0 flex items-center justify-center">
                                <Check className="w-10 h-10 text-amber-900 drop-shadow-sm" strokeWidth={3} />
                            </div>
                        </div>
                    )}
                </motion.button>

                {/* RPG Style Label */}
                <div
                    className={`absolute left-1/2 -translate-x-1/2 top-full mt-1 w-48 text-center transition-all duration-300 ${isSelected ? "opacity-100 scale-100 z-30" : "opacity-80 scale-90 z-10"
                        }`}
                >
                    <div className={`
                        relative px-4 py-2 rounded-lg border-2 shadow-xl backdrop-blur-md
                        ${status === 'completed' ? 'bg-amber-900/80 border-amber-500/50' :
                            status === 'active' ? 'bg-emerald-900/80 border-emerald-500/50' :
                                'bg-slate-800/80 border-slate-600/50'}
                    `}>
                        <div className={`text-sm font-bold font-serif tracking-wide
                            ${status === 'completed' ? 'text-amber-200' :
                                status === 'active' ? 'text-emerald-200' :
                                    'text-slate-300'}
                        `}>
                            {title}
                        </div>
                        <div className="flex items-center justify-center gap-2 mt-1">
                            <div className="h-[1px] w-4 bg-current opacity-30" />
                            <div className="text-[10px] uppercase tracking-widest opacity-70">
                                Lvl {level}
                            </div>
                            <div className="h-[1px] w-4 bg-current opacity-30" />
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
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: 'translate(-50%, -50%)',
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
                style={getNodeStyle()}
                whileHover={{
                    scale: skin.animations.hover.scale,
                    transition: { duration: skin.animations.hover.duration / 1000 },
                }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Icon - counter-rotate for dragon's lair */}
                <div style={{ transform: skin.id === 'dragons-lair' ? 'rotate(-45deg)' : 'none' }}>
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
                className={`absolute left-20 top-1/2 -translate-y-1/2 w-48 text-left pl-4 transition-all ${isSelected ? "opacity-100 translate-x-0" : "opacity-50 translate-x-[-10px]"
                    }`}
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
