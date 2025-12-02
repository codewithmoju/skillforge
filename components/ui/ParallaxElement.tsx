"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxElementProps {
    children: React.ReactNode;
    speed?: number; // speed factor: 0 = static, 1 = normal scroll, >1 = faster, <1 = slower (parallax)
    className?: string;
    direction?: "vertical" | "horizontal";
}

export function ParallaxElement({
    children,
    speed = 0.5,
    className,
    direction = "vertical"
}: ParallaxElementProps) {
    const triggerRef = useRef<HTMLDivElement>(null);
    const targetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const trigger = triggerRef.current;
        const target = targetRef.current;

        // Skip if prefers-reduced-motion
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (mediaQuery.matches || !trigger || !target) return;

        const ctx = gsap.context(() => {
            const yOffset = direction === "vertical" ? 100 * speed : 0;
            const xOffset = direction === "horizontal" ? 100 * speed : 0;

            gsap.fromTo(target,
                {
                    y: direction === "vertical" ? 0 : 0,
                    x: direction === "horizontal" ? 0 : 0
                },
                {
                    y: direction === "vertical" ? yOffset : 0,
                    x: direction === "horizontal" ? xOffset : 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: trigger,
                        start: "top bottom", // when top of trigger hits bottom of viewport
                        end: "bottom top",   // when bottom of trigger hits top of viewport
                        scrub: 0
                    }
                }
            );
        }, triggerRef);

        return () => ctx.revert();
    }, [speed, direction]);

    return (
        <div ref={triggerRef} className={cn("relative", className)}>
            <div ref={targetRef} className="will-change-transform">
                {children}
            </div>
        </div>
    );
}
