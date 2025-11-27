"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, RotateCcw, BookOpen, Check, ChevronRight, Sparkles, Scroll, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useUserStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { StreakDisplay } from "@/components/gamification/StreakDisplay";
import { calculateUserLevel } from "@/lib/utils/levelSystem";

interface ForestRoadmapOverlayProps {
    selectedNodeId: string | null;
    onGenerateNew: () => void;
    onQuizOpen: () => void;
}

export function ForestRoadmapOverlay({ selectedNodeId, onGenerateNew, onQuizOpen }: ForestRoadmapOverlayProps) {
    const router = useRouter();
    const { currentTopic, roadmapDefinitions, roadmapProgress, xp, streakData } = useUserStore();
    const userLevel = calculateUserLevel(xp);

    const selectedNodeDef = selectedNodeId ? roadmapDefinitions.find(n => n.id === selectedNodeId) : null;
    const selectedNodeProgress = selectedNodeId ? roadmapProgress[selectedNodeId] : null;

    return (
        <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between">
            {/* Top Bar - Wooden Sign */}
            <div className="pointer-events-auto p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    {/* Title Sign */}
                    <div className="relative group">
                        {/* Wooden Board Background */}
                        <div className="absolute inset-0 bg-[#2d1b0e] rounded-lg transform -rotate-1 shadow-xl border-2 border-[#5d4037]">
                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z' fill='%233e2723' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />
                        </div>

                        {/* Content */}
                        <div className="relative px-8 py-4 transform rotate-0 transition-transform group-hover:rotate-1">
                            <div className="flex items-center gap-3 mb-1">
                                <MapIcon className="w-5 h-5 text-emerald-500" />
                                <h1 className="text-2xl font-serif font-bold text-[#e2d5c3] text-shadow-sm">
                                    {currentTopic ? currentTopic : "Uncharted Territory"}
                                </h1>
                            </div>
                            <p className="text-[#a1887f] text-sm font-serif italic">
                                The path of wisdom lies before you.
                            </p>

                            {/* Hanging Chains (Visual) */}
                            <div className="absolute -top-4 left-4 w-1 h-6 bg-[#1a120b] border-x border-[#3e2723]" />
                            <div className="absolute -top-4 right-4 w-1 h-6 bg-[#1a120b] border-x border-[#3e2723]" />
                        </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center gap-4">
                        {/* Stats Container - Stone Tablet */}
                        <div className="flex items-center gap-4 bg-[#1a2f16]/90 backdrop-blur-md border border-[#2d4a22] rounded-xl p-2 px-4 shadow-lg">
                            <div className="flex items-center gap-2 border-r border-[#2d4a22] pr-4">
                                <LevelBadge userLevel={userLevel.level} size="sm" />
                                <span className="text-[#e2d5c3] font-serif font-bold text-sm">Circle {userLevel.level}</span>
                            </div>
                            <StreakDisplay
                                currentStreak={streakData.currentStreak}
                                longestStreak={streakData.longestStreak}
                                multiplier={streakData.multiplier}
                                compact
                            />
                        </div>

                        {/* Action Buttons - Magic Runes */}
                        <div className="flex gap-2">
                            <Button
                                onClick={onGenerateNew}
                                className="bg-[#3e2723] hover:bg-[#2d1b0e] text-[#e2d5c3] border border-[#5d4037] font-serif shadow-lg hover:shadow-[#5d4037]/50"
                            >
                                <RotateCcw className="w-4 h-4 mr-2 text-amber-500" />
                                New Quest
                            </Button>
                            <Link href="/achievements">
                                <Button
                                    className="bg-[#1a2f16] hover:bg-[#0f1f0f] text-[#e2d5c3] border border-[#2d4a22] font-serif shadow-lg hover:shadow-emerald-900/50"
                                >
                                    <Trophy className="w-4 h-4 mr-2 text-emerald-500" />
                                    Trophies
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Details Panel - The Scroll */}
            <div className="pointer-events-none flex justify-end p-6 h-full items-start mt-20">
                <AnimatePresence>
                    {selectedNodeId && selectedNodeDef && selectedNodeProgress && (
                        <motion.div
                            key={selectedNodeId}
                            initial={{ x: 300, opacity: 0, rotate: 5 }}
                            animate={{ x: 0, opacity: 1, rotate: 0 }}
                            exit={{ x: 300, opacity: 0 }}
                            className="pointer-events-auto w-96 relative"
                        >
                            {/* Scroll Background */}
                            <div className="absolute inset-0 bg-[#f5e6d3] rounded-sm shadow-2xl transform rotate-1 border-y-8 border-[#d7ccc8]">
                                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")` }} />
                                {/* Rolled Ends */}
                                <div className="absolute -top-3 left-0 right-0 h-6 bg-[#d7ccc8] rounded-full shadow-md border border-[#a1887f]" />
                                <div className="absolute -bottom-3 left-0 right-0 h-6 bg-[#d7ccc8] rounded-full shadow-md border border-[#a1887f]" />
                            </div>

                            {/* Content */}
                            <div className="relative p-8 text-[#3e2723] font-serif max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="mb-6 border-b-2 border-[#8b4513]/20 pb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold uppercase tracking-wider text-[#8b4513]">
                                            Chapter {selectedNodeProgress.completedLessons + 1}
                                        </span>
                                        <span className="text-xs font-bold text-[#5d4037]">
                                            {selectedNodeProgress.completedLessons} / {selectedNodeDef.lessons} Runes
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2 leading-tight">
                                        {selectedNodeDef.title}
                                    </h2>
                                    <p className="text-sm italic text-[#5d4037] leading-relaxed">
                                        "{selectedNodeDef.overview || "No description available."}"
                                    </p>
                                </div>

                                {/* Progress Bar - Ink Line */}
                                <div className="mb-6">
                                    <div className="h-1 w-full bg-[#d7ccc8] rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-[#8b4513]"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(selectedNodeProgress.completedLessons / selectedNodeDef.lessons) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Lessons List */}
                                <div className="space-y-3 mb-8">
                                    {Array.from({ length: selectedNodeDef.lessons }).map((_, i) => {
                                        const lessonNum = i + 1;
                                        const isCompleted = lessonNum <= selectedNodeProgress.completedLessons;
                                        const lessonTitle = selectedNodeDef.lessonTitles?.[i] || `Lesson ${lessonNum}`;

                                        return (
                                            <div
                                                key={lessonNum}
                                                onClick={() => {
                                                    if (!isCompleted) {
                                                        router.push(`/lesson?nodeId=${selectedNodeId}&lessonIndex=${lessonNum}&lessonTitle=${encodeURIComponent(lessonTitle)}`);
                                                    }
                                                }}
                                                className={cn(
                                                    "flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 cursor-pointer group",
                                                    isCompleted
                                                        ? "bg-[#e8f5e9]/50 border-[#a5d6a7] text-[#2e7d32]"
                                                        : "bg-white/40 border-[#d7ccc8] hover:bg-white/60 hover:border-[#8b4513]"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border",
                                                    isCompleted ? "bg-[#c8e6c9] border-[#2e7d32]" : "border-[#8b4513] text-[#8b4513]"
                                                )}>
                                                    {isCompleted ? <Check className="w-3 h-3" /> : lessonNum}
                                                </div>
                                                <span className={cn(
                                                    "text-sm font-medium flex-1",
                                                    isCompleted && "line-through opacity-70"
                                                )}>
                                                    {lessonTitle}
                                                </span>
                                                {!isCompleted && <ChevronRight className="w-4 h-4 text-[#8b4513] opacity-0 group-hover:opacity-100 transition-opacity" />}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Actions */}
                                <div className="space-y-3">
                                    <Button
                                        className="w-full bg-[#2d4a22] hover:bg-[#1a2f16] text-[#e2d5c3] font-serif py-6 text-lg shadow-lg hover:shadow-emerald-900/30 border border-[#4a6741]"
                                        onClick={() => {
                                            const nextLesson = selectedNodeProgress.completedLessons + 1;
                                            const lessonTitle = selectedNodeDef.lessonTitles?.[nextLesson - 1] || `Lesson ${nextLesson}`;
                                            router.push(`/lesson?nodeId=${selectedNodeId}&lessonIndex=${nextLesson}&lessonTitle=${encodeURIComponent(lessonTitle)}`);
                                        }}
                                    >
                                        <Scroll className="w-5 h-5 mr-2" />
                                        {selectedNodeProgress.completedLessons >= selectedNodeDef.lessons ? "Review Wisdom" : "Continue Journey"}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="w-full border-[#8b4513] text-[#3e2723] hover:bg-[#8b4513]/10 font-serif py-4"
                                        onClick={onQuizOpen}
                                    >
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Face the Trial
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
