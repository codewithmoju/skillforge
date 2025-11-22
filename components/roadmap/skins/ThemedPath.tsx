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
    const createPath = () => {
        if (skin.layout === 'vertical') {
            return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
        } else if (skin.layout === 'tree' || skin.layout === 'orbital') {
            // Calculate a curved path for the vine
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;

            // Add offset to control point for organic curve
            // Alternating direction based on y position to create winding effect
            const curveIntensity = skin.layout === 'tree' ? 60 : 0;
            const offset = (from.y % 200 > 100) ? curveIntensity : -curveIntensity;

            return `M ${from.x} ${from.y} Q ${midX + offset} ${midY} ${to.x} ${to.y}`;
        } else if (skin.layout === 'wave') {
            const controlX1 = from.x + dx * 0.3;
            const controlY1 = from.y + dy * 0.3;
            const controlX2 = from.x + dx * 0.7;
            const controlY2 = from.y + dy * 0.7;
            return `M ${from.x} ${from.y} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${to.x} ${to.y}`;
        } else {
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

    // Forest Quest special rendering (Jungle Vine)
    if (skin.id === 'forest-quest') {
        // Calculate a smooth Cubic Bezier curve
        // We want the curve to flow naturally from point A to point B
        // Control points are calculated to create a "S" shape or smooth arc
        const midY = (from.y + to.y) / 2;

        // Control point 1: Vertical start
        const cp1x = from.x;
        const cp1y = midY;

        // Control point 2: Vertical end approach
        const cp2x = to.x;
        const cp2y = midY;

        const curvePath = `M ${from.x} ${from.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${to.x} ${to.y}`;

        return (
            <g>
                {/* Shadow / Depth Layer */}
                <motion.path
                    d={curvePath}
                    stroke="#052e16" // Very dark green for shadow
                    strokeWidth={12}
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.3 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                />

                {/* Main Vine Body */}
                <motion.path
                    d={curvePath}
                    stroke="#14532d" // Dark green vine
                    strokeWidth={8}
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                />

                {/* Vine Texture / Highlights */}
                <motion.path
                    d={curvePath}
                    stroke="#166534" // Lighter green texture
                    strokeWidth={3}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="10 20"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                />

                {/* Active State: Magical Energy Flow */}
                {status === 'active' && (
                    <>
                        {/* Glowing Core */}
                        <motion.path
                            d={curvePath}
                            stroke="#4ade80" // Bright green glow
                            strokeWidth={2}
                            fill="none"
                            strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            style={{ filter: 'drop-shadow(0 0 4px #4ade80)' }}
                        />

                        {/* Traveling Energy Particles */}
                        <circle r="3" fill="#a7f3d0">
                            <animateMotion
                                dur="3s"
                                repeatCount="indefinite"
                                path={curvePath}
                            />
                        </circle>
                        <circle r="2" fill="#ffffff">
                            <animateMotion
                                dur="3s"
                                begin="1.5s"
                                repeatCount="indefinite"
                                path={curvePath}
                            />
                        </circle>
                    </>
                )}

                {/* Completed State: Golden Growth */}
                {status === 'completed' && (
                    <motion.path
                        d={curvePath}
                        stroke="#f59e0b" // Gold tint
                        strokeWidth={2}
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray="5 30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        transition={{ duration: 1 }}
                    />
                )}
            </g>
        );
    }

    // Default rendering - returns g element with paths
    return (
        <g>
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
                    repeatType: skin.animations.pathDraw.type === 'pulse' ? 'loop' as const : undefined,
                }}
            />

            {/* Animated flow effect for active paths */}
            {status === 'active' && skin.animations.pathDraw.type === 'flow' && (
                <motion.circle
                    r="4"
                    fill={color}
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    <animateMotion
                        dur="2s"
                        repeatCount="indefinite"
                        path={pathD}
                    />
                </motion.circle>
            )}
        </g>
    );
}
