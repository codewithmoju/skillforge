'use client';

import { useState, useEffect, useRef } from 'react';
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
} from '@/lib/services/messages';
import {
    getConversationStats,
    updateStatsOnMessage,
    ConversationStats,
    MessageAchievement
} from '@/lib/services/conversationStats';
import { updateChallengeProgress } from '@/lib/services/challenges';
import { Send, Loader2 } from 'lucide-react';
import { TypingIndicator } from './TypingIndicator';
import { OnlineStatus } from './OnlineStatus';
import { MessageReactions } from './MessageReactions';
import { StreakIndicator } from './StreakIndicator';
import { ConversationLevelBadge } from './ConversationLevelBadge';
import { XPNotification } from './XPNotification';
import { AchievementModal } from './AchievementModal';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';


interface ChatWindowProps {
    conversationId: string;
    recipientName: string;
    recipientPhoto?: string;
}

function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    return date.toLocaleDateString();
}

export function ChatWindow({ conversationId, recipientName, recipientPhoto }: ChatWindowProps) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [recipientDetails, setRecipientDetails] = useState<ParticipantDetails | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Gamification State
    const [stats, setStats] = useState<ConversationStats | null>(null);
    const [xpNotification, setXpNotification] = useState<{ amount: number; reason?: string } | null>(null);
    const [achievementModal, setAchievementModal] = useState<MessageAchievement | null>(null);

    // Subscribe to messages
    useEffect(() => {
        if (!conversationId || !user) return;

        const unsubscribe = subscribeToMessages(conversationId, (msgs) => {
            setMessages(msgs);
            markMessagesAsRead(conversationId, user.uid);
        });

        return () => unsubscribe();
    }, [conversationId, user]);

    // Subscribe to conversation for presence and typing
    useEffect(() => {
        if (!conversationId || !user) return;

        const conversationRef = doc(db, 'conversations', conversationId);
        const unsubscribe = onSnapshot(conversationRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data() as Conversation;
                const otherUserId = data.participants.find(id => id !== user.uid);
                if (otherUserId) {
                    setRecipientDetails(data.participantDetails[otherUserId]);
                }
            }
        });

        return () => unsubscribe();
    }, [conversationId, user]);

    // Fetch stats
    useEffect(() => {
        if (!conversationId || !user) return;
        getConversationStats(conversationId, user.uid).then(setStats);
    }, [conversationId, user]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || sending) return;

        setSending(true);
        try {
            await sendMessage(conversationId, user.uid, newMessage.trim());
            setNewMessage('');

            // Update Stats & Gamification
            const result = await updateStatsOnMessage(conversationId, user.uid);
            const challengeResult = await updateChallengeProgress(user.uid, 'message_count');

            // Show XP Notification
            const totalXp = result.xpGained + challengeResult.xpGained;
            if (totalXp > 0) {
                setXpNotification({
                    amount: totalXp,
                    reason: result.levelUp ? 'Level Up Bonus!' : (challengeResult.xpGained > 0 ? 'Challenge Completed!' : 'Message Sent')
                });
            }

            // Show Achievement Modal
            if (result.achievementsUnlocked.length > 0) {
                setAchievementModal(result.achievementsUnlocked[0]); // Show first one if multiple
            }

            // Update local stats
            if (stats) {
                setStats(prev => prev ? ({
                    ...prev,
                    currentStreak: result.achievementsUnlocked.find(a => a.id.includes('streak')) ? prev.currentStreak + 1 : prev.currentStreak,
                    level: result.newLevel || prev.level,
                    xp: prev.xp + result.xpGained
                }) : null);
                getConversationStats(conversationId, user.uid).then(setStats);
            }

            // Stop typing indicator
            await updateTypingStatus(conversationId, user.uid, false);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    const handleTyping = (value: string) => {
        setNewMessage(value);

        if (!user) return;

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set typing status
        if (value.trim()) {
            updateTypingStatus(conversationId, user.uid, true);

            // Clear typing status after 2 seconds of inactivity
            typingTimeoutRef.current = setTimeout(() => {
                updateTypingStatus(conversationId, user.uid, false);
            }, 2000);
        } else {
            updateTypingStatus(conversationId, user.uid, false);
        }
    };

    const handleAddReaction = async (messageId: string, emoji: string) => {
        if (!user) return;
        try {
            await addReaction(messageId, user.uid, emoji);
            const challengeResult = await updateChallengeProgress(user.uid, 'reaction_count');

            if (challengeResult.xpGained > 0) {
                setXpNotification({ amount: challengeResult.xpGained, reason: 'Challenge Completed!' });
            }
        } catch (error) {
            console.error('Error adding reaction:', error);
        }
    };

    const handleRemoveReaction = async (messageId: string, emoji: string) => {
        if (!user) return;
        try {
            await removeReaction(messageId, user.uid, emoji);
        } catch (error) {
            console.error('Error removing reaction:', error);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden relative">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900/80 backdrop-blur-sm">
                <div className="relative">
                    {recipientPhoto ? (
                        <img src={recipientPhoto} alt={recipientName} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center text-white font-bold">
                            {recipientName.charAt(0).toUpperCase()}
                        </div>
                    )}
                    {/* Online indicator dot */}
                    {recipientDetails?.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{recipientName}</h3>
                        {stats && (
                            <>
                                <ConversationLevelBadge level={stats.level} />
                                <StreakIndicator streak={stats.currentStreak} />
                            </>
                        )}
                    </div>
                    <OnlineStatus online={recipientDetails?.online} lastSeen={recipientDetails?.lastSeen} />
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => {
                    const isOwn = msg.senderId === user?.uid;
                    return (
                        <div
                            key={msg.id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-slideUp`}
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div className="flex flex-col max-w-[70%]">
                                <div
                                    className={`rounded-2xl px-4 py-2 transition-all hover:shadow-lg ${isOwn
                                            ? 'bg-gradient-to-br from-accent-indigo to-accent-violet text-white rounded-tr-none'
                                            : 'bg-slate-800 text-slate-200 rounded-tl-none'
                                        }`}
                                >
                                    <p>{msg.text}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className={`text-[10px] ${isOwn ? 'text-indigo-200' : 'text-slate-500'}`}>
                                            {timeAgo(msg.createdAt)}
                                            {msg.edited && ' (edited)'}
                                        </p>
                                    </div>
                                </div>

                                {/* Reactions */}
                                <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                    <MessageReactions
                                        messageId={msg.id}
                                        reactions={msg.reactions}
                                        currentUserId={user?.uid}
                                        onAddReaction={(emoji) => handleAddReaction(msg.id, emoji)}
                                        onRemoveReaction={(emoji) => handleRemoveReaction(msg.id, emoji)}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Typing indicator */}
                {recipientDetails?.typing && (
                    <TypingIndicator recipientName={recipientName} />
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-900/80 backdrop-blur-sm">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => handleTyping(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-slate-800 border-none rounded-full px-4 py-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-accent-indigo focus:outline-none transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="p-2 bg-gradient-to-br from-accent-indigo to-accent-violet text-white rounded-full hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-accent-indigo/50"
                    >
                        {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </div>
            </form>

            {/* Gamification Overlays */}
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

            <style jsx>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
