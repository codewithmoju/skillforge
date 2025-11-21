import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Code, CheckCircle, HelpCircle, ChevronRight, Sparkles, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import ReactMarkdown from 'react-markdown';

interface LessonContent {
    title: string;
    introduction: string;
    content: string;
    examples: { title: string; code: string; explanation: string }[];
    quiz: {
        question: string;
        options: string[];
        correctAnswer: number;
        explanation: string;
    };
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
    const [content, setContent] = useState<LessonContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [step, setStep] = useState<'intro' | 'content' | 'quiz'>('intro');
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

    useEffect(() => {
        if (isOpen && lessonTitle) {
            fetchContent();
        } else {
            // Reset state on close
            setContent(null);
            setStep('intro');
            setSelectedOption(null);
            setIsQuizSubmitted(false);
        }
    }, [isOpen, lessonTitle]);

    const fetchContent = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/generate-lesson', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, moduleTitle, lessonTitle }),
            });
            const data = await res.json();
            if (data.content) {
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

    const handleFinish = () => {
        onComplete();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-accent-indigo" />
                                {lessonTitle}
                            </h2>
                            <p className="text-sm text-slate-400">{moduleTitle}</p>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                                <div className="w-12 h-12 border-4 border-accent-indigo border-t-transparent rounded-full animate-spin" />
                                <p className="text-slate-400 animate-pulse">Generating personalized lesson content...</p>
                            </div>
                        ) : content ? (
                            <div className="space-y-8">
                                {step === 'intro' && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                        <div className="bg-gradient-to-r from-accent-indigo/10 to-accent-cyan/10 p-6 rounded-xl border border-accent-indigo/20">
                                            <h3 className="text-lg font-semibold text-accent-cyan mb-2 flex items-center gap-2">
                                                <Sparkles className="w-4 h-4" /> Introduction
                                            </h3>
                                            <p className="text-slate-200 leading-relaxed text-lg">{content.introduction}</p>
                                        </div>
                                        <div className="flex justify-end">
                                            <Button onClick={() => setStep('content')} className="gap-2">
                                                Start Learning <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 'content' && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                        <div className="prose prose-invert max-w-none">
                                            <ReactMarkdown>{content.content}</ReactMarkdown>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                                <Code className="w-5 h-5 text-accent-purple" /> Examples
                                            </h3>
                                            {content.examples.map((ex, i) => (
                                                <Card key={i} className="bg-slate-950 border-slate-800 p-4">
                                                    <div className="text-sm font-medium text-slate-300 mb-2">{ex.title}</div>
                                                    <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto text-sm font-mono text-accent-cyan mb-3">
                                                        {ex.code}
                                                    </pre>
                                                    <p className="text-sm text-slate-400 italic">{ex.explanation}</p>
                                                </Card>
                                            ))}
                                        </div>

                                        <div className="flex justify-end">
                                            <Button onClick={() => setStep('quiz')} className="gap-2">
                                                Take Mini Quiz <HelpCircle className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 'quiz' && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                        <div className="text-center mb-8">
                                            <h3 className="text-2xl font-bold text-white mb-2">Knowledge Check</h3>
                                            <p className="text-slate-400">Prove your mastery of this lesson!</p>
                                        </div>

                                        <Card className="p-6 bg-slate-800/50 border-slate-700">
                                            <h4 className="text-lg font-medium text-white mb-6">{content.quiz.question}</h4>
                                            <div className="space-y-3">
                                                {content.quiz.options.map((option, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => !isQuizSubmitted && setSelectedOption(idx)}
                                                        disabled={isQuizSubmitted}
                                                        className={`w-full p-4 rounded-xl text-left transition-all border ${isQuizSubmitted
                                                                ? idx === content.quiz.correctAnswer
                                                                    ? "bg-green-500/20 border-green-500 text-green-200"
                                                                    : idx === selectedOption
                                                                        ? "bg-red-500/20 border-red-500 text-red-200"
                                                                        : "bg-slate-900/50 border-slate-800 text-slate-500"
                                                                : selectedOption === idx
                                                                    ? "bg-accent-indigo/20 border-accent-indigo text-white"
                                                                    : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span>{option}</span>
                                                            {isQuizSubmitted && idx === content.quiz.correctAnswer && (
                                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                                            )}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </Card>

                                        {isQuizSubmitted && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                                <p className="text-slate-300 text-sm">
                                                    <span className="font-bold text-white">Explanation: </span>
                                                    {content.quiz.explanation}
                                                </p>
                                            </motion.div>
                                        )}

                                        <div className="flex justify-end gap-3 pt-4">
                                            {!isQuizSubmitted ? (
                                                <Button
                                                    onClick={handleQuizSubmit}
                                                    disabled={selectedOption === null}
                                                    className="w-full md:w-auto"
                                                >
                                                    Submit Answer
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={handleFinish}
                                                    className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white"
                                                >
                                                    Complete Lesson <CheckCircle className="w-4 h-4 ml-2" />
                                                </Button>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center text-red-400">Failed to load content. Please try again.</div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
