'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import {
    Message,
    Conversation,
    ParticipantDetails,
    sendMessage,
    subscribeToMessages,
    markMessagesAsRead,
    addReaction,
    removeReaction,
    updateTypingStatus,
    editMessage,
    deleteMessage,
    pinMessage,
    unpinMessage,
} from '@/lib/services/messages';
import {
    getConversationStats,
    updateStatsOnMessage,
    ConversationStats,
    MessageAchievement
} from '@/lib/services/conversationStats';
import { updateChallengeProgress } from '@/lib/services/challenges';
import { getUserData } from '@/lib/services/firestore';
import { Reply, Search, Pin } from 'lucide-react';
import { TypingIndicator } from './TypingIndicator';
import { OnlineStatus } from './OnlineStatus';
import { AchievementModal } from './AchievementModal';
import { StreakIndicator } from './StreakIndicator';
import { ConversationLevelBadge } from './ConversationLevelBadge';
import { XPNotification } from './XPNotification';
import { MessageInput } from './MessageInput';
import { MessageBubble } from './MessageBubble';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ChatWindowProps {
    conversationId: string;
    recipientName: string;
    recipientPhoto?: string;
}

export function ChatWindow({ conversationId, recipientName, recipientPhoto }: ChatWindowProps) {
    const { user } = useAuth();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [recipientDetails, setRecipientDetails] = useState<ParticipantDetails | null>(null);
    const [recipientUsername, setRecipientUsername] = useState<string | null>(null);
    const messageContainerRef = useRef<HTMLDivElement>(null);

    // Gamification State
    const [stats, setStats] = useState<ConversationStats | null>(null);
    const [xpNotification, setXpNotification] = useState<{ amount: number; reason?: string } | null>(null);
    const [achievementModal, setAchievementModal] = useState<MessageAchievement | null>(null);

    // UI State
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [pinnedMessageId, setPinnedMessageId] = useState<string | null>(null);

    // Subscribe to messages
    useEffect(() => {
        if (!conversationId || !user) return;

        const unsubscribe = subscribeToMessages(conversationId, (msgs) => {
            setMessages(msgs);
            markMessagesAsRead(conversationId, user.uid);
        });

        return () => unsubscribe();
    }, [conversationId, user]);

    // Scroll to bottom on new messages
    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages.length, conversationId]);

    // Subscribe to conversation details & fetch username
    useEffect(() => {
        if (!conversationId || !user) return;

        const conversationRef = doc(db, 'conversations', conversationId);
        const unsubscribe = onSnapshot(conversationRef, async (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data() as Conversation;
                const otherUserId = data.participants.find(id => id !== user.uid);
                if (otherUserId) {
                    setRecipientDetails(data.participantDetails[otherUserId]);

                    // Fetch username for profile link
                    try {
                        const userData = await getUserData(otherUserId);
                        if (userData) {
                            setRecipientUsername(userData.username);
                        }
                    } catch (error) {
                        console.error('Error fetching recipient data:', error);
                    }
                }
                setPinnedMessageId(data.pinnedMessageId || null);
            }
        });

        return () => unsubscribe();
    }, [conversationId, user]);

    // Fetch stats
    useEffect(() => {
        if (!conversationId || !user) return;
        getConversationStats(conversationId, user.uid).then(setStats);
    }, [conversationId, user]);

    const handleSend = async (text: string) => {
        if (!user) return;

        try {
            const replyToData = replyingTo ? {
                messageId: replyingTo.id,
                text: replyingTo.text,
                senderId: replyingTo.senderId,
                senderName: replyingTo.senderId === user.uid ? 'You' : recipientName
            } : undefined;

            await sendMessage(conversationId, user.uid, text, replyToData);

            // Update Stats & Gamification
            const result = await updateStatsOnMessage(conversationId, user.uid);
            const challengeResult = await updateChallengeProgress(user.uid, 'message_count');

            if (result.xpGained + challengeResult.xpGained > 0) {
                setXpNotification({
                    amount: result.xpGained + challengeResult.xpGained,
                    reason: result.levelUp ? 'Level Up Bonus!' : 'XP Gained'
                });
            }

            if (result.achievementsUnlocked.length > 0) {
                setAchievementModal(result.achievementsUnlocked[0]);
            }

            setReplyingTo(null);
            await updateTypingStatus(conversationId, user.uid, false);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleTyping = (isTyping: boolean) => {
        if (!user) return;
        updateTypingStatus(conversationId, user.uid, isTyping);
    };

    // Memoized filtered messages to prevent render loops
    const filteredMessages = useMemo(() => {
        return messages.filter(msg =>
            !searchQuery || msg.text.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [messages, searchQuery]);

    // Handlers
    const handleAddReaction = async (msgId: string, emoji: string) => {
        if (!user) return;

        // Find if user already has a reaction on this message
        const message = messages.find(m => m.id === msgId);
        if (message && message.reactions) {
            // Check all emojis to see if user reacted
            for (const [existingEmoji, userIds] of Object.entries(message.reactions)) {
                if (Array.isArray(userIds) && userIds.includes(user.uid)) {
                    if (existingEmoji !== emoji) {
                        await removeReaction(msgId, user.uid, existingEmoji);
                    }
                }
            }
        }

        addReaction(msgId, user.uid, emoji);
    };

    const handleRemoveReaction = (msgId: string, emoji: string) => {
        if (user) removeReaction(msgId, user.uid, emoji);
    };

    const handleDelete = async (msgId: string) => {
        if (window.confirm('Delete this message?')) {
            await deleteMessage(conversationId, msgId);
        }
    };

    const handleProfileClick = () => {
        if (recipientUsername) {
            router.push(`/profile/${recipientUsername}`);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-950 relative">
            {/* Header - Instagram Style */}
            <div className="h-[72px] px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10 sticky top-0">
                <div
                    className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={handleProfileClick}
                >
                    <div className="relative">
                        {recipientPhoto ? (
                            <Image
                                src={recipientPhoto}
                                alt={recipientName}
                                width={44}
                                height={44}
                                className="rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                            />
                        ) : (
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center text-white font-bold text-base shadow-md">
                                {recipientName.charAt(0).toUpperCase()}
                            </div>
                        )}
                        {recipientDetails?.online && (
                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-[3px] border-white dark:border-slate-950" />
                        )}
                    </div>
                    <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 dark:text-white text-[16px] leading-tight">{recipientName}</h3>
                            {stats && <ConversationLevelBadge level={stats.level} />}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium">
                            <OnlineStatus online={recipientDetails?.online} lastSeen={recipientDetails?.lastSeen} />
                            {stats && stats.currentStreak > 0 && (
                                <>
                                    <span>•</span>
                                    <StreakIndicator streak={stats.currentStreak} />
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                    <button
                        onClick={() => setShowSearch(!showSearch)}
                        className={`p-2.5 rounded-full transition-colors ${showSearch ? 'bg-slate-100 dark:bg-slate-800' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        title="Search in conversation"
                    >
                        <Search className="w-6 h-6 stroke-[1.5]" />
                    </button>
                </div>
            </div>

            {/* Search Bar (Conditional) */}
            {showSearch && (
                <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search in conversation..."
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-indigo transition-all"
                            autoFocus
                        />
                    </div>
                </div>
            )}

            {/* Pinned Message */}
            {pinnedMessageId && (
                <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-2.5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <Pin className="w-3.5 h-3.5 text-accent-indigo flex-shrink-0" />
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-[10px] uppercase font-bold text-accent-indigo tracking-wider">Pinned</span>
                            <span className="text-xs text-slate-600 dark:text-slate-300 truncate max-w-[300px]">
                                {messages.find(m => m.id === pinnedMessageId)?.text || 'Message not found'}
                            </span>
                        </div>
                    </div>
                    <button onClick={() => unpinMessage(conversationId)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                        ✕
                    </button>
                </div>
            )}

            {/* Messages Area */}
            <div
                ref={messageContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800"
            >
                {filteredMessages.map((msg, index) => {
                    const isOwn = msg.senderId === user?.uid;
                    const prevMsg = filteredMessages[index - 1];
                    const nextMsg = filteredMessages[index + 1];

                    // Grouping logic: Show avatar only if it's the last message in a sequence from the same user
                    const isLastInSequence = !nextMsg || nextMsg.senderId !== msg.senderId;
                    const showAvatar = !isOwn && isLastInSequence;

                    return (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            isOwn={isOwn}
                            showAvatar={showAvatar}
                            senderName={isOwn ? 'You' : recipientName}
                            currentUserId={user?.uid}
                            onReply={setReplyingTo}
                            onPin={(id) => pinMessage(conversationId, id)}
                            onEdit={(id) => editMessage(id, prompt('Edit message:', msg.text) || msg.text)}
                            onDelete={handleDelete}
                            onAddReaction={handleAddReaction}
                            onRemoveReaction={handleRemoveReaction}
                        />
                    );
                })}

                {recipientDetails?.typing && (
                    <div className="ml-12 mt-2 mb-4">
                        <TypingIndicator recipientName={recipientName} />
                    </div>
                )}
                <div className="h-4" /> {/* Bottom spacer */}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
                {replyingTo && (
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 mb-3 animate-in slide-in-from-bottom-2">
                        <div className="flex flex-col pl-3 border-l-[3px] border-accent-indigo">
                            <span className="text-xs font-bold text-accent-indigo mb-0.5">
                                Replying to {replyingTo.senderId === user?.uid ? 'You' : recipientName}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[300px]">
                                {replyingTo.text}
                            </span>
                        </div>
                        <button onClick={() => setReplyingTo(null)} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
                            ✕
                        </button>
                    </div>
                )}
                <MessageInput onSend={handleSend} onTyping={handleTyping} />
            </div>

            {/* Overlays */}
            {xpNotification && (
                <XPNotification
                    amount={xpNotification.amount}
                    reason={xpNotification.reason}
                    onComplete={() => setXpNotification(null)}
                />
            )}
            {achievementModal && (
                <AchievementModal
                    title={achievementModal.title}
                    description={achievementModal.description}
                    icon={achievementModal.icon}
                    xpReward={achievementModal.xpReward}
                    onClose={() => setAchievementModal(null)}
                />
            )}
        </div>
    );
}

