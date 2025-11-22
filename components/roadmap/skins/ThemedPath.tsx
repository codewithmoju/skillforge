"use client";

import { motion } from "framer-motion";
import { SkinConfig } from "@/lib/types/skins";

interface ThemedPathProps {
    from: { x: number; y: number };
    to: { x: number; y: number };
    status: 'inactive' | 'active' | 'completed';
    skin: SkinConfig;
}

export function ThemedPath({ from, to, status, skin }: ThemedPathProps) {
    // Calculate path
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Get color based on status
    const getColor = () => {
        switch (status) {
            case 'completed':
                return skin.colors.path.completed;
            case 'active':
                return skin.colors.path.active;
            default:
                return skin.colors.path.inactive;
        }
    };

    // Get path style based on skin
    const getPathStyle = () => {
        switch (skin.id) {
            case 'cyber-neon':
                return {
                    strokeWidth: 3,
                    strokeDasharray: status === 'active' ? '10 5' : 'none',
                    filter: status === 'active' ? 'drop-shadow(0 0 8px currentColor)' : 'none',
                };
            case 'forest-quest':
                return {
                    strokeWidth: 4,
                    strokeDasharray: 'none',
                    filter: 'drop-shadow(0 0 4px currentColor)',
                };
            case 'space-odyssey':
                return {
                    strokeWidth: 2,
                    strokeDasharray: status === 'active' ? '5 5' : 'none',
                    filter: 'drop-shadow(0 0 10px currentColor)',
                };
            case 'dragons-lair':
                return {
                    strokeWidth: 5,
                    strokeDasharray: 'none',
                    filter: status === 'active' ? 'drop-shadow(0 0 6px currentColor)' : 'none',
                };
            case 'ocean-depths':
                return {
                    strokeWidth: 3,
                    strokeDasharray: 'none',
                    filter: 'drop-shadow(0 0 5px currentColor)',
                };
            default:
                return {
                    strokeWidth: 2,
                    strokeDasharray: 'none',
                    filter: 'none',
                };
        }
    };

    const pathStyle = getPathStyle();
    const color = getColor();

    // Create SVG path
    // For vertical/simple paths, use straight line
    // For complex layouts, use curved paths
    const createPath = () => {
        if (skin.layout === 'vertical') {
            return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
        } else if (skin.layout === 'tree' || skin.layout === 'orbital') {
            // Curved path for tree and orbital
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            return `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
        } else if (skin.layout === 'wave') {
            // Smooth wave curve
            const controlX1 = from.x + dx * 0.3;
            const controlY1 = from.y + dy * 0.3;
            const controlX2 = from.x + dx * 0.7;
            const controlY2 = from.y + dy * 0.7;
            return `M ${from.x} ${from.y} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${to.x} ${to.y}`;
        } else {
            // Dungeon - angular path
            const midX = (from.x + to.x) / 2;
            return `M ${from.x} ${from.y} L ${midX} ${from.y} L ${midX} ${to.y} L ${to.x} ${to.y}`;
        }
    };

    const pathD = createPath();

    // Animation variants
    const getPathAnimation = () => {
        switch (skin.animations.pathDraw.type) {
            case 'draw':
                return {
                    initial: { pathLength: 0, opacity: 0 },
                    animate: { pathLength: 1, opacity: 1 },
                };
            case 'fade':
                return {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                };
            case 'pulse':
                return {
                    initial: { opacity: 0.3 },
                    animate: { opacity: [0.3, 1, 0.3] },
                };
            case 'flow':
                return {
                    initial: { pathLength: 0, opacity: 0 },
                    animate: { pathLength: 1, opacity: 1 },
                };
            default:
                return {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                };
        }
    };

    const animation = getPathAnimation();

    // Custom rendering for Forest Quest
    if (skin.id === 'forest-quest') {
        return (
            <svg
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{ overflow: 'visible' }}
            >
                {/* Main Vine Segment */}
                <motion.path
                    d={pathD}
                    stroke={color}
                    strokeWidth={status === 'active' ? 6 : 4}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                />

                {/* Inner Vine Detail (Lighter green for depth) */}
                <motion.path
                    d={pathD}
                    stroke={status === 'active' ? '#4ade80' : '#374151'}
                    strokeWidth={2}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="4 8"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                />

                {/* Leaves growing along the vine */}
                {(status === 'active' || status === 'completed') && (
                    <>
                        {[0.3, 0.7].map((offset, i) => (
                            <motion.g
                                key={i}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{
                                    scale: 1,
                                    opacity: 1,
                                    offsetDistance: `${offset * 100}%`
                                }}
                                style={{
                                    offsetPath: `path('${pathD}')`,
                                    offsetRotate: 'auto',
                                }}
                                transition={{ delay: 0.5 + (i * 0.3), type: "spring" }}
                            >
                                <path
                                    d="M0 0 Q10 -10 20 0 Q10 10 0 0"
                                    fill="#22c55e"
                                    stroke="#14532d"
                                    strokeWidth="1"
                                    transform={`scale(${i % 2 === 0 ? 1 : -1}) rotate(${i % 2 === 0 ? -45 : 45})`}
                                />
                            </motion.g>
                        ))}
                    </>
                )}
            </svg>
        );
    }

    return (
        <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ overflow: 'visible' }}
        >
            <motion.path
                d={pathD}
                stroke={color}
                strokeWidth={pathStyle.strokeWidth}
                strokeDasharray={pathStyle.strokeDasharray}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: pathStyle.filter }}
                initial={animation.initial}
                animate={animation.animate}
                transition={{
                    duration: skin.animations.pathDraw.duration / 1000,
                    ease: "easeInOut",
                    repeat: skin.animations.pathDraw.type === 'pulse' ? Infinity : 0,
                    repeatType: skin.animations.pathDraw.type === 'pulse' ? 'loop' : undefined,
                }}
            />

            {/* Animated flow effect for active paths */}
            {status === 'active' && skin.animations.pathDraw.type === 'flow' && (
                <motion.circle
                    r="4"
                    fill={color}
                    initial={{ offsetDistance: '0%', opacity: 0 }}
                    animate={{
                        offsetDistance: '100%',
                        opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    style={{
                        offsetPath: `path('${pathD}')`,
                        offsetRotate: '0deg',
                    }}
                />
            )}
        </svg>
    );
}
