"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import type { ComponentType } from "react";

interface QuestCard {
    title: string;
    subtitle: string;
    progress: number;
    detail: string;
    href: string;
}

interface PowerUp {
    title: string;
    value: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
}

interface ActiveQuestsProps {
    questCards: QuestCard[];
    powerUps: PowerUp[];
}

export function ActiveQuests({ questCards, powerUps }: ActiveQuestsProps) {
    const router = useRouter();

    return (
        <section className="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Quest Board</p>
                        <h2 className="text-2xl font-bold text-white">Personal Missions</h2>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.push("/roadmap")}>
                        Manage Roadmaps
                    </Button>
                </div>

                {questCards.length ? (
                    <div className="mt-6 space-y-4">
                        {questCards.map((quest) => (
                            <motion.div
                                key={quest.title}
                                whileHover={{ scale: 1.01 }}
                                className="rounded-2xl border border-white/10 bg-white/5 p-5"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">{quest.detail}</p>
                                        <p className="text-xl font-semibold text-white">{quest.title}</p>
                                        <p className="text-sm text-slate-400">{quest.subtitle}</p>
                                    </div>
                                    <Link href={quest.href} className="text-xs font-semibold text-cyan-300">
                                        View
                                    </Link>
                                </div>
                                <div className="mt-4 h-2 rounded-full bg-white/5">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500"
                                        style={{ width: `${quest.progress}%` }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-8 text-center">
                        <p className="text-slate-400">No active missions yet. Generate a roadmap or create a project to unlock quests.</p>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                {powerUps.length ? (
                    powerUps.map((power) => (
                        <motion.div
                            key={power.title}
                            whileHover={{ x: 6 }}
                            className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 p-5"
                        >
                            <div className="relative flex items-start gap-4">
                                <div className="rounded-2xl bg-black/30 p-3">
                                    <power.icon className="h-6 w-6 text-cyan-200" />
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-white">{power.title}</p>
                                    <p className="text-sm text-slate-300">{power.value}</p>
                                    <p className="text-xs text-slate-500">{power.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="rounded-3xl border border-dashed border-white/10 p-8 text-center text-slate-400">
                        Activate a streak, roadmap, or project to unlock power-ups.
                    </div>
                )}
            </div>
        </section>
    );
}
