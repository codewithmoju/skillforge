"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUserStore } from "@/lib/store";
import { AchievementCard } from "@/components/gamification/AchievementCard";
import { AchievementUnlockModal } from "@/components/gamification/AchievementUnlockModal";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { StreakDisplay } from "@/components/gamification/StreakDisplay";
import { calculateUserLevel } from "@/lib/utils/levelSystem";
import { getTotalStarsEarned } from "@/lib/utils/achievementSystem";
import { Trophy, Filter, Star, Lock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AchievementCategory } from "@/lib/types/gamification";

import { useAuth } from "@/lib/hooks/useAuth";

export default function AchievementsPage() {
    const { user } = useAuth();
    const { achievements, xp, streakData, loadAchievements } = useUserStore();
    const [selectedAchievement, setSelectedAchievement] = useState<any>(null);
    const [filterCategory, setFilterCategory] = useState<AchievementCategory | "all">("all");
    const [filterStatus, setFilterStatus] = useState<"all" | "locked" | "in-progress" | "completed">("all");

    const userLevel = calculateUserLevel(xp);

    // Sync achievements from Firestore
    useEffect(() => {
        if (!user?.uid) return;

        const syncAchievements = async () => {
            try {
                const { getUserProgress } = await import('@/lib/services/userProgress');
                const progress = await getUserProgress(user.uid);
                if (progress?.achievements) {
                    loadAchievements(progress.achievements as any);
                }
            } catch (error) {
                console.error("Failed to sync achievements:", error);
            }
        };

        syncAchievements();
    }, [user, loadAchievements]);

    // Filter achievements
    const filteredAchievements = achievements.filter((achievement) => {
        const categoryMatch = filterCategory === "all" || achievement.category === filterCategory;

        const starsEarned = getTotalStarsEarned(achievement);
        const totalStars = achievement.stars.length;

        let statusMatch = true;
        if (filterStatus === "locked") {
            // Show locked achievements (0 stars earned)
            statusMatch = starsEarned === 0;
        } else if (filterStatus === "in-progress") {
            statusMatch = starsEarned > 0 && starsEarned < totalStars;
        } else if (filterStatus === "completed") {
            statusMatch = starsEarned === totalStars;
        }
        // "all" status shows everything including locked

        return categoryMatch && statusMatch;
    });

    // Calculate stats
    const totalStarsEarned = achievements.reduce((sum, a) => sum + getTotalStarsEarned(a), 0);
    const totalPossibleStars = achievements.reduce((sum, a) => sum + a.stars.length, 0);
    const completedAchievements = achievements.filter(
        (a) => getTotalStarsEarned(a) === a.stars.length
    ).length;

    const categories: Array<{ value: AchievementCategory | "all"; label: string; icon: string }> = [
        { value: "all", label: "All", icon: "🏆" },
        { value: "generation", label: "Generation", icon: "🗺️" },
        { value: "completion", label: "Completion", icon: "✅" },
        { value: "engagement", label: "Engagement", icon: "🔥" },
        { value: "social", label: "Social", icon: "👥" },
        { value: "special", label: "Special", icon: "⭐" },
    ];

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <Trophy className="w-8 h-8 text-accent-cyan" />
                    <h1 className="text-3xl font-bold text-white">Achievements</h1>
                </div>
                <p className="text-slate-400">
                    Track your progress and unlock rewards as you learn • {achievements.length} achievements available
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Level Badge */}
                <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 flex justify-center">
                    <LevelBadge userLevel={userLevel} size="lg" showProgress />
                </div>

                {/* Streak */}
                <div className="md:col-span-2">
                    <StreakDisplay
                        currentStreak={streakData.currentStreak}
                        longestStreak={streakData.longestStreak}
                        multiplier={streakData.multiplier}
                    />
                </div>
            </div>

            {/* Achievement Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                    <div className="text-2xl font-bold text-white mb-1">
                        {totalStarsEarned}/{totalPossibleStars}
                    </div>
                    <div className="text-sm text-slate-400">Stars Earned</div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                    <div className="text-2xl font-bold text-accent-cyan mb-1">
                        {completedAchievements}
                    </div>
                    <div className="text-sm text-slate-400">Completed</div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                    <div className="text-2xl font-bold text-accent-indigo mb-1">
                        {achievements.filter((a) => getTotalStarsEarned(a) > 0 && getTotalStarsEarned(a) < a.stars.length).length}
                    </div>
                    <div className="text-sm text-slate-400">In Progress</div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                    <div className="text-2xl font-bold text-slate-500 mb-1">
                        {achievements.filter((a) => getTotalStarsEarned(a) === 0).length}
                    </div>
                    <div className="text-sm text-slate-400">Locked</div>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6 space-y-4">
                {/* Category Filter */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                            Category
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category.value}
                                onClick={() => setFilterCategory(category.value)}
                                className={cn(
                                    "px-4 py-2 rounded-xl font-medium transition-all duration-200",
                                    filterCategory === category.value
                                        ? "bg-gradient-to-r from-accent-indigo to-accent-cyan text-white shadow-lg"
                                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                                )}
                            >
                                <span className="mr-2">{category.icon}</span>
                                {category.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Status Filter */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Star className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                            Status
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { value: "all", label: "All", icon: Trophy },
                            { value: "locked", label: "Locked", icon: Lock },
                            { value: "in-progress", label: "In Progress", icon: Star },
                            { value: "completed", label: "Completed", icon: CheckCircle },
                        ].map((status) => (
                            <button
                                key={status.value}
                                onClick={() => setFilterStatus(status.value as any)}
                                className={cn(
                                    "px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2",
                                    filterStatus === status.value
                                        ? "bg-gradient-to-r from-accent-indigo to-accent-cyan text-white shadow-lg"
                                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                                )}
                            >
                                <status.icon className="w-4 h-4" />
                                {status.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Achievement Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAchievements.map((achievement, index) => (
                    <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <AchievementCard
                            achievement={achievement}
                            onClick={() => setSelectedAchievement(achievement)}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Empty State */}
            {filteredAchievements.length === 0 && (
                <div className="text-center py-20">
                    <Lock className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Achievements Found</h3>
                    <p className="text-slate-400">
                        Try adjusting your filters to see more achievements
                    </p>
                </div>
            )}

            {/* Achievement Detail Modal */}
            {selectedAchievement && (
                <AchievementUnlockModal
                    achievement={selectedAchievement}
                    starsUnlocked={selectedAchievement.stars
                        .filter((s: any) => s.unlocked)
                        .map((s: any) => s.star)}
                    xpGained={selectedAchievement.totalXpEarned}
                    isOpen={!!selectedAchievement}
                    onClose={() => setSelectedAchievement(null)}
                />
            )}
        </div>
    );
}
