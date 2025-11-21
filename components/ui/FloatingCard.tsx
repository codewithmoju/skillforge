"use client";

import { motion } from "framer-motion";
import { ReactNode, useState, useEffect } from "react";

interface FloatingCardProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    floatIntensity?: "low" | "medium" | "high";
}

export function FloatingCard({
    children,
    className = "",
    delay = 0,
    floatIntensity = "medium"
}: FloatingCardProps) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Calculate parallax offset based on mouse position
    const parallaxX = (mousePosition.x - (typeof window !== 'undefined' ? window.innerWidth : 0) / 2) / 50;
    const parallaxY = (mousePosition.y - (typeof window !== 'undefined' ? window.innerHeight : 0) / 2) / 50;

    // Adjust intensity
    const intensityMultiplier = floatIntensity === "low" ? 0.5 : floatIntensity === "high" ? 1.5 : 1;

    // Float animation values
    const floatDistance = floatIntensity === "low" ? 10 : floatIntensity === "high" ? 30 : 20;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: 1,
                y: 0,
                x: parallaxX * intensityMultiplier,
            }}
            transition={{
                delay,
                type: "spring",
                stiffness: 100,
                damping: 20
            }}
            className={`relative ${className}`}
        >
            <motion.div
                animate={{
                    y: [0, -floatDistance, 0],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: delay,
                }}
                className="w-full h-full"
            >
                {/* Glassmorphism card */}
                <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden group hover:border-white/20 transition-all">
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-indigo/5 to-accent-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Content */}
                    <div className="relative z-10">
                        {children}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
