"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AnimatedLogoProps {
    size?: number;
    showConnections?: boolean;
    className?: string;
}

/**
 * Animated logo with flowing connection lines
 * The connections animate from bottom to top like energy flowing to the graduation cap
 */
export function AnimatedLogo({
    size = 64,
    showConnections = true,
    className
}: AnimatedLogoProps) {
    // Connection line paths - these represent the energy flowing upward
    const connections = [
        { id: 1, delay: 0, x: "30%", height: "60%" },
        { id: 2, delay: 0.3, x: "50%", height: "70%" },
        { id: 3, delay: 0.6, x: "70%", height: "60%" },
    ];

    return (
        <div className={cn("relative inline-block", className)} style={{ width: size, height: size }}>
            {/* Animated connection lines behind the logo */}
            {showConnections && (
                <div className="absolute inset-0 overflow-hidden">
                    {connections.map((conn) => (
                        <motion.div
                            key={conn.id}
                            className="absolute bottom-0 w-0.5 bg-gradient-to-t from-accent-indigo via-accent-violet to-transparent"
                            style={{
                                left: conn.x,
                                height: conn.height,
                            }}
                            initial={{ scaleY: 0, opacity: 0 }}
                            animate={{
                                scaleY: [0, 1, 1, 0],
                                opacity: [0, 0.8, 0.8, 0],
                            }}
                            transition={{
                                duration: 2,
                                delay: conn.delay,
                                repeat: Infinity,
                                repeatDelay: 1,
                                ease: "easeInOut",
                            }}
                            style={{ transformOrigin: "bottom" }}
                        />
                    ))}

                    {/* Particle effects at connection points */}
                    {connections.map((conn) => (
                        <motion.div
                            key={`particle-${conn.id}`}
                            className="absolute w-1 h-1 rounded-full bg-accent-cyan"
                            style={{
                                left: conn.x,
                                bottom: 0,
                            }}
                            animate={{
                                y: [-10, -parseInt(conn.height) + 10],
                                opacity: [0, 1, 0],
                                scale: [0, 1, 0],
                            }}
                            transition={{
                                duration: 2,
                                delay: conn.delay,
                                repeat: Infinity,
                                repeatDelay: 1,
                                ease: "easeOut",
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Logo with glow effect */}
            <motion.div
                className="relative z-10"
                animate={{
                    filter: [
                        "drop-shadow(0 0 8px rgba(99, 102, 241, 0.4))",
                        "drop-shadow(0 0 16px rgba(99, 102, 241, 0.6))",
                        "drop-shadow(0 0 8px rgba(99, 102, 241, 0.4))",
                    ],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <Image
                    src="/icons/MyLogo.png"
                    alt="EDUMATE AI Logo"
                    width={size}
                    height={size}
                    className="object-contain"
                    priority
                />
            </motion.div>

            {/* Subtle rotating ring around logo */}
            {showConnections && (
                <motion.div
                    className="absolute inset-0 rounded-full border border-accent-indigo/20"
                    animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                        opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                    }}
                />
            )}
        </div>
    );
}
