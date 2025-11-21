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
import { Send, Loader2, Smile, Image, Pencil, Trash2, Reply, Search, Pin } from 'lucide-react';
import { TypingIndicator } from './TypingIndicator';
import { OnlineStatus } from './OnlineStatus';
import { AchievementModal } from './AchievementModal';
import { EmojiPicker } from './EmojiPicker';
import { GifPicker } from './GifPicker';
import { VoiceRecorder } from './VoiceRecorder';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadFile } from '@/lib/services/storage';
import { MessageReactions } from './MessageReactions';
import { StreakIndicator } from './StreakIndicator';
import { ConversationLevelBadge } from './ConversationLevelBadge';
import { XPNotification } from './XPNotification';

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

    // UI State
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showGifPicker, setShowGifPicker] = useState(false);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
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

    // Subscribe to conversation for presence, typing, and pinned message
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

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessageInternal = async (text: string, media?: { type: 'image' | 'video' | 'audio'; url: string; duration?: number }) => {
        if (!user || sending) return;

        setSending(true);
        try {
            const replyToData = replyingTo ? {
                messageId: replyingTo.id,
                text: replyingTo.text,
                senderId: replyingTo.senderId,
                senderName: replyingTo.senderId === user.uid ? 'You' : recipientName
            } : undefined;

            await sendMessage(conversationId, user.uid, text, replyToData, media);

            if (!media) {
                setNewMessage('');
            }
            setReplyingTo(null);

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
                setAchievementModal(result.achievementsUnlocked[0]);
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

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        await sendMessageInternal(newMessage.trim());
    };

    const handleSendGif = async (url: string) => {
        await sendMessageInternal('GIF', { type: 'image', url });
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

    const handleVoiceRecording = async (blob: Blob) => {
        if (!user) return;

        const duration = Math.ceil(blob.size / 4000); // Rough estimate
        const path = `voice-messages/${conversationId}/${user.uid}/${Date.now()}.webm`;

        try {
            const url = await uploadFile(blob, path);
            await sendMessageInternal('🎤 Voice Message', { type: 'audio', url, duration });
        } catch (error) {
            console.error('Error sending voice message:', error);
        }
    };

    const handleSaveEdit = async () => {
        if (!editingMessageId || !newMessage.trim() || !user) return;

        try {
            await editMessage(editingMessageId, newMessage.trim());
            setEditingMessageId(null);
            setNewMessage('');
        } catch (error) {
            console.error('Error editing message:', error);
        }
    };

    const startEditing = (message: Message) => {
        setEditingMessageId(message.id);
        setNewMessage(message.text);
        // Focus input?
    };

    const cancelEditing = () => {
        setEditingMessageId(null);
        setNewMessage('');
    };

    const handleDeleteMessage = async (messageId: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;
        try {
            await deleteMessage(conversationId, messageId);
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    const handleReply = (message: Message) => {
        setReplyingTo(message);
        // Focus input?
    };

    const handlePin = async (messageId: string) => {
        try {
            await pinMessage(conversationId, messageId);
        } catch (error) {
            console.error('Error pinning message:', error);
        }
    };

    const handleUnpin = async () => {
        try {
            await unpinMessage(conversationId);
        } catch (error) {
            console.error('Error unpinning message:', error);
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

                {/* Search Toggle */}
                <div className="relative">
                    {showSearch ? (
                        <div className="flex items-center bg-slate-800 rounded-full px-3 py-1 animate-in fade-in slide-in-from-right-5">
                            <Search className="w-4 h-4 text-slate-400 mr-2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search..."
                                className="bg-transparent border-none text-sm text-white placeholder-slate-500 focus:outline-none w-32"
                                autoFocus
                            />
                            <button
                                onClick={() => {
                                    setShowSearch(false);
                                    setSearchQuery('');
                                }}
                                className="ml-2 text-slate-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowSearch(true)}
                            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Pinned Message Banner */}
            {pinnedMessageId && (
                <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <Pin className="w-4 h-4 text-accent-indigo flex-shrink-0" />
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-xs text-accent-indigo font-bold">Pinned Message</span>
                            <span className="text-xs text-slate-300 truncate">
                                {messages.find(m => m.id === pinnedMessageId)?.text || 'Loading...'}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleUnpin}
                        className="text-slate-400 hover:text-white p-1"
                        title="Unpin"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.filter(msg =>
                    !searchQuery || msg.text.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((msg, index) => {
                    const isOwn = msg.senderId === user?.uid;
                    return (
                        <div
                            key={msg.id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-slideUp group`}
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
                                    {msg.type === 'audio' && msg.mediaUrl && (
                                        <audio controls src={msg.mediaUrl} className="mt-2 w-full" />
                                    )}
                                    {msg.type === 'image' && msg.mediaUrl && (
                                        <img src={msg.mediaUrl} alt="GIF" className="mt-2 rounded-lg max-w-full" />
                                    )}
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className={`text-[10px] ${isOwn ? 'text-indigo-200' : 'text-slate-500'}`}>
                                            {timeAgo(msg.createdAt)}
                                            {msg.edited && ' (edited)'}
                                        </p>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleReply(msg)}
                                                className={`p-1 hover:bg-white/10 rounded ${isOwn ? 'text-indigo-200 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                                                title="Reply"
                                            >
                                                <Reply className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={() => handlePin(msg.id)}
                                                className={`p-1 hover:bg-white/10 rounded ${isOwn ? 'text-indigo-200 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                                                title="Pin Message"
                                            >
                                                <Pin className="w-3 h-3" />
                                            </button>
                                            {isOwn && (
                                                <>
                                                    <button
                                                        onClick={() => startEditing(msg)}
                                                        className="p-1 hover:bg-white/10 rounded text-indigo-200 hover:text-white"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="w-3 h-3" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteMessage(msg.id)}
                                                        className="p-1 hover:bg-white/10 rounded text-indigo-200 hover:text-red-300"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
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
            <form onSubmit={editingMessageId ? (e) => { e.preventDefault(); handleSaveEdit(); } : handleSend} className="p-4 border-t border-slate-800 bg-slate-900/80 backdrop-blur-sm relative">
                {replyingTo && (
                    <div className="flex items-center justify-between bg-slate-800/50 p-2 rounded-lg mb-2 border-l-2 border-accent-indigo">
                        <div className="flex flex-col">
                            <span className="text-xs text-accent-indigo font-semibold">
                                Replying to {replyingTo.senderId === user?.uid ? 'You' : recipientName}
                            </span>
                            <span className="text-xs text-slate-400 truncate max-w-[200px]">
                                {replyingTo.text}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setReplyingTo(null)}
                            className="text-slate-400 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {showEmojiPicker && (
                    <EmojiPicker
                        onEmojiClick={(emojiData) => {
                            setNewMessage(prev => prev + emojiData.emoji);
                        }}
                        onClose={() => setShowEmojiPicker(false)}
                    />
                )}

                {showGifPicker && (
                    <GifPicker
                        onGifClick={(gif, e) => {
                            e.preventDefault();
                            handleSendGif(gif.images.fixed_height.url);
                            setShowGifPicker(false);
                        }}
                        onClose={() => setShowGifPicker(false)}
                    />
                )}

                <div className="flex gap-2 items-center">
                    <button
                        type="button"
                        onClick={() => {
                            setShowEmojiPicker(!showEmojiPicker);
                            setShowGifPicker(false);
                        }}
                        className={`p-2 rounded-full transition-colors ${showEmojiPicker ? 'text-accent-indigo bg-accent-indigo/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                    >
                        <Smile className="w-6 h-6" />
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setShowGifPicker(!showGifPicker);
                            setShowEmojiPicker(false);
                        }}
                        className={`p-2 rounded-full transition-colors ${showGifPicker ? 'text-accent-indigo bg-accent-indigo/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                    >
                        <Image className="w-6 h-6" />
                    </button>

                    <VoiceRecorder
                        onRecordingComplete={handleVoiceRecording}
                        onCancel={() => { }}
                    />

                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => handleTyping(e.target.value)}
                        placeholder={editingMessageId ? "Edit message..." : "Type a message..."}
                        className={`flex-1 bg-slate-800 border-none rounded-full px-4 py-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-accent-indigo focus:outline-none transition-all ${editingMessageId ? 'ring-2 ring-yellow-500/50' : ''}`}
                    />

                    {editingMessageId ? (
                        <div className="flex gap-1">
                            <button
                                type="button"
                                onClick={cancelEditing}
                                className="p-2 bg-slate-700 text-slate-300 rounded-full hover:bg-slate-600 transition-all"
                            >
                                <span className="text-xs font-bold">✕</span>
                            </button>
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-all shadow-lg"
                            >
                                <span className="text-xs font-bold">✓</span>
                            </button>
                        </div>
                    ) : (
                        <button
                            type="submit"
                            disabled={!newMessage.trim() || sending}
                            className="p-2 bg-gradient-to-br from-accent-indigo to-accent-violet text-white rounded-full hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-accent-indigo/50"
                        >
                            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    )}
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
