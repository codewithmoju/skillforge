"use client";

import { motion } from "framer-motion";
import { MessageSquare, BarChart2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { ParallaxElement } from "@/components/ui/ParallaxElement";

const FEATURES = [
    {
        title: "Chat with your AI Tutor",
        description: "Stuck on a concept? Just ask. Our AI tutor provides instant, step-by-step explanations, examples, and analogies to help you understand.",
        icon: MessageSquare,
        color: "text-[#6B46FF]",
        bg: "bg-[#6B46FF]/10",
        imageAlign: "right",
    },
    {
        title: "Visualize Your Growth",
        description: "Track your progress with detailed analytics. See your strengths and weaknesses at a glance and focus your study time where it matters most.",
        icon: BarChart2,
        color: "text-[#00D4FF]",
        bg: "bg-[#00D4FF]/10",
        imageAlign: "left",
    },
    {
        title: "Gamified Learning",
        description: "Earn XP, badges, and streaks as you learn. Stay motivated with daily challenges and compete with friends on the leaderboard.",
        icon: Zap,
        color: "text-[#FFB020]",
        bg: "bg-[#FFB020]/10",
        imageAlign: "right",
    },
];

export function FeatureDeepDive() {
    return (
        <section className="py-32 bg-[#0F172A] overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="space-y-32">
                    {FEATURES.map((feature, index) => (
                        <div key={index} className={cn(
                            "flex flex-col gap-12 items-center",
                            feature.imageAlign === "left" ? "lg:flex-row-reverse" : "lg:flex-row"
                        )}>
                            {/* Text Content */}
                            <motion.div
                                initial={{ opacity: 0, x: feature.imageAlign === "left" ? 50 : -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true, margin: "-100px" }}
                                className="flex-1 space-y-6"
                            >
                                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6", feature.bg)}>
                                    <feature.icon className={cn("w-8 h-8", feature.color)} />
                                </div>
                                <h3 className="text-3xl md:text-4xl font-bold text-white">{feature.title}</h3>
                                <p className="text-lg text-slate-400 leading-relaxed max-w-lg">
                                    {feature.description}
                                </p>
                            </motion.div>

                            {/* Image/Visual Content */}
                            <ParallaxElement speed={0.2} className="flex-1 w-full">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                >
                                    <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-[#1E293B] shadow-2xl group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />

                                        {/* Abstract UI Representation */}
                                        <div className="absolute inset-4 rounded-2xl bg-[#0F172A] border border-white/5 overflow-hidden flex flex-col">
                                            <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2">
                                                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                                                <div className="w-3 h-3 rounded-full bg-green-500/20" />
                                            </div>
                                            <div className="flex-1 p-6 relative">
                                                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                                                {/* Animated elements based on feature type */}
                                                {index === 0 && (
                                                    <div className="space-y-4">
                                                        <div className="w-3/4 p-4 rounded-2xl rounded-tl-none bg-[#1E293B] border border-white/5">
                                                            <div className="w-full h-2 bg-white/10 rounded mb-2" />
                                                            <div className="w-2/3 h-2 bg-white/10 rounded" />
                                                        </div>
                                                        <div className="w-3/4 ml-auto p-4 rounded-2xl rounded-tr-none bg-[#6B46FF]/20 border border-[#6B46FF]/20">
                                                            <div className="w-full h-2 bg-white/20 rounded mb-2" />
                                                            <div className="w-1/2 h-2 bg-white/20 rounded" />
                                                        </div>
                                                    </div>
                                                )}
                                                {index === 1 && (
                                                    <div className="flex items-end justify-between h-full px-8 pb-4 gap-4">
                                                        {[40, 70, 50, 90, 60, 80].map((h, i) => (
                                                            <motion.div
                                                                key={i}
                                                                initial={{ height: 0 }}
                                                                whileInView={{ height: `${h}%` }}
                                                                transition={{ duration: 1, delay: i * 0.1 }}
                                                                className="w-full bg-gradient-to-t from-[#00D4FF] to-[#00D4FF]/20 rounded-t-lg opacity-80"
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                                {index === 2 && (
                                                    <div className="flex items-center justify-center h-full">
                                                        <div className="relative">
                                                            <div className="absolute inset-0 bg-[#FFB020] blur-3xl opacity-20" />
                                                            <Zap className="w-24 h-24 text-[#FFB020] fill-current relative z-10" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </ParallaxElement>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
