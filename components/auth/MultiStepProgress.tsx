"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface Step {
    id: string;
    title: string;
    description: string;
}

interface MultiStepProgressProps {
    steps: Step[];
    currentStep: string;
    completedSteps: string[];
    onStepClick?: (stepId: string) => void;
}

export function MultiStepProgress({
    steps,
    currentStep,
    completedSteps,
    onStepClick
}: MultiStepProgressProps) {
    const currentStepIndex = steps.findIndex(step => step.id === currentStep);
    const progress = ((currentStepIndex + 1) / steps.length) * 100;

    return (
        <div className="w-full mb-8">
            {/* Progress Bar */}
            <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden mb-6">
                <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent-indigo to-accent-cyan"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                />
            </div>

            {/* Steps */}
            <div className="flex justify-between items-start">
                {steps.map((step, index) => {
                    const isCompleted = completedSteps.includes(step.id);
                    const isCurrent = step.id === currentStep;
                    const isClickable = isCompleted && onStepClick;

                    return (
                        <div
                            key={step.id}
                            className="flex-1 relative"
                            onClick={() => isClickable && onStepClick(step.id)}
                        >
                            <div className={`flex flex-col items-center ${isClickable ? 'cursor-pointer' : ''}`}>
                                {/* Step Circle */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: index * 0.1, type: "spring" }}
                                    className={`
                                        relative w-10 h-10 rounded-full flex items-center justify-center
                                        ${isCompleted
                                            ? 'bg-gradient-to-br from-accent-indigo to-accent-cyan'
                                            : isCurrent
                                                ? 'bg-gradient-to-br from-accent-indigo/50 to-accent-cyan/50 border-2 border-accent-indigo'
                                                : 'bg-slate-800 border-2 border-slate-700'
                                        }
                                        ${isClickable ? 'hover:scale-110 transition-transform' : ''}
                                    `}
                                >
                                    {isCompleted ? (
                                        <CheckCircle2 className="w-5 h-5 text-white" />
                                    ) : (
                                        <span className={`text-sm font-bold ${isCurrent ? 'text-white' : 'text-slate-500'}`}>
                                            {index + 1}
                                        </span>
                                    )}

                                    {/* Pulse animation for current step */}
                                    {isCurrent && (
                                        <motion.div
                                            className="absolute inset-0 rounded-full bg-accent-indigo/30"
                                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    )}
                                </motion.div>

                                {/* Step Label */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 + 0.2 }}
                                    className="mt-3 text-center"
                                >
                                    <div className={`text-sm font-medium ${isCurrent ? 'text-white' : 'text-slate-400'}`}>
                                        {step.title}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1 hidden sm:block">
                                        {step.description}
                                    </div>
                                </motion.div>
                            </div>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="absolute top-5 left-1/2 w-full h-0.5 bg-slate-800 -z-10">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-accent-indigo to-accent-cyan"
                                        initial={{ width: 0 }}
                                        animate={{ width: isCompleted ? '100%' : '0%' }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
