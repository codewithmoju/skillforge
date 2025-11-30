"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Code, Palette, TrendingUp, Database, ArrowRight, Brain, Terminal, BookOpen, ChevronRight, Check, Zap, Rocket, Search, Map, Compass, Navigation, ChevronLeft, Star, Shield, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { TextGenerateEffect } from "@/components/ui/TextGenerateEffect";
import { TiltCard } from "@/components/ui/TiltCard";
import { SuggestionMarquee } from "@/components/ui/SuggestionMarquee";

interface TopicSuggestion {
    id: string;
    title: string;
    description: string;
    icon: any;
    color: string;
    border: string;
    gradient: string;
}

const TOPIC_SUGGESTIONS: TopicSuggestion[] = [
    {
        id: "programming",
        title: "Full Stack Dev",
        description: "Master the web ecosystem",
        icon: Code,
        color: "text-blue-400",
        border: "border-blue-500/30",
        gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
        id: "design",
        title: "Product Design",
        description: "Build products users love",
        icon: Palette,
        color: "text-pink-400",
        border: "border-pink-500/30",
        gradient: "from-pink-500/20 to-rose-500/20"
    },
    {
        id: "business",
        title: "Startup Growth",
        description: "Scale from 0 to 1",
        icon: TrendingUp,
        color: "text-green-400",
        border: "border-green-500/30",
        gradient: "from-green-500/20 to-emerald-500/20"
    },
    {
        id: "data",
        title: "Data Science",
        description: "Extract insights from data",
        icon: Database,
        color: "text-purple-400",
        border: "border-purple-500/30",
        gradient: "from-purple-500/20 to-violet-500/20"
    },
];

interface RoadmapGenerationHeroProps {
    onGenerate: (topic: string, answers?: any[], difficulty?: any, persona?: any) => void;
    isGenerating: boolean;
}

