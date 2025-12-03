"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Users, Heart, MessageCircle, Share2, Globe, Sparkles, Zap, MapPin, Radio, MessageSquare, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const SOCIAL_POSTS = [
    {
        id: 1,
        user: "Alex Chen",
        role: "Full Stack Dev",
        location: "Tokyo, JP",
        content: "Just generated a custom Full-Stack roadmap! 🗺️ The AI even adapted it for my React background. Time to grind! 🚀",
        likes: 1242,
        comments: 89,
        color: "from-blue-500 to-indigo-600",
        avatar: "AC"
    },
    {
        id: 2,
        user: "Sarah Miller",
        role: "Data Scientist",
        location: "Berlin, DE",
        content: "The AI Tutor explained Recursion to me in 5 minutes using a mirror analogy. 🤯 Finally clicked! #AITutor",
        likes: 856,
        comments: 124,
        color: "from-purple-500 to-pink-600",
        avatar: "SM"
    },
    {
        id: 3,
        user: "David Okonjo",
        role: "UX Designer",
        location: "Lagos, NG",
        content: "Hit Level 10 today and unlocked the 'Code Wizard' badge! 🧙‍♂️ The gamification makes learning so addictive.",
        likes: 2105,
        comments: 342,
        color: "from-orange-400 to-red-500",
        avatar: "DO"
    },
    {
        id: 4,
        user: "Elena Rodriguez",
        role: "Mobile Dev",
        location: "Madrid, ES",
        content: "Created a custom course on 'AI Ethics' with the generator. The video scripts it made are spot on. 🎥 #CourseGen",
        likes: 3400,
        comments: 512,
        color: "from-emerald-400 to-teal-600",
        avatar: "ER"
    }
];

