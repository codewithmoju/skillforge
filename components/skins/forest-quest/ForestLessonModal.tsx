"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scroll, X, Feather, BookOpen, Sparkles, Star, Code, Sword, Shield, CheckCircle, XCircle, Crown } from "lucide-react";
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

interface ForestLessonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
    topic: string;
    moduleTitle: string;
    lessonTitle: string;
    lessonIndex: number;
}

export function ForestLessonModal({ isOpen, onClose, onComplete, topic, moduleTitle, lessonTitle, lessonIndex }: ForestLessonModalProps) {
    const { lessonCache, prefetchLesson } = useUserStore();
    const [content, setContent] = useState<GamifiedLessonContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [step, setStep] = useState<'briefing' | 'analogy' | 'powerups' | 'demo' | 'boss'>('briefing');
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

    useEffect(() => {
        if (isOpen && lessonTitle) {
            fetchContent();
        } else {
            setContent(null);
            setStep('briefing');
            setSelectedOption(null);
            setIsQuizSubmitted(false);
        }
    }, [isOpen, lessonTitle]);

    const fetchContent = async () => {
        const cacheKey = `${topic}-${moduleTitle}-${lessonTitle}`;

        if (lessonCache[cacheKey]) {
            setContent(lessonCache[cacheKey].content);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/generate-lesson', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, moduleTitle, lessonTitle, userLevel: '1' }),
            });
            const data = await res.json();

            if (data.content) {
                setContent(data.content);
                const nextLessonNum = lessonIndex + 1;
                prefetchLesson(topic, moduleTitle, `Lesson ${nextLessonNum}`, '1');
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

    const handleFinish = () => {
        onComplete();
        onClose();
    };

    if (!isOpen) return null;

    const progressSteps = ['briefing', 'analogy', 'powerups', 'demo', 'boss'];
    const currentProgress = ((progressSteps.indexOf(step) + 1) / progressSteps.length) * 100;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-serif">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="w-full max-w-5xl relative flex flex-col max-h-[95vh]"
                >
                    {/* Scroll Container Visuals */}
                    <div className="absolute inset-0 bg-[#f5e6d3] rounded-lg shadow-2xl overflow-hidden">
                        {/* Parchment Texture */}
                        <div className="absolute inset-0 opacity-30"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")` }}
                        />
                        {/* Border Decoration */}
                        <div className="absolute inset-0 border-[12px] border-double border-[#8b4513]/30 rounded-lg pointer-events-none" />
                        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#8b4513] rounded-tl-lg" />
                        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#8b4513] rounded-tr-lg" />
                        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#8b4513] rounded-bl-lg" />
                        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#8b4513] rounded-br-lg" />
                    </div>

                    {/* Content Wrapper */}
                    <div className="relative z-10 flex flex-col h-full text-[#3e2723]">
                        {/* Header */}
                        <div className="p-8 border-b border-[#8b4513]/20 flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Scroll className="w-5 h-5 text-[#8b4513]" />
                                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8b4513]">Chapter {lessonIndex}</span>
                                </div>
                                <h2 className="text-3xl font-bold font-serif text-[#2d1b0e]">{lessonTitle}</h2>
                                <p className="text-sm text-[#5d4037] italic">{moduleTitle}</p>
                            </div>
                            <button onClick={onClose} className="text-[#8b4513] hover:text-[#2d1b0e] transition-colors p-2 hover:bg-[#8b4513]/10 rounded-full">
                                <X className="w-8 h-8" />
                            </button>
                        </div>

                        {/* Progress Ink Line */}
                        <div className="h-1 bg-[#8b4513]/10 w-full">
                            <motion.div
                                className="h-full bg-[#8b4513]"
                                initial={{ width: 0 }}
                                animate={{ width: `${currentProgress}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-80 space-y-6">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Feather className="w-16 h-16 text-[#8b4513]" />
                                    </motion.div>
                                    <p className="text-xl font-serif text-[#5d4037] italic">Inscribing knowledge...</p>
                                </div>
                            ) : content ? (
                                <div className="space-y-10 max-w-3xl mx-auto">

                                    {/* Briefing -> The Prophecy */}
                                    {step === 'briefing' && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                            <div className="text-center mb-8">
                                                <h3 className="text-4xl font-bold text-[#2d1b0e] mb-4 font-serif">The Prophecy</h3>
                                                <div className="w-24 h-1 bg-[#8b4513] mx-auto rounded-full opacity-50" />
                                            </div>
                                            <p className="text-xl leading-loose text-[#3e2723] first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-[-10px] font-serif">
                                                {content.missionBriefing}
                                            </p>
                                            <div className="flex justify-center pt-8">
                                                <Button onClick={() => setStep('analogy')} size="lg" className="bg-[#2d4a22] hover:bg-[#1a2f16] text-[#e2d5c3] border border-[#4a6741] font-serif text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
                                                    Begin Journey <Feather className="w-5 h-5 ml-2" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Analogy -> Ancient Wisdom */}
                                    {step === 'analogy' && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                            <div className="bg-[#fff8f0] p-8 rounded-lg border border-[#e6d5c3] shadow-inner">
                                                <div className="flex items-center gap-4 mb-6">
                                                    <BookOpen className="w-8 h-8 text-[#8b4513]" />
                                                    <h3 className="text-2xl font-bold text-[#2d1b0e]">{content.realWorldAnalogy.title}</h3>
                                                </div>
                                                <p className="text-lg text-[#3e2723] italic leading-relaxed border-l-4 border-[#8b4513]/30 pl-6">
                                                    "{content.realWorldAnalogy.analogy}"
                                                </p>
                                            </div>
                                            <div className="flex items-start gap-4 p-6 bg-[#e8f5e9] rounded-lg border border-[#c8e6c9]">
                                                <Sparkles className="w-6 h-6 text-[#2e7d32] mt-1" />
                                                <p className="text-[#1b5e20] font-medium">{content.realWorldAnalogy.connection}</p>
                                            </div>
                                            <div className="flex justify-end">
                                                <Button onClick={() => setStep('powerups')} size="lg" className="bg-[#8b4513] hover:bg-[#5d4037] text-[#f5e6d3] font-serif">
                                                    Seek Power <Star className="w-5 h-5 ml-2" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Power Ups -> Runes */}
                                    {step === 'powerups' && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                            <h3 className="text-3xl font-bold text-center text-[#2d1b0e] mb-8">Runes of Power</h3>
                                            <div className="grid gap-6">
                                                {content.powerUps.map((powerUp, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        initial={{ x: -20, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ delay: idx * 0.1 }}
                                                        className="flex items-center gap-6 p-6 bg-white/50 border border-[#d7ccc8] rounded-lg hover:bg-white/80 transition-colors shadow-sm"
                                                    >
                                                        <div className="w-12 h-12 rounded-full bg-[#2d1b0e] text-[#f5e6d3] flex items-center justify-center font-bold text-xl border-2 border-[#8b4513]">
                                                            {String.fromCharCode(65 + idx)}
                                                        </div>
                                                        <p className="text-lg text-[#3e2723] font-medium">{powerUp}</p>
                                                    </motion.div>
                                                ))}
                                            </div>
                                            <div className="flex justify-end pt-4">
                                                <Button onClick={() => setStep('demo')} size="lg" className="bg-[#8b4513] hover:bg-[#5d4037] text-[#f5e6d3] font-serif">
                                                    Witness Magic <Sparkles className="w-5 h-5 ml-2" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Demo -> Incantation */}
                                    {step === 'demo' && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                            <div className="bg-[#2d1b0e] p-8 rounded-lg border-2 border-[#8b4513] shadow-xl relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                                    <Code className="w-32 h-32 text-white" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-[#f5e6d3] mb-4 font-serif">The Incantation</h3>
                                                <p className="text-[#d7ccc8] mb-6">{content.interactiveDemo.description}</p>
                                                <pre className="bg-[#1a120b] p-6 rounded border border-[#4e342e] overflow-x-auto text-emerald-400 font-mono text-sm shadow-inner">
                                                    {content.interactiveDemo.code}
                                                </pre>
                                                <div className="mt-6 text-[#bcaaa4] text-sm italic">
                                                    {content.interactiveDemo.explanation}
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <Button onClick={() => setStep('boss')} size="lg" className="bg-[#b71c1c] hover:bg-[#7f1d1d] text-white font-serif border border-[#ef5350]">
                                                    Face the Trial <Sword className="w-5 h-5 ml-2" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Boss -> Trial */}
                                    {step === 'boss' && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                            <div className="text-center">
                                                <Shield className="w-20 h-20 text-[#8b4513] mx-auto mb-4" />
                                                <h3 className="text-3xl font-bold text-[#2d1b0e] mb-2">The Trial of Wisdom</h3>
                                                <p className="text-[#5d4037]">Prove your worth to the ancients.</p>
                                            </div>

                                            <div className="bg-white/40 p-8 rounded-xl border-2 border-[#8b4513]/20">
                                                <h4 className="text-xl font-bold text-[#2d1b0e] mb-6">{content.bossChallenge.question}</h4>
                                                <div className="space-y-4">
                                                    {content.bossChallenge.options.map((option, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => !isQuizSubmitted && setSelectedOption(idx)}
                                                            disabled={isQuizSubmitted}
                                                            className={`w-full p-6 text-left rounded-lg border-2 transition-all font-serif text-lg ${isQuizSubmitted
                                                                ? idx === content.bossChallenge.correctAnswer
                                                                    ? "bg-[#e8f5e9] border-[#2e7d32] text-[#1b5e20]"
                                                                    : idx === selectedOption
                                                                        ? "bg-[#ffebee] border-[#c62828] text-[#b71c1c]"
                                                                        : "bg-white/20 border-[#d7ccc8] text-[#8d6e63]"
                                                                : selectedOption === idx
                                                                    ? "bg-[#efebe9] border-[#8b4513] text-[#3e2723] shadow-md"
                                                                    : "bg-white/20 border-[#d7ccc8] text-[#5d4037] hover:bg-white/40 hover:border-[#a1887f]"
                                                                }`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <span>{option}</span>
                                                                {isQuizSubmitted && idx === content.bossChallenge.correctAnswer && <CheckCircle className="w-6 h-6 text-[#2e7d32]" />}
                                                                {isQuizSubmitted && idx === selectedOption && idx !== content.bossChallenge.correctAnswer && <XCircle className="w-6 h-6 text-[#c62828]" />}
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {isQuizSubmitted && (
                                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#fff3e0] p-6 rounded-lg border border-[#ffe0b2]">
                                                    <p className="text-[#e65100] font-bold mb-2">Wisdom Revealed:</p>
                                                    <p className="text-[#ef6c00]">{content.bossChallenge.explanation}</p>
                                                </motion.div>
                                            )}

                                            <div className="flex justify-end pt-4">
                                                {!isQuizSubmitted ? (
                                                    <Button onClick={handleQuizSubmit} disabled={selectedOption === null} size="lg" className="bg-[#8b4513] hover:bg-[#5d4037] text-[#f5e6d3] font-serif">
                                                        Cast Answer <Sparkles className="w-5 h-5 ml-2" />
                                                    </Button>
                                                ) : (
                                                    <Button onClick={handleFinish} size="lg" className="bg-[#2d4a22] hover:bg-[#1a2f16] text-[#e2d5c3] font-serif border border-[#4a6741] shadow-lg">
                                                        Claim Victory <Crown className="w-5 h-5 ml-2" />
                                                    </Button>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}

                                </div>
                            ) : null}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
