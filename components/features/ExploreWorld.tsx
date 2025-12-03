"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Globe, MapPin, TrendingUp, Compass, Star, Rocket, Zap, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const REGIONS = [
    {
        id: 1,
        name: "North America",
        topCourse: "AI Ethics",
        students: "1.2M",
        color: "from-blue-500 to-cyan-400",
        planetColor: "bg-blue-500",
        desc: "Leading the charge in responsible AI development."
    },
    {
        id: 2,
        name: "Europe",
        topCourse: "Green Tech",
        students: "850k",
        color: "from-emerald-400 to-green-500",
        planetColor: "bg-emerald-500",
        desc: "Pioneering sustainable energy solutions."
    },
    {
        id: 3,
        name: "Asia",
        topCourse: "Robotics",
        students: "2.1M",
        color: "from-red-500 to-orange-500",
        planetColor: "bg-red-500",
        desc: "Advancing automation and humanoid robotics."
    },
    {
        id: 4,
        name: "South America",
        topCourse: "Digital Art",
        students: "600k",
        color: "from-yellow-400 to-amber-500",
        planetColor: "bg-yellow-400",
        desc: "Exploding with creative digital expression."
    },
    {
        id: 5,
        name: "Africa",
        topCourse: "Mobile Dev",
        students: "900k",
        color: "from-purple-500 to-violet-500",
        planetColor: "bg-purple-500",
        desc: "Building the next generation of mobile-first apps."
    },
];