export function RoadmapGenerationHero({ onGenerate, isGenerating }: RoadmapGenerationHeroProps) {
    const [step, setStep] = useState<"input" | "analyzing" | "wizard">("input");
    const [wizardStep, setWizardStep] = useState(0);
    const [input, setInput] = useState("");
    const [analysisData, setAnalysisData] = useState<any>(null);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [selectedDifficulty, setSelectedDifficulty] = useState<any>(null);
    const [selectedPersona, setSelectedPersona] = useState<any>(null);

    // Wizard steps configuration
    const [wizardConfig, setWizardConfig] = useState<any[]>([]);

    useEffect(() => {
        if (analysisData) {
            const steps = [];

            // 1. Questions Steps
            if (analysisData.questions) {
                analysisData.questions.forEach((q: any) => {
                    steps.push({ type: 'question', data: q });
                });
            }

            // 2. Difficulty Step
            steps.push({ type: 'difficulty', data: analysisData.difficulties });

            // 3. Persona Step
            steps.push({ type: 'persona', data: analysisData.personas });

            setWizardConfig(steps);
        }
    }, [analysisData]);

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

            // Set defaults
            if (data.difficulties?.length) setSelectedDifficulty(data.difficulties[0]);
            if (data.personas?.length) setSelectedPersona(data.personas[0]);

            // Artificial delay for effect
            setTimeout(() => {
                setStep("wizard");
                setWizardStep(0);
            }, 1500);

        } catch (error) {
            console.error("Analysis failed", error);
            alert("Interactive analysis failed, falling back to standard generation.");
            onGenerate(input);
        }
    };

    const handleNext = () => {
        if (wizardStep < wizardConfig.length - 1) {
            setWizardStep(prev => prev + 1);
        } else {
            handleFinalGenerate();
        }
    };

    const handleBack = () => {
        if (wizardStep > 0) {
            setWizardStep(prev => prev - 1);
        } else {
            setStep("input");
        }
    };

    const handleFinalGenerate = () => {
        onGenerate(input, Object.values(answers), selectedDifficulty, selectedPersona);
    };

    const handleSuggestionClick = (title: string) => {
        setInput(title);
    };

    const currentWizardStep = wizardConfig[wizardStep];

    return (
        <AuroraBackground className="min-h-[90vh] w-full">
            <div className="w-full py-20 px-4 md:px-8 relative z-20">
                <AnimatePresence mode="wait">
                    {step === "input" && (
                        <motion.div
                            key="input"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                            className="flex flex-col items-center text-center w-full"
                        >
                            <div className="w-full max-w-4xl mx-auto px-4">
                                {/* Tech Badge */}
                                <motion.div
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700 text-sm font-mono text-blue-400 tracking-wider shadow-[0_0_20px_rgba(59,130,246,0.2)] backdrop-blur-md"
                                >
                                    <Compass className="w-4 h-4 animate-spin-slow" />
                                    <span>NAVIGATION SYSTEMS ONLINE</span>
                                </motion.div>

                                <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter text-white drop-shadow-2xl">
                                    Chart Your <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 animate-gradient-x">
                                        Destiny
                                    </span>
                                </h1>

                                <div className="max-w-2xl mx-auto mb-12">
                                    <TextGenerateEffect
                                        words="Define your destination. Our AI navigator will construct the optimal route through the knowledge graph."
                                        className="text-lg text-slate-300 font-normal"
                                    />
                                </div>

                                <form onSubmit={handleAnalyze} className="w-full max-w-2xl mx-auto relative group mb-24 z-20">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt" />
                                    <div className="relative flex items-center bg-slate-950/80 backdrop-blur-xl rounded-2xl border border-slate-800 p-2 shadow-2xl transition-all focus-within:border-slate-600">
                                        <div className="pl-6 text-slate-500">
                                            <Search className="w-6 h-6" />
                                        </div>
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder="What do you want to learn today?"
                                            className="w-full px-6 py-5 text-xl bg-transparent text-white placeholder:text-slate-600 focus:outline-none font-medium"
                                            autoFocus
                                        />
                                        <button
                                            type="submit"
                                            disabled={!input.trim()}
                                            className="px-8 py-4 rounded-xl bg-white text-slate-950 font-bold text-lg hover:bg-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
                                        >
                                            <span>Begin</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Infinite Suggestion Marquee */}
                            <div className="w-full relative z-10 -mt-8">
                                <SuggestionMarquee onSelect={handleSuggestionClick} />
                            </div>
                        </motion.div>
                    )}

                    {step === "analyzing" && (
                        <motion.div
                            key="analyzing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center h-[60vh]"
                        >
                            <div className="relative w-48 h-48 mb-12">
                                <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin" />
                                <div className="absolute inset-4 border-b-4 border-purple-500 rounded-full animate-spin-reverse" />
                                <div className="absolute inset-0 m-auto w-24 h-24 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
                                <Brain className="absolute inset-0 m-auto w-16 h-16 text-white animate-pulse" />
                            </div>
                            <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Analyzing Request</h2>
                            <div className="flex flex-col items-center gap-2">
                                <p className="text-blue-400 font-mono text-sm animate-pulse">Constructing neural pathways...</p>
                                <p className="text-purple-400 font-mono text-sm animate-pulse delay-75">Identifying key concepts...</p>
                            </div>
                        </motion.div>
                    )}

                    {step === "wizard" && currentWizardStep && (
                        <motion.div
                            key="wizard"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-5xl mx-auto"
                        >
                            {/* Progress Bar */}
                            <div className="mb-16 relative">
                                <div className="flex justify-between text-xs font-mono text-slate-500 mb-4 uppercase tracking-wider">
                                    <span>Configuration Sequence</span>
                                    <span>Step {wizardStep + 1} / {wizardConfig.length}</span>
                                </div>
                                <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${((wizardStep + 1) / wizardConfig.length) * 100}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                                {/* Glowing dot at the end of progress */}
                                <motion.div
                                    className="absolute top-7 h-4 w-4 bg-white rounded-full blur-sm shadow-[0_0_20px_white]"
                                    style={{ left: `calc(${((wizardStep + 1) / wizardConfig.length) * 100}% - 8px)` }}
                                    animate={{ left: `calc(${((wizardStep + 1) / wizardConfig.length) * 100}% - 8px)` }}
                                />
                            </div>

                            <div className="min-h-[500px] flex flex-col justify-between">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={wizardStep}
                                        initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                        exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                                        transition={{ duration: 0.4 }}
                                        className="flex-1"
                                    >
                                        {/* QUESTION STEP */}
                                        {currentWizardStep.type === 'question' && (
                                            <div className="space-y-12">
                                                <div className="text-center space-y-6">
                                                    <div className="inline-flex p-4 rounded-3xl bg-blue-500/10 text-blue-400 mb-4 ring-1 ring-blue-500/20 shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]">
                                                        <Target className="w-10 h-10" />
                                                    </div>
                                                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">{currentWizardStep.data.text}</h2>
                                                    <p className="text-slate-400 text-xl">Select the option that best fits your goals.</p>
                                                </div>

                                                <div className="grid grid-cols-1 gap-4 max-w-3xl mx-auto">
                                                    {currentWizardStep.data.options.map((opt: string) => (
                                                        <button
                                                            key={opt}
                                                            onClick={() => {
                                                                setAnswers(prev => ({ ...prev, [currentWizardStep.data.id]: opt }));
                                                                setTimeout(handleNext, 300);
                                                            }}
                                                            className={cn(
                                                                "group relative w-full p-8 rounded-3xl border text-left transition-all duration-300 hover:scale-[1.02] overflow-hidden",
                                                                answers[currentWizardStep.data.id] === opt
                                                                    ? "bg-blue-600 border-blue-500 shadow-[0_0_50px_rgba(37,99,235,0.3)]"
                                                                    : "bg-slate-900/40 border-slate-800 hover:bg-slate-800 hover:border-slate-600 backdrop-blur-sm"
                                                            )}
                                                        >
                                                            <div className="flex items-center justify-between relative z-10">
                                                                <span className={cn(
                                                                    "text-xl font-bold transition-colors",
                                                                    answers[currentWizardStep.data.id] === opt ? "text-white" : "text-slate-300 group-hover:text-white"
                                                                )}>
                                                                    {opt}
                                                                </span>
                                                                {answers[currentWizardStep.data.id] === opt && (
                                                                    <motion.div
                                                                        initial={{ scale: 0 }}
                                                                        animate={{ scale: 1 }}
                                                                        className="bg-white text-blue-600 rounded-full p-2 shadow-lg"
                                                                    >
                                                                        <Check className="w-5 h-5" />
                                                                    </motion.div>
                                                                )}
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* DIFFICULTY STEP */}
                                        {currentWizardStep.type === 'difficulty' && (
                                            <div className="space-y-12">
                                                <div className="text-center space-y-6">
                                                    <div className="inline-flex p-4 rounded-3xl bg-purple-500/10 text-purple-400 mb-4 ring-1 ring-purple-500/20 shadow-[0_0_30px_-10px_rgba(168,85,247,0.3)]">
                                                        <Shield className="w-10 h-10" />
                                                    </div>
                                                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">Select Intensity</h2>
                                                    <p className="text-slate-400 text-xl">Choose your challenge level.</p>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                    {currentWizardStep.data.map((diff: any) => (
                                                        <TiltCard key={diff.level} className="h-full">
                                                            <button
                                                                onClick={() => setSelectedDifficulty(diff)}
                                                                className={cn(
                                                                    "relative p-8 rounded-3xl border text-left transition-all duration-300 flex flex-col h-full w-full overflow-hidden",
                                                                    selectedDifficulty?.level === diff.level
                                                                        ? "bg-purple-500/20 border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.2)]"
                                                                        : "bg-slate-900/40 border-slate-800 hover:bg-slate-800 hover:border-slate-600 backdrop-blur-sm"
                                                                )}
                                                            >
                                                                <div className="flex justify-between items-start mb-6">
                                                                    <span className={cn("text-2xl font-black", selectedDifficulty?.level === diff.level ? "text-purple-400" : "text-white")}>
                                                                        {diff.level}
                                                                    </span>
                                                                    <span className="text-xs font-mono bg-black/40 px-3 py-1.5 rounded-lg text-slate-300 border border-white/10">
                                                                        {diff.xpMultiplier}x XP
                                                                    </span>
                                                                </div>
                                                                <p className="text-base text-slate-400 leading-relaxed">{diff.description}</p>
                                                            </button>
                                                        </TiltCard>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* PERSONA STEP */}
                                        {currentWizardStep.type === 'persona' && (
                                            <div className="space-y-12">
                                                <div className="text-center space-y-6">
                                                    <div className="inline-flex p-4 rounded-3xl bg-emerald-500/10 text-emerald-400 mb-4 ring-1 ring-emerald-500/20 shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]">
                                                        <Brain className="w-10 h-10" />
                                                    </div>
                                                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">Choose Your Guide</h2>
                                                    <p className="text-slate-400 text-xl">Select an AI persona to lead your journey.</p>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                    {currentWizardStep.data.map((persona: any) => (
                                                        <TiltCard key={persona.id} className="h-full">
                                                            <button
                                                                onClick={() => setSelectedPersona(persona)}
                                                                className={cn(
                                                                    "relative p-8 rounded-3xl border text-left transition-all duration-300 flex flex-col h-full w-full overflow-hidden",
                                                                    selectedPersona?.id === persona.id
                                                                        ? "bg-emerald-500/20 border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.2)]"
                                                                        : "bg-slate-900/40 border-slate-800 hover:bg-slate-800 hover:border-slate-600 backdrop-blur-sm"
                                                                )}
                                                            >
                                                                <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit border border-white/10">
                                                                    {persona.icon === "Terminal" ? <Terminal className="w-8 h-8 text-emerald-400" /> :
                                                                        persona.icon === "BookOpen" ? <BookOpen className="w-8 h-8 text-emerald-400" /> :
                                                                            <Brain className="w-8 h-8 text-emerald-400" />}
                                                                </div>
                                                                <h3 className={cn("text-xl font-bold mb-3", selectedPersona?.id === persona.id ? "text-emerald-400" : "text-white")}>
                                                                    {persona.name}
                                                                </h3>
                                                                <p className="text-sm text-slate-400 leading-relaxed">{persona.description}</p>
                                                            </button>
                                                        </TiltCard>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                {/* Navigation Buttons */}
                                <div className="flex justify-between items-center mt-20 pt-8 border-t border-slate-800/50">
                                    <button
                                        onClick={handleBack}
                                        className="flex items-center gap-2 px-8 py-4 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all font-medium text-lg"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                        <span>Back</span>
                                    </button>

                                    <Button
                                        onClick={handleNext}
                                        disabled={isGenerating || (currentWizardStep.type === 'question' && !answers[currentWizardStep.data.id])}
                                        size="lg"
                                        className="h-16 px-10 text-xl rounded-2xl bg-white text-slate-950 hover:bg-slate-200 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] font-bold"
                                    >
                                        {wizardStep === wizardConfig.length - 1 ? (
                                            isGenerating ? (
                                                <span className="flex items-center gap-3">
                                                    <div className="w-6 h-6 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                                                    Initializing...
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-3">
                                                    <Rocket className="w-6 h-6" />
                                                    Launch Protocol
                                                </span>
                                            )
                                        ) : (
                                            <span className="flex items-center gap-3">
                                                Next Step
                                                <ChevronRight className="w-6 h-6" />
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AuroraBackground>
    );
}
