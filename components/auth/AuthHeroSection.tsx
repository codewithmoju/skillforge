"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Trophy, Target } from "lucide-react";
import { usePerformance } from "@/lib/hooks/usePerformance";

interface AuthHeroSectionProps {
    variant: "login" | "signup";
}

export function AuthHeroSection({ variant }: AuthHeroSectionProps) {
    const { shouldReduceAnimations } = usePerformance();

    const loginContent = {
        title: "Welcome Back",
        words: ["Continue", "Learning", "Growing", "Achieving"],
        subtitle: "Pick up right where you left off",
        features: [
            { icon: Trophy, text: "Track your progress" },
            { icon: Zap, text: "Maintain your streak" },
            { icon: Target, text: "Reach your goals" },
        ],
    };

    const signupContent = {
        title: "Start Your Journey",
        words: ["Learn", "Master", "Achieve", "Excel"],
        subtitle: "Join thousands of learners worldwide",
        features: [
            { icon: Sparkles, text: "AI-powered roadmaps" },
            { icon: Trophy, text: "Gamified learning" },
            { icon: Zap, text: "Track your progress" },
        ],
    };

    const content = variant === "login" ? loginContent : signupContent;

    return (
        <div className="relative h-full flex flex-col items-center justify-center p-8 lg:p-12">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-indigo/10 via-accent-violet/10 to-accent-cyan/10" />

            {/* Animated Orb */}
            {!shouldReduceAnimations && (
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-accent-indigo/20 to-accent-cyan/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            )}

            {/* Content */}
            <div className="relative z-10 text-center max-w-lg">
                {/* Main Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6"
                >
                    {content.title}
                </motion.h1>

                {/* Animated Rotating Words */}
                <div className="h-20 lg:h-24 mb-6 flex items-center justify-center">
                    <motion.div
                        key={variant}
                        className="text-5xl lg:text-6xl xl:text-7xl font-bold"
                    >
                        {content.words.map((word, index) => (
                            <motion.span
                                key={word}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: [0, 1, 1, 0],
                                    y: [20, 0, 0, -20],
                                }}
                                transition={{
                                    duration: 2,
                                    delay: index * 2,
                                    repeat: Infinity,
                                    repeatDelay: (content.words.length - 1) * 2,
                                }}
                                className="absolute inset-0 bg-gradient-to-r from-accent-indigo via-accent-violet to-accent-cyan bg-clip-text text-transparent"
                                style={{
                                    display: "block",
                                }}
                            >
                                {word}
                            </motion.span>
                        ))}
                    </motion.div>
                </div>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg lg:text-xl text-slate-400 mb-12"
                >
                    {content.subtitle}
                </motion.p>

                {/* Features */}
                <div className="space-y-4">
                    {content.features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={feature.text}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                                className="flex items-center gap-4 text-slate-300"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-accent-indigo/20 to-accent-cyan/20 border border-white/10 flex items-center justify-center"
                                >
                                    <Icon className="w-5 h-5 text-accent-cyan" />
                                </motion.div>
                                <span className="text-base lg:text-lg">{feature.text}</span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
