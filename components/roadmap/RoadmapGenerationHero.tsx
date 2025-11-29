"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Code, Palette, TrendingUp, Database, Cloud, Smartphone, Coins, ArrowRight, Brain, Terminal, BookOpen, ChevronRight, Check, Zap, Rocket, Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { AuroraBackground } from "@/components/ui/AuroraBackground";

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
        color: "text-amber-400",
        gradient: "from-amber-500/20 to-orange-500/20"
    },
    {
        id: "design",
        title: "UI/UX Design",
        description: "Create stunning user experiences",
        icon: Palette,
        color: "text-pink-400",
        gradient: "from-pink-500/20 to-rose-500/20"
    },
    {
        id: "business",
        title: "Digital Marketing",
        description: "Master modern marketing strategies",
        icon: TrendingUp,
        color: "text-emerald-400",
        gradient: "from-emerald-500/20 to-teal-500/20"
    },
    {
        id: "data",
        title: "Machine Learning",
        description: "AI and data science fundamentals",
        icon: Database,
        color: "text-cyan-400",
        gradient: "from-cyan-500/20 to-blue-500/20"
    },
];

interface RoadmapGenerationHeroProps {
    onGenerate: (topic: string, answers?: any[], difficulty?: any, persona?: any) => void;
    isGenerating: boolean;
}

