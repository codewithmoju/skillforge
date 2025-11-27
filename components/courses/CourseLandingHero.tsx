"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Rocket, Award, Users, TrendingUp, Search } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface CourseLandingHeroProps {
    onGenerate: (topic: string) => void;
    isGenerating: boolean;
}

/**
 * Revolutionary Landing Hero with Cosmic Theme
 * Performance optimized with lazy loading and efficient animations
 */
export function CourseLandingHero({ onGenerate, isGenerating }: CourseLandingHeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

    const [topic, setTopic] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (topic.trim()) {
            onGenerate(topic);
        }
    };

    return (
        <div ref={containerRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Animated Cosmic Background - Performance Optimized */}
            <div className="absolute inset-0 -z-10">
                {/* Base gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/20 to-purple-950/20" />

                {/* Animated orbs - using will-change for GPU acceleration */}
                <motion.div
                    style={{ y, opacity }}
                    className="absolute top-20 left-10 w-96 h-96 bg-blue-500/30 rounded-full blur-[120px] will-change-transform"
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 50, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "30%"]) }}
                    className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/30 rounded-full blur-[120px] will-change-transform"
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, -50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Optimized grid pattern */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                                        linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            {/* Main Content */}
            <motion.div
                style={{ scale, opacity }}
                className="relative z-10 max-w-6xl mx-auto px-4 text-center"
            >
                {/* Floating Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 backdrop-blur-sm mb-8"
                >
                    <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                    <span className="text-sm font-semibold text-blue-200">AI-Powered Course Generator</span>
                </motion.div>

                {/* Holographic Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-6xl md:text-8xl font-black mb-6 tracking-tight"
                >
                    <span className="inline-block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                        Generate
                    </span>
                    <br />
                    <span className="inline-block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient" style={{ animationDelay: '0.5s' }}>
                        Any Course
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed"
                >
                    Type any topic, and our AI will instantly build a <span className="text-blue-300">custom curriculum</span> just for you.
                </motion.p>

                {/* Holographic Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="max-w-2xl mx-auto mb-12"
                >
                    <form onSubmit={handleSubmit} className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                        <div className="relative flex items-center bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-blue-500/30 overflow-hidden">
                            <Search className="w-6 h-6 text-blue-400 ml-6" />
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="What do you want to learn today? (e.g. Python, Quantum Physics)"
                                className="flex-1 px-6 py-5 bg-transparent text-white placeholder-slate-400 outline-none text-lg"
                                disabled={isGenerating}
                            />
                            <button
                                type="submit"
                                disabled={isGenerating}
                                className="m-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold text-white transition-all hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? (
                                    <>
                                        <Sparkles className="w-5 h-5 animate-spin" />
                                        Building...
                                    </>
                                ) : (
                                    <>
                                        <Rocket className="w-5 h-5" />
                                        Generate
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>


            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-6 h-10 rounded-full border-2 border-blue-400/50 flex items-start justify-center p-2"
                >
                    <motion.div
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                    />
                </motion.div>
            </motion.div>
        </div>
    );
}
