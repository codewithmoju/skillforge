"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LogIn, UserPlus, Sparkles, ShieldCheck, Trophy, Zap, ArrowRight } from "lucide-react";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const benefits = [
    {
        icon: Sparkles,
        title: "AI Guidance",
        description: "Personalized learning paths generated for every goal."
    },
    {
        icon: Trophy,
        title: "Gamified Progress",
        description: "Earn XP, unlock achievements, and maintain streaks."
    },
    {
        icon: Zap,
        title: "Smart Practice",
        description: "Interactive quizzes that adapt to your performance."
    },
    {
        icon: ShieldCheck,
        title: "Secure & Private",
        description: "Enterprise-grade authentication powered by Firebase."
    }
];

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Join SkillForge">
            <div className="space-y-8">
                <p className="text-slate-300">
                    Create a free account or sign back in to unlock personalized roadmaps, AI-powered quizzes, and
                    progress tracking designed to keep you motivated.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="rounded-xl bg-accent-indigo/20 p-3">
                                <UserPlus className="w-5 h-5 text-accent-indigo" />
                            </div>
                            <div>
                                <p className="text-sm uppercase tracking-wide text-slate-400">New here?</p>
                                <h3 className="text-lg font-semibold text-white">Create Account</h3>
                            </div>
                        </div>
                        <p className="text-sm text-slate-400 mb-4">
                            Set goals, build your roadmap, and start mastering any skill with AI guidance.
                        </p>
                        <Link href="/signup" onClick={onClose}>
                            <Button
                                className="w-full justify-between px-4"
                                size="lg"
                            >
                                Sign up free
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="rounded-xl bg-accent-cyan/20 p-3">
                                <LogIn className="w-5 h-5 text-accent-cyan" />
                            </div>
                            <div>
                                <p className="text-sm uppercase tracking-wide text-slate-400">Returning?</p>
                                <h3 className="text-lg font-semibold text-white">Sign In</h3>
                            </div>
                        </div>
                        <p className="text-sm text-slate-400 mb-4">
                            Pick up right where you left off and continue earning XP and achievements.
                        </p>
                        <Link href="/login" onClick={onClose}>
                            <Button variant="outline" className="w-full justify-between px-4" size="lg">
                                Sign in
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
                    <p className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">
                        Why learners choose SkillForge
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {benefits.map((benefit) => (
                            <div key={benefit.title} className="flex gap-3">
                                <div className="rounded-xl bg-slate-800/70 p-2 h-10 w-10 flex items-center justify-center">
                                    <benefit.icon className="w-5 h-5 text-accent-cyan" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">{benefit.title}</p>
                                    <p className="text-xs text-slate-400">{benefit.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    );
}

