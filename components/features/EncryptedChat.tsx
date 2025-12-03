"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Lock, ShieldCheck, Eye, EyeOff, Key, Fingerprint, FileKey, Shield, Scan, Binary, Server } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const SECURITY_FEATURES = [
    {
        id: 1,
        title: "End-to-End Encryption",
        desc: "Your messages are locked before they leave your device. Only you and the recipient hold the keys.",
        icon: Key,
        color: "from-emerald-400 to-green-600",
        stat: "AES-256"
    },
    {
        id: 2,
        title: "Zero-Knowledge Proof",
        desc: "We can verify your identity without ever seeing your password or personal data.",
        icon: Fingerprint,
        color: "from-teal-400 to-cyan-600",
        stat: "100% Private"
    },
    {
        id: 3,
        title: "Self-Destructing Data",
        desc: "Set timers for sensitive messages. Once they're gone, they're gone forever.",
        icon: FileKey,
        color: "from-lime-400 to-green-500",
        stat: "Ephemeral"
    },
    {
        id: 4,
        title: "Quantum Resistant",
        desc: "Future-proof security designed to withstand even the most advanced decryption attacks.",
        icon: Shield,
        color: "from-green-400 to-emerald-500",
        stat: "Next-Gen"
    }
];

export function EncryptedChat() {
    const containerRef = useRef<HTMLDivElement>(null);
    const pinContainerRef = useRef<HTMLDivElement>(null);
    const [activeFeature, setActiveFeature] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!containerRef.current || !pinContainerRef.current) return;

        const ctx = gsap.context(() => {

            // Pinning Logic
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                pin: pinContainerRef.current,
                scrub: 1,
            });

            // Feature Activation
            const features = gsap.utils.toArray(".security-card");
            features.forEach((feature: any, i) => {
                ScrollTrigger.create({
                    trigger: feature,
                    start: "top center",
                    end: "bottom center",
                    onEnter: () => setActiveFeature(i),
                    onEnterBack: () => setActiveFeature(i),
                });
            });

            // Matrix Rain Effect
            gsap.to(".matrix-col", {
                y: "100%",
                duration: "random(2, 5)",
                repeat: -1,
                ease: "none",
                stagger: {
                    amount: 2,
                    from: "random"
                }
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative min-h-[300vh] w-full bg-[#020804] text-white overflow-hidden">

            {/* Matrix Background */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="flex justify-between w-full h-full overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="matrix-col w-8 text-center text-emerald-500/50 text-xs font-mono writing-vertical-rl"
                            style={{
                                writingMode: 'vertical-rl',
                                textOrientation: 'upright',
                                transform: 'translateY(-100%)'
                            }}
                        >
                            {mounted ? Array.from({ length: 30 }, () => Math.random() > 0.5 ? '1' : '0').join(' ') : '0 1 0 1 0 1'}
                        </div>
                    ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#020804] via-transparent to-[#020804]" />
            </div>

            <div className="container mx-auto px-4 relative z-10 h-full">
                <div className="flex flex-col lg:flex-row h-full">

                    {/* Pinned Vault (Left) */}
                    <div className="hidden lg:flex w-1/2 h-screen sticky top-0 items-center justify-center p-12" ref={pinContainerRef}>
                        <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">

                            {/* Holographic Shield Vault */}
                            <div className="relative w-[500px] h-[500px] flex items-center justify-center perspective-[1000px]">

                                {/* Outer Shield Ring */}
                                <div className={cn(
                                    "absolute inset-0 rounded-full border-2 border-dashed transition-colors duration-500 animate-[spin_20s_linear_infinite]",
                                    `border-${SECURITY_FEATURES[activeFeature].color.split('-')[1]}-500/30`
                                )} />

                                {/* Inner Shield Ring */}
                                <div className={cn(
                                    "absolute inset-[15%] rounded-full border-2 border-dotted transition-colors duration-500 animate-[spin_15s_linear_infinite_reverse]",
                                    `border-${SECURITY_FEATURES[activeFeature].color.split('-')[1]}-500/50`
                                )} />

                                {/* Core Vault */}
                                <div className="relative w-64 h-64 bg-slate-900/80 backdrop-blur-xl rounded-[3rem] border border-emerald-500/30 shadow-[0_0_100px_rgba(16,185,129,0.2)] flex items-center justify-center overflow-hidden group">

                                    {/* Scanning Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent h-[200%] w-full animate-[scan_3s_linear_infinite]" />

                                    {/* Active Icon */}
                                    <div className="relative z-10 text-center">
                                        <div className={cn(
                                            "w-24 h-24 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 shadow-2xl",
                                            `bg-gradient-to-br ${SECURITY_FEATURES[activeFeature].color}`
                                        )}>
                                            {(() => {
                                                const Icon = SECURITY_FEATURES[activeFeature].icon;
                                                return <Icon className="w-12 h-12 text-white" />;
                                            })()}
                                        </div>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                            <Lock className="w-3 h-3" />
                                            {SECURITY_FEATURES[activeFeature].stat}
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Security Nodes */}
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute w-16 h-16 bg-slate-900/90 border border-emerald-500/30 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm"
                                        style={{
                                            top: i === 0 ? '0%' : i === 1 ? '50%' : i === 2 ? '100%' : '50%',
                                            left: i === 0 ? '50%' : i === 1 ? '100%' : i === 2 ? '50%' : '0%',
                                            transform: 'translate(-50%, -50%)',
                                            animation: `float 4s ease-in-out infinite ${i * 1}s`
                                        }}
                                    >
                                        <Binary className="w-6 h-6 text-emerald-500/50" />
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>

                    {/* Scrolling Features (Right) */}
                    <div className="w-full lg:w-1/2 py-32 px-4 lg:px-12 space-y-40">
                        <div className="mb-20">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold uppercase tracking-wider mb-6 backdrop-blur-md">
                                <ShieldCheck className="w-4 h-4" />
                                <span>Quantum Vault</span>
                            </div>
                            <h3 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tighter">
                                Privacy is <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">Non-Negotiable.</span>
                            </h3>
                            <p className="text-xl text-slate-400 max-w-md leading-relaxed">
                                Your data is yours. We built a fortress around your learning journey, so you can explore freely without prying eyes.
                            </p>
                        </div>

                        {SECURITY_FEATURES.map((feature, i) => {
                            const isActive = i === activeFeature;
                            const Icon = feature.icon;

                            return (
                                <div
                                    key={feature.id}
                                    className={cn(
                                        "security-card relative p-8 rounded-[2.5rem] border transition-all duration-500 group overflow-hidden",
                                        isActive
                                            ? "bg-slate-900/80 border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.2)] scale-105"
                                            : "bg-[#05100a]/50 border-white/5 hover:bg-slate-900/40 hover:border-white/10 opacity-60"
                                    )}
                                >
                                    <div className="flex items-start gap-6 relative z-10">
                                        <div className={cn(
                                            "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 shadow-lg border border-white/10",
                                            `bg-gradient-to-br ${feature.color}`,
                                            isActive ? "scale-110" : "grayscale opacity-50"
                                        )}>
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>

                                        <div className="flex-1">
                                            <h4 className="text-2xl font-bold text-white mb-2">{feature.title}</h4>
                                            <p className="text-slate-400 text-lg leading-relaxed">{feature.desc}</p>
                                        </div>
                                    </div>

                                    {/* Active Scan Line */}
                                    {isActive && (
                                        <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500 shadow-[0_0_10px_#10b981] animate-[scan_2s_linear_infinite]" />
                                    )}
                                </div>
                            );
                        })}

                        <div className="pt-20 text-center">
                            <div className="p-12 rounded-[3rem] bg-gradient-to-br from-emerald-500/10 to-green-600/10 border border-emerald-500/20 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <h4 className="text-3xl font-bold text-white mb-8 relative z-10">Secure your future.</h4>
                                <Link href="/signup">
                                    <Button size="lg" className="bg-white text-slate-900 hover:bg-emerald-50 rounded-full px-12 py-8 text-xl font-bold shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] hover:scale-105 transition-all relative z-10">
                                        Start Private Chat
                                    </Button>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
