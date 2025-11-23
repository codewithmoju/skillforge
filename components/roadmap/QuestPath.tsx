"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Lock, ArrowRight, MapPin, Flag } from "lucide-react";
import type { Prerequisite } from "@/lib/store";
import { cn } from "@/lib/utils";

interface QuestPathProps {
    prerequisites: Prerequisite[];
    goal: string;
}

export function QuestPath({ prerequisites, goal }: QuestPathProps) {
    if (!prerequisites || prerequisites.length === 0) return null;

    return (
        <div className="mb-12 relative">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <MapPin className="text-purple-400" />
                    Quest Path
                </h2>
                <span className="text-sm text-purple-300/60 uppercase tracking-widest font-semibold">
                    Sequence Required
                </span>
            </div>

            {/* Scroll Container */}
            <div className="relative overflow-x-auto pb-8 scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
                <div className="flex items-center gap-8 min-w-max px-4">

                    {/* Start Node */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center shadow-lg shadow-black/50">
                            <Flag className="w-6 h-6 text-slate-400" />
                        </div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Start</span>
                    </div>

                    {/* Connection Line */}
                    <div className="h-1 w-16 bg-slate-800 rounded-full" />

                    {prerequisites.map((prereq, index) => (
                        <div key={index} className="flex items-center gap-8">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative"
                            >
                                {/* Connector Line (Animated) */}
                                <div className="absolute top-1/2 -left-8 w-8 h-1 bg-slate-800 -z-10">
                                    <motion.div
                                        className="h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ delay: index * 0.2, duration: 0.5 }}
                                    />
                                </div>

                                {/* Node Card */}
                                <div className="w-64 p-5 rounded-2xl bg-slate-900/80 border border-purple-500/30 backdrop-blur-sm hover:border-purple-500 hover:bg-slate-800/80 transition-all duration-300 group-hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)] hover:-translate-y-1 cursor-pointer">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold">
                                            {index + 1}
                                        </span>
                                        {prereq.estimatedTime && (
                                            <span className="text-[10px] text-slate-400 bg-slate-950/50 px-2 py-1 rounded-full border border-slate-800">
                                                {prereq.estimatedTime}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="font-bold text-white text-lg mb-1 group-hover:text-purple-300 transition-colors">
                                        {prereq.name}
                                    </h3>

                                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                                        {prereq.description}
                                    </p>

                                    <div className="flex items-center gap-2 text-[10px] text-purple-300/80 font-medium">
                                        <CheckCircle2 className="w-3 h-3" />
                                        <span>Essential Prerequisite</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    ))}

                    {/* Final Goal Node */}
                    <div className="flex items-center gap-8">
                        {/* Connector Line */}
                        <div className="h-1 w-16 bg-slate-800 rounded-full relative overflow-hidden">
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500"
                                initial={{ x: "-100%" }}
                                animate={{ x: "0%" }}
                                transition={{ delay: prerequisites.length * 0.2, duration: 0.5 }}
                            />
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: prerequisites.length * 0.2 + 0.2 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
                            <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 p-0.5 shadow-lg shadow-blue-500/30">
                                <div className="w-full h-full bg-slate-950 rounded-[14px] flex flex-col items-center justify-center p-2 text-center">
                                    <TrophyIcon className="w-8 h-8 text-yellow-400 mb-1 drop-shadow-lg" />
                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Goal</span>
                                    <span className="text-xs font-bold text-blue-300 line-clamp-1 w-full">{goal}</span>
                                </div>
                            </div>
                        </motion.div>
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
