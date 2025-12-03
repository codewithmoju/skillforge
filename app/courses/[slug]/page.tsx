"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { ArrowLeft, BookOpen, CheckCircle, Circle, Play, Lock, Zap, Layers, Trophy, Star, Sparkles, Shield, Sword, Scroll, Gamepad2, Rocket, Brain, Code, Terminal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useScrambleText } from "@/lib/hooks/useScrambleText";
import { useAuth } from "@/lib/hooks/useAuth";

// Types matching the API response
interface Lesson {
    title: string;
    description: string;
    objectives?: { name: string }[];
}

interface Module {
    title: string;
    description: string;
    lessons: Lesson[];
}

interface Theme {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
}

interface Syllabus {
    title: string;
    description: string;
    modules: Module[];
    theme?: Theme;
}

function LessonCard({ lesson, index, isLeft, onClick, theme, isCompleted }: { lesson: Lesson, index: number, isLeft: boolean, onClick: () => void, theme?: Theme, isCompleted: boolean }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const primaryColor = theme?.primary || "#4f46e5";
    const secondaryColor = theme?.secondary || "#a855f7";
    const accentColor = theme?.accent || "#6366f1";
    const backgroundColor = theme?.background || "#0a0a16";

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: isLeft ? -50 : 50, rotateY: isLeft ? -15 : 15 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.3, delay: Math.min(index * 0.05, 0.3) }}
            className={cn(
                "relative flex items-center md:absolute md:w-1/2 perspective-1000",
                isLeft ? "md:left-0 md:justify-end md:pr-16" : "md:right-0 md:justify-start md:pl-16",
                "md:top-0"
            )}
            style={{ top: typeof window !== 'undefined' && window.innerWidth >= 768 ? `${(index + 1) * 250 - 125}px` : 'auto' }}
        >
            {/* Mobile Connector */}
            <div
                className="absolute left-8 w-8 h-1 md:hidden"
                style={{ backgroundColor: isCompleted ? '#22c55e' : `${primaryColor}4D` }}
            />

            {/* Holographic Tilt Card */}
            <motion.button
                onClick={onClick}
                onMouseMove={handleMouseMove}
                whileHover={{ scale: 1.05, rotateZ: isLeft ? -2 : 2 }}
                className={cn(
                    "group relative z-10 flex items-center gap-6 p-[2px] rounded-[2.5rem] transition-all duration-500 w-full md:max-w-lg text-left ml-16 md:ml-0 overflow-hidden",
                    isLeft ? "md:flex-row-reverse md:text-right" : ""
                )}
                style={{
                    background: isCompleted
                        ? `linear-gradient(135deg, #22c55e, transparent, #22c55e)`
                        : `linear-gradient(135deg, ${primaryColor}, transparent, ${secondaryColor})`
                }}
            >
                {/* Iridescent Hover Border */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-[2px] rounded-[2.5rem]"
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

                {/* Glass Content */}
                <div className={cn(
                    "relative flex flex-col md:flex-row items-center gap-6 p-6 md:p-8 rounded-[2.4rem] w-full h-full backdrop-blur-2xl transition-all duration-500",
                    isLeft ? "md:flex-row-reverse" : ""
                )}
                    style={{
                        backgroundColor: `${backgroundColor}CC`, // Higher opacity for glass depth
                        boxShadow: isCompleted
                            ? `0 0 40px -10px #22c55e4D, inset 0 0 20px #22c55e1A`
                            : `0 0 40px -10px ${primaryColor}4D, inset 0 0 20px ${primaryColor}1A`
                    }}
                >
                    {/* Noise Texture */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.svg')]" />

                    {/* Spotlight Effect */}
                    <motion.div
                        className="pointer-events-none absolute -inset-px rounded-[2.4rem] opacity-0 transition duration-300 group-hover:opacity-100 mix-blend-overlay"
                        style={{
                            background: useMotionTemplate`
                                radial-gradient(
                                    400px circle at ${mouseX}px ${mouseY}px,
                                    rgba(255,255,255,0.4),
                                    transparent 80%
                                )
                            `,
                        }}
                    />

                    {/* Number Badge with Holographic Glow */}
                    <div
                        className={cn(
                            "absolute w-16 h-16 rounded-full bg-slate-900/80 border flex items-center justify-center font-black text-2xl transition-all duration-500 z-20 backdrop-blur-md",
                            "left-[-4rem] md:static md:shrink-0",
                            isLeft ? "md:-mr-8" : "md:-ml-8"
                        )}
                        style={{
                            borderColor: isCompleted ? '#22c55e' : primaryColor,
                            color: isCompleted ? '#22c55e' : 'white',
                            boxShadow: isCompleted ? '0 0 30px #22c55e66' : `0 0 30px ${primaryColor}66`,
                            textShadow: `0 0 10px ${isCompleted ? '#22c55e' : primaryColor}`
                        }}
                    >
                        {isCompleted ? <CheckCircle className="w-8 h-8" /> : index + 1}
                    </div>

                    <div className="flex-1 min-w-0 z-10 w-full">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-transparent transition-all duration-300"
                            style={{
                                backgroundImage: `linear-gradient(to right, ${isCompleted ? '#22c55e' : 'white'}, ${isCompleted ? '#86efac' : secondaryColor})`,
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text'
                            }}
                        >
                            {lesson.title}
                        </h3>
                        <p className="text-sm text-slate-300 font-light line-clamp-2 group-hover:text-white transition-colors mb-3">{lesson.description}</p>

                        {/* Objectives / Sub-lessons */}
                        {lesson.objectives && lesson.objectives.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {lesson.objectives.slice(0, 3).map((obj, i) => (
                                    <span key={i} className="text-[10px] px-2 py-1 rounded-md bg-white/5 border border-white/5 text-slate-400 font-mono uppercase tracking-wide">
                                        {obj.name}
                                    </span>
                                ))}
                                {lesson.objectives.length > 3 && (
                                    <span className="text-[10px] px-2 py-1 rounded-md bg-white/5 border border-white/5 text-slate-500 font-mono">
                                        +{lesson.objectives.length - 3}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={cn(
                        "opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-50 group-hover:scale-100 absolute md:static top-4 right-4",
                        isLeft ? "md:mr-auto" : "md:ml-auto"
                    )}
                        style={{ color: isCompleted ? '#22c55e' : accentColor }}
                    >
                        <div className="p-3 rounded-full border bg-white/5 backdrop-blur-md"
                            style={{ borderColor: isCompleted ? '#22c55e' : accentColor, boxShadow: `0 0 20px ${isCompleted ? '#22c55e' : accentColor}4D` }}>
                            {isCompleted ? <Trophy className="w-6 h-6 fill-current" /> : <Rocket className="w-6 h-6 fill-current" />}
                        </div>
                    </div>
                </div>
            </motion.button >
        </motion.div >
    );
}

function SubLessonNode({ title, index, parentIndex, isLeft, isCompleted, isLast }: { title: string, index: number, parentIndex: number, isLeft: boolean, isCompleted: boolean, isLast: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + (index * 0.1) }}
            className={cn(
                "relative flex items-center gap-4 py-2",
                isLeft ? "flex-row-reverse text-right pr-8" : "flex-row pl-8"
            )}
        >
            {/* Vertical Connector Line */}
            <div className={cn(
                "absolute top-0 w-0.5 bg-slate-800",
                isLeft ? "right-[1.9rem]" : "left-[1.9rem]",
                isLast ? "h-1/2" : "h-full"
            )} />

            {/* Horizontal Connector */}
            <div className={cn(
                "absolute top-1/2 w-4 h-0.5 bg-slate-800",
                isLeft ? "right-[1.9rem]" : "left-[1.9rem]"
            )} />

            {/* Node Dot */}
            <div className={cn(
                "w-3 h-3 rounded-full border-2 z-10 shrink-0",
                isCompleted ? "bg-emerald-500 border-emerald-500" : "bg-slate-950 border-slate-700"
            )} />

            <div className={cn(
                "flex-1 p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors cursor-default backdrop-blur-sm",
                isCompleted && "border-emerald-500/30 bg-emerald-500/5"
            )}>
                <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                        "text-[10px] font-mono opacity-50",
                        isLeft ? "ml-auto" : ""
                    )}>
                        {parentIndex + 1}.{index + 1}
                    </span>
                </div>
                <div className="text-sm font-medium text-slate-300">{title}</div>
            </div>
        </motion.div>
    );
}

