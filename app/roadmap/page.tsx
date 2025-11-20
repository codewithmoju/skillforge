"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Lock, Star, ChevronRight, BookOpen, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useUserStore } from "@/lib/store";
import { QuizModal } from "@/components/features/QuizModal";

export default function RoadmapPage() {
    const { roadmapProgress, roadmapDefinitions, completeLesson, setRoadmap, currentTopic } = useUserStore();
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [topicInput, setTopicInput] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isQuizOpen, setIsQuizOpen] = useState(false);

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

    const handleGenerate = async () => {
        if (!topicInput.trim()) return;
        setIsGenerating(true);
        try {
            const res = await fetch("/api/generate-roadmap", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic: topicInput }),
            });
            const data = await res.json();
            if (data.roadmap) {
                setRoadmap(topicInput, data.roadmap);
                setTopicInput("");
            }
        } catch (error) {
            console.error("Failed to generate", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen pb-20">
            {/* Header / Input Section */}
            <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {currentTopic ? `Roadmap: ${currentTopic}` : "Your Learning Journey"}
                    </h1>
                    <p className="text-slate-400">Master your skills one level at a time.</p>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="What do you want to learn?"
                        value={topicInput}
                        onChange={(e) => setTopicInput(e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-accent-indigo w-full md:w-64"
                        onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                    />
                    <Button onClick={handleGenerate} disabled={isGenerating} className="shrink-0">
                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                        {isGenerating ? "Forging..." : "New Path"}
                    </Button>
                </div>
            </div>

            {roadmapDefinitions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[600px] text-center p-8 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
                    <Sparkles className="w-16 h-16 text-accent-indigo mb-6 opacity-50" />
                    <h2 className="text-2xl font-bold text-white mb-2">Start Your Adventure</h2>
                    <p className="text-slate-400 max-w-md mb-8">
                        Enter a topic above to generate a custom, gamified learning roadmap powered by AI.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8 h-full">
                    {/* Left: Roadmap Visualization */}
                    <div className="flex-1 relative min-h-[800px] bg-slate-900/30 rounded-3xl border border-slate-800/50 overflow-hidden p-8 flex justify-center">
                        {/* Background Grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                        {/* Connecting Line */}
                        <div className="absolute top-20 bottom-20 w-1 bg-slate-800 left-1/2 -translate-x-1/2">
                            <motion.div
                                className="w-full bg-gradient-to-b from-accent-indigo to-accent-cyan"
                                initial={{ height: "0%" }}
                                animate={{ height: "50%" }} // This should be dynamic based on progress
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                            />
                        </div>

                        {/* Nodes */}
                        <div className="relative z-10 flex flex-col gap-24 w-full max-w-md items-center pt-10">
                            {roadmapDefinitions.map((def, index) => {
                                const nodeState = roadmapProgress[def.id] || { status: "locked", completedLessons: 0 };

                                return (
                                    <motion.div
                                        key={def.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.2 }}
                                        className="relative w-full flex justify-center"
                                    >
                                        <button
                                            onClick={() => setSelectedNodeId(def.id)}
                                            className={cn(
                                                "relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center border-4 transition-all duration-300 hover:scale-110",
                                                nodeState.status === "completed" && "bg-slate-900 border-status-success text-status-success shadow-[0_0_20px_rgba(34,197,94,0.3)]",
                                                nodeState.status === "active" && "bg-slate-900 border-accent-cyan text-accent-cyan shadow-[0_0_30px_rgba(6,182,212,0.4)] animate-pulse-slow",
                                                nodeState.status === "locked" && "bg-slate-800 border-slate-700 text-slate-600 grayscale"
                                            )}
                                        >
                                            {nodeState.status === "completed" ? (
                                                <Check className="w-8 h-8" />
                                            ) : nodeState.status === "locked" ? (
                                                <Lock className="w-6 h-6" />
                                            ) : (
                                                <Star className="w-8 h-8 fill-current" />
                                            )}

                                            {/* Label */}
                                            <div className={cn(
                                                "absolute left-20 top-1/2 -translate-y-1/2 w-48 text-left pl-4 transition-all",
                                                selectedNodeId === def.id ? "opacity-100 translate-x-0" : "opacity-50 translate-x-[-10px]"
                                            )}>
                                                <div className="text-lg font-bold text-white">{def.title}</div>
                                                <div className="text-xs text-slate-400">Level {def.level}</div>
                                            </div>
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </div>
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
                                <Card className="border-accent-indigo/30 bg-slate-800/80">
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold uppercase tracking-wider text-accent-cyan">
                                                Current Module
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {selectedNodeProgress.completedLessons} / {selectedNodeDef.lessons} Lessons
                                            </span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-white mb-4">
                                            {selectedNodeDef.title}
                                        </h2>
                                        <p className="text-sm text-slate-400 mb-4">{selectedNodeDef.description}</p>
                                        <ProgressBar
                                            progress={
                                                (selectedNodeProgress.completedLessons / selectedNodeDef.lessons) * 100
                                            }
                                            className="h-2"
                                        />
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <h3 className="font-semibold text-white flex items-center gap-2">
                                            <BookOpen className="w-4 h-4" /> Lessons
                                        </h3>
                                        {Array.from({ length: selectedNodeDef.lessons }).map((_, i) => {
                                            const lessonNum = i + 1;
                                            const isCompleted = lessonNum <= selectedNodeProgress.completedLessons;

                                            return (
                                                <div
                                                    key={lessonNum}
                                                    onClick={() => !isCompleted && completeLesson(selectedNodeId)}
                                                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-accent-indigo/50 transition-colors cursor-pointer group"
                                                >
                                                    <div className={cn(
                                                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border",
                                                        isCompleted ? "bg-status-success/20 border-status-success text-status-success" : "border-slate-600 text-slate-500"
                                                    )}>
                                                        {isCompleted ? <Check className="w-3 h-3" /> : lessonNum}
                                                    </div>
                                                    <span className={cn(
                                                        "text-sm transition-colors",
                                                        isCompleted ? "text-slate-400 line-through" : "text-slate-200 group-hover:text-white"
                                                    )}>
                                                        Lesson {lessonNum}: {isCompleted ? "Completed" : "Start Learning"}
                                                    </span>
                                                    <ChevronRight className="w-4 h-4 text-slate-600 ml-auto group-hover:text-white" />
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <Button className="w-full" size="lg">
                                            {selectedNodeProgress.completedLessons >= selectedNodeDef.lessons ? "Module Completed" : "Continue Learning"}
                                        </Button>

                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => setIsQuizOpen(true)}
                                        >
                                            Take Quiz Challenge
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-500">
                                Select a node to view details
                            </div>
                        )}
                    </div>
                </div>
            )}

            {selectedNodeDef && (
                <QuizModal
                    isOpen={isQuizOpen}
                    onClose={() => setIsQuizOpen(false)}
                    topic={selectedNodeDef.title}
                    level={selectedNodeDef.level}
                    nodeId={selectedNodeDef.id}
                />
            )}
        </div>
    );
}
