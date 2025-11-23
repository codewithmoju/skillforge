"use client";

import { useState, useEffect } from "react";
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
import { useRouter } from "next/navigation";
// New Gamified Components
import { MissionControl } from "@/components/roadmap/MissionControl";
import { QuestPath } from "@/components/roadmap/QuestPath";
import { SkillTree } from "@/components/roadmap/SkillTree";
import type { Prerequisite, LearningArea } from "@/lib/store";

export default function RoadmapPage() {
    const router = useRouter();
    const {
        roadmapProgress,
        roadmapDefinitions,
        completeLesson,
        setRoadmap,
        currentTopic,
        xp,
        streakData,
        updateStreak,
        selectedSkin,
        learningAreas,
        prerequisites,
        roadmapGoal,
        updateLearningArea
    } = useUserStore();
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

    // Utility: Fetch details for a specific area in the background
    const fetchAreaDetails = async (topic: string, areaId: string) => {
        try {
            const res = await fetch("/api/generate-roadmap/details", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic, areaId }),
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

    const handleGenerate = async (topic: string) => {
        if (!topic.trim()) return;
        setIsGenerating(true);
        try {
            // PHASE 1: Generate and show skeleton FAST (~5 seconds)
            const res = await fetch("/api/generate-roadmap", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic }),
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

                // Stop loading indicator - show skeleton immediately
                setIsGenerating(false);

                // PHASE 2: Fetch detailed content for each area in background
                if (data.learningAreas && data.learningAreas.length > 0) {
                    // Start with first area immediately for quick detail loading
                    fetchAreaDetails(topic, data.learningAreas[0].id);

                    // Then load rest in sequence with small delays
                    for (let i = 1; i < data.learningAreas.length; i++) {
                        setTimeout(() => {
                            fetchAreaDetails(topic, data.learningAreas[i].id);
                        }, i * 2000); // Stagger by 2 seconds
                    }
                }
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

    // Show loading screen
    if (isGenerating) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <RoadmapLoading />
            </div>
        );
    }

    // Show hero component when no roadmap exists
    if (!currentTopic && learningAreas.length === 0 && roadmapDefinitions.length === 0) {
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
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            <div className="container mx-auto px-4 pt-6 max-w-7xl">
                {/* Mission Control Dashboard */}
                <MissionControl
                    topic={currentTopic}
                    progress={0} // TODO: Calculate real progress
                    userLevel={userLevel.level}
                    xp={xp}
                    streak={streakData.currentStreak}
                    onLaunch={() => {
                        // Scroll to first active item
                        const element = document.getElementById('quest-path');
                        element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                />

                {/* Main Content Area */}
                {(prerequisites.length > 0 || learningAreas.length > 0) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-12"
                    >
                        {/* Quest Path (Prerequisites) */}
                        <div id="quest-path">
                            <QuestPath
                                prerequisites={prerequisites}
                                goal={roadmapGoal || currentTopic}
                            />
                        </div>

                        {/* Skill Tree (Learning Areas) */}
                        <SkillTree
                            learningAreas={learningAreas}
                            goal={roadmapGoal || currentTopic}
                        />
                    </motion.div>
                )}
            </div>
        </div>
    );
}


