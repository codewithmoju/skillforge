"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles, ArrowRight, Target, Zap, Brain } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface RecommendationCardProps {
    rec: any;
    onClick: () => void;
    index: number;
}

export function RecommendationCard({ rec, onClick, index }: RecommendationCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    // Mouse position for 3D tilt
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 150, damping: 20 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 150, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set((e.clientX - centerX) / (rect.width / 2));
        mouseY.set((e.clientY - centerY) / (rect.height / 2));
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + (index * 0.1) }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="group relative h-full perspective-1000 cursor-pointer"
        >
            {/* Animated Border Gradient */}
            <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-[24px] opacity-30 group-hover:opacity-100 blur-sm transition-opacity duration-500 animate-gradient-xy" />

            {/* Card Content */}
            <div className="relative h-full bg-[#0a0a0f]/90 backdrop-blur-xl rounded-[23px] p-6 flex flex-col border border-white/5 overflow-hidden group-hover:bg-[#0a0a0f]/95 transition-colors">

                {/* Background Effects */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/20 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:bg-indigo-500/20 transition-colors duration-500" />

                <div className="relative z-10 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/10 border border-purple-500/20 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                            <Brain className="w-3 h-3" />
                            Neural Upgrade
                        </div>

                        <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-purple-500/20 group-hover:border-purple-500/30 transition-colors">
                            <Sparkles className="w-4 h-4 text-slate-400 group-hover:text-purple-300 transition-colors" />
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                        {rec.topic}
                    </h3>

                    {/* Reason */}
                    <p className="text-sm text-slate-400 leading-relaxed mb-6 line-clamp-3 group-hover:text-slate-300 transition-colors">
                        {rec.reason}
                    </p>

                    {/* Footer */}
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <Target className="w-3 h-3" />
                            <span>{rec.difficulty}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm font-bold text-purple-400 group-hover:text-purple-300 transition-colors">
                            Initialize
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
