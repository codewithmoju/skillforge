"use client";

import { motion } from "framer-motion";
import { UserLevel } from "@/lib/types/gamification";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface LevelBadgeProps {
    userLevel: UserLevel;
    size?: "sm" | "md" | "lg";
    showProgress?: boolean;
}

const sizeClasses = {
    sm: "w-16 h-16 text-xs",
    md: "w-24 h-24 text-sm",
    lg: "w-32 h-32 text-base",
};

const glowIntensity = {
    minimal: "shadow-[0_0_10px_rgba(59,130,246,0.3)]",
    slight: "shadow-[0_0_15px_rgba(168,85,247,0.4)]",
    medium: "shadow-[0_0_20px_rgba(6,182,212,0.5)]",
    strong: "shadow-[0_0_25px_rgba(99,102,241,0.6)]",
    intense: "shadow-[0_0_30px_rgba(251,191,36,0.7)]",
    epic: "shadow-[0_0_40px_rgba(168,85,247,0.8)]",
    legendary: "shadow-[0_0_50px_rgba(168,85,247,0.9)]",
};

export function LevelBadge({ userLevel, size = "md", showProgress = false }: LevelBadgeProps) {
    const progressPercentage = (userLevel.currentXp / (userLevel.currentXp + userLevel.xpToNextLevel)) * 100;

    return (
        <div className="relative inline-flex flex-col items-center gap-2">
            {/* Badge */}
            <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={cn(
                    "relative rounded-full flex items-center justify-center font-bold border-4",
                    sizeClasses[size],
                    glowIntensity[userLevel.tier.glowIntensity]
                )}
                style={{
                    background: userLevel.tier.color.includes("gradient")
                        ? userLevel.tier.color
                        : `linear-gradient(135deg, ${userLevel.tier.color}, ${userLevel.tier.color}dd)`,
                    borderColor: userLevel.tier.color.includes("gradient") ? "#fff" : userLevel.tier.color,
                }}
            >
                <div className="text-center">
                    <div className="text-2xl font-black text-white drop-shadow-lg">
                        {userLevel.level}
                    </div>
                    {size !== "sm" && (
                        <div className="text-[0.6rem] uppercase tracking-wider text-white/80">
                            Level
                        </div>
                    )}
                </div>

                {/* Sparkle Effect for High Levels */}
                {userLevel.level >= 50 && (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0"
                    >
                        <Sparkles className="absolute top-0 right-0 w-4 h-4 text-white" />
                    </motion.div>
                )}
            </motion.div>

            {/* Tier Title */}
            <div className="text-center">
                <div className="text-sm font-bold text-white">{userLevel.tier.title}</div>
                {showProgress && (
                    <div className="text-xs text-slate-400">
                        {userLevel.currentXp.toLocaleString()} / {(userLevel.currentXp + userLevel.xpToNextLevel).toLocaleString()} XP
                    </div>
                )}
            </div>

            {/* Progress Ring */}
            {showProgress && (
                <div className="w-full max-w-[200px]">
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-accent-indigo to-accent-cyan"
                        />
                    </div>
                    <div className="text-xs text-center text-slate-500 mt-1">
                        {userLevel.xpToNextLevel.toLocaleString()} XP to Level {userLevel.level + 1}
                    </div>
                </div>
            )}
        </div>
    );
}
