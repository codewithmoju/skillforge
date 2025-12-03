"use client";

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface PinnedSectionProps {
    children: ReactNode;
    className?: string;
    pinHeight?: string | number; // e.g., "100vh" or "200%"
    onProgress?: (progress: number) => void;
}

export function PinnedSection({
    children,
    className,
    pinHeight = "100vh",
    onProgress,
}: PinnedSectionProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const content = contentRef.current;

        if (!container || !content) return;

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: container,
                start: "top top",
                end: `+=${typeof pinHeight === "number" ? pinHeight : "100%"}`, // Default to 100% if string is weird, but usually passed as "150vh" etc.
                pin: content,
                scrub: true,
                onUpdate: (self) => {
                    if (onProgress) onProgress(self.progress);
                },
            });
        }, containerRef);

        return () => ctx.revert();
    }, [pinHeight, onProgress]);

    return (
        <div
            ref={containerRef}
            className={cn("relative w-full", className)}
            style={{ height: typeof pinHeight === "string" ? pinHeight : `${pinHeight}px` }}
        >
            <div ref={contentRef} className="w-full h-screen overflow-hidden relative">
                {children}
            </div>
        </div>
    );
}