export function ExploreWorld() {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [activeRegion, setActiveRegion] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!containerRef.current || !trackRef.current) return;

        const ctx = gsap.context(() => {
            const track = trackRef.current!;
            const scrollAmount = track.scrollWidth - window.innerWidth;

            // Horizontal Scroll
            gsap.to(track, {
                x: -scrollAmount,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: `+=${scrollAmount}`,
                    pin: true,
                    scrub: 1,
                    onUpdate: (self) => {
                        // Warp Speed Effect based on scroll velocity
                        const velocity = Math.abs(self.getVelocity());
                        gsap.to(".star-field", {
                            scale: 1 + velocity / 5000,
                            opacity: 0.5 + velocity / 2000,
                            duration: 0.1
                        });

                        // Determine active region based on center position
                        const cards = gsap.utils.toArray(".portal-card") as HTMLElement[];
                        const center = window.innerWidth / 2;

                        let closestIndex = 0;
                        let minDistance = Infinity;

                        cards.forEach((card, i) => {
                            const rect = card.getBoundingClientRect();
                            const cardCenter = rect.left + rect.width / 2;
                            const distance = Math.abs(cardCenter - center);

                            if (distance < minDistance) {
                                minDistance = distance;
                                closestIndex = i;
                            }
                        });

                        setActiveRegion(closestIndex);
                    }
                }
            });

            // Planet Rotation
            gsap.to(".planet-core", {
                rotation: 360,
                duration: 20,
                repeat: -1,
                ease: "none"
            });

            // Floating Portals
            gsap.to(".portal-card", {
                y: "random(-20, 20)",
                duration: "random(2, 4)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: {
                    amount: 1,
                    from: "random"
                }
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative h-screen w-full bg-[#030014] text-white overflow-hidden">

            {/* Starfield Background */}
            <div className="absolute inset-0 pointer-events-none star-field transition-transform duration-100">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/20 via-[#030014] to-[#030014]" />
                {mounted && [...Array(100)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-white rounded-full"
                        style={{
                            width: Math.random() * 2 + 'px',
                            height: Math.random() * 2 + 'px',
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%',
                            opacity: Math.random(),
                            animation: `twinkle ${Math.random() * 5 + 2}s infinite`
                        }}
                    />
                ))}
            </div>

            {/* Horizontal Track */}
            <div ref={trackRef} className="flex h-full items-center px-20 gap-40 w-max">

                {/* Intro Section */}
                <div className="w-screen shrink-0 flex flex-col items-center justify-center text-center px-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-bold uppercase tracking-wider mb-8 backdrop-blur-md">
                        <Compass className="w-4 h-4" />
                        <span>Multiverse Explorer</span>
                    </div>
                    <h2 className="text-6xl md:text-9xl font-black text-white mb-8 tracking-tighter">
                        Explore the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient">Knowledge Galaxy</span>
                    </h2>
                    <p className="text-2xl text-slate-400 max-w-2xl leading-relaxed">
                        Warp through different regions to discover what the world is learning. The universe of knowledge is vast—start your journey.
                    </p>
                    <div className="mt-12 animate-bounce">
                        <div className="flex flex-col items-center gap-2 text-slate-500 text-sm font-mono">
                            <span>SCROLL TO WARP</span>
                            <Navigation className="w-4 h-4 rotate-90" />
                        </div>
                    </div>
                </div>

                {/* Region Portals */}
                {REGIONS.map((region, i) => {
                    const isActive = i === activeRegion;
                    return (
                        <div
                            key={region.id}
                            className={cn(
                                "portal-card relative w-[500px] h-[600px] shrink-0 rounded-[3rem] border transition-all duration-700 group perspective-[1000px]",
                                isActive
                                    ? "bg-slate-900/80 border-white/20 shadow-[0_0_100px_rgba(255,255,255,0.1)] scale-100 opacity-100"
                                    : "bg-slate-900/40 border-white/5 scale-90 opacity-40 blur-sm"
                            )}
                        >
                            {/* Portal Window */}
                            <div className="absolute inset-0 rounded-[3rem] overflow-hidden">
                                {/* Planet Background */}
                                <div className={cn(
                                    "absolute -right-20 -top-20 w-96 h-96 rounded-full blur-[80px] opacity-40 transition-colors duration-700",
                                    region.planetColor
                                )} />
                                <div className={cn(
                                    "absolute -left-20 -bottom-20 w-80 h-80 rounded-full blur-[60px] opacity-30 transition-colors duration-700",
                                    region.planetColor
                                )} />

                                {/* Grid Overlay */}
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 h-full flex flex-col p-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-3 h-3 rounded-full animate-pulse", region.planetColor.replace('bg-', 'bg-'))} />
                                        <span className="text-slate-400 font-mono text-sm tracking-widest uppercase">Sector {region.id}</span>
                                    </div>
                                    <MapPin className="w-5 h-5 text-slate-500" />
                                </div>

                                <div className="mt-auto">
                                    <h3 className="text-5xl font-black text-white mb-4 leading-tight">{region.name}</h3>
                                    <div className={cn(
                                        "inline-block px-4 py-2 rounded-lg bg-white/5 border border-white/10 mb-6 backdrop-blur-md",
                                        isActive ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0",
                                        "transition-all duration-700 delay-100"
                                    )}>
                                        <span className={cn("text-transparent bg-clip-text bg-gradient-to-r font-bold", region.color)}>
                                            Trending: {region.topCourse}
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-lg leading-relaxed mb-8">
                                        {region.desc}
                                    </p>

                                    <div className="flex items-center gap-6 pt-8 border-t border-white/10">
                                        <div className="flex items-center gap-2 text-white font-bold">
                                            <TrendingUp className="w-5 h-5 text-green-400" />
                                            {region.students} <span className="text-slate-500 font-normal">Active Learners</span>
                                        </div>
                                        <Link href="/signup" className="ml-auto">
                                            <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full">
                                                Enter Portal <Rocket className="w-4 h-4 ml-2" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Holographic Planet (Visual Only) */}
                            <div className="absolute top-10 right-10 w-32 h-32 rounded-full border border-white/10 flex items-center justify-center overflow-hidden">
                                <div className={cn("planet-core w-24 h-24 rounded-full opacity-80 blur-sm", region.planetColor)} />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent)]" />
                            </div>
                        </div>
                    );
                })}

                {/* Final CTA */}
                <div className="w-screen shrink-0 flex items-center justify-center px-20">
                    <div className="text-center">
                        <h2 className="text-5xl md:text-8xl font-black text-white mb-8">
                            Your Journey <br />
                            Starts Here.
                        </h2>
                        <Link href="/signup">
                            <Button size="lg" className="bg-white text-slate-900 hover:bg-indigo-50 rounded-full px-16 py-10 text-2xl font-bold shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:scale-105 transition-all">
                                Launch Mission <Zap className="w-6 h-6 ml-3 fill-current" />
                            </Button>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
