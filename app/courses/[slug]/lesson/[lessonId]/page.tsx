"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle, Play, Code, MessageSquare, Zap, Layout, Terminal, Brain, Trophy, Star, Sparkles, Shield, Sword, Scroll, Gamepad2, Headphones, Bug, User, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { MermaidRenderer } from "@/components/lesson/MermaidRenderer";
import ReactMarkdown from "react-markdown";
import { userBehavior } from "@/lib/services/behavior";
import { useAuth } from "@/lib/hooks/useAuth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AISensei } from "@/components/lesson/AISensei";
import { PodcastPlayer } from "@/components/lesson/PodcastPlayer";
import { LessonSkeleton } from "@/components/lesson/LessonSkeleton";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useSwipe } from "@/lib/hooks/useSwipe";
import { useScrambleText } from "@/lib/hooks/useScrambleText";

interface LessonContent {
    title: string;
    analogy: { story: string; connection: string };
    diagram: string;
    sections: any[];
    bossChallenge: any;
    cheatSheet?: string[];
    metadata?: { personalized: boolean };
}

interface Theme {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
}

export default function LessonPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [content, setContent] = useState<LessonContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState(0);
    const [userCode, setUserCode] = useState("");
    const [feedbacks, setFeedbacks] = useState<Record<string, string>>({});

    // Parse lesson ID (format: moduleIdx-lessonIdx)
    const lessonId = params.lessonId as string;
    const slug = params.slug as string;
    const [moduleIdx, lessonIdx] = lessonId.split('-').map(Number);

    // Always call hooks at the top level
    const scrambledTitle = useScrambleText(content?.title || "", !loading && !!content);

    const [showVictory, setShowVictory] = useState(false);
    const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
    const [theme, setTheme] = useState<Theme | null>(null);
    const [hintIndex, setHintIndex] = useState(-1);
    const [bossAttempts, setBossAttempts] = useState(0);

    // Track page view
    useEffect(() => {
        if (user && lessonId) {
            const startTime = Date.now();
            userBehavior.log(user.uid, 'view_lesson', {
                targetId: lessonId as string,
                metadata: { slug }
            });

            return () => {
                const duration = (Date.now() - startTime) / 1000;
                userBehavior.log(user.uid, 'view_lesson', {
                    targetId: lessonId as string,
                    duration,
                    metadata: { slug, type: 'exit' }
                });
            };
        }
    }, [user, lessonId, slug]);

    useEffect(() => {
        const loadLesson = async () => {
            // Get syllabus from local storage or Firestore
            let syllabus = null;
            const stored = localStorage.getItem(`course-${slug}`);

            if (stored && stored !== "undefined") {
                try {
                    syllabus = JSON.parse(stored);
                } catch (e) {
                    console.warn("Invalid syllabus cache, clearing");
                    localStorage.removeItem(`course-${slug}`);
                }
            } else {
                try {
                    const courseDoc = await getDoc(doc(db, "courses", slug));
                    if (courseDoc.exists()) {
                        const data = courseDoc.data();
                        syllabus = data.syllabus;
                        localStorage.setItem(`course-${slug}`, JSON.stringify(syllabus));
                    }
                } catch (err) {
                    console.error("Failed to fetch course:", err);
                }
            }

            if (!syllabus) {
                console.error("Syllabus not found");
                return;
            }

            if (syllabus.theme) {
                setTheme(syllabus.theme);
            }
            const lesson = syllabus.modules[moduleIdx].lessons[lessonIdx];
            const lessonTitle = lesson.title;
            const moduleTitle = syllabus.modules[moduleIdx].title;
            const objectives = lesson.objectives || [];

            // Check cache first
            const cacheKey = `lesson-${slug}-${moduleIdx}-${lessonIdx}`;
            const cachedContent = localStorage.getItem(cacheKey);

            if (cachedContent && cachedContent !== "undefined") {
                try {
                    const parsed = JSON.parse(cachedContent);
                    if (parsed && parsed.bossChallenge) {
                        setContent(parsed);
                        setLoading(false);
                        return;
                    }
                } catch (e) {
                    console.warn("Invalid cache, clearing:", cacheKey);
                    localStorage.removeItem(cacheKey);
                }
            } else if (cachedContent === "undefined") {
                localStorage.removeItem(cacheKey);
            }

            // Check Firestore for lesson
            try {
                const lessonDoc = await getDoc(doc(db, "courses", slug, "lessons", `${moduleIdx}-${lessonIdx}`));
                if (lessonDoc.exists()) {
                    const data = lessonDoc.data();
                    setContent(data as LessonContent);
                    localStorage.setItem(cacheKey, JSON.stringify(data));
                    setLoading(false);
                    return;
                }
            } catch (err) {
                console.error("Failed to fetch lesson from DB:", err);
            }

            try {
                const res = await fetch('/api/courses/generate-lesson', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        topic: syllabus.title,
                        lessonTitle,
                        moduleTitle,
                        objectives,
                        courseId: slug,
                        lessonId: `${moduleIdx}-${lessonIdx}`
                    })
                });
                const data = await res.json();
                setContent(data.content);

                // Save to Firestore (Client SDK - Authenticated)
                if (user) {
                    const lessonRef = doc(db, "courses", slug, "lessons", `${moduleIdx}-${lessonIdx}`);
                    await setDoc(lessonRef, {
                        ...data.content,
                        createdAt: new Date(),
                        metadata: {
                            version: "2.0",
                            personalized: true // Assuming personalized if generated fresh
                        }
                    });
                }

                // Save to cache
                if (data.content) {
                    localStorage.setItem(cacheKey, JSON.stringify(data.content));
                }
            } catch (error) {
                console.error("Failed to load lesson:", error);
            } finally {
                setLoading(false);
            }
        };

        loadLesson();
    }, [params.slug, lessonId, moduleIdx, lessonIdx, slug]);

    // Predictive Prefetching (The "Time Travel" Engine)
    useEffect(() => {
        if (!content || loading) return;

        const prefetchNextLesson = async () => {
            const stored = localStorage.getItem(`course-${slug}`);
            if (!stored) return;

            const syllabus = JSON.parse(stored);
            let nextModuleIdx = moduleIdx;
            let nextLessonIdx = lessonIdx + 1;

            // Check if we need to move to next module
            if (nextLessonIdx >= syllabus.modules[moduleIdx].lessons.length) {
                nextModuleIdx++;
                nextLessonIdx = 0;
            }

            // If no more modules, stop
            if (nextModuleIdx >= syllabus.modules.length) return;

            const nextCacheKey = `lesson-${slug}-${nextModuleIdx}-${nextLessonIdx}`;
            if (localStorage.getItem(nextCacheKey)) return; // Already cached

            console.log(`🚀 Prefetching next lesson: ${nextModuleIdx}-${nextLessonIdx}`);

            try {
                const nextLesson = syllabus.modules[nextModuleIdx].lessons[nextLessonIdx];
                const nextLessonTitle = nextLesson.title;
                const nextModuleTitle = syllabus.modules[nextModuleIdx].title;
                const nextObjectives = nextLesson.objectives || [];

                const res = await fetch('/api/courses/generate-lesson', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        topic: syllabus.title,
                        lessonTitle: nextLessonTitle,
                        moduleTitle: nextModuleTitle,
                        objectives: nextObjectives,
                        courseId: slug,
                        lessonId: `${nextModuleIdx}-${nextLessonIdx}`
                    })
                });
                const data = await res.json();
                if (data.content) {
                    // Save to Firestore (Client SDK - Authenticated)
                    if (user) {
                        const lessonRef = doc(db, "courses", slug, "lessons", `${nextModuleIdx}-${nextLessonIdx}`);
                        await setDoc(lessonRef, {
                            ...data.content,
                            createdAt: new Date(),
                            metadata: {
                                version: "2.0",
                                personalized: true
                            }
                        });
                    }

                    if (data.content) {
                        localStorage.setItem(nextCacheKey, JSON.stringify(data.content));
                        console.log(`✅ Prefetched successfully: ${nextLessonTitle}`);
                    }
                }
            } catch (err) {
                console.warn("Prefetch failed:", err);
            }
        };

        // Delay prefetch slightly to prioritize main thread for UI
        const timer = setTimeout(prefetchNextLesson, 2000);
        return () => clearTimeout(timer);
    }, [content, loading, moduleIdx, lessonIdx, slug]);

    const [consecutiveFailures, setConsecutiveFailures] = useState(0);
    const [consecutivePerfects, setConsecutivePerfects] = useState(0);
    const [adaptiveContent, setAdaptiveContent] = useState<any>(null);
    const [showAdaptiveModal, setShowAdaptiveModal] = useState(false);
    const [isEvolving, setIsEvolving] = useState(false);




    useSwipe({
        onSwipeRight: () => router.back(),
        threshold: 100 // Higher threshold to prevent accidental swipes
    });

    const handleInteraction = (input: string, answer: string, sectionKey: string | number) => {
        const isCorrect = input.toLowerCase().trim() === answer.toLowerCase().trim() || input.toLowerCase().includes(answer.toLowerCase());
        const key = String(sectionKey);

        if (isCorrect) {
            setFeedbacks(prev => ({ ...prev, [key]: "Correct! Access Granted." }));
            setConsecutivePerfects(prev => prev + 1);
            setConsecutiveFailures(0);
        } else {
            setFeedbacks(prev => ({ ...prev, [key]: "Access Denied. Protocol Mismatch." }));
            setConsecutiveFailures(prev => prev + 1);
            setConsecutivePerfects(0);

            if (consecutiveFailures >= 2) {
                handleQuizComplete(0); // Trigger adaptive flow
            }
        }
    };

    const handleQuizComplete = async (score: number) => {
        if (score < 50) {
            setIsEvolving(true);
            try {
                const res = await fetch('/api/courses/update-syllabus', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        slug,
                        moduleIdx,
                        lessonIdx,
                        performance: 'poor'
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    localStorage.setItem(`course-${slug}`, JSON.stringify(data.syllabus));
                    window.location.reload();
                } else {
                    console.error("Failed to evolve syllabus: API Error");
                    setIsEvolving(false);
                }
            } catch (err) {
                console.error("Failed to evolve syllabus:", err);
                setIsEvolving(false);
            }
        }
    };

    const handleComplete = async () => {
        // Track lesson completion
        if (user) {
            userBehavior.log(user.uid, 'view_lesson', {
                targetId: lessonId as string,
                outcome: 'success',
                metadata: { type: 'complete' }
            });

            // Save progress to Firestore
            try {
                const { completeLesson } = await import("@/lib/services/userProgress");
                await completeLesson(user.uid, slug, lessonId);
            } catch (error) {
                console.error("Failed to save progress to Firestore:", error);
            }
        }

        // Save progress locally (as backup/cache)
        const progressKey = `progress-${slug}`;
        const storedProgress = localStorage.getItem(progressKey);
        const progress = storedProgress ? JSON.parse(storedProgress) : [];
        if (!progress.includes(lessonId)) {
            progress.push(lessonId);
            localStorage.setItem(progressKey, JSON.stringify(progress));
        }

        setShowVictory(true);
    };

    if (loading) return <LessonSkeleton />;
    if (!content) return <div>Error loading lesson</div>;

    const primaryColor = theme?.primary || "#4f46e5";
    const secondaryColor = theme?.secondary || "#a855f7";
    const accentColor = theme?.accent || "#6366f1";
    const backgroundColor = theme?.background || "#030014";

    return (
        <div className="min-h-screen text-white overflow-x-hidden font-sans selection:bg-indigo-500/30 custom-scrollbar" style={{ backgroundColor }}>
            <style jsx global>{`
                ::selection { background: ${primaryColor}4D; color: white; }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: ${backgroundColor};
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: ${primaryColor};
                    border-radius: 5px;
                    border: 2px solid ${backgroundColor};
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: ${accentColor};
                }
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 10s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                /* Aurora Animation */
                @keyframes aurora {
                    0% { background-position: 50% 50%, 50% 50%; }
                    100% { background-position: 350% 50%, 350% 50%; }
                }
                .animate-aurora {
                    animation: aurora 60s linear infinite;
                }
            `}</style>

            {/* Immersive Aurora Background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[#030014]" />
                <div
                    className="absolute inset-[-50%] opacity-40 animate-aurora mix-blend-screen"
                    style={{
                        backgroundImage: `
                            repeating-linear-gradient(100deg, ${primaryColor}00 10%, ${primaryColor}1A 20%, ${secondaryColor}1A 30%, ${accentColor}00 40%),
                            repeating-linear-gradient(180deg, ${secondaryColor}00 10%, ${accentColor}1A 20%, ${primaryColor}1A 30%, ${secondaryColor}00 40%)
                        `,
                        backgroundSize: '200% 200%'
                    }}
                />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay" />

                {/* Floating Geometric Shapes */}
                <motion.div
                    className="absolute top-20 right-[10%] w-96 h-96 opacity-20 blur-3xl rounded-full"
                    style={{ background: `radial-gradient(circle, ${primaryColor}, transparent)` }}
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 20, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-20 left-[10%] w-[30rem] h-[30rem] opacity-10 blur-3xl rounded-full"
                    style={{ background: `radial-gradient(circle, ${secondaryColor}, transparent)` }}
                    animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
                    transition={{ duration: 25, repeat: Infinity }}
                />
            </div>

            {/* Gamified Header */}
            <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/5 shadow-2xl transition-all duration-300"
                style={{ backgroundColor: `${backgroundColor}CC`, boxShadow: `0 0 20px ${primaryColor}0D` }}
            >
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <MagneticButton
                            onClick={() => router.push(`/courses/${slug}/lesson/${lessonId}/podcast`)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300"
                        >
                            <Headphones className="w-5 h-5" />
                            <span className="hidden sm:inline">Podcast Mode</span>
                        </MagneticButton>
                        <MagneticButton
                            onClick={() => router.back()}
                            className="group flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                            <span className="hidden sm:inline font-medium tracking-wide">Abort Mission</span>
                        </MagneticButton>

                        <div className="flex items-center gap-8">
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ color: primaryColor }}>
                                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }} />
                                    Mission Progress
                                </div>
                                <div className="w-48 h-1.5 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                                    <motion.div
                                        className="h-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                                        style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor}, ${accentColor})` }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${((activeSection + 1) / content.sections.length) * 100}%` }}
                                        transition={{ type: "spring", stiffness: 50, damping: 20 }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Stream */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 pt-40 pb-48">

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-center mb-24"
                >
                    <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col items-center gap-4 mb-8"
                    >
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] border backdrop-blur-sm"
                            style={{
                                backgroundColor: `${primaryColor}1A`,
                                color: primaryColor,
                                borderColor: `${primaryColor}33`,
                                boxShadow: `0 0 30px ${primaryColor}33`
                            }}
                        >
                            <Gamepad2 className="w-4 h-4" /> Mission Start
                        </div>
                        {content.metadata?.personalized && (
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border backdrop-blur-sm"
                                style={{
                                    backgroundColor: `${accentColor}1A`,
                                    color: accentColor,
                                    borderColor: `${accentColor}33`
                                }}
                            >
                                <User className="w-3 h-3" /> Personalized For You
                            </div>
                        )}
                    </motion.div>
                    <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text mb-8 tracking-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] leading-[1.1]"
                        style={{ backgroundImage: `linear-gradient(to bottom, white, ${primaryColor}33, ${primaryColor}80)` }}
                    >
                        {scrambledTitle}
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
                        Prepare to download new knowledge into your neural network.
                    </p>
                </motion.div>

                {/* Mission Intel (Analogy) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="mb-24 relative group"
                >
                    {/* Holographic Border */}
                    <div className="absolute -inset-[2px] rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                            background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor}, ${accentColor}, ${primaryColor})`,
                            backgroundSize: '200% 100%',
                            animation: 'aurora 2s linear infinite'
                        }}
                    />

                    <div className="relative p-10 md:p-12 rounded-[2.4rem] border border-white/10 backdrop-blur-2xl overflow-hidden shadow-2xl transition-all duration-500"
                        style={{
                            backgroundColor: `${backgroundColor}CC`,
                            boxShadow: `0 0 40px -10px ${primaryColor}4D`
                        }}
                    >
                        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03]" />

                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                            <Brain className="w-64 h-64 text-white" />
                        </div>

                        <div className="flex items-center gap-4 mb-8 relative z-10">
                            <div className="p-3.5 rounded-2xl border shadow-[0_0_20px_rgba(0,0,0,0.1)] backdrop-blur-md"
                                style={{ backgroundColor: `${primaryColor}1A`, color: primaryColor, borderColor: `${primaryColor}33` }}
                            >
                                <Scroll className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white uppercase tracking-widest">Mission Intel</h3>
                                <p className="text-xs font-mono tracking-widest mt-1" style={{ color: `${primaryColor}99` }}>CLASSIFIED // EYES ONLY</p>
                            </div>
                        </div>

                        <div className="prose prose-invert prose-lg max-w-none relative z-10">
                            <p className="text-3xl text-slate-200 italic font-light leading-relaxed mb-8">
                                "{content.analogy.story}"
                            </p>
                            <div className="flex items-start gap-5 p-6 rounded-2xl border relative overflow-hidden backdrop-blur-md"
                                style={{ backgroundColor: `${primaryColor}0D`, borderColor: `${primaryColor}1A` }}
                            >
                                <div className="absolute inset-0 animate-pulse" style={{ backgroundColor: `${primaryColor}0D` }} />
                                <div className="mt-1 relative z-10">
                                    <Shield className="w-6 h-6" style={{ color: primaryColor }} />
                                </div>
                                <div className="relative z-10">
                                    <span className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: primaryColor }}>Tactical Analysis</span>
                                    <span className="text-slate-300 text-lg leading-relaxed">{content.analogy.connection}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Visual Blueprint */}
                {content.diagram && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="mb-24 p-[1px] rounded-[2.5rem] bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 shadow-2xl"
                    >
                        <div className="bg-[#05050a] rounded-[2.4rem] overflow-hidden relative">
                            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]" />
                            <div className="px-8 py-5 bg-white/[0.02] border-b border-white/5 flex items-center justify-between backdrop-blur-sm">
                                <div className="flex items-center gap-3 text-slate-300 font-bold uppercase tracking-widest text-xs">
                                    <Layout className="w-4 h-4" style={{ color: primaryColor }} /> Schematic View
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-white/10" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-white/10" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-white/10" />
                                </div>
                            </div>
                            <div className="p-10 relative z-10">
                                <MermaidRenderer chart={content.diagram} />
                            </div>
                        </div>
                    </motion.div>
                )}

                <div className="space-y-32">
                    {content.sections.map((section: any, idx: number) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="relative"
                            onViewportEnter={() => setActiveSection(idx)}
                        >
                            {/* Connector Line - Fixed Alignment */}
                            {idx !== content.sections.length - 1 && (
                                <div className="absolute left-[2.5rem] top-24 bottom-[-8rem] w-0.5 -z-10 md:left-[2.5rem]"
                                    style={{ background: `linear-gradient(to bottom, ${primaryColor}80, ${primaryColor}33, transparent)` }}
                                />
                            )}

                            <div className="flex items-start gap-8 md:gap-12">
                                {/* Step Marker */}
                                <div className="hidden md:flex flex-col items-center gap-4 pt-2 sticky top-32 self-start">
                                    <div className={cn(
                                        "w-20 h-20 rounded-[1.2rem] flex items-center justify-center text-2xl font-black border transition-all duration-700 shadow-[0_0_40px_rgba(0,0,0,0.5)] z-10 relative",
                                        idx <= activeSection
                                            ? "text-white scale-110 rotate-3"
                                            : "bg-[#0a0a16] border-slate-800 text-slate-700 grayscale"
                                    )}
                                        style={idx <= activeSection ? {
                                            backgroundColor: primaryColor,
                                            borderColor: `${primaryColor}CC`,
                                            boxShadow: `0 0 30px ${primaryColor}66`
                                        } : {}}
                                    >
                                        {idx + 1}
                                        {idx === activeSection && (
                                            <div className="absolute inset-0 rounded-[1.2rem] border-2 border-white/20 animate-ping" />
                                        )}
                                    </div>
                                </div>

                                {/* Content Card */}
                                <div className="flex-1 min-w-0">
                                    <div className={cn(
                                        "p-8 md:p-12 rounded-[2.5rem] border transition-all duration-700 relative overflow-hidden group",
                                        idx === activeSection
                                            ? "shadow-[0_0_50px_rgba(0,0,0,0.1)] backdrop-blur-xl"
                                            : "bg-transparent border-transparent opacity-60 hover:opacity-80 grayscale-[0.5] hover:grayscale-0"
                                    )}
                                        style={idx === activeSection ? {
                                            backgroundColor: `${backgroundColor}CC`,
                                            borderColor: `${primaryColor}4D`,
                                            boxShadow: `0 0 50px ${primaryColor}1A`
                                        } : {
                                            backgroundColor: `${backgroundColor}66`,
                                            borderColor: 'rgba(255,255,255,0.05)'
                                        }}
                                    >
                                        {/* Noise Texture */}
                                        <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.svg')]" />

                                        {/* Holographic Border on Hover */}
                                        <div className="absolute -inset-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                            style={{
                                                background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor}, ${accentColor}, ${primaryColor})`,
                                                backgroundSize: '200% 100%',
                                                animation: 'aurora 2s linear infinite',
                                                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                                maskComposite: 'exclude',
                                                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                                WebkitMaskComposite: 'xor'
                                            }}
                                        />

                                        {section.type === 'text' && (
                                            <div className="prose prose-invert prose-xl max-w-none relative z-10">
                                                <ReactMarkdown
                                                    components={{
                                                        h1: ({ node, ...props }) => <h1 className="text-4xl font-black text-white mb-8 tracking-tight" {...props} />,
                                                        h2: ({ node, ...props }) => <h2 className="text-3xl font-bold text-transparent bg-clip-text mt-10 mb-6 tracking-tight" style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}33, white)` }} {...props} />,
                                                        h3: ({ node, ...props }) => <h3 className="text-2xl font-bold mt-8 mb-4 tracking-wide" style={{ color: `${primaryColor}CC` }} {...props} />,
                                                        p: ({ node, ...props }) => <p className="text-slate-300 leading-loose mb-6 font-light" {...props} />,
                                                        strong: ({ node, ...props }) => <strong className="font-bold" style={{ color: primaryColor }} {...props} />,
                                                        ul: ({ node, ...props }) => <ul className="space-y-4 my-8" {...props} />,
                                                        li: ({ node, ...props }) => (
                                                            <li className="flex items-start gap-4 text-slate-300">
                                                                <span className="mt-3 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: primaryColor, boxShadow: `0 0 10px ${primaryColor}CC` }} />
                                                                <span className="leading-relaxed">{props.children}</span>
                                                            </li>
                                                        ),
                                                        blockquote: ({ node, ...props }) => (
                                                            <blockquote className="border-l-4 pl-8 py-6 my-10 rounded-r-3xl italic text-slate-200 text-xl font-light"
                                                                style={{ borderColor: primaryColor, background: `linear-gradient(to right, ${primaryColor}1A, transparent)` }}
                                                                {...props}
                                                            />
                                                        ),
                                                        code: ({ node, ...props }) => (
                                                            <code className="bg-slate-800/50 px-2 py-1 rounded-lg text-indigo-300 font-mono text-sm border border-indigo-500/20" {...props} />
                                                        ),
                                                    }}
                                                >
                                                    {section.content}
                                                </ReactMarkdown>
                                            </div>
                                        )}

                                        {section.type === 'code' && (
                                            <div className="relative z-10 group/code">
                                                <div className="rounded-3xl overflow-hidden bg-[#05050a] border border-slate-800 shadow-2xl ring-1 ring-white/5 transition-transform duration-500 group-hover/code:scale-[1.01]">
                                                    <div className="flex items-center justify-between px-6 py-4 bg-white/[0.03] border-b border-white/5">
                                                        <div className="flex items-center gap-3">
                                                            <Terminal className="w-4 h-4 text-indigo-400" />
                                                            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">{section.language} Terminal</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                                            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                                            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                                                        </div>
                                                    </div>
                                                    <div className="p-8 overflow-x-auto custom-scrollbar">
                                                        <pre className="font-mono text-sm text-indigo-100/90 leading-relaxed">
                                                            <code>{section.code}</code>
                                                        </pre>
                                                    </div>
                                                </div>
                                                {section.explanation && (
                                                    <div className="mt-8 p-6 rounded-2xl border flex gap-5 backdrop-blur-sm"
                                                        style={{ backgroundColor: `${primaryColor}1A`, borderColor: `${primaryColor}1A` }}
                                                    >
                                                        <div className="p-2.5 rounded-xl h-fit border"
                                                            style={{ backgroundColor: `${primaryColor}1A`, color: primaryColor, borderColor: `${primaryColor}33` }}
                                                        >
                                                            <Zap className="w-5 h-5" />
                                                        </div>
                                                        <p className="leading-relaxed text-sm" style={{ color: `${primaryColor}CC` }}>{section.explanation}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {section.type === 'simulation' && (
                                            <div className="relative z-10">
                                                <div className="rounded-[2rem] border overflow-hidden backdrop-blur-md"
                                                    style={{ backgroundColor: `${backgroundColor}CC`, borderColor: `${primaryColor}33` }}
                                                >
                                                    <div className="px-8 py-6 border-b flex items-center justify-between"
                                                        style={{ backgroundColor: `${primaryColor}0D`, borderColor: `${primaryColor}1A` }}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${primaryColor}1A` }}>
                                                                <Gamepad2 className="w-5 h-5" style={{ color: primaryColor }} />
                                                            </div>
                                                            <div>
                                                                <div className="text-xs font-bold uppercase tracking-widest opacity-70">Simulation Protocol</div>
                                                                <div className="font-bold text-white">{section.title}</div>
                                                            </div>
                                                        </div>
                                                        <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border"
                                                            style={{ borderColor: `${primaryColor}33`, color: primaryColor }}
                                                        >
                                                            Active
                                                        </div>
                                                    </div>
                                                    <div className="p-8 space-y-6">
                                                        <div className="flex gap-4">
                                                            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 border"
                                                                style={{ backgroundColor: `${secondaryColor}1A`, borderColor: `${secondaryColor}33` }}
                                                            >
                                                                <User className="w-6 h-6" style={{ color: secondaryColor }} />
                                                            </div>
                                                            <div className="flex-1 space-y-2">
                                                                <div className="text-xs font-bold uppercase tracking-widest opacity-50">Role: {section.role}</div>
                                                                <div className="text-lg text-slate-200 leading-relaxed font-light">"{section.scenario}"</div>
                                                            </div>
                                                        </div>
                                                        <div className="p-6 rounded-xl border border-dashed flex items-start gap-4"
                                                            style={{ borderColor: `${accentColor}33`, backgroundColor: `${accentColor}05` }}
                                                        >
                                                            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: accentColor }} />
                                                            <div>
                                                                <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: accentColor }}>Objective</div>
                                                                <div className="text-slate-300">{section.objective}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {section.type === 'debug' && (
                                            <div className="relative z-10">
                                                <div className="rounded-[2rem] border overflow-hidden backdrop-blur-md"
                                                    style={{ backgroundColor: `${backgroundColor}CC`, borderColor: 'rgba(239, 68, 68, 0.2)' }}
                                                >
                                                    <div className="px-8 py-6 border-b flex items-center gap-3 bg-red-500/5 border-red-500/10">
                                                        <Bug className="w-5 h-5 text-red-400" />
                                                        <span className="font-bold text-red-100">Bug Hunt Challenge</span>
                                                    </div>
                                                    <div className="p-8">
                                                        <p className="text-slate-300 mb-6">{section.description}</p>
                                                        <div className="relative rounded-xl overflow-hidden border border-red-500/20 mb-6">
                                                            <div className="absolute top-0 right-0 px-3 py-1 bg-red-500/20 text-red-300 text-[10px] font-bold uppercase tracking-widest rounded-bl-xl">
                                                                Buggy Code
                                                            </div>
                                                            <pre className="bg-[#05050a] p-6 text-sm font-mono text-red-100/80 overflow-x-auto">
                                                                <code>{section.buggyCode}</code>
                                                            </pre>
                                                        </div>

                                                        <details className="group/details">
                                                            <summary className="flex items-center gap-2 cursor-pointer text-sm font-bold uppercase tracking-widest select-none transition-colors hover:text-white"
                                                                style={{ color: primaryColor }}
                                                            >
                                                                <ChevronDown className="w-4 h-4 transition-transform group-open/details:rotate-180" />
                                                                Reveal Solution
                                                            </summary>
                                                            <div className="mt-6 pt-6 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
                                                                <div className="rounded-xl overflow-hidden border border-green-500/20 mb-4">
                                                                    <div className="absolute top-0 right-0 px-3 py-1 bg-green-500/20 text-green-300 text-[10px] font-bold uppercase tracking-widest rounded-bl-xl z-10">
                                                                        Fixed Code
                                                                    </div>
                                                                    <pre className="bg-[#05050a] p-6 text-sm font-mono text-green-100/80 overflow-x-auto relative">
                                                                        <code>{section.solution}</code>
                                                                    </pre>
                                                                </div>
                                                                <p className="text-slate-400 text-sm leading-relaxed border-l-2 pl-4" style={{ borderColor: primaryColor }}>
                                                                    <strong className="text-white block mb-1">Analysis:</strong>
                                                                    {section.explanation}
                                                                </p>
                                                            </div>
                                                        </details>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {section.type === 'deep_dive' && (
                                            <div className="relative z-10">
                                                <details className="group/deep-dive">
                                                    <summary className="list-none">
                                                        <div className="p-6 rounded-2xl border cursor-pointer transition-all duration-300 hover:bg-white/5 flex items-center justify-between group-open/deep-dive:rounded-b-none group-open/deep-dive:bg-white/5"
                                                            style={{ borderColor: `${primaryColor}33`, backgroundColor: `${primaryColor}05` }}
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className="p-2 rounded-lg" style={{ backgroundColor: `${primaryColor}1A` }}>
                                                                    <Brain className="w-5 h-5" style={{ color: primaryColor }} />
                                                                </div>
                                                                <span className="font-bold text-lg text-white">Deep Dive: {section.title}</span>
                                                            </div>
                                                            <ChevronDown className="w-5 h-5 text-slate-400 transition-transform group-open/deep-dive:rotate-180" />
                                                        </div>
                                                    </summary>
                                                    <div className="p-8 border-x border-b rounded-b-2xl backdrop-blur-sm"
                                                        style={{ borderColor: `${primaryColor}33`, backgroundColor: `${backgroundColor}CC` }}
                                                    >
                                                        <div className="prose prose-invert prose-sm max-w-none">
                                                            <ReactMarkdown>{section.content}</ReactMarkdown>
                                                        </div>
                                                    </div>
                                                </details>
                                            </div>
                                        )}

                                        {section.type === 'interactive' && (
                                            <div className="relative z-10">
                                                <div className="rounded-[2.5rem] p-[2px] shadow-[0_0_40px_rgba(0,0,0,0.2)]"
                                                    style={{ background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor}, ${accentColor})` }}
                                                >
                                                    <div className="rounded-[2.4rem] p-10 md:p-12 relative overflow-hidden"
                                                        style={{ backgroundColor: backgroundColor }}
                                                    >
                                                        {/* Background Pattern */}
                                                        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"
                                                            style={{ backgroundColor: `${primaryColor}33` }}
                                                        />

                                                        <div className="flex items-center gap-8 mb-12 relative">
                                                            <div className="p-5 rounded-2xl text-white shadow-[0_0_30px_rgba(0,0,0,0.3)] border border-white/10 backdrop-blur-md relative overflow-hidden group/icon"
                                                                style={{ backgroundColor: `${primaryColor}CC`, boxShadow: `0 0 30px ${primaryColor}66` }}
                                                            >
                                                                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity" />
                                                                <Sword className="w-10 h-10 relative z-10" />
                                                            </div>
                                                            <div>
                                                                <h4 className="text-3xl font-black text-white uppercase italic tracking-widest drop-shadow-lg"
                                                                    style={{ textShadow: `0 0 20px ${primaryColor}80` }}
                                                                >
                                                                    Boss Challenge
                                                                </h4>
                                                                <p className="text-xs font-mono uppercase tracking-[0.3em] mt-2 opacity-80" style={{ color: accentColor }}>
                                                                    // Protocol: Elimination
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <p className="text-3xl text-slate-100 mb-14 font-light leading-relaxed tracking-wide border-l-4 pl-8 py-2"
                                                            style={{ borderColor: primaryColor }}
                                                        >
                                                            {section.question}
                                                        </p>

                                                        {section.interactionType === 'fill-in-blank' && (
                                                            <div className="space-y-10">
                                                                <div className="p-12 bg-[#05050a]/80 rounded-[2rem] font-mono text-2xl border border-slate-800/50 shadow-inner flex flex-wrap items-center gap-x-6 gap-y-8 leading-loose relative overflow-hidden backdrop-blur-sm">
                                                                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]" />
                                                                    {section.codeContext.split(/_{3,}/).map((part: string, i: number) => (
                                                                        <span key={i} className="text-slate-300 relative z-10">
                                                                            {part}
                                                                            {i === 0 && (
                                                                                <span className="relative inline-block mx-2 group/input">
                                                                                    <input
                                                                                        type="text"
                                                                                        className="border-b-4 text-white px-8 py-3 focus:outline-none transition-all w-64 text-center font-bold rounded-t-xl bg-white/5 focus:bg-white/10"
                                                                                        style={{
                                                                                            borderColor: primaryColor,
                                                                                            boxShadow: `0 10px 30px -10px ${primaryColor}33`
                                                                                        }}
                                                                                        placeholder="???"
                                                                                        onKeyDown={(e) => {
                                                                                            if (e.key === 'Enter') {
                                                                                                handleInteraction((e.target as HTMLInputElement).value, section.answer, idx);
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                    <div className="absolute -bottom-10 left-0 right-0 text-[10px] text-center uppercase tracking-[0.2em] font-bold opacity-0 group-focus-within/input:opacity-100 transition-all duration-500 transform translate-y-2 group-focus-within/input:translate-y-0"
                                                                                        style={{ color: primaryColor }}
                                                                                    >
                                                                                        Press Enter
                                                                                    </div>
                                                                                </span>
                                                                            )}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                                {feedbacks[idx] && (
                                                                    <motion.div
                                                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                        className={cn(
                                                                            "flex items-center gap-4 text-lg font-bold px-8 py-5 rounded-2xl w-full justify-center shadow-2xl border backdrop-blur-md",
                                                                            feedbacks[idx].includes("Correct")
                                                                                ? "bg-green-500/10 text-green-400 border-green-500/30 shadow-green-500/10"
                                                                                : "bg-red-500/10 text-red-400 border-red-500/30 shadow-red-500/10"
                                                                        )}
                                                                    >
                                                                        {feedbacks[idx].includes("Correct") ? <Trophy className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                                                                        {feedbacks[idx]}
                                                                    </motion.div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Cheat Sheet Section */}
                {content.cheatSheet && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-32 max-w-3xl mx-auto"
                    >
                        <div className="rounded-[2rem] border overflow-hidden backdrop-blur-md"
                            style={{ backgroundColor: `${backgroundColor}CC`, borderColor: `${primaryColor}33` }}
                        >
                            <div className="px-8 py-6 border-b flex items-center gap-3"
                                style={{ backgroundColor: `${primaryColor}0D`, borderColor: `${primaryColor}1A` }}
                            >
                                <Scroll className="w-5 h-5" style={{ color: primaryColor }} />
                                <span className="font-bold text-white uppercase tracking-widest text-sm">Mission Cheat Sheet</span>
                            </div>
                            <div className="p-8">
                                <ul className="space-y-4">
                                    {content.cheatSheet.map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-4 text-slate-300">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }} />
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Boss Challenge Section */}
                {content.bossChallenge && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="mb-32 relative z-10"
                    >
                        <div className="absolute inset-0 bg-red-500/10 blur-3xl rounded-full" />
                        <div className="relative p-[1px] rounded-[2.5rem] bg-gradient-to-b from-red-500 to-orange-600 shadow-[0_0_100px_rgba(239,68,68,0.2)]">
                            <div className="bg-[#050505]/90 backdrop-blur-3xl rounded-[2.5rem] p-10 md:p-20 overflow-hidden relative">
                                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />
                                <div className="relative z-10 text-center">
                                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 font-black uppercase tracking-widest mb-8 animate-pulse">
                                        <Sword className="w-5 h-5" /> Boss Battle
                                    </div>
                                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8 uppercase italic tracking-tighter">
                                        {content.bossChallenge.title}
                                    </h2>
                                    <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                                        {content.bossChallenge.description}
                                    </p>
                                    {/* Boss Interaction */}
                                    <div className="max-w-xl mx-auto relative group/input">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl opacity-20 group-hover/input:opacity-40 blur transition-opacity duration-500" />
                                        <textarea
                                            placeholder="Enter solution protocol..."
                                            className="w-full bg-[#0a0a16]/80 border-2 border-red-500/30 rounded-2xl px-8 py-6 text-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-red-500 focus:bg-[#0a0a16] transition-all text-center font-mono relative z-10 shadow-[0_0_30px_rgba(239,68,68,0.1)] focus:shadow-[0_0_50px_rgba(239,68,68,0.2)] min-h-[150px] resize-none"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && e.ctrlKey) {
                                                    const val = (e.target as HTMLTextAreaElement).value;
                                                    // Normalize whitespace: replace newlines and multiple spaces with single space
                                                    const normalizedInput = val.replace(/\s+/g, ' ').trim().toLowerCase();
                                                    const normalizedAnswer = content.bossChallenge.answer.replace(/\s+/g, ' ').trim().toLowerCase();

                                                    if (normalizedInput.includes(normalizedAnswer)) {
                                                        handleComplete();
                                                    } else {
                                                        setFeedbacks(prev => ({ ...prev, 'boss': "Access Denied. Protocol Mismatch." }));
                                                        setBossAttempts(prev => prev + 1);
                                                    }
                                                }
                                            }}
                                        />
                                        <div className="absolute -bottom-8 left-0 right-0 text-xs text-red-500/60 uppercase tracking-[0.3em] font-bold opacity-0 group-focus-within/input:opacity-100 transition-all duration-500 transform translate-y-2 group-focus-within/input:translate-y-0">
                                            Press Ctrl + Enter to Execute
                                        </div>
                                    </div>
                                    {feedbacks['boss'] && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            className={cn(
                                                "flex items-center gap-4 text-lg font-bold px-8 py-5 rounded-2xl w-full justify-center shadow-2xl border backdrop-blur-md mt-8",
                                                feedbacks['boss'].includes("Correct") || feedbacks['boss'].includes("Granted")
                                                    ? "bg-green-500/10 text-green-400 border-green-500/30 shadow-green-500/10"
                                                    : "bg-red-500/10 text-red-400 border-red-500/30 shadow-red-500/10"
                                            )}
                                        >
                                            {feedbacks['boss'].includes("Correct") || feedbacks['boss'].includes("Granted") ? <Trophy className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                                            {feedbacks['boss']}
                                        </motion.div>
                                    )}

                                    {/* Progressive Hints */}
                                    {content.bossChallenge.hints && content.bossChallenge.hints.length > 0 && (
                                        <div className="mt-8">
                                            <div className="flex flex-col items-center gap-4">
                                                {hintIndex < content.bossChallenge.hints.length - 1 && (
                                                    <button
                                                        onClick={() => setHintIndex(prev => prev + 1)}
                                                        className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors flex items-center gap-2"
                                                    >
                                                        <Sparkles className="w-4 h-4" />
                                                        Need a Hint? ({content.bossChallenge.hints.length - 1 - hintIndex} remaining)
                                                    </button>
                                                )}

                                                <div className="space-y-4 w-full max-w-lg">
                                                    {content.bossChallenge.hints.slice(0, hintIndex + 1).map((hint: string, i: number) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-sm text-center"
                                                        >
                                                            <span className="font-bold mr-2">Hint {i + 1}:</span> {hint}
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Skip Button (After 3 fails) */}
                                    {bossAttempts >= 3 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="mt-8 text-center"
                                        >
                                            <button
                                                onClick={handleComplete}
                                                className="text-sm text-slate-500 hover:text-white underline decoration-dotted underline-offset-4 transition-colors"
                                            >
                                                Skip Mission (Protocol Override)
                                            </button>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Completion Button (Hidden if Boss Challenge exists, or shown as fallback) */}
                {!content.bossChallenge && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="mt-40 flex justify-center pb-20"
                    >
                        <Button
                            onClick={handleComplete}
                            className="group relative px-16 py-10 text-white rounded-full text-2xl font-black uppercase tracking-[0.2em] transition-all duration-500 hover:-translate-y-1 overflow-hidden"
                            style={{
                                backgroundColor: primaryColor,
                                boxShadow: `0 0 50px ${primaryColor} 66`
                            }}
                        >
                            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                            <span className="relative flex items-center gap-6 z-10">
                                Complete Mission <CheckCircle className="w-8 h-8" />
                            </span>
                        </Button>
                    </motion.div>
                )}

            </div>

            {/* Victory Overlay */}
            <AnimatePresence>
                {showVictory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-[#030014]/95 backdrop-blur-2xl flex items-center justify-center p-6"
                    >
                        <div className="text-center relative max-w-2xl w-full">
                            {/* Confetti Particles (Simulated) */}
                            {[...Array(30)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 1, x: 0, y: 0 }}
                                    animate={{
                                        opacity: 0,
                                        x: (Math.random() - 0.5) * 1200,
                                        y: (Math.random() - 0.5) * 1200,
                                        rotate: Math.random() * 720,
                                        scale: Math.random() * 2
                                    }}
                                    transition={{ duration: 2.5, ease: "easeOut" }}
                                    className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full blur-[1px]"
                                    style={{ backgroundColor: [primaryColor, secondaryColor, accentColor, '#fbbf24', '#34d399'][i % 5] }}
                                />
                            ))}

                            <motion.div
                                initial={{ scale: 0.5, opacity: 0, y: 50 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
                                className="border border-white/10 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden"
                                style={{ backgroundColor: backgroundColor }}
                            >
                                <div className="absolute inset-0 opacity-10"
                                    style={{ background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor}, ${accentColor})` }}
                                />
                                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]" />

                                <div className="relative z-10">
                                    <div className="w-40 h-40 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(251,191,36,0.4)] mb-10 animate-bounce">
                                        <Trophy className="w-20 h-20 text-white drop-shadow-md" />
                                    </div>
                                    <h2 className="text-6xl md:text-7xl font-black text-white mb-6 uppercase italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                                        Mission Complete!
                                    </h2>

                                    <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
                                        <Button
                                            onClick={() => router.back()}
                                            className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold backdrop-blur-md transition-all border border-white/5 hover:border-white/20"
                                        >
                                            Return to Base
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setShowVictory(false);
                                                // Calculate next lesson
                                                const stored = localStorage.getItem(`course-${slug}`);
                                                if (stored) {
                                                    const syllabus = JSON.parse(stored);
                                                    let nextModule = moduleIdx;
                                                    let nextLesson = lessonIdx + 1;
                                                    if (nextLesson >= syllabus.modules[moduleIdx].lessons.length) {
                                                        nextModule++;
                                                        nextLesson = 0;
                                                    }
                                                    if (nextModule < syllabus.modules.length) {
                                                        router.push(`/courses/${slug}/lesson/${nextModule}-${nextLesson}`);
                                                    } else {
                                                        router.push(`/courses/${slug}`); // Back to syllabus if done
                                                    }
                                                }
                                            }}
                                            className="px-10 py-5 text-white rounded-2xl font-bold transition-all hover:scale-105"
                                            style={{
                                                backgroundColor: primaryColor,
                                                boxShadow: `0 0 30px ${primaryColor} 4D`
                                            }}
                                        >
                                            Next Mission
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* AI Sensei Integration */}
            {content && (
                <AISensei
                    lessonContext={{
                        title: content.title,
                        sectionContent: content.sections[activeSection]?.content || ""
                    }}
                    codeContext={content.sections[activeSection]?.code || ""}
                    primaryColor={primaryColor}
                />
            )}

            {/* Adaptive Content Modal */}
            <AnimatePresence>
                {showAdaptiveModal && adaptiveContent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="max-w-2xl w-full bg-[#0a0a16] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-white/5 flex items-center justify-between"
                                style={{ backgroundColor: adaptiveContent.code ? `${secondaryColor} 1A` : `${primaryColor} 1A` }}
                            >
                                <div className="flex items-center gap-3">
                                    {adaptiveContent.code ? (
                                        <Sword className="w-6 h-6 text-orange-400" />
                                    ) : (
                                        <Sparkles className="w-6 h-6 text-cyan-400" />
                                    )}
                                    <h3 className="text-xl font-bold text-white tracking-wide">
                                        {adaptiveContent.title}
                                    </h3>
                                </div>
                                <Button
                                    variant="ghost"
                                    onClick={() => setShowAdaptiveModal(false)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    Close
                                </Button>
                            </div>

                            {/* Content */}
                            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="prose prose-invert prose-lg max-w-none">
                                    <ReactMarkdown>{adaptiveContent.markdown}</ReactMarkdown>
                                </div>

                                {adaptiveContent.code && (
                                    <div className="mt-6 bg-black/50 rounded-xl border border-white/10 overflow-hidden">
                                        <div className="px-4 py-2 bg-white/5 border-b border-white/5 text-xs font-mono text-slate-400">
                                            CHALLENGE CODE
                                        </div>
                                        <pre className="p-4 text-sm font-mono text-orange-300 overflow-x-auto">
                                            {adaptiveContent.code}
                                        </pre>
                                    </div>
                                )}

                                {adaptiveContent.hint && (
                                    <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm flex gap-3 items-start">
                                        <Zap className="w-5 h-5 shrink-0" />
                                        <span>Hint: {adaptiveContent.hint}</span>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-white/5 bg-white/[0.02] flex justify-end">
                                <Button
                                    onClick={() => setShowAdaptiveModal(false)}
                                    className="px-8 py-3 rounded-xl font-bold text-white transition-all hover:scale-105"
                                    style={{ backgroundColor: adaptiveContent.code ? secondaryColor : primaryColor }}
                                >
                                    {adaptiveContent.code ? "Accept Challenge" : "Got it, thanks!"}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Syllabus Evolving Modal */}
            <AnimatePresence>
                {isEvolving && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl"
                    >
                        <div className="text-center space-y-8">
                            <div className="relative w-32 h-32 mx-auto">
                                <div className="absolute inset-0 rounded-full border-t-4 border-indigo-500 animate-spin" />
                                <div className="absolute inset-2 rounded-full border-r-4 border-purple-500 animate-spin animation-delay-2000" />
                                <div className="absolute inset-4 rounded-full border-b-4 border-cyan-500 animate-spin animation-delay-4000" />
                                <Brain className="absolute inset-0 m-auto w-12 h-12 text-white animate-pulse" />
                            </div>
                            <div>
                                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-4">
                                    Syllabus Evolving
                                </h2>
                                <p className="text-slate-400 text-lg max-w-md mx-auto">
                                    Analyzing performance gap... <br />
                                    Rewriting future learning path...
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


        </div>
    );
}
