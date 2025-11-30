"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Code, Palette, TrendingUp, Database, ArrowRight, Brain, Terminal, BookOpen, ChevronRight, Check, Zap, Rocket, Search, Compass, Target, Shield, ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { SuggestionMarquee } from "@/components/ui/SuggestionMarquee";
import { TiltCard } from "@/components/ui/TiltCard";
import { TextGenerateEffect } from "@/components/ui/TextGenerateEffect";

interface TopicSuggestion {
    id: string;
    title: string;
    description: string;
    icon: any;
    color: string;
    gradient: string;
}

interface CourseGenerationHeroProps {
    onGenerate: (topic: string, answers?: any[], difficulty?: any, persona?: any) => void;
    isGenerating: boolean;
}

export function CourseGenerationHero({ onGenerate, isGenerating }: CourseGenerationHeroProps) {
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
        <div className="min-h-[90vh] flex items-center justify-center relative pb-20 w-full">
            <div className="w-full relative z-10">
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

                                <div className="max-w-2xl mx-auto mb-12">
                                    <TextGenerateEffect
                                        words="Transform any topic into a personalized, interactive mastery path. Powered by advanced neural networks."
                                        className="text-lg md:text-xl text-slate-300 font-light"
                                    />
                                </div>

                                <form onSubmit={handleAnalyze} className="w-full max-w-3xl mx-auto relative group mb-20 z-20">
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
                                        className="h-full"
                                        style={{
                                            background: `linear-gradient(to right, ${analysisData.theme?.primary}, ${analysisData.theme?.secondary}, ${analysisData.theme?.accent})`
                                        }}
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
                                                    <div
                                                        className="inline-flex p-4 rounded-3xl mb-4 ring-1 shadow-[0_0_30px_-10px_rgba(255,255,255,0.1)]"
                                                        style={{
                                                            backgroundColor: `${analysisData.theme?.primary}20`,
                                                            color: analysisData.theme?.primary,
                                                            borderColor: `${analysisData.theme?.primary}30`
                                                        }}
                                                    >
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
                                                                    ? "shadow-lg"
                                                                    : "bg-slate-900/40 border-slate-800 hover:bg-slate-800 hover:border-slate-600 backdrop-blur-sm"
                                                            )}
                                                            style={answers[currentWizardStep.data.id] === opt ? {
                                                                backgroundColor: `${analysisData.theme?.primary}20`,
                                                                borderColor: analysisData.theme?.primary,
                                                                boxShadow: `0 0 50px ${analysisData.theme?.primary}30`
                                                            } : {}}
                                                        >
                                                            <div className="flex items-center justify-between relative z-10">
                                                                <span
                                                                    className={cn("text-xl font-bold transition-colors")}
                                                                    style={{
                                                                        color: answers[currentWizardStep.data.id] === opt ? analysisData.theme?.primary : undefined
                                                                    }}
                                                                >
                                                                    {opt}
                                                                </span>
                                                                {answers[currentWizardStep.data.id] === opt && (
                                                                    <motion.div
                                                                        initial={{ scale: 0 }}
                                                                        animate={{ scale: 1 }}
                                                                        className="rounded-full p-2 shadow-lg text-black"
                                                                        style={{ backgroundColor: analysisData.theme?.primary }}
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
                                                    <div
                                                        className="inline-flex p-4 rounded-3xl mb-4 ring-1 shadow-[0_0_30px_-10px_rgba(255,255,255,0.1)]"
                                                        style={{
                                                            backgroundColor: `${analysisData.theme?.secondary}20`,
                                                            color: analysisData.theme?.secondary,
                                                            borderColor: `${analysisData.theme?.secondary}30`
                                                        }}
                                                    >
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
                                                                        ? "shadow-lg"
                                                                        : "bg-slate-900/40 border-slate-800 hover:bg-slate-800 hover:border-slate-600 backdrop-blur-sm"
                                                                )}
                                                                style={selectedDifficulty?.level === diff.level ? {
                                                                    backgroundColor: `${analysisData.theme?.secondary}20`,
                                                                    borderColor: analysisData.theme?.secondary,
                                                                    boxShadow: `0 0 40px ${analysisData.theme?.secondary}30`
                                                                } : {}}
                                                            >
                                                                <div className="flex justify-between items-start mb-6">
                                                                    <span
                                                                        className={cn("text-2xl font-black", selectedDifficulty?.level === diff.level ? "" : "text-white")}
                                                                        style={{ color: selectedDifficulty?.level === diff.level ? analysisData.theme?.secondary : undefined }}
                                                                    >
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
                                                    <div
                                                        className="inline-flex p-4 rounded-3xl mb-4 ring-1 shadow-[0_0_30px_-10px_rgba(255,255,255,0.1)]"
                                                        style={{
                                                            backgroundColor: `${analysisData.theme?.accent}20`,
                                                            color: analysisData.theme?.accent,
                                                            borderColor: `${analysisData.theme?.accent}30`
                                                        }}
                                                    >
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
                                                                        ? "shadow-lg"
                                                                        : "bg-slate-900/40 border-slate-800 hover:bg-slate-800 hover:border-slate-600 backdrop-blur-sm"
                                                                )}
                                                                style={selectedPersona?.id === persona.id ? {
                                                                    backgroundColor: `${analysisData.theme?.accent}20`,
                                                                    borderColor: analysisData.theme?.accent,
                                                                    boxShadow: `0 0 40px ${analysisData.theme?.accent}30`
                                                                } : {}}
                                                            >
                                                                <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit border border-white/10">
                                                                    {persona.icon === "Terminal" ? <Terminal className="w-8 h-8" style={{ color: analysisData.theme?.accent }} /> :
                                                                        persona.icon === "BookOpen" ? <BookOpen className="w-8 h-8" style={{ color: analysisData.theme?.accent }} /> :
                                                                            <Brain className="w-8 h-8" style={{ color: analysisData.theme?.accent }} />}
                                                                </div>
                                                                <h3
                                                                    className={cn("text-xl font-bold mb-3", selectedPersona?.id === persona.id ? "" : "text-white")}
                                                                    style={{ color: selectedPersona?.id === persona.id ? analysisData.theme?.accent : undefined }}
                                                                >
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
                                        className="h-16 px-10 text-xl rounded-2xl hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all transform hover:scale-105 font-bold"
                                        style={{
                                            background: `linear-gradient(to right, ${analysisData.theme?.primary}, ${analysisData.theme?.secondary}, ${analysisData.theme?.accent})`
                                        }}
                                    >
                                        {wizardStep === wizardConfig.length - 1 ? (
                                            isGenerating ? (
                                                <span className="flex items-center gap-3">
                                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Initializing...
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-3">
                                                    <Rocket className="w-6 h-6 fill-current" />
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
        </div>
    );
}
