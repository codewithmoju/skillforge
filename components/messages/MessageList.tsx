'use client';

import React, { useState, useMemo } from 'react';
import { Conversation } from '@/lib/services/messages';
import { ConversationListItem } from './ConversationListItem';
import { Search, Edit, MessageSquare } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

interface MessageListProps {
    conversations: Conversation[];
    selectedId?: string;
    onSelect: (conversation: Conversation) => void;
    loading: boolean;
    onNewMessage?: () => void;
}

export function MessageList({ conversations, selectedId, onSelect, loading, onNewMessage }: MessageListProps) {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredConversations = useMemo(() => {
        if (!user) return [];

        return conversations.filter(conv => {
            const otherUserId = conv.participants.find(id => id !== user.uid) || '';
            const otherUser = conv.participantDetails[otherUserId];
            const name = otherUser?.name || 'Unknown';
            return name.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [conversations, searchQuery, user]);

    if (loading) {
        return (
            <div className="flex-1 p-4 space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex gap-3 animate-pulse">
                        <div className="w-14 h-14 bg-slate-200 dark:bg-slate-800 rounded-full" />
                        <div className="flex-1 space-y-2 py-2">
                            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800">
            {/* Header - Fixed height to match ChatWindow */}
            <div className="h-[72px] px-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-10">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Messages</h2>
                {onNewMessage && (
                    <button
                        onClick={onNewMessage}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <Edit className="w-6 h-6 text-slate-900 dark:text-white stroke-[1.5]" />
                    </button>
                )}
            </div>

            {/* Search */}
            <div className="px-5 py-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search messages"
                        className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 focus:outline-none transition-all"
                    />
                </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                {filteredConversations.length > 0 ? (
                    <div className="flex flex-col pb-4">
                        {filteredConversations.map((conv) => (
                            <ConversationListItem
                                key={conv.id}
                                conversation={conv}
                                currentUserId={user?.uid || ''}
                                isSelected={selectedId === conv.id}
                                onSelect={onSelect}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                        <div className="w-20 h-20 rounded-full border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center mb-4">
                            <MessageSquare className="w-10 h-10 opacity-20" />
                        </div>
                        <p className="text-sm font-medium">No messages yet</p>
                        <button
                            onClick={onNewMessage}
                            className="mt-4 text-accent-indigo font-semibold text-sm hover:underline"
                        >
                            Send a message
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

