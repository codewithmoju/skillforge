"use client";

import { motion } from "framer-motion";
import { Sparkles, Code, Palette, TrendingUp, Database, Cloud, Smartphone, Coins } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TopicSuggestion {
    id: string;
    title: string;
    description: string;
    icon: any;
    color: string;
    gradient: string;
}

const TOPIC_SUGGESTIONS: TopicSuggestion[] = [
    {
        id: "programming",
        title: "JavaScript Mastery",
        description: "From basics to advanced patterns",
        icon: Code,
        color: "text-yellow-400",
        gradient: "from-yellow-500/20 to-orange-500/20"
    },
    {
        id: "design",
        title: "UI/UX Design",
        description: "Create stunning user experiences",
        icon: Palette,
        color: "text-pink-400",
        gradient: "from-pink-500/20 to-purple-500/20"
    },
    {
        id: "business",
        title: "Digital Marketing",
        description: "Master modern marketing strategies",
        icon: TrendingUp,
        color: "text-green-400",
        gradient: "from-green-500/20 to-emerald-500/20"
    },
    {
        id: "data",
        title: "Machine Learning",
        description: "AI and data science fundamentals",
        icon: Database,
        color: "text-blue-400",
        gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
        id: "devops",
        title: "DevOps & Cloud",
        description: "Docker, Kubernetes, AWS mastery",
        icon: Cloud,
        color: "text-indigo-400",
        gradient: "from-indigo-500/20 to-blue-500/20"
    },
    {
        id: "mobile",
        title: "React Native",
        description: "Build cross-platform mobile apps",
        icon: Smartphone,
        color: "text-cyan-400",
        gradient: "from-cyan-500/20 to-teal-500/20"
    },
    {
        id: "web3",
        title: "Blockchain & Web3",
        description: "Smart contracts and DeFi",
        icon: Coins,
        color: "text-purple-400",
        gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
        id: "python",
        title: "Python Programming",
        description: "Versatile language for all domains",
        icon: Code,
        color: "text-blue-300",
        gradient: "from-blue-400/20 to-indigo-400/20"
    }
];

interface RoadmapGenerationHeroProps {
    onGenerate: (topic: string) => void;
    isGenerating: boolean;
}

export function RoadmapGenerationHero({ onGenerate, isGenerating }: RoadmapGenerationHeroProps) {
    const [input, setInput] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isGenerating) {
            onGenerate(input.trim());
        }
    };

    const handleSuggestionClick = (title: string) => {
        setInput(title);
    };

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 -z-10">
                {/* Gradient Mesh */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-indigo/10 via-background to-accent-cyan/10" />

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

            <div className="w-full max-w-4xl mx-auto px-4 py-12">
                {/* Hero Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-indigo/20 to-accent-cyan/20 border border-accent-indigo/30 mb-6"
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
                            AI-Powered Learning Roadmaps
                        </span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                            What do you want to
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-accent-indigo via-accent-cyan to-accent-indigo bg-clip-text text-transparent animate-gradient">
                            master today?
                        </span>
                    </h1>

                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Enter any skill or topic, and I'll create a personalized, gamified learning roadmap just for you.
                    </p>
                </motion.div>

                {/* Input Field */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="mb-12"
                >
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-accent-indigo to-accent-cyan rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="e.g., React Development, Machine Learning, UI/UX Design..."
                                disabled={isGenerating}
                                className={cn(
                                    "w-full px-8 py-6 text-lg rounded-2xl",
                                    "bg-slate-900/80 backdrop-blur-xl",
                                    "border-2 border-slate-700/50",
                                    "text-white placeholder:text-slate-500",
                                    "focus:outline-none focus:border-accent-indigo/50",
                                    "transition-all duration-300",
                                    "disabled:opacity-50 disabled:cursor-not-allowed"
                                )}
                                autoFocus
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isGenerating}
                                className={cn(
                                    "absolute right-3 top-1/2 -translate-y-1/2",
                                    "px-6 py-3 rounded-xl",
                                    "bg-gradient-to-r from-accent-indigo to-accent-cyan",
                                    "text-white font-semibold",
                                    "hover:shadow-lg hover:shadow-accent-indigo/50",
                                    "transition-all duration-300",
                                    "disabled:opacity-50 disabled:cursor-not-allowed",
                                    "disabled:hover:shadow-none"
                                )}
                            >
                                {isGenerating ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Generating...</span>
                                    </div>
                                ) : (
                                    "Generate Roadmap"
                                )}
                            </button>
                        </div>
                    </div>
                </motion.form>

                {/* Topic Suggestions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <p className="text-center text-sm text-slate-500 mb-6">
                        Or choose from popular topics:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {TOPIC_SUGGESTIONS.map((suggestion, index) => (
                            <motion.button
                                key={suggestion.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleSuggestionClick(suggestion.title)}
                                disabled={isGenerating}
                                className={cn(
                                    "relative p-4 rounded-xl",
                                    "bg-slate-900/50 backdrop-blur-sm",
                                    "border border-slate-800",
                                    "hover:border-slate-700",
                                    "transition-all duration-300",
                                    "text-left group",
                                    "disabled:opacity-50 disabled:cursor-not-allowed"
                                )}
                            >
                                <div className={cn(
                                    "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                                    `bg-gradient-to-br ${suggestion.gradient}`
                                )} />
                                <div className="relative">
                                    <suggestion.icon className={cn("w-6 h-6 mb-2", suggestion.color)} />
                                    <h3 className="font-semibold text-white text-sm mb-1">
                                        {suggestion.title}
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        {suggestion.description}
                                    </p>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
