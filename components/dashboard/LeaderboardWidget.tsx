"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { LeaderboardEntry } from "@/lib/services/leaderboard";

interface LeaderboardWidgetProps {
    leaderboard: LeaderboardEntry[];
    userRank: number | null;
    rival?: LeaderboardEntry;
    xpGap: number;
}

export function LeaderboardWidget({ leaderboard, userRank, rival, xpGap }: LeaderboardWidgetProps) {
    const leaderboardGlows = ["from-amber-400/30 via-amber-600/10 to-slate-900/40", "from-slate-200/20 via-violet-400/10 to-slate-900/40", "from-cyan-300/20 via-blue-500/10 to-slate-900/40"];

    return (
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 p-6">
            <div className="absolute inset-x-6 top-6 flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-slate-400">
                <Star className="h-4 w-4 text-amber-300" />
                Season Pulse
            </div>
            <div className="relative mt-12 space-y-6">
                <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-amber-500/15 via-white/5 to-transparent p-5 shadow-[0_10px_40px_rgba(15,118,255,0.25)]">
                    <div className="absolute -top-10 -right-6 h-24 w-24 rounded-full bg-amber-400/20 blur-3xl" />
                    <p className="text-xs uppercase tracking-[0.5em] text-amber-200">Your Rank</p>
                    <p className="text-4xl font-extrabold text-white mt-1 flex items-baseline gap-2">
                        {userRank ? `#${userRank}` : "Unranked"}
                        <span className="text-xs font-semibold text-white/60">Season {new Date().getFullYear()}</span>
                    </p>
                    <p className="text-xs text-white/70 mt-2">
                        {rival && xpGap > 0
                            ? `${xpGap.toLocaleString()} XP to catch ${rival.name}`
                            : "You hold the top slot in this slice"}
                    </p>
                </div>

                <div className="space-y-4">
                    {leaderboard.slice(0, 3).map((entry, index) => (
                        <motion.div
                            key={entry.uid}
                            whileHover={{ scale: 1.01 }}
                            className="relative overflow-hidden rounded-2xl border border-white/15 p-4"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${leaderboardGlows[index] ?? "from-white/10 to-transparent"}`} />
                            <div className="relative flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/30 font-black text-white text-lg">
                                        #{index + 1}
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold">{entry.name}</p>
                                        <p className="text-xs text-white/70">
                                            {entry.xp.toLocaleString()} XP • Lv {entry.level}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs uppercase tracking-[0.4em] text-white/50">Streak</p>
                                    <p className="text-sm font-semibold text-emerald-200">{entry.streak}d 🔥</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {!leaderboard.length && (
                        <p className="text-sm text-slate-400 text-center">Leaderboard data will appear once the season updates.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
