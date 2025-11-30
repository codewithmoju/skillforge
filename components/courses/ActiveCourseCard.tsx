"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Play, Clock, Trash2, ArrowRight, Zap } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ActiveCourseCardProps {
    course: any;
    onDelete: (e: React.MouseEvent, courseId: string) => void;
    index: number;
}

export function ActiveCourseCard({ course, onDelete, index }: ActiveCourseCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    // Mouse position for 3D tilt
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), { stiffness: 150, damping: 20 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), { stiffness: 150, damping: 20 });

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

    const progressPercent = course.progress?.totalLessons
        ? Math.round((course.progress.completedLessons / course.progress.totalLessons) * 100)
        : 0;

    const theme = course.syllabus?.theme || {
        primary: "#06b6d4", // Cyan-500
        secondary: "#3b82f6", // Blue-500
        accent: "#8b5cf6", // Violet-500
        background: "#020617" // Slate-950
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="group relative h-full perspective-1000"
        >
            <Link href={`/courses/${course.id}`} className="block h-full">
                {/* Holographic Border */}
                <div
                    className="absolute -inset-[1px] rounded-[24px] opacity-50 group-hover:opacity-100 blur-sm transition-opacity duration-500 animate-gradient-xy"
                    style={{ background: `linear-gradient(to right, ${theme.primary}, ${theme.secondary}, ${theme.accent})` }}
                />

                {/* Card Content */}
                <div
                    className="relative h-full backdrop-blur-xl rounded-[23px] p-6 flex flex-col border border-white/10 overflow-hidden transition-colors duration-500"
                    style={{ backgroundColor: `${theme.background}E6` }} // 90% opacity
                >

                    {/* Dynamic Background Grid */}
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 mix-blend-overlay transition-transform duration-700 group-hover:scale-110" />

                    {/* Glowing Orb Effect */}
                    <div
                        className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl transition-colors duration-500 opacity-20 group-hover:opacity-30"
                        style={{ backgroundColor: theme.primary }}
                    />

                    <div className="relative z-10 flex flex-col h-full">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-6">
                            <div
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-[0_0_10px_rgba(0,0,0,0.2)]"
                                style={{
                                    backgroundColor: `${theme.primary}1A`, // 10% opacity
                                    borderColor: `${theme.primary}33`, // 20% opacity
                                    color: theme.primary
                                }}
                            >
                                <Zap className="w-3 h-3 fill-current" />
                                Active Mission
                            </div>

                            <div className="flex items-center gap-3">
                                <span
                                    className="text-2xl font-black text-transparent bg-clip-text font-mono"
                                    style={{ backgroundImage: `linear-gradient(to right, white, ${theme.primary})` }}
                                >
                                    {progressPercent}%
                                </span>
                                <button
                                    onClick={(e) => onDelete(e, course.id)}
                                    className="p-2 rounded-full hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Title */}
                        <h3
                            className="text-xl font-bold text-white mb-2 transition-colors line-clamp-2 leading-tight group-hover:text-transparent group-hover:bg-clip-text"
                            style={{
                                backgroundImage: isHovering ? `linear-gradient(to right, ${theme.primary}, ${theme.accent})` : 'none'
                            }}
                        >
                            {course.title || course.topic}
                        </h3>

                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-mono">
                            <Clock className="w-3 h-3" />
                            <span>Last updated: Just now</span>
                        </div>

                        {/* Progress Bar (Energy Level) */}
                        <div className="mt-auto">
                            <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                <span>System Integrity</span>
                                <span>{course.progress.completedLessons} / {course.progress.totalLessons} Modules</span>
                            </div>
                            <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
                                <motion.div
                                    className="absolute inset-y-0 left-0 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                                    style={{ background: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})` }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercent}%` }}
                                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                />
                                {/* Scanning line effect */}
                                <motion.div
                                    className="absolute inset-y-0 w-[2px] bg-white/50 blur-[1px]"
                                    animate={{ left: ["0%", "100%"] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                            </div>

                            {/* CTA */}
                            <div className="mt-6 flex items-center justify-between group/btn">
                                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">
                                    Resume Protocol
                                </span>
                                <div
                                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:text-black"
                                    style={{
                                        backgroundColor: isHovering ? theme.primary : 'rgba(255,255,255,0.05)'
                                    }}
                                >
                                    <Play className="w-3 h-3 fill-current" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
