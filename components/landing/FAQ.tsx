"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Database, Binary, ShieldCheck, Cpu, Sparkles } from "lucide-react";
import { ParallaxElement } from "@/components/ui/ParallaxElement";
import { TiltCard } from "@/components/ui/TiltCard";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const FAQS = [
    {
        question: "How does the AI personalization work?",
        answer: "Our neural engine analyzes your quiz performance, learning speed, and preferred topics to create a custom curriculum. It constantly adapts, focusing on areas where you need more practice.",
        icon: Cpu,
        color: "#00D4FF"
    },
    {
        question: "Is EduMate AI suitable for all ages?",
        answer: "Yes! We have content tailored for high school students, college students, and lifelong learners. The interface is intuitive and easy to use for everyone.",
        icon: Database,
        color: "#6B46FF"
    },
    {
        question: "Can I use it offline?",
        answer: "Absolutely. With our Pro plan, you can download lessons and quizzes to study anywhere, anytime, even without an internet connection.",
        icon: ShieldCheck,
        color: "#00E676"
    },
    {
        question: "Do you offer a free trial?",
        answer: "We offer a generous Free plan that lets you access basic features forever. You can also try our Pro features risk-free with our 30-day money-back guarantee.",
        icon: Sparkles,
        color: "#FFB020"
    },
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
    const [isReducedMotion, setIsReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setIsReducedMotion(mediaQuery.matches);
        const handleChange = () => setIsReducedMotion(mediaQuery.matches);
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    useEffect(() => {
        if (isReducedMotion || !containerRef.current || !headerRef.current) return;

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
            gsap.set(headerRef.current, { opacity: 0, y: -50 });
            itemsRef.current.forEach((item, i) => {
                if (item) gsap.set(item, { opacity: 0, x: i % 2 === 0 ? -100 : 100 });
            });

            // Animate Header
            tl.to(headerRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0);

            // Animate Items Staggered
            itemsRef.current.forEach((item, i) => {
                if (item) {
                    tl.to(item, {
                        opacity: 1,
                        x: 0,
                        duration: 0.8,
                        ease: "power3.out"
                    }, 0.2 + (i * 0.15));
                }
            });

        }, containerRef);

        return () => ctx.revert();
    }, [isReducedMotion]);

    return (
        <section ref={containerRef} className="h-screen bg-[#050B14] relative overflow-hidden perspective-[2000px] flex flex-col items-center justify-center" id="faq">
            {/* Deep Space Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0F172A] via-[#050B14] to-black" />

            {/* Floating Particles (Parallax) */}
            <ParallaxElement speed={0.1} className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 opacity-20"><Binary className="w-32 h-32 text-[#00D4FF]" /></div>
                <div className="absolute bottom-40 right-20 opacity-20"><Database className="w-40 h-40 text-[#6B46FF]" /></div>
            </ParallaxElement>

            <ParallaxElement speed={0.2} className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-white rounded-full blur-[2px]" />
                <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-[#00E676] rounded-full blur-[4px]" />
            </ParallaxElement>

            <div className="container mx-auto px-4 relative z-10 max-w-4xl">
                <div ref={headerRef} className="text-center mb-16">
                    <ParallaxElement speed={-0.05}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00E676]/10 border border-[#00E676]/30 mb-6 backdrop-blur-md shadow-[0_0_20px_-5px_#00E676]">
                            <ShieldCheck className="w-4 h-4 text-[#00E676]" />
                            <span className="text-sm font-bold text-[#00E676] tracking-wider uppercase">Knowledge Base</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
                            System <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E676] to-[#00D4FF]">Queries</span>
                        </h2>
                    </ParallaxElement>
                </div>

                <div className="space-y-6">
                    {FAQS.map((faq, index) => (
                        <div
                            key={index}
                            ref={el => { itemsRef.current[index] = el }}
                        >
                            <TiltCard
                                className={cn(
                                    "rounded-2xl transition-all duration-500 overflow-hidden border",
                                    openIndex === index
                                        ? `bg-[${faq.color}]/10 border-[${faq.color}] shadow-[0_0_30px_-10px_${faq.color}]`
                                        : "bg-[#1E293B]/50 border-white/10 hover:border-white/30"
                                )}
                                style={{
                                    borderColor: openIndex === index ? faq.color : undefined
                                }}
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full flex items-center justify-between p-6 text-left relative group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={cn(
                                                "w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300",
                                                openIndex === index ? `bg-[${faq.color}] text-white` : "bg-white/5 text-slate-400 group-hover:text-white"
                                            )}
                                            style={{ backgroundColor: openIndex === index ? faq.color : undefined }}
                                        >
                                            <faq.icon className="w-5 h-5" />
                                        </div>
                                        <span className={cn("text-lg font-bold transition-colors", openIndex === index ? "text-white" : "text-slate-300 group-hover:text-white")}>
                                            {faq.question}
                                        </span>
                                    </div>
                                    <ChevronDown
                                        className={cn(
                                            "w-5 h-5 transition-transform duration-300",
                                            openIndex === index ? "rotate-180 text-white" : "text-slate-500"
                                        )}
                                    />

                                    {/* Hover Glow */}
                                    {openIndex !== index && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
                                    )}
                                </button>

                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "circOut" }}
                                        >
                                            <div className="px-6 pb-6 pl-[4.5rem] text-slate-300 leading-relaxed relative">
                                                {/* Decorative Line */}
                                                <div
                                                    className="absolute left-[2.75rem] top-0 bottom-6 w-px"
                                                    style={{ backgroundColor: `${faq.color}40` }}
                                                />
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </TiltCard>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
