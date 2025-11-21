"use client";

import { motion } from "framer-motion";
import { usePerformance } from "@/lib/hooks/usePerformance";

interface FloatingParticlesProps {
    count?: number;
    minSize?: number;
    maxSize?: number;
    colors?: string[];
}

export function FloatingParticles({
    count = 30,
    minSize = 2,
    maxSize = 6,
    colors = ["from-accent-indigo/30 to-accent-cyan/30", "from-accent-violet/30 to-pink-500/30"],
}: FloatingParticlesProps) {
    const { shouldReduceAnimations } = usePerformance();

    // Reduce particle count on low-end devices
    const particleCount = shouldReduceAnimations ? Math.floor(count / 3) : count;

    const particles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * (maxSize - minSize) + minSize,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
    }));

    if (shouldReduceAnimations && particleCount === 0) {
        return null;
    }

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className={`absolute rounded-full bg-gradient-to-r ${particle.color} blur-sm`}
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: particle.size,
                        height: particle.size,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        x: [0, Math.random() * 20 - 10, 0],
                        opacity: [0.2, 0.6, 0.2],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        delay: particle.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}
