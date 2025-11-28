"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { usePerformance } from "@/lib/hooks/usePerformance";

interface ParallaxLayerProps {
    children: React.ReactNode;
    speed?: number; // Negative for slower (background), positive for faster (foreground)
    className?: string;
    offset?: number;
}

export function ParallaxLayer({ children, speed = 0.5, className = "", offset = 0 }: ParallaxLayerProps) {
    const { shouldReduceAnimations } = usePerformance();
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [offset, offset - (200 * speed)]);

    if (shouldReduceAnimations) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div ref={ref} style={{ y }} className={className}>
            {children}
        </motion.div>
    );
}
