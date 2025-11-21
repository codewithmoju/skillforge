"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import { usePerformance } from "@/lib/hooks/usePerformance";

interface MagneticButtonProps {
    children: React.ReactNode;
    strength?: number;
    className?: string;
    onClick?: () => void;
}

export function MagneticButton({
    children,
    strength = 0.3,
    className = "",
    onClick,
}: MagneticButtonProps) {
    const { shouldReduceAnimations } = usePerformance();
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 20, stiffness: 300 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (shouldReduceAnimations || !ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = (e.clientX - centerX) * strength;
        const distanceY = (e.clientY - centerY) * strength;

        x.set(distanceX);
        y.set(distanceY);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    return (
        <motion.div
            ref={ref}
            className={`relative inline-block ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            style={{
                x: shouldReduceAnimations ? 0 : springX,
                y: shouldReduceAnimations ? 0 : springY,
            }}
        >
            {children}

            {/* Ripple Effect on Click */}
            {isHovered && !shouldReduceAnimations && (
                <motion.div
                    className="absolute inset-0 rounded-xl bg-white/10 pointer-events-none"
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                />
            )}
        </motion.div>
    );
}