export function SocialHub() {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [activePost, setActivePost] = useState(0);
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
                        // Calculate active post based on scroll progress
                        const progress = self.progress;
                        const totalPosts = SOCIAL_POSTS.length;
                        // Map progress (approx 0.3 to 0.8 range where posts are) to index
                        const index = Math.min(
                            Math.max(Math.floor((progress - 0.2) * (totalPosts / 0.6)), 0),
                            totalPosts - 1
                        );
                        setActivePost(index);
                    }
                }
            });

            // Globe Rotation
            gsap.to(".globe-grid", {
                rotation: 360,
                duration: 100,
                repeat: -1,
                ease: "none"
            });

            // Floating Avatars Parallax
            gsap.to(".floating-avatar", {
                x: "random(-100, 100)",
                y: "random(-50, 50)",
                duration: "random(3, 6)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: {
                    amount: 2,
                    from: "random"
                }
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative h-screen w-full bg-[#050b14] text-white overflow-hidden">

            {/* Background Elements (Fixed) */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/20 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/20 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:100px_100px] [transform:perspective(1000px)_rotateX(60deg)] opacity-30" />
            </div>

            {/* Horizontal Track */}
            <div ref={trackRef} className="flex h-full items-center px-20 gap-32 w-max">

                {/* Section 1: Intro & Globe */}
                <div className="flex items-center gap-20 w-screen shrink-0 px-20">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-bold uppercase tracking-wider mb-6 backdrop-blur-md">
                            <Globe className="w-4 h-4" />
                            <span>Global Neural Network</span>
                        </div>
                        <h3 className="text-6xl md:text-8xl font-black text-white mb-8 leading-tight tracking-tighter">
                            Connect with <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500">The Hive Mind.</span>
                        </h3>
                        <p className="text-2xl text-slate-400 max-w-lg leading-relaxed">
                            Join a vibrant community of learners. Share insights, collaborate on projects, and grow together in real-time.
                        </p>
                    </div>

                    {/* Holographic Globe (Parallax Element) */}
                    <div className="relative w-[600px] h-[600px] shrink-0 flex items-center justify-center perspective-[1000px]">
                        <div className="absolute inset-10 rounded-full bg-indigo-900/20 backdrop-blur-sm border border-indigo-500/30 shadow-[0_0_100px_rgba(99,102,241,0.2)] overflow-hidden">
                            <div className="globe-grid absolute inset-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_50%_50%,transparent_60%,rgba(99,102,241,0.2)_70%)] opacity-50" />
                            <div className="globe-grid absolute inset-0 opacity-30">
                                {mounted && [...Array(20)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute w-1 h-1 bg-white rounded-full"
                                        style={{
                                            top: `${Math.random() * 100}%`,
                                            left: `${Math.random() * 100}%`,
                                            boxShadow: "0 0 10px white"
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="absolute inset-0 rounded-full border border-indigo-500/10 animate-[spin_20s_linear_infinite]" />
                        <div className="absolute inset-[15%] rounded-full border border-dashed border-blue-500/20 animate-[spin_30s_linear_infinite_reverse]" />

                        {/* Active User Highlight on Globe */}
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                            <div className={cn(
                                "w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold shadow-2xl border-4 border-[#050b14] transition-all duration-500",
                                `bg-gradient-to-br ${SOCIAL_POSTS[activePost].color}`
                            )}>
                                {SOCIAL_POSTS[activePost].avatar}
                            </div>
                        </div>

                        {/* Floating Nodes */}
                        {mounted && [...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="floating-avatar absolute w-14 h-14 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-400 shadow-lg"
                                style={{
                                    top: `${20 + Math.random() * 60}%`,
                                    left: `${20 + Math.random() * 60}%`,
                                    transform: `translateZ(${Math.random() * 100}px)`
                                }}
                            >
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
                                U{i + 1}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 2: Social Cards */}
                {SOCIAL_POSTS.map((post, i) => {
                    const isActive = i === activePost;
                    return (
                        <div
                            key={post.id}
                            className={cn(
                                "social-card relative w-[400px] shrink-0 p-8 rounded-[2.5rem] border transition-all duration-500 group overflow-hidden",
                                isActive
                                    ? "bg-slate-800/80 border-indigo-500/30 shadow-[0_0_50px_rgba(0,0,0,0.3)] scale-110 z-10"
                                    : "bg-[#0f1623]/50 border-white/5 hover:bg-slate-800/40 hover:border-white/10 opacity-60 scale-90"
                            )}
                        >
                            <div className="flex items-center gap-4 mb-6 relative z-10">
                                <div className={cn(
                                    "w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg shadow-lg",
                                    `bg-gradient-to-br ${post.color}`
                                )}>
                                    {post.avatar}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white">{post.user}</h4>
                                    <p className="text-indigo-400 text-sm font-medium">{post.role}</p>
                                </div>
                                <div className="ml-auto">
                                    <div className="bg-white/5 p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
                                        <MoreHorizontal className="w-5 h-5 text-slate-400" />
                                    </div>
                                </div>
                            </div>
                            <p className="text-lg text-slate-300 leading-relaxed mb-8 relative z-10">
                                {post.content}
                            </p>
                            <div className="flex items-center gap-6 text-sm font-medium text-slate-400 relative z-10 border-t border-white/5 pt-6">
                                <div className={cn("flex items-center gap-2 transition-colors", isActive ? "text-pink-500" : "hover:text-pink-500")}>
                                    <Heart className={cn("w-5 h-5", isActive ? "fill-current" : "")} />
                                    <span>{post.likes.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-2 hover:text-indigo-400 transition-colors">
                                    <MessageCircle className="w-5 h-5" />
                                    <span>{post.comments}</span>
                                </div>
                            </div>
                            <div className={cn(
                                "absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none",
                                isActive ? "opacity-10" : "opacity-0",
                                `bg-gradient-to-br ${post.color}`
                            )} />
                        </div>
                    );
                })}

                {/* Section 3: CTA */}
                <div className="w-screen shrink-0 flex items-center justify-center px-20">
                    <div className="p-20 rounded-[4rem] bg-gradient-to-br from-indigo-500/10 to-blue-600/10 border border-indigo-500/20 relative overflow-hidden group max-w-4xl w-full text-center">
                        <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <h4 className="text-5xl md:text-7xl font-black text-white mb-12 relative z-10">Ready to join the network?</h4>
                        <Link href="/signup">
                            <Button size="lg" className="bg-white text-slate-900 hover:bg-indigo-50 rounded-full px-16 py-10 text-2xl font-bold shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] hover:scale-105 transition-all relative z-10">
                                Sign Up Free
                            </Button>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
