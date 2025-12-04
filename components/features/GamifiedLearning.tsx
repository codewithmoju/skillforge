"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Trophy, Star, Award, Zap, Crown, Flame, Target, Shield, Swords, Sparkles, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function GamifiedLearning() {
    const containerRef = useRef<HTMLDivElement>(null);
    const pinContainerRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<SVGCircleElement>(null);
    const shineRef = useRef<HTMLDivElement>(null);
    const [xp, setXp] = useState(0);
    const [level, setLevel] = useState(5);

    // Floating elements
    const coinRef = useRef<HTMLDivElement>(null);
    const gemRef = useRef<HTMLDivElement>(null);
    const flameRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const pinContainer = pinContainerRef.current;

        if (!container || !pinContainer) return;

        // Mouse Move for Holographic Shine
        const handleMouseMove = (e: MouseEvent) => {
            if (!cardRef.current || !shineRef.current) return;
            const rect = cardRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            gsap.to(shineRef.current, {
                background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.15), transparent 80%)`,
                duration: 0.2
            });

            // Subtle tilt based on mouse
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5; // Max -5 to 5 deg
            const rotateY = ((x - centerX) / centerX) * 5;

            gsap.to(cardRef.current, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.5,
                ease: "power2.out"
            });
        };

        window.addEventListener("mousemove", handleMouseMove);

        const ctx = gsap.context(() => {

            // Pinning Logic
            ScrollTrigger.create({
                trigger: container,
                start: "top top",
                end: "bottom bottom",
                pin: pinContainer,
                scrub: 1,
            });

            // Card Animations linked to scroll
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1
                }
            });

            // Parallax Elements
            tl.to(coinRef.current, { y: -400, rotation: 360, x: 80, scale: 1.2 }, 0);
            tl.to(gemRef.current, { y: -500, rotation: -180, x: -80, scale: 0.8 }, 0);
            tl.to(flameRef.current, { y: -300, scale: 1.5, opacity: 1 }, 0);

            // Progress Ring Fill
            if (progressRef.current) {
                gsap.fromTo(progressRef.current,
                    { strokeDashoffset: 628 },
                    {
                        strokeDashoffset: 628 - (628 * 0.85), // 85% fill
                        scrollTrigger: {
                            trigger: container,
                            start: "top top",
                            end: "center center",
                            scrub: 2
                        }
                    }
                );
            }

            // Feature Text Stagger Reveal
            const features = gsap.utils.toArray('.gamified-feature');
            features.forEach((feature: any, i) => {
                gsap.from(feature, {
                    opacity: 0,
                    y: 50,
                    scrollTrigger: {
                        trigger: feature,
                        start: "top 85%",
                        end: "top 65%",
                        scrub: 1
                    }
                });
            });

        }, containerRef);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            ctx.revert();
        };
    }, []);

    // XP Counter Animation
    useEffect(() => {
        const interval = setInterval(() => {
            setXp(prev => {
                if (prev < 2450) return prev + 50;
                return prev;
            });
        }, 50);
        return () => clearInterval(interval);
    }, []);

    const [isClaimed, setIsClaimed] = useState(false);

    // ... (existing code)

    const handleClaimReward = () => {
        if (isClaimed) return;

        confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FFA500', '#FF4500', '#8A2BE2'],
            disableForReducedMotion: true,
            zIndex: 9999,
            shapes: ['star', 'circle'],
            scalar: 1.2
        });

        setIsClaimed(true);

        // Level Up Animation
        setLevel(prev => prev + 1);
        setXp(0);

        // Reset progress ring animation
        if (progressRef.current) {
            gsap.fromTo(progressRef.current,
                { strokeDashoffset: 628 },
                { strokeDashoffset: 628, duration: 0.5 }
            );
            setTimeout(() => {
                gsap.to(progressRef.current, {
                    strokeDashoffset: 628 - (628 * 0.3), // 30% fill for new level
                    duration: 1.5,
                    ease: "elastic.out(1, 0.5)"
                });
                setXp(850);
            }, 500);
        }
    };

    return (
        <div ref={containerRef} className="relative min-h-[250vh] w-full bg-[#020617] text-white overflow-hidden">

            {/* Animated Mesh Gradient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.05),transparent_70%)]" />
                <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/5 rounded-full blur-[150px]" />
            </div>

            <div className="container mx-auto px-4 h-full flex flex-col lg:flex-row relative z-10">

                {/* Scrolling Content (Left) */}
                <div className="w-full lg:w-1/2 py-32 space-y-40">

                    {/* Section 1: Intro */}
                    <div className="gamified-feature min-h-[60vh] flex flex-col justify-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-purple-300 text-sm font-medium mb-8 w-fit backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200 font-bold">Next-Gen Gamification</span>
                        </div>
                        <h2 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] mb-8">
                            Play to <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                                Mastery
                            </span>
                        </h2>
                        <p className="text-xl text-slate-400 leading-relaxed max-w-lg font-light">
                            Experience learning like never before. An immersive, RPG-style progression system that turns every lesson into a quest and every milestone into a celebration.
                        </p>
                    </div>

                    {/* Section 2: Features */}
                    <div className="gamified-feature min-h-[60vh] flex flex-col justify-center space-y-16">
                        <FeatureBlock
                            icon={Flame}
                            title="Infinite Streaks"
                            desc="Build momentum with daily challenges. Unlock streak multipliers and exclusive fire-themed skins."
                            color="text-orange-400"
                            bg="bg-orange-500/10"
                            border="border-orange-500/20"
                        />
                        <FeatureBlock
                            icon={Swords}
                            title="PvP Battles"
                            desc="Challenge friends or AI in real-time knowledge duels. Wager XP and climb the global ranked ladder."
                            color="text-red-400"
                            bg="bg-red-500/10"
                            border="border-red-500/20"
                        />
                        <FeatureBlock
                            icon={Crown}
                            title="Elite Leagues"
                            desc="Ascend from Bronze to Grandmaster. Top players earn real-world rewards and verified certificates."
                            color="text-yellow-400"
                            bg="bg-yellow-500/10"
                            border="border-yellow-500/20"
                        />
                    </div>

                    {/* Section 3: CTA */}
                    <div className="gamified-feature min-h-[40vh] flex flex-col justify-center">
                        <h3 className="text-4xl font-bold mb-8 leading-tight">Your legend begins <br /> with a single step.</h3>
                        <Link href="/signup">
                            <Button size="lg" className="w-fit h-16 px-10 rounded-full bg-white text-slate-950 hover:bg-purple-50 font-bold text-xl shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-105">
                                Start Your Journey
                            </Button>
                        </Link>
                    </div>

                </div>

                {/* Pinned Card (Right) */}
                <div className="hidden lg:block w-1/2 h-screen sticky top-0 flex items-center justify-center perspective-[1200px] z-20 pt-24" ref={pinContainerRef}>
                    <div className="relative group scale-90 xl:scale-100">

                        {/* Floating Parallax Elements */}
                        <div ref={coinRef} className="absolute -top-40 -right-24 z-30 pointer-events-none">
                            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 shadow-[0_0_50px_rgba(234,179,8,0.5)] flex items-center justify-center border-[6px] border-yellow-200/50 backdrop-blur-sm">
                                <span className="text-5xl font-black text-yellow-950 drop-shadow-sm">$</span>
                            </div>
                        </div>

                        <div ref={gemRef} className="absolute top-1/2 -left-40 z-30 pointer-events-none">
                            <div className="w-24 h-24 rotate-45 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 shadow-[0_0_50px_rgba(236,72,153,0.5)] border-[3px] border-white/40 backdrop-blur-md" />
                        </div>

                        <div ref={flameRef} className="absolute -bottom-24 right-0 z-30 opacity-0 pointer-events-none">
                            <div className="w-40 h-40 rounded-full bg-gradient-to-t from-orange-600 to-yellow-400 blur-2xl opacity-60 animate-pulse" />
                            <Flame className="w-40 h-40 text-orange-500 absolute inset-0 drop-shadow-[0_0_30px_rgba(249,115,22,0.9)]" />
                        </div>

                        {/* Main Card */}
                        <div
                            ref={cardRef}
                            className="relative w-[500px] bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-12 shadow-[0_0_100px_rgba(0,0,0,0.5)] transform-gpu transition-all duration-100"
                        >
                            {/* Holographic Shine */}
                            <div ref={shineRef} className="absolute inset-0 rounded-[3rem] pointer-events-none z-20 mix-blend-overlay opacity-50" />

                            {/* Inner Glow */}
                            <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 pointer-events-none" />

                            <div className="relative z-10 flex flex-col items-center text-center">
                                {/* Level Badge */}
                                <div className="relative mb-10">
                                    <div className="absolute inset-0 bg-purple-500 blur-[60px] opacity-30 animate-pulse" />
                                    {/* Outer Ring */}
                                    <div className="absolute inset-0 rounded-full border border-white/5 scale-110" />

                                    <svg className="w-64 h-64 transform -rotate-90 drop-shadow-2xl">
                                        <defs>
                                            <linearGradient id="gamified-progress-gradient-unique" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#c084fc" />
                                                <stop offset="100%" stopColor="#ec4899" />
                                            </linearGradient>
                                        </defs>
                                        <circle cx="128" cy="128" r="100" className="stroke-slate-800/50" strokeWidth="12" fill="none" />
                                        <circle
                                            ref={progressRef}
                                            cx="128" cy="128" r="100"
                                            className="drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]"
                                            stroke="url(#gamified-progress-gradient-unique)"
                                            strokeWidth="12"
                                            fill="none"
                                            strokeDasharray="628"
                                            strokeDashoffset="628"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-sm text-purple-300 font-bold uppercase tracking-[0.2em] mb-2">Level</span>
                                        <span className="text-8xl font-black text-white tracking-tighter drop-shadow-lg">{level}</span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-12">
                                    <h3 className="text-4xl font-bold text-white tracking-tight">Master Scholar</h3>
                                    <div className="inline-block px-4 py-1 rounded-full bg-slate-800/50 border border-white/10">
                                        <p className="text-slate-300 text-lg font-mono">
                                            <span className="text-purple-400 font-bold">{xp}</span> <span className="text-slate-500">/</span> 3000 XP
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleClaimReward}
                                    disabled={isClaimed}
                                    className={cn(
                                        "w-full h-20 text-2xl font-bold rounded-2xl transition-all duration-500 text-white shadow-[0_0_40px_rgba(168,85,247,0.5)] border-none group relative overflow-hidden",
                                        isClaimed
                                            ? "bg-slate-800 text-slate-400 cursor-default shadow-none"
                                            : "bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_auto] hover:bg-right hover:scale-[1.02] active:scale-[0.98]"
                                    )}
                                >
                                    {!isClaimed && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12" />}
                                    <span className="relative flex items-center justify-center gap-3">
                                        {isClaimed ? (
                                            <>
                                                <CheckCircle2 className="w-8 h-8 text-green-500" /> Reward Claimed
                                            </>
                                        ) : (
                                            <>
                                                <Award className="w-8 h-8" /> Claim Reward
                                            </>
                                        )}
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </div >
                </div >

            </div >
        </div >
    );
}

function FeatureBlock({ icon: Icon, title, desc, color, bg, border }: { icon: any, title: string, desc: string, color: string, bg: string, border: string }) {
    return (
        <div className="flex gap-8 items-start group p-6 rounded-3xl hover:bg-white/5 transition-colors duration-300 border border-transparent hover:border-white/5">
            <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg", bg, border, "border")}>
                <Icon className={cn("w-10 h-10", color)} />
            </div>
            <div>
                <h4 className="text-3xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">{title}</h4>
                <p className="text-slate-400 leading-relaxed text-lg font-light">{desc}</p>
            </div>
        </div>
    );
}
