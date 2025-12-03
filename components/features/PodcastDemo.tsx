"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Mic, Play, Pause, Share2, MoreHorizontal, Headphones, Radio, Volume2, Disc, Music, Cast, Signal } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const PODCAST_EPISODES = [
    {
        id: 1,
        title: "The Quantum Leap",
        topic: "Physics 101",
        duration: "12:45",
        color: "from-pink-500 to-rose-600",
        waveColor: "bg-pink-500"
    },
    {
        id: 2,
        title: "Napoleon's Rise",
        topic: "European History",
        duration: "08:30",
        color: "from-violet-500 to-purple-600",
        waveColor: "bg-violet-500"
    },
    {
        id: 3,
        title: "Neural Networks",
        topic: "AI & Machine Learning",
        duration: "15:20",
        color: "from-cyan-400 to-blue-500",
        waveColor: "bg-cyan-400"
    },
    {
        id: 4,
        title: "The Art of Zen",
        topic: "Philosophy",
        duration: "10:15",
        color: "from-emerald-400 to-green-500",
        waveColor: "bg-emerald-400"
    }
];

export function PodcastDemo() {
    const containerRef = useRef<HTMLDivElement>(null);
    const pinContainerRef = useRef<HTMLDivElement>(null);
    const [activeEpisode, setActiveEpisode] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
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

            // Episode Activation
            const episodes = gsap.utils.toArray(".podcast-card");
            episodes.forEach((ep: any, i) => {
                ScrollTrigger.create({
                    trigger: ep,
                    start: "top center",
                    end: "bottom center",
                    onEnter: () => setActiveEpisode(i),
                    onEnterBack: () => setActiveEpisode(i),
                });
            });

            // Visualizer Animation
            gsap.to(".viz-bar", {
                height: "random(10, 100)%",
                duration: 0.5,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
                stagger: {
                    amount: 0.5,
                    from: "center"
                }
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative min-h-[300vh] w-full bg-[#0f0518] text-white overflow-hidden">

            {/* Sonic Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-pink-900/20 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-violet-900/20 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            </div>

            <div className="container mx-auto px-4 relative z-10 h-full">
                <div className="flex flex-col lg:flex-row h-full">

                    {/* Pinned Player (Left) */}
                    <div className="hidden lg:flex w-1/2 h-screen sticky top-0 items-center justify-center p-12" ref={pinContainerRef}>
                        <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">

                            {/* Rotating Vinyl / Sound Orb */}
                            <div className="relative w-[400px] h-[400px] rounded-full bg-slate-900 border-8 border-slate-800 shadow-[0_0_100px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden group">

                                {/* Album Art Gradient */}
                                <div className={cn(
                                    "absolute inset-0 transition-all duration-1000 opacity-80",
                                    `bg-gradient-to-br ${PODCAST_EPISODES[activeEpisode].color}`
                                )} />

                                {/* Vinyl Grooves */}
                                <div className="absolute inset-0 rounded-full border-[40px] border-black/10" />
                                <div className="absolute inset-[10%] rounded-full border-[40px] border-black/10" />
                                <div className="absolute inset-[20%] rounded-full border-[40px] border-black/10" />

                                {/* Spinning Animation */}
                                <div className={cn(
                                    "absolute inset-0 rounded-full animate-[spin_10s_linear_infinite]",
                                    isPlaying ? "running" : "paused"
                                )}>
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1/2 bg-gradient-to-b from-white/20 to-transparent" />
                                </div>

                                {/* Center Label */}
                                <div className="absolute w-32 h-32 rounded-full bg-slate-950 border-4 border-slate-800 flex items-center justify-center z-10 shadow-2xl">
                                    <Headphones className="w-12 h-12 text-white" />
                                </div>
                            </div>

                            {/* Visualizer Bars (Background) */}
                            <div className="absolute inset-0 -z-10 flex items-center justify-center gap-2 opacity-30 scale-150">
                                {[...Array(20)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn("viz-bar w-4 rounded-full transition-colors duration-500", PODCAST_EPISODES[activeEpisode].waveColor)}
                                        style={{ height: '50%' }}
                                    />
                                ))}
                            </div>

                        </div>
                    </div>

                    {/* Scrolling Playlist (Right) */}
                    <div className="w-full lg:w-1/2 py-32 px-4 lg:px-12 space-y-40">
                        <div className="mb-20">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-sm font-bold uppercase tracking-wider mb-6 backdrop-blur-md">
                                <Radio className="w-4 h-4" />
                                <span>Audio Synthesis</span>
                            </div>
                            <h3 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tighter">
                                Learning, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-500">Unplugged.</span>
                            </h3>
                            <p className="text-xl text-slate-400 max-w-md leading-relaxed">
                                Turn any lesson into an immersive audio experience. Perfect for learning while you commute, workout, or relax.
                            </p>
                        </div>

                        {PODCAST_EPISODES.map((ep, i) => {
                            const isActive = i === activeEpisode;
                            return (
                                <div
                                    key={ep.id}
                                    className={cn(
                                        "podcast-card relative p-8 rounded-[2.5rem] border transition-all duration-500 group overflow-hidden",
                                        isActive
                                            ? "bg-slate-800/80 border-pink-500/30 shadow-[0_0_50px_rgba(0,0,0,0.3)] scale-105"
                                            : "bg-[#1a1025]/50 border-white/5 hover:bg-slate-800/40 hover:border-white/10 opacity-60"
                                    )}
                                >
                                    <div className="flex items-center gap-6 relative z-10">
                                        <div className={cn(
                                            "w-20 h-20 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 shadow-lg border border-white/10",
                                            `bg-gradient-to-br ${ep.color}`,
                                            isActive ? "animate-[spin_10s_linear_infinite]" : ""
                                        )}>
                                            <Disc className="w-10 h-10 text-white" />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="text-2xl font-bold text-white">{ep.title}</h4>
                                                <span className="text-xs font-mono text-slate-400 bg-white/5 px-2 py-1 rounded-md">{ep.duration}</span>
                                            </div>
                                            <p className="text-pink-400 font-medium text-sm uppercase tracking-wider mb-4">{ep.topic}</p>

                                            {/* Mini Visualizer */}
                                            {isActive && (
                                                <div className="flex items-end gap-1 h-6">
                                                    {[...Array(15)].map((_, j) => (
                                                        <div
                                                            key={j}
                                                            className={cn("w-1 rounded-full animate-pulse", ep.waveColor)}
                                                            style={{
                                                                height: mounted ? `${Math.random() * 100}%` : '50%',
                                                                animationDelay: `${j * 0.1}s`
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Play Button Overlay */}
                                    <div className="absolute right-8 bottom-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <Button size="icon" className="rounded-full bg-white text-slate-900 hover:bg-pink-50">
                                            <Play className="w-4 h-4 fill-current ml-0.5" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}

                        <div className="pt-20 text-center">
                            <div className="p-12 rounded-[3rem] bg-gradient-to-br from-pink-500/10 to-rose-600/10 border border-pink-500/20 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <h4 className="text-3xl font-bold text-white mb-8 relative z-10">Ready to tune in?</h4>
                                <Link href="/signup">
                                    <Button size="lg" className="bg-white text-slate-900 hover:bg-pink-50 rounded-full px-12 py-8 text-xl font-bold shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] hover:scale-105 transition-all relative z-10">
                                        Start Listening
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
