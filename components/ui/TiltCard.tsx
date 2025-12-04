"use client";

import React, { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    containerClassName?: string;
    style?: React.CSSProperties;
}

export const TiltCard = ({ children, className, containerClassName, style }: TiltCardProps) => {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseY = useSpring(y, { stiffness: 300, damping: 30 });

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const xPct = (clientX - left) / width - 0.5;
        const yPct = (clientY - top) / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    const rotateX = useMotionTemplate`${mouseY.get() * -20}deg`;
    const rotateY = useMotionTemplate`${mouseX.get() * 20}deg`;

    return (
        <div
            className={cn("relative perspective-1000", containerClassName)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                ref={ref}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                    ...style
                }}
                className={cn(
                    "relative h-full transition-all duration-200 ease-linear transform-gpu",
                    className
                )}
            >
                {children}

                {/* Glare Effect */}
                <motion.div
                    style={{
                        background: useMotionTemplate`
                    radial-gradient(
                        800px circle at ${mouseX.get() * 100 + 50}% ${mouseY.get() * 100 + 50}%,
                        rgba(255,255,255,0.1),
                        transparent 80%
                    )
                `,
                    }}
                    className="absolute inset-0 z-50 pointer-events-none rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"
                />
            </motion.div>
        </div>
    );
};
