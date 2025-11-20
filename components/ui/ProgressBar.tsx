"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
    progress: number; // 0 to 100
    className?: string;
    colorClass?: string;
    showLabel?: boolean;
}

export function ProgressBar({
    progress,
    className,
    colorClass = "from-status-success to-lime-400",
    showLabel = false,
}: ProgressBarProps) {
    return (
        <div className={cn("w-full", className)}>
            {showLabel && (
                <div className="flex justify-between mb-1 text-sm font-medium text-text-secondary">
                    <span>Progress</span>
                    <span>{progress}%</span>
                </div>
            )}
            <div className="h-2.5 w-full bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                    className={cn("h-full rounded-full bg-gradient-to-r", colorClass)}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </div>
        </div>
    );
}
