'use client';

import { useState, useEffect } from 'react';
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
            className={`w-full p-4 flex items-center gap-3 hover:bg-slate-800/50 transition-colors border-b border-slate-800/50 ${isSelected ? 'bg-slate-800/80' : ''
                }`}
        >
            <div className="relative">
                {otherUser?.photo ? (
                    <Image
                        src={otherUser.photo}
                        alt={otherUser.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                        {otherUser?.name?.charAt(0).toUpperCase()}
                    </div>
                )}
                {/* Online indicator */}
                {otherUser?.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
                )}
            </div>
            <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-baseline">
                    <div className="flex items-center gap-2 min-w-0">
                        <h3 className={`font-semibold truncate ${unread > 0 ? 'text-white' : 'text-slate-300'}`}>
                            {otherUser?.name || 'Unknown User'}
                        </h3>
                        {stats && stats.currentStreak > 0 && (
                            <StreakIndicator streak={stats.currentStreak} />
                        )}
                    </div>
                    {unread > 0 && (
                        <span className="bg-accent-indigo text-white text-xs px-2 py-0.5 rounded-full ml-2 animate-pulse shrink-0">
                            {unread}
                        </span>
                    )}
                </div>
                <p className={`text-sm truncate ${unread > 0 ? 'text-slate-200 font-medium' : 'text-slate-500'}`}>
                    {conversation.lastMessage || 'Start a conversation'}
                </p>
            </div>
        </button>
    );
}
