"use client";

import React from "react";
import { motion } from "framer-motion";
import { usePerformance } from "@/lib/hooks/usePerformance";

interface AnimatedBackgroundProps {
    variant?: "aurora" | "gradient-mesh" | "particles" | "geometric";
}

// Aurora/Northern Lights Background
function AuroraBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden">
            {/* Aurora waves */}
            <motion.div
                className="absolute w-full h-full"
                style={{
                    background: "linear-gradient(45deg, rgba(99,102,241,0.3), rgba(168,85,247,0.3), rgba(236,72,153,0.3), rgba(59,130,246,0.3))",
                    filter: "blur(100px)",
                }}
                animate={{
                    backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />

            {/* Gradient orbs */}
            {[
                { color: "from-violet-500/40 to-purple-500/40", x: "20%", y: "20%", scale: [1, 1.3, 1], duration: 15 },
                { color: "from-cyan-500/40 to-blue-500/40", x: "80%", y: "30%", scale: [1.2, 1, 1.2], duration: 18 },
                { color: "from-pink-500/40 to-rose-500/40", x: "50%", y: "70%", scale: [1.1, 1.4, 1.1], duration: 12 },
            ].map((orb, i) => (
                <motion.div
                    key={i}
                    className={`absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r ${orb.color} blur-3xl`}
                    style={{ left: orb.x, top: orb.y }}
                    animate={{
                        scale: orb.scale,
                        x: [0, 50, 0],
                        y: [0, -50, 0],
                    }}
                    transition={{
                        duration: orb.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Animated grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.05)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
        </div>
    );
}

// Gradient Mesh Background
function GradientMeshBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden">
            {/* Gradient orbs */}
            <motion.div
                className="absolute w-[800px] h-[800px] rounded-full bg-gradient-to-r from-accent-indigo/30 to-accent-violet/30 blur-3xl"
                animate={{
                    x: ["-25%", "25%", "-25%"],
                    y: ["-25%", "25%", "-25%"],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{ top: "10%", left: "10%" }}
            />
            <motion.div
                className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-accent-cyan/30 to-blue-500/30 blur-3xl"
                animate={{
                    x: ["25%", "-25%", "25%"],
                    y: ["25%", "-25%", "25%"],
                    scale: [1.2, 1, 1.2],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{ bottom: "10%", right: "10%" }}
            />
            <motion.div
                className="absolute w-[700px] h-[700px] rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-3xl"
                animate={{
                    x: [0, "50%", 0],
                    y: ["50%", 0, "50%"],
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{ top: "50%", left: "50%" }}
            />

            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />
        </div>
    );
}

// Floating Particles
function ParticlesBackground() {
    const [particles, setParticles] = React.useState<Array<{
        left: string;
        top: string;
        duration: number;
        delay: number;
    }>>([]);

    React.useEffect(() => {
        const newParticles = Array.from({ length: 40 }).map(() => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            duration: Math.random() * 8 + 8,
            delay: Math.random() * 5,
        }));
        setParticles(newParticles);
    }, []);

    if (particles.length === 0) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white/30 rounded-full"
                    style={{
                        left: p.left,
                        top: p.top,
                    }}
                    animate={{
                        y: [0, -150, 0],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                    }}
                />
            ))}
        </div>
    );
}

// Geometric Shapes
function GeometricBackground() {
    const shapes = [
        { size: 100, delay: 0, duration: 15, path: "M50,0 L100,50 L50,100 L0,50 Z" },
        { size: 80, delay: 2, duration: 12, path: "M40,0 L80,40 L40,80 L0,40 Z" },
        { size: 60, delay: 4, duration: 18, path: "M30,0 L60,30 L30,60 L0,30 Z" },
    ];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {shapes.map((shape, i) => (
                <motion.div
                    key={i}
                    className="absolute"
                    animate={{
                        y: [0, -200, 0],
                        x: [0, 100, 0],
                        rotate: [0, 360],
                        opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                        duration: shape.duration,
                        repeat: Infinity,
                        delay: shape.delay,
                        ease: "easeInOut",
                    }}
                    style={{
                        left: `${20 + i * 30}%`,
                        top: `${30 + i * 20}%`,
                    }}
                >
                    <svg width={shape.size} height={shape.size} viewBox="0 0 100 100">
                        <path
                            d={shape.path}
                            fill="none"
                            stroke="url(#geometric-gradient)"
                            strokeWidth="2"
                            opacity="0.5"
                        />
                        <defs>
                            <linearGradient id="geometric-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#06b6d4" />
                            </linearGradient>
                        </defs>
                    </svg>
                </motion.div>
            ))}
        </div>
    );
}

export function AnimatedBackground({ variant = "gradient-mesh" }: AnimatedBackgroundProps) {
    const { shouldReduceAnimations } = usePerformance();

    // Simple gradient for low-end devices
    if (shouldReduceAnimations) {
        return (
            <div className="absolute inset-0 bg-gradient-to-br from-accent-indigo/10 via-transparent to-accent-cyan/10" />
        );
    }

    // Render based on variant
    switch (variant) {
        case "aurora":
            return (
                <>
                    <AuroraBackground />
                    <ParticlesBackground />
                </>
            );
        case "gradient-mesh":
            return (
                <>
                    <GradientMeshBackground />
                    <ParticlesBackground />
                </>
            );
        case "particles":
            return <ParticlesBackground />;
        case "geometric":
            return (
                <>
                    <GradientMeshBackground />
                    <GeometricBackground />
                </>
            );
        default:
            return <GradientMeshBackground />;
    }
}
