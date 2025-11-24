"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hexagon, ChevronRight, CheckCircle2, Lock, Zap, BookOpen, Star, Code2, Lightbulb, ArrowRight, X, Target, Cpu, Radio, Activity, Clock } from "lucide-react";
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
            {/* COMMAND CENTER HEADER */}
            <div className="flex items-center justify-between mb-10 relative">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse" />
                        <div className="relative w-14 h-14 rounded-xl bg-slate-900 border-2 border-cyan-500/50 flex items-center justify-center shadow-[0_0_30px_-5px_rgba(6,182,212,0.4)]">
                            <Cpu className="w-7 h-7 text-cyan-400" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                            Neural Command Center
                        </h2>
                        <p className="text-xs text-cyan-400/60 font-mono uppercase tracking-widest">Strategic Learning Matrix</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                    <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-widest">System Online</span>
                </div>
            </div>

            {/* HOLOGRAPHIC SECTOR SELECTOR */}
            <div className="mb-12 overflow-x-auto pb-6 scrollbar-hide">
                <div className="flex items-center gap-4 min-w-max px-2">
                    {learningAreas.map((area, index) => {
                        const isSelected = area.id === selectedAreaId;
                        const isLocked = index > 0 && false;

                        return (
                            <button
                                key={area.id}
                                onClick={() => !isLocked && setSelectedAreaId(area.id)}
                                className={cn(
                                    "relative group flex flex-col items-center gap-3 p-5 rounded-xl transition-all duration-500 min-w-[180px]",
                                    isSelected
                                        ? "bg-cyan-500/10 border-2 border-cyan-500/50"
                                        : "bg-slate-900/50 border-2 border-slate-800/50 hover:bg-slate-900",
                                    isLocked && "opacity-50 cursor-not-allowed grayscale"
                                )}
                            >
                                {/* Holographic Projection Effect */}
                                {isSelected && (
                                    <motion.div
                                        layoutId="hologram-projection"
                                        className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 to-transparent rounded-xl"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}

                                <div className="relative z-10 w-16 h-16 flex items-center justify-center">
                                    {/* Animated Hexagon Background */}
                                    <motion.div
                                        animate={{
                                            rotate: isSelected ? 360 : 0,
                                            scale: isSelected ? [1, 1.1, 1] : 1
                                        }}
                                        transition={{
                                            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                                            scale: { duration: 2, repeat: Infinity }
                                        }}
                                        className="absolute inset-0"
                                    >
                                        <Hexagon className={cn(
                                            "w-full h-full stroke-[1.5] transition-colors",
                                            isSelected ? "text-cyan-500 fill-cyan-500/10" : "text-slate-700 fill-slate-900/50"
                                        )} />
                                    </motion.div>

                                    {isLocked ? (
                                        <Lock className="relative z-10 w-6 h-6 text-slate-500" />
                                    ) : (
                                        <span className={cn(
                                            "relative z-10 font-black text-2xl font-mono",
                                            isSelected ? "text-cyan-400" : "text-slate-500"
                                        )}>{index + 1}</span>
                                    )}
                                </div>

                                <div className="text-center relative z-10">
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block mb-1 font-mono">
                                        Sector {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <span className={cn(
                                        "text-sm font-bold block max-w-[160px] truncate",
                                        isSelected ? "text-white" : "text-slate-400"
                                    )}>
                                        {area.name}
                                    </span>
                                </div>

                                {/* Light Beam Projection */}
                                {isSelected && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "24px", opacity: 1 }}
                                        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-cyan-500 to-transparent"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* MAIN GRID LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* NEURAL NETWORK TIMELINE */}
                <div className="lg:col-span-5 relative">
                    {/* Glowing Data Stream */}
                    <div className="absolute left-8 top-8 bottom-8 w-1 bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent">
                        <motion.div
                            animate={{ y: ["-100%", "100%"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="w-full h-20 bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-50"
                        />
                    </div>

                    <div className="space-y-8 relative">
                        {currentArea.topics.map((topic, index) => {
                            const isStarted = startedTopics.has(topic.id);
                            const isActive = selectedTopic?.id === topic.id;

                            return (
                                <motion.div
                                    key={topic.id}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative pl-20"
                                >
                                    {/* Energy Node */}
                                    <motion.div
                                        animate={{
                                            scale: isActive ? [1, 1.2, 1] : 1,
                                            opacity: isActive ? [1, 0.8, 1] : 1
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className={cn(
                                            "absolute left-5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full z-10 flex items-center justify-center",
                                            isActive ? "bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.8)]" :
                                                isStarted ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]" : "bg-slate-800 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-3 h-3 rounded-full",
                                            isActive ? "bg-white" : isStarted ? "bg-white" : "bg-slate-600"
                                        )} />
                                    </motion.div>

                                    {/* Mission Data File Card */}
                                    <button
                                        onClick={() => setSelectedTopic(topic)}
                                        className={cn(
                                            "w-full text-left p-5 rounded-xl border-2 transition-all duration-300 group hover:translate-x-3 relative overflow-hidden backdrop-blur-sm",
                                            isActive
                                                ? "bg-cyan-900/20 border-cyan-500/50 shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)]"
                                                : isStarted
                                                    ? "bg-emerald-900/10 border-emerald-500/30 hover:border-emerald-500/50"
                                                    : "bg-slate-900/60 border-slate-800 hover:border-cyan-500/30"
                                        )}
                                    >
                                        {/* Scan Line Effect */}
                                        <motion.div
                                            animate={{ x: ["-100%", "200%"] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: index * 0.5 }}
                                            className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent pointer-events-none"
                                        />

                                        {isStarted && (
                                            <div className="absolute top-3 right-3">
                                                <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/30 font-mono">
                                                    <Activity className="w-3 h-3" />
                                                    ACTIVE
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-start mb-2 relative z-10">
                                            <span className={cn(
                                                "text-[10px] font-black uppercase tracking-wider font-mono",
                                                isActive ? "text-cyan-400" : "text-slate-500"
                                            )}>
                                                Mission {String(index + 1).padStart(2, '0')}
                                            </span>
                                            {topic.estimatedTime && (
                                                <span className="text-[10px] px-2 py-1 rounded-md bg-slate-950/80 border border-slate-700 text-slate-400 font-mono">
                                                    {topic.estimatedTime}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className={cn(
                                            "text-lg font-bold mb-1 transition-colors relative z-10",
                                            isActive ? "text-white" : "text-slate-300 group-hover:text-white"
                                        )}>
                                            {topic.name}
                                        </h3>
                                        <p className="text-sm text-slate-500 line-clamp-2 relative z-10">
                                            {topic.description}
                                        </p>
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* CLASSIFIED MISSION BRIEFING - ENHANCED */}
                <div className="lg:col-span-7">
                    <AnimatePresence mode="wait">
                        {selectedTopic ? (
                            <motion.div
                                key={selectedTopic.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="sticky top-8 bg-slate-950 border-2 border-cyan-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_-10px_rgba(6,182,212,0.3)] relative"
                            >
                                {/* Outer Glow Effect */}
                                <div className="absolute -inset-0.5 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-60" />

                                {/* Main Container */}
                                <div className="relative bg-slate-950">
                                    {/* CIRCUIT BOARD HEADER */}
                                    <div className="h-56 bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-800 relative overflow-hidden">
                                        {/* Circuit Board Pattern */}
                                        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                                            <defs>
                                                <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                                                    <path d="M10 10h20v20h-20z M40 10h20v20h-20z M10 40h20v20h-20z M40 40h20v20h-20z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
                                                    <circle cx="30" cy="30" r="2" fill="currentColor" className="text-cyan-400" />
                                                    <circle cx="70" cy="30" r="2" fill="currentColor" className="text-cyan-400" />
                                                    <circle cx="30" cy="70" r="2" fill="currentColor" className="text-cyan-400" />
                                                </pattern>
                                            </defs>
                                            <rect width="100%" height="100%" fill="url(#circuit)" />
                                        </svg>

                                        {/* Data Stream Lines */}
                                        {[...Array(5)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="absolute h-px w-full bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
                                                style={{ top: `${20 + i * 15}%` }}
                                                animate={{ x: ["-100%", "200%"] }}
                                                transition={{
                                                    duration: 3 + i,
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                    delay: i * 0.5
                                                }}
                                            />
                                        ))}

                                        {/* Animated Energy Orbs */}
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [0.3, 0.6, 0.3],
                                                x: [0, 20, 0],
                                                y: [0, -10, 0]
                                            }}
                                            transition={{ duration: 6, repeat: Infinity }}
                                            className="absolute top-10 right-16 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl"
                                        />
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.3, 1],
                                                opacity: [0.4, 0.7, 0.4],
                                                x: [0, -15, 0],
                                                y: [0, 10, 0]
                                            }}
                                            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                                            className="absolute bottom-10 left-16 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"
                                        />

                                        {/* Holographic Scan Effect */}
                                        <motion.div
                                            animate={{ y: ["0%", "100%"] }}
                                            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                                            className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-white/10 to-transparent"
                                        />

                                        {/* TOP SECRET Badge - Enhanced */}
                                        <div className="absolute top-6 left-6 group">
                                            <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-lg animate-pulse" />
                                            <div className="relative px-4 py-2 rounded-lg bg-black/40 backdrop-blur-md border-2 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                                                <div className="flex items-center gap-2">
                                                    <motion.div
                                                        animate={{ rotate: [0, 5, -5, 0] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    >
                                                        <Lock className="w-4 h-4 text-red-400" />
                                                    </motion.div>
                                                    <span className="text-xs font-black text-red-400 uppercase tracking-[0.2em]">Classified</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Close Button - Enhanced */}
                                        <button
                                            onClick={() => setSelectedTopic(null)}
                                            className="absolute top-6 right-6 p-2.5 rounded-lg bg-black/40 hover:bg-black/60 text-white transition-all backdrop-blur-md border-2 border-white/20 hover:border-cyan-500/50 z-20 group hover:scale-110"
                                        >
                                            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                        </button>

                                        {/* Mission Type Indicator */}
                                        <div className="absolute bottom-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 backdrop-blur-md border border-cyan-500/30">
                                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider">Live Mission Brief</span>
                                        </div>
                                    </div>

                                    {/* MISSION CONTENT */}
                                    <div className="p-8 -mt-24 relative z-10">
                                        {/* Mission Icon & Status */}
                                        <div className="flex items-end justify-between mb-8">
                                            <motion.div
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                                className="relative group"
                                            >
                                                <div className="absolute inset-0 bg-cyan-500/30 blur-2xl rounded-2xl animate-pulse" />
                                                <div className="relative w-28 h-28 rounded-2xl bg-slate-950 border-4 border-cyan-500/50 flex items-center justify-center shadow-[0_0_40px_-5px_rgba(6,182,212,0.6)] group-hover:border-cyan-500 transition-all">
                                                    <Zap className="w-14 h-14 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                                                </div>
                                                {/* Orbiting Dots */}
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                                    className="absolute inset-0"
                                                >
                                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,1)]" />
                                                </motion.div>
                                            </motion.div>
                                            {startedTopics.has(selectedTopic.id) && (
                                                <motion.div
                                                    initial={{ scale: 0, x: 20 }}
                                                    animate={{ scale: 1, x: 0 }}
                                                    className="px-6 py-3 rounded-xl bg-emerald-500/10 border-2 border-emerald-500/40 text-emerald-400 font-black flex items-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                                >
                                                    <motion.div
                                                        animate={{ scale: [1, 1.2, 1] }}
                                                        transition={{ duration: 1, repeat: Infinity }}
                                                        className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)]"
                                                    />
                                                    <span className="text-sm uppercase tracking-wider font-mono">Mission Active</span>
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* Mission Title & Description */}
                                        <div className="mb-8">
                                            <motion.h2
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white mb-4 tracking-tight drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]"
                                            >
                                                {selectedTopic.name}
                                            </motion.h2>
                                            <motion.div
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.1 }}
                                                className="text-slate-300 text-lg leading-relaxed border-l-4 border-cyan-500 pl-6 italic relative"
                                            >
                                                <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-cyan-500 via-blue-500 to-transparent" />
                                                {selectedTopic.description}
                                            </motion.div>
                                        </div>

                                        {/* STRATEGIC INTEL - Enhanced */}
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="mb-8 relative group"
                                        >
                                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity" />
                                            <div className="relative p-6 rounded-2xl bg-gradient-to-br from-cyan-900/20 via-blue-900/20 to-purple-900/20 border-2 border-cyan-500/30 overflow-hidden backdrop-blur-sm">
                                                {/* Animated Background Pattern */}
                                                <motion.div
                                                    animate={{
                                                        opacity: [0.2, 0.4, 0.2],
                                                        scale: [1, 1.05, 1]
                                                    }}
                                                    transition={{ duration: 4, repeat: Infinity }}
                                                    className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl"
                                                />

                                                <div className="relative z-10">
                                                    <h4 className="flex items-center gap-2 text-cyan-400 font-black uppercase text-xs tracking-[0.2em] mb-4 font-mono">
                                                        <div className="p-1.5 rounded-md bg-cyan-500/20 border border-cyan-500/30">
                                                            <Lightbulb className="w-4 h-4" />
                                                        </div>
                                                        Strategic Intel
                                                    </h4>
                                                    <p className="text-cyan-50/95 text-lg leading-relaxed font-medium">
                                                        <span className="text-cyan-400 font-black">"</span>
                                                        {selectedTopic.why || "Analyzing strategic value..."}
                                                        <span className="text-cyan-400 font-black">"</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* MISSION OBJECTIVES - Enhanced */}
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                            className="space-y-6"
                                        >
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-black text-slate-400 uppercase tracking-wider flex items-center gap-3 font-mono">
                                                    <div className="p-1.5 rounded-md bg-slate-800 border border-slate-700">
                                                        <Target className="w-4 h-4 text-cyan-400" />
                                                    </div>
                                                    Mission Objectives
                                                </h4>
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border-2 border-slate-800">
                                                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Targets</span>
                                                    <span className="text-sm text-cyan-400 font-black font-mono">{selectedTopic.subtopics.length}</span>
                                                </div>
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
                                        </motion.div>

                                        {/* ACTION FOOTER - Enhanced */}
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.4 }}
                                            className="mt-8 pt-8 border-t-2 border-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-slate-500" />
                                                <span className="text-xs text-slate-500 font-mono uppercase tracking-wider">Est. Duration:</span>
                                                <span className="text-sm text-cyan-400 font-black font-mono">{selectedTopic.estimatedTime || "Variable"}</span>
                                            </div>

                                            <Button
                                                onClick={() => toggleMissionStart(selectedTopic.id)}
                                                className={cn(
                                                    "group relative px-10 py-6 rounded-xl font-black text-lg shadow-lg flex items-center gap-3 transition-all duration-300 uppercase tracking-wider overflow-hidden",
                                                    startedTopics.has(selectedTopic.id)
                                                        ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.4)] border-2 border-emerald-500/50"
                                                        : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-105 border-2 border-cyan-500/50"
                                                )}
                                            >
                                                <span className="relative z-10 flex items-center gap-3">
                                                    {startedTopics.has(selectedTopic.id) ? (
                                                        <>
                                                            <CheckCircle2 className="w-6 h-6" />
                                                            Mission Active
                                                        </>
                                                    ) : (
                                                        <>
                                                            Engage Mission
                                                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                                        </>
                                                    )}
                                                </span>
                                                {!startedTopics.has(selectedTopic.id) && (
                                                    <motion.div
                                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                                        animate={{ x: ["-100%", "200%"] }}
                                                        transition={{ duration: 1.5, repeat: Infinity }}
                                                    />
                                                )}
                                            </Button>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/20 text-slate-500 min-h-[500px]">
                                <div className="relative mb-8">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        className="w-32 h-32 rounded-full border-4 border-slate-800 border-t-cyan-500"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <ArrowRight className="w-12 h-12 text-slate-700" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-400 mb-3 uppercase tracking-wide">Awaiting Selection</h3>
                                <p className="max-w-sm mx-auto text-slate-500 font-mono text-sm">
                                    Select a mission from the neural timeline to access classified briefing data.
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
    const { completedSubtopics } = useUserStore();
    const isCompleted = completedSubtopics.includes(sub.id);

    return (
        <motion.div
            layout
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onPlay}
            className={cn(
                "group rounded-xl border-2 transition-all duration-300 overflow-hidden cursor-pointer relative backdrop-blur-sm",
                isCompleted
                    ? "bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50"
                    : "bg-slate-900/50 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/80 hover:shadow-[0_0_20px_-5px_rgba(6,182,212,0.3)]"
            )}
        >
            {/* Flash Effect on Hover */}
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileHover={{ opacity: [0, 0.5, 0], scale: [0, 1.5, 2] }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-cyan-500/20 pointer-events-none"
            />

            <div className="flex items-center gap-4 p-4 relative z-10">
                <div className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold border-2 transition-all duration-300 shadow-lg font-mono text-lg",
                    isCompleted
                        ? "bg-emerald-500 text-white border-emerald-400 shadow-emerald-900/30"
                        : "bg-slate-800 text-slate-400 border-slate-700 group-hover:bg-cyan-600 group-hover:text-white group-hover:border-cyan-500 group-hover:shadow-cyan-900/50"
                )}>
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : String(index + 1).padStart(2, '0')}
                </div>

                <div className="flex-1">
                    <h5 className={cn(
                        "font-bold text-base transition-colors mb-1",
                        isCompleted ? "text-emerald-400 line-through opacity-70" : "text-slate-200 group-hover:text-white"
                    )}>
                        {sub.name}
                    </h5>
                    <p className="text-xs text-slate-500 line-clamp-1 group-hover:text-slate-400 font-mono">
                        {sub.description}
                    </p>
                </div>

                <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                    isCompleted
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-slate-800 text-slate-500 group-hover:bg-cyan-600 group-hover:text-white"
                )}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                </div>
            </div>
        </motion.div>
    );
}
