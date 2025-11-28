"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Brain, Sparkles, Zap, CheckCircle2 } from "lucide-react";

const steps = [
    { text: "Analyzing topic...", icon: Brain },
    { text: "Structuring modules...", icon: Zap },
    { text: "Generating lessons...", icon: Sparkles },
    { text: "Finalizing curriculum...", icon: CheckCircle2 }
];

export function CourseGenerationLoader() {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center">
            <div className="w-full max-w-md px-6 text-center">
                {/* Animated Icon */}
                <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="absolute inset-0 bg-accent-indigo/20 rounded-full blur-xl animate-pulse" />
                    <div className="relative w-full h-full bg-slate-900 rounded-full border border-accent-indigo/30 flex items-center justify-center">
                        {(() => {
                            const Icon = steps[currentStep].icon;
                            return <Icon className="w-10 h-10 text-accent-cyan animate-bounce" />;
                        })()}
                    </div>
                    {/* Spinning Ring */}
                    <div className="absolute inset-0 border-2 border-accent-cyan/30 border-t-transparent rounded-full animate-spin" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">
                    Creating your course
                </h2>
                <p className="text-slate-400 mb-8">
                    {steps[currentStep].text}
                </p>

                {/* Progress Bar */}
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-accent-indigo to-accent-cyan"
                        initial={{ width: "0%" }}
                        animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </div>
            </div>
        </div>
    );
}
