
"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TiltCard } from "@/components/ui/TiltCard";

interface AIRecommendationCardProps {
    title: string;
    description: string;
    icon: any;
    color: string;
    gradient: string;
    delay?: number;
    onClick: () => void;
}

export function AIRecommendationCard({
    title,
    description,
    icon: Icon,
    color,
    gradient,
    delay = 0,
    onClick
}: AIRecommendationCardProps) {
    return (
        <TiltCard className="h-full">
            <button
                onClick={onClick}
                className="group relative w-full h-full text-left"
            >
                {/* Glow Effect */}
                <div className={cn(
                    "absolute -inset-0.5 rounded-3xl bg-gradient-to-r opacity-50 blur-lg group-hover:opacity-100 transition duration-500",
                    gradient
                )} />

                {/* Card Content */}
                <div className="relative h-full p-6 rounded-3xl bg-slate-950/90 border border-white/10 backdrop-blur-xl flex flex-col overflow-hidden">
                    {/* Background Gradient Mesh */}
                    <div className={cn(
                        "absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-gradient-to-br",
                        gradient
                    )} />

                    {/* AI Badge */}
                    <div className="flex justify-between items-start mb-6">
                        <div className={cn(
                            "p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500",
                            color
                        )}>
                            <Icon className="w-6 h-6" />
                        </div>
                        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5 backdrop-blur-md">
                            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">AI Pick</span>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="relative z-10 mt-auto">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all">
                            {title}
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed mb-4 group-hover:text-slate-300 transition-colors">
                            {description}
                        </p>

                        {/* Action Indicator */}
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                            <span className={cn("bg-clip-text text-transparent bg-gradient-to-r", gradient)}>
                                Generate Path
                            </span>
                            <ArrowRight className={cn("w-3 h-3", color)} />
                        </div>
                    </div>
                </div>
            </button>
        </TiltCard>
    );
}
