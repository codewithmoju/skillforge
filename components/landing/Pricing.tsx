"use client";

import { useState, useEffect, useRef } from "react";
import { Check, Zap, Sparkles, Cpu, Shield, Rocket } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { ParallaxElement } from "@/components/ui/ParallaxElement";
import { TiltCard } from "@/components/ui/TiltCard";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const PLANS = [
    {
        name: "Initiate",
        price: { monthly: 0, yearly: 0 },
        description: "Core systems activation.",
        features: ["Basic Neural Link", "5 Simulations/Day", "Standard Telemetry", "Community Grid"],
        cta: "Initialize",
        popular: false,
        icon: Cpu,
        color: "#00D4FF",
        gradient: "from-[#00D4FF] to-[#00E676]"
    },
    {
        name: "Accelerate",
        price: { monthly: 19, yearly: 190 },
        description: "Maximum velocity achieved.",
        features: ["Unlimited Neural Link", "Infinite Simulations", "Deep Dive Analytics", "Priority Uplink", "Offline Cache"],
        cta: "Upgrade System",
        popular: true,
        icon: Zap,
        color: "#6B46FF",
        gradient: "from-[#6B46FF] to-[#00D4FF]"
    },
    {
        name: "Omniscient",
        price: { monthly: 49, yearly: 490 },
        description: "Total cognitive dominance.",
        features: ["Everything in Accelerate", "Admin Control Deck", "Bulk Unit Management", "Custom Protocols", "API Gateway"],
        cta: "Contact Command",
        popular: false,
        icon: Shield,
        color: "#FFB020",
        gradient: "from-[#FFB020] to-[#FF5722]"
    },
];

