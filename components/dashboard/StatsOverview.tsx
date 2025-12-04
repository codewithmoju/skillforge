"use client";

import { motion } from "framer-motion";
import { Sparkles, Crown } from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";
import type { FirestoreUserData } from "@/lib/services/firestore";

export type QuickAction = {
    label: string;
    href: string;
    icon: ComponentType<{ className?: string }>;
    meta?: string;
};

interface StatsOverviewProps {
    userData: FirestoreUserData | null;
    tier: { title: string };
    level: number;
    xp: number;
    xpToNextLevel: number;
    xpProgress: number;
    xpForNextLevel: number;
    quickActions: QuickAction[];
    displayName: string;
    lastActiveLabel: string;
}

export function StatsOverview({
    userData,
    tier,
    level,
    xp,
    xpToNextLevel,
    xpProgress,
    xpForNextLevel,
    quickActions,
    displayName,
    lastActiveLabel
}: StatsOverviewProps) {
    return (
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-indigo-950 to-black p-6 md:p-10">
            <div className="absolute inset-px rounded-[calc(1.5rem-1px)] border border-white/5 pointer-events-none" />
            <div className="absolute -top-20 -right-10 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-8 h-52 w-52 rounded-full bg-violet-500/20 blur-3xl" />

            <div className="relative flex flex-wrap items-center gap-3 text-sm uppercase tracking-widest text-cyan-200/80">
                <Sparkles className="h-4 w-4 text-cyan-300" />
                Mission Control
            </div>

            <div className="relative mt-4 flex flex-col gap-6 lg:flex-row lg:items-center">
                <div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-widest text-slate-300">
                        {tier.title}
                        <Crown className="h-3.5 w-3.5 text-amber-300" />
                    </span>
                    <h1 className="mt-3 text-3xl md:text-5xl font-black text-white tracking-tight">
                        Welcome back{displayName ? `, ${displayName}` : ""}!
                    </h1>
                    <p className="mt-2 text-base md:text-lg text-slate-300/90">
                        Last synced {lastActiveLabel}. Your stats, streaks, and challenges are up to date.
                    </p>
                </div>

                <div className="relative min-w-[220px] rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Next Tier Target</p>
                    <p className="mt-1 text-2xl font-bold text-white">LV {level + 1}</p>
                    <p className="text-xs text-slate-400">{xpToNextLevel.toLocaleString()} XP needed</p>
                </div>
            </div>

            <div className="relative mt-8 space-y-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">XP Surge</span>
                    <span className="font-semibold text-white">{xpProgress}%</span>
                </div>
                <div className="h-3 rounded-full bg-white/5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${xpProgress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                    />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{xp.toLocaleString()} XP</span>
                    <span>{xpForNextLevel.toLocaleString()} XP Target</span>
                </div>
            </div>

            <div className="relative mt-8 flex flex-wrap gap-3">
                {quickActions.map((action) => (
                    <Link key={action.label} href={action.href}>
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            className="group inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/90 hover:border-cyan-400/40 hover:text-white"
                        >
                            <action.icon className="h-4 w-4 text-cyan-300 group-hover:text-white" />
                            <div className="text-left">
                                <p>{action.label}</p>
                                {action.meta && <p className="text-xs text-slate-400">{action.meta}</p>}
                            </div>
                        </motion.button>
                    </Link>
                ))}
            </div>
        </div>
    );
}
