"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Map, CheckCircle2, ArrowRight, Loader2, Sparkles, Zap, Brain, Target, Rocket, RotateCcw, Globe, Cpu, Network, Code2, Database, Layout, Server, Cloud, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const ROADMAP_STEPS = [
    { id: 1, title: "Foundations", desc: "Master the syntax and core concepts.", time: "2 Weeks", xp: 500, color: "from-violet-500 to-purple-600", icon: Code2 },
    { id: 2, title: "Data Structures", desc: "Learn how to organize and store data efficiently.", time: "3 Weeks", xp: 800, color: "from-blue-500 to-cyan-500", icon: Database },
    { id: 3, title: "Algorithms", desc: "Solve complex problems with optimized logic.", time: "4 Weeks", xp: 1200, color: "from-emerald-400 to-teal-500", icon: Brain },
    { id: 4, title: "System Design", desc: "Architect scalable and robust applications.", time: "3 Weeks", xp: 1500, color: "from-orange-400 to-amber-500", icon: Layout },
    { id: 5, title: "Deployment", desc: "Ship your code to the world using modern CI/CD.", time: "2 Weeks", xp: 1000, color: "from-rose-500 to-pink-600", icon: Cloud },
];

export function RoadmapGenerator() {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        if (!containerRef.current || !trackRef.current) return;

        const ctx = gsap.context(() => {
            const track = trackRef.current;
            if (!track) return;

            const getScrollAmount = () => {
                return -(track.scrollWidth - window.innerWidth + 100);
            };

            // Horizontal Scroll Animation
            gsap.to(track, {
                x: getScrollAmount,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=3000",
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        const progress = self.progress;
                        const totalSteps = ROADMAP_STEPS.length;
                        const current = Math.min(Math.floor(progress * totalSteps), totalSteps - 1);
                        setActiveStep(current);
                    }
                }
            });

            // Parallax Stars
            gsap.to(".star-layer", {
                x: -100,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=3000",
                    scrub: 1,
                }
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative h-screen w-full bg-[#030014] text-white overflow-hidden flex">

            {/* Deep Space Background */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Nebula Gradients */}
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full mix-blend-screen" />

                {/* Starfield Layers */}
                <div className="star-layer absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [transform:perspective(1000px)_rotateX(60deg)_translateY(-100px)] opacity-20" />
            </div>

            {/* Mission Control (Fixed Left Panel) */}
            <div className="w-[400px] h-full flex-shrink-0 relative z-20 bg-[#0a0a16]/90 backdrop-blur-2xl border-r border-white/5 p-8 flex flex-col justify-center shadow-[20px_0_50px_rgba(0,0,0,0.7)]">

                {/* HUD Scan Line */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-[scan_3s_linear_infinite] opacity-50" />

                <div className="mb-12 relative">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="relative">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                            <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20" />
                        </div>
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-[0.2em]">System Online</span>
                    </div>

                    <h2 className="text-5xl font-black text-white mb-2 leading-none tracking-tighter">
                        MISSION <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">CONTROL</span>
                    </h2>
                    <p className="text-slate-400 text-sm mt-4 font-mono border-l-2 border-slate-700 pl-4">
                        // INITIALIZING LAUNCH SEQUENCE <br />
                        // TARGET: FULL STACK MASTERY
                    </p>
                </div>

                {/* Active Step Info */}
                <div className="space-y-6">
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 relative overflow-hidden group hover:bg-white/10 transition-colors duration-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="flex justify-between text-xs text-slate-400 mb-3 font-mono uppercase tracking-wider relative z-10">
                            <span>Current Phase</span>
                            <span className="text-cyan-400">0{activeStep + 1} / 05</span>
                        </div>

                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden mb-6 relative z-10">
                            <div
                                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 ease-out relative"
                                style={{ width: `${((activeStep + 1) / 5) * 100}%` }}
                            >
                                <div className="absolute right-0 top-0 bottom-0 w-2 bg-white blur-[2px]" />
                            </div>
                        </div>

                        <div className="text-3xl font-bold text-white relative z-10 mb-1">
                            {ROADMAP_STEPS[activeStep].title}
                        </div>
                        <div className="text-sm text-slate-400">{ROADMAP_STEPS[activeStep].desc}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center hover:border-white/20 transition-colors">
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">Duration</div>
                            <div className="text-xl font-black text-white font-mono">{ROADMAP_STEPS[activeStep].time}</div>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center hover:border-white/20 transition-colors">
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">XP Reward</div>
                            <div className="text-xl font-black text-cyan-400 font-mono">+{ROADMAP_STEPS[activeStep].xp}</div>
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-8 border-t border-white/5">
                    <div className="flex items-center gap-4 text-slate-600 text-[10px] font-mono uppercase tracking-widest">
                        <Radio className="w-4 h-4 animate-pulse" />
                        <span>Live Feed • Neural Net v2.4</span>
                    </div>
                </div>
            </div>

            {/* Horizontal Scroll Track */}
            <div className="flex-1 overflow-hidden h-full relative">
                <div ref={trackRef} className="flex items-center h-full px-20 gap-32 w-max">

                    {/* Start Marker */}
                    <div className="flex flex-col items-center justify-center w-40 shrink-0 opacity-30">
                        <div className="w-32 h-32 rounded-full border border-dashed border-white/20 animate-[spin_10s_linear_infinite]" />
                        <span className="absolute text-slate-500 font-mono text-xs uppercase tracking-widest rotate-90 whitespace-nowrap">Initiate Sequence</span>
                    </div>

                    {ROADMAP_STEPS.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <div key={step.id} className="roadmap-card relative group w-[500px] shrink-0 perspective-[1000px]">
                                {/* Connector Line */}
                                {i !== ROADMAP_STEPS.length - 1 && (
                                    <div className="absolute top-1/2 left-full w-32 h-[2px] bg-slate-800 -translate-y-1/2 z-0">
                                        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-0 group-hover:w-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                                    </div>
                                )}

                                <div className="card-content relative bg-[#0f111a]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 hover:bg-[#161824] hover:border-white/20 transition-all duration-500 group-hover:-translate-y-4 shadow-2xl overflow-hidden">
                                    {/* Glow Effect */}
                                    <div className={cn("absolute -inset-[100%] bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-3xl", step.color)} />

                                    {/* Top Border Highlight */}
                                    <div className={cn("absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r opacity-50", step.color)} />

                                    <div className="relative z-10">
                                        <div className={cn(
                                            "w-20 h-20 rounded-2xl flex items-center justify-center mb-8 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-white/10",
                                            `bg-gradient-to-br ${step.color}`
                                        )}>
                                            <Icon className="w-10 h-10 text-white drop-shadow-md" />
                                        </div>

                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-3xl font-bold text-white tracking-tight">{step.title}</h3>
                                            <span className="text-xs font-bold text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/5 font-mono">0{i + 1}</span>
                                        </div>

                                        <p className="text-slate-400 text-lg leading-relaxed mb-8 font-light">{step.desc}</p>

                                        <Link href="/signup" className="w-full">
                                            <Button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl h-14 font-bold group/btn relative overflow-hidden">
                                                <div className={cn("absolute inset-0 opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300 bg-gradient-to-r", step.color)} />
                                                <span className="mr-2 relative z-10">Initialize Module</span>
                                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform relative z-10" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Success State */}
                    <div className="w-[500px] shrink-0 flex flex-col items-center justify-center text-center p-10">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-emerald-500/30 blur-[50px] rounded-full animate-pulse" />
                            <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.4)] relative z-10">
                                <Rocket className="w-16 h-16 text-white animate-bounce" />
                            </div>
                        </div>
                        <h3 className="text-5xl font-black text-white mb-6 tracking-tight">MISSION <br /> COMPLETE</h3>
                        <p className="text-slate-400 text-xl mb-8 max-w-sm mx-auto">
                            All systems nominal. You are cleared for launch.
                        </p>
                        <Link href="/signup">
                            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-200 rounded-full px-12 py-8 text-xl font-bold shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] transition-all">
                                Launch Career
                            </Button>
                        </Link>
                    </div>

                </div>
            </div>

        </div>
    );
}
