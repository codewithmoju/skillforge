"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Brain, Sparkles, Zap, CheckCircle2, Terminal, Cpu, Network, Lock, Database, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const LOADING_LOGS = [
    "Initializing quantum core...",
    "Establishing neural handshake...",
    "Decrypting knowledge nodes...",
    "Parsing semantic structures...",
    "Synthesizing curriculum matrix...",
    "Optimizing learning pathways...",
    "Generating interactive modules...",
    "Calibrating difficulty vectors...",
    "Finalizing system integrity...",
    "Launch sequence ready."
];

export function CourseGenerationLoader() {
    const [logs, setLogs] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex < LOADING_LOGS.length) {
                setLogs(prev => [...prev, LOADING_LOGS[currentIndex]]);
                currentIndex++;
                // Auto scroll to bottom
                if (scrollRef.current) {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                }
            }
        }, 800);

        // Progress simulation
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 1; // Slower, smoother progress
            });
        }, 100);

        return () => {
            clearInterval(interval);
            clearInterval(progressInterval);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[100] bg-[#030014] flex flex-col items-center justify-center overflow-hidden">
            {/* Background Grid & Effects */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030014]/50 to-[#030014]" />
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.1),transparent_50%)] animate-pulse" />

            {/* Central Holographic Core */}
            <div className="relative mb-12 md:mb-16 scale-100 md:scale-150 transition-transform duration-700">
                {/* Outer Rings */}
                <div className="absolute inset-0 border border-cyan-500/30 rounded-full w-48 h-48 md:w-64 md:h-64 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-0 border border-violet-500/30 rounded-full w-40 h-40 md:w-56 md:h-56 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 animate-[spin_15s_linear_infinite_reverse]" />
                <div className="absolute inset-0 border border-fuchsia-500/30 rounded-full w-32 h-32 md:w-48 md:h-48 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 animate-[spin_8s_linear_infinite]" />

                {/* Core Glow */}
                <div className="absolute inset-0 w-24 h-24 md:w-32 md:h-32 bg-cyan-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 animate-pulse" />

                {/* Center Icon */}
                <div className="relative z-10 bg-black/50 backdrop-blur-md p-4 md:p-6 rounded-full border border-white/10 shadow-[0_0_50px_rgba(6,182,212,0.3)]">
                    <Brain className="w-8 h-8 md:w-12 md:h-12 text-white animate-pulse" />
                </div>
            </div>

            {/* Status Text */}
            <div className="text-center mb-8 md:mb-12 relative z-10 px-4">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
                    Constructing Reality
                </h2>
                <div className="flex items-center justify-center gap-3 text-cyan-400 font-mono text-sm md:text-base">
                    <span className="animate-pulse">AI ARCHITECT ACTIVE</span>
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                </div>
            </div>

            {/* Terminal Window */}
            <div className="w-[90%] max-w-2xl relative z-10">
                <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                    {/* Terminal Header */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/5">
                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/50" />
                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/50" />
                        <span className="ml-2 text-[10px] md:text-xs text-slate-500 font-mono">system_log.exe</span>
                    </div>

                    {/* Logs Area */}
                    <div
                        ref={scrollRef}
                        className="h-32 md:h-48 overflow-y-auto p-4 font-mono text-xs md:text-sm space-y-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                    >
                        <AnimatePresence mode="popLayout">
                            {logs.map((log, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-3 text-slate-300"
                                >
                                    <span className="text-cyan-500 shrink-0">➜</span>
                                    <span className={cn("truncate", index === logs.length - 1 ? "text-white font-bold" : "text-slate-400")}>
                                        {log}
                                    </span>
                                    {index === logs.length - 1 && (
                                        <span className="w-1.5 h-3 md:w-2 md:h-4 bg-cyan-500 animate-pulse shrink-0" />
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1 bg-slate-800 w-full">
                        <motion.div
                            className="h-full bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ ease: "linear" }}
                        />
                    </div>
                </div>

                <div className="flex justify-between mt-2 text-[10px] md:text-xs font-mono text-slate-500 px-1">
                    <span>CPU: {Math.floor(Math.random() * 30 + 60)}%</span>
                    <span>MEM: {Math.floor(Math.random() * 20 + 40)}%</span>
                    <span>NET: CONNECTED</span>
                </div>
            </div>
        </div>
    );
}