export function RoadmapGenerationHero({ onGenerate, isGenerating }: RoadmapGenerationHeroProps) {
    const [step, setStep] = useState<"input" | "analyzing" | "customizing">("input");
    const [input, setInput] = useState("");
    const [analysisData, setAnalysisData] = useState<any>(null);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [selectedDifficulty, setSelectedDifficulty] = useState<any>(null);
    const [selectedPersona, setSelectedPersona] = useState<any>(null);

    const handleAnalyze = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;

        setStep("analyzing");
        try {
            const res = await fetch("/api/courses/analyze-topic", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic: input }),
            });

            if (!res.ok) {
                throw new Error(`API Error: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            setAnalysisData(data);
            setStep("customizing");
            // Set defaults
            if (data.difficulties?.length) setSelectedDifficulty(data.difficulties[0]);
            if (data.personas?.length) setSelectedPersona(data.personas[0]);
        } catch (error) {
            console.error("Analysis failed", error);
            alert("Interactive analysis failed, falling back to standard generation. Check console for details.");
            // Fallback to direct generation if analysis fails
            onGenerate(input);
        }
    };

    const handleFinalGenerate = () => {
        onGenerate(input, Object.values(answers), selectedDifficulty, selectedPersona);
    };

    const handleSuggestionClick = (title: string) => {
        setInput(title);
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center relative overflow-hidden pb-20">
            {/* Aurora Background */}
            <AuroraBackground />

            <div className="w-full max-w-7xl mx-auto px-4 py-20 relative z-10">
                <AnimatePresence mode="wait">
                    {step === "input" && (
                        <motion.div
                            key="input"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                            className="flex flex-col items-center text-center"
                        >
                            {/* Floating Glass Badge */}
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="mb-8 inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/20 backdrop-blur-xl text-sm font-bold text-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.15)]"
                            >
                                <Sparkles className="w-4 h-4 fill-current" />
                                <span className="tracking-wide uppercase">Quantum Learning Engine</span>
                            </motion.div>

                            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-none">
                                <span className="block text-white drop-shadow-2xl">
                                    Unlock Your
                                </span>
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 animate-gradient-xy pb-4">
                                    Potential
                                </span>
                            </h1>

                            <p className="max-w-2xl text-lg md:text-xl text-slate-300 mb-12 leading-relaxed font-light">
                                Transform any topic into a personalized, interactive mastery path.
                                Powered by advanced neural networks.
                            </p>

                            <form onSubmit={handleAnalyze} className="w-full max-w-3xl relative group mb-20 z-20">
                                {/* Prism Glow */}
                                <div className="absolute -inset-[2px] bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 rounded-2xl blur-md opacity-50 group-hover:opacity-100 transition duration-500" />

                                <div className="relative flex items-center bg-[#0a0a0f]/60 backdrop-blur-2xl rounded-2xl border border-white/20 p-2 shadow-2xl">
                                    <div className="pl-6 text-slate-400">
                                        <Search className="w-6 h-6" />
                                    </div>
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="What do you want to master?"
                                        className="w-full px-6 py-6 text-xl bg-transparent text-white placeholder:text-slate-500 focus:outline-none font-medium"
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        disabled={!input.trim()}
                                        className="px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(192,38,211,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 group/btn"
                                    >
                                        <span>Ignite</span>
                                        <Zap className="w-5 h-5 group-hover/btn:fill-white transition-colors" />
                                    </button>
                                </div>
                            </form>

                            {/* Glass Shard Suggestions */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-6xl px-4">
                                {TOPIC_SUGGESTIONS.map((suggestion, idx) => (
                                    <motion.button
                                        key={suggestion.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 + (idx * 0.1) }}
                                        onClick={() => handleSuggestionClick(suggestion.title)}
                                        className="group relative h-full"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl blur-sm transform group-hover:scale-105 transition-transform duration-500" />
                                        <div className="relative h-full p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 backdrop-blur-md transition-all text-left overflow-hidden flex flex-col">
                                            <div className={`absolute inset-0 bg-gradient-to-br ${suggestion.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                            <div className="relative z-10 flex-1">
                                                <div className="mb-4 p-3 rounded-xl bg-white/5 w-fit group-hover:scale-110 transition-transform duration-300 border border-white/5">
                                                    <suggestion.icon className={`w-6 h-6 ${suggestion.color}`} />
                                                </div>
                                                <h3 className="font-bold text-white mb-2 text-lg">{suggestion.title}</h3>
                                                <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">{suggestion.description}</p>
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === "analyzing" && (
                        <motion.div
                            key="analyzing"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="flex flex-col items-center justify-center h-[60vh]"
                        >
                            <div className="relative w-40 h-40 mb-12">
                                {/* Quantum Core Animation */}
                                <div className="absolute inset-0 border-2 border-violet-500/30 rounded-full animate-[spin_10s_linear_infinite]" />
                                <div className="absolute inset-2 border-2 border-fuchsia-500/30 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
                                <div className="absolute inset-4 border-2 border-cyan-500/30 rounded-full animate-[spin_6s_linear_infinite]" />

                                <div className="absolute inset-0 m-auto w-20 h-20 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full blur-2xl animate-pulse" />
                                <Brain className="absolute inset-0 m-auto w-12 h-12 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                            </div>
                            <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Synthesizing Matrix</h2>
                            <div className="flex flex-col items-center gap-2 text-slate-400 font-mono text-sm">
                                <span className="animate-pulse text-violet-400">Parsing semantic structures...</span>
                                <span className="animate-pulse delay-75 text-fuchsia-400">Mapping knowledge graph...</span>
                                <span className="animate-pulse delay-150 text-cyan-400">Generating adaptive path...</span>
                            </div>
                        </motion.div>
                    )}

                    {step === "customizing" && analysisData && (
                        <motion.div
                            key="customizing"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-6xl mx-auto"
                        >
                            <div className="text-center mb-16">
                                <h2 className="text-5xl font-black text-white mb-6 tracking-tight">Configure Protocol</h2>
                                <p className="text-xl text-slate-400">Fine-tune your learning parameters.</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                                {/* Column 1: Clarifying Questions */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/20">
                                            <Terminal className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white">Focus</h3>
                                    </div>
                                    {analysisData.questions?.map((q: any) => (
                                        <div key={q.id} className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                                            <p className="text-white font-medium mb-4">{q.text}</p>
                                            <div className="space-y-2">
                                                {q.options.map((opt: string) => (
                                                    <button
                                                        key={opt}
                                                        onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                                        className={cn(
                                                            "w-full text-left px-4 py-3 rounded-xl text-sm transition-all border",
                                                            answers[q.id] === opt
                                                                ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                                                                : "bg-black/20 border-transparent text-slate-400 hover:bg-white/5 hover:text-white"
                                                        )}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Column 2: Difficulty Selection */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/20">
                                            <TrendingUp className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white">Intensity</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {analysisData.difficulties?.map((diff: any) => (
                                            <button
                                                key={diff.level}
                                                onClick={() => setSelectedDifficulty(diff)}
                                                className={cn(
                                                    "w-full p-5 rounded-2xl border text-left transition-all relative overflow-hidden group backdrop-blur-sm",
                                                    selectedDifficulty?.level === diff.level
                                                        ? "border-fuchsia-500 bg-fuchsia-500/10 shadow-[0_0_20px_rgba(192,38,211,0.2)]"
                                                        : "border-white/10 bg-white/5 hover:border-white/20"
                                                )}
                                            >
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className={cn("font-bold text-lg", selectedDifficulty?.level === diff.level ? "text-fuchsia-400" : "text-white")}>
                                                        {diff.level}
                                                    </span>
                                                    <span className="text-xs font-mono bg-black/30 px-2 py-1 rounded text-slate-300 border border-white/10">
                                                        {diff.xpMultiplier}x XP
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-400 leading-relaxed">{diff.description}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Column 3: Persona Selection */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg bg-violet-500/20 text-violet-400 border border-violet-500/20">
                                            <Brain className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white">Guide</h3>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {analysisData.personas?.map((persona: any) => (
                                            <button
                                                key={persona.id}
                                                onClick={() => setSelectedPersona(persona)}
                                                className={cn(
                                                    "w-full p-5 rounded-2xl border text-left transition-all backdrop-blur-sm",
                                                    selectedPersona?.id === persona.id
                                                        ? "border-violet-500 bg-violet-500/10 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                                                        : "border-white/10 bg-white/5 hover:border-white/20"
                                                )}
                                            >
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className={cn(
                                                        "p-2 rounded-lg",
                                                        selectedPersona?.id === persona.id ? "bg-violet-500/20 text-violet-400" : "bg-black/20 text-slate-400"
                                                    )}>
                                                        {persona.icon === "Terminal" ? <Terminal className="w-4 h-4" /> :
                                                            persona.icon === "BookOpen" ? <BookOpen className="w-4 h-4" /> :
                                                                <Brain className="w-4 h-4" />}
                                                    </div>
                                                    <span className={cn("font-bold text-lg", selectedPersona?.id === persona.id ? "text-violet-400" : "text-white")}>
                                                        {persona.name}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-400 leading-relaxed">{persona.description}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <Button
                                    onClick={handleFinalGenerate}
                                    disabled={isGenerating}
                                    size="lg"
                                    className="h-20 px-16 text-xl rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 hover:shadow-[0_0_40px_rgba(192,38,211,0.4)] transition-all transform hover:scale-105"
                                >
                                    {isGenerating ? (
                                        <span className="flex items-center gap-3">
                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Initializing...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-3 font-bold">
                                            <Rocket className="w-6 h-6 fill-current" />
                                            Launch Protocol
                                            <ArrowRight className="w-6 h-6" />
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
