'use client';

import { Trophy } from 'lucide-react';

interface ConversationLevelBadgeProps {
    level: number;
    className?: string;
}

const LEVEL_TITLES = [
    'Stranger',
    'Acquaintance',
    'Casual Chatter',
    'Friend',
    'Good Friend',
    'Close Friend',
    'Best Friend',
    'Confidant',
    'Soulmate',
    'Legendary Duo'
];

export function ConversationLevelBadge({ level, className = '' }: ConversationLevelBadgeProps) {
    const title = LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length) - 1] || 'Stranger';

    return (
        <div className={`flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 px-2 py-0.5 rounded-full ${className}`}>
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                {level}
            </div>
            <span className="text-xs font-medium text-slate-300">{title}</span>
        </div>
    );
}
