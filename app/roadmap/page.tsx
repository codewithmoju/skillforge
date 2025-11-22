"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Lock, Star, ChevronRight, BookOpen, Loader2, Trophy, RotateCcw, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useUserStore } from "@/lib/store";
import { QuizModal } from "@/components/features/QuizModal";
import { AchievementToast } from "@/components/gamification/AchievementToast";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { StreakDisplay } from "@/components/gamification/StreakDisplay";
import { RoadmapGenerationHero } from "@/components/roadmap/RoadmapGenerationHero";
import RoadmapLoading from "@/components/roadmap/RoadmapLoading";
import { RoadmapSkinRenderer } from "@/components/roadmap/RoadmapSkinRenderer";
import { SkinSelector } from "@/components/roadmap/SkinSelector";
import { useSkin } from "@/lib/hooks/useSkin";
import { calculateUserLevel } from "@/lib/utils/levelSystem";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RoadmapPage() {
    const router = useRouter();
    const { roadmapProgress, roadmapDefinitions, completeLesson, setRoadmap, currentTopic, xp, streakData, updateStreak, selectedSkin } = useUserStore();
    const { colors } = useSkin();
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isQuizOpen, setIsQuizOpen] = useState(false);
    const [isSkinSelectorOpen, setIsSkinSelectorOpen] = useState(false);
    const [achievementToast, setAchievementToast] = useState<{
        name: string;
        icon: string;
        stars: number;
        xp: number;
    } | null>(null);

    const userLevel = calculateUserLevel(xp);

    // Update streak on mount
    useEffect(() => {
        updateStreak();
    }, []);

    // Set initial selected node if available and none selected
    useEffect(() => {
        if (!selectedNodeId && roadmapDefinitions.length > 0) {
            const firstActive = roadmapDefinitions.find(def => roadmapProgress[def.id]?.status === "active");
            if (firstActive) setSelectedNodeId(firstActive.id);
            else setSelectedNodeId(roadmapDefinitions[0].id);
        }
    }, [roadmapDefinitions, roadmapProgress, selectedNodeId]);


    const selectedNodeDef = selectedNodeId ? roadmapDefinitions.find(n => n.id === selectedNodeId) : null;
    const selectedNodeProgress = selectedNodeId ? roadmapProgress[selectedNodeId] : null;

    const handleGenerate = async (topic: string) => {
        if (!topic.trim()) return;
        setIsGenerating(true);
        try {
            const res = await fetch("/api/generate-roadmap", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic }),
            });
            const data = await res.json();
            if (data.roadmap) {
                const category = topic.split(' ')[0];
                setRoadmap(topic, data.roadmap, category);
            } else if (data.error) {
                console.error("API Error:", data.error, data.details);
                alert(`Failed to generate roadmap: ${data.details || data.error}`);
            }
        } catch (error) {
            console.error("Failed to generate", error);
            alert("Failed to generate roadmap. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    // Show loading screen
    if (isGenerating) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <RoadmapLoading />
            </div>
        );
    }

    // Show hero component when no roadmap exists
    if (roadmapDefinitions.length === 0) {
        return (
            <div className="min-h-screen">
                <RoadmapGenerationHero
                    onGenerate={handleGenerate}
                    isGenerating={isGenerating}
                />
            </div>
        );
    }

    return (
        <div
            className="min-h-screen pb-20 transition-all duration-500 relative overflow-hidden"
            style={{ backgroundColor: selectedSkin === 'forest-quest' ? 'transparent' : colors.background }}
        >
            {/* Background Effects - Only for non-custom skins */}
            {selectedSkin !== 'forest-quest' && (
                <div
                    className="fixed inset-0 -z-10 opacity-30"
                    style={{
                        background: `radial-gradient(circle at 20% 30%, ${colors.primary}20 0%, transparent 50%),
                                     radial-gradient(circle at 80% 70%, ${colors.accent}20 0%, transparent 50%)`,
                    }}
                />
            )}

            {/* Header / Stats Section */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1
                            className="text-3xl font-bold mb-2 transition-colors duration-500"
                            style={{ color: colors.textPrimary }}
                        >
                            {currentTopic ? `Roadmap: ${currentTopic}` : "Your Learning Journey"}
                        </h1>
                        <p
                            className="transition-colors duration-500"
                            style={{ color: colors.textSecondary }}
                        >
                            Master your skills one level at a time.
                        </p>
                    </div>

                    <div className="flex gap-3 flex-wrap">
                        <Button
                            variant="outline"
                            onClick={() => setIsSkinSelectorOpen(true)}
                            className="flex items-center gap-2 transition-all duration-300 hover:scale-105 relative overflow-hidden"
                            style={{
                                borderColor: colors.primary,
                                color: colors.textPrimary,
                                backgroundColor: `${colors.backgroundCard}80`,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = colors.accent;
                                e.currentTarget.style.backgroundColor = `${colors.primary}20`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = colors.primary;
                                e.currentTarget.style.backgroundColor = `${colors.backgroundCard}80`;
                            }}
                        >
                            {selectedSkin === 'forest-quest' && (
                                <div className="absolute inset-0 opacity-20 pointer-events-none"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0V0zm10 10h10v10H10V10zM0 10h10v10H0V10z' fill='%23000000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                                    }}
                                />
                            )}
                            <Palette className="w-4 h-4 relative z-10" style={{ color: colors.accent }} />
                            <span className="relative z-10">Change Layout</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                if (confirm("Are you sure you want to generate a new roadmap? This will replace your current progress.")) {
                                    setRoadmap("", [], "");
                                }
                            }}
                            className="flex items-center gap-2 transition-all duration-300 hover:scale-105 relative overflow-hidden"
                            style={{
                                borderColor: colors.primary,
                                color: colors.textPrimary,
                                backgroundColor: `${colors.backgroundCard}80`,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = colors.accent;
                                e.currentTarget.style.backgroundColor = `${colors.primary}20`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = colors.primary;
                                e.currentTarget.style.backgroundColor = `${colors.backgroundCard}80`;
                            }}
                        >
                            {selectedSkin === 'forest-quest' && (
                                <div className="absolute inset-0 opacity-20 pointer-events-none"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0V0zm10 10h10v10H10V10zM0 10h10v10H0V10z' fill='%23000000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                                    }}
                                />
                            )}
                            <RotateCcw className="w-4 h-4 relative z-10" style={{ color: colors.accent }} />
                            <span className="relative z-10">New Roadmap</span>
                        </Button>
                        <Link href="/achievements">
                            <Button
                                variant="outline"
                                className="flex items-center gap-2 transition-all duration-300 hover:scale-105 relative overflow-hidden"
                                style={{
                                    borderColor: colors.primary,
                                    color: colors.textPrimary,
                                    backgroundColor: `${colors.backgroundCard}80`,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = colors.accent;
                                    e.currentTarget.style.backgroundColor = `${colors.primary}20`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = colors.primary;
                                    e.currentTarget.style.backgroundColor = `${colors.backgroundCard}80`;
                                }}
                            >
                                {selectedSkin === 'forest-quest' && (
                                    <div className="absolute inset-0 opacity-20 pointer-events-none"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0V0zm10 10h10v10H10V10zM0 10h10v10H0V10z' fill='%23000000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                                        }}
                                    />
                                )}
                                <Trophy className="w-4 h-4 relative z-10" style={{ color: colors.accent }} />
                                <span className="relative z-10">Achievements</span>
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div
                        className="rounded-xl p-4 border flex items-center justify-center transition-all duration-500 relative overflow-hidden"
                        style={{
                            backgroundColor: `${colors.backgroundCard}80`,
                            borderColor: `${colors.primary}40`,
                        }}
                    >
                        {selectedSkin === 'forest-quest' && (
                            <div className="absolute inset-0 opacity-10 pointer-events-none"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h40v20.5h-20z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                                }}
                            />
                        )}
                        <LevelBadge userLevel={userLevel} size="sm" />
                    </div>
                    <div
                        className="md:col-span-2 rounded-xl p-4 border transition-all duration-500 relative overflow-hidden"
                        style={{
                            backgroundColor: `${colors.backgroundCard}80`,
                            borderColor: `${colors.primary}40`,
                        }}
                    >
                        {selectedSkin === 'forest-quest' && (
                            <div className="absolute inset-0 opacity-10 pointer-events-none"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h40v20.5h-20z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                                }}
                            />
                        )}
                        <StreakDisplay
                            currentStreak={streakData.currentStreak}
                            longestStreak={streakData.longestStreak}
                            multiplier={streakData.multiplier}
                            compact
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 h-full">
                {/* Left: Roadmap Visualization with Skin System */}
                <div className="flex-1 relative min-h-[800px] overflow-hidden">
                    <RoadmapSkinRenderer
                        roadmapDefinitions={roadmapDefinitions}
                        roadmapProgress={roadmapProgress}
                        selectedNodeId={selectedNodeId}
                        onNodeSelect={setSelectedNodeId}
                    />
                </div>

                {/* Right: Details Panel */}
                <div className="w-full lg:w-96 shrink-0">
                    {selectedNodeId && selectedNodeDef && selectedNodeProgress ? (
                        <motion.div
                            key={selectedNodeId}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="sticky top-24"
                        >
                            <Card
                                className="transition-all duration-500 relative overflow-hidden"
                                style={{
                                    borderColor: `${colors.primary}50`,
                                    backgroundColor: `${colors.backgroundCard}CC`,
                                }}
                            >
                                {selectedSkin === 'forest-quest' && (
                                    <div className="absolute inset-0 opacity-5 pointer-events-none"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                        }}
                                    />
                                )}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span
                                            className="text-xs font-bold uppercase tracking-wider transition-colors duration-500"
                                            style={{ color: colors.accent }}
                                        >
                                            Current Module
                                        </span>
                                        <span
                                            className="text-xs transition-colors duration-500"
                                            style={{ color: colors.textSecondary }}
                                        >
                                            {selectedNodeProgress.completedLessons} / {selectedNodeDef.lessons} Lessons
                                        </span>
                                    </div>
                                    <h2
                                        className="text-2xl font-bold mb-4 transition-colors duration-500"
                                        style={{ color: colors.textPrimary }}
                                    >
                                        {selectedNodeDef.title}
                                    </h2>
                                    <p
                                        className="text-sm mb-4 transition-colors duration-500"
                                        style={{ color: colors.textSecondary }}
                                    >
                                        {selectedNodeDef.description}
                                    </p>
                                    <div className="relative w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${colors.primary}20` }}>
                                        <motion.div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{
                                                backgroundColor: colors.accent,
                                                background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
                                            }}
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: `${(selectedNodeProgress.completedLessons / selectedNodeDef.lessons) * 100}%`
                                            }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <h3
                                        className="font-semibold flex items-center gap-2 transition-colors duration-500"
                                        style={{ color: colors.textPrimary }}
                                    >
                                        <BookOpen className="w-4 h-4" style={{ color: colors.accent }} /> Lessons
                                    </h3>
                                    {Array.from({ length: selectedNodeDef.lessons }).map((_, i) => {
                                        const lessonNum = i + 1;
                                        const isCompleted = lessonNum <= selectedNodeProgress.completedLessons;
                                        const lessonTitle = selectedNodeDef.lessonTitles?.[i] || `Lesson ${lessonNum}`;

                                        return (
                                            <motion.div
                                                key={lessonNum}
                                                onClick={() => {
                                                    if (!isCompleted) {
                                                        router.push(`/lesson?nodeId=${selectedNodeId}&lessonIndex=${lessonNum}&lessonTitle=${encodeURIComponent(lessonTitle)}`);
                                                    }
                                                }}
                                                className="flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 cursor-pointer group"
                                                style={{
                                                    backgroundColor: isCompleted ? `${colors.nodeCompleted}15` : `${colors.backgroundCard}80`,
                                                    borderColor: isCompleted ? `${colors.nodeCompleted}40` : `${colors.primary}30`,
                                                }}
                                                whileHover={{
                                                    scale: 1.02,
                                                    borderColor: isCompleted ? colors.nodeCompleted : colors.accent,
                                                }}
                                            >
                                                <div
                                                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-300"
                                                    style={{
                                                        backgroundColor: isCompleted ? `${colors.nodeCompleted}30` : "transparent",
                                                        borderColor: isCompleted ? colors.nodeCompleted : colors.textMuted,
                                                        color: isCompleted ? colors.nodeCompleted : colors.textMuted,
                                                    }}
                                                >
                                                    {isCompleted ? <Check className="w-3 h-3" /> : lessonNum}
                                                </div>
                                                <div className="flex-1">
                                                    <span
                                                        className={cn(
                                                            "text-sm font-medium transition-colors block",
                                                            isCompleted && "line-through"
                                                        )}
                                                        style={{
                                                            color: isCompleted ? colors.textMuted : colors.textPrimary,
                                                        }}
                                                    >
                                                        {lessonTitle}
                                                    </span>
                                                    {isCompleted && (
                                                        <span
                                                            className="text-xs transition-colors duration-500"
                                                            style={{ color: colors.nodeCompleted }}
                                                        >
                                                            ✓ Completed
                                                        </span>
                                                    )}
                                                </div>
                                                <ChevronRight
                                                    className="w-4 h-4 ml-auto transition-colors duration-300"
                                                    style={{
                                                        color: colors.textMuted,
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.color = colors.accent;
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.color = colors.textMuted;
                                                    }}
                                                />
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Button
                                        className="w-full transition-all duration-300 hover:scale-105"
                                        size="lg"
                                        style={{
                                            background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                                            color: colors.textPrimary,
                                            border: "none",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.boxShadow = `0 0 20px ${colors.primary}50`;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.boxShadow = "none";
                                        }}
                                    >
                                        {selectedNodeProgress.completedLessons >= selectedNodeDef.lessons ? "Module Completed" : "Continue Learning"}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="w-full transition-all duration-300 hover:scale-105"
                                        onClick={() => setIsQuizOpen(true)}
                                        style={{
                                            borderColor: colors.primary,
                                            color: colors.textPrimary,
                                            backgroundColor: `${colors.backgroundCard}80`,
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = colors.accent;
                                            e.currentTarget.style.backgroundColor = `${colors.primary}20`;
                                            e.currentTarget.style.boxShadow = `0 0 15px ${colors.primary}30`;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = colors.primary;
                                            e.currentTarget.style.backgroundColor = `${colors.backgroundCard}80`;
                                            e.currentTarget.style.boxShadow = "none";
                                        }}
                                    >
                                        Take Quiz Challenge
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ) : (
                        <div
                            className="h-full flex items-center justify-center transition-colors duration-500"
                            style={{ color: colors.textMuted }}
                        >
                            Select a node to view details
                        </div>
                    )}
                </div>
            </div>


            {
                selectedNodeDef && (
                    <>
                        <QuizModal
                            isOpen={isQuizOpen}
                            onClose={() => setIsQuizOpen(false)}
                            topic={selectedNodeDef.title}
                            level={selectedNodeDef.level}
                            nodeId={selectedNodeDef.id}
                        />
                    </>
                )
            }

            {/* Achievement Toast */}
            {
                achievementToast && (
                    <AchievementToast
                        achievementName={achievementToast.name}
                        achievementIcon={achievementToast.icon}
                        stars={achievementToast.stars}
                        xpGained={achievementToast.xp}
                        isVisible={!!achievementToast}
                        onClose={() => setAchievementToast(null)}
                    />
                )
            }

            {/* Skin Selector Modal */}
            <SkinSelector
                isOpen={isSkinSelectorOpen}
                onClose={() => setIsSkinSelectorOpen(false)}
            />
        </div >
    );
}
