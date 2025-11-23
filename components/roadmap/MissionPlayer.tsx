"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { X, ChevronLeft, ChevronRight, CheckCircle2, Trophy, Star, ArrowRight, Sparkles, Zap, Target, Cpu, Hash, Terminal } from "lucide-react";
import { Topic, Subtopic, useUserStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import confetti from "canvas-confetti";

interface MissionPlayerProps {
    topic: Topic;
    initialSubtopicIndex: number;
    onClose: () => void;
}

// Unique gradients for each key point slide
const GRADIENTS = [
    "from-blue-600 via-indigo-600 to-purple-600",
    "from-emerald-500 via-teal-500 to-cyan-600",
    "from-orange-500 via-amber-500 to-red-600",
    "from-pink-500 via-rose-500 to-fuchsia-600",
    "from-cyan-500 via-blue-500 to-indigo-600",
    "from-violet-600 via-purple-600 to-fuchsia-600",
    "from-amber-500 via-orange-500 to-yellow-600",
    "from-lime-500 via-green-500 to-emerald-600",
];

export function MissionPlayer({ topic, initialSubtopicIndex, onClose }: MissionPlayerProps) {
    const [currentSubtopicIndex, setCurrentSubtopicIndex] = useState(initialSubtopicIndex);
    const [currentPointIndex, setCurrentPointIndex] = useState(-1); // -1 = Intro, 0...n = Key Points, n+1 = Complete
    const { completedSubtopics, toggleSubtopicCompletion } = useUserStore();

    // 3D Tilt Effect State
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [5, -5]);
    const rotateY = useTransform(x, [-100, 100], [-5, 5]);
    const springConfig = { damping: 25, stiffness: 300 };
    const rotateXSpring = useSpring(rotateX, springConfig);
    const rotateYSpring = useSpring(rotateY, springConfig);

    // Ensure we have valid data
    const subtopics = topic.subtopics || [];
    const currentSubtopic = subtopics[currentSubtopicIndex];
    const keyPoints = currentSubtopic?.keyPoints || [];

    const isCurrentCompleted = currentSubtopic && completedSubtopics.includes(currentSubtopic.id);

    useEffect(() => {
        // Reset point index when subtopic changes
        setCurrentPointIndex(-1);
    }, [currentSubtopicIndex]);

    useEffect(() => {
        // Lock body scroll when player is open
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
            // Move to next point (or completion screen)
            setCurrentPointIndex(prev => prev + 1);
        } else if (currentSubtopicIndex < subtopics.length - 1) {
            // Move to next subtopic
            setCurrentSubtopicIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentPointIndex > -1) {
            // Move to prev point (or intro)
            setCurrentPointIndex(prev => prev - 1);
        } else if (currentSubtopicIndex > 0) {
            // Move to prev subtopic (last point)
            const prevSubtopic = subtopics[currentSubtopicIndex - 1];
            setCurrentSubtopicIndex(prev => prev - 1);
            // Set to last point of previous subtopic
            setCurrentPointIndex(prevSubtopic.keyPoints ? prevSubtopic.keyPoints.length : 0);
        }
    };

    const handleComplete = () => {
        if (currentSubtopic) {
            if (!isCurrentCompleted) {
                // Trigger confetti
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
            toggleSubtopicCompletion(currentSubtopic.id);

            // Auto advance if not last subtopic
            if (currentSubtopicIndex < subtopics.length - 1) {
                setTimeout(() => {
                    handleNext();
                }, 2000);
            }
        }
    };

    if (!currentSubtopic) return null;

    // Determine current view content
    const isIntro = currentPointIndex === -1;
    const isCompletion = currentPointIndex === keyPoints.length;
    const isKeyPoint = !isIntro && !isCompletion;

    // Get gradient for current point
    const currentGradient = isKeyPoint
        ? GRADIENTS[currentPointIndex % GRADIENTS.length]
        : "from-slate-900 via-blue-950 to-slate-900";

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950 flex flex-col font-sans"
        >
            {/* Dynamic Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 animate-[pulse_4s_ease-in-out_infinite]" />
                <div className={cn(
                    "absolute inset-0 transition-colors duration-1000 opacity-30 bg-gradient-to-br",
                    currentGradient
                )} />
                {/* Floating Particles */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full opacity-20"
                        initial={{
                            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)
                        }}
                        animate={{
                            y: [null, Math.random() * -100],
                            opacity: [0.2, 0.5, 0.2]
                        }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                ))}
            </div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-4 border-b border-white/10 bg-black/20 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full">
                        <X className="w-6 h-6" />
                    </Button>
                    <div>
                        <h2 className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-1">
                            <Terminal className="w-3 h-3" />
                            Mission Protocol
                        </h2>
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                            {topic.name}
                            <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-slate-300 border border-white/10">
                                v1.0
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* Progress Bar */}
                    <div className="hidden md:flex flex-col items-end gap-1 w-48">
                        <div className="flex justify-between w-full text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <span>Progress</span>
                            <span>{Math.round(((currentSubtopicIndex) / subtopics.length) * 100)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentSubtopicIndex) / subtopics.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Objective</div>
                        <div className="text-xl font-black text-white leading-none font-mono">
                            {String(currentSubtopicIndex + 1).padStart(2, '0')}
                            <span className="text-slate-700 text-sm">/</span>
                            <span className="text-slate-600 text-sm">{String(subtopics.length).padStart(2, '0')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative z-10 flex items-center justify-center p-4 overflow-hidden">
                <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-4 items-center h-full">

                    {/* Left Navigation */}
                    <div className="hidden lg:flex lg:col-span-1 justify-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handlePrev}
                            disabled={currentSubtopicIndex === 0 && currentPointIndex === -1}
                            className="h-14 w-14 rounded-full border border-white/5 bg-black/20 hover:bg-white/10 text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:scale-110 backdrop-blur-sm"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                    </div>

                    {/* Center Content Card (3D Tilt) */}
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
                                {/* Holographic Card Container */}
                                <div className={cn(
                                    "relative overflow-hidden rounded-3xl border border-white/10 backdrop-blur-2xl shadow-2xl min-h-[450px] flex flex-col transition-colors duration-500",
                                    isKeyPoint ? `bg-gradient-to-br ${currentGradient} bg-opacity-10` : "bg-slate-900/60"
                                )}>

                                    {/* Glass Reflection */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                                    {/* Scanline Effect */}
                                    <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />

                                    {/* Card Content */}
                                    <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative z-10">

                                        {/* Intro View */}
                                        {isIntro && (
                                            <div className="text-center space-y-8">
                                                <motion.div
                                                    initial={{ scale: 0, rotate: -180 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.5)] mb-6 ring-1 ring-white/20 relative group"
                                                >
                                                    <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <Cpu className="w-10 h-10 text-white" />
                                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-black rounded-full flex items-center justify-center border border-white/20 text-[10px] font-bold text-white">
                                                        {currentSubtopicIndex + 1}
                                                    </div>
                                                </motion.div>

                                                <div className="space-y-4">
                                                    <motion.h1
                                                        initial={{ y: 20, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        transition={{ delay: 0.1 }}
                                                        className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-2xl"
                                                    >
                                                        {currentSubtopic.name}
                                                    </motion.h1>
                                                    <motion.p
                                                        initial={{ y: 20, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        transition={{ delay: 0.2 }}
                                                        className="text-lg md:text-xl text-blue-100/80 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md line-clamp-3"
                                                    >
                                                        {currentSubtopic.description}
                                                    </motion.p>
                                                </div>

                                                <motion.div
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.3 }}
                                                    className="pt-8"
                                                >
                                                    <Button
                                                        size="lg"
                                                        onClick={handleNext}
                                                        className="group relative px-10 py-6 text-lg rounded-xl bg-white text-black hover:bg-blue-50 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] font-black tracking-wide overflow-hidden"
                                                    >
                                                        <span className="relative z-10 flex items-center">
                                                            Initialize <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                        </span>
                                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                                    </Button>
                                                </motion.div>
                                            </div>
                                        )}

                                        {/* Key Point View */}
                                        {isKeyPoint && (
                                            <div className="text-center space-y-10 px-4">
                                                <motion.div
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-black/40 text-white font-bold uppercase tracking-widest text-xs border border-white/10 backdrop-blur-md shadow-lg"
                                                >
                                                    <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                                                        Data Node {String(currentPointIndex + 1).padStart(2, '0')}
                                                    </span>
                                                </motion.div>

                                                <motion.h3
                                                    initial={{ scale: 0.9, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    className="text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-2xl tracking-tight"
                                                >
                                                    "{keyPoints[currentPointIndex]}"
                                                </motion.h3>

                                                <div className="pt-10 flex justify-center gap-4">
                                                    <div className="flex gap-3 p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/5">
                                                        {keyPoints.map((_, idx) => (
                                                            <div
                                                                key={idx}
                                                                className={cn(
                                                                    "w-2.5 h-2.5 rounded-full transition-all duration-500 shadow-lg",
                                                                    idx === currentPointIndex
                                                                        ? "bg-white scale-125 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                                                                        : "bg-white/10 hover:bg-white/30"
                                                                )}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Completion View */}
                                        {isCompletion && (
                                            <div className="text-center space-y-8">
                                                <motion.div
                                                    initial={{ scale: 0, rotate: 180 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                                    className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(34,197,94,0.4)] ring-4 ring-white/10 relative"
                                                >
                                                    <div className="absolute inset-0 bg-white/20 animate-ping rounded-full" />
                                                    <Trophy className="w-16 h-16 text-white drop-shadow-md relative z-10" />
                                                </motion.div>

                                                <div className="space-y-2">
                                                    <motion.h2
                                                        initial={{ y: 20, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        className="text-4xl md:text-6xl font-black text-white drop-shadow-2xl tracking-tight"
                                                    >
                                                        Objective Complete
                                                    </motion.h2>
                                                    <motion.p
                                                        initial={{ y: 20, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        transition={{ delay: 0.1 }}
                                                        className="text-green-400 font-bold uppercase tracking-widest text-sm"
                                                    >
                                                        Synchronization Achieved
                                                    </motion.p>
                                                </div>

                                                <motion.div
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="flex flex-col items-center gap-4 py-4"
                                                >
                                                    <div className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 font-black text-3xl backdrop-blur-md shadow-[0_0_30px_rgba(234,179,8,0.1)]">
                                                        <Zap className="w-8 h-8 fill-yellow-300 animate-pulse" />
                                                        +50 XP
                                                    </div>
                                                </motion.div>

                                                <motion.div
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.3 }}
                                                    className="pt-6"
                                                >
                                                    <Button
                                                        size="lg"
                                                        onClick={handleComplete}
                                                        disabled={isCurrentCompleted}
                                                        className={cn(
                                                            "px-12 py-6 text-xl font-black rounded-2xl transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-105 hover:shadow-[0_0_50px_rgba(16,185,129,0.6)]",
                                                            isCurrentCompleted
                                                                ? "bg-slate-800 text-slate-400 cursor-default"
                                                                : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white"
                                                        )}
                                                    >
                                                        {isCurrentCompleted ? "Completed" : "Claim Reward"}
                                                    </Button>
                                                </motion.div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Decorative Corner Accents */}
                                    <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-white/20 rounded-tl-3xl pointer-events-none" />
                                    <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-white/20 rounded-tr-3xl pointer-events-none" />
                                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-white/20 rounded-bl-3xl pointer-events-none" />
                                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-white/20 rounded-br-3xl pointer-events-none" />
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right Navigation */}
                    <div className="hidden lg:flex lg:col-span-1 justify-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleNext}
                            disabled={currentSubtopicIndex === subtopics.length - 1 && isCompletion}
                            className="h-14 w-14 rounded-full border border-white/5 bg-black/20 hover:bg-white/10 text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:scale-110 backdrop-blur-sm"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Footer */}
            <div className="lg:hidden p-4 border-t border-white/10 bg-black/40 backdrop-blur-xl flex justify-between items-center">
                <Button
                    variant="ghost"
                    onClick={handlePrev}
                    className="text-white hover:bg-white/10"
                >
                    <ChevronLeft className="mr-2 w-4 h-4" /> Prev
                </Button>
                <div className="flex gap-1.5">
                    {keyPoints.map((_, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "w-1.5 h-1.5 rounded-full transition-all",
                                idx === currentPointIndex ? "bg-white scale-125" : "bg-white/20"
                            )}
                        />
                    ))}
                </div>
                <Button
                    variant="ghost"
                    onClick={handleNext}
                    className="text-white hover:bg-white/10"
                >
                    Next <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </motion.div>
    );
}
