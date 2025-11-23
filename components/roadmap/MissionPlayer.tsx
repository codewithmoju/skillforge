"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, CheckCircle2, Trophy, Star, ArrowRight, Sparkles, Zap, Target } from "lucide-react";
import { Topic, Subtopic, useUserStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import confetti from "canvas-confetti";

interface MissionPlayerProps {
    topic: Topic;
    initialSubtopicIndex: number;
    onClose: () => void;
}

// Unique gradients for each key point slide
const GRADIENTS = [
    "from-blue-600 to-purple-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-red-600",
    "from-pink-500 to-rose-600",
    "from-cyan-500 to-blue-600",
    "from-violet-600 to-fuchsia-600",
    "from-amber-500 to-orange-600",
    "from-lime-500 to-green-600",
];

export function MissionPlayer({ topic, initialSubtopicIndex, onClose }: MissionPlayerProps) {
    const [currentSubtopicIndex, setCurrentSubtopicIndex] = useState(initialSubtopicIndex);
    const [currentPointIndex, setCurrentPointIndex] = useState(-1); // -1 = Intro, 0...n = Key Points, n+1 = Complete
    const { completedSubtopics, toggleSubtopicCompletion } = useUserStore();

    // Ensure we have valid data
    const subtopics = topic.subtopics || [];
    const currentSubtopic = subtopics[currentSubtopicIndex];
    const keyPoints = currentSubtopic?.keyPoints || [];

    const isCurrentCompleted = currentSubtopic && completedSubtopics.includes(currentSubtopic.id);

    useEffect(() => {
        // Reset point index when subtopic changes
        setCurrentPointIndex(-1);
    }, [currentSubtopicIndex]);

    useEffect(() => {
        // Lock body scroll when player is open
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    const handleNext = () => {
        if (currentPointIndex < keyPoints.length) {
            // Move to next point (or completion screen)
            setCurrentPointIndex(prev => prev + 1);
        } else if (currentSubtopicIndex < subtopics.length - 1) {
            // Move to next subtopic
            setCurrentSubtopicIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentPointIndex > -1) {
            // Move to prev point (or intro)
            setCurrentPointIndex(prev => prev - 1);
        } else if (currentSubtopicIndex > 0) {
            // Move to prev subtopic (last point)
            const prevSubtopic = subtopics[currentSubtopicIndex - 1];
            setCurrentSubtopicIndex(prev => prev - 1);
            // Set to last point of previous subtopic
            setCurrentPointIndex(prevSubtopic.keyPoints ? prevSubtopic.keyPoints.length : 0);
        }
    };

    const handleComplete = () => {
        if (currentSubtopic) {
            if (!isCurrentCompleted) {
                // Trigger confetti
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.6 },
                    colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b']
                });
            }
            toggleSubtopicCompletion(currentSubtopic.id);

            // Auto advance if not last subtopic
            if (currentSubtopicIndex < subtopics.length - 1) {
                setTimeout(() => {
                    handleNext();
                }, 1500);
            } else {
                // Close if it's the very last thing? Or show a grand summary?
                // For now, let user close manually or we can close
                // onClose();
            }
        }
    };

    if (!currentSubtopic) return null;

    // Determine current view content
    const isIntro = currentPointIndex === -1;
    const isCompletion = currentPointIndex === keyPoints.length;
    const isKeyPoint = !isIntro && !isCompletion;

    // Get gradient for current point
    const currentGradient = isKeyPoint
        ? GRADIENTS[currentPointIndex % GRADIENTS.length]
        : "from-slate-800 to-slate-900";

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950 flex flex-col"
        >
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className={cn(
                    "absolute inset-0 transition-colors duration-700 opacity-20 bg-gradient-to-br",
                    currentGradient
                )} />
            </div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-6 border-b border-slate-800/50 bg-slate-950/30 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white hover:bg-white/10">
                        <X className="w-6 h-6" />
                    </Button>
                    <div>
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Mission: {topic.name}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            {subtopics.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "h-1.5 w-8 rounded-full transition-colors duration-300",
                                        idx === currentSubtopicIndex ? "bg-white" :
                                            idx < currentSubtopicIndex ? "bg-blue-500" : "bg-slate-800"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Objective</div>
                        <div className="text-lg font-black text-white leading-none">
                            {currentSubtopicIndex + 1} <span className="text-slate-600 text-sm">/ {subtopics.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 relative z-10 flex items-center justify-center p-4 md:p-8">
                <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">

                    {/* Left Navigation */}
                    <div className="hidden lg:flex lg:col-span-1 justify-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handlePrev}
                            disabled={currentSubtopicIndex === 0 && currentPointIndex === -1}
                            className="h-16 w-16 rounded-full border border-white/10 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110"
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </Button>
                    </div>

                    {/* Center Content Card */}
                    <div className="lg:col-span-10 h-full flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${currentSubtopic.id}-${currentPointIndex}`}
                                initial={{ opacity: 0, x: 100, rotateY: -10 }}
                                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                                exit={{ opacity: 0, x: -100, rotateY: 10 }}
                                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                                className="w-full max-w-3xl perspective-1000"
                            >
                                <div className={cn(
                                    "relative overflow-hidden rounded-[2.5rem] shadow-2xl border border-white/10 backdrop-blur-xl min-h-[500px] flex flex-col",
                                    isKeyPoint ? `bg-gradient-to-br ${currentGradient} shadow-[0_0_50px_rgba(0,0,0,0.5)]` : "bg-slate-900/80"
                                )}>

                                    {/* Card Content */}
                                    <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative z-10">

                                        {/* Intro View */}
                                        {isIntro && (
                                            <div className="text-center space-y-8">
                                                <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-8">
                                                    <span className="text-4xl font-black text-white">{currentSubtopicIndex + 1}</span>
                                                </div>
                                                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                                                    {currentSubtopic.name}
                                                </h1>
                                                <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                                                    {currentSubtopic.description}
                                                </p>
                                                <div className="pt-8">
                                                    <Button
                                                        size="lg"
                                                        onClick={handleNext}
                                                        className="px-10 py-7 text-xl rounded-2xl bg-white text-black hover:bg-blue-50 hover:scale-105 transition-all shadow-xl"
                                                    >
                                                        Start Learning <ArrowRight className="ml-2 w-6 h-6" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Key Point View */}
                                        {isKeyPoint && (
                                            <div className="text-center space-y-8">
                                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/20 text-white/80 text-sm font-bold uppercase tracking-wider mb-4 border border-white/10">
                                                    <Sparkles className="w-4 h-4 text-yellow-400" />
                                                    Key Intel {currentPointIndex + 1} / {keyPoints.length}
                                                </div>

                                                <h3 className="text-3xl md:text-5xl font-bold text-white leading-tight drop-shadow-lg">
                                                    "{keyPoints[currentPointIndex]}"
                                                </h3>

                                                <div className="pt-12 flex justify-center gap-4">
                                                    <div className="flex gap-2">
                                                        {keyPoints.map((_, idx) => (
                                                            <div
                                                                key={idx}
                                                                className={cn(
                                                                    "w-3 h-3 rounded-full transition-all duration-300",
                                                                    idx === currentPointIndex ? "bg-white scale-125" : "bg-white/30"
                                                                )}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Completion View */}
                                        {isCompletion && (
                                            <div className="text-center space-y-8">
                                                <div className="w-32 h-32 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-6 animate-bounce">
                                                    <Trophy className="w-16 h-16 text-green-400" />
                                                </div>

                                                <h2 className="text-4xl md:text-5xl font-black text-white">
                                                    Objective Complete!
                                                </h2>

                                                <div className="flex flex-col items-center gap-4 py-6">
                                                    <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-bold text-xl">
                                                        <Zap className="w-6 h-6 fill-yellow-400" />
                                                        +50 XP Earned
                                                    </div>
                                                </div>

                                                <div className="pt-8">
                                                    <Button
                                                        size="lg"
                                                        onClick={handleComplete}
                                                        disabled={isCurrentCompleted}
                                                        className={cn(
                                                            "px-12 py-8 text-2xl font-bold rounded-2xl transition-all duration-300 shadow-2xl hover:scale-105",
                                                            isCurrentCompleted
                                                                ? "bg-slate-800 text-slate-400 cursor-default"
                                                                : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white shadow-green-500/30"
                                                        )}
                                                    >
                                                        {isCurrentCompleted ? "Completed" : "Claim Reward"}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Decorative Elements */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right Navigation */}
                    <div className="hidden lg:flex lg:col-span-1 justify-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleNext}
                            disabled={currentSubtopicIndex === subtopics.length - 1 && isCompletion}
                            className="h-16 w-16 rounded-full border border-white/10 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110"
                        >
                            <ChevronRight className="w-8 h-8" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Footer */}
            <div className="lg:hidden p-6 border-t border-white/10 bg-black/20 backdrop-blur-md flex justify-between items-center">
                <Button
                    variant="ghost"
                    onClick={handlePrev}
                    className="text-white hover:bg-white/10"
                >
                    <ChevronLeft className="mr-2 w-4 h-4" /> Prev
                </Button>
                <div className="flex gap-1">
                    {keyPoints.map((_, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "w-1.5 h-1.5 rounded-full transition-all",
                                idx === currentPointIndex ? "bg-white" : "bg-white/30"
                            )}
                        />
                    ))}
                </div>
                <Button
                    variant="ghost"
                    onClick={handleNext}
                    className="text-white hover:bg-white/10"
                >
                    Next <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </motion.div>
    );
}
