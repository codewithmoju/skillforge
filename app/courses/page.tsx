"use client";

import { useState, useEffect } from "react";
import { CourseLandingHero } from "@/components/courses/CourseLandingHero";
import { CourseGenerationLoader } from "@/components/courses/CourseGenerationLoader";
import { Sparkles, ArrowRight, Target, Play, Clock, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { recommendationService, Recommendation } from "@/lib/services/recommendations";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/hooks/useAuth";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TiltCard } from "@/components/ui/TiltCard";
import { InteractiveBackground } from "@/components/ui/InteractiveBackground";

export default function CoursesPage() {
    const { user } = useAuth();
    const [isGenerating, setIsGenerating] = useState(false);
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [activeCourses, setActiveCourses] = useState<any[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadRecs = async () => {
            const recs = await recommendationService.getRecommendations();
            setRecommendations(recs);
        };
        loadRecs();
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Fetch recent courses from Firestore
                // Note: In a real app, we would filter by user.uid
                const q = query(collection(db, "courses"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);

                const courses = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    // Try to get progress from localStorage
                    const storedProgress = localStorage.getItem(`progress-${doc.id}`);
                    const completedLessons = storedProgress ? JSON.parse(storedProgress).length : 0;

                    // Calculate total lessons
                    let totalLessons = 0;
                    if (data.syllabus && data.syllabus.modules) {
                        data.syllabus.modules.forEach((m: any) => {
                            totalLessons += m.lessons.length;
                        });
                    }

                    return {
                        id: doc.id,
                        ...data,
                        title: data.topic, // Ensure title exists
                        progress: {
                            completedLessons,
                            totalLessons: totalLessons || 1 // Avoid division by zero
                        }
                    };
                });
                setActiveCourses(courses);
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            } finally {
                setLoadingCourses(false);
            }
        };
        fetchCourses();
    }, [user]);

    const handleGenerate = async (topic: string) => {
        setIsGenerating(true);
        try {
            const res = await fetch('/api/courses/generate-syllabus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, level: 'beginner' })
            });
            const data = await res.json();
            if (data.syllabus && data.courseId) {
                await new Promise(resolve => setTimeout(resolve, 1500));
                router.push(`/courses/${data.courseId}`);
            }
        } catch (error) {
            console.error("Failed to generate:", error);
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-accent-indigo/30 relative overflow-hidden">
            {/* Interactive Background */}
            <InteractiveBackground />

            {/* Global Background Effects (Static fallback/overlay) */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            <AnimatePresence>
                {isGenerating && <CourseGenerationLoader />}
            </AnimatePresence>

            <CourseLandingHero
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
            />

            <div className="max-w-7xl mx-auto px-6 pb-32 relative z-10 space-y-24">

                {/* Resume Learning Section */}
                {user && activeCourses.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-accent-indigo/20 to-accent-cyan/20 border border-accent-indigo/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                                    <Play className="w-6 h-6 text-accent-cyan" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-white tracking-tight">Resume Learning</h2>
                                    <p className="text-slate-400 text-sm mt-1">Pick up where you left off</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {activeCourses.map((course, idx) => {
                                const progressPercent = course.progress?.totalLessons
                                    ? Math.round((course.progress.completedLessons / course.progress.totalLessons) * 100)
                                    : 0;

                                return (
                                    <Link href={`/courses/${course.id}`} key={course.id}>
                                        <TiltCard
                                            containerClassName="h-full"
                                            className="group relative p-[1px] rounded-3xl overflow-hidden cursor-pointer h-full"
                                        >
                                            {/* Animated Gradient Border */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-accent-indigo via-accent-cyan to-accent-indigo opacity-50 group-hover:opacity-100 transition-opacity duration-500 animate-gradient" />

                                            <div className="relative h-full bg-slate-900/80 backdrop-blur-xl rounded-[23px] p-6 overflow-hidden flex flex-col border border-white/5">
                                                {/* Inner Glow */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-accent-indigo/10 via-transparent to-accent-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                                <div className="relative z-10 flex flex-col h-full">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-950/50 border border-slate-700 text-accent-cyan shadow-sm backdrop-blur-md">
                                                            <Clock className="w-3 h-3" />
                                                            In Progress
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-2xl font-bold text-white">{progressPercent}%</span>
                                                        </div>
                                                    </div>

                                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent-cyan transition-colors line-clamp-2">
                                                        {course.title || course.topic}
                                                    </h3>

                                                    <div className="mt-auto pt-4">
                                                        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden mb-4 border border-slate-800">
                                                            <motion.div
                                                                className="h-full bg-gradient-to-r from-accent-indigo to-accent-cyan shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${progressPercent}%` }}
                                                                transition={{ duration: 1, delay: 0.8 }}
                                                            />
                                                        </div>

                                                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 group-hover:text-white transition-colors">
                                                            Continue Learning
                                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-accent-cyan" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </TiltCard>
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* Recommended Paths Section */}
                {recommendations.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-blue-500/20 border border-accent-cyan/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                                    <Sparkles className="w-6 h-6 text-accent-cyan" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-white tracking-tight">Recommended Paths</h2>
                                    <p className="text-slate-400 text-sm mt-1">Curated just for you</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {recommendations.map((rec, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.6 + (idx * 0.1) }}
                                    onClick={() => handleGenerate(rec.topic)}
                                    className="h-full"
                                >
                                    <TiltCard className="group relative p-[1px] rounded-3xl overflow-hidden cursor-pointer h-full">
                                        {/* Animated Gradient Border */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan via-blue-500 to-accent-cyan opacity-30 group-hover:opacity-80 transition-opacity duration-500 animate-gradient" />

                                        <div className="relative h-full bg-slate-900/80 backdrop-blur-xl rounded-[23px] p-6 overflow-hidden flex flex-col border border-white/5">
                                            <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                            <div className="relative z-10 flex flex-col h-full">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-950/50 border border-slate-700 text-slate-300 group-hover:border-accent-cyan/30 group-hover:text-accent-cyan transition-colors backdrop-blur-md">
                                                        <Target className="w-3 h-3" />
                                                        {rec.difficulty}
                                                    </div>
                                                    <div className="p-2 rounded-full bg-slate-950/50 border border-slate-700 group-hover:bg-accent-cyan/20 group-hover:border-accent-cyan/30 transition-colors backdrop-blur-md">
                                                        <Zap className="w-4 h-4 text-slate-500 group-hover:text-accent-cyan transition-colors" />
                                                    </div>
                                                </div>

                                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent-cyan transition-colors">
                                                    {rec.topic}
                                                </h3>

                                                <p className="text-slate-400 text-sm mb-8 line-clamp-2 leading-relaxed group-hover:text-slate-300 transition-colors flex-grow">
                                                    {rec.reason}
                                                </p>

                                                <div className="flex items-center gap-2 text-sm font-bold text-slate-500 group-hover:text-white transition-colors mt-auto">
                                                    Start Path
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-accent-cyan" />
                                                </div>
                                            </div>
                                        </div>
                                    </TiltCard>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
