"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Check, Lock, Star, ChevronRight, BookOpen, Loader2, Trophy, RotateCcw, Palette, Sparkles } from "lucide-react";
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
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
// New Gamified Components
import { MissionControl } from "@/components/roadmap/MissionControl";
import { QuestPath } from "@/components/roadmap/QuestPath";
import { SkillTree } from "@/components/roadmap/SkillTree";
import { DeepSpaceBackground } from "@/components/ui/DeepSpaceBackground";

export default function RoadmapPage() {
    const { user } = useAuth();
    const { colors } = useSkin();
    const {
        roadmapProgress,
        roadmapDefinitions,
        currentTopic,
        learningAreas,
        completedKeyPoints,
        updateLearningArea,
        setRoadmap,
        xp,
        updateStreak,
        streakData,
        prerequisites,
        roadmapGoal,
        _hasHydrated
    } = useUserStore();
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
    const router = useRouter();

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

    // Utility: Fetch details for a specific area in the background
    const fetchAreaDetails = async (topic: string, areaId: string) => {
        try {
            // Find existing area to get topics
            const existingArea = learningAreas.find(a => a.id === areaId);
            const existingTopics = existingArea?.topics.map(t => ({
                id: t.id,
                name: t.name,
                description: t.description
            }));

            const res = await fetch("/api/generate-roadmap/details", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic, areaId, existingTopics }),
            });
            const data = await res.json();
            if (data.details) {
                // Update learning area in store
                updateLearningArea(areaId, {
                    ...data.details,
                    topics: data.details.topics
                });
            }
        } catch (error) {
            console.error(`Failed to fetch details for area ${areaId}:`, error);
            // Silently fail - skeleton is already shown
        }
    };

    const handleGenerate = async (topic: string, answers?: any[], difficulty?: any, persona?: any) => {
        if (!topic.trim()) return;
        setIsGenerating(true);
        try {
            // PHASE 1: Generate and show skeleton FAST (~5 seconds)
            const res = await fetch("/api/generate-roadmap", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic, answers, difficulty, persona }),
            });
            const data = await res.json();

            if (data.learningAreas) {
                const category = topic.split(' ')[0];

                // Store skeleton hierarchical data in global store
                setRoadmap(
                    topic,
                    [], // Empty definitions for legacy support
                    category,
                    data.learningAreas,
                    data.prerequisites || [],
                    data.goal || ""
                );

                // Sync to Firestore if user is logged in
                if (user?.uid) {
                    try {
                        const { updateRoadmapProgress } = await import('@/lib/services/userProgress');
                        await updateRoadmapProgress(user.uid, topic, {
                            topic,
                            learningAreas: data.learningAreas,
                            prerequisites: data.prerequisites || [],
                            goal: data.goal || "",
                        });
                    } catch (error) {
                        console.error('Failed to sync roadmap to Firestore:', error);
                    }
                }

                // Stop loading indicator - show skeleton immediately
                setIsGenerating(false);

                // PHASE 2: Fetch detailed content for each area in background
                // REMOVED: Automatic sequential fetching. Now handled on-demand by SkillTree.
            } else if (data.error) {
                console.error("API Error:", data.error, data.details);
                alert(`Failed to generate roadmap: ${data.details || data.error}`);
                setIsGenerating(false);
            }
        } catch (error) {
            console.error("Failed to generate", error);
            alert("Failed to generate roadmap. Please try again.");
            setIsGenerating(false);
        }
    };

    // Calculate overall progress
    const totalKeyPoints = useMemo(() => {
        return (learningAreas || []).reduce((acc, area) => {
            return acc + (area.topics || []).reduce((tAcc, topic) => {
                return tAcc + (topic.subtopics || []).reduce((sAcc, sub) => {
                    return sAcc + (sub.keyPoints?.length || 0);
                }, 0);
            }, 0);
        }, 0);
    }, [learningAreas]);

    const completedPointsCount = useMemo(() => {
        return completedKeyPoints.length;
    }, [completedKeyPoints]);

    const overallProgress = totalKeyPoints > 0 ? Math.round((completedPointsCount / totalKeyPoints) * 100) : 0;

    // Show loading screen
    if (isGenerating || !_hasHydrated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <RoadmapLoading />
            </div>
        );
    }

    // Show hero component when no roadmap exists
    if (!currentTopic || (learningAreas || []).length === 0) {
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
            className="min-h-screen pb-20 transition-all duration-500 relative overflow-hidden bg-slate-950"
        >
            {/* Global Background Effects */}
            <DeepSpaceBackground />

            <div className="container mx-auto px-4 pt-28 max-w-7xl">
                {/* Mission Control Dashboard */}
                <MissionControl
                    topic={currentTopic}
                    progress={overallProgress}
                    userLevel={userLevel.level}
                    xp={xp}
                    streak={streakData.currentStreak}
                    onLaunch={() => {
                        // Scroll to first active item
                        const element = document.getElementById('quest-path');
                        element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    onRegenerate={async () => {
                        if (confirm("Are you sure you want to start a new roadmap? This will reset all your current progress.")) {
                            if (user?.uid) {
                                try {
                                    const { deleteRoadmapProgress } = await import('@/lib/services/userProgress');
                                    await deleteRoadmapProgress(user.uid);
                                } catch (error) {
                                    console.error("Failed to clear remote roadmap:", error);
                                }
                            }
                            setRoadmap("", [], "", [], [], "");
                            window.location.reload();
                        }
                    }}
                    onGenerateCourse={async () => {
                        if (isGenerating) return;
                        setIsGenerating(true); // Reuse loading state or create new one
                        try {
                            const res = await fetch("/api/courses/generate-from-roadmap", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    topic: currentTopic,
                                    learningAreas,
                                    // Pass other context if available in store
                                }),
                            });
                            const data = await res.json();
                            if (data.courseId) {
                                router.push(`/courses/${data.courseId}`);
                            } else {
                                alert("Failed to generate course");
                                setIsGenerating(false);
                            }
                        } catch (error) {
                            console.error("Failed to generate course", error);
                            alert("Failed to generate course");
                            setIsGenerating(false);
                        }
                    }}
                />

                {/* Main Content Area */}
                {((prerequisites || []).length > 0 || (learningAreas || []).length > 0) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-12"
                    >
                        {/* Quest Path (Prerequisites) */}
                        <div id="quest-path">
                            <QuestPath
                                prerequisites={prerequisites || []}
                                goal={roadmapGoal || currentTopic}
                            />
                        </div>

                        {/* Skill Tree (Learning Areas) */}
                        <SkillTree
                            learningAreas={learningAreas}
                            goal={roadmapGoal || currentTopic}
                            onFetchDetails={(areaId) => fetchAreaDetails(currentTopic, areaId)}
                        />
                    </motion.div>
                )}
            </div>
        </div>
    );
}


