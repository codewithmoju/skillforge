"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Clock, Users, Star, Play, BookOpen, Award, Lock } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Course } from "@/lib/types/courseTypes";
import Link from "next/link";
import Image from "next/image";

interface CourseCard3DProps {
    course: Course;
    index: number;
}

/**
 * Revolutionary 3D Course Card
 * Features: 3D tilt effect, holographic border, hover expansion
 * Performance optimized with transform-gpu and will-change
 */
export function CourseCard3D({ course, index }: CourseCard3DProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    // Mouse position tracking with spring physics
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring animations for natural movement
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
        stiffness: 300,
        damping: 30,
    });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
        stiffness: 300,
        damping: 30,
    });

    // Handle mouse movement for 3D tilt effect
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const mouseXPos = (e.clientX - centerX) / (rect.width / 2);
        const mouseYPos = (e.clientY - centerY) / (rect.height / 2);

        mouseX.set(mouseXPos);
        mouseY.set(mouseYPos);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        mouseX.set(0);
        mouseY.set(0);
    };

    // Format duration
    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        return `${hours}h ${minutes % 60}m`;
    };

    // Get difficulty color
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return 'text-green-400 bg-green-500/20 border-green-500/30';
            case 'intermediate': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
            case 'advanced': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
            case 'expert': return 'text-red-400 bg-red-500/20 border-red-500/30';
            default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
        }
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className="group relative will-change-transform"
        >
            {/* Holographic Glow Effect */}
            <motion.div
                className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                style={{
                    background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)",
                    backgroundSize: "200% 100%",
                }}
                animate={{
                    backgroundPosition: isHovering ? ["0% 0%", "200% 0%"] : "0% 0%",
                }}
                transition={{
                    duration: 3,
                    repeat: isHovering ? Infinity : 0,
                    ease: "linear",
                }}
            />

            {/* Main Card */}
            <Link href={`/courses/${course.slug}`}>
                <motion.div
                    className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-800 group-hover:border-blue-500/50 overflow-hidden transition-all duration-500 transform-gpu"
                    style={{
                        transform: "translateZ(20px)",
                    }}
                    whileHover={{ scale: 1.02 }}
                >
                    {/* Thumbnail */}
                    <div className="relative h-48 overflow-hidden">
                        <Image
                            src={course.thumbnailUrl}
                            alt={course.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-60" />

                        {/* Premium Badge */}
                        {course.isPremium && (
                            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/50 flex items-center gap-1">
                                <Award className="w-3 h-3 text-yellow-400" />
                                <span className="text-xs font-bold text-yellow-400">Premium</span>
                            </div>
                        )}

                        {/* Play Button Overlay */}
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ transform: "translateZ(40px)" }}
                        >
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="w-16 h-16 rounded-full bg-blue-600/90 backdrop-blur-sm flex items-center justify-center cursor-pointer shadow-lg shadow-blue-500/50"
                            >
                                <Play className="w-8 h-8 text-white ml-1" fill="white" />
                            </motion.div>
                        </motion.div>

                        {/* difficulty Badge */}
                        <div className={cn(
                            "absolute bottom-4 left-4 px-3 py-1 rounded-full backdrop-blur-sm border text-xs font-bold uppercase",
                            getDifficultyColor(course.difficulty)
                        )}>
                            {course.difficulty}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                        {/* Title */}
                        <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-blue-400 transition-colors">
                            {course.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-slate-400 line-clamp-2">
                            {course.shortDescription}
                        </p>

                        {/* Instructor */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
                                {course.instructor.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">{course.instructor.name}</p>
                                <p className="text-xs text-slate-500">{course.instructor.title}</p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                            <div className="flex items-center gap-4 text-xs text-slate-400">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                                    <span className="font-semibold text-white">{course.rating}</span>
                                    <span>({course.reviewsCount.toLocaleString()})</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    <span>{(course.studentsEnrolled / 1000).toFixed(1)}K</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{formatDuration(course.totalDuration)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Price/CTA */}
                        <div className="flex items-center justify-between pt-2">
                            {course.isFree ? (
                                <span className="text-lg font-bold text-green-400">Free</span>
                            ) : (
                                <span className="text-lg font-bold text-white">${course.price}</span>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-bold transition-all shadow-lg shadow-blue-500/25"
                            >
                                {course.isFree ? 'Start Learning' : 'Enroll Now'}
                            </motion.button>
                        </div>
                    </div>

                    {/* Progress Ring (if user is enrolled) */}
                    {/* TODO: Show based on user progress */}
                </motion.div>
            </Link>
        </motion.div>
    );
}
