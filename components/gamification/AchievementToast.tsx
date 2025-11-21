"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy } from "lucide-react";
import { useEffect } from "react";

interface AchievementToastProps {
    achievementName: string;
    achievementIcon: string;
    stars: number;
    xpGained: number;
    isVisible: boolean;
    onClose: () => void;
}

export function AchievementToast({
    achievementName,
    achievementIcon,
    stars,
    xpGained,
    isVisible,
    onClose,
}: AchievementToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ x: 400, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 400, opacity: 0 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="fixed bottom-6 right-6 z-50 w-96"
                >
                    <div className="bg-slate-800/95 backdrop-blur-md rounded-2xl border-2 border-accent-cyan shadow-[0_0_30px_rgba(6,182,212,0.4)] p-4">
                        <div className="flex items-start gap-4">
                            {/* Icon */}
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-indigo to-accent-cyan flex items-center justify-center text-2xl shrink-0">
                                {achievementIcon}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <Trophy className="w-4 h-4 text-accent-cyan" />
                                    <span className="text-xs font-bold text-accent-cyan uppercase tracking-wider">
                                        Achievement Unlocked
                                    </span>
                                </div>
                                <h4 className="font-bold text-white mb-1 truncate">{achievementName}</h4>
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <span
                                                key={i}
                                                className={i < stars ? "text-accent-cyan" : "text-slate-700"}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-sm font-bold text-accent-cyan">
                                        +{xpGained} XP
                                    </span>
                                </div>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-white transition-colors shrink-0"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
