"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { Zap, Target, Brain, Trophy, Clock, Shield, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const benefits = [
    {
        title: "AI-Powered Personalization",
        description: "Our engine analyzes your learning style and goals to craft a unique curriculum just for you.",
        icon: Brain,
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20",
        gradient: "from-purple-500/20 to-purple-600/5"
    },
    {
        title: "Instant Feedback Loop",
        description: "Get real-time corrections and explanations on your code and quizzes. No more waiting.",
        icon: Zap,
        color: "text-yellow-400",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/20",
        gradient: "from-yellow-500/20 to-yellow-600/5"
    },
    {
        title: "Gamified Progression",
        description: "Earn XP, badges, and streaks. We make learning addictive in the best way possible.",
        icon: Trophy,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        gradient: "from-emerald-500/20 to-emerald-600/5"
    },
    {
        title: "Laser-Focused Roadmaps",
        description: "Cut through the noise. We give you exactly what you need to learn, step-by-step.",
        icon: Target,
        color: "text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        gradient: "from-red-500/20 to-red-600/5"
    },
    {
        title: "Save 100+ Hours",
        description: "Stop searching for tutorials. We curate the best resources and structure them for you.",
        icon: Clock,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        gradient: "from-blue-500/20 to-blue-600/5"
    },
    {
        title: "Enterprise-Grade Security",
        description: "Your data and progress are safe with us. Focus on learning, we handle the rest.",
        icon: Shield,
        color: "text-cyan-400",
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/20",
        gradient: "from-cyan-500/20 to-cyan-600/5"
    }
];

function BenefitCard({ benefit, index }: { benefit: typeof benefits[0], index: number }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { width, height, left, top } = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - left) / width - 0.5);
        mouseY.set((e.clientY - top) / height - 0.5);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="group relative perspective-1000"
        >
            {/* Glow Effect */}
            <div className={cn(
                "absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-xl",
                `bg-gradient-to-br ${benefit.gradient}`
            )} />

            {/* Card */}
            <div className={cn(
                "relative p-8 rounded-2xl border backdrop-blur-sm transition-all duration-300",
                "bg-slate-900/50 hover:bg-slate-800/70",
                benefit.border,
                "transform-style-3d"
            )}>
                {/* Icon with floating animation */}
                <motion.div
                    className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center mb-6 relative overflow-hidden",
                        benefit.bg
                    )}
                    animate={{
                        y: [0, -8, 0],
                        rotate: [0, 5, 0]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.2
                    }}
                    style={{ transformStyle: "preserve-3d", translateZ: 20 } as any}
                >
                    <div className={cn(
                        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                        `bg-gradient-to-br ${benefit.gradient}`
                    )} />
                    <benefit.icon className={cn("w-7 h-7 relative z-10", benefit.color)} />
                </motion.div>

                {/* Title */}
                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">
                    {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 leading-relaxed text-base">
                    {benefit.description}
                </p>

                {/* Decorative corner accent */}
                <div className={cn(
                    "absolute top-4 right-4 w-20 h-20 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl",
                    benefit.bg
                )} />
            </div>
        </motion.div>
    );
}

export function KeyBenefits() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Multi-layer parallax with dramatic speed differences
    const yGrid = useTransform(scrollYProgress, [0, 1], [200, -200]);
    const yOrbs = useTransform(scrollYProgress, [0, 1], [-100, 100]);
    const ySparkles = useTransform(scrollYProgress, [0, 1], [-150, 150]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

    return (
        <section ref={containerRef} className="py-32 relative overflow-hidden bg-[#020617] perspective-[2000px]">
            {/* DEEP PARALLAX BACKGROUND LAYERS */}
            <div className="absolute inset-0 z-0 transform-style-3d">
                {/* Layer 0: Dark gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617]" />

                {/* Layer 1: Animated Grid (Fastest Parallax) */}
                <motion.div
                    style={{ y: yGrid }}
                    className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"
                />

                {/* Layer 2: Floating Orbs (Medium Parallax) */}
                <motion.div
                    style={{ y: yOrbs }}
                    className="absolute inset-0 pointer-events-none"
                >
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }}
                        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full"
                    />
                </motion.div>

                {/* Layer 3: Floating sparkles (Slowest Parallax) */}
                <motion.div style={{ y: ySparkles }} className="absolute inset-0 pointer-events-none">
                    {[...Array(15)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute pointer-events-none"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, -30, 0],
                                opacity: [0.2, 0.8, 0.2],
                                scale: [1, 1.5, 1]
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 2
                            }}
                        >
                            <Sparkles className="w-4 h-4 text-purple-400" />
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* CONTENT */}
            <motion.div
                style={{ opacity, scale }}
                className="container mx-auto px-4 relative z-10"
            >
                {/* Section Header */}
                <div className="text-center max-w-4xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
                    >
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                        <span className="text-sm font-medium text-slate-300">Why We're Different</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-[1.1]"
                    >
                        Why Choose{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 animate-gradient-x">
                            EduMate AI?
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-400 leading-relaxed"
                    >
                        We're not just another course platform. We're your intelligent co-pilot for mastering any skill{" "}
                        <span className="text-cyan-400 font-semibold">10x faster</span> than traditional methods.
                    </motion.p>
                </div>

                {/* Benefits Grid with 3D Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {benefits.map((benefit, index) => (
                        <BenefitCard key={index} benefit={benefit} index={index} />
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-20"
                >
                    <div className="inline-flex items-center gap-2 text-slate-400">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-slate-700" />
                        <span className="text-sm">Join 10,000+ learners already accelerating their growth</span>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-slate-700" />
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
