"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Category {
    id: string;
    label: string;
    icon: string;
    color: string;
    x: number; // Percentage 0-100
    y: number; // Percentage 0-100
}

interface CategoryConstellationProps {
    onSelectCategory: (categoryId: string | null) => void;
    selectedCategory: string | null;
}

const CATEGORIES: Category[] = [
    { id: 'web-dev', label: 'Web Development', icon: '💻', color: '#3B82F6', x: 20, y: 30 },
    { id: 'ai-ml', label: 'AI & Machine Learning', icon: '🤖', color: '#8B5CF6', x: 50, y: 20 },
    { id: 'design', label: 'UI/UX Design', icon: '🎨', color: '#EC4899', x: 80, y: 30 },
    { id: 'data-science', label: 'Data Science', icon: '📊', color: '#10B981', x: 30, y: 60 },
    { id: 'mobile-dev', label: 'Mobile Dev', icon: '📱', color: '#F59E0B', x: 70, y: 60 },
    { id: 'business', label: 'Business', icon: '💼', color: '#6366F1', x: 50, y: 80 },
];

export function CategoryConstellation({ onSelectCategory, selectedCategory }: CategoryConstellationProps) {
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div className="relative w-full h-[400px] overflow-hidden rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm mb-12 group">
            {/* Background Stars */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 2 + 1}px`,
                            height: `${Math.random() * 2 + 1}px`,
                            opacity: Math.random() * 0.5 + 0.1,
                            animation: `twinkle ${Math.random() * 3 + 2}s infinite ease-in-out`
                        }}
                    />
                ))}
            </div>

            {/* Constellation Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {CATEGORIES.map((cat, i) => (
                    CATEGORIES.slice(i + 1).map((nextCat) => {
                        // Only connect if close enough (mock logic for visual constellation)
                        const dist = Math.hypot(cat.x - nextCat.x, cat.y - nextCat.y);
                        if (dist > 40) return null;

                        return (
                            <motion.line
                                key={`${cat.id}-${nextCat.id}`}
                                x1={`${cat.x}%`}
                                y1={`${cat.y}%`}
                                x2={`${nextCat.x}%`}
                                y2={`${nextCat.y}%`}
                                stroke="rgba(148, 163, 184, 0.1)"
                                strokeWidth="1"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 1.5, delay: 0.5 }}
                            />
                        );
                    })
                ))}
            </svg>

            {/* Category Nodes */}
            <div ref={containerRef} className="absolute inset-0">
                {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    const isHovered = hoveredCategory === cat.id;
                    const isDimmed = (selectedCategory && !isSelected) || (hoveredCategory && !isHovered);

                    return (
                        <motion.button
                            key={cat.id}
                            className={cn(
                                "absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center transition-all duration-300 outline-none",
                                isDimmed ? "opacity-30 scale-90" : "opacity-100 scale-100 z-10"
                            )}
                            style={{ left: `${cat.x}%`, top: `${cat.y}%` }}
                            onClick={() => onSelectCategory(isSelected ? null : cat.id)}
                            onMouseEnter={() => setHoveredCategory(cat.id)}
                            onMouseLeave={() => setHoveredCategory(null)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {/* Glow Effect */}
                            <div
                                className="absolute inset-0 rounded-full blur-xl transition-opacity duration-300"
                                style={{
                                    backgroundColor: cat.color,
                                    opacity: isSelected || isHovered ? 0.4 : 0,
                                    transform: 'scale(1.5)'
                                }}
                            />

                            {/* Node Circle */}
                            <div
                                className={cn(
                                    "relative w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg border-2 transition-all duration-300",
                                    isSelected
                                        ? "bg-slate-900 border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                        : "bg-slate-900/80 border-slate-700 hover:border-slate-500"
                                )}
                                style={{ borderColor: isSelected ? cat.color : undefined }}
                            >
                                {cat.icon}
                            </div>

                            {/* Label */}
                            <motion.span
                                className={cn(
                                    "mt-3 text-sm font-bold px-3 py-1 rounded-full backdrop-blur-md border transition-colors",
                                    isSelected
                                        ? "bg-white/10 text-white border-white/20"
                                        : "bg-slate-900/60 text-slate-400 border-slate-800"
                                )}
                                animate={{
                                    y: isSelected || isHovered ? 0 : -5,
                                    opacity: isSelected || isHovered ? 1 : 0.7
                                }}
                            >
                                {cat.label}
                            </motion.span>
                        </motion.button>
                    );
                })}
            </div>

            {/* Reset Button (only visible when something is selected) */}
            <AnimatePresence>
                {selectedCategory && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelectCategory(null);
                        }}
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold border border-slate-700 transition-colors z-20"
                    >
                        Reset View
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Instructions */}
            <div className="absolute top-4 left-4 text-xs text-slate-500 font-mono">
                INTERACTIVE CONSTELLATION MAP
            </div>
        </div>
    );
}
