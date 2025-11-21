'use client';

import { useEffect } from 'react';
import { Trophy, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AchievementModalProps {
    title: string;
    description: string;
    icon: string;
    xpReward: number;
    onClose: () => void;
}

export function AchievementModal({ title, description, icon, xpReward, onClose }: AchievementModalProps) {
    useEffect(() => {
        // Fire confetti
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#6366f1', '#8b5cf6', '#ec4899']
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#6366f1', '#8b5cf6', '#ec4899']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };

        frame();
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-slate-900 border border-accent-indigo rounded-2xl p-8 max-w-sm w-full text-center relative overflow-hidden shadow-2xl shadow-accent-indigo/20 animate-scaleIn">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-accent-indigo/20 blur-3xl rounded-full pointer-events-none" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-accent-indigo to-accent-violet rounded-full flex items-center justify-center text-4xl mb-6 shadow-lg shadow-accent-indigo/50 animate-bounce">
                        {icon}
                    </div>

                    <h2 className="text-accent-cyan font-bold text-sm uppercase tracking-wider mb-2">Achievement Unlocked!</h2>
                    <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                    <p className="text-slate-400 mb-6">{description}</p>

                    <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700 px-4 py-2 rounded-full">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-bold">+{xpReward} XP</span>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full mt-8 bg-white text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        Awesome!
                    </button>
                </div>
            </div>
        </div>
    );
}
