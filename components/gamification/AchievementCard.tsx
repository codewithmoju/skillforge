"use client";

import { motion } from "framer-motion";
import { Achievement } from "@/lib/types/gamification";
import { getTotalStarsEarned, getNextStarRequirement } from "@/lib/utils/achievementSystem";
import { Star, Lock, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface AchievementCardProps {
    achievement: Achievement;
    onClick?: () => void;
}

const rarityColors = {
    common: "from-slate-600 to-slate-500",
    rare: "from-purple-600 to-purple-500",
    epic: "from-amber-600 to-amber-500",
    legendary: "from-pink-600 via-purple-600 to-indigo-600",
};

const rarityGlow = {
    common: "shadow-[0_0_15px_rgba(148,163,184,0.3)]",
    rare: "shadow-[0_0_20px_rgba(168,85,247,0.4)]",
    epic: "shadow-[0_0_25px_rgba(251,191,36,0.5)]",
    legendary: "shadow-[0_0_30px_rgba(168,85,247,0.6)]",
};

export function AchievementCard({ achievement, onClick }: AchievementCardProps) {
    const totalStars = getTotalStarsEarned(achievement);
    const nextStar = getNextStarRequirement(achievement);
    const progressPercentage = nextStar
        ? (achievement.currentProgress / nextStar.requirement) * 100
        : 100;

    const isLocked = totalStars === 0 && achievement.currentProgress === 0;

    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={cn(
                "relative rounded-3xl p-6 border-2 cursor-pointer transition-all duration-300",
                isLocked
                    ? "bg-slate-900/40 border-slate-800"
                    : "bg-slate-900/80 backdrop-blur-sm border-slate-700/50",
                !isLocked && rarityGlow[achievement.rarity],
                totalStars === 5 && "border-accent-cyan"
            )}
        >
            {/* Locked Indicator */}
            {isLocked && (
                <div className="absolute top-4 left-4 bg-slate-800/80 px-3 py-1 rounded-full flex items-center gap-2">
                    <Lock className="w-3 h-3 text-slate-500" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Locked</span>
                </div>
            )}

            {/* Rarity Badge */}
            <div
                className={cn(
                    "absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                    isLocked
                        ? "bg-slate-800 text-slate-600"
                        : `bg-gradient-to-r ${rarityColors[achievement.rarity]} text-white`
                )}
            >
                {achievement.rarity}
            </div>

            {/* Achievement Icon */}
            <div className="flex justify-center mb-4 mt-2">
                <div
                    className={cn(
                        "w-20 h-20 rounded-2xl flex items-center justify-center text-4xl",
                        isLocked
                            ? "bg-slate-800/50 grayscale opacity-60"
                            : `bg-gradient-to-br ${rarityColors[achievement.rarity]} ${rarityGlow[achievement.rarity]}`
                    )}
                >
                    {achievement.icon}
                </div>
            </div>

            {/* Title & Description */}
            <div className="text-center mb-4">
                <h3 className={cn(
                    "text-xl font-bold mb-1",
                    isLocked ? "text-slate-500" : "text-white"
                )}>
                    {achievement.name}
                </h3>
                <p className={cn(
                    "text-sm",
                    isLocked ? "text-slate-600" : "text-slate-400"
                )}>
                    {achievement.description}
                </p>
            </div>

            {/* Star Progress */}
            <div className="mb-4">
                <div className="flex justify-center gap-2 mb-2">
                    {achievement.stars.map((star) => (
                        <motion.div
                            key={star.star}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: star.star * 0.1 }}
                        >
                            {star.unlocked ? (
                                <Star
                                    className="w-8 h-8 fill-accent-cyan text-accent-cyan drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                                />
                            ) : (
                                <Star className={cn(
                                    "w-8 h-8",
                                    isLocked ? "text-slate-800" : "text-slate-700"
                                )} />
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Progress Text */}
                {nextStar ? (
                    <p className={cn(
                        "text-xs text-center",
                        isLocked ? "text-slate-700" : "text-slate-500"
                    )}>
                        {achievement.currentProgress} / {nextStar.requirement} for {nextStar.star}★
                    </p>
                ) : (
                    <p className="text-xs text-center text-accent-cyan font-bold flex items-center justify-center gap-1">
                        <Award className="w-3 h-3" />
                        MASTERED
                    </p>
                )}
            </div>

            {/* XP Display */}
            <div className="text-center mb-4">
                <div className={cn(
                    "text-2xl font-bold",
                    isLocked ? "text-slate-700" : "text-accent-cyan"
                )}>
                    +{achievement.totalXpEarned.toLocaleString()} XP
                </div>
                <div className={cn(
                    "text-xs",
                    isLocked ? "text-slate-700" : "text-slate-500"
                )}>
                    {isLocked ? "Potential Reward" : "Total Earned"}
                </div>
            </div>

            {/* Progress Bar */}
            {nextStar && (
                <div className={cn(
                    "relative h-2 rounded-full overflow-hidden",
                    isLocked ? "bg-slate-800/50" : "bg-slate-800"
                )}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={cn(
                            "h-full",
                            isLocked
                                ? "bg-slate-700"
                                : "bg-gradient-to-r from-accent-indigo to-accent-cyan"
                        )}
                    />
                </div>
            )}
        </motion.div>
    );
}
