"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle, Play, Code, MessageSquare, Zap, Layout, Terminal, Brain, Trophy, Star, Sparkles, Shield, Sword, Scroll, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { MermaidRenderer } from "@/components/lesson/MermaidRenderer";
import ReactMarkdown from "react-markdown";

interface LessonContent {
    title: string;
    analogy: { story: string; connection: string };
    diagram: string;
    sections: any[];
    bossChallenge: any;
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
    const [content, setContent] = useState<LessonContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState(0);
    const [userCode, setUserCode] = useState("");
    const [feedback, setFeedback] = useState<string | null>(null);

    // Parse lesson ID (format: moduleIdx-lessonIdx)
    const lessonId = params.lessonId as string;
    const [moduleIdx, lessonIdx] = lessonId.split('-').map(Number);

    const [showVictory, setShowVictory] = useState(false);
    const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
    const [theme, setTheme] = useState<Theme | null>(null);

    useEffect(() => {
        const loadLesson = async () => {
            // Get syllabus from local storage to get titles
            const slug = params.slug as string;
            const stored = localStorage.getItem(`course-${slug}`);
            if (!stored) return;

            const syllabus = JSON.parse(stored);
            if (syllabus.theme) {
                setTheme(syllabus.theme);
            }
            const lessonTitle = syllabus.modules[moduleIdx].lessons[lessonIdx].title;
            const moduleTitle = syllabus.modules[moduleIdx].title;

            // Check cache first
            const cacheKey = `lesson-${slug}-${moduleIdx}-${lessonIdx}`;
            const cachedContent = localStorage.getItem(cacheKey);

            if (cachedContent) {
                setContent(JSON.parse(cachedContent));
                setLoading(false);
                return;
            }

            try {
                const res = await fetch('/api/courses/generate-lesson', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        topic: syllabus.title,
                        lessonTitle,
                        moduleTitle
                    })
                });
                const data = await res.json();
                setContent(data.content);
                // Save to cache
                localStorage.setItem(cacheKey, JSON.stringify(data.content));
            } catch (error) {
                console.error("Failed to load lesson:", error);
            } finally {
                setLoading(false);
            }
        };

        loadLesson();
    }, [params.slug, lessonId, moduleIdx, lessonIdx]);

    const handleInteraction = (answer: string, expected: string) => {
        if (answer.trim().toLowerCase() === expected.trim().toLowerCase()) {
            setFeedback("Correct! 🌟");
            setTimeout(() => {
                setFeedback(null);
                if (activeSection < (content?.sections.length || 0) - 1) {
                    setActiveSection(prev => prev + 1);
                }
            }, 1000);
        } else {
            setFeedback("Try again! 🤔");
        }
    };

    const handleComplete = () => {
        setShowVictory(true);
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-6">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="w-8 h-8 text-indigo-500 animate-pulse" />
                </div>
            </div>
            <p className="text-indigo-300 font-bold tracking-widest animate-pulse uppercase">Initializing Simulation...</p>
        </div>
    );
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
            `}</style>

            {/* Immersive Dynamic Background - Optimized with CSS */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 50%, ${backgroundColor}, #000000)` }} />
                <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full blur-[120px] animate-blob" style={{ backgroundColor: `${primaryColor}33` }} />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[100px] animate-blob animation-delay-2000" style={{ backgroundColor: `${secondaryColor}33` }} />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
            </div>

            {/* Gamified Header */}
            <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/5 shadow-2xl transition-all duration-300"
                style={{ backgroundColor: `${backgroundColor}CC`, boxShadow: `0 0 20px ${primaryColor}0D` }}
            >
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="group text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden sm:inline font-medium tracking-wide">Abort Mission</span>
                    </Button>

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
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-8 border backdrop-blur-sm"
                        style={{
                            backgroundColor: `${primaryColor}1A`,
                            color: primaryColor,
                            borderColor: `${primaryColor}33`,
                            boxShadow: `0 0 30px ${primaryColor}33`
                        }}
                    >
                        <Gamepad2 className="w-4 h-4" /> Mission Start
                    </motion.div>
                    <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text mb-8 tracking-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] leading-[1.1]"
                        style={{ backgroundImage: `linear-gradient(to bottom, white, ${primaryColor}33, ${primaryColor}80)` }}
                    >
                        {content.title}
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
                    <div className="absolute -inset-0.5 rounded-[2.5rem] opacity-30 group-hover:opacity-50 blur-xl transition duration-1000"
                        style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor}, ${accentColor})` }}
                    />
                    <div className="relative p-10 md:p-12 rounded-[2.2rem] border border-white/10 backdrop-blur-2xl overflow-hidden shadow-2xl"
                        style={{ backgroundColor: `${backgroundColor}E6` }}
                    >
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                            <Brain className="w-64 h-64 text-white" />
                        </div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3.5 rounded-2xl border shadow-[0_0_20px_rgba(0,0,0,0.1)]"
                                style={{ backgroundColor: `${primaryColor}1A`, color: primaryColor, borderColor: `${primaryColor}33` }}
                            >
                                <Scroll className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white uppercase tracking-widest">Mission Intel</h3>
                                <p className="text-xs font-mono tracking-widest mt-1" style={{ color: `${primaryColor}99` }}>CLASSIFIED // EYES ONLY</p>
                            </div>
                        </div>

                        <div className="prose prose-invert prose-lg max-w-none">
                            <p className="text-3xl text-slate-200 italic font-light leading-relaxed mb-8 relative z-10">
                                "{content.analogy.story}"
                            </p>
                            <div className="flex items-start gap-5 p-6 rounded-2xl border relative overflow-hidden"
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

                {/* Quest Steps (Sections) */}
                <div className="space-y-32">
                    {content.sections.map((section, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="relative"
                            onViewportEnter={() => setActiveSection(idx)}
                        >
                            {/* Connector Line */}
                            {idx !== content.sections.length - 1 && (
                                <div className="absolute left-[2.25rem] top-24 bottom-[-8rem] w-0.5 -z-10 md:left-[3.25rem]"
                                    style={{ background: `linear-gradient(to bottom, ${primaryColor}4D, ${primaryColor}1A, transparent)` }}
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
                                        } : {}}
                                    >
                                        {/* Hover Glow */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                                            style={{ background: `linear-gradient(to bottom right, ${primaryColor}0D, ${secondaryColor}0D, ${accentColor}0D)` }}
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

                                                        <div className="flex items-center gap-5 mb-10 relative">
                                                            <div className="p-4 rounded-2xl text-white shadow-lg"
                                                                style={{ backgroundColor: primaryColor, boxShadow: `0 0 20px ${primaryColor}4D` }}
                                                            >
                                                                <Sword className="w-8 h-8" />
                                                            </div>
                                                            <div>
                                                                <h4 className="text-2xl font-black text-white uppercase italic tracking-wider">Challenge Encounter</h4>
                                                            </div>
                                                        </div>

                                                        <p className="text-2xl text-slate-200 mb-10 font-medium leading-relaxed">{section.question}</p>

                                                        {section.interactionType === 'fill-in-blank' && (
                                                            <div className="space-y-10">
                                                                <div className="p-10 bg-[#05050a] rounded-3xl font-mono text-xl border border-slate-800/50 shadow-inner flex flex-wrap items-center gap-4 leading-loose relative overflow-hidden">
                                                                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
                                                                    {section.codeContext.split('______').map((part: string, i: number) => (
                                                                        <span key={i} className="text-slate-300 relative z-10">
                                                                            {part}
                                                                            {i === 0 && (
                                                                                <span className="relative inline-block mx-2 group/input">
                                                                                    <input
                                                                                        type="text"
                                                                                        className="border-b-2 text-white px-6 py-2 focus:outline-none transition-all w-48 text-center font-bold rounded-t-lg"
                                                                                        style={{
                                                                                            backgroundColor: `${primaryColor}1A`,
                                                                                            borderColor: primaryColor,
                                                                                            '--placeholder-color': `${primaryColor}4D`
                                                                                        } as any}
                                                                                        placeholder="???"
                                                                                        onKeyDown={(e) => {
                                                                                            if (e.key === 'Enter') {
                                                                                                handleInteraction((e.target as HTMLInputElement).value, section.answer);
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                    <div className="absolute -bottom-8 left-0 right-0 text-[10px] text-center uppercase tracking-[0.2em] font-bold opacity-0 group-focus-within/input:opacity-100 transition-opacity"
                                                                                        style={{ color: primaryColor }}
                                                                                    >Type & Enter</div>
                                                                                </span>
                                                                            )}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                                {feedback && (
                                                                    <motion.div
                                                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                        className={cn(
                                                                            "flex items-center gap-4 text-lg font-bold px-8 py-5 rounded-2xl w-full justify-center shadow-2xl border backdrop-blur-md",
                                                                            feedback.includes("Correct")
                                                                                ? "bg-green-500/10 text-green-400 border-green-500/30 shadow-green-500/10"
                                                                                : "bg-red-500/10 text-red-400 border-red-500/30 shadow-red-500/10"
                                                                        )}
                                                                    >
                                                                        {feedback.includes("Correct") ? <Trophy className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                                                                        {feedback}
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

                {/* Completion Button */}
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
                            boxShadow: `0 0 50px ${primaryColor}66`
                        }}
                    >
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                        <span className="relative flex items-center gap-6 z-10">
                            Complete Mission <CheckCircle className="w-8 h-8" />
                        </span>
                    </Button>
                </motion.div>
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
                                                // Logic for next lesson would go here
                                            }}
                                            className="px-10 py-5 text-white rounded-2xl font-bold transition-all hover:scale-105"
                                            style={{
                                                backgroundColor: primaryColor,
                                                boxShadow: `0 0 30px ${primaryColor}4D`
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
        </div>
    );
}
