"use client";

import { motion } from "framer-motion";
import { Trophy, Target, Zap, Activity, Rocket, Star, RotateCcw, BookOpen } from "lucide-react";
import { useSkin } from "@/lib/hooks/useSkin";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface MissionControlProps {
    topic: string;
    progress: number;
    userLevel: number;
    xp: number;
    streak: number;
    onLaunch?: () => void;
    onRegenerate?: () => void;
    onGenerateCourse?: () => void;
}

export function MissionControl({ topic, progress, userLevel, xp, streak, onLaunch, onRegenerate, onGenerateCourse }: MissionControlProps) {
    const { colors } = useSkin();

    return (
        <div className="relative w-full mb-12 p-6 rounded-3xl overflow-hidden border border-blue-500/30 bg-slate-950/80 backdrop-blur-xl shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)]">
            {/* Background Grid & Effects */}
            <div className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

            {/* Regenerate Button - Top Right */}
            {onRegenerate && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="absolute top-4 right-4 z-20"
                >
                    <Button
                        onClick={onRegenerate}
                        className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border-2 border-slate-700 hover:border-cyan-500/50 transition-all hover:scale-105 backdrop-blur-md shadow-lg"
                    >
                        <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                        <span className="text-sm font-bold hidden sm:inline">New Roadmap</span>
                    </Button>
                </motion.div>
            )}

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Mission Info */}
                <div className="flex-1 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-wider uppercase mb-4"
                    >
                        <Activity className="w-3 h-3 animate-pulse" />
                        Mission Active
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight"
                    >
                        {topic || "Unknown Mission"}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-blue-200/60 text-lg max-w-md"
                    >
                        Objective: Master the core concepts and advanced techniques to achieve total synchronization.
                    </motion.p>
                </div>

                {/* Dashboard Stats */}
                <div className="flex gap-4 md:gap-8">
                    <StatNode
                        icon={Trophy}
                        label="Level"
                        value={userLevel.toString()}
                        color="text-yellow-400"
                        delay={0.3}
                    />
                    <StatNode
                        icon={Zap}
                        label="XP Gained"
                        value={xp.toLocaleString()}
                        color="text-purple-400"
                        delay={0.4}
                    />
                    <StatNode
                        icon={Target}
                        label="Streak"
                        value={`${streak} Days`}
                        color="text-red-400"
                        delay={0.5}
                    />
                </div>

                {/* Progress Ring */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full group-hover:bg-blue-500/40 transition-all duration-500" />
                    <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-slate-800"
                        />
                        <motion.circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-blue-500"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: progress / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            strokeDasharray="1 1"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-white">{Math.round(progress)}%</span>
                        <span className="text-[10px] text-blue-300 uppercase tracking-widest">Complete</span>
                    </div>
                </div>
            </div>

            {/* Launch Button (if provided) */}
            <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                {onLaunch && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Button
                            onClick={onLaunch}
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-8 py-6 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/25 flex items-center gap-3 group w-full md:w-auto"
                        >
                            <Rocket className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                            Continue Mission
                        </Button>
                    </motion.div>
                )}

                {onGenerateCourse && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        <Button
                            onClick={onGenerateCourse}
                            className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-6 rounded-xl font-bold text-lg border border-slate-700 hover:border-emerald-500/50 flex items-center gap-3 group w-full md:w-auto transition-all"
                        >
                            <BookOpen className="w-5 h-5 group-hover:text-emerald-400 transition-colors" />
                            Generate Course
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

function StatNode({ icon: Icon, label, value, color, delay }: { icon: any, label: string, value: string, color: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay }}
            className="flex flex-col items-center p-4 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm min-w-[100px]"
        >
            <div className={cn("p-2 rounded-lg bg-slate-800/50 mb-2", color)}>
                <Icon className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold text-white">{value}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">{label}</span>
        </motion.div>
    );
}