export default function CourseSyllabusPage() {
    const params = useParams();
    const router = useRouter();
    const [syllabus, setSyllabus] = useState<Syllabus | null>(null);
    const [loading, setLoading] = useState(true);
    const [completedLessons, setCompletedLessons] = useState<string[]>([]);

    // Always call hooks at the top level
    const scrambledTitle = useScrambleText(syllabus?.title || "", !loading && !!syllabus);

    const { user } = useAuth(); // Add useAuth hook

    useEffect(() => {
        const loadCourse = async () => {
            const slug = params.slug as string;
            const stored = localStorage.getItem(`course-${slug}`);
            if (stored) {
                setSyllabus(JSON.parse(stored));
                setLoading(false);
            } else {
                // Fetch from Firestore
                try {
                    const docRef = doc(db, "courses", slug);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setSyllabus(data.syllabus);
                        // Cache it
                        localStorage.setItem(`course-${slug}`, JSON.stringify(data.syllabus));
                    } else {
                        console.error("No such course!");
                    }
                } catch (error) {
                    console.error("Error fetching course:", error);
                } finally {
                    setLoading(false);
                }
            }

            // Load progress
            if (user) {
                try {
                    const { getUserProgress } = await import("@/lib/services/userProgress");
                    const progress = await getUserProgress(user.uid);
                    if (progress && progress.courses && progress.courses[slug]) {
                        setCompletedLessons(progress.courses[slug].completedLessons || []);
                    }
                } catch (error) {
                    console.error("Failed to load progress from Firestore", error);
                }
            } else {
                // Fallback to localStorage for non-authenticated users (or if offline)
                const progress = localStorage.getItem(`progress-${slug}`);
                if (progress) {
                    setCompletedLessons(JSON.parse(progress));
                }
            }
        };

        loadCourse();
    }, [params.slug, user]);

    if (loading) return (
        <div className="min-h-screen bg-[#030014] flex flex-col items-center justify-center text-white space-y-6">
            <div className="relative">
                <div className="w-24 h-24 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="w-10 h-10 text-indigo-500 animate-pulse" />
                </div>
            </div>
            <p className="text-indigo-300 font-bold tracking-[0.3em] animate-pulse uppercase text-sm">Decrypting Syllabus...</p>
        </div>
    );

    if (!syllabus) return (
        <div className="min-h-screen bg-[#030014] flex items-center justify-center text-white">
            <div className="text-center space-y-4">
                <Lock className="w-16 h-16 text-slate-700 mx-auto" />
                <h2 className="text-2xl font-bold text-slate-500">Access Denied</h2>
                <p className="text-slate-600">Course data not found in local memory.</p>
                <Button onClick={() => router.push('/courses')} variant="outline">Return to Hub</Button>
            </div>
        </div>
    );

    const primaryColor = syllabus.theme?.primary || "#4f46e5";
    const secondaryColor = syllabus.theme?.secondary || "#a855f7";
    const accentColor = syllabus.theme?.accent || "#6366f1";
    const backgroundColor = syllabus.theme?.background || "#030014";

    return (
        <div className="min-h-screen text-white overflow-x-hidden font-sans custom-scrollbar" style={{ backgroundColor }}>
            <style jsx global>{`
                ::selection { background: ${primaryColor}4D; color: white; }
                .custom-scrollbar::-webkit-scrollbar { width: 10px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: ${backgroundColor}; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: ${primaryColor}; border-radius: 5px; border: 2px solid ${backgroundColor}; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${accentColor}; }
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob { animation: blob 10s infinite; }
                .animation-delay-2000 { animation-delay: 2s; }
                .perspective-1000 { perspective: 1000px; }
                
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

                {/* Floating Particles */}
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-white"
                        style={{
                            boxShadow: `0 0 10px ${i % 2 === 0 ? primaryColor : secondaryColor}`,
                            opacity: Math.random() * 0.5 + 0.2
                        }}
                        initial={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            scale: Math.random()
                        }}
                        animate={{
                            y: [0, Math.random() * -100],
                            opacity: [0, 0.8, 0]
                        }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 5
                        }}
                    />
                ))}
            </div>

            {/* Header */}
            <div className="relative z-10 pt-12 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/courses')}
                        className="group mb-12 text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/10 rounded-full px-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium tracking-wide text-xs uppercase">Abort to Hub</span>
                    </Button>

                    <div className="flex flex-col lg:flex-row gap-12 lg:items-end justify-between">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="max-w-3xl"
                        >
                            <motion.div
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border backdrop-blur-md"
                                style={{
                                    backgroundColor: `${primaryColor}1A`,
                                    color: primaryColor,
                                    borderColor: `${primaryColor}33`,
                                    boxShadow: `0 0 20px ${primaryColor}26`
                                }}
                            >
                                <Rocket className="w-3 h-3" /> Classified Curriculum
                            </motion.div>
                            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text mb-6 tracking-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] leading-[1.1]"
                                style={{ backgroundImage: `linear-gradient(to right, white, ${primaryColor}33, ${primaryColor}80)` }}
                            >
                                {scrambledTitle}
                            </h1>
                            <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-light max-w-2xl border-l-2 pl-6"
                                style={{ borderColor: `${primaryColor}4D` }}
                            >
                                {syllabus.description}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="flex gap-4"
                        >
                            <div className="p-6 rounded-3xl bg-[#0a0a16]/50 border border-white/5 backdrop-blur-xl text-center min-w-[140px] group transition-colors hover:border-opacity-50"
                                style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                            >
                                <div className="text-3xl font-black text-white mb-1 transition-colors group-hover:text-[var(--hover-color)]" style={{ '--hover-color': primaryColor } as any}>
                                    {syllabus.modules.length}
                                </div>
                                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Sectors</div>
                            </div>
                            <div className="p-6 rounded-3xl bg-[#0a0a16]/50 border border-white/5 backdrop-blur-xl text-center min-w-[140px] group transition-colors hover:border-opacity-50"
                                style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                            >
                                <div className="text-3xl font-black text-white mb-1 transition-colors group-hover:text-[var(--hover-color)]" style={{ '--hover-color': secondaryColor } as any}>
                                    {syllabus.modules.reduce((acc, m) => acc + m.lessons.length, 0)}
                                </div>
                                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Missions</div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Modules Grid with Curved Path */}
            <div className="relative z-10 px-6 pb-32">
                <div className="max-w-5xl mx-auto space-y-40">
                    {syllabus.modules.map((module, moduleIdx) => (
                        <div key={moduleIdx} className="relative">
                            {/* Module Header */}
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                className="mb-24 text-center relative z-10"
                            >
                                <div
                                    className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] shadow-[0_0_60px_rgba(79,70,229,0.5)] mb-8 transform rotate-3 hover:rotate-6 transition-transform duration-500 border-4 border-[#030014]"
                                    style={{
                                        background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})`,
                                        boxShadow: `0 0 60px ${primaryColor}66`
                                    }}
                                >
                                    <span className="text-4xl font-black text-white">{moduleIdx + 1}</span>
                                </div>
                                <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-2xl">{module.title}</h2>
                                <p className="text-slate-400 max-w-2xl mx-auto text-xl font-light">{module.description}</p>
                            </motion.div>

                            {/* Curved Path Lessons */}
                            <div className="relative">
                                {/* SVG Path Background */}
                                <div className="absolute inset-0 pointer-events-none hidden md:block -top-20 -bottom-20">
                                    <svg className="w-full h-full overflow-visible">
                                        <defs>
                                            <linearGradient id={`pathGradient-${moduleIdx}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor={primaryColor} stopOpacity="0" />
                                                <stop offset="10%" stopColor={accentColor} stopOpacity="0.8" />
                                                <stop offset="90%" stopColor={secondaryColor} stopOpacity="0.8" />
                                                <stop offset="100%" stopColor={secondaryColor} stopOpacity="0" />
                                            </linearGradient>
                                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                                <feMerge>
                                                    <feMergeNode in="coloredBlur" />
                                                    <feMergeNode in="SourceGraphic" />
                                                </feMerge>
                                            </filter>
                                        </defs>

                                        {/* Dynamic Path Calculation */}
                                        {(() => {
                                            let currentY = 0;
                                            const positions = module.lessons.map(l => {
                                                const pos = currentY;
                                                // Base height 250 + extra for subtopics
                                                const subHeight = (l.objectives?.length || 0) * 80;
                                                currentY += 280 + subHeight;
                                                return pos;
                                            });

                                            // Generate Path Command
                                            const pathD = `M ${50}% 0 
                                                ${module.lessons.map((_, i) => {
                                                const y = positions[i] + 125; // Center of the card roughly
                                                const nextY = (positions[i + 1] || currentY) + 125;

                                                const x = i % 2 === 0 ? 20 : 80;
                                                const prevX = i === 0 ? 50 : (i - 1) % 2 === 0 ? 20 : 80;
                                                const prevY = i === 0 ? 0 : positions[i - 1] + 125;

                                                // Curve logic needs to adapt to variable distances
                                                // Simple cubic bezier from prev to current
                                                if (i === 0) return `C 50% ${y / 2}, ${x}% ${y / 2}, ${x}% ${y}`;

                                                return `C ${prevX}% ${prevY + (y - prevY) / 2}, ${x}% ${prevY + (y - prevY) / 2}, ${x}% ${y}`;
                                            }).join(' ')}
                                            `;

                                            return (
                                                <>
                                                    <path
                                                        d={pathD}
                                                        fill="none"
                                                        stroke="#1e1b4b"
                                                        strokeWidth="6"
                                                        strokeLinecap="round"
                                                    />
                                                    <motion.path
                                                        d={pathD}
                                                        fill="none"
                                                        stroke={`url(#pathGradient-${moduleIdx})`}
                                                        strokeWidth="6"
                                                        strokeLinecap="round"
                                                        filter="url(#glow)"
                                                        initial={{ pathLength: 0, strokeDasharray: "10 10", strokeDashoffset: 0 }}
                                                        whileInView={{
                                                            pathLength: 1,
                                                            strokeDashoffset: -100
                                                        }}
                                                        viewport={{ once: true, margin: "-20%" }}
                                                        transition={{
                                                            pathLength: { duration: 1.5, ease: "easeInOut" },
                                                            strokeDashoffset: { duration: 2, repeat: Infinity, ease: "linear" }
                                                        }}
                                                    />
                                                </>
                                            );
                                        })()}
                                    </svg>
                                </div>

                                {/* Vertical Line for Mobile */}
                                <div
                                    className="absolute left-8 top-0 bottom-0 w-1 md:hidden"
                                    style={{ background: `linear-gradient(to bottom, transparent, ${primaryColor}4D, transparent)` }}
                                />

                                <div className="space-y-12 md:space-y-0 md:relative md:h-[calc(100%_+_100px)]">
                                    {module.lessons.map((lesson, lessonIdx) => (
                                        <LessonCard
                                            key={lessonIdx}
                                            lesson={lesson}
                                            index={lessonIdx}
                                            isLeft={lessonIdx % 2 === 0}
                                            onClick={() => router.push(`/courses/${params.slug}/lesson/${moduleIdx}-${lessonIdx}`)}
                                            theme={syllabus.theme}
                                            isCompleted={completedLessons.includes(`${moduleIdx}-${lessonIdx}`)}
                                        />
                                    ))}
                                    {/* Spacer */}
                                    <div className="hidden md:block" style={{ height: `${(module.lessons.length + 1) * 250}px` }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Certificate Teaser */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto mt-32 relative"
                >
                    <div className="absolute inset-0 blur-3xl opacity-30"
                        style={{ background: `linear-gradient(to right, ${primaryColor}33, ${secondaryColor}33, ${accentColor}33)` }}
                    />
                    <div className="relative p-1 rounded-[2.5rem]"
                        style={{ background: `linear-gradient(to right, ${primaryColor}4D, ${secondaryColor}4D, ${accentColor}4D)` }}
                    >
                        <div className="bg-[#0a0a16] rounded-[2.4rem] p-12 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10" />
                            <div className="relative z-10">
                                <Trophy className="w-20 h-20 mx-auto mb-8 animate-bounce"
                                    style={{ color: primaryColor, filter: `drop-shadow(0 0 30px ${primaryColor}80)` }}
                                />
                                <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-tight">Mastery Awaits</h3>
                                <p className="text-slate-400 max-w-lg mx-auto mb-10 text-xl font-light">
                                    Complete all missions to unlock your verified holographic certificate and elite status.
                                </p>
                                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 text-sm font-mono uppercase tracking-widest hover:bg-slate-800 transition-colors cursor-not-allowed">
                                    <Lock className="w-4 h-4" /> Certificate Locked
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
