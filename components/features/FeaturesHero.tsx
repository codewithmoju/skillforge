"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Play, Sparkles, Zap, Globe, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function FeaturesHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const dashboardRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    // Floating elements refs
    const float1 = useRef<HTMLDivElement>(null);
    const float2 = useRef<HTMLDivElement>(null);
    const float3 = useRef<HTMLDivElement>(null);

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Mouse movement handler for 3D tilt and glow
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            // Normalize coordinates -1 to 1
            const x = (clientX / innerWidth) * 2 - 1;
            const y = (clientY / innerHeight) * 2 - 1;

            setMousePosition({ x, y });

            // Move glow
            if (glowRef.current) {
                gsap.to(glowRef.current, {
                    x: clientX,
                    y: clientY,
                    duration: 1,
                    ease: "power2.out"
                });
            }

            // Tilt dashboard
            if (dashboardRef.current) {
                gsap.to(dashboardRef.current, {
                    rotateY: x * 5, // Max 5deg tilt
                    rotateX: -y * 5,
                    duration: 0.5,
                    ease: "power2.out"
                });
            }

            // Parallax floating elements
            if (float1.current) gsap.to(float1.current, { x: x * 30, y: y * 30, duration: 1 });
            if (float2.current) gsap.to(float2.current, { x: x * -20, y: y * -20, duration: 1.2 });
            if (float3.current) gsap.to(float3.current, { x: x * 40, y: y * -40, duration: 1.5 });
        };

        window.addEventListener("mousemove", handleMouseMove);

        // Initial Reveal Animation
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            tl.fromTo(contentRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
            )
                .fromTo(dashboardRef.current,
                    { opacity: 0, scale: 0.8, rotateX: 20 },
                    { opacity: 1, scale: 1, rotateX: 0, duration: 1.2, ease: "back.out(1.7)" },
                    "-=0.5"
                )
                .fromTo([float1.current, float2.current, float3.current],
                    { opacity: 0, scale: 0 },
                    { opacity: 1, scale: 1, stagger: 0.2, duration: 0.8, ease: "elastic.out(1, 0.5)" },
                    "-=0.8"
                );

            // Scroll Scrub Animation
            ScrollTrigger.create({
                trigger: container,
                start: "top top",
                end: "bottom top",
                scrub: true,
                onUpdate: (self) => {
                    // Fade out and scale down as user scrolls away
                    gsap.to(container, { opacity: 1 - self.progress, scale: 1 - self.progress * 0.1, ease: "none", overwrite: "auto" });
                }
            });

        }, containerRef);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            ctx.revert();
        };
    }, []);

    return (
        <div ref={containerRef} className="relative min-h-screen w-full overflow-hidden bg-[#020617] text-white flex flex-col items-center justify-center pt-20 perspective-[2000px]">

            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(76,29,149,0.15),_transparent_70%)]" />
                <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-indigo-500/10 to-transparent blur-3xl" />
                {/* Animated Grid */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
            </div>

            {/* Mouse Follow Glow */}
            <div
                ref={glowRef}
                className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0 mix-blend-screen"
            />

            {/* Main Content */}
            <div ref={contentRef} className="relative z-10 text-center max-w-5xl px-6 mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8 backdrop-blur-sm animate-pulse">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>Reimagining Education with AI</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-tight">
                    <span className="block bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-400">
                        Unlock Your
                    </span>
                    <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-[0_0_30px_rgba(129,140,248,0.3)]">
                        True Potential
                    </span>
                </h1>

                <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
                    Experience the world's most advanced learning platform.
                    Personalized roadmaps, gamified mastery, and an AI tutor that knows you better than you know yourself.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <Link href="/signup">
                        <Button size="lg" className="h-14 px-10 rounded-full text-lg bg-white text-slate-950 hover:bg-indigo-50 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] font-bold">
                            Start Learning Free <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* 3D Dashboard Preview */}
            <div className="relative z-10 w-full max-w-6xl px-4 perspective-[2000px]">
                <div
                    ref={dashboardRef}
                    className="relative aspect-[16/9] bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden transform-gpu"
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {/* Dashboard UI Mockup */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-950/50" />

                    {/* Header Mockup */}
                    <div className="absolute top-0 left-0 right-0 h-16 border-b border-white/5 flex items-center px-6 gap-4">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        <div className="ml-8 w-32 h-2 rounded-full bg-white/10" />
                    </div>

                    {/* Sidebar Mockup */}
                    <div className="absolute top-16 bottom-0 left-0 w-64 border-r border-white/5 p-6 space-y-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-10 w-full rounded-lg bg-white/5 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                        ))}
                    </div>

                    {/* Main Content Mockup */}
                    <div className="absolute top-16 bottom-0 left-64 right-0 p-8">
                        <div className="grid grid-cols-3 gap-6 mb-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-32 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/5 p-4">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 mb-4" />
                                    <div className="w-24 h-2 rounded bg-white/10 mb-2" />
                                    <div className="w-16 h-2 rounded bg-white/10" />
                                </div>
                            ))}
                        </div>
                        <div className="h-64 rounded-xl bg-slate-950/50 border border-white/5 p-6 flex items-end gap-2">
                            {[40, 60, 45, 70, 50, 80, 65, 85, 75, 90].map((h, i) => (
                                <div key={i} className="flex-1 bg-indigo-500/50 rounded-t-sm hover:bg-indigo-400 transition-colors" style={{ height: `${h}%` }} />
                            ))}
                        </div>
                    </div>

                    {/* Reflection Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                </div>

                {/* Floating Parallax Elements */}
                <div ref={float1} className="absolute -top-20 -right-20 p-4 rounded-2xl bg-slate-800/90 backdrop-blur-md border border-white/10 shadow-2xl z-20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-white">98% Accuracy</div>
                            <div className="text-xs text-slate-400">AI Grading</div>
                        </div>
                    </div>
                </div>

                <div ref={float2} className="absolute top-40 -left-10 p-4 rounded-2xl bg-slate-800/90 backdrop-blur-md border border-white/10 shadow-2xl z-20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                            <Globe className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-white">Global Access</div>
                            <div className="text-xs text-slate-400">Learn anywhere</div>
                        </div>
                    </div>
                </div>

                <div ref={float3} className="absolute -bottom-10 right-20 p-4 rounded-2xl bg-slate-800/90 backdrop-blur-md border border-white/10 shadow-2xl z-20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                            <Zap className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-white">Instant Feedback</div>
                            <div className="text-xs text-slate-400">Real-time analysis</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
