"use client";

import Link from "next/link";
import { ArrowRight, LayoutDashboard, Map, Users, Trophy } from "lucide-react";

export default function DocsPage() {
    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <div className="border-b border-white/5 pb-12">
                <h1 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    Welcome to EduMate AI
                </h1>
                <p className="text-xl text-slate-400 max-w-3xl leading-relaxed">
                    Your intelligent learning companion. Master any skill with AI-generated roadmaps, gamified progress, and a vibrant community of learners.
                </p>
                <div className="flex flex-wrap gap-4 mt-8">
                    <Link
                        href="/docs/dashboard"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Start Tour
                    </Link>
                    <Link
                        href="/docs/roadmaps"
                        className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-3 rounded-xl font-medium transition-all"
                    >
                        <Map className="w-5 h-5" />
                        Create Roadmap
                    </Link>
                </div>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DocCard
                    icon={LayoutDashboard}
                    title="Mission Control"
                    description="Your central hub for tracking progress, streaks, and daily quests."
                    href="/docs/dashboard"
                    color="text-cyan-400"
                />
                <DocCard
                    icon={Map}
                    title="AI Roadmaps"
                    description="Generate personalized learning paths for any topic in seconds."
                    href="/docs/roadmaps"
                    color="text-purple-400"
                />
                <DocCard
                    icon={Users}
                    title="Social Hub"
                    description="Share your journey, follow others, and learn together."
                    href="/docs/social"
                    color="text-green-400"
                />
                <DocCard
                    icon={Trophy}
                    title="Gamification"
                    description="Earn XP, unlock achievements, and climb the leaderboards."
                    href="/docs/achievements"
                    color="text-amber-400"
                />
            </div>

            {/* Community Section */}
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-8 border border-white/5">
                <h2 className="text-2xl font-bold text-white mb-4">Need Help?</h2>
                <p className="text-slate-400 mb-6">
                    Can't find what you're looking for? Join our community or check out the FAQ.
                </p>
                <div className="flex gap-4">
                    <Link href="/community" className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2">
                        Visit Community <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

function DocCard({
    icon: Icon,
    title,
    description,
    href,
    color,
}: {
    icon: any;
    title: string;
    description: string;
    href: string;
    color: string;
}) {
    return (
        <Link
            href={href}
            className="group p-6 rounded-2xl border border-white/10 bg-slate-900/50 hover:bg-slate-800/50 hover:border-white/20 transition-all duration-300"
        >
            <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {title}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
                {description}
            </p>
        </Link>
    );
}
