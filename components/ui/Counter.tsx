"use client";

import { motion, useSpring, useTransform, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

interface CounterProps {
    value: number;
    direction?: "up" | "down";
    className?: string;
    prefix?: string;
    suffix?: string;
}

export function Counter({ value, direction = "up", className, prefix = "", suffix = "" }: CounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });

    const spring = useSpring(0, {
        mass: 1,
        stiffness: 100,
        damping: 30,
        duration: 2
    });

    const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

    useEffect(() => {
        if (inView) {
            spring.set(value);
        }
    }, [inView, value, spring]);

    return (
        <span ref={ref} className={className}>
            {prefix}
            <motion.span>{display}</motion.span>
            {suffix}
        </span>
    );
}
