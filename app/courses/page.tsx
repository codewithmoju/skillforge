"use client";

import { useState, useEffect } from "react";
import { CourseLandingHero } from "@/components/courses/CourseLandingHero";
import { Sparkles, ArrowRight, Brain } from "lucide-react";
import { useRouter } from "next/navigation";
import { recommendationService, Recommendation } from "@/lib/services/recommendations";
import { motion } from "framer-motion";

export default function CoursesPage() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const router = useRouter();

    useEffect(() => {
        const loadRecs = async () => {
            const recs = await recommendationService.getRecommendations();
            setRecommendations(recs);
        };
        loadRecs();
    }, []);

    const handleGenerate = async (topic: string) => {
        setIsGenerating(true);
        try {
            const res = await fetch('/api/courses/generate-syllabus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, level: 'beginner' }) // Default to beginner for now
            });
            const data = await res.json();
            if (data.syllabus) {
                // Save to localStorage and redirect
                const tempId = `generated-${Date.now()}`;
                localStorage.setItem(`course-${tempId}`, JSON.stringify(data.syllabus));
                router.push(`/courses/${tempId}`);
            }
        } catch (error) {
            console.error("Failed to generate:", error);
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Hero Section with Generator */}
            <CourseLandingHero
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
            />

            {/* Recommendations Section */}
            {recommendations.length > 0 && (
                <div className="max-w-7xl mx-auto px-6 pb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <Brain className="w-6 h-6 text-purple-400" />
                            <h2 className="text-2xl font-bold text-white">Recommended Paths for You</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recommendations.map((rec, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.6 + (idx * 0.1) }}
                                    onClick={() => handleGenerate(rec.topic)}
                                    className="group relative p-6 rounded-2xl border border-white/5 bg-slate-900/50 hover:bg-slate-800/50 transition-all cursor-pointer overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Sparkles className="w-12 h-12" style={{ color: rec.color }} />
                                    </div>

                                    <div className="relative z-10">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
                                            style={{ backgroundColor: `${rec.color}20`, color: rec.color }}
                                        >
                                            {rec.difficulty}
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                                            {rec.topic}
                                        </h3>
                                        <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                                            {rec.reason}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm font-medium text-white/60 group-hover:text-white transition-colors">
                                            Generate Syllabus <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Loading Overlay */}
            {isGenerating && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
                    <div className="relative">
                        <div className="w-24 h-24 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-blue-500 animate-pulse" />
                        </div>
                    </div>
                    <p className="mt-8 text-xl font-bold text-white animate-pulse">
                        Constructing Neural Pathways...
                    </p>
                    <p className="text-slate-400 mt-2">
                        AI is designing your custom curriculum
                    </p>
                </div>
            )}
        </div>
    );
}
