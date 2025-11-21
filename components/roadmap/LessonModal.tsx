import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Target, Trophy, Code, Sparkles, CheckCircle, XCircle, Lightbulb, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useUserStore } from '@/lib/store';

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

interface LessonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
    topic: string;
    moduleTitle: string;
    lessonTitle: string;
    lessonIndex: number;
}

export function LessonModal({ isOpen, onClose, onComplete, topic, moduleTitle, lessonTitle, lessonIndex }: LessonModalProps) {
    const { lessonCache, prefetchLesson } = useUserStore();
    const [content, setContent] = useState<GamifiedLessonContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [step, setStep] = useState<'briefing' | 'analogy' | 'powerups' | 'demo' | 'boss'>('briefing');
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
    const [xpEarned, setXpEarned] = useState(0);

    useEffect(() => {
        if (isOpen && lessonTitle) {
            fetchContent();
        } else {
            // Reset state on close
            setContent(null);
            setStep('briefing');
            setSelectedOption(null);
            setIsQuizSubmitted(false);
            setXpEarned(0);
        }
    }, [isOpen, lessonTitle]);

    const fetchContent = async () => {
        const cacheKey = `${topic}-${moduleTitle}-${lessonTitle}`;

        // Check cache first for instant load
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

                // Prefetch next lesson
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
        if (selectedOption === content?.bossChallenge.correctAnswer) {
            setXpEarned(50); // Bonus XP for correct answer
        } else {
            setXpEarned(25); // Participation XP
        }
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="w-full max-w-5xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border-2 border-accent-indigo/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
                >
                    {/* Mission Progress Bar */}
                    <div className="h-2 bg-slate-950">
                        <motion.div
                            className="h-full bg-gradient-to-r from-accent-indigo via-accent-purple to-accent-cyan"
                            initial={{ width: 0 }}
                            animate={{ width: `${currentProgress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>

                    {/* Header */}
                    <div className="p-6 border-b border-slate-800/50 flex items-center justify-between bg-gradient-to-r from-accent-indigo/10 to-accent-cyan/10">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Rocket className="w-5 h-5 text-accent-cyan" />
                                <span className="text-xs font-bold uppercase tracking-wider text-accent-cyan">Mission {lessonIndex}</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white">{lessonTitle}</h2>
                            <p className="text-sm text-slate-400">{moduleTitle}</p>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-96 space-y-6">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="w-20 h-20 border-4 border-accent-indigo border-t-transparent rounded-full"
                                />
                                <div className="text-center space-y-2">
                                    <p className="text-xl font-bold text-white">Preparing Your Mission...</p>
                                    <p className="text-slate-400">Crafting the perfect learning experience</p>
                                </div>
                            </div>
                        ) : content ? (
                            <div className="space-y-8">
                                {/* Mission Briefing */}
                                {step === 'briefing' && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                        <div className="relative overflow-hidden bg-gradient-to-br from-accent-indigo/20 via-accent-purple/20 to-accent-cyan/20 p-8 rounded-2xl border-2 border-accent-indigo/30">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-cyan/10 rounded-full blur-3xl -mr-32 -mt-32" />
                                            <div className="relative z-10">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="p-3 bg-accent-indigo/20 rounded-xl border border-accent-indigo/30">
                                                        <Target className="w-6 h-6 text-accent-indigo" />
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-white">Mission Briefing</h3>
                                                </div>
                                                <p className="text-lg text-slate-200 leading-relaxed">{content.missionBriefing}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <Button onClick={() => setStep('analogy')} size="lg" className="gap-2 bg-gradient-to-r from-accent-indigo to-accent-purple hover:from-accent-indigo/80 hover:to-accent-purple/80">
                                                Accept Mission <Zap className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Real World Analogy */}
                                {step === 'analogy' && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                        <Card className="p-8 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-2 border-amber-500/30">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-3 bg-amber-500/20 rounded-xl">
                                                    <Lightbulb className="w-6 h-6 text-amber-400" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-white">{content.realWorldAnalogy.title}</h3>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
                                                    <p className="text-lg text-slate-200 leading-relaxed italic">{content.realWorldAnalogy.analogy}</p>
                                                </div>
                                                <div className="flex items-start gap-3 p-4 bg-amber-500/5 rounded-lg border border-amber-500/20">
                                                    <Sparkles className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
                                                    <p className="text-slate-300">{content.realWorldAnalogy.connection}</p>
                                                </div>
                                            </div>
                                        </Card>
                                        <div className="flex justify-end">
                                            <Button onClick={() => setStep('powerups')} size="lg" className="gap-2">
                                                Continue <Zap className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Power-Ups */}
                                {step === 'powerups' && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                        <div className="text-center mb-8">
                                            <h3 className="text-3xl font-bold text-white mb-2">⚡ Power-Ups Unlocked</h3>
                                            <p className="text-slate-400">Master these key concepts</p>
                                        </div>
                                        <div className="grid gap-4">
                                            {content.powerUps.map((powerUp, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="p-5 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl border-2 border-accent-cyan/30 hover:border-accent-cyan/50 transition-all hover:scale-105"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex-shrink-0 w-10 h-10 bg-accent-cyan/20 rounded-lg flex items-center justify-center text-xl font-bold text-accent-cyan">
                                                            {idx + 1}
                                                        </div>
                                                        <p className="text-slate-200 text-lg">{powerUp}</p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                        <div className="flex justify-end">
                                            <Button onClick={() => setStep('demo')} size="lg" className="gap-2">
                                                See It In Action <Code className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Interactive Demo */}
                                {step === 'demo' && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-8 rounded-2xl border-2 border-purple-500/30">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-3 bg-purple-500/20 rounded-xl">
                                                    <Code className="w-6 h-6 text-purple-400" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-white">{content.interactiveDemo.title}</h3>
                                            </div>
                                            <p className="text-slate-300 mb-6">{content.interactiveDemo.description}</p>

                                            <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
                                                <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                                    <span className="ml-2 text-xs text-slate-500 font-mono">code.js</span>
                                                </div>
                                                <pre className="p-6 overflow-x-auto text-sm font-mono text-green-400">
                                                    {content.interactiveDemo.code}
                                                </pre>
                                            </div>

                                            <div className="mt-6 p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                                                <p className="text-sm text-slate-300 leading-relaxed">{content.interactiveDemo.explanation}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <Button onClick={() => setStep('boss')} size="lg" className="gap-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600">
                                                Face the Boss Challenge <Trophy className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Boss Challenge */}
                                {step === 'boss' && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                        <div className="text-center mb-8">
                                            <motion.div
                                                animate={{ scale: [1, 1.05, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="inline-block mb-4"
                                            >
                                                <div className="p-6 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl border-2 border-red-500/30">
                                                    <Trophy className="w-16 h-16 text-red-400" />
                                                </div>
                                            </motion.div>
                                            <h3 className="text-3xl font-bold text-white mb-2">🔥 Boss Challenge</h3>
                                            <p className="text-slate-400">Prove your mastery!</p>
                                        </div>

                                        <Card className="p-8 bg-gradient-to-br from-red-500/5 to-orange-500/5 border-2 border-red-500/30">
                                            <h4 className="text-xl font-medium text-white mb-6">{content.bossChallenge.question}</h4>
                                            <div className="space-y-3">
                                                {content.bossChallenge.options.map((option, idx) => (
                                                    <motion.button
                                                        key={idx}
                                                        whileHover={{ scale: isQuizSubmitted ? 1 : 1.02 }}
                                                        whileTap={{ scale: isQuizSubmitted ? 1 : 0.98 }}
                                                        onClick={() => !isQuizSubmitted && setSelectedOption(idx)}
                                                        disabled={isQuizSubmitted}
                                                        className={`w-full p-5 rounded-xl text-left transition-all border-2 ${isQuizSubmitted
                                                                ? idx === content.bossChallenge.correctAnswer
                                                                    ? "bg-green-500/20 border-green-500 text-green-200 shadow-lg shadow-green-500/20"
                                                                    : idx === selectedOption
                                                                        ? "bg-red-500/20 border-red-500 text-red-200"
                                                                        : "bg-slate-900/30 border-slate-800 text-slate-500"
                                                                : selectedOption === idx
                                                                    ? "bg-accent-indigo/20 border-accent-indigo text-white shadow-lg shadow-accent-indigo/20"
                                                                    : "bg-slate-900/50 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600"
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-lg">{option}</span>
                                                            {isQuizSubmitted && idx === content.bossChallenge.correctAnswer && (
                                                                <CheckCircle className="w-6 h-6 text-green-500" />
                                                            )}
                                                            {isQuizSubmitted && idx === selectedOption && idx !== content.bossChallenge.correctAnswer && (
                                                                <XCircle className="w-6 h-6 text-red-500" />
                                                            )}
                                                        </div>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </Card>

                                        {isQuizSubmitted && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-xl border-2 border-accent-cyan/30"
                                            >
                                                <div className="flex items-start gap-3 mb-3">
                                                    <Lightbulb className="w-5 h-5 text-accent-cyan mt-1" />
                                                    <span className="font-bold text-white">Explanation:</span>
                                                </div>
                                                <p className="text-slate-300 leading-relaxed ml-8">{content.bossChallenge.explanation}</p>
                                            </motion.div>
                                        )}

                                        {isQuizSubmitted && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-6 rounded-xl border-2 border-green-500/30"
                                            >
                                                <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                                    <Trophy className="w-6 h-6 text-yellow-400" />
                                                    Victory Rewards
                                                </h4>
                                                <ul className="space-y-2">
                                                    {content.victoryRewards.map((reward, idx) => (
                                                        <motion.li
                                                            key={idx}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: idx * 0.1 }}
                                                            className="flex items-start gap-3 text-slate-300"
                                                        >
                                                            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                                            <span>{reward}</span>
                                                        </motion.li>
                                                    ))}
                                                </ul>
                                            </motion.div>
                                        )}

                                        <div className="flex justify-end gap-3 pt-4">
                                            {!isQuizSubmitted ? (
                                                <Button
                                                    onClick={handleQuizSubmit}
                                                    disabled={selectedOption === null}
                                                    size="lg"
                                                    className="gap-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:from-slate-700 disabled:to-slate-800"
                                                >
                                                    Submit Answer <Zap className="w-5 h-5" />
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={handleFinish}
                                                    size="lg"
                                                    className="gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                                                >
                                                    Complete Mission <Trophy className="w-5 h-5" />
                                                </Button>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center text-red-400 p-8">
                                <p className="text-xl font-bold mb-2">Mission Failed to Load</p>
                                <p className="text-slate-400">Please try again</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
