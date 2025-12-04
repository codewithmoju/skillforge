"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { User, Share2, Award, Zap, Trophy, Star, Target, Hexagon, Shield, Crown, Sparkles, GraduationCap, BookOpen, Code, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const ACHIEVEMENTS = [
    { id: 1, title: "Code Wizard", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20", desc: "Mastered complex algorithms" },
    { id: 2, title: "Bug Hunter", icon: Target, color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20", desc: "Resolved 50+ critical issues" },
    { id: 3, title: "Fast Learner", icon: Sparkles, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", desc: "Completed 5 courses in 1 week" },
    { id: 4, title: "Team Player", icon: User, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20", desc: "Top contributor in community" },
];

const SKILLS = [
    { name: "React", level: 95, color: "text-cyan-400", border: "border-cyan-400", icon: Code },
    { name: "Node.js", level: 88, color: "text-green-500", border: "border-green-500", icon: Hexagon },
    { name: "Python", level: 92, color: "text-yellow-400", border: "border-yellow-400", icon: BookOpen },
    { name: "Design", level: 85, color: "text-pink-500", border: "border-pink-500", icon: Palette },
];

export function ProfilePreview() {
    const containerRef = useRef<HTMLDivElement>(null);
    const pinContainerRef = useRef<HTMLDivElement>(null);
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

            // Avatar Hover/Float
            gsap.to(".holo-avatar", {
                y: -20,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

            // Orbiting Satellites
            gsap.to(".satellite-ring", {
                rotation: 360,
                duration: 40,
                repeat: -1,
                ease: "none"
            });

            gsap.to(".satellite-ring-reverse", {
                rotation: -360,
                duration: 35,
                repeat: -1,
                ease: "none"
            });

            // Skill Orbs Animation
            gsap.from(".skill-orb", {
                scale: 0,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: ".skills-constellation",
                    start: "top center",
                }
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative min-h-[200vh] w-full bg-[#050505] text-white overflow-hidden">

            {/* Constellation Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,165,0,0.05),transparent_70%)]" />
                {mounted && [...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-white rounded-full opacity-20"
                        style={{
                            width: Math.random() * 2 + 'px',
                            height: Math.random() * 2 + 'px',
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%',
                            animation: `pulse ${Math.random() * 3 + 2}s infinite`
                        }}
                    />
                ))}
                {/* Grid Floor */}
                <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-[linear-gradient(to_bottom,transparent,rgba(255,165,0,0.05))] [mask-image:linear-gradient(to_bottom,transparent,black)]" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200vw] h-[50vh] bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(1000px)_rotateX(60deg)] opacity-30" />
            </div>

            <div className="container mx-auto px-4 relative z-10 h-full">
                <div className="flex flex-col lg:flex-row h-full">

                    {/* Pinned Avatar (Left) */}
                    <div className="hidden lg:flex w-1/2 h-screen sticky top-0 items-center justify-center p-12" ref={pinContainerRef}>
                        <div className="relative w-[600px] h-[600px] flex items-center justify-center perspective-[1000px]">

                            {/* Holographic Base */}
                            <div className="absolute bottom-20 w-64 h-64 bg-orange-500/20 rounded-full blur-[50px] animate-pulse" />
                            <div className="absolute bottom-40 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent blur-sm" />

                            {/* Main Avatar Container */}
                            <div className="holo-avatar relative z-20">
                                {/* Hexagon Frame */}
                                <div className="relative w-72 h-72">
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full blur-md opacity-50" />
                                    <div className="absolute inset-1 bg-[#0a0a0a] rounded-full flex items-center justify-center border-2 border-orange-500/30 overflow-hidden shadow-[0_0_50px_rgba(249,115,22,0.2)]">
                                        {/* Scholar Boy Avatar */}
                                        <Image
                                            src="/scholar-avatar.jpg"
                                            alt="Scholar Avatar"
                                            fill
                                            className="object-cover opacity-90 scale-110 translate-y-4"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                                        {/* Level Badge */}
                                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-orange-500 text-white text-sm font-bold uppercase tracking-wider shadow-lg border border-orange-400 flex items-center gap-2">
                                            <GraduationCap className="w-4 h-4" />
                                            Lvl 42 Scholar
                                        </div>
                                    </div>
                                </div>

                                {/* Orbiting Satellites */}
                                <div className="satellite-ring absolute inset-[-40%] w-[180%] h-[180%] rounded-full border border-white/5">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-slate-900 rounded-full border border-yellow-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.3)] animate-[spin_10s_linear_infinite_reverse]">
                                        <Crown className="w-6 h-6 text-yellow-500" />
                                    </div>
                                </div>
                                <div className="satellite-ring-reverse absolute inset-[-20%] w-[140%] h-[140%] rounded-full border border-dashed border-white/10">
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-12 h-12 bg-slate-900 rounded-full border border-blue-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)] animate-[spin_10s_linear_infinite]">
                                        <Shield className="w-5 h-5 text-blue-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Floating Stats Cards */}
                            <div className="absolute top-20 right-0 animate-[float_4s_ease-in-out_infinite_1s]">
                                <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl">
                                    <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total XP</div>
                                    <div className="text-2xl font-black text-white">124,500</div>
                                </div>
                            </div>
                            <div className="absolute bottom-40 left-0 animate-[float_5s_ease-in-out_infinite_0.5s]">
                                <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl">
                                    <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Day Streak</div>
                                    <div className="text-2xl font-black text-orange-500">🔥 45</div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Scrolling Content (Right) */}
                    <div className="w-full lg:w-1/2 py-32 px-4 lg:px-12 space-y-32">

                        {/* Intro */}
                        <div className="mb-20">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-sm font-bold uppercase tracking-wider mb-6 backdrop-blur-md">
                                <User className="w-4 h-4" />
                                <span>Holographic Identity</span>
                            </div>
                            <h3 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tighter">
                                Your Digital <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">Legacy.</span>
                            </h3>
                            <p className="text-xl text-slate-400 max-w-md leading-relaxed">
                                More than just a profile. It's a living, breathing representation of your knowledge, skills, and achievements.
                            </p>
                        </div>

                        {/* Planetary Skill System */}
                        <div className="skills-constellation relative">
                            <h4 className="text-2xl font-bold text-white mb-12 flex items-center gap-3">
                                <Sparkles className="w-6 h-6 text-orange-400" />
                                Skill Constellation
                            </h4>

                            <div className="grid grid-cols-2 gap-8">
                                {SKILLS.map((skill, i) => {
                                    const Icon = skill.icon;
                                    return (
                                        <div key={skill.name} className="skill-orb relative group">
                                            <div className="relative aspect-square rounded-full bg-slate-900/50 border border-white/5 flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:border-white/20">
                                                {/* Orbital Path */}
                                                <div className="absolute inset-2 rounded-full border border-dashed border-white/10 animate-[spin_20s_linear_infinite]" />

                                                {/* Progress Ring (SVG) */}
                                                <svg className="absolute inset-0 w-full h-full -rotate-90 p-4">
                                                    <circle cx="50%" cy="50%" r="45%" fill="none" stroke="#1e293b" strokeWidth="4" />
                                                    <circle
                                                        cx="50%" cy="50%" r="45%" fill="none"
                                                        stroke="currentColor" strokeWidth="4"
                                                        strokeDasharray="283"
                                                        strokeDashoffset={283 - (283 * skill.level) / 100}
                                                        className={cn("transition-all duration-1000 ease-out", skill.color)}
                                                    />
                                                </svg>

                                                {/* Center Icon */}
                                                <div className="relative z-10 flex flex-col items-center">
                                                    <Icon className={cn("w-8 h-8 mb-2 transition-transform duration-300 group-hover:scale-110", skill.color)} />
                                                    <span className="text-2xl font-bold text-white">{skill.level}%</span>
                                                </div>

                                                {/* Hover Glow */}
                                                <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br", skill.color.replace('text-', 'from-').replace('400', '400').replace('500', '500') + " to-transparent")} />
                                            </div>
                                            <div className="text-center mt-4">
                                                <h5 className="text-lg font-bold text-slate-300">{skill.name}</h5>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Holographic Data Plates (Achievements) */}
                        <div className="space-y-6">
                            <h4 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                                <Trophy className="w-6 h-6 text-yellow-400" />
                                Recent Achievements
                            </h4>

                            {ACHIEVEMENTS.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <div key={item.id} className={cn(
                                        "relative p-6 rounded-2xl border bg-slate-900/40 backdrop-blur-sm overflow-hidden group transition-all duration-300 hover:translate-x-2",
                                        item.border
                                    )}>
                                        {/* Hover Gradient */}
                                        <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/5 to-transparent", item.bg)} />

                                        <div className="relative z-10 flex items-center gap-6">
                                            <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center bg-black/40 shadow-inner", item.color)}>
                                                <Icon className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <h5 className="text-xl font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">{item.title}</h5>
                                                <p className="text-slate-400 text-sm">{item.desc}</p>
                                            </div>
                                            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-4 group-hover:translate-x-0">
                                                <Award className={cn("w-6 h-6", item.color)} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* CTA */}
                        <div className="pt-20 text-center">
                            <div className="p-12 rounded-[3rem] bg-gradient-to-br from-orange-500/10 to-pink-600/10 border border-orange-500/20 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <h4 className="text-3xl font-bold text-white mb-8 relative z-10">Claim your identity.</h4>
                                <Link href="/signup">
                                    <Button size="lg" className="bg-white text-slate-900 hover:bg-orange-50 rounded-full px-12 py-8 text-xl font-bold shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] hover:scale-105 transition-all relative z-10">
                                        Create Profile
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
