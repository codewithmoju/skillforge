'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Conversation } from '@/lib/services/messages';
import { getConversationStats, ConversationStats } from '@/lib/services/conversationStats';
import { StreakIndicator } from './StreakIndicator';

interface ConversationListItemProps {
    conversation: Conversation;
    currentUserId: string;
    isSelected: boolean;
    onSelect: (conversation: Conversation) => void;
}

export function ConversationListItem({ conversation, currentUserId, isSelected, onSelect }: ConversationListItemProps) {
    const [stats, setStats] = useState<ConversationStats | null>(null);

    const otherUserId = conversation.participants.find(id => id !== currentUserId) || '';
    const otherUser = conversation.participantDetails[otherUserId];
    const unread = conversation.unreadMessages?.[currentUserId]?.length || 0;

    useEffect(() => {
        getConversationStats(conversation.id, currentUserId).then(setStats);
    }, [conversation.id, currentUserId]);

    return (
        <button
            onClick={() => onSelect(conversation)}
            className={`w-full p-4 flex items-center gap-4 transition-all duration-200 border-b border-slate-800/50 group relative overflow-hidden ${isSelected
                    ? 'bg-slate-800/80 border-l-4 border-l-accent-indigo'
                    : 'hover:bg-slate-800/30 border-l-4 border-l-transparent hover:border-l-slate-700'
                }`}
        >
            <div className="relative shrink-0">
                {otherUser?.photo ? (
                    <Image
                        src={otherUser.photo}
                        alt={otherUser.name}
                        width={48}
                        height={48}
                        className={`w-12 h-12 rounded-full object-cover ring-2 transition-all ${isSelected ? 'ring-accent-indigo' : 'ring-transparent group-hover:ring-slate-700'}`}
                    />
                ) : (
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ring-2 transition-all ${isSelected
                            ? 'bg-gradient-to-br from-accent-indigo to-accent-violet ring-accent-indigo'
                            : 'bg-slate-700 ring-transparent group-hover:ring-slate-600'
                        }`}>
                        {otherUser?.name?.charAt(0).toUpperCase()}
                    </div>
                )}
                {/* Online indicator */}
                {otherUser?.online && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-slate-900 shadow-sm" />
                )}
            </div>

            <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                        <h3 className={`font-semibold truncate text-sm transition-colors ${unread > 0 ? 'text-white' : 'text-slate-300 group-hover:text-white'
                            }`}>
                            {otherUser?.name || 'Unknown User'}
                        </h3>
                        {stats && stats.currentStreak > 0 && (
                            <StreakIndicator streak={stats.currentStreak} />
                        )}
                    </div>
                    {unread > 0 && (
                        <span className="bg-accent-indigo text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-2 shadow-lg shadow-accent-indigo/20 animate-pulse shrink-0">
                            {unread} NEW
                        </span>
                    )}
                </div>
                <p className={`text-xs truncate transition-colors ${unread > 0 ? 'text-slate-200 font-medium' : 'text-slate-500 group-hover:text-slate-400'
                    }`}>
                    {conversation.lastMessage || 'Start a conversation'}
                </p>
            </div>
        </button>
    );
}
