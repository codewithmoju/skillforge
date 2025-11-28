"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, BookOpen, Target, Search, Clock, Lightbulb, CheckCircle2, Code2, Zap } from "lucide-react";
import type { LearningArea } from "@/lib/store";

interface HierarchicalBreakdownProps {
    learningAreas: LearningArea[];
    goal: string;
}

export function HierarchicalBreakdown({ learningAreas, goal }: HierarchicalBreakdownProps) {
    const [expandedAreas, setExpandedAreas] = useState<Set<string>>(new Set([learningAreas[0]?.id]));
    const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState("");

    if (!learningAreas || learningAreas.length === 0) {
        return null;
    }

    const toggleArea = (areaId: string) => {
        const newExpanded = new Set(expandedAreas);
        if (newExpanded.has(areaId)) {
            newExpanded.delete(areaId);
        } else {
            newExpanded.add(areaId);
        }
        setExpandedAreas(newExpanded);
    };

    const toggleTopic = (topicId: string) => {
        const newExpanded = new Set(expandedTopics);
        if (newExpanded.has(topicId)) {
            newExpanded.delete(topicId);
        } else {
            newExpanded.add(topicId);
        }
        setExpandedTopics(newExpanded);
    };

    const filteredAreas = learningAreas.filter(area => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            area.name.toLowerCase().includes(query) ||
            area.why.toLowerCase().includes(query) ||
            (area.description && area.description.toLowerCase().includes(query)) ||
            area.topics.some(topic =>
                topic.name.toLowerCase().includes(query) ||
                (topic.description && topic.description.toLowerCase().includes(query)) ||
                topic.subtopics.some(sub =>
                    sub.name.toLowerCase().includes(query) ||
                    (sub.description && sub.description.toLowerCase().includes(query))
                )
            )
        );
    });

    const getDifficultyColor = (difficulty?: string) => {
        switch (difficulty?.toLowerCase()) {
            case 'beginner': return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'intermediate': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            case 'advanced': return 'bg-red-500/20 text-red-300 border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        }
    };

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    📚 Complete Learning Roadmap - What to Learn & Why
                </h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search topics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors w-64"
                    />
                </div>
            </div>

            <div className="space-y-3">
                {filteredAreas.map((area, areaIndex) => (
                    <motion.div
                        key={area.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: areaIndex * 0.05 }}
                        className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden"
                    >
                        <button
                            onClick={() => toggleArea(area.id)}
                            className="w-full p-4 flex items-start justify-between hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-start gap-3 flex-1 text-left">
                                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-300 font-bold text-sm mt-0.5">
                                    {area.order}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-white text-lg">{area.name}</h3>
                                        {area.difficulty && (
                                            <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${getDifficultyColor(area.difficulty)}`}>
                                                {area.difficulty}
                                            </span>
                                        )}
                                        {area.estimatedDuration && (
                                            <span className="flex items-center gap-1 text-xs text-gray-400">
                                                <Clock className="w-3 h-3" />
                                                {area.estimatedDuration}
                                            </span>
                                        )}
                                    </div>
                                    {area.description && (
                                        <p className="text-sm text-gray-300 leading-relaxed mb-2">{area.description}</p>
                                    )}
                                    <p className="text-sm text-blue-300/90 leading-relaxed mb-2 italic">💡 {area.why}</p>

                                    {area.learningObjectives && area.learningObjectives.length > 0 && (
                                        <div className="mt-2 mb-2">
                                            <p className="text-xs font-semibold text-cyan-300 mb-1 flex items-center gap-1">
                                                <Target className="w-3 h-3" /> What You'll Master:
                                            </p>
                                            <ul className="text-xs text-gray-300 space-y-0.5 ml-4">
                                                {area.learningObjectives.map((obj, i) => (
                                                    <li key={i} className="flex items-start gap-1">
                                                        <span className="text-cyan-400 mt-0.5">•</span>
                                                        <span>{obj}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <BookOpen className="w-3 h-3" />
                                            {area.topics.length} topics
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Target className="w-3 h-3" />
                                            {area.topics.reduce((sum, t) => sum + t.subtopics.length, 0)} subtopics
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <motion.div
                                animate={{ rotate: expandedAreas.has(area.id) ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex-shrink-0 ml-2"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </motion.div>
                        </button>

                        <AnimatePresence>
                            {expandedAreas.has(area.id) && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-4 pb-4 space-y-2">
                                        {area.topics.map((topic, topicIndex) => (
                                            <div
                                                key={topic.id}
                                                className="ml-8 bg-gray-800/50 border border-gray-700/30 rounded-lg overflow-hidden"
                                            >
                                                <button
                                                    onClick={() => toggleTopic(topic.id)}
                                                    className="w-full p-3 flex items-start justify-between hover:bg-white/5 transition-colors"
                                                >
                                                    <div className="flex items-start gap-2 flex-1 text-left">
                                                        <div className="flex-shrink-0 w-6 h-6 rounded bg-cyan-500/20 flex items-center justify-center text-cyan-300 text-xs font-semibold mt-0.5">
                                                            {topicIndex + 1}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-0.5">
                                                                <h4 className="font-medium text-white">{topic.name}</h4>
                                                                {topic.difficulty && (
                                                                    <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${getDifficultyColor(topic.difficulty)}`}>
                                                                        {topic.difficulty}
                                                                    </span>
                                                                )}
                                                                {topic.estimatedTime && (
                                                                    <span className="flex items-center gap-1 text-[10px] text-gray-400">
                                                                        <Clock className="w-2.5 h-2.5" />
                                                                        {topic.estimatedTime}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {topic.description && (
                                                                <p className="text-xs text-gray-300 mb-1 leading-relaxed">{topic.description}</p>
                                                            )}
                                                            <p className="text-xs text-cyan-300/80 italic">💡 {topic.why}</p>

                                                            {topic.keyConcepts && topic.keyConcepts.length > 0 && (
                                                                <div className="mt-2">
                                                                    <p className="text-[10px] font-semibold text-purple-300 mb-0.5 flex items-center gap-1">
                                                                        <Lightbulb className="w-2.5 h-2.5" /> Terms to Learn:
                                                                    </p>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {topic.keyConcepts.map((concept, i) => (
                                                                            <span key={i} className="px-1.5 py-0.5 text-[10px] bg-purple-500/10 text-purple-200 rounded border border-purple-500/20">
                                                                                {concept}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {topic.practicalApplications && topic.practicalApplications.length > 0 && (
                                                                <div className="mt-2">
                                                                    <p className="text-[10px] font-semibold text-emerald-300 mb-0.5 flex items-center gap-1">
                                                                        <Code2 className="w-2.5 h-2.5" /> Where You'll Use This:
                                                                    </p>
                                                                    <ul className="text-[10px] text-gray-300 space-y-0.5 ml-3">
                                                                        {topic.practicalApplications.map((app, i) => (
                                                                            <li key={i} className="flex items-start gap-1">
                                                                                <span className="text-emerald-400 mt-0.5">▸</span>
                                                                                <span>{app}</span>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <motion.div
                                                        animate={{ rotate: expandedTopics.has(topic.id) ? 180 : 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="flex-shrink-0 ml-2"
                                                    >
                                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                                    </motion.div>
                                                </button>

                                                <AnimatePresence>
                                                    {expandedTopics.has(topic.id) && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="px-3 pb-3 space-y-1.5">
                                                                {topic.subtopics.map((subtopic, subIndex) => (
                                                                    <div
                                                                        key={subtopic.id}
                                                                        className="ml-6 p-2.5 bg-gray-900/40 rounded border-l-2 border-purple-500/30 hover:border-purple-500/60 hover:bg-gray-900/60 transition-all"
                                                                    >
                                                                        <div className="flex items-start gap-2">
                                                                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-300 text-xs font-medium mt-0.5">
                                                                                {subIndex + 1}
                                                                            </span>
                                                                            <div className="flex-1 min-w-0">
                                                                                <div className="flex items-center gap-2 mb-0.5">
                                                                                    <h5 className="text-sm font-medium text-white">{subtopic.name}</h5>
                                                                                    {subtopic.estimatedTime && (
                                                                                        <span className="flex items-center gap-1 text-[10px] text-gray-400">
                                                                                            <Clock className="w-2.5 h-2.5" />
                                                                                            {subtopic.estimatedTime}
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                                {subtopic.description && (
                                                                                    <p className="text-xs text-gray-300 mb-1 leading-relaxed">{subtopic.description}</p>
                                                                                )}
                                                                                <p className="text-xs text-purple-300/80 italic">{subtopic.why}</p>

                                                                                {subtopic.keyPoints && subtopic.keyPoints.length > 0 && (
                                                                                    <div className="mt-2">
                                                                                        <p className="text-[10px] font-semibold text-yellow-300 mb-0.5 flex items-center gap-1">
                                                                                            <CheckCircle2 className="w-2.5 h-2.5" /> Concepts to Understand:
                                                                                        </p>
                                                                                        <ul className="text-[10px] text-gray-300 space-y-0.5 ml-3">
                                                                                            {subtopic.keyPoints.map((point, i) => (
                                                                                                <li key={i} className="flex items-start gap-1">
                                                                                                    <span className="text-yellow-400 mt-0.5">✓</span>
                                                                                                    <span>{point}</span>
                                                                                                </li>
                                                                                            ))}
                                                                                        </ul>
                                                                                    </div>
                                                                                )}

                                                                                {subtopic.examples && subtopic.examples.length > 0 && (
                                                                                    <div className="mt-2">
                                                                                        <p className="text-[10px] font-semibold text-pink-300 mb-0.5 flex items-center gap-1">
                                                                                            <Zap className="w-2.5 h-2.5" /> Real-World Context:
                                                                                        </p>
                                                                                        <div className="space-y-1">
                                                                                            {subtopic.examples.map((example, i) => (
                                                                                                <div key={i} className="text-[10px] text-gray-300 bg-pink-500/5 border border-pink-500/20 rounded px-2 py-1">
                                                                                                    {example}
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
