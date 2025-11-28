"use client";

import { motion } from "framer-motion";
import React from "react";

interface MarqueeProps {
    children: React.ReactNode;
    direction?: "left" | "right";
    speed?: number;
    className?: string;
    pauseOnHover?: boolean;
}

export function Marquee({
    children,
    direction = "left",
    speed = 20,
    className = "",
    pauseOnHover = true,
}: MarqueeProps) {
    return (
        <div className={`flex overflow-hidden ${className}`}>
            <motion.div
                className="flex min-w-full shrink-0 gap-4 py-4"
                initial={{ x: 0 }}
                animate={{ x: direction === "left" ? "-100%" : "100%" }}
                transition={{
                    duration: speed,
                    ease: "linear",
                    repeat: Infinity,
                }}
                style={{
                    flexDirection: "row",
                }}
                whileHover={pauseOnHover ? { animationPlayState: "paused" } : undefined}
            >
                {children}
                {children}
            </motion.div>
            <motion.div
                className="flex min-w-full shrink-0 gap-4 py-4"
                initial={{ x: 0 }}
                animate={{ x: direction === "left" ? "-100%" : "100%" }}
                transition={{
                    duration: speed,
                    ease: "linear",
                    repeat: Infinity,
                }}
                style={{
                    flexDirection: "row",
                }}
                whileHover={pauseOnHover ? { animationPlayState: "paused" } : undefined}
            >
                {children}
                {children}
            </motion.div>
        </div>
    );
}
