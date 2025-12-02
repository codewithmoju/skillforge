"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Spotlight } from "@/components/ui/Spotlight";
import { Meteors } from "@/components/ui/Meteors";

export function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={containerRef} className="relative min-h-[110vh] flex items-center justify-center overflow-hidden pt-32 pb-20 bg-[#071A3F]">
            {/* Background Effects */}
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <Meteors number={20} />
            </div>

            <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <motion.div
                    style={{ y, opacity }}
                    className="text-center lg:text-left"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md hover:border-[#6B46FF]/50 transition-colors cursor-default"
                    >
                        <Sparkles className="w-4 h-4 text-[#00D4FF]" />
                        <span className="text-sm font-medium text-slate-300">The Future of Learning is Here</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white leading-[1.1]"
                    >
                        Learn smarter. <br />
                        Faster. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6B46FF] to-[#00D4FF]">
                            For real results.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
                    >
                        EduMate AI crafts a personal study path, gives instant feedback, and helps you beat exam anxiety — all powered by adaptive AI.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                    >
                        <Link href="/signup" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto h-14 px-8 rounded-xl bg-[#FFB020] hover:bg-[#FFB020]/90 text-[#071A3F] font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                Start free
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/demo" className="w-full sm:w-auto">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-xl border-white/20 hover:bg-white/10 text-white font-medium text-lg backdrop-blur-sm">
                                <Play className="w-5 h-5 mr-2 fill-current" />
                                Watch demo
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Right Content - Phone Mockup */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="relative hidden lg:block"
                >
                    <div className="relative w-[300px] mx-auto">
                        {/* Phone Frame */}
                        <div className="relative z-20 rounded-[3rem] border-8 border-slate-900 bg-slate-950 shadow-2xl overflow-hidden h-[600px] w-full">
                            {/* Screen Content */}
                            <div className="absolute inset-0 bg-[#0F172A] flex flex-col">
                                {/* Fake Header */}
                                <div className="h-14 bg-[#071A3F] flex items-center justify-between px-4 border-b border-white/5">
                                    <div className="w-6 h-6 rounded-full bg-white/10" />
                                    <div className="w-20 h-4 rounded-full bg-white/10" />
                                    <div className="w-6 h-6 rounded-full bg-white/10" />
                                </div>
                                {/* Fake Body */}
                                <div className="p-4 space-y-4 flex-1 overflow-hidden">
                                    <div className="h-32 rounded-2xl bg-gradient-to-br from-[#6B46FF]/20 to-[#00D4FF]/20 border border-white/5 p-4">
                                        <div className="w-1/2 h-4 rounded bg-white/10 mb-2" />
                                        <div className="w-3/4 h-3 rounded bg-white/5" />
                                    </div>
                                    <div className="space-y-2">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="h-16 rounded-xl bg-white/5 border border-white/5 flex items-center px-4 gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-[#6B46FF]/20" />
                                                <div className="flex-1">
                                                    <div className="w-24 h-3 rounded bg-white/10 mb-1" />
                                                    <div className="w-16 h-2 rounded bg-white/5" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Floating Badge */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute bottom-8 right-4 bg-[#FFB020] text-[#071A3F] px-4 py-2 rounded-lg font-bold text-sm shadow-lg z-30"
                                >
                                    +15% Progress
                                </motion.div>
                            </div>
                        </div>
                        {/* Decorative Elements behind phone */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-[#6B46FF] to-[#00D4FF] rounded-[3.5rem] blur-2xl opacity-30 -z-10" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
