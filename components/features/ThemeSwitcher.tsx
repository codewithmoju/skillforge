"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calculator, Hourglass, Terminal, ScanFace, Fingerprint, Cpu, Sigma, Pi, Binary, Code2, ScrollText, Landmark, Activity, Globe, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

gsap.registerPlugin(ScrollTrigger);

const THEMES = [
    {
        id: "math",
        name: "Mathematics",
        icon: Calculator,
        bg: "bg-slate-950",
        hudBg: "bg-blue-950/20",
        borderColor: "border-cyan-500/50",
        accent: "text-cyan-400",
        font: "font-mono",
        shape: "rounded-none",
        borderWidth: "border",
        description: "Geometric Precision",
        data: [Sigma, Pi, Activity],
        glitchColor: "cyan"
    },
    {
        id: "history",
        name: "History",
        icon: Hourglass,
        bg: "bg-[#2a1b0a]",
        hudBg: "bg-amber-950/40",
        borderColor: "border-amber-600/50",
        accent: "text-amber-200",
        font: "font-serif",
        shape: "rounded-[3rem]",
        borderWidth: "border-[6px] double",
        description: "Timeless Narrative",
        data: [ScrollText, Landmark, Globe],
        glitchColor: "orange"
    },
    {
        id: "coding",
        name: "Computer Science",
        icon: Terminal,
        bg: "bg-black",
        hudBg: "bg-green-950/30",
        borderColor: "border-green-500/50",
        accent: "text-green-400",
        font: "font-mono",
        shape: "rounded-lg",
        borderWidth: "border-l-4 border-y border-r",
        description: "System Logic",
        data: [Binary, Code2, Cpu],
        glitchColor: "green"
    }
];

export function ThemeSwitcher() {
    const containerRef = useRef<HTMLDivElement>(null);
    const hudRef = useRef<HTMLDivElement>(null);
    const [activeTheme, setActiveTheme] = useState(THEMES[0]);
    const [glitch, setGlitch] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!containerRef.current || !hudRef.current) return;

        const ctx = gsap.context(() => {

            // Create scroll triggers for each theme section
            THEMES.forEach((theme, i) => {
                ScrollTrigger.create({
                    trigger: containerRef.current,
                    start: `${i * 100}vh top`, // Staggered start points
                    end: `${(i + 1) * 100}vh top`,
                    onEnter: () => handleThemeChange(theme),
                    onEnterBack: () => handleThemeChange(theme),
                });
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleThemeChange = (theme: typeof THEMES[0]) => {
        setGlitch(true);
        setActiveTheme(theme);

        // Glitch effect timeout
        setTimeout(() => setGlitch(false), 300);

        // Animate HUD morph
        if (hudRef.current) {
            gsap.fromTo(hudRef.current,
                { scale: 0.95, opacity: 0.8 },
                { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
            );
        }
    };

    return (
        <div ref={containerRef} className="relative w-full bg-black" style={{ height: `${THEMES.length * 100}vh` }}>

            {/* Sticky Container */}
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

                {/* Dynamic Background */}
                <div className={cn(
                    "absolute inset-0 transition-colors duration-700 ease-in-out",
                    activeTheme.bg
                )}>
                    {/* Grid/Pattern Overlay */}
                    <div className={cn(
                        "absolute inset-0 opacity-20 transition-all duration-700",
                        activeTheme.id === 'math' && "bg-[linear-gradient(rgba(34,211,238,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.1)_1px,transparent_1px)] bg-[size:40px_40px]",
                        activeTheme.id === 'history' && "bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]",
                        activeTheme.id === 'coding' && "bg-[linear-gradient(0deg,rgba(34,197,94,0.1)_1px,transparent_1px)] bg-[size:100%_4px]"
                    )} />

                    {/* Vignette */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)]" />
                </div>

                {/* The Shapeshifting HUD */}
                <div
                    ref={hudRef}
                    className={cn(
                        "relative w-[90vw] max-w-3xl aspect-video transition-all duration-500 ease-in-out backdrop-blur-xl shadow-2xl overflow-hidden",
                        activeTheme.hudBg,
                        activeTheme.borderColor,
                        activeTheme.shape,
                        activeTheme.borderWidth,
                        glitch && "animate-pulse scale-[1.02] filter hue-rotate-90"
                    )}
                >
                    {/* Glitch Overlay */}
                    {glitch && (
                        <div className="absolute inset-0 bg-white/10 z-50 mix-blend-overlay" />
                    )}

                    {/* HUD Header */}
                    <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <div className={cn("p-2 rounded bg-white/5", activeTheme.accent)}>
                                <activeTheme.icon className="w-6 h-6" />
                            </div>
                            <div className={cn("text-sm font-bold uppercase tracking-widest", activeTheme.font, activeTheme.accent)}>
                                {activeTheme.name}_MODULE
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className={cn("w-2 h-2 rounded-full animate-ping", activeTheme.accent, "bg-current")} />
                            <div className={cn("text-xs font-bold", activeTheme.accent)}>LIVE</div>
                        </div>
                    </div>

                    {/* HUD Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center z-10">
                        <div className={cn("mb-6 transition-all duration-500", glitch ? "translate-x-2" : "translate-x-0")}>
                            <h2 className={cn("text-6xl md:text-8xl font-black text-white mb-4", activeTheme.font)}>
                                {activeTheme.description}
                            </h2>
                            <p className="text-xl text-white/60 max-w-lg mx-auto">
                                AI automatically reconfigures the learning interface to match the cognitive requirements of the subject.
                            </p>
                        </div>

                        {/* Dynamic Data Viz */}
                        <div className="flex gap-8 mt-12">
                            {mounted && activeTheme.data.map((Icon, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 group">
                                    <div className={cn(
                                        "w-16 h-16 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 transition-all duration-300 group-hover:scale-110",
                                        activeTheme.borderColor
                                    )}>
                                        <Icon className={cn("w-8 h-8 transition-colors", activeTheme.accent)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* HUD Footer / Controls */}
                    <div className="absolute bottom-0 left-0 w-full p-6 flex justify-between items-center border-t border-white/10 bg-black/20">
                        <div className={cn("text-xs opacity-50 font-mono", activeTheme.accent)}>
                            SYS.VER.3.4.1 // {activeTheme.id.toUpperCase()}
                        </div>
                        <Button
                            variant="outline"
                            className={cn(
                                "border-white/20 hover:bg-white/10 text-white transition-all",
                                activeTheme.shape
                            )}
                        >
                            <Zap className="w-4 h-4 mr-2" />
                            Initialize Theme
                        </Button>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-1/2 left-4 w-1 h-12 bg-white/10 rounded-full" />
                    <div className="absolute top-1/2 right-4 w-1 h-12 bg-white/10 rounded-full" />
                </div>

                {/* Scroll Progress Indicator */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4">
                    {THEMES.map((theme) => (
                        <div
                            key={theme.id}
                            className={cn(
                                "w-3 h-3 rounded-full border transition-all duration-300",
                                activeTheme.id === theme.id ? "bg-white scale-125" : "bg-transparent border-white/30"
                            )}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
}
