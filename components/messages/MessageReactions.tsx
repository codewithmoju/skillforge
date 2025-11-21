'use client';

import { useState } from 'react';
import { MessageReaction } from '@/lib/services/messages';

interface MessageReactionsProps {
    messageId: string;
    reactions?: Record<string, MessageReaction>;
    currentUserId?: string;
    onAddReaction: (emoji: string) => void;
    onRemoveReaction: (emoji: string) => void;
}

const QUICK_REACTIONS = ['❤️', '😂', '👍', '🔥', '✨', '🎉'];

export function MessageReactions({
    messageId,
    reactions = {},
    currentUserId,
    onAddReaction,
    onRemoveReaction,
}: MessageReactionsProps) {
    const [showPicker, setShowPicker] = useState(false);

    const handleReactionClick = (emoji: string) => {
        if (!currentUserId) return;

        const reaction = reactions[emoji];
        const hasReacted = reaction?.userIds.includes(currentUserId);

        if (hasReacted) {
            onRemoveReaction(emoji);
        } else {
            onAddReaction(emoji);
        }
        setShowPicker(false);
    };

    const existingReactions = Object.values(reactions);

    return (
        <div className="relative">
            {/* Existing reactions */}
            {existingReactions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                    {existingReactions.map((reaction) => {
                        const hasReacted = currentUserId && reaction.userIds.includes(currentUserId);
                        return (
                            <button
                                key={reaction.emoji}
                                onClick={() => handleReactionClick(reaction.emoji)}
                                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all hover:scale-110 ${hasReacted
                                        ? 'bg-accent-indigo/30 border border-accent-indigo'
                                        : 'bg-slate-800/50 border border-slate-700 hover:bg-slate-700'
                                    }`}
                            >
                                <span>{reaction.emoji}</span>
                                <span className="text-slate-300">{reaction.count}</span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Add reaction button */}
            <div className="relative inline-block">
                <button
                    onClick={() => setShowPicker(!showPicker)}
                    className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded hover:bg-slate-800/50"
                    title="Add reaction"
                >
                    <span className="text-sm">😊</span>
                </button>

                {/* Reaction picker */}
                {showPicker && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowPicker(false)}
                        />
                        <div className="absolute bottom-full left-0 mb-2 bg-slate-900 border border-slate-700 rounded-xl p-2 shadow-xl z-20 flex gap-1">
                            {QUICK_REACTIONS.map((emoji) => (
                                <button
                                    key={emoji}
                                    onClick={() => handleReactionClick(emoji)}
                                    className="text-2xl hover:scale-125 transition-transform p-1 rounded hover:bg-slate-800"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
