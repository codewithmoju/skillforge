"use client";

import { useState, useEffect } from "react";
import { CourseGenerationHero } from "@/components/courses/CourseGenerationHero";
import { CourseGenerationLoader } from "@/components/courses/CourseGenerationLoader";
import { Sparkles, ArrowRight, Target, Play, Clock, Zap, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { recommendationService, Recommendation } from "@/lib/services/recommendations";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/hooks/useAuth";
import { collection, query, getDocs, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ActiveCourseCard } from "@/components/courses/ActiveCourseCard";
import { RecommendationCard } from "@/components/courses/RecommendationCard";
import { RecommendationSkeleton } from "@/components/courses/RecommendationSkeleton";
import { AuroraBackground } from "@/components/ui/AuroraBackground";

export default function CoursesPage() {
    const { user } = useAuth();
    const [isGenerating, setIsGenerating] = useState(false);
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [activeCourses, setActiveCourses] = useState<any[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [loadingRecs, setLoadingRecs] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadRecs = async () => {
            // Simulate loading for effect
            await new Promise(resolve => setTimeout(resolve, 1000));
            const recs = await recommendationService.getRecommendations();
            setRecommendations(recs);
            setLoadingRecs(false);
        };
        loadRecs();
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Fetch recent courses from Firestore
                const q = query(collection(db, "courses"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);

                const courses = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    const storedProgress = localStorage.getItem(`progress-${doc.id}`);
                    const completedLessons = storedProgress ? JSON.parse(storedProgress).length : 0;

                    let totalLessons = 0;
                    if (data.syllabus && data.syllabus.modules) {
                        data.syllabus.modules.forEach((m: any) => {
                            totalLessons += m.lessons.length;
                        });
                    }

                    return {
                        id: doc.id,
                        ...data,
                        title: data.topic,
                        progress: {
                            completedLessons,
                            totalLessons: totalLessons || 1
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

    const handleGenerate = async (topic: string, answers?: any[], difficulty?: any, persona?: any) => {
        setIsGenerating(true);
        try {
            const res = await fetch('/api/courses/generate-syllabus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic,
                    answers,
                    difficulty,
                    persona,
                    level: difficulty?.level || 'beginner'
                })
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

    const handleDelete = async (e: React.MouseEvent, courseId: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
            return;
        }

        try {
            await deleteDoc(doc(db, "courses", courseId));
            setActiveCourses(prev => prev.filter(course => course.id !== courseId));
        } catch (error) {
            console.error("Failed to delete course:", error);
            alert("Failed to delete course. Please try again.");
        }
    };

    return (
        <AuroraBackground className="min-h-screen bg-slate-950 text-white selection:bg-violet-500/30 relative overflow-hidden !items-start !justify-start">
            <AnimatePresence>
                {isGenerating && <CourseGenerationLoader />}
            </AnimatePresence>

            <div className="w-full">
                <CourseGenerationHero
                    onGenerate={handleGenerate}
                    isGenerating={isGenerating}
                />

                <div className="max-w-7xl mx-auto px-6 pb-32 relative z-10 space-y-32 -mt-20">

                    {/* Resume Learning Section */}
                    {user && activeCourses.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex items-center justify-between mb-12">
                                <div className="flex items-center gap-6">
                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-xl">
                                        <Play className="w-8 h-8 text-cyan-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-2 drop-shadow-lg">Active Missions</h2>
                                        <p className="text-slate-400 text-xl font-light">Resume your training protocols</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {activeCourses.map((course, idx) => (
                                    <ActiveCourseCard
                                        key={course.id}
                                        course={course}
                                        onDelete={handleDelete}
                                        index={idx}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Recommended Paths Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-6">
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.15)] backdrop-blur-xl">
                                    <Sparkles className="w-8 h-8 text-purple-400" />
                                </div>
                                <div>
                                    <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-2 drop-shadow-lg">Neural Upgrades</h2>
                                    <p className="text-slate-400 text-xl font-light">Recommended paths for system enhancement</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {loadingRecs ? (
                                // Skeleton Loading State
                                Array.from({ length: 3 }).map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="h-[280px]"
                                    >
                                        <RecommendationSkeleton />
                                    </motion.div>
                                ))
                            ) : (
                                recommendations.map((rec, idx) => (
                                    <RecommendationCard
                                        key={idx}
                                        rec={rec}
                                        onClick={() => handleGenerate(rec.topic)}
                                        index={idx}
                                    />
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </AuroraBackground>
    );
}
