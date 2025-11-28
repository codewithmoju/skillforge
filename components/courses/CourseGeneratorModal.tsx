"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, BookOpen, Layers, Zap, Brain } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface CourseGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (topic: string, level: string) => void;
}

export function CourseGeneratorModal({ isOpen, onClose, onGenerate }: CourseGeneratorModalProps) {
    const [topic, setTopic] = useState("");
    const [level, setLevel] = useState("beginner");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = () => {
        if (!topic.trim()) return;
        setIsGenerating(true);
        onGenerate(topic, level);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="relative h-40 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 overflow-hidden">
                            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />

                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors backdrop-blur-md"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md">
                                    <Sparkles className="w-3 h-3" />
                                    AI Course Genesis
                                </div>
                                <h2 className="text-3xl font-black text-white mb-2">Create Your Masterpiece</h2>
                                <p className="text-indigo-100">Generate a custom, gamified course in seconds.</p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-8">
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider">
                                    What do you want to learn?
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="e.g., Advanced React Patterns, Python for Data Science..."
                                        className="w-full bg-slate-950 border-2 border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none transition-all text-lg font-medium"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider">
                                    Select Difficulty
                                </label>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { id: 'beginner', label: 'Beginner', icon: Layers, desc: 'Start from scratch' },
                                        { id: 'intermediate', label: 'Intermediate', icon: Zap, desc: 'Level up skills' },
                                        { id: 'advanced', label: 'Advanced', icon: Brain, desc: 'Master complex topics' }
                                    ].map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setLevel(opt.id)}
                                            className={cn(
                                                "p-4 rounded-xl border-2 text-left transition-all group relative overflow-hidden",
                                                level === opt.id
                                                    ? "bg-indigo-600/10 border-indigo-500"
                                                    : "bg-slate-950 border-slate-800 hover:border-slate-700"
                                            )}
                                        >
                                            <div className="relative z-10">
                                                <opt.icon className={cn(
                                                    "w-6 h-6 mb-3",
                                                    level === opt.id ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-400"
                                                )} />
                                                <div className={cn(
                                                    "font-bold mb-1",
                                                    level === opt.id ? "text-white" : "text-slate-300"
                                                )}>{opt.label}</div>
                                                <div className="text-xs text-slate-500">{opt.desc}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button
                                    onClick={handleGenerate}
                                    disabled={!topic.trim() || isGenerating}
                                    className="w-full py-6 text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 rounded-xl"
                                >
                                    {isGenerating ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Designing Syllabus...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="w-5 h-5" />
                                            Generate Course
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
