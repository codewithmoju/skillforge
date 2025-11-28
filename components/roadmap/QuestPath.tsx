"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Lock, ArrowRight, MapPin, Flag, Zap, Clock, BookOpen, ChevronRight } from "lucide-react";
import type { Prerequisite } from "@/lib/store";
import { cn } from "@/lib/utils";

interface QuestPathProps {
    prerequisites: Prerequisite[];
    goal: string;
}

export function QuestPath({ prerequisites, goal }: QuestPathProps) {
    if (!prerequisites || prerequisites.length === 0) return null;

    return (
        <div className="mb-16 relative group/container">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <MapPin className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Quest Path</h2>
                        <p className="text-xs text-slate-400 font-medium">Strategic Sequence Required</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/10 text-[10px] font-bold text-blue-300 uppercase tracking-widest">
                    <Zap className="w-3 h-3" />
                    <span>Sync Active</span>
                </div>
            </div>

            {/* Horizontal Scroll Container - Hidden Scrollbar */}
            <div className="relative w-full">
                {/* Fade Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-950 to-transparent z-20 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-950 to-transparent z-20 pointer-events-none" />

                <div className="overflow-x-auto scrollbar-hide pb-12 pt-8 -mx-4 px-4">
                    <div className="flex items-center gap-4 min-w-max px-8">

                        {/* START NODE */}
                        <div className="relative z-10 flex flex-col items-center gap-4 group/start">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="relative"
                            >
                                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
                                <div className="w-20 h-20 rounded-full bg-slate-900 border-2 border-emerald-500/30 flex items-center justify-center shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] group-hover/start:scale-110 group-hover/start:border-emerald-500 transition-all duration-500 z-10 relative">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-900/50 to-slate-900 flex items-center justify-center border border-emerald-500/20">
                                        <Flag className="w-8 h-8 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                                    </div>
                                </div>
                                {/* Orbiting Dot */}
                                <div className="absolute inset-0 animate-spin-slow">
                                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,1)]" />
                                </div>
                            </motion.div>
                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Start</span>
                        </div>

                        {/* PREREQUISITES LOOP */}
                        {prerequisites.map((prereq, index) => (
                            <div key={index} className="flex items-center gap-4">

                                {/* Connection Pipe */}
                                <div className="w-12 h-2 bg-slate-800/50 rounded-full relative overflow-hidden backdrop-blur-sm border border-white/5">
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent w-1/2"
                                        animate={{ x: ["-100%", "200%"] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: index * 0.2 }}
                                    />
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group relative"
                                >
                                    {/* Card Container */}
                                    <div className="relative w-72 h-40 perspective-1000">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl transform rotate-3 scale-95 opacity-0 group-hover:opacity-100 group-hover:rotate-6 transition-all duration-500 blur-md" />

                                        <div className="relative h-full p-5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between group-hover:-translate-y-2 group-hover:shadow-[0_10px_30px_-10px_rgba(59,130,246,0.3)]">

                                            {/* Header */}
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800 border border-white/10 text-blue-400 font-bold font-mono shadow-inner">
                                                        {index + 1}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Step</span>
                                                        <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Required</span>
                                                    </div>
                                                </div>
                                                {prereq.estimatedTime && (
                                                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 bg-slate-950/50 px-2 py-1 rounded-full border border-white/5">
                                                        <Clock className="w-3 h-3 text-blue-400" />
                                                        {prereq.estimatedTime}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div>
                                                <h3 className="font-bold text-white text-lg leading-tight group-hover:text-blue-300 transition-colors line-clamp-1 mb-1">
                                                    {prereq.name}
                                                </h3>
                                                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                                    {prereq.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        ))}

                        {/* FINAL GOAL NODE */}
                        <div className="flex items-center gap-4">
                            {/* Final Connection */}
                            <div className="w-12 h-2 bg-slate-800/50 rounded-full relative overflow-hidden backdrop-blur-sm border border-white/5">
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-yellow-500"
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "0%" }}
                                    transition={{ delay: prerequisites.length * 0.2, duration: 1 }}
                                />
                            </div>

                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: prerequisites.length * 0.2 + 0.3 }}
                                className="relative group/goal"
                            >
                                <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full animate-pulse" />
                                <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-yellow-500 to-orange-600 p-0.5 shadow-[0_0_50px_-10px_rgba(234,179,8,0.5)] group-hover/goal:scale-105 transition-transform duration-500">
                                    <div className="w-full h-full bg-slate-950 rounded-[22px] flex flex-col items-center justify-center p-3 text-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-30" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 to-transparent" />

                                        <TrophyIcon className="w-10 h-10 text-yellow-400 mb-2 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)] relative z-10 transform group-hover/goal:rotate-12 transition-transform duration-500" />
                                        <span className="text-[10px] font-bold text-yellow-500/80 uppercase tracking-widest mb-0.5 relative z-10">Target</span>
                                        <span className="text-xs font-bold text-white line-clamp-1 w-full relative z-10">{goal}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

function TrophyIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
        >
            <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.312-3.125 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.343v.256zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 01-2.863 3.207 6.72 6.72 0 00.857-3.294z" clipRule="evenodd" />
        </svg>
    )
}
