"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hexagon, ChevronRight, CheckCircle2, Lock, Zap, BookOpen, Star, Code2, Lightbulb, ArrowRight, X, Target } from "lucide-react";
import { type LearningArea, type Topic, useUserStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { MissionPlayer } from "./MissionPlayer";

interface SkillTreeProps {
    learningAreas: LearningArea[];
    goal: string;
}

export function SkillTree({ learningAreas, goal }: SkillTreeProps) {
    const [selectedAreaId, setSelectedAreaId] = useState<string>(learningAreas[0]?.id || "");
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const [startedTopics, setStartedTopics] = useState<Set<string>>(new Set());
    const [activeMission, setActiveMission] = useState<{ topic: Topic, subtopicIndex: number } | null>(null);

    const toggleMissionStart = (topicId: string) => {
        const newStarted = new Set(startedTopics);
        if (newStarted.has(topicId)) {
            newStarted.delete(topicId);
        } else {
            newStarted.add(topicId);
        }
        setStartedTopics(newStarted);
    };

    if (!learningAreas || learningAreas.length === 0) return null;

    const currentArea = learningAreas.find(a => a.id === selectedAreaId) || learningAreas[0];

    return (
        <div className="mb-20 relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                    <Hexagon className="w-8 h-8 text-blue-500 fill-blue-500/20" />
                    Skill Tree
                </h2>
            </div>

            {/* Level Selector (Horizontal Scroll) */}
            <div className="mb-12 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-transparent">
                <div className="flex items-center gap-4 min-w-max px-2">
                    {learningAreas.map((area, index) => {
                        const isSelected = area.id === selectedAreaId;
                        const isLocked = index > 0 && false; // TODO: Implement real locking logic based on progress

                        return (
                            <button
                                key={area.id}
                                onClick={() => !isLocked && setSelectedAreaId(area.id)}
                                className={cn(
                                    "relative group flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 min-w-[160px]",
                                    isSelected
                                        ? "bg-blue-900/20 border border-blue-500 shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]"
                                        : "bg-slate-900/50 border border-slate-800 hover:bg-slate-800",
                                    isLocked && "opacity-50 cursor-not-allowed grayscale"
                                )}
                            >
                                <div className="relative w-12 h-12 flex items-center justify-center">
                                    <Hexagon className={cn(
                                        "absolute inset-0 w-full h-full stroke-[1.5] transition-colors",
                                        isSelected ? "text-blue-500 fill-blue-500/20" : "text-slate-600 fill-slate-900"
                                    )} />
                                    {isLocked ? (
                                        <Lock className="w-5 h-5 text-slate-500" />
                                    ) : (
                                        <span className={cn(
                                            "relative font-bold text-lg",
                                            isSelected ? "text-blue-400" : "text-slate-500"
                                        )}>{index + 1}</span>
                                    )}
                                </div>
                                <div className="text-center">
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block mb-1">
                                        Level {index + 1}
                                    </span>
                                    <span className={cn(
                                        "text-sm font-bold block max-w-[140px] truncate",
                                        isSelected ? "text-white" : "text-slate-400"
                                    )}>
                                        {area.name}
                                    </span>
                                </div>

                                {isSelected && (
                                    <motion.div
                                        layoutId="active-level-indicator"
                                        className="absolute -bottom-5 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left: Topic Timeline (The Path) */}
                <div className="lg:col-span-5 relative">
                    <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-slate-800" />

                    <div className="space-y-8 relative">
                        {currentArea.topics.map((topic, index) => {
                            const isStarted = startedTopics.has(topic.id);
                            const isActive = selectedTopic?.id === topic.id;

                            return (
                                <motion.div
                                    key={topic.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative pl-20"
                                >
                                    {/* Connector Node */}
                                    <div className={cn(
                                        "absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-4 transition-all duration-300 z-10",
                                        isActive ? "bg-slate-950 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)] scale-125" :
                                            isStarted ? "bg-green-500 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-slate-900 border-slate-700"
                                    )} />

                                    <button
                                        onClick={() => setSelectedTopic(topic)}
                                        className={cn(
                                            "w-full text-left p-5 rounded-2xl border transition-all duration-300 group hover:translate-x-2 relative overflow-hidden",
                                            isActive
                                                ? "bg-blue-900/10 border-blue-500/50 shadow-lg shadow-blue-900/20"
                                                : isStarted
                                                    ? "bg-green-900/5 border-green-500/30 hover:border-green-500/50"
                                                    : "bg-slate-900/50 border-slate-800 hover:border-slate-600"
                                        )}
                                    >
                                        {isStarted && (
                                            <div className="absolute top-0 right-0 p-2">
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    IN PROGRESS
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-start mb-2">
                                            <span className={cn(
                                                "text-xs font-bold uppercase tracking-wider",
                                                isActive ? "text-blue-400" : "text-slate-500"
                                            )}>
                                                Mission {index + 1}
                                            </span>
                                            {topic.estimatedTime && (
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400">
                                                    {topic.estimatedTime}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className={cn(
                                            "text-lg font-bold mb-1 transition-colors",
                                            isActive ? "text-white" : "text-slate-300 group-hover:text-white"
                                        )}>
                                            {topic.name}
                                        </h3>
                                        <p className="text-sm text-slate-500 line-clamp-2">
                                            {topic.description}
                                        </p>
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Mission Briefing (Details) */}
                <div className="lg:col-span-7">
                    <AnimatePresence mode="wait">
                        {selectedTopic ? (
                            <motion.div
                                key={selectedTopic.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="sticky top-8 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl shadow-black/50"
                            >
                                {/* Header Image/Gradient */}
                                <div className="h-40 bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-30" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                                    {/* Animated Particles/Orbs */}
                                    <motion.div
                                        animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 5, repeat: Infinity }}
                                        className="absolute top-10 right-20 w-32 h-32 bg-purple-400/30 rounded-full blur-3xl"
                                    />

                                    <button
                                        onClick={() => setSelectedTopic(null)}
                                        className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors backdrop-blur-sm z-10"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="p-8 -mt-16 relative z-10">
                                    <div className="flex items-end justify-between mb-6">
                                        <div className="w-20 h-20 rounded-2xl bg-slate-950 border-4 border-slate-800 flex items-center justify-center shadow-xl">
                                            <Zap className="w-10 h-10 text-yellow-400" />
                                        </div>
                                        {startedTopics.has(selectedTopic.id) && (
                                            <div className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-bold text-sm flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                MISSION ACTIVE
                                            </div>
                                        )}
                                    </div>

                                    <h2 className="text-4xl font-black text-white mb-4 tracking-tight">{selectedTopic.name}</h2>
                                    <p className="text-slate-300 text-lg leading-relaxed mb-8 border-l-4 border-blue-500 pl-4">
                                        {selectedTopic.description}
                                    </p>

                                    {/* Strategic Value Box */}
                                    <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
                                        <h4 className="flex items-center gap-2 text-blue-400 font-bold uppercase text-xs tracking-wider mb-3 relative z-10">
                                            <Lightbulb className="w-4 h-4" />
                                            Strategic Value
                                        </h4>
                                        <p className="text-blue-100/90 italic text-lg relative z-10">
                                            "{selectedTopic.why || "Loading strategic insights..."}"
                                        </p>
                                    </div>

                                    {/* Mission Objectives (Subtopics) */}
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                <Target className="w-4 h-4" />
                                                Mission Objectives
                                            </h4>
                                            <span className="text-xs text-slate-500 font-mono">
                                                {selectedTopic.subtopics.length} OBJECTIVES
                                            </span>
                                        </div>

                                        <div className="grid gap-3">
                                            {selectedTopic.subtopics.map((sub, i) => (
                                                <MissionObjective
                                                    key={i}
                                                    sub={sub}
                                                    index={i}
                                                    topic={selectedTopic}
                                                    onPlay={() => setActiveMission({ topic: selectedTopic, subtopicIndex: i })}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Footer */}
                                    <div className="mt-8 pt-8 border-t border-slate-800 flex justify-between items-center">
                                        <div className="text-xs text-slate-500">
                                            Estimated Time: <span className="text-slate-300 font-bold">{selectedTopic.estimatedTime || "Variable"}</span>
                                        </div>

                                        <Button
                                            onClick={() => toggleMissionStart(selectedTopic.id)}
                                            className={cn(
                                                "px-8 py-6 rounded-xl font-bold text-lg shadow-lg flex items-center gap-3 transition-all duration-300",
                                                startedTopics.has(selectedTopic.id)
                                                    ? "bg-green-600 hover:bg-green-500 text-white shadow-green-500/20"
                                                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20 hover:scale-105"
                                            )}
                                        >
                                            {startedTopics.has(selectedTopic.id) ? (
                                                <>
                                                    <CheckCircle2 className="w-5 h-5" />
                                                    Mission Active
                                                </>
                                            ) : (
                                                <>
                                                    Start Mission
                                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/20 text-slate-500 min-h-[400px]">
                                <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center mb-6 shadow-inner">
                                    <ArrowRight className="w-10 h-10 text-slate-700 animate-pulse" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-400 mb-2">Select a Mission</h3>
                                <p className="max-w-xs mx-auto text-slate-500">
                                    Choose a topic from the timeline on the left to view your classified mission briefing.
                                </p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            {/* Mission Player Overlay */}
            <AnimatePresence>
                {activeMission && (
                    <MissionPlayer
                        topic={activeMission.topic}
                        initialSubtopicIndex={activeMission.subtopicIndex}
                        onClose={() => setActiveMission(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function MissionObjective({ sub, index, topic, onPlay }: { sub: any, index: number, topic: Topic, onPlay: () => void }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { completedSubtopics } = useUserStore();
    const isCompleted = completedSubtopics.includes(sub.id);

    return (
        <motion.div
            layout
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onPlay}
            className={cn(
                "group rounded-xl border transition-all duration-300 overflow-hidden cursor-pointer relative",
                isCompleted
                    ? "bg-green-950/20 border-green-500/30 hover:border-green-500/50"
                    : "bg-slate-900/50 border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-blue-900/20"
            )}
        >
            <div className="flex items-center gap-4 p-4">
                <div className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border transition-colors shadow-lg",
                    isCompleted
                        ? "bg-green-500 text-white border-green-500 shadow-green-900/20"
                        : "bg-slate-800 text-slate-400 border-slate-700 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 group-hover:shadow-blue-900/30"
                )}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                </div>

                <div className="flex-1">
                    <h5 className={cn(
                        "font-bold text-base transition-colors mb-1",
                        isCompleted ? "text-green-400 line-through opacity-70" : "text-slate-200 group-hover:text-white"
                    )}>
                        {sub.name}
                    </h5>
                    <p className="text-xs text-slate-500 line-clamp-1 group-hover:text-slate-400">
                        {sub.description}
                    </p>
                </div>

                <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                    isCompleted
                        ? "bg-green-500/10 text-green-500"
                        : "bg-slate-800 text-slate-500 group-hover:bg-blue-600 group-hover:text-white"
                )}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </div>
            </div>
        </motion.div>
    );
}

