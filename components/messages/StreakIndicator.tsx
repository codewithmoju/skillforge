'use client';

import { Flame } from 'lucide-react';

interface StreakIndicatorProps {
    streak: number;
    className?: string;
}

export function StreakIndicator({ streak, className = '' }: StreakIndicatorProps) {
    if (streak < 1) return null;

    return (
        <div className={`flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full ${className}`} title={`${streak} day streak!`}>
            <Flame className={`w-3 h-3 text-orange-500 ${streak >= 3 ? 'animate-pulse' : ''}`} fill={streak >= 7 ? "currentColor" : "none"} />
            <span className="text-xs font-bold text-orange-400">{streak}</span>
        </div>
    );
}
