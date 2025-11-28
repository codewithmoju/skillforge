"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock, BookMarked } from "lucide-react";
import type { Prerequisite } from "@/lib/store";

interface PrerequisiteChainProps {
    prerequisites: Prerequisite[];
    goal: string;
}

export function PrerequisiteChain({ prerequisites, goal }: PrerequisiteChainProps) {
    if (!prerequisites || prerequisites.length === 0) {
        return null;
    }

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Learning Path to {goal}
            </h2>

            <div className="relative">
                <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
                    {prerequisites.map((prereq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-4 flex-shrink-0"
                        >
                            <div className="group relative bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4 hover:border-purple-500/60 transition-all duration-300 min-w-[320px] max-w-[380px]">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-semibold text-white flex items-center gap-2">
                                                {prereq.name}
                                                <CheckCircle2 className="w-4 h-4 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </h3>
                                            {prereq.estimatedTime && (
                                                <span className="flex items-center gap-1 text-xs text-gray-400 bg-gray-800/50 px-2 py-0.5 rounded">
                                                    <Clock className="w-3 h-3" />
                                                    {prereq.estimatedTime}
                                                </span>
                                            )}
                                        </div>

                                        {prereq.description && (
                                            <p className="text-xs text-gray-300 leading-relaxed mb-2">
                                                {prereq.description}
                                            </p>
                                        )}

                                        <p className="text-sm text-purple-200/90 leading-relaxed italic">
                                            💡 {prereq.reason}
                                        </p>

                                        {prereq.resources && prereq.resources.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-purple-500/20">
                                                <p className="text-xs font-semibold text-cyan-300 mb-1.5 flex items-center gap-1">
                                                    <BookMarked className="w-3 h-3" /> Resources:
                                                </p>
                                                <ul className="text-xs text-gray-300 space-y-0.5">
                                                    {prereq.resources.map((resource, i) => (
                                                        <li key={i} className="flex items-start gap-1.5">
                                                            <span className="text-cyan-400 mt-0.5">•</span>
                                                            <span>{resource}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>

                            {index < prerequisites.length - 1 && (
                                <ArrowRight className="w-6 h-6 text-purple-400 flex-shrink-0" />
                            )}
                        </motion.div>
                    ))}

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: prerequisites.length * 0.1 }}
                        className="flex-shrink-0"
                    >
                        <div className="relative bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-sm border-2 border-green-500/50 rounded-xl p-4 min-w-[280px]">
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/30 flex items-center justify-center">
                                    <CheckCircle2 className="w-6 h-6 text-green-300" />
                                </div>
                                <div>
                                    <div className="text-xs text-green-400 uppercase tracking-wide mb-1">Final Goal</div>
                                    <h3 className="font-bold text-white">{goal}</h3>
                                </div>
                            </div>
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 animate-pulse pointer-events-none" />
                        </div>
                    </motion.div>
                </div>

                <div className="mt-2 text-xs text-gray-400 md:hidden flex items-center gap-2">
                    <span>→</span>
                    <span>Scroll horizontally to see the complete path</span>
                </div>
            </div>

            <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-200">
                    <strong>Learning Path:</strong> Follow this sequence to build a strong foundation before mastering {goal}.
                </p>
            </div>
        </div>
    );
}
