import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles, Brain, Target, Rocket, Layers } from 'lucide-react';

const LOADING_STEPS = [
    { text: "Analyzing your learning goal...", icon: Brain },
    { text: "Structuring the knowledge path...", icon: Layers },
    { text: "Crafting detailed modules...", icon: Target },
    { text: "Generating gamified challenges...", icon: Sparkles },
    { text: "Finalizing your epic roadmap...", icon: Rocket }
];

const FUN_FACTS = [
    "Did you know? Spaced repetition is one of the most effective ways to learn.",
    "Learning by doing increases retention by up to 75%.",
    "Breaking complex topics into chunks makes them 50% easier to master.",
    "Consistency beats intensity. Small daily steps lead to giant leaps.",
    "Teaching what you learn is the ultimate test of mastery."
];

export default function RoadmapLoading() {
    const [currentStep, setCurrentStep] = useState(0);
    const [currentFact, setCurrentFact] = useState(0);

    useEffect(() => {
        // Cycle through steps
        const stepInterval = setInterval(() => {
            setCurrentStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
        }, 3000); // Change step every 3 seconds

        // Cycle through facts
        const factInterval = setInterval(() => {
            setCurrentFact((prev) => (prev + 1) % FUN_FACTS.length);
        }, 4000);

        return () => {
            clearInterval(stepInterval);
            clearInterval(factInterval);
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-2xl mx-auto p-8 text-center">
            {/* Main Animation */}
            <div className="relative w-32 h-32 mb-12">
                <motion.div
                    className="absolute inset-0 rounded-full border-4 border-slate-800"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                />
                <motion.div
                    className="absolute inset-0 rounded-full border-t-4 border-accent-indigo"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute inset-2 rounded-full border-r-4 border-accent-cyan"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="w-12 h-12 text-white animate-pulse" />
                </div>
            </div>

            {/* Steps Progress */}
            <div className="w-full space-y-6 mb-12">
                <h2 className="text-2xl font-bold text-white mb-2">
                    Building Your Roadmap
                </h2>

                <div className="flex justify-center gap-2 mb-8">
                    {LOADING_STEPS.map((_, index) => (
                        <motion.div
                            key={index}
                            className={`h-1.5 rounded-full transition-all duration-500 ${index <= currentStep ? "w-8 bg-accent-cyan" : "w-2 bg-slate-800"
                                }`}
                        />
                    ))}
                </div>

                <div className="h-16 relative overflow-hidden">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute inset-0 flex items-center justify-center gap-3 text-slate-300"
                    >
                        {React.createElement(LOADING_STEPS[currentStep].icon, { className: "w-5 h-5 text-accent-indigo" })}
                        <span className="text-lg font-medium">{LOADING_STEPS[currentStep].text}</span>
                    </motion.div>
                </div>
            </div>

            {/* Fun Fact Card */}
            <motion.div
                key={currentFact}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 max-w-lg backdrop-blur-sm"
            >
                <div className="flex items-center justify-center gap-2 text-accent-cyan mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Learning Tip</span>
                </div>
                <p className="text-slate-400 italic">
                    "{FUN_FACTS[currentFact]}"
                </p>
            </motion.div>
        </div>
    );
}
