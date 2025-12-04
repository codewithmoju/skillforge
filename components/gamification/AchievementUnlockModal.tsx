"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Share2, Trophy, Star } from "lucide-react";
import { Achievement } from "@/lib/types/gamification";
import { getTotalStarsEarned } from "@/lib/utils/achievementSystem";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface AchievementUnlockModalProps {
    achievement: Achievement;
    starsUnlocked: number[];
    xpGained: number;
    isOpen: boolean;
    onClose: () => void;
}

export function AchievementUnlockModal({
    achievement,
    starsUnlocked,
    xpGained,
    isOpen,
    onClose,
}: AchievementUnlockModalProps) {
    const [confetti, setConfetti] = useState<Array<{ id: number; x: number; delay: number }>>([]);

    useEffect(() => {
        if (isOpen) {
            // Generate confetti particles
            const particles = Array.from({ length: 50 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                delay: Math.random() * 0.5,
            }));
            setConfetti(particles);
        }
    }, [isOpen]);

    const totalStars = getTotalStarsEarned(achievement);
    const isMastered = totalStars === 5;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="relative bg-slate-900 rounded-3xl border-2 border-accent-cyan shadow-[0_0_50px_rgba(6,182,212,0.5)] max-w-lg w-full p-8"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Confetti */}
                            {confetti.map((particle) => (
                                <motion.div
                                    key={particle.id}
                                    initial={{ y: -20, x: `${particle.x}%`, opacity: 1 }}
                                    animate={{ y: 600, opacity: 0 }}
                                    transition={{ duration: 2, delay: particle.delay, ease: "easeIn" }}
                                    className="absolute w-2 h-2 bg-gradient-to-r from-accent-indigo to-accent-cyan rounded-full"
                                    style={{ left: 0 }}
                                />
                            ))}

                            {/* Header */}
                            <div className="text-center mb-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                    className="inline-flex items-center gap-2 text-2xl font-bold text-accent-cyan mb-2"
                                >
                                    <Trophy className="w-8 h-8" />
                                    {isMastered ? "LEGENDARY!" : "Achievement Unlocked!"}
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-4xl mb-2"
                                >
                                    {achievement.icon}
                                </motion.div>
                            </div>

                            {/* Achievement Info */}
                            <div className="text-center mb-6">
                                <h2 className="text-3xl font-bold text-white mb-2">{achievement.name}</h2>
                                <p className="text-slate-400 mb-4">{achievement.description}</p>

                                {/* Stars Unlocked */}
                                <div className="flex justify-center gap-2 mb-4">
                                    {starsUnlocked.map((star, index) => (
                                        <motion.div
                                            key={star}
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                                            className="text-accent-cyan"
                                        >
                                            <Star className="w-10 h-10 fill-current drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                                        </motion.div>
                                    ))}
                                </div>

                                <p className="text-sm text-slate-500">
                                    {starsUnlocked.length === 1 ? "1 Star" : `${starsUnlocked.length} Stars`} Unlocked
                                </p>
                            </div>

                            {/* XP Gained */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.8, type: "spring" }}
                                className="text-center mb-6"
                            >
                                <div className="inline-block bg-gradient-to-r from-accent-indigo to-accent-cyan rounded-2xl px-8 py-4">
                                    <div className="text-4xl font-bold text-white">
                                        +{xpGained.toLocaleString()} XP
                                    </div>
                                </div>
                            </motion.div>

                            {/* Progress */}
                            <div className="text-center mb-6">
                                <p className="text-slate-400 text-sm">
                                    {totalStars} / 5 Stars Earned
                                </p>
                                <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(totalStars / 5) * 100}%` }}
                                        transition={{ delay: 1, duration: 1 }}
                                        className="h-full bg-gradient-to-r from-accent-indigo to-accent-cyan"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => {
                                        // TODO: Implement share functionality

                                    }}
                                >
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Share
                                </Button>
                                <Button className="flex-1" onClick={onClose}>
                                    Continue
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