export function Pricing() {
    const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
    const containerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
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
        if (isReducedMotion || !containerRef.current || !headerRef.current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=200%", // Pin for 2 screens
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1,
                }
            });

            // Initial states
            gsap.set(headerRef.current, { opacity: 0, y: -50 });
            cardsRef.current.forEach((card, i) => {
                if (card) gsap.set(card, { opacity: 0, y: 100, scale: 0.8 });
            });

            // Animate Header
            tl.to(headerRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0);

            // Animate Cards Staggered
            cardsRef.current.forEach((card, i) => {
                if (card) {
                    tl.to(card, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.8,
                        ease: "back.out(1.7)"
                    }, 0.3 + (i * 0.2));
                }
            });

        }, containerRef);

        return () => ctx.revert();
    }, [isReducedMotion]);

    return (
        <section ref={containerRef} className="h-screen bg-[#050B14] relative overflow-hidden perspective-[2000px] flex flex-col items-center justify-center" id="pricing">
            {/* Deep Space Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0F172A] via-[#050B14] to-black" />

            {/* Floating Particles (Parallax) */}
            <ParallaxElement speed={0.1} className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 opacity-20"><Rocket className="w-24 h-24 text-[#FFB020]" /></div>
                <div className="absolute bottom-40 right-20 opacity-20"><Cpu className="w-32 h-32 text-[#00D4FF]" /></div>
            </ParallaxElement>

            <ParallaxElement speed={0.2} className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-white rounded-full blur-[2px]" />
                <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-[#6B46FF] rounded-full blur-[4px]" />
            </ParallaxElement>

            <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center">
                <div ref={headerRef} className="text-center mb-12 flex-shrink-0">
                    <ParallaxElement speed={-0.05}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6B46FF]/10 border border-[#6B46FF]/30 mb-6 backdrop-blur-md shadow-[0_0_20px_-5px_#6B46FF]">
                            <Sparkles className="w-4 h-4 text-[#6B46FF]" />
                            <span className="text-sm font-bold text-[#6B46FF] tracking-wider uppercase">System Upgrades</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
                            Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#6B46FF]">Module</span>
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-8 font-light">
                            Invest in your cognitive architecture.
                        </p>

                        {/* Futuristic Toggle */}
                        <div className="flex items-center justify-center gap-6">
                            <span className={`text-sm font-bold tracking-wider transition-colors ${billing === "monthly" ? "text-white" : "text-slate-500"}`}>MONTHLY</span>
                            <button
                                onClick={() => setBilling(billing === "monthly" ? "yearly" : "monthly")}
                                className="w-20 h-10 rounded-full bg-[#0F172A] border border-white/20 relative p-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] transition-all hover:border-[#6B46FF]/50"
                            >
                                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
                                <motion.div
                                    animate={{ x: billing === "monthly" ? 0 : 40 }}
                                    className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6B46FF] to-[#00D4FF] shadow-[0_0_15px_#6B46FF] border border-white/20 relative z-10"
                                >
                                    <div className="absolute inset-0 bg-white/20 rounded-full blur-[2px]" />
                                </motion.div>
                            </button>
                            <span className={`text-sm font-bold tracking-wider transition-colors ${billing === "yearly" ? "text-white" : "text-slate-500"}`}>
                                YEARLY <span className="text-[#00E676] text-xs ml-1 font-mono border border-[#00E676]/30 px-1 rounded bg-[#00E676]/10">-20%</span>
                            </span>
                        </div>
                    </ParallaxElement>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto items-stretch w-full">
                    {PLANS.map((plan, index) => (
                        <div
                            key={index}
                            ref={el => { cardsRef.current[index] = el }}
                            className={cn("h-full", plan.popular ? "md:-mt-4 md:-mb-4 z-20" : "z-10")}
                        >
                            <TiltCard
                                className={cn(
                                    "h-full p-1 rounded-[2rem] transition-all duration-500 group relative",
                                    plan.popular
                                        ? "bg-gradient-to-br from-[#6B46FF] via-[#00D4FF] to-[#6B46FF] shadow-[0_0_50px_-10px_rgba(107,70,255,0.4)]"
                                        : "bg-gradient-to-br from-white/10 to-transparent hover:border-white/20"
                                )}
                            >
                                <div className="bg-[#050B14]/90 backdrop-blur-xl rounded-[1.9rem] h-full p-6 flex flex-col relative overflow-hidden">
                                    {/* Scanline Effect */}
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_4px,3px_100%] opacity-20" />

                                    {/* Popular Badge */}
                                    {plan.popular && (
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#6B46FF] to-[#00D4FF] text-white text-[10px] font-bold px-4 py-1 rounded-b-xl uppercase tracking-widest shadow-[0_0_20px_#6B46FF] z-20">
                                            Recommended Module
                                        </div>
                                    )}

                                    <div className="relative z-10 mb-6">
                                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                            <plan.icon className="w-6 h-6 text-white" />
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                                        <p className="text-slate-400 text-xs mb-4 font-light">{plan.description}</p>

                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-black text-white tracking-tight">
                                                ${billing === "monthly" ? plan.price.monthly : Math.round(plan.price.yearly / 12)}
                                            </span>
                                            <span className="text-slate-500 font-medium text-sm">/mo</span>
                                        </div>
                                        {billing === "yearly" && plan.price.yearly > 0 && (
                                            <p className="text-[10px] text-[#00E676] mt-1 font-mono">Billed ${plan.price.yearly} yearly</p>
                                        )}
                                    </div>

                                    <div className="relative z-10 flex-1">
                                        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
                                        <ul className="space-y-3 mb-6">
                                            {plan.features.map((feature, i) => (
                                                <li key={i} className="flex items-start gap-2 text-xs text-slate-300 group/item">
                                                    <div className={`mt-0.5 w-4 h-4 rounded-full bg-${plan.popular ? '[#6B46FF]/20' : 'white/5'} flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#00E676]/20 transition-colors`}>
                                                        <Check className={`w-2.5 h-2.5 text-${plan.popular ? '[#00D4FF]' : 'slate-400'} group-hover/item:text-[#00E676] transition-colors`} />
                                                    </div>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="relative z-10 mt-auto">
                                        <Button
                                            className={cn(
                                                "w-full h-12 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg",
                                                plan.popular
                                                    ? "bg-gradient-to-r from-[#6B46FF] to-[#00D4FF] hover:shadow-[0_0_30px_#6B46FF] text-white border-0"
                                                    : "bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/30"
                                            )}
                                        >
                                            {plan.cta}
                                        </Button>
                                    </div>

                                    {/* Corner Accents */}
                                    <div className={`absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 rounded-tl-2xl transition-colors duration-500 ${plan.popular ? "border-[#6B46FF]" : "border-white/10 group-hover:border-white/30"}`} />
                                    <div className={`absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 rounded-br-2xl transition-colors duration-500 ${plan.popular ? "border-[#00D4FF]" : "border-white/10 group-hover:border-white/30"}`} />
                                </div>
                            </TiltCard>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-8 relative z-10">
                    <p className="text-slate-500 text-xs font-mono flex items-center justify-center gap-2">
                        <Shield className="w-3 h-3" />
                        SECURE TRANSACTION // 30-DAY MONEY-BACK GUARANTEE
                    </p>
                </div>
            </div>
        </section>
    );
}
