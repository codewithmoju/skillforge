"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from "framer-motion";
import { ArrowRight, Play, Sparkles, Zap, Globe, Cpu, Code2, Terminal, Database, Layers } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function ParallaxHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();

    // Mouse Position for 3D Effects
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth mouse values for tilt
    const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    // 3D Tilt Transforms
    const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [20, -20]);
    const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-20, 20]);

    // Parallax Layer Transforms (Deep Depth)
    const layer1X = useTransform(smoothMouseX, [-0.5, 0.5], [-20, 20]);
    const layer1Y = useTransform(smoothMouseY, [-0.5, 0.5], [-20, 20]);

    const layer2X = useTransform(smoothMouseX, [-0.5, 0.5], [-40, 40]);
    const layer2Y = useTransform(smoothMouseY, [-0.5, 0.5], [-40, 40]);

    const layer3X = useTransform(smoothMouseX, [-0.5, 0.5], [-60, 60]);
    const layer3Y = useTransform(smoothMouseY, [-0.5, 0.5], [-60, 60]);

    // Scroll Parallax
    const yHero = useTransform(scrollY, [0, 1000], [0, 400]);
    const opacityHero = useTransform(scrollY, [0, 500], [1, 0]);
    const scaleHero = useTransform(scrollY, [0, 1000], [1, 0.8]);

    const handleMouseMove = (e: React.MouseEvent) => {
        const { width, height, left, top } = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - left) / width - 0.5);
        mouseY.set((e.clientY - top) / height - 0.5);
    };

    return (
        <div
            ref={containerRef}
            className="relative min-h-[140vh] w-full overflow-hidden bg-[#020617] perspective-[2000px]"
            onMouseMove={handleMouseMove}
        >
            {/* SPOTLIGHT EFFECT */}
            <motion.div
                className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            650px circle at ${mouseX.get() * 100 + 50}% ${mouseY.get() * 100 + 50}%,
                            rgba(14, 165, 233, 0.15),
                            transparent 80%
                        )
                    `,
                }}
            />

            {/* DEEP SPACE BACKGROUND LAYERS */}
            <div className="absolute inset-0 z-0 transform-style-3d">
                {/* Layer 0: The Void */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-black" />

                {/* Layer 1: The Grid (Tilts with mouse) */}
                <motion.div
                    style={{ rotateX: rotateX, rotateY: rotateY, scale: 1.5 }}
                    className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 origin-center"
                />

                {/* Layer 2: Floating Code Snippets (Deep Parallax) */}
                <motion.div style={{ x: layer1X, y: layer1Y }} className="absolute inset-0 pointer-events-none">
                    <FloatingElement top="15%" left="10%" delay={0}>
                        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-4 rounded-xl shadow-2xl transform -rotate-6">
                            <div className="flex gap-2 mb-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <div className="space-y-2 font-mono text-xs text-cyan-400">
                                <p>const learn = async () =&gt; &#123;</p>
                                <p className="pl-4">await master("React");</p>
                                <p className="pl-4">return "Expert";</p>
                                <p>&#125;</p>
                            </div>
                        </div>
                    </FloatingElement>

                    <FloatingElement bottom="20%" right="10%" delay={1}>
                        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-4 rounded-xl shadow-2xl transform rotate-3">
                            <div className="flex items-center gap-3 text-purple-400 font-mono text-xs">
                                <Database className="w-4 h-4" />
                                <span>Generating Roadmap...</span>
                            </div>
                            <div className="mt-2 h-1 w-32 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    animate={{ x: ["-100%", "100%"] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    className="h-full w-1/2 bg-purple-500"
                                />
                            </div>
                        </div>
                    </FloatingElement>
                </motion.div>

                {/* Layer 3: Tech Icons (Closer Parallax) */}
                <motion.div style={{ x: layer2X, y: layer2Y }} className="absolute inset-0 pointer-events-none">
                    <FloatingIcon icon={Code2} top="20%" right="20%" color="text-blue-400" delay={0.5} />
                    <FloatingIcon icon={Cpu} bottom="30%" left="15%" color="text-cyan-400" delay={1.5} />
                    <FloatingIcon icon={Layers} top="40%" left="5%" color="text-purple-400" delay={2.5} />
                    <FloatingIcon icon={Terminal} bottom="15%" right="25%" color="text-emerald-400" delay={3.5} />
                </motion.div>
            </div>

            {/* MAIN HERO CONTENT */}
            <motion.div
                style={{ y: yHero, opacity: opacityHero, scale: scaleHero }}
                className="relative z-20 container mx-auto px-4 pt-32 md:pt-40 flex flex-col items-center text-center transform-style-3d"
            >
                {/* Holographic Badge */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative group cursor-default mb-8"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 rounded-full blur opacity-20 group-hover:opacity-50 transition duration-500 animate-gradient-x" />
                    <div className="relative px-6 py-2 rounded-full bg-slate-950/50 backdrop-blur-xl border border-white/10 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                        <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-400">
                            Next-Gen Learning Engine
                        </span>
                    </div>
                </motion.div>

                {/* Main Headline with Scramble Effect */}
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 text-white leading-[1.1] perspective-text relative z-20">
                    <span className="block drop-shadow-2xl">Master</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 animate-gradient-x drop-shadow-2xl">
                        The Future
                    </span>
                </h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed"
                >
                    Generate personalized, interactive roadmaps for any skill in seconds.
                    <br className="hidden md:block" />
                    Powered by advanced AI, tailored to your learning style.
                </motion.p>

                {/* Magnetic Buttons */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-30"
                >
                    <Link href="/signup">
                        <Button size="lg" className="h-16 px-10 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xl shadow-[0_0_40px_-10px_rgba(6,182,212,0.6)] hover:shadow-[0_0_60px_-10px_rgba(6,182,212,0.8)] transition-all duration-300 border-0 hover:scale-105 group">
                            Start Learning
                            <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                    <Link href="/demo">
                        <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl border-white/10 hover:bg-white/5 text-white font-medium text-xl backdrop-blur-sm hover:scale-105 transition-all group">
                            <Play className="w-5 h-5 mr-2 fill-current group-hover:scale-110 transition-transform" />
                            Live Demo
                        </Button>
                    </Link>
                </motion.div>

                {/* HOLOGRAPHIC DASHBOARD (Ultra 3D) */}
                <motion.div
                    style={{
                        rotateX,
                        rotateY,
                        z: 100
                    }}
                    className="relative mt-24 w-full max-w-6xl perspective-origin-center transform-style-3d"
                >
                    {/* Hologram Base */}
                    <div className="relative aspect-[16/9] bg-slate-950/60 backdrop-blur-md rounded-t-[2rem] border border-white/10 shadow-2xl overflow-hidden group">
                        {/* Scanline Effect */}
                        <div className="absolute inset-0 bg-[url('/scanline.png')] opacity-10 pointer-events-none z-50 mix-blend-overlay" />
                        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-purple-500/5 pointer-events-none" />

                        {/* Glowing Borders */}
                        <div className="absolute inset-0 border-2 border-white/5 rounded-t-[2rem]" />
                        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

                        {/* Dashboard Content */}
                        <div className="p-6 md:p-10 grid grid-cols-12 gap-6 h-full relative z-10">
                            {/* Sidebar */}
                            <div className="hidden md:block col-span-3 h-full bg-white/5 rounded-xl border border-white/5 p-4 space-y-4 backdrop-blur-sm">
                                <div className="h-8 w-3/4 bg-white/10 rounded-lg animate-pulse" />
                                <div className="space-y-2 pt-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-10 w-full bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer flex items-center px-3">
                                            <div className="w-2 h-2 rounded-full bg-cyan-500/50 mr-3" />
                                            <div className="h-2 w-20 bg-white/10 rounded-full" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Main Area */}
                            <div className="col-span-12 md:col-span-9 space-y-6">
                                {/* Header */}
                                <div className="flex justify-between items-center">
                                    <div className="h-8 w-48 bg-white/10 rounded-lg" />
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30" />
                                        <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30" />
                                    </div>
                                </div>

                                {/* Hero Graph Area */}
                                <div className="h-64 bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-xl border border-white/10 relative overflow-hidden group/graph">
                                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                                    {/* Animated Graph Line */}
                                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                                        <motion.path
                                            d="M0,100 C150,100 150,50 300,50 C450,50 450,80 600,80 C750,80 750,20 900,20 L900,200 L0,200 Z"
                                            fill="url(#parallax-hero-gradient)"
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 1 }}
                                            transition={{ duration: 2, ease: "easeInOut" }}
                                        />
                                        <defs>
                                            <linearGradient id="parallax-hero-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor="rgba(6,182,212,0.3)" />
                                                <stop offset="100%" stopColor="rgba(6,182,212,0)" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <motion.div
                                        className="absolute top-1/4 left-1/4 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(6,182,212,1)]"
                                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </div>

                                {/* Cards */}
                                <div className="grid grid-cols-3 gap-6">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-24 bg-white/5 rounded-xl border border-white/5 p-4 hover:bg-white/10 transition-colors group/card">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 mb-3 flex items-center justify-center">
                                                <div className="w-4 h-4 bg-white/20 rounded-sm" />
                                            </div>
                                            <div className="h-2 w-16 bg-white/10 rounded-full" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Floating Holographic Widgets (Parallax Layer 4) */}
                        <motion.div
                            style={{ x: layer3X, y: layer3Y, z: 50 }}
                            className="absolute top-10 right-10 bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30 p-4 rounded-xl shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)] transform rotate-6"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-cyan-500/20 rounded-lg">
                                    <Globe className="w-5 h-5 text-cyan-400" />
                                </div>
                                <div>
                                    <div className="text-[10px] text-cyan-400/60 uppercase tracking-wider font-bold">Network Status</div>
                                    <div className="text-sm font-bold text-white flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        Online
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

// Helper Components for cleaner code
function FloatingElement({ children, top, left, right, bottom, delay }: { children: React.ReactNode, top?: string, left?: string, right?: string, bottom?: string, delay: number }) {
    return (
        <motion.div
            className="absolute z-10"
            style={{ top, left, right, bottom }}
            animate={{
                y: [0, -20, 0],
                rotate: [0, 2, 0]
            }}
            transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay
            }}
        >
            {children}
        </motion.div>
    );
}

function FloatingIcon({ icon: Icon, top, left, right, bottom, color, delay }: { icon: any, top?: string, left?: string, right?: string, bottom?: string, color: string, delay: number }) {
    return (
        <motion.div
            className={`absolute z-0 ${color} opacity-20`}
            style={{ top, left, right, bottom }}
            animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
                rotate: [0, 10, 0]
            }}
            transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay
            }}
        >
            <Icon className="w-16 h-16 md:w-24 md:h-24" />
        </motion.div>
    );
}
