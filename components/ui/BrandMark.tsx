"use client";

import { motion } from "framer-motion";
import { AnimatedLogo } from "@/components/ui/AnimatedLogo";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
    /**
     * Render the EDUMATE AI name next to the glyph.
     */
    showName?: boolean;
    /**
     * Layout direction for glyph + text.
     */
    direction?: "row" | "column";
    /**
     * Pixel size for the glyph container.
     */
    size?: number;
    /**
     * Optional supporting text rendered under the name.
     */
    tagline?: string;
    /**
     * Background variant for the logo
     */
    variant?: "minimal" | "glass" | "glow" | "premium";
    /**
     * Show animated connections
     */
    showConnections?: boolean;
    className?: string;
    textClassName?: string;
}

export function BrandMark({
    showName = true,
    direction = "row",
    size = 48,
    tagline = "AI-Powered Learning",
    variant = "minimal",
    showConnections = false,
    className,
    textClassName,
}: BrandMarkProps) {
    const orientationClasses =
        direction === "column"
            ? ["flex-col", showName ? "gap-3" : "gap-1", "text-center"]
            : ["flex-row", showName ? "gap-3" : "gap-1"];

    // Logo container based on variant
    const LogoContainer = ({ children }: { children: React.ReactNode }) => {
        switch (variant) {
            case "glass":
                return (
                    <div className="relative">
                        {/* Spotlight behind */}
                        <div className="absolute inset-0 bg-gradient-to-r from-accent-indigo/20 to-accent-violet/20 blur-2xl scale-150" />
                        {/* Glassmorphic container */}
                        <div
                            className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-lg"
                            style={{ width: size + 24, height: size + 24 }}
                        >
                            <div className="flex items-center justify-center w-full h-full">
                                {children}
                            </div>
                        </div>
                    </div>
                );

            case "glow":
                return (
                    <motion.div
                        className="relative"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        {/* Animated glow */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-accent-indigo to-accent-violet rounded-2xl blur-xl"
                            animate={{
                                opacity: [0.3, 0.6, 0.3],
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                        {/* Logo container */}
                        <div
                            className="relative bg-slate-950 border border-accent-indigo/30 rounded-2xl p-3 shadow-2xl"
                            style={{ width: size + 24, height: size + 24 }}
                        >
                            <div className="flex items-center justify-center w-full h-full">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                );

            case "premium":
                return (
                    <div className="relative">
                        {/* Spotlight */}
                        <div className="absolute inset-0 bg-gradient-to-r from-accent-indigo/30 to-accent-violet/30 blur-3xl scale-150" />
                        {/* Premium container with animated border */}
                        <div
                            className="relative rounded-2xl p-[2px] bg-gradient-to-br from-accent-indigo via-accent-violet to-accent-cyan shadow-lg shadow-accent-indigo/30"
                            style={{ width: size + 24, height: size + 24 }}
                        >
                            <motion.div
                                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent-indigo via-accent-violet to-accent-cyan opacity-50 blur-sm"
                                animate={{
                                    opacity: [0.3, 0.6, 0.3],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                            <div className="relative w-full h-full rounded-[1.25rem] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center">
                                {children}
                            </div>
                        </div>
                    </div>
                );

            case "minimal":
            default:
                return (
                    <div
                        className="rounded-2xl p-[2px] bg-gradient-to-br from-accent-indigo via-accent-violet to-accent-cyan shadow-lg shadow-accent-indigo/30"
                        style={{ width: size, height: size }}
                    >
                        <div className="w-full h-full rounded-[1.25rem] bg-slate-950/80 flex items-center justify-center overflow-hidden">
                            {children}
                        </div>
                    </div>
                );
        }
    };

    return (
        <div
            className={cn(
                "flex items-center text-white",
                orientationClasses,
                className
            )}
        >
            <LogoContainer>
                <AnimatedLogo
                    size={variant === "minimal" ? Math.max(size - 8, 16) : size}
                    showConnections={showConnections}
                />
            </LogoContainer>

            <div
                className={cn(
                    "flex flex-col leading-tight whitespace-nowrap overflow-hidden transition-all duration-700 ease-in-out",
                    direction === "column" ? "items-center" : "items-start",
                    showName
                        ? "max-w-[200px] opacity-100 translate-x-0"
                        : "max-w-0 opacity-0 -translate-x-4",
                    textClassName
                )}
            >
                <span className="text-base font-black tracking-tight sm:text-lg pl-3">
                    EDUMATE AI
                </span>
                {tagline && (
                    <span className="text-[0.6rem] uppercase tracking-[0.35em] text-slate-400 pl-3">
                        {tagline}
                    </span>
                )}
            </div>
        </div>
    );
}
