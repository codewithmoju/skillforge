"use client";

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface HorizontalScrollSectionProps {
    children: ReactNode;
    className?: string;
    scrollWidth?: string; // e.g., "300vw"
}

export function HorizontalScrollSection({
    children,
    className,
    scrollWidth = "300vw",
}: HorizontalScrollSectionProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const track = trackRef.current;

        if (!container || !track) return;

        const ctx = gsap.context(() => {
            const totalScroll = track.scrollWidth - window.innerWidth;

            gsap.to(track, {
                x: -totalScroll,
                ease: "none",
                scrollTrigger: {
                    trigger: container,
                    start: "top top",
                    end: `+=${totalScroll}`,
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                },
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className={cn("relative w-full overflow-hidden h-screen", className)}>
            <div ref={trackRef} className="flex h-full w-max items-center">
                {children}
            </div>
        </div>
    );
}
