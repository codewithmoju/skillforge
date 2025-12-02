"use client";

import { useState, useEffect, useRef } from "react";
import { Star, Quote, Globe, Sparkles, User } from "lucide-react";
import { motion } from "framer-motion";
import { ParallaxElement } from "@/components/ui/ParallaxElement";
import { TiltCard } from "@/components/ui/TiltCard";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
    {
        name: "Alex Johnson",
        role: "High School Student",
        quote: "EduMate AI helped me ace my calculus final. The step-by-step explanations are a lifesaver!",
        stat: "+25% Grade Increase",
        image: "bg-blue-500",
        color: "#00D4FF"
    },
    {
        name: "Sarah Lee",
        role: "College Freshman",
        quote: "I love how it adapts to my learning style. It feels like having a personal tutor 24/7.",
        stat: "Saved 10hrs/week",
        image: "bg-purple-500",
        color: "#6B46FF"
    },
    {
        name: "Michael Chen",
        role: "Lifelong Learner",
        quote: "The best way to learn new skills. The gamification keeps me motivated to study every day.",
        stat: "Completed 5 Courses",
        image: "bg-green-500",
        color: "#00E676"
    },
    {
        name: "Emily Davis",
        role: "Parent",
        quote: "My son actually enjoys studying now. His confidence has grown so much since using this app.",
        stat: "Happy Parent",
        image: "bg-orange-500",
        color: "#FFB020"
    },
    {
        name: "David Kim",
        role: "Software Engineer",
        quote: "The coding tutorials are top-notch. I learned React in a weekend thanks to the interactive labs.",
        stat: "Landed New Job",
        image: "bg-red-500",
        color: "#FF5722"
    },
];

export function Testimonials() {
    const containerRef = useRef<HTMLDivElement>(null);
    const orbitRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const [isReducedMotion, setIsReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setIsReducedMotion(mediaQuery.matches);
        const handleChange = () => setIsReducedMotion(mediaQuery.matches);
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    useEffect(() => {
        if (isReducedMotion || !containerRef.current || !orbitRef.current) return;

        const ctx = gsap.context(() => {
            // Pin the section
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top top",
                end: "+=300%", // Pin for 3 screens
                pin: true,
                scrub: 1,
                anticipatePin: 1,
                onUpdate: (self) => {
                    const progress = self.progress;
                    const totalCards = TESTIMONIALS.length;
                    const radiusX = window.innerWidth < 768 ? 150 : 400; // Horizontal radius
                    const radiusZ = window.innerWidth < 768 ? 50 : 100; // Depth radius (simulated)

                    cardsRef.current.forEach((card, i) => {
                        if (!card) return;

                        // Calculate angle based on scroll progress + index offset
                        // We rotate the whole system by 360 degrees (2 * PI) over the scroll duration
                        const angleOffset = (i / totalCards) * 2 * Math.PI;
                        const angle = (progress * 2 * Math.PI) + angleOffset;

                        // 3D Orbit Math
                        const x = Math.cos(angle) * radiusX;
                        const z = Math.sin(angle) * radiusZ; // Depth

                        // Scale and Opacity based on Z (depth)
                        // z goes from -radiusZ to +radiusZ
                        // We want scale to be 1 at front (+radiusZ) and smaller at back (-radiusZ)
                        const scale = gsap.utils.mapRange(-radiusZ, radiusZ, 0.6, 1.1, z);
                        const opacity = gsap.utils.mapRange(-radiusZ, radiusZ, 0.3, 1, z);
                        const zIndex = Math.round(gsap.utils.mapRange(-radiusZ, radiusZ, 0, 100, z));
                        const blur = gsap.utils.mapRange(-radiusZ, radiusZ, 4, 0, z);

                        gsap.set(card, {
                            x: x,
                            y: 0, // Keep vertically centered
                            scale: scale,
                            opacity: opacity,
                            zIndex: zIndex,
                            filter: `blur(${blur}px)`,
                        });
                    });
                }
            });

        }, containerRef);

        return () => ctx.revert();
    }, [isReducedMotion]);

    return (
        <section ref={containerRef} className="h-screen bg-[#050B14] relative overflow-hidden perspective-[2000px] flex flex-col items-center justify-center" id="testimonials">
            {/* Deep Space Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0F172A] via-[#050B14] to-black" />

            {/* Floating Particles (Parallax) */}
            <ParallaxElement speed={0.1} className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 right-10 opacity-20"><Quote className="w-32 h-32 text-[#6B46FF]" /></div>
                <div className="absolute bottom-40 left-20 opacity-20"><Globe className="w-40 h-40 text-[#00D4FF]" /></div>
            </ParallaxElement>

            <ParallaxElement speed={0.2} className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-white rounded-full blur-[2px]" />
                <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-[#FFB020] rounded-full blur-[4px]" />
            </ParallaxElement>

            <div className="container mx-auto px-4 relative z-10 h-full flex flex-col items-center justify-center">
                <div className="text-center mb-12 relative z-20">
                    <ParallaxElement speed={-0.05}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFB020]/10 border border-[#FFB020]/30 mb-6 backdrop-blur-md shadow-[0_0_20px_-5px_#FFB020]">
                            <Sparkles className="w-4 h-4 text-[#FFB020]" />
                            <span className="text-sm font-bold text-[#FFB020] tracking-wider uppercase">Global Intelligence</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
                            Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB020] to-[#FF5722]">Learners</span>
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light">
                            Join the neural network of successful students.
                        </p>
                    </ParallaxElement>
                </div>

                {/* Orbit Container */}
                <div ref={orbitRef} className="relative w-full max-w-5xl h-[400px] flex items-center justify-center perspective-[1000px]">
                    {/* Central Core */}
                    <div className="absolute w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-[#6B46FF] to-[#00D4FF] blur-[50px] opacity-50 animate-pulse-slow z-0" />
                    <div className="absolute w-24 h-24 md:w-32 md:h-32 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm z-0 flex items-center justify-center">
                        <Globe className="w-12 h-12 text-white/50 animate-spin-slow" />
                    </div>

                    {/* Orbiting Cards */}
                    {TESTIMONIALS.map((t, i) => (
                        <div
                            key={i}
                            ref={el => { cardsRef.current[i] = el }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[350px]"
                        >
                            <TiltCard className="rounded-2xl bg-[#1E293B]/80 backdrop-blur-xl border border-white/10 p-6 shadow-2xl">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`w-12 h-12 rounded-full ${t.image} flex items-center justify-center text-white font-bold text-lg shadow-lg relative overflow-hidden`}>
                                        {t.name.charAt(0)}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold">{t.name}</h4>
                                        <p className="text-slate-400 text-xs uppercase tracking-wider">{t.role}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} className="w-3 h-3 text-[#FFB020] fill-current" />
                                    ))}
                                </div>
                                <p className="text-slate-200 text-sm italic mb-4 leading-relaxed">"{t.quote}"</p>
                                <div
                                    className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border"
                                    style={{
                                        backgroundColor: `${t.color}15`,
                                        color: t.color,
                                        borderColor: `${t.color}30`
                                    }}
                                >
                                    {t.stat}
                                </div>
                            </TiltCard>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
