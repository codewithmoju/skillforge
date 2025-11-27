"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { X, ChevronLeft, ChevronRight, CheckCircle2, Trophy, Star, ArrowRight, Sparkles, Zap, Target, Cpu, Hash, Terminal, Hexagon, Radio, Shield, Lock } from "lucide-react";
import { Topic, Subtopic, useUserStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import confetti from "canvas-confetti";

interface MissionPlayerProps {
    topic: Topic;
    initialSubtopicIndex: number;
    onClose: () => void;
}

// Enhanced gradients with more vibrant colors
const GRADIENTS = [
    "from-cyan-500 via-blue-600 to-purple-700",
    "from-emerald-400 via-teal-500 to-cyan-700",
    "from-orange-500 via-pink-500 to-rose-600",
    "from-fuchsia-500 via-purple-600 to-indigo-700",
    "from-blue-400 via-indigo-500 to-violet-700",
    "from-violet-500 via-purple-600 to-pink-700",
    "from-amber-400 via-orange-500 to-rose-600",
    "from-lime-400 via-emerald-500 to-teal-700",
];

export function MissionPlayer({ topic, initialSubtopicIndex, onClose }: MissionPlayerProps) {
    const [currentSubtopicIndex, setCurrentSubtopicIndex] = useState(initialSubtopicIndex);
    const [currentPointIndex, setCurrentPointIndex] = useState(-1);
    const { completedSubtopics, completedKeyPoints, toggleSubtopicCompletion, toggleKeyPointCompletion } = useUserStore();

    // 3D Tilt Effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [8, -8]);
    const rotateY = useTransform(x, [-100, 100], [-8, 8]);
    const springConfig = { damping: 25, stiffness: 300 };
    const rotateXSpring = useSpring(rotateX, springConfig);
    const rotateYSpring = useSpring(rotateY, springConfig);

    const subtopics = topic.subtopics || [];
    const currentSubtopic = subtopics[currentSubtopicIndex];
    const keyPoints = currentSubtopic?.keyPoints || [];
    const isCurrentCompleted = currentSubtopic && completedSubtopics.includes(`${topic.id}-${currentSubtopic.id}`);

    useEffect(() => {
        if (currentSubtopic) {
            const firstUncompletedIndex = keyPoints.findIndex((_, idx) =>
                !completedKeyPoints.includes(`${topic.id}-${currentSubtopic.id}-${idx}`)
            );

            if (firstUncompletedIndex !== -1) {
                setCurrentPointIndex(firstUncompletedIndex);
            } else if (isCurrentCompleted) {
                setCurrentPointIndex(keyPoints.length);
            } else {
                setCurrentPointIndex(-1);
            }
        }
    }, [currentSubtopicIndex, currentSubtopic?.id]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(e.clientX - centerX);
        y.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const handleNext = () => {
        if (currentPointIndex < keyPoints.length) {
            setCurrentPointIndex(prev => prev + 1);
        } else if (currentSubtopicIndex < subtopics.length - 1) {
            setCurrentSubtopicIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentPointIndex > -1) {
            setCurrentPointIndex(prev => prev - 1);
        } else if (currentSubtopicIndex > 0) {
            const prevSubtopic = subtopics[currentSubtopicIndex - 1];
            setCurrentSubtopicIndex(prev => prev - 1);
            setCurrentPointIndex(prevSubtopic.keyPoints ? prevSubtopic.keyPoints.length : 0);
        }
    };

    const handleMarkNode = () => {
        if (currentSubtopic && currentPointIndex >= 0 && currentPointIndex < keyPoints.length) {
            toggleKeyPointCompletion(topic.id, currentSubtopic.id, currentPointIndex);
            handleNext();
        }
    };

    const handleComplete = () => {
        if (currentSubtopic) {
            if (!isCurrentCompleted) {
                const duration = 3 * 1000;
                const animationEnd = Date.now() + duration;
                const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 60 };
                const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

                const interval: any = setInterval(function () {
                    const timeLeft = animationEnd - Date.now();
                    if (timeLeft <= 0) {
                        return clearInterval(interval);
                    }
                    const particleCount = 50 * (timeLeft / duration);
                    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
                }, 250);
            }
            toggleSubtopicCompletion(topic.id, currentSubtopic.id);

            if (currentSubtopicIndex < subtopics.length - 1) {
                setTimeout(() => {
                    handleNext();
                }, 2000);
            }
        }
    };

    if (!currentSubtopic) return null;

    const isIntro = currentPointIndex === -1;
    const isCompletion = currentPointIndex === keyPoints.length;
    const isKeyPoint = !isIntro && !isCompletion;
    const isPointCompleted = isKeyPoint && completedKeyPoints.includes(`${topic.id}-${currentSubtopic.id}-${currentPointIndex}`);
    const currentGradient = isKeyPoint
        ? GRADIENTS[currentPointIndex % GRADIENTS.length]
        : "from-slate-900 via-cyan-950 to-slate-900";

    const totalKeyPoints = subtopics.reduce((acc, sub) => acc + (sub.keyPoints?.length || 0), 0);
    const completedPointsCount = subtopics.reduce((acc, sub) => {
        const points = sub.keyPoints || [];
        return acc + points.filter((_, idx) => completedKeyPoints.includes(`${topic.id}-${sub.id}-${idx}`)).length;
    }, 0);
    const progressPercentage = totalKeyPoints > 0 ? Math.min(100, Math.round((completedPointsCount / totalKeyPoints) * 100)) : 0;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950 flex flex-col font-sans"
        >
            {/* ENHANCED DYNAMIC BACKGROUND */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Animated Grid */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10">
                    <motion.div
                        animate={{ opacity: [0.1, 0.2, 0.1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="w-full h-full"
                    />
                </div>

                {/* Gradient Overlay with Current Gradient */}
                <div className={cn(
                    "absolute inset-0 transition-all duration-1000 opacity-20 bg-gradient-to-br",
                    currentGradient
                )} />

                {/* Hexagonal Pattern Overlay */}
                <div className="absolute inset-0 opacity-5">
                    <svg width="100%" height="100%">
                        <defs>
                            <pattern id="hexagons" x="0" y="0" width="100" height="87" patternUnits="userSpaceOnUse">
                                <polygon points="50,0 93.3,25 93.3,62 50,87 6.7,62 6.7,25" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-500" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#hexagons)" />
                    </svg>
                </div>

                {/* Floating Energy Orbs */}
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: Math.random() * 100 + 50,
                            height: Math.random() * 100 + 50,
                            background: `radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)`,
                        }}
                        initial={{
                            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)
                        }}
                        animate={{
                            x: [null, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)],
                            y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)],
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.3, 0.1]
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* ENHANCED HEADER */}
            <div className="relative z-10 flex items-center justify-between p-4 border-b-2 border-cyan-500/20 bg-black/40 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="text-slate-400 hover:text-white hover:bg-cyan-500/10 rounded-lg border border-transparent hover:border-cyan-500/30 transition-all"
                    >
                        <X className="w-6 h-6" />
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                            <Terminal className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div>
                            <h2 className="text-[9px] font-black text-cyan-400 uppercase tracking-[0.25em] flex items-center gap-2 mb-0.5">
                                Neural Mission Protocol
                            </h2>
                            <div className="text-sm font-bold text-white flex items-center gap-2">
                                {topic.name}
                                <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-[9px] text-cyan-300 border border-cyan-500/30 font-mono">
                                    v2.0
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* Enhanced Progress Bar */}
                    <div className="hidden md:flex flex-col items-end gap-1.5 w-56">
                        <div className="flex justify-between w-full text-[9px] font-black uppercase tracking-wider text-slate-400">
                            <span>Sync Progress</span>
                            <span className="text-cyan-400">{progressPercentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-cyan-500/20 relative">
                            <motion.div
                                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 relative"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercentage}%` }}
                                transition={{ duration: 0.5 }}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                    animate={{ x: ["-100%", "200%"] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                />
                            </motion.div>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-[9px] text-slate-500 font-black uppercase tracking-wider mb-0.5">Target</div>
                        <div className="text-2xl font-black text-white leading-none font-mono flex items-center gap-1">
                            <span className="text-cyan-400">{String(currentSubtopicIndex + 1).padStart(2, '0')}</span>
                            <span className="text-slate-700 text-base">/</span>
                            <span className="text-slate-600 text-base">{String(subtopics.length).padStart(2, '0')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 relative z-10 flex items-center justify-center p-4 overflow-hidden">
                <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-4 items-center h-full">

                    {/* Left Navigation */}
                    <div className="hidden lg:flex lg:col-span-1 justify-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handlePrev}
                            disabled={currentSubtopicIndex === 0 && currentPointIndex === -1}
                            className="h-14 w-14 rounded-xl border-2 border-cyan-500/20 bg-black/30 hover:bg-cyan-500/10 text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:scale-110 hover:border-cyan-500/50 backdrop-blur-md group"
                        >
                            <ChevronLeft className="w-6 h-6 group-hover:text-cyan-400 transition-colors" />
                        </Button>
                    </div>

                    {/* ENHANCED CENTER CARD */}
                    <div
                        className="lg:col-span-10 h-full flex items-center justify-center perspective-1000"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${currentSubtopic.id}-${currentPointIndex}`}
                                style={{ rotateX: rotateXSpring, rotateY: rotateYSpring }}
                                initial={{ opacity: 0, scale: 0.9, z: -100 }}
                                animate={{ opacity: 1, scale: 1, z: 0 }}
                                exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                className="w-full max-w-4xl relative"
                            >
                                {/* Outer Glow Ring */}
                                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-[2rem] blur-2xl opacity-50" />

                                {/* Main Card Container */}
                                <div className={cn(
                                    "relative overflow-hidden rounded-3xl border-2 backdrop-blur-2xl shadow-2xl min-h-[450px] flex flex-col transition-all duration-700",
                                    isKeyPoint ? `bg-gradient-to-br ${currentGradient} bg-opacity-5 border-white/20` : "bg-slate-900/40 border-cyan-500/30"
                                )}>

                                    {/* Animated Border Glow */}
                                    <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                                        <motion.div
                                            className="absolute inset-0 border-2 border-cyan-500/50 rounded-3xl"
                                            animate={{
                                                opacity: [0.3, 0.6, 0.3],
                                                scale: [1, 1.02, 1]
                                            }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                        />
                                    </div>

                                    {/* Holographic Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-cyan-500/5 pointer-events-none" />

                                    {/* Hexagonal Corner Decorations */}
                                    {[0, 1, 2, 3].map((corner) => (
                                        <div
                                            key={corner}
                                            className={cn(
                                                "absolute w-16 h-16 pointer-events-none",
                                                corner === 0 && "top-0 left-0",
                                                corner === 1 && "top-0 right-0 rotate-90",
                                                corner === 2 && "bottom-0 left-0 -rotate-90",
                                                corner === 3 && "bottom-0 right-0 rotate-180"
                                            )}
                                        >
                                            <Hexagon className="w-full h-full text-cyan-500/30 stroke-2" />
                                        </div>
                                    ))}

                                    {/* Scan Line Effect */}
                                    <motion.div
                                        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
                                        animate={{ y: [0, 450, 0] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    />

                                    {/* Card Content */}
                                    <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative z-10">

                                        {/* INTRO VIEW */}
                                        {isIntro && (
                                            <div className="text-center space-y-8">
                                                <motion.div
                                                    initial={{ scale: 0, rotate: -180 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                                    className="relative inline-block"
                                                >
                                                    <div className="absolute inset-0 bg-cyan-500/30 blur-3xl rounded-full animate-pulse" />
                                                    <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.6)] ring-2 ring-white/20">
                                                        <Cpu className="w-12 h-12 text-white drop-shadow-lg" />
                                                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-slate-950 rounded-full flex items-center justify-center border-2 border-cyan-500 text-sm font-black text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                                                            {currentSubtopicIndex + 1}
                                                        </div>
                                                    </div>
                                                </motion.div>

                                                <div className="space-y-4">
                                                    <motion.h1
                                                        initial={{ y: 20, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        transition={{ delay: 0.1 }}
                                                        className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]"
                                                    >
                                                        {currentSubtopic.name}
                                                    </motion.h1>
                                                    <motion.p
                                                        initial={{ y: 20, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        transition={{ delay: 0.2 }}
                                                        className="text-lg md:text-xl text-cyan-100/90 max-w-2xl mx-auto leading-relaxed font-medium line-clamp-3"
                                                    >
                                                        {currentSubtopic.description}
                                                    </motion.p>
                                                </div>

                                                <motion.div
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.3 }}
                                                >
                                                    <Button
                                                        size="lg"
                                                        onClick={handleNext}
                                                        className="group relative px-10 py-7 text-lg rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white transition-all shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:shadow-[0_0_60px_rgba(6,182,212,0.5)] font-black tracking-wide border-2 border-white/20 hover:scale-105"
                                                    >
                                                        <span className="relative z-10 flex items-center gap-2">
                                                            Initialize Sequence <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                                        </span>
                                                    </Button>
                                                </motion.div>
                                            </div>
                                        )}

                                        {/* KEY POINT VIEW */}
                                        {isKeyPoint && (
                                            <div className="text-center space-y-8 px-4">
                                                <motion.div
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-black/50 text-white font-black uppercase tracking-widest text-[11px] border-2 border-cyan-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                                                >
                                                    <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                                                        Data Node {String(currentPointIndex + 1).padStart(2, '0')}
                                                    </span>
                                                </motion.div>

                                                <motion.h3
                                                    initial={{ scale: 0.9, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    className="text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-[0_0_40px_rgba(255,255,255,0.3)] px-4"
                                                >
                                                    "{keyPoints[currentPointIndex]}"
                                                </motion.h3>

                                                <div className="pt-8 flex flex-col items-center gap-6">
                                                    {isPointCompleted ? (
                                                        <div className="flex items-center gap-3 px-8 py-4 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 backdrop-blur-md shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                                            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                                                            <span className="text-emerald-300 font-black tracking-wide text-lg">Node Synchronized</span>
                                                        </div>
                                                    ) : (
                                                        <Button
                                                            onClick={handleMarkNode}
                                                            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white border-2 border-white/30 rounded-full px-8 py-5 flex items-center gap-3 backdrop-blur-md transition-all hover:scale-110 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] group"
                                                        >
                                                            <CheckCircle2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                                            <span className="font-black tracking-wide text-lg">Synchronize Node</span>
                                                        </Button>
                                                    )}

                                                    <div className="flex gap-2 p-3 rounded-full bg-black/40 backdrop-blur-md border-2 border-cyan-500/20">
                                                        {keyPoints.map((_, idx) => (
                                                            <div
                                                                key={idx}
                                                                className={cn(
                                                                    "w-2.5 h-2.5 rounded-full transition-all duration-500",
                                                                    idx === currentPointIndex
                                                                        ? "bg-cyan-400 scale-150 shadow-[0_0_15px_rgba(6,182,212,1)]"
                                                                        : completedKeyPoints.includes(`${topic.id}-${currentSubtopic.id}-${idx}`)
                                                                            ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                                                                            : "bg-white/20"
                                                                )}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* COMPLETION VIEW */}
                                        {isCompletion && (
                                            <div className="text-center space-y-8">
                                                <motion.div
                                                    initial={{ scale: 0, rotate: 180 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                                    className="relative inline-block"
                                                >
                                                    <div className="absolute inset-0 bg-emerald-500/30 blur-3xl rounded-full animate-pulse" />
                                                    <motion.div
                                                        animate={{ scale: [1, 1.1, 1] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                        className="relative w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.5)] ring-4 ring-white/20"
                                                    >
                                                        <Trophy className="w-16 h-16 text-white drop-shadow-2xl" />
                                                    </motion.div>
                                                </motion.div>

                                                <div className="space-y-3">
                                                    <motion.h2
                                                        initial={{ y: 20, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        className="text-4xl md:text-6xl font-black text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                                                    >
                                                        Mission Complete!
                                                    </motion.h2>
                                                    <motion.p
                                                        initial={{ y: 20, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        transition={{ delay: 0.1 }}
                                                        className="text-emerald-400 font-black uppercase tracking-widest text-sm"
                                                    >
                                                        Full Synchronization Achieved
                                                    </motion.p>
                                                </div>

                                                <motion.div
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="flex flex-col items-center gap-5 py-6"
                                                >
                                                    <div className="flex items-center gap-4 px-8 py-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-300 font-black text-3xl backdrop-blur-md shadow-[0_0_40px_rgba(251,191,36,0.2)]">
                                                        <Zap className="w-8 h-8 fill-amber-300 animate-pulse" />
                                                        +50 XP
                                                    </div>
                                                </motion.div>

                                                <motion.div
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.3 }}
                                                >
                                                    <Button
                                                        size="lg"
                                                        onClick={handleComplete}
                                                        disabled={isCurrentCompleted}
                                                        className={cn(
                                                            "px-12 py-7 text-xl font-black rounded-2xl transition-all duration-300 border-2",
                                                            isCurrentCompleted
                                                                ? "bg-slate-800 text-slate-400 cursor-default border-slate-700"
                                                                : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:scale-110 hover:shadow-[0_0_60px_rgba(16,185,129,0.6)] border-white/30"
                                                        )}
                                                    >
                                                        {isCurrentCompleted ? "Mission Claimed" : "Claim Rewards"}
                                                    </Button>
                                                </motion.div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Tech Corner Accents */}
                                    <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-cyan-500/40 rounded-tl-3xl pointer-events-none" />
                                    <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-cyan-500/40 rounded-tr-3xl pointer-events-none" />
                                    <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-cyan-500/40 rounded-bl-3xl pointer-events-none" />
                                    <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-cyan-500/40 rounded-br-3xl pointer-events-none" />
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right Navigation */}
                    <div className="hidden lg:flex lg:col-span-1 justify-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleNext}
                            disabled={currentSubtopicIndex === subtopics.length - 1 && isCompletion}
                            className="h-14 w-14 rounded-xl border-2 border-cyan-500/20 bg-black/30 hover:bg-cyan-500/10 text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:scale-110 hover:border-cyan-500/50 backdrop-blur-md group"
                        >
                            <ChevronRight className="w-6 h-6 group-hover:text-cyan-400 transition-colors" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Footer */}
            <div className="lg:hidden p-4 border-t-2 border-cyan-500/20 bg-black/50 backdrop-blur-xl flex justify-between items-center">
                <Button
                    variant="ghost"
                    onClick={handlePrev}
                    className="text-white hover:bg-cyan-500/10 hover:text-cyan-400 transition-all"
                >
                    <ChevronLeft className="mr-2 w-4 h-4" /> Prev
                </Button>
                <div className="flex gap-2">
                    {keyPoints.map((_, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all",
                                idx === currentPointIndex
                                    ? "bg-cyan-400 scale-150 shadow-[0_0_8px_rgba(6,182,212,1)]"
                                    : "bg-white/20"
                            )}
                        />
                    ))}
                </div>
                <Button
                    variant="ghost"
                    onClick={handleNext}
                    className="text-white hover:bg-cyan-500/10 hover:text-cyan-400 transition-all"
                >
                    Next <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </motion.div>
    );
}
