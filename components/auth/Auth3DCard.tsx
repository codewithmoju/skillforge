"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { Trophy, Zap, Target, Sparkles, TrendingUp, Award } from "lucide-react";
import { usePerformance } from "@/lib/hooks/usePerformance";
import { useEffect, useState } from "react";

interface Auth3DCardProps {
    variant: "login" | "signup";
}

export function Auth3DCard({ variant }: Auth3DCardProps) {
    const { shouldReduceAnimations } = usePerformance();
    const [isMounted, setIsMounted] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
    const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (shouldReduceAnimations) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    const loginContent = {
        title: "Welcome Back",
        subtitle: "Continue Your Journey",
        stats: [
            { icon: Trophy, label: "Achievements", value: "12", color: "from-amber-500 to-orange-500" },
            { icon: Zap, label: "Day Streak", value: "7", color: "from-accent-indigo to-accent-violet" },
            { icon: Target, label: "Goals", value: "5", color: "from-emerald-500 to-green-500" },
        ],
    };

    const signupContent = {
        title: "Start Your Journey",
        subtitle: "Join Thousands of Learners",
        stats: [
            { icon: Sparkles, label: "AI Roadmaps", value: "500+", color: "from-pink-500 to-rose-500" },
            { icon: TrendingUp, label: "Success Rate", value: "95%", color: "from-emerald-500 to-green-500" },
            { icon: Award, label: "Active Users", value: "10K+", color: "from-accent-cyan to-blue-500" },
        ],
    };

    const content = variant === "login" ? loginContent : signupContent;

    if (!isMounted) {
        return (
            <div className="relative h-full flex items-center justify-center p-8">
                <div className="w-full max-w-lg aspect-square bg-slate-900/50 rounded-3xl animate-pulse" />
            </div>
        );
    }

    return (
        <div className="relative h-full flex items-center justify-center p-4 md:p-8 lg:p-12">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-indigo/10 via-accent-violet/10 to-accent-cyan/10" />

            {/* Animated Orbs */}
            {!shouldReduceAnimations && (
                <>
                    <motion.div
                        className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-accent-indigo/20 to-accent-violet/20 rounded-full blur-3xl"
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    <motion.div
                        className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-accent-cyan/20 to-blue-500/20 rounded-full blur-3xl"
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.4, 0.6, 0.4],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </>
            )}

            {/* 3D Card Container */}
            <motion.div
                className="relative z-10 w-full max-w-lg"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    perspective: 1000,
                }}
            >
                <motion.div
                    className="relative w-full aspect-square"
                    style={{
                        rotateX: shouldReduceAnimations ? 0 : rotateX,
                        rotateY: shouldReduceAnimations ? 0 : rotateY,
                        transformStyle: "preserve-3d",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    {/* Glowing Background */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-accent-indigo/30 to-accent-cyan/30 rounded-full blur-3xl animate-pulse" />

                    {/* Main Card */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                        {/* Top Gradient Bar */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-indigo via-accent-violet to-accent-cyan" />

                        {/* Card Content */}
                        <div className="p-6 md:p-8 h-full flex flex-col">
                            {/* Header */}
                            <div className="mb-6">
                                <motion.h3
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-2xl md:text-3xl font-bold text-white mb-2"
                                >
                                    {content.title}
                                </motion.h3>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-slate-400"
                                >
                                    {content.subtitle}
                                </motion.p>
                            </div>

                            {/* Stats Cards */}
                            <div className="flex-1 space-y-3">
                                {content.stats.map((stat, index) => {
                                    const Icon = stat.icon;
                                    return (
                                        <motion.div
                                            key={stat.label}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 + index * 0.1 }}
                                            whileHover={{ scale: 1.02, x: 5 }}
                                            className="relative group"
                                        >
                                            <div className="h-20 md:h-24 w-full bg-white/5 rounded-xl border border-white/5 p-4 flex items-center gap-4 hover:bg-white/10 transition-all">
                                                {/* Icon */}
                                                <motion.div
                                                    className={`w-12 h-12 md:w-14 md:h-14 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg flex-shrink-0`}
                                                    whileHover={{ rotate: 360 }}
                                                    transition={{ duration: 0.6 }}
                                                >
                                                    <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                                                </motion.div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <motion.div
                                                        className="text-xl md:text-2xl font-bold text-white mb-1"
                                                        animate={{ opacity: [0.7, 1, 0.7] }}
                                                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                                                    >
                                                        {stat.value}
                                                    </motion.div>
                                                    <div className="text-xs md:text-sm text-slate-400 truncate">
                                                        {stat.label}
                                                    </div>
                                                </div>

                                                {/* Hover Glow */}
                                                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity pointer-events-none`} />
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Floating Achievement Badges */}
                    {!shouldReduceAnimations && (
                        <>
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-6 -right-6 md:-top-10 md:-right-10 p-3 md:p-4 bg-slate-800/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl"
                                style={{ transform: "translateZ(50px)" }}
                            >
                                <div className="flex items-center gap-2 md:gap-3">
                                    <div className="p-1.5 md:p-2 bg-green-500/20 rounded-lg">
                                        <Trophy className="w-4 h-4 md:w-6 md:h-6 text-green-500" />
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="text-xs md:text-sm font-bold text-white">Level Up!</div>
                                        <div className="text-[10px] md:text-xs text-slate-400">You reached Lvl 5</div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 20, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -bottom-6 -left-6 md:-bottom-10 md:-left-10 p-3 md:p-4 bg-slate-800/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl"
                                style={{ transform: "translateZ(50px)" }}
                            >
                                <div className="flex items-center gap-2 md:gap-3">
                                    <div className="p-1.5 md:p-2 bg-accent-indigo/20 rounded-lg">
                                        <Zap className="w-4 h-4 md:w-6 md:h-6 text-accent-indigo" />
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="text-xs md:text-sm font-bold text-white">7 Day Streak</div>
                                        <div className="text-[10px] md:text-xs text-slate-400">Keep it going!</div>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
}
