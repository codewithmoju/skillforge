"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakDisplayProps {
    currentStreak: number;
    longestStreak: number;
    multiplier: number;
    compact?: boolean;
}

export function StreakDisplay({
    currentStreak,
    longestStreak,
    multiplier,
    compact = false,
}: StreakDisplayProps) {
    const getStreakColor = (streak: number) => {
        if (streak >= 365) return "from-pink-500 to-purple-600";
        if (streak >= 90) return "from-orange-500 to-red-600";
        if (streak >= 30) return "from-yellow-500 to-orange-600";
        if (streak >= 7) return "from-cyan-500 to-blue-600";
        return "from-slate-500 to-slate-600";
    };

    if (compact) {
        return (
            <div className="inline-flex items-center gap-2 bg-slate-800/50 rounded-full px-3 py-1.5 border border-slate-700">
                <Zap className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span className="text-sm font-bold text-white">{currentStreak}</span>
                {multiplier > 1 && (
                    <span className="text-xs text-accent-cyan font-bold">
                        {multiplier}x
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800">
            <div className="flex items-center gap-3 mb-3">
                <div
                    className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        `bg-gradient-to-br ${getStreakColor(currentStreak)}`
                    )}
                >
                    <Zap className="w-6 h-6 text-white fill-white" />
                </div>
                <div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider">
                        Current Streak
                    </div>
                    <div className="text-2xl font-bold text-white">
                        {currentStreak} {currentStreak === 1 ? "Day" : "Days"}
                    </div>
                </div>
            </div>

            {/* Multiplier Badge */}
            {multiplier > 1 && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-accent-indigo to-accent-cyan rounded-full px-4 py-2 mb-3"
                >
                    <Zap className="w-4 h-4 text-white fill-white" />
                    <span className="text-sm font-bold text-white">
                        {multiplier}x XP Multiplier Active!
                    </span>
                </motion.div>
            )}

            {/* Stats */}
            <div className="flex gap-4 text-sm">
                <div>
                    <div className="text-slate-500">Longest Streak</div>
                    <div className="font-bold text-white">{longestStreak} days</div>
                </div>
                <div>
                    <div className="text-slate-500">Next Milestone</div>
                    <div className="font-bold text-white">
                        {currentStreak < 7 ? "7 days" :
                            currentStreak < 30 ? "30 days" :
                                currentStreak < 90 ? "90 days" :
                                    currentStreak < 180 ? "180 days" :
                                        currentStreak < 365 ? "365 days" : "Max!"}
                    </div>
                </div>
            </div>

            {/* Progress to Next Milestone */}
            <div className="mt-3">
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{
                            width: `${currentStreak < 7 ? (currentStreak / 7) * 100 :
                                    currentStreak < 30 ? ((currentStreak - 7) / 23) * 100 :
                                        currentStreak < 90 ? ((currentStreak - 30) / 60) * 100 :
                                            currentStreak < 180 ? ((currentStreak - 90) / 90) * 100 :
                                                currentStreak < 365 ? ((currentStreak - 180) / 185) * 100 : 100
                                }%`,
                        }}
                        transition={{ duration: 1 }}
                        className={cn("h-full", `bg-gradient-to-r ${getStreakColor(currentStreak)}`)}
                    />
                </div>
            </div>
        </div>
    );
}
