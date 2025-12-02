"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Scroll, BookOpen, Star, Feather, Sparkles, CheckCircle, XCircle, Shield, Sword, Crown, Code } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useUserStore } from "@/lib/store";

interface GamifiedLessonContent {
    title: string;
    missionBriefing: string;
    realWorldAnalogy: {
        title: string;
        analogy: string;
        connection: string;
    };
    powerUps: string[];
    interactiveDemo: {
        title: string;
        description: string;
        code: string;
        explanation: string;
    };
    bossChallenge: {
        question: string;
        options: string[];
        correctAnswer: number;
        explanation: string;
    };
    victoryRewards: string[];
}

export function ForestLessonView() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { completeLesson, currentTopic, roadmapDefinitions } = useUserStore();

    const nodeId = searchParams.get("nodeId");
    const lessonIndex = parseInt(searchParams.get("lessonIndex") || "1");
    const lessonTitle = searchParams.get("lessonTitle") || `Lesson ${lessonIndex}`;

    const [content, setContent] = useState<GamifiedLessonContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [step, setStep] = useState<'briefing' | 'analogy' | 'powerups' | 'demo' | 'boss'>('briefing');
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

    const selectedNodeDef = nodeId ? roadmapDefinitions.find(n => n.id === nodeId) : null;

    useEffect(() => {
        if (lessonTitle && selectedNodeDef) {
            fetchContent();
        }
    }, [lessonTitle, selectedNodeDef]);

    const fetchContent = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/generate-lesson', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: currentTopic,
                    moduleTitle: selectedNodeDef?.title,
                    lessonTitle,
                    userLevel: '1'
                }),
            });
            const data = await res.json();

            if (data.content && data.content.missionBriefing) {
                setContent(data.content);
            }
        } catch (error) {
            console.error("Failed to load lesson:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuizSubmit = () => {
        setIsQuizSubmitted(true);
    };

    const handleComplete = () => {
        if (nodeId) {
            // Pass lessonTitle as unique ID for this lesson within the module
            completeLesson(nodeId, lessonTitle);
        }
        router.push('/roadmap');
    };

    const progressSteps = ['briefing', 'analogy', 'powerups', 'demo', 'boss'];
    const currentProgress = ((progressSteps.indexOf(step) + 1) / progressSteps.length) * 100;

    return (
        <div className="min-h-screen bg-[#050a05] font-serif text-[#e2d5c3] relative overflow-hidden">
            {/* Background Layers */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('/assets/forest-bg-layer1.png')] opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#050a05] via-[#0a150a] to-[#050a05]" />
            </div>

            {/* Progress Vine */}
            <div className="fixed top-0 left-0 right-0 h-3 bg-[#1a2f16] z-50 border-b border-[#2d4a22]">
                <motion.div
                    className="h-full bg-gradient-to-r from-[#2d4a22] via-[#4a6741] to-[#10b981]"
                    initial={{ width: 0 }}
                    animate={{ width: `${currentProgress}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            {/* Header */}
            <div className="sticky top-3 z-40 px-6 py-4">
                <div className="max-w-6xl mx-auto bg-[#1a2f16]/90 backdrop-blur-xl border border-[#2d4a22] rounded-xl p-4 flex items-center justify-between shadow-2xl">
                    <button
                        onClick={() => router.push('/roadmap')}
                        className="flex items-center gap-2 text-[#8b7355] hover:text-[#e2d5c3] transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Return to Path</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <Scroll className="w-5 h-5 text-emerald-500" />
                        <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-emerald-500">Chapter {lessonIndex}</div>
                            <div className="text-sm font-bold text-[#e2d5c3]">{lessonTitle}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#0f1f0f] rounded-lg border border-[#2d4a22]">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-bold text-[#e2d5c3]">{Math.round(currentProgress)}%</span>
                    </div>
                </div>
            </div>

            {/* Main Content - The Scroll */}
            <div className="max-w-4xl mx-auto px-6 py-8 relative z-10">
                <div className="relative bg-[#f5e6d3] text-[#3e2723] rounded-lg shadow-2xl overflow-hidden min-h-[80vh]">
                    {/* Parchment Texture */}
                    <div className="absolute inset-0 opacity-40 pointer-events-none"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")` }}
                    />

                    {/* Content Container */}
                    <div className="relative z-10 p-12">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                >
                                    <Feather className="w-16 h-16 text-[#8b4513]" />
                                </motion.div>
                                <p className="text-2xl font-serif text-[#5d4037] italic">Unrolling the scroll...</p>
                            </div>
                        ) : content ? (
                            <AnimatePresence mode="wait">
                                {/* Briefing */}
                                {step === 'briefing' && (
                                    <motion.div
                                        key="briefing"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-10"
                                    >
                                        <div className="text-center border-b-2 border-[#8b4513]/20 pb-8">
                                            <h2 className="text-5xl font-bold text-[#2d1b0e] mb-4 font-serif">The Prophecy</h2>
                                            <div className="w-32 h-1 bg-[#8b4513] mx-auto rounded-full opacity-50" />
                                        </div>
                                        <p className="text-2xl leading-loose text-[#3e2723] font-serif text-justify">
                                            <span className="float-left text-7xl font-bold mr-4 mt-[-10px] text-[#8b4513] font-serif">
                                                {content.missionBriefing.charAt(0)}
                                            </span>
                                            {content.missionBriefing.slice(1)}
                                        </p>
                                        <div className="flex justify-center pt-12">
                                            <Button onClick={() => setStep('analogy')} size="lg" className="bg-[#2d4a22] hover:bg-[#1a2f16] text-[#e2d5c3] border border-[#4a6741] font-serif text-xl px-10 py-8 rounded-xl shadow-lg hover:shadow-xl transition-all group">
                                                Begin Journey <Feather className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Analogy */}
                                {step === 'analogy' && (
                                    <motion.div
                                        key="analogy"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="bg-[#fff8f0] p-10 rounded-xl border border-[#e6d5c3] shadow-inner relative">
                                            <BookOpen className="absolute top-6 right-6 w-12 h-12 text-[#8b4513]/20" />
                                            <h2 className="text-3xl font-bold text-[#2d1b0e] mb-6 font-serif">{content.realWorldAnalogy.title}</h2>
                                            <p className="text-xl text-[#3e2723] italic leading-relaxed border-l-4 border-[#8b4513]/30 pl-6">
                                                "{content.realWorldAnalogy.analogy}"
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-4 p-8 bg-[#e8f5e9] rounded-xl border border-[#c8e6c9]">
                                            <Sparkles className="w-8 h-8 text-[#2e7d32] mt-1 flex-shrink-0" />
                                            <p className="text-lg text-[#1b5e20] font-medium leading-relaxed">{content.realWorldAnalogy.connection}</p>
                                        </div>
                                        <div className="flex justify-end pt-4">
                                            <Button onClick={() => setStep('powerups')} size="lg" className="bg-[#8b4513] hover:bg-[#5d4037] text-[#f5e6d3] font-serif text-lg px-8 py-6">
                                                Seek Power <Star className="w-5 h-5 ml-2" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Power Ups */}
                                {step === 'powerups' && (
                                    <motion.div
                                        key="powerups"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-8"
                                    >
                                        <h2 className="text-4xl font-bold text-center text-[#2d1b0e] mb-10 font-serif">Runes of Power</h2>
                                        <div className="grid gap-6">
                                            {content.powerUps.map((powerUp, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ x: -20, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ delay: idx * 0.15 }}
                                                    className="flex items-center gap-6 p-6 bg-white/60 border border-[#d7ccc8] rounded-xl hover:bg-white/90 transition-colors shadow-sm group"
                                                >
                                                    <div className="w-14 h-14 rounded-full bg-[#2d1b0e] text-[#f5e6d3] flex items-center justify-center font-bold text-2xl border-2 border-[#8b4513] group-hover:scale-110 transition-transform">
                                                        {String.fromCharCode(65 + idx)}
                                                    </div>
                                                    <p className="text-xl text-[#3e2723] font-medium">{powerUp}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                        <div className="flex justify-end pt-8">
                                            <Button onClick={() => setStep('demo')} size="lg" className="bg-[#8b4513] hover:bg-[#5d4037] text-[#f5e6d3] font-serif text-lg px-8 py-6">
                                                Witness Magic <Sparkles className="w-5 h-5 ml-2" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Demo */}
                                {step === 'demo' && (
                                    <motion.div
                                        key="demo"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="bg-[#2d1b0e] p-10 rounded-xl border-2 border-[#8b4513] shadow-xl relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                                <Code className="w-40 h-40 text-white" />
                                            </div>
                                            <h2 className="text-3xl font-bold text-[#f5e6d3] mb-4 font-serif">The Incantation</h2>
                                            <p className="text-[#d7ccc8] mb-8 text-lg">{content.interactiveDemo.description}</p>
                                            <pre className="bg-[#1a120b] p-8 rounded-lg border border-[#4e342e] overflow-x-auto text-emerald-400 font-mono text-base shadow-inner">
                                                {content.interactiveDemo.code}
                                            </pre>
                                            <div className="mt-8 text-[#bcaaa4] text-base italic border-t border-[#4e342e] pt-4">
                                                {content.interactiveDemo.explanation}
                                            </div>
                                        </div>
                                        <div className="flex justify-end pt-4">
                                            <Button onClick={() => setStep('boss')} size="lg" className="bg-[#b71c1c] hover:bg-[#7f1d1d] text-white font-serif text-lg px-8 py-6 border border-[#ef5350] shadow-lg hover:shadow-red-900/50">
                                                Face the Trial <Sword className="w-6 h-6 ml-2" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Boss */}
                                {step === 'boss' && (
                                    <motion.div
                                        key="boss"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="text-center mb-8">
                                            <Shield className="w-24 h-24 text-[#8b4513] mx-auto mb-6" />
                                            <h2 className="text-4xl font-bold text-[#2d1b0e] mb-2 font-serif">The Trial of Wisdom</h2>
                                            <p className="text-xl text-[#5d4037]">Prove your worth to the ancients.</p>
                                        </div>

                                        <div className="bg-white/40 p-10 rounded-2xl border-2 border-[#8b4513]/20">
                                            <h3 className="text-2xl font-bold text-[#2d1b0e] mb-8">{content.bossChallenge.question}</h3>
                                            <div className="space-y-4">
                                                {content.bossChallenge.options.map((option, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => !isQuizSubmitted && setSelectedOption(idx)}
                                                        disabled={isQuizSubmitted}
                                                        className={`w-full p-6 text-left rounded-xl border-2 transition-all font-serif text-xl ${isQuizSubmitted
                                                            ? idx === content.bossChallenge.correctAnswer
                                                                ? "bg-[#e8f5e9] border-[#2e7d32] text-[#1b5e20]"
                                                                : idx === selectedOption
                                                                    ? "bg-[#ffebee] border-[#c62828] text-[#b71c1c]"
                                                                    : "bg-white/20 border-[#d7ccc8] text-[#8d6e63]"
                                                            : selectedOption === idx
                                                                ? "bg-[#efebe9] border-[#8b4513] text-[#3e2723] shadow-md transform scale-[1.02]"
                                                                : "bg-white/20 border-[#d7ccc8] text-[#5d4037] hover:bg-white/40 hover:border-[#a1887f]"
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span>{option}</span>
                                                            {isQuizSubmitted && idx === content.bossChallenge.correctAnswer && <CheckCircle className="w-8 h-8 text-[#2e7d32]" />}
                                                            {isQuizSubmitted && idx === selectedOption && idx !== content.bossChallenge.correctAnswer && <XCircle className="w-8 h-8 text-[#c62828]" />}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {isQuizSubmitted && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#fff3e0] p-8 rounded-xl border border-[#ffe0b2]">
                                                <p className="text-[#e65100] font-bold mb-2 text-lg">Wisdom Revealed:</p>
                                                <p className="text-[#ef6c00] text-lg">{content.bossChallenge.explanation}</p>
                                            </motion.div>
                                        )}

                                        <div className="flex justify-end pt-8">
                                            {!isQuizSubmitted ? (
                                                <Button onClick={handleQuizSubmit} disabled={selectedOption === null} size="lg" className="bg-[#8b4513] hover:bg-[#5d4037] text-[#f5e6d3] font-serif text-lg px-8 py-6">
                                                    Cast Answer <Sparkles className="w-6 h-6 ml-2" />
                                                </Button>
                                            ) : (
                                                <Button onClick={handleComplete} size="lg" className="bg-[#2d4a22] hover:bg-[#1a2f16] text-[#e2d5c3] font-serif text-xl px-10 py-8 border border-[#4a6741] shadow-lg hover:shadow-emerald-900/50">
                                                    Claim Victory <Crown className="w-6 h-6 ml-2" />
                                                </Button>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        ) : (
                            <div className="text-center text-red-400 p-12">
                                <p className="text-2xl font-bold mb-2">The Scroll is Blank</p>
                                <p className="text-lg text-[#5d4037] mb-6">The ancients are silent. Please try again.</p>
                                <Button onClick={() => router.push('/roadmap')}>Return to Path</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
