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
                                <LevelBadge userLevel={userLevel} size="sm" />
                                <span className="text-[#e2d5c3] font-serif font-bold text-sm">Circle {userLevel}</span>
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

            {/* Right Details Panel - The Premium Scroll */}
            <div className="pointer-events-none flex justify-end p-6 h-full items-start mt-20">
                <AnimatePresence>
                    {selectedNodeId && selectedNodeDef && selectedNodeProgress && (
                        <motion.div
                            key={selectedNodeId}
                            initial={{ x: 300, opacity: 0, scale: 0.95 }}
                            animate={{ x: 0, opacity: 1, scale: 1 }}
                            exit={{ x: 300, opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="pointer-events-auto w-[420px] relative"
                        >
                            {/* Scroll Container with Torn Edges */}
                            <div className="relative">
                                {/* Main Parchment Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#f5e6d3] via-[#ede0ce] to-[#f5e6d3] rounded-lg shadow-2xl">
                                    {/* Paper Texture Overlay */}
                                    <div className="absolute inset-0 opacity-40" style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`
                                    }} />

                                    {/* Torn Edge Effect - Top */}
                                    <div className="absolute -top-2 left-0 right-0 h-4 bg-gradient-to-b from-[#d4c5b3] to-transparent opacity-60"
                                        style={{
                                            clipPath: 'polygon(0% 0%, 2% 100%, 5% 20%, 8% 80%, 12% 30%, 15% 90%, 18% 40%, 22% 100%, 25% 10%, 28% 70%, 32% 25%, 35% 85%, 38% 35%, 42% 95%, 45% 15%, 48% 75%, 52% 30%, 55% 90%, 58% 20%, 62% 80%, 65% 40%, 68% 100%, 72% 25%, 75% 85%, 78% 35%, 82% 95%, 85% 15%, 88% 75%, 92% 30%, 95% 90%, 98% 20%, 100% 0%)'
                                        }}
                                    />

                                    {/* Torn Edge Effect - Bottom */}
                                    <div className="absolute -bottom-2 left-0 right-0 h-4 bg-gradient-to-t from-[#d4c5b3] to-transparent opacity-60"
                                        style={{
                                            clipPath: 'polygon(0% 100%, 2% 0%, 5% 80%, 8% 20%, 12% 70%, 15% 10%, 18% 60%, 22% 0%, 25% 90%, 28% 30%, 32% 75%, 35% 15%, 38% 65%, 42% 5%, 45% 85%, 48% 25%, 52% 70%, 55% 10%, 58% 80%, 62% 20%, 65% 60%, 68% 0%, 72% 75%, 75% 15%, 78% 65%, 82% 5%, 85% 85%, 88% 25%, 92% 70%, 95% 10%, 98% 80%, 100% 100%)'
                                        }}
                                    />

                                    {/* Shadow Depth Layers */}
                                    <div className="absolute inset-0 rounded-lg shadow-[0_8px_32px_rgba(139,69,19,0.3)]" />
                                    <div className="absolute inset-0 rounded-lg shadow-[inset_0_2px_8px_rgba(139,69,19,0.1)]" />
                                </div>

                                {/* Content */}
                                <div className="relative p-8 text-[#3e2723] font-serif max-h-[75vh] overflow-y-auto parchment-scrollbar">
                                    {/* Header Section */}
                                    <div className="mb-6 pb-6 border-b-2 border-[#8b4513]/20">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8b4513]">
                                                Current Module
                                            </span>
                                            <span className="text-sm font-bold text-[#5d4037] bg-[#fff8f0] px-3 py-1 rounded-full border border-[#e6d5c3]">
                                                {selectedNodeProgress.completedLessons} / {selectedNodeDef.lessons} Lessons
                                            </span>
                                        </div>
                                        <h2 className="text-3xl font-bold mb-3 leading-tight text-[#2d1b0e]">
                                            {selectedNodeDef.title}
                                        </h2>
                                        <p className="text-sm leading-relaxed text-[#5d4037]">
                                            {selectedNodeDef.description}
                                        </p>
                                    </div>

                                    {/* Gradient Progress Bar */}
                                    <div className="mb-8">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold uppercase tracking-wider text-[#8b4513]">📖 Lessons</span>
                                        </div>
                                        <div className="h-2 w-full bg-[#d7ccc8] rounded-full overflow-hidden shadow-inner">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-[#4ade80] via-[#fbbf24] to-[#fb923c] relative"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(selectedNodeProgress.completedLessons / selectedNodeDef.lessons) * 100}%` }}
                                                transition={{ duration: 0.8, ease: "easeOut" }}
                                            >
                                                {/* Glow Effect */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent animate-pulse-slow" />
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Lessons List */}
                                    <div className="space-y-3 mb-8">
                                        {Array.from({ length: selectedNodeDef.lessons }).map((_, i) => {
                                            const lessonNum = i + 1;
                                            const isCompleted = lessonNum <= selectedNodeProgress.completedLessons;
                                            const isCurrent = lessonNum === selectedNodeProgress.completedLessons + 1;
                                            const lessonTitle = selectedNodeDef.lessonTitles?.[i] || `Lesson ${lessonNum}`;

                                            return (
                                                <motion.div
                                                    key={lessonNum}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    onClick={() => {
                                                        if (!isCompleted) {
                                                            router.push(`/lesson?nodeId=${selectedNodeId}&lessonIndex=${lessonNum}&lessonTitle=${encodeURIComponent(lessonTitle)}`);
                                                        }
                                                    }}
                                                    className={cn(
                                                        "flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer group relative overflow-hidden",
                                                        isCompleted
                                                            ? "bg-gradient-to-r from-[#d4f4dd] to-[#c8e6c9] border-[#81c784] shadow-sm"
                                                            : isCurrent
                                                                ? "bg-gradient-to-r from-[#fef3c7] to-[#fde68a] border-[#fbbf24] shadow-md hover:shadow-lg"
                                                                : "bg-white/60 border-[#d7ccc8] hover:bg-white/80 hover:border-[#a1887f] hover:shadow-md"
                                                    )}
                                                >
                                                    {/* Subtle Background Pattern */}
                                                    {isCurrent && (
                                                        <div className="absolute inset-0 opacity-10" style={{
                                                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f59e0b' fill-opacity='0.4'%3E%3Cpath d='M0 0h20L0 20z'/%3E%3C/g%3E%3C/svg%3E")`
                                                        }} />
                                                    )}

                                                    {/* Icon Circle */}
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 flex-shrink-0 relative z-10",
                                                        isCompleted
                                                            ? "bg-[#81c784] border-[#2e7d32] text-white shadow-lg"
                                                            : isCurrent
                                                                ? "bg-white border-[#f59e0b] text-[#f59e0b] shadow-md group-hover:scale-110"
                                                                : "bg-white border-[#8b4513] text-[#8b4513] group-hover:border-[#5d4037]"
                                                    )}>
                                                        {isCompleted ? (
                                                            <Check className="w-5 h-5" strokeWidth={3} />
                                                        ) : (
                                                            <span className="font-serif">{lessonNum}</span>
                                                        )}
                                                    </div>

                                                    {/* Lesson Title */}
                                                    <div className="flex-1 relative z-10">
                                                        <span className={cn(
                                                            "text-base font-semibold block leading-tight",
                                                            isCompleted
                                                                ? "text-[#1b5e20]"
                                                                : isCurrent
                                                                    ? "text-[#2d1b0e]"
                                                                    : "text-[#3e2723] group-hover:text-[#2d1b0e]"
                                                        )}>
                                                            {lessonTitle}
                                                        </span>
                                                        {isCompleted && (
                                                            <span className="text-xs text-[#2e7d32] mt-1 flex items-center gap-1">
                                                                <Check className="w-3 h-3" /> Completed
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Arrow Indicator */}
                                                    {!isCompleted && (
                                                        <ChevronRight className={cn(
                                                            "w-5 h-5 transition-all duration-300 relative z-10",
                                                            isCurrent
                                                                ? "text-[#f59e0b] opacity-100 translate-x-0"
                                                                : "text-[#8b4513] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                                                        )} />
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-3 pt-4 border-t-2 border-[#8b4513]/20">
                                        <Button
                                            className="w-full bg-gradient-to-r from-[#14b8a6] to-[#0d9488] hover:from-[#0d9488] hover:to-[#0f766e] text-white font-serif py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#0d9488]/30 group relative overflow-hidden"
                                            onClick={() => {
                                                const nextLesson = selectedNodeProgress.completedLessons + 1;
                                                const lessonTitle = selectedNodeDef.lessonTitles?.[nextLesson - 1] || `Lesson ${nextLesson}`;
                                                router.push(`/lesson?nodeId=${selectedNodeId}&lessonIndex=${nextLesson}&lessonTitle=${encodeURIComponent(lessonTitle)}`);
                                            }}
                                        >
                                            {/* Shimmer Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                                            <div className="flex items-center justify-center gap-3 relative z-10">
                                                <BookOpen className="w-5 h-5" />
                                                <span>{selectedNodeProgress.completedLessons >= selectedNodeDef.lessons ? "Review Lessons" : "Continue Learning"}</span>
                                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </Button>

                                        <Button
                                            className="w-full bg-gradient-to-r from-[#a855f7] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#6d28d9] text-white font-serif py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#7c3aed]/30 group relative overflow-hidden"
                                            onClick={onQuizOpen}
                                        >
                                            {/* Shimmer Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                                            <div className="flex items-center justify-center gap-3 relative z-10">
                                                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                                <span>Take Quiz Challenge</span>
                                                <Sparkles className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
                                            </div>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
