"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap, Target, Trophy, Code, Sparkles, CheckCircle, XCircle, Lightbulb, Rocket, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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

export default function LessonPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { completeLesson, currentTopic, roadmapDefinitions, roadmapProgress } = useUserStore();

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
            } else {
                console.error('Invalid lesson content:', data);
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
            completeLesson(nodeId);
        }
        router.push('/roadmap');
    };

    const progressSteps = ['briefing', 'analogy', 'powerups', 'demo', 'boss'];
    const currentProgress = ((progressSteps.indexOf(step) + 1) / progressSteps.length) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Mission Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-2 bg-slate-950 z-50">
                <motion.div
                    className="h-full bg-gradient-to-r from-accent-indigo via-accent-purple to-accent-cyan"
                    initial={{ width: 0 }}
                    animate={{ width: `${currentProgress}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            {/* Header */}
            <div className="sticky top-2 z-40 px-6 py-4">
                <div className="max-w-6xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-4 flex items-center justify-between shadow-2xl">
                    <button
                        onClick={() => router.push('/roadmap')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back to Roadmap</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <Rocket className="w-5 h-5 text-accent-cyan" />
                        <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-accent-cyan">Mission {lessonIndex}</div>
                            <div className="text-sm font-medium text-white">{lessonTitle}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-accent-indigo/20 rounded-lg border border-accent-indigo/30">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-bold text-white">{Math.round(currentProgress)}%</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-6 py-8">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-[70vh] space-y-6">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-24 h-24 border-4 border-accent-indigo border-t-transparent rounded-full"
                        />
                        <div className="text-center space-y-2">
                            <p className="text-2xl font-bold text-white">Preparing Your Mission...</p>
                            <p className="text-slate-400">Crafting the perfect learning experience</p>
                        </div>
                    </div>
                ) : content ? (
                    <AnimatePresence mode="wait">
                        {/* Mission Briefing */}
                        {step === 'briefing' && (
                            <motion.div
                                key="briefing"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                <div className="relative overflow-hidden bg-gradient-to-br from-accent-indigo/20 via-accent-purple/20 to-accent-cyan/20 p-12 rounded-3xl border-2 border-accent-indigo/30">
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl -mr-48 -mt-48" />
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="p-4 bg-accent-indigo/20 rounded-2xl border border-accent-indigo/30">
                                                <Target className="w-8 h-8 text-accent-indigo" />
                                            </div>
                                            <h2 className="text-4xl font-bold text-white">Mission Briefing</h2>
                                        </div>
                                        <p className="text-xl text-slate-200 leading-relaxed">{content.missionBriefing}</p>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button onClick={() => setStep('analogy')} size="lg" className="gap-2 text-lg px-8 py-6 bg-gradient-to-r from-accent-indigo to-accent-purple hover:from-accent-indigo/80 hover:to-accent-purple/80">
                                        Accept Mission <Zap className="w-6 h-6" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Real World Analogy */}
                        {step === 'analogy' && (
                            <motion.div
                                key="analogy"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                <Card className="p-12 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-2 border-amber-500/30">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-4 bg-amber-500/20 rounded-2xl">
                                            <Lightbulb className="w-8 h-8 text-amber-400" />
                                        </div>
                                        <h2 className="text-4xl font-bold text-white">{content.realWorldAnalogy?.title || "The 'Aha!' Moment"}</h2>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-700">
                                            <p className="text-xl text-slate-200 leading-relaxed italic">{content.realWorldAnalogy?.analogy}</p>
                                        </div>
                                        <div className="flex items-start gap-4 p-6 bg-amber-500/5 rounded-xl border border-amber-500/20">
                                            <Sparkles className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
                                            <p className="text-lg text-slate-300">{content.realWorldAnalogy?.connection}</p>
                                        </div>
                                    </div>
                                </Card>
                                <div className="flex justify-end">
                                    <Button onClick={() => setStep('powerups')} size="lg" className="gap-2 text-lg px-8 py-6">
                                        Continue <Zap className="w-6 h-6" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Power-Ups */}
                        {step === 'powerups' && (
                            <motion.div
                                key="powerups"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                <div className="text-center mb-12">
                                    <h2 className="text-5xl font-bold text-white mb-4">⚡ Power-Ups Unlocked</h2>
                                    <p className="text-xl text-slate-400">Master these key concepts</p>
                                </div>
                                <div className="grid gap-6">
                                    {content.powerUps?.map((powerUp, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.15 }}
                                            className="p-8 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl border-2 border-accent-cyan/30 hover:border-accent-cyan/50 transition-all hover:scale-105"
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="flex-shrink-0 w-16 h-16 bg-accent-cyan/20 rounded-xl flex items-center justify-center text-2xl font-bold text-accent-cyan">
                                                    {idx + 1}
                                                </div>
                                                <p className="text-slate-200 text-xl">{powerUp}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                <div className="flex justify-end">
                                    <Button onClick={() => setStep('demo')} size="lg" className="gap-2 text-lg px-8 py-6">
                                        See It In Action <Code className="w-6 h-6" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Interactive Demo */}
                        {step === 'demo' && (
                            <motion.div
                                key="demo"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-12 rounded-3xl border-2 border-purple-500/30">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-4 bg-purple-500/20 rounded-2xl">
                                            <Code className="w-8 h-8 text-purple-400" />
                                        </div>
                                        <h2 className="text-4xl font-bold text-white">{content.interactiveDemo?.title || "Hands-On Challenge"}</h2>
                                    </div>
                                    <p className="text-lg text-slate-300 mb-8">{content.interactiveDemo?.description}</p>

                                    <div className="bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-800">
                                        <div className="bg-slate-900 px-6 py-3 border-b border-slate-800 flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-red-500" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                            <div className="w-3 h-3 rounded-full bg-green-500" />
                                            <span className="ml-3 text-sm text-slate-500 font-mono">code.js</span>
                                        </div>
                                        <pre className="p-8 overflow-x-auto text-base font-mono text-green-400">
                                            {content.interactiveDemo?.code}
                                        </pre>
                                    </div>

                                    <div className="mt-8 p-6 bg-slate-900/50 rounded-2xl border border-slate-700">
                                        <p className="text-base text-slate-300 leading-relaxed">{content.interactiveDemo?.explanation}</p>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button onClick={() => setStep('boss')} size="lg" className="gap-2 text-lg px-8 py-6 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600">
                                        Face the Boss Challenge <Trophy className="w-6 h-6" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Boss Challenge */}
                        {step === 'boss' && (
                            <motion.div
                                key="boss"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                <div className="text-center mb-12">
                                    <motion.div
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="inline-block mb-6"
                                    >
                                        <div className="p-8 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-3xl border-2 border-red-500/30">
                                            <Trophy className="w-20 h-20 text-red-400" />
                                        </div>
                                    </motion.div>
                                    <h2 className="text-5xl font-bold text-white mb-4">🔥 Boss Challenge</h2>
                                    <p className="text-xl text-slate-400">Prove your mastery!</p>
                                </div>

                                <Card className="p-12 bg-gradient-to-br from-red-500/5 to-orange-500/5 border-2 border-red-500/30">
                                    <h3 className="text-2xl font-medium text-white mb-8">{content.bossChallenge?.question}</h3>
                                    <div className="space-y-4">
                                        {content.bossChallenge?.options?.map((option, idx) => (
                                            <motion.button
                                                key={idx}
                                                whileHover={{ scale: isQuizSubmitted ? 1 : 1.02 }}
                                                whileTap={{ scale: isQuizSubmitted ? 1 : 0.98 }}
                                                onClick={() => !isQuizSubmitted && setSelectedOption(idx)}
                                                disabled={isQuizSubmitted}
                                                className={`w-full p-6 rounded-2xl text-left transition-all border-2 ${isQuizSubmitted
                                                        ? idx === content?.bossChallenge?.correctAnswer
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
                                                    <span className="text-xl">{option}</span>
                                                    {isQuizSubmitted && idx === content?.bossChallenge?.correctAnswer && (
                                                        <CheckCircle className="w-7 h-7 text-green-500" />
                                                    )}
                                                    {isQuizSubmitted && idx === selectedOption && idx !== content?.bossChallenge?.correctAnswer && (
                                                        <XCircle className="w-7 h-7 text-red-500" />
                                                    )}
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </Card>

                                {isQuizSubmitted && (
                                    <>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 rounded-2xl border-2 border-accent-cyan/30"
                                        >
                                            <div className="flex items-start gap-4 mb-4">
                                                <Lightbulb className="w-6 h-6 text-accent-cyan mt-1" />
                                                <span className="text-xl font-bold text-white">Explanation:</span>
                                            </div>
                                            <p className="text-lg text-slate-300 leading-relaxed ml-10">{content.bossChallenge?.explanation}</p>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-8 rounded-2xl border-2 border-green-500/30"
                                        >
                                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                                <Trophy className="w-8 h-8 text-yellow-400" />
                                                Victory Rewards
                                            </h3>
                                            <ul className="space-y-3">
                                                {content.victoryRewards?.map((reward, idx) => (
                                                    <motion.li
                                                        key={idx}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.1 }}
                                                        className="flex items-start gap-4 text-slate-300 text-lg"
                                                    >
                                                        <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                                                        <span>{reward}</span>
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    </>
                                )}

                                <div className="flex justify-end gap-4 pt-6">
                                    {!isQuizSubmitted ? (
                                        <Button
                                            onClick={handleQuizSubmit}
                                            disabled={selectedOption === null}
                                            size="lg"
                                            className="gap-2 text-lg px-8 py-6 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:from-slate-700 disabled:to-slate-800"
                                        >
                                            Submit Answer <Zap className="w-6 h-6" />
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleComplete}
                                            size="lg"
                                            className="gap-2 text-lg px-8 py-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                                        >
                                            Complete Mission <Trophy className="w-6 h-6" />
                                        </Button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                ) : (
                    <div className="text-center text-red-400 p-12">
                        <p className="text-2xl font-bold mb-2">Mission Failed to Load</p>
                        <p className="text-lg text-slate-400 mb-6">Please try again</p>
                        <Button onClick={() => router.push('/roadmap')}>Return to Roadmap</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
