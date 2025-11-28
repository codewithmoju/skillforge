"use client";

import { motion } from "framer-motion";
import { Sparkles, Search, ArrowRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { userBehavior } from "@/lib/services/behavior";
import { useAuth } from "@/lib/hooks/useAuth";

interface CourseLandingHeroProps {
    onGenerate: (topic: string) => void;
    isGenerating: boolean;
}

export function CourseLandingHero({ onGenerate, isGenerating }: CourseLandingHeroProps) {
    const { user } = useAuth();
    const [topic, setTopic] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (topic.trim() && !isGenerating) {
            if (user) {
                userBehavior.log(user.uid, 'generate_course', {
                    targetId: 'new_course',
                    metadata: { topic }
                });
            }
            onGenerate(topic.trim());
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 -z-10">
                {/* Gradient Mesh */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-indigo/10 via-slate-950 to-accent-cyan/10" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] bg-center" />

                {/* Animated Orbs */}
                <motion.div
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-indigo/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-cyan/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.5, 0.3, 0.5],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />
            </div>

            <div className="w-full max-w-4xl mx-auto px-4 py-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-indigo/20 to-accent-cyan/20 border border-accent-indigo/30 mb-8"
                        animate={{
                            boxShadow: [
                                "0 0 20px rgba(99, 102, 241, 0.3)",
                                "0 0 40px rgba(6, 182, 212, 0.3)",
                                "0 0 20px rgba(99, 102, 241, 0.3)",
                            ]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        <Sparkles className="w-4 h-4 text-accent-cyan" />
                        <span className="text-sm font-medium bg-gradient-to-r from-accent-indigo to-accent-cyan bg-clip-text text-transparent">
                            AI-Powered Curriculum Engine
                        </span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
                        What do you want to <br />
                        <span className="bg-gradient-to-r from-accent-indigo via-accent-cyan to-accent-indigo bg-clip-text text-transparent animate-gradient">
                            learn today?
                        </span>
                    </h1>

                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Enter any topic, and our AI will instantly construct a personalized learning path tailored to your goals.
                    </p>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="max-w-2xl mx-auto relative group"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-accent-indigo to-accent-cyan rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
                    <div className="relative flex items-center bg-slate-900/80 backdrop-blur-xl rounded-2xl border-2 border-slate-700/50 focus-within:border-accent-indigo/50 transition-all duration-300">
                        <Search className="w-6 h-6 text-slate-500 ml-6" />
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g. Quantum Computing, Italian Cooking..."
                            className="flex-1 px-6 py-6 bg-transparent text-white placeholder-slate-500 outline-none text-lg"
                            disabled={isGenerating}
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!topic.trim() || isGenerating}
                            className={cn(
                                "m-2 px-6 py-3 rounded-xl",
                                "bg-gradient-to-r from-accent-indigo to-accent-cyan",
                                "text-white font-semibold",
                                "hover:shadow-lg hover:shadow-accent-indigo/50",
                                "transition-all duration-300",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                "flex items-center gap-2"
                            )}
                        >
                            {isGenerating ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Building...</span>
                                </>
                            ) : (
                                <>
                                    <span>Generate</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </motion.form>
            </div>
        </div>
    );
}
