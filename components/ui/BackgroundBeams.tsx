"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
    return (
        <div
            className={cn(
                "absolute inset-0 z-0 flex h-full w-full items-end justify-center overflow-hidden bg-transparent",
                className
            )}
        >
            <div className="pointer-events-none absolute inset-0 z-10 h-full w-full bg-slate-950 [mask-image:radial-gradient(100%_100%_at_top_center,white,transparent)]" />
            <div className="absolute inset-0 z-0 h-full w-full opacity-40">
                <div className="absolute left-1/2 top-1/2 h-[50vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#09090b_50%),radial-gradient(rgba(200,200,200,0.1)_0%,transparent_80%)]" />
                <motion.div
                    initial={{ opacity: 0.5, width: "15rem", x: -100, y: -350 }}
                    animate={{ width: "30rem", x: 100, y: -150 }}
                    transition={{
                        duration: 10,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                    style={{
                        backgroundImage:
                            "conic-gradient(from 90deg at 50% 50%, #00000000 50%, #09090b 50%), radial-gradient(rgba(200,200,200,0.1) 0%, transparent 80%)",
                    }}
                    className="absolute left-0 top-0 h-56 w-56 rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/40 blur-[100px]"
                />
                <motion.div
                    initial={{ opacity: 0.5, width: "15rem", x: 100, y: 350 }}
                    animate={{ width: "30rem", x: -100, y: 150 }}
                    transition={{
                        duration: 15,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                    style={{
                        backgroundImage:
                            "conic-gradient(from 90deg at 50% 50%, #00000000 50%, #09090b 50%), radial-gradient(rgba(200,200,200,0.1) 0%, transparent 80%)",
                    }}
                    className="absolute right-0 bottom-0 h-56 w-56 rounded-full bg-gradient-to-br from-cyan-500/40 to-emerald-500/40 blur-[100px]"
                />
            </div>
        </div>
    );
};
