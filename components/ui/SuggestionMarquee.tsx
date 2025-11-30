
"use client";

import React from "react";
import { Marquee } from "@/components/ui/Marquee";
import { cn } from "@/lib/utils";
import { Code, Palette, TrendingUp, Database, Brain, Rocket, Globe, Cpu, Music, Camera, Video, PenTool, Layout, Server, Shield, Smartphone, Cloud, Search, Zap, Star } from "lucide-react";

const ROW_1_DATA = [
    { icon: Code, label: "Full Stack Development", color: "text-blue-400" },
    { icon: Palette, label: "UI/UX Design", color: "text-pink-400" },
    { icon: TrendingUp, label: "Digital Marketing", color: "text-green-400" },
    { icon: Database, label: "Data Science", color: "text-purple-400" },
    { icon: Brain, label: "Machine Learning", color: "text-yellow-400" },
    { icon: Rocket, label: "Startup Growth", color: "text-orange-400" },
    { icon: Globe, label: "Web3 & Blockchain", color: "text-cyan-400" },
    { icon: Cpu, label: "Embedded Systems", color: "text-red-400" },
];
const ROW_1 = [...ROW_1_DATA, ...ROW_1_DATA, ...ROW_1_DATA];

const ROW_2_DATA = [
    { icon: Music, label: "Music Production", color: "text-fuchsia-400" },
    { icon: Camera, label: "Photography", color: "text-indigo-400" },
    { icon: Video, label: "Video Editing", color: "text-rose-400" },
    { icon: PenTool, label: "Creative Writing", color: "text-emerald-400" },
    { icon: Layout, label: "Graphic Design", color: "text-sky-400" },
    { icon: Server, label: "DevOps Engineering", color: "text-lime-400" },
    { icon: Shield, label: "Cybersecurity", color: "text-teal-400" },
    { icon: Smartphone, label: "Mobile App Dev", color: "text-violet-400" },
];
const ROW_2 = [...ROW_2_DATA, ...ROW_2_DATA, ...ROW_2_DATA];

const ROW_3_DATA = [
    { icon: Cloud, label: "Cloud Computing", color: "text-blue-300" },
    { icon: Search, label: "SEO Mastery", color: "text-green-300" },
    { icon: Zap, label: "Productivity", color: "text-yellow-300" },
    { icon: Star, label: "Personal Branding", color: "text-pink-300" },
    { icon: Brain, label: "Cognitive Psychology", color: "text-purple-300" },
    { icon: Code, label: "Game Development", color: "text-red-300" },
    { icon: Palette, label: "3D Modeling", color: "text-orange-300" },
    { icon: TrendingUp, label: "Financial Literacy", color: "text-emerald-300" },
];
const ROW_3 = [...ROW_3_DATA, ...ROW_3_DATA, ...ROW_3_DATA];

interface SuggestionMarqueeProps {
    onSelect: (topic: string) => void;
}

export function SuggestionMarquee({ onSelect }: SuggestionMarqueeProps) {
    return (
        <div className="w-full max-w-[100vw] overflow-hidden space-y-4 py-8 mask-linear-fade">
            {/* Row 1 */}
            <Marquee speed={100} direction="left" pauseOnHover>
                {ROW_1.map((item, idx) => (
                    <SuggestionPill key={`r1-${idx}`} item={item} onClick={() => onSelect(item.label)} />
                ))}
            </Marquee>

            {/* Row 2 */}
            <Marquee speed={120} direction="right" pauseOnHover>
                {ROW_2.map((item, idx) => (
                    <SuggestionPill key={`r2-${idx}`} item={item} onClick={() => onSelect(item.label)} />
                ))}
            </Marquee>

            {/* Row 3 */}
            <Marquee speed={90} direction="left" pauseOnHover>
                {ROW_3.map((item, idx) => (
                    <SuggestionPill key={`r3-${idx}`} item={item} onClick={() => onSelect(item.label)} />
                ))}
            </Marquee>
        </div>
    );
}

function SuggestionPill({ item, onClick }: { item: any; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 backdrop-blur-md transition-all whitespace-nowrap"
        >
            <div className={cn("p-1 rounded-full bg-white/5 group-hover:scale-110 transition-transform", item.color)}>
                <item.icon className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                {item.label}
            </span>
        </button>
    );
}
