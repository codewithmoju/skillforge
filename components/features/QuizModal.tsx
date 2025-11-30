"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Loader2, CheckCircle, XCircle, Trophy } from "lucide-react";
import { useUserStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
}

interface QuizModalProps {
    isOpen: boolean;
    onClose: () => void;
    topic: string;
    level: number;
    nodeId: string;
}

export function QuizModal({ isOpen, onClose, topic, level, nodeId }: QuizModalProps) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const { completeQuiz, completedQuizzes } = useUserStore();

    useEffect(() => {
        if (isOpen && questions.length === 0) {
            fetchQuiz();
        }
    }, [isOpen, topic, level]);

    const fetchQuiz = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/generate-quiz", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic, level }),
            });
            const data = await res.json();
            if (data.quiz) {
                setQuestions(data.quiz);
            }
        } catch (error) {
            console.error("Failed to load quiz", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (index: number) => {
        if (selectedOption !== null) return; // Prevent changing answer
        setSelectedOption(index);

        const isCorrect = index === questions[currentQuestionIndex].correctAnswer;
        if (isCorrect) {
            setScore(s => s + 1);
        }

        // Auto advance after delay
        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedOption(null);
            } else {
                setShowResults(true);
                handleCompletion(score + (isCorrect ? 1 : 0));
            }
        }, 1500);
    };

    const handleCompletion = (finalScore: number) => {
        const percentage = (finalScore / questions.length) * 100;
        if (percentage >= 60) {
            // Only award XP if not already completed
            if (!completedQuizzes?.includes(nodeId)) {
                completeQuiz(nodeId);
            }
        }
    };

    const handleClose = () => {
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setScore(0);
        setShowResults(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={`Quiz: ${topic} (Level ${level})`}
            className="max-w-2xl"
        >
            {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-12 h-12 text-accent-indigo animate-spin mb-4" />
                    <p className="text-slate-400">Summoning the challenge...</p>
                </div>
            ) : showResults ? (
                <div className="text-center py-8">
                    <div className="mb-6 flex justify-center">
                        <div className="relative">
                            <Trophy className={cn(
                                "w-24 h-24",
                                score / questions.length >= 0.6 ? "text-yellow-500" : "text-slate-600"
                            )} />
                            {score / questions.length >= 0.6 && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-2 -right-2 bg-accent-cyan text-slate-900 font-bold rounded-full w-8 h-8 flex items-center justify-center"
                                >
                                    +{score * 20}
                                </motion.div>
                            )}
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">
                        {score / questions.length >= 0.6 ? "Victory!" : "Defeat!"}
                    </h3>
                    <p className="text-slate-400 mb-8">
                        You scored {score} out of {questions.length}
                    </p>

                    <Button onClick={handleClose} className="w-full max-w-xs">
                        Return to Map
                    </Button>
                </div>
            ) : questions.length > 0 ? (
                <div>
                    <div className="mb-6 flex justify-between items-center text-sm text-slate-400">
                        <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                        <span>Score: {score}</span>
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-6">
                        {questions[currentQuestionIndex].question}
                    </h3>

                    <div className="space-y-3">
                        {questions[currentQuestionIndex].options.map((option, index) => {
                            const isSelected = selectedOption === index;
                            const isCorrect = index === questions[currentQuestionIndex].correctAnswer;
                            const showCorrect = selectedOption !== null && isCorrect;
                            const showWrong = isSelected && !isCorrect;

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleOptionSelect(index)}
                                    disabled={selectedOption !== null}
                                    className={cn(
                                        "w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between",
                                        showCorrect ? "bg-green-500/20 border-green-500 text-green-400" :
                                            showWrong ? "bg-red-500/20 border-red-500 text-red-400" :
                                                "bg-slate-800/50 border-slate-700 text-slate-200 hover:border-accent-indigo hover:bg-slate-800"
                                    )}
                                >
                                    <span>{option}</span>
                                    {showCorrect && <CheckCircle className="w-5 h-5" />}
                                    {showWrong && <XCircle className="w-5 h-5" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 text-slate-400">
                    Failed to load questions.
                </div>
            )}
        </Modal>
    );
}
