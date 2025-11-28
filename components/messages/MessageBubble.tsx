import React, { useState } from 'react';
import { Message } from '@/lib/services/messages';
import { Reply, MoreVertical, Smile, Edit2, Trash2, Pin } from 'lucide-react';
import { MessageReactions } from './MessageReactions';

interface MessageBubbleProps {
    message: Message;
    isOwn: boolean;
    showAvatar: boolean;
    senderName: string;
    onReply: (message: Message) => void;
    onPin: (messageId: string) => void;
    onEdit: (messageId: string) => void;
    onDelete: (messageId: string) => void;
    onAddReaction: (messageId: string, emoji: string) => void;
    onRemoveReaction: (messageId: string, emoji: string) => void;
    currentUserId?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = React.memo(({
    message,
    isOwn,
    showAvatar,
    senderName,
    onReply,
    onPin,
    onEdit,
    onDelete,
    onAddReaction,
    onRemoveReaction,
    currentUserId
}) => {
    const [showMenu, setShowMenu] = useState(false);

    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const isDeleted = message.text === '[Message deleted]';

    if (isDeleted) {
        return (
            <div className={`flex w-full ${isOwn ? 'justify-end' : 'justify-start'} mb-2 px-4`}>
                <div className="italic text-slate-500 text-sm border border-slate-800 rounded-full px-3 py-1 bg-slate-900/50">
                    Message deleted
                </div>
            </div>
        );
    }

    return (
        <div className={`flex w-full ${isOwn ? 'justify-end' : 'justify-start'} mb-1 group relative px-4`}>
            <div className={`flex max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
                {/* Avatar Placeholder */}
                {!isOwn && (
                    <div className="w-8 flex-shrink-0 mb-1">
                        {showAvatar && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center text-white text-xs font-bold shadow-sm ring-2 ring-slate-950">
                                {senderName.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex flex-col relative group/bubble">
                    {/* Message Bubble */}
                    <div
                        className={`
                            relative px-5 py-3 text-[15px] leading-relaxed break-words shadow-sm
                            ${isOwn
                                ? 'bg-gradient-to-br from-accent-indigo to-blue-600 text-white rounded-[22px] rounded-br-md'
                                : 'bg-slate-800 text-slate-100 rounded-[22px] rounded-bl-md border border-slate-700/50'
                            }
                            ${!showAvatar && !isOwn ? 'ml-0' : ''}
                            transition-all duration-200
                        `}
                    >
                        {/* Text Content */}
                        <p className="whitespace-pre-wrap">{message.text}</p>

                        {/* Media Content */}
                        {message.type === 'audio' && message.mediaUrl && (
                            <audio controls src={message.mediaUrl} className="mt-2 w-full max-w-[240px]" />
                        )}
                        {message.type === 'image' && message.mediaUrl && (
                            <img src={message.mediaUrl} alt="Attachment" className="mt-2 rounded-xl max-w-full object-cover" />
                        )}
                    </div>

                    {/* Timestamp & Status */}
                    {showAvatar && (
                        <div className={`mt-1 text-[10px] text-slate-500 font-medium px-1 ${isOwn ? 'text-right' : 'text-left'} opacity-0 group-hover/bubble:opacity-100 transition-opacity`}>
                            {timeAgo(message.createdAt)}
                            {message.edited && <span className="italic ml-1">(edited)</span>}
                        </div>
                    )}
                </div>

                {/* Actions (Hover) - Matches Screenshot: Dots, Reply (Smile/Heart removed) */}
                <div className={`
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2 self-center
                    ${isOwn ? 'flex-row-reverse mr-2' : 'flex-row ml-2'}
                `}>
                    {/* More Options (Dots) */}
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>
                        {/* Dropdown Menu for More Options */}
                        {showMenu && (
                            <div className="absolute bottom-full mb-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1 z-50 min-w-[120px] flex flex-col">
                                <button onClick={() => { onPin(message.id); setShowMenu(false); }} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-left">
                                    <Pin className="w-3.5 h-3.5" /> Pin
                                </button>
                                {isOwn && (
                                    <>
                                        <button onClick={() => { onEdit(message.id); setShowMenu(false); }} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-left">
                                            <Edit2 className="w-3.5 h-3.5" /> Edit
                                        </button>
                                        <button onClick={() => { onDelete(message.id); setShowMenu(false); }} className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-left">
                                            <Trash2 className="w-3.5 h-3.5" /> Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Reply */}
                    <button onClick={() => onReply(message)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" title="Reply">
                        <Reply className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
});

MessageBubble.displayName = 'MessageBubble';
