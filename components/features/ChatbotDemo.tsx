"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { MessageSquare, Send, Sparkles, User, Bot, Brain, Zap, Lightbulb, Atom, Network, Cpu, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const CONVERSATION_STEPS = [
    {
        id: 1,
        role: "user",
        text: "I don't get Quantum Entanglement. It makes no sense.",
        mood: "confused"
    },
    {
        id: 2,
        role: "ai",
        text: "It is tricky! Think of it like a pair of magic dice...",
        mood: "thinking"
    },
    {
        id: 3,
        role: "ai",
        text: "If you roll a 6 on one, the other shows a 6 instantly. Even if it's on Mars!",
        mood: "explaining"
    },
    {
        id: 4,
        role: "user",
        text: "Wait, so information travels faster than light?",
        mood: "curious"
    },
    {
        id: 5,
        role: "ai",
        text: "Not exactly! No 'message' is sent. They just... know. That's the spooky part! 👻",
        mood: "excited"
    }
];

export function ChatbotDemo() {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const coreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !trackRef.current || !coreRef.current) return;

        const ctx = gsap.context(() => {

            const track = trackRef.current;
            if (!track) return;
            const scrollWidth = track.scrollWidth - window.innerWidth;

            // Horizontal Scroll Animation
            gsap.to(track, {
                x: -scrollWidth,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    pin: true,
                    scrub: 1,
                    end: "+=3000", // Adjust for scroll length
                    id: "horizontal-scroll"
                }
            });

            // Parallax Core Animation (Moves slower than foreground)
            gsap.to(coreRef.current, {
                x: -scrollWidth * 0.2, // Moves at 20% speed
                rotationY: 180,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=3000",
                    scrub: 1,
                }
            });

            // Parallax Background Stars (Moves even slower)
            gsap.to(".bg-stars", {
                x: -scrollWidth * 0.1,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=3000",
                    scrub: 1,
                }
            });

            // Animate cards as they enter viewport
            const cards = gsap.utils.toArray(".chat-card");
            cards.forEach((card: any) => {
                gsap.from(card, {
                    y: 100,
                    opacity: 0,
                    rotationX: 45,
                    duration: 1,
                    scrollTrigger: {
                        trigger: card,
                        containerAnimation: gsap.getById("horizontal-scroll"), // Link to horizontal scroll
                        start: "left center",
                        toggleActions: "play none none reverse"
                    }
                });
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative h-screen bg-[#050214] text-white overflow-hidden">

            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_70%)]" />
                <div className="bg-stars absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay w-[200vw]" />

                {/* Neural Grid Floor */}
                <div className="absolute bottom-0 left-0 w-[200vw] h-[50vh] bg-[linear-gradient(rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.1)_1px,transparent_1px)] bg-[size:100px_100px] [transform:perspective(1000px)_rotateX(60deg)] origin-bottom" />
            </div>

            {/* Parallax Core Layer */}
            <div ref={coreRef} className="absolute top-1/2 left-[20%] -translate-y-1/2 w-[800px] h-[800px] pointer-events-none opacity-30 z-0">
                <div className="absolute inset-0 bg-indigo-600/20 blur-[100px] rounded-full animate-pulse-slow" />
                <div className="absolute inset-[10%] border border-indigo-500/30 rounded-full border-dashed animate-[spin_30s_linear_infinite]" />
                <div className="absolute inset-[25%] border border-purple-500/30 rounded-full border-dotted animate-[spin_20s_linear_infinite_reverse]" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="w-32 h-32 text-indigo-400/50 animate-float" />
                </div>
            </div>

            {/* Horizontal Track */}
            <div ref={trackRef} className="flex items-center h-full px-[10vw] gap-[20vw] w-max relative z-10">

                {/* Intro Section */}
                <div className="w-[30vw] shrink-0 space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-bold uppercase tracking-wider backdrop-blur-md">
                        <Cpu className="w-4 h-4" />
                        <span>Neural Core v2.0</span>
                    </div>
                    <h2 className="text-6xl md:text-8xl font-black leading-tight tracking-tighter">
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-slate-400">
                            Sentient
                        </span>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 filter drop-shadow-[0_0_30px_rgba(99,102,241,0.6)]">
                            Guidance
                        </span>
                    </h2>
                    <p className="text-xl text-slate-300 leading-relaxed">
                        Scroll to explore the neural pathway. <br />
                        <Link href="/signup" className="text-indigo-400 flex items-center gap-2 mt-4 text-sm font-bold uppercase tracking-widest hover:text-indigo-300 transition-colors">
                            Start Journey <ArrowRight className="w-4 h-4 animate-bounce-x" />
                        </Link>
                    </p>
                </div>

                {/* Conversation Steps */}
                {CONVERSATION_STEPS.map((step, i) => {
                    const isUser = step.role === "user";
                    return (
                        <div key={step.id} className="chat-card w-[400px] shrink-0 perspective-[1000px]">
                            <div className={cn(
                                "relative p-8 rounded-[2rem] backdrop-blur-xl border shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 group",
                                isUser
                                    ? "bg-slate-900/60 border-slate-700/50 text-slate-100"
                                    : "bg-indigo-900/40 border-indigo-500/30 text-indigo-100"
                            )}>
                                {/* Connecting Line (Visual) */}
                                <div className="absolute top-1/2 -left-[20vw] w-[20vw] h-[2px] bg-gradient-to-r from-transparent via-indigo-500/20 to-indigo-500/50 pointer-events-none" />

                                {/* Node Dot */}
                                <div className={cn(
                                    "absolute top-1/2 -left-3 w-6 h-6 rounded-full border-4 border-[#050214] shadow-lg transform -translate-y-1/2",
                                    isUser ? "bg-slate-500" : "bg-indigo-500 animate-pulse"
                                )} />

                                <div className="flex items-center gap-4 mb-6">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border border-white/10",
                                        isUser ? "bg-slate-800" : "bg-indigo-600"
                                    )}>
                                        {isUser ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg">{isUser ? "You" : "EduMate AI"}</div>
                                        {!isUser && (
                                            <div className="text-xs text-indigo-300 font-medium uppercase tracking-wider flex items-center gap-1">
                                                <Sparkles className="w-3 h-3" /> {step.mood}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <p className="text-lg leading-relaxed opacity-90">
                                    {step.text}
                                </p>

                                {/* Glow Effect on Hover */}
                                <div className={cn(
                                    "absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
                                    isUser
                                        ? "bg-gradient-to-br from-slate-500/10 to-transparent"
                                        : "bg-gradient-to-br from-indigo-500/10 to-transparent"
                                )} />
                            </div>
                        </div>
                    );
                })}

                {/* Final CTA */}
                <div className="w-[30vw] shrink-0 flex flex-col items-center justify-center text-center space-y-8 pr-[10vw]">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.5)] animate-bounce-slow">
                        <Zap className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-4xl font-bold text-white">
                        Ready to learn <br />
                        <span className="text-indigo-400">at lightspeed?</span>
                    </h3>
                    <Link href="/signup">
                        <Button size="lg" className="rounded-full px-10 py-6 text-xl bg-white text-indigo-950 hover:bg-indigo-50 shadow-xl hover:scale-105 transition-transform">
                            Start Chatting
                        </Button>
                    </Link>
                </div>

            </div>
        </div>
    );
}
