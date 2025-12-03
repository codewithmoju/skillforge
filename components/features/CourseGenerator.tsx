"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Sparkles, Video, Mic, FileText, ArrowRight, PlayCircle, BookOpen, Headphones, Box, RotateCcw, Atom, Layers, Clock, Star, Brain, Target, Zap, Trophy, ShieldCheck, Dna } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const COURSE_FEATURES = [
    {
        id: 1,
        title: "AI Syllabus Architect",
        desc: "Instantly structures a complete, logical learning path tailored to your specific goals and skill level.",
        icon: Brain,
        color: "from-cyan-400 to-blue-600",
        stat: "100% Personalized"
    },
    {
        id: 2,
        title: "Multi-Modal Learning",
        desc: "Generates content in every format: Video scripts for visual learners, Audio for on-the-go, and Text for deep reading.",
        icon: Layers,
        color: "from-violet-400 to-purple-600",
        stat: "3 Formats / Topic"
    },
    {
        id: 3,
        title: "Interactive Quizzes",
        desc: "Auto-generates smart quizzes and knowledge checks to ensure you've mastered the concepts before moving on.",
        icon: ShieldCheck,
        color: "from-emerald-400 to-teal-600",
        stat: "Instant Feedback"
    },
    {
        id: 4,
        title: "Hands-on Labs",
        desc: "Creates practical coding challenges and real-world projects to apply what you've learned immediately.",
        icon: Box,
        color: "from-pink-400 to-rose-600",
        stat: "Practical Skills"
    },
    {
        id: 5,
        title: "Gamified Progress",
        desc: "Earn XP, unlock achievements, and maintain streaks as you complete lessons and master new skills.",
        icon: Trophy,
        color: "from-amber-400 to-orange-600",
        stat: "Addictive Growth"
    },
];

