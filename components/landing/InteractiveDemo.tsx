"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ArrowRight, Atom, BrainCircuit, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TiltCard } from "@/components/ui/TiltCard";
import { ParallaxElement } from "@/components/ui/ParallaxElement";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const QUESTION = {
    text: "What phenomenon describes particles remaining connected regardless of distance?",
    category: "QUANTUM PHYSICS",
    difficulty: "HARD",
    options: [
        { id: "a", text: "Quantum Tunneling" },
        { id: "b", text: "Quantum Entanglement" },
        { id: "c", text: "Superposition" },
        { id: "d", text: "Wave-Particle Duality" },
    ],
    correct: "b",
    explanation: "Correct! Quantum Entanglement occurs when particles become correlated in such a way that the quantum state of each particle cannot be described independently.",
};

export function InteractiveDemo() {
    const [selected, setSelected] = useState<string | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const leftColRef = useRef<HTMLDivElement>(null);
    const rightColRef = useRef<HTMLDivElement>(null);
    const [isReducedMotion, setIsReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setIsReducedMotion(mediaQuery.matches);
        const handleChange = () => setIsReducedMotion(mediaQuery.matches);
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    useEffect(() => {
        if (isReducedMotion || !containerRef.current || !leftColRef.current || !rightColRef.current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=150%", // Pin for 1.5 screens
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1,
                }
            });

            // Initial states
            gsap.set(leftColRef.current, { opacity: 0, x: -50, scale: 0.9 });
            gsap.set(rightColRef.current, { opacity: 0, x: 50, scale: 0.9 });

            // Animate In
            tl.to(leftColRef.current, { opacity: 1, x: 0, scale: 1, duration: 1, ease: "power2.out" }, 0)
                .to(rightColRef.current, { opacity: 1, x: 0, scale: 1, duration: 1, ease: "power2.out" }, 0.2);

        }, containerRef);

        return () => ctx.revert();
    }, [isReducedMotion]);

    const handleSelect = (id: string) => {
        if (selected) return;
        setSelected(id);
        setShowExplanation(true);
    };

    return (
        <section ref={containerRef} className="h-screen bg-[#050B14] relative overflow-hidden perspective-[2000px] flex items-center justify-center">
            {/* Deep Space Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0F172A] via-[#050B14] to-black" />

            {/* Floating Particles (Parallax) */}
            <ParallaxElement speed={0.1} className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 opacity-20"><Atom className="w-32 h-32 text-[#00D4FF]" /></div>
                <div className="absolute bottom-40 right-20 opacity-20"><BrainCircuit className="w-40 h-40 text-[#6B46FF]" /></div>
            </ParallaxElement>

            <ParallaxElement speed={0.2} className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-white rounded-full blur-[2px]" />
                <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-[#00D4FF] rounded-full blur-[4px]" />
            </ParallaxElement>

            <div ref={contentRef} className="container mx-auto px-4 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <TiltCard className="rounded-[2.5rem] bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl border border-white/10 shadow-[0_0_50px_-10px_rgba(107,70,255,0.2)] overflow-hidden group">
                        <div className="grid md:grid-cols-2 relative min-h-[600px]">
                            {/* Left: Holographic AI Core */}
                            <div ref={leftColRef} className="p-8 md:p-12 relative overflow-hidden flex flex-col justify-center">
                                {/* Animated Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#6B46FF]/20 via-[#00D4FF]/10 to-transparent opacity-50" />
                                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 bg-center" />

                                {/* AI Pulse Animation */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#6B46FF]/20 rounded-full blur-[80px] animate-pulse-slow" />

                                <div className="relative z-10">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold text-[#00D4FF] mb-8 w-fit tracking-wider">
                                        <span className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse shadow-[0_0_10px_#00D4FF]" />
                                        LIVE SYSTEM DEMO
                                    </div>

                                    <h3 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                                        Experience <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#6B46FF]">Adaptive Intelligence</span>
                                    </h3>

                                    <p className="text-slate-300 text-lg mb-8 leading-relaxed font-light">
                                        Our neural engine analyzes your responses in real-time, calibrating the curriculum to your cognitive velocity.
                                    </p>

                                    <Button className="w-fit h-12 px-8 rounded-xl bg-white text-[#050B14] hover:bg-white/90 font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300">
                                        Start Full Lesson
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </div>

                            {/* Right: Holographic Quiz Interface */}
                            <div ref={rightColRef} className="p-8 md:p-12 bg-[#050B14]/50 backdrop-blur-md border-l border-white/5 relative flex flex-col justify-center">
                                {/* Scanline */}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_4px,3px_100%] opacity-10" />

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <span className="text-xs font-bold text-[#6B46FF] uppercase tracking-widest border border-[#6B46FF]/30 px-2 py-1 rounded bg-[#6B46FF]/10">
                                            {QUESTION.category}
                                        </span>
                                        <div className="flex gap-1">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 3 ? 'bg-red-500 animate-pulse' : 'bg-[#00D4FF]'}`} />
                                            ))}
                                        </div>
                                    </div>

                                    <h4 className="text-xl md:text-2xl font-bold text-white mb-8 leading-snug">
                                        {QUESTION.text}
                                    </h4>

                                    <div className="space-y-4">
                                        {QUESTION.options.map((option) => {
                                            const isSelected = selected === option.id;
                                            const isCorrect = option.id === QUESTION.correct;
                                            const showResult = selected !== null;

                                            let borderColor = "border-white/10";
                                            let bgColor = "bg-white/5";
                                            let textColor = "text-slate-300";

                                            if (showResult) {
                                                if (isSelected && isCorrect) {
                                                    borderColor = "border-[#00E676]";
                                                    bgColor = "bg-[#00E676]/20";
                                                    textColor = "text-white";
                                                } else if (isSelected && !isCorrect) {
                                                    borderColor = "border-red-500";
                                                    bgColor = "bg-red-500/20";
                                                    textColor = "text-white";
                                                } else if (isCorrect) {
                                                    borderColor = "border-[#00E676]";
                                                    bgColor = "bg-[#00E676]/10";
                                                    textColor = "text-white";
                                                }
                                            }

                                            return (
                                                <button
                                                    key={option.id}
                                                    onClick={() => handleSelect(option.id)}
                                                    disabled={selected !== null}
                                                    className={`w-full text-left p-4 rounded-xl border ${borderColor} ${bgColor} transition-all duration-300 hover:bg-white/10 flex items-center justify-between group relative overflow-hidden`}
                                                >
                                                    <span className={`font-medium z-10 relative ${textColor}`}>{option.text}</span>

                                                    {/* Hover Glow */}
                                                    {!showResult && <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />}

                                                    {showResult && isCorrect && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="z-10"
                                                        >
                                                            <CheckCircle2 className="w-5 h-5 text-[#00E676]" />
                                                        </motion.div>
                                                    )}
                                                    {showResult && isSelected && !isCorrect && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="z-10"
                                                        >
                                                            <XCircle className="w-5 h-5 text-red-500" />
                                                        </motion.div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <AnimatePresence>
                                        {showExplanation && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-5 rounded-xl bg-[#6B46FF]/10 border border-[#6B46FF]/30 backdrop-blur-sm relative">
                                                    <div className="absolute top-0 left-0 w-1 h-full bg-[#6B46FF]" />
                                                    <div className="flex gap-3">
                                                        <Sparkles className="w-5 h-5 text-[#6B46FF] flex-shrink-0 mt-0.5" />
                                                        <p className="text-sm text-slate-200 leading-relaxed">
                                                            <span className="font-bold text-[#6B46FF] block mb-1 text-xs uppercase tracking-wider">AI Analysis</span>
                                                            {QUESTION.explanation}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </TiltCard>
                </div>
            </div>
        </section>
    );
}