export function CourseGenerator() {
    const containerRef = useRef<HTMLDivElement>(null);
    const pinContainerRef = useRef<HTMLDivElement>(null);
    const featuresRef = useRef<HTMLDivElement>(null);
    const [activeFeature, setActiveFeature] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!containerRef.current || !pinContainerRef.current) return;

        const ctx = gsap.context(() => {

            // Pinning Logic
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                pin: pinContainerRef.current,
                scrub: 1,
            });

            // Feature Activation
            const features = gsap.utils.toArray(".course-feature");
            features.forEach((feature: any, i) => {
                ScrollTrigger.create({
                    trigger: feature,
                    start: "top center",
                    end: "bottom center",
                    onEnter: () => setActiveFeature(i),
                    onEnterBack: () => setActiveFeature(i),
                });
            });

            // Floating Particles Animation
            gsap.to(".floating-particle", {
                y: -100,
                opacity: 0,
                duration: "random(2, 5)",
                repeat: -1,
                stagger: {
                    amount: 2,
                    from: "random"
                },
                ease: "none"
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative min-h-screen w-full bg-[#020617] text-white overflow-hidden">

            {/* Bioluminescent Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-900/20 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/20 blur-[120px] rounded-full mix-blend-screen" />

                {/* DNA/Helix Pattern */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [transform:perspective(1000px)_rotateX(60deg)] opacity-30" />

                {/* Floating Particles */}
                {mounted && [...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="floating-particle absolute w-1 h-1 bg-cyan-400 rounded-full blur-[1px]"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>

            <div className="container mx-auto px-4 relative z-10 h-full">

                <div className="flex flex-col lg:flex-row h-full">

                    {/* Pinned Feature Showcase (Left) */}
                    <div className="hidden lg:flex w-1/2 h-screen sticky top-0 items-center justify-center p-12" ref={pinContainerRef}>
                        <div className="relative w-full max-w-lg aspect-square">

                            {/* Rotating Rings (Knowledge Core) */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className={cn(
                                    "absolute w-[120%] h-[120%] rounded-full border border-dashed transition-colors duration-1000 animate-[spin_20s_linear_infinite]",
                                    `border-${COURSE_FEATURES[activeFeature].color.split('-')[1]}-500/30`
                                )} />
                                <div className={cn(
                                    "absolute w-[80%] h-[80%] rounded-full border border-dotted transition-colors duration-1000 animate-[spin_15s_linear_infinite_reverse]",
                                    `border-${COURSE_FEATURES[activeFeature].color.split('-')[1]}-500/30`
                                )} />
                            </div>

                            {/* Main Card */}
                            <div className="relative w-full h-full rounded-[3rem] bg-slate-900/40 backdrop-blur-3xl border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden group perspective-[1000px] flex flex-col items-center justify-center">

                                {/* Dynamic Gradient Background */}
                                <div className={cn(
                                    "absolute inset-0 transition-all duration-1000 opacity-10",
                                    `bg-gradient-to-br ${COURSE_FEATURES[activeFeature].color}`
                                )} />

                                {/* 3D Floating Icon Container */}
                                <div className="relative z-10 mb-12">
                                    <div className={cn(
                                        "w-40 h-40 rounded-[2rem] flex items-center justify-center shadow-2xl transform transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 border border-white/10",
                                        `bg-gradient-to-br ${COURSE_FEATURES[activeFeature].color}`
                                    )}>
                                        {(() => {
                                            const Icon = COURSE_FEATURES[activeFeature].icon;
                                            return <Icon className="w-20 h-20 text-white drop-shadow-lg" />;
                                        })()}

                                        {/* Inner Glow */}
                                        <div className="absolute inset-0 rounded-[2rem] bg-white/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                                    </div>

                                    {/* Floor Reflection */}
                                    <div className={cn(
                                        "absolute -bottom-12 left-1/2 -translate-x-1/2 w-32 h-8 rounded-[100%] blur-xl opacity-40 transition-colors duration-700",
                                        `bg-gradient-to-r ${COURSE_FEATURES[activeFeature].color}`
                                    )} />
                                </div>

                                <div className="text-center relative z-10 px-8">
                                    <h2 className="text-4xl font-black text-white mb-4 leading-tight tracking-tight">
                                        {COURSE_FEATURES[activeFeature].title}
                                    </h2>
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                                        <Dna className="w-4 h-4 text-cyan-400" />
                                        <span className="text-sm font-bold text-slate-200">{COURSE_FEATURES[activeFeature].stat}</span>
                                    </div>
                                </div>

                                {/* Decorative Elements */}
                                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05),transparent_70%)] pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Scrolling Features List (Right) */}
                    <div className="w-full lg:w-1/2 py-32 px-4 lg:px-12 space-y-32" ref={featuresRef}>
                        <div className="mb-20">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-bold uppercase tracking-wider mb-6 backdrop-blur-md">
                                <Zap className="w-4 h-4" />
                                <span>The Engine</span>
                            </div>
                            <h3 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tighter">
                                Intelligent <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Curriculum</span>
                            </h3>
                            <p className="text-xl text-slate-400 max-w-md leading-relaxed">
                                It's not just video. It's a living, breathing educational organism generated specifically for your neural pathways.
                            </p>
                        </div>

                        {COURSE_FEATURES.map((feature, i) => {
                            const Icon = feature.icon;
                            const isActive = i === activeFeature;

                            return (
                                <div
                                    key={feature.id}
                                    className={cn(
                                        "course-feature relative p-8 rounded-[2rem] border transition-all duration-500 group overflow-hidden",
                                        isActive
                                            ? "bg-slate-800/60 border-cyan-500/30 shadow-[0_0_50px_rgba(0,0,0,0.3)]"
                                            : "bg-[#0a0c14]/50 border-white/5 hover:bg-slate-800/40 hover:border-white/10"
                                    )}
                                >
                                    {/* Active Gradient Background */}
                                    <div className={cn(
                                        "absolute inset-0 opacity-0 transition-opacity duration-500",
                                        isActive ? "opacity-10" : "opacity-0",
                                        `bg-gradient-to-br ${feature.color}`
                                    )} />

                                    <div className="flex gap-8 relative z-10">
                                        <div className={cn(
                                            "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 border border-white/5",
                                            isActive ? `bg-gradient-to-br ${feature.color} scale-110 shadow-lg` : "bg-slate-800"
                                        )}>
                                            <Icon className={cn("w-8 h-8 transition-colors", isActive ? "text-white" : "text-slate-500")} />
                                        </div>

                                        <div className="flex-1">
                                            <h4 className={cn("text-2xl font-bold mb-4 transition-colors", isActive ? "text-white" : "text-slate-300")}>
                                                {feature.title}
                                            </h4>
                                            <p className="text-slate-400 text-lg leading-relaxed">
                                                {feature.desc}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Progress Bar (Visual Flair) */}
                                    {isActive && (
                                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-800/50">
                                            <div className={cn("h-full w-full origin-left animate-[grow_2s_ease-out]", `bg-gradient-to-r ${feature.color}`)} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        <div className="pt-20 text-center">
                            <div className="p-12 rounded-[3rem] bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <h4 className="text-3xl font-bold text-white mb-8 relative z-10">Ready to generate your first course?</h4>
                                <Link href="/signup">
                                    <Button size="lg" className="bg-white text-slate-900 hover:bg-cyan-50 rounded-full px-12 py-8 text-xl font-bold shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] hover:scale-105 transition-all relative z-10">
                                        Generate Now
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
