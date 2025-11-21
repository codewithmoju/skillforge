'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Message, sendMessage, subscribeToMessages, markMessagesAsRead } from '@/lib/services/messages';
import { Send, Loader2 } from 'lucide-react';


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
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!conversationId || !user) return;

        const unsubscribe = subscribeToMessages(conversationId, (msgs) => {
            setMessages(msgs);
            markMessagesAsRead(conversationId, user.uid);
        });

        return () => unsubscribe();
    }, [conversationId, user]);

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
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900/80 backdrop-blur-sm">
                {recipientPhoto ? (
                    <img src={recipientPhoto} alt={recipientName} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center text-white font-bold">
                        {recipientName.charAt(0).toUpperCase()}
                    </div>
                )}
                <div>
                    <h3 className="font-semibold text-white">{recipientName}</h3>
                    <p className="text-xs text-slate-400">Active now</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                    const isOwn = msg.senderId === user?.uid;
                    return (
                        <div
                            key={msg.id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] rounded-2xl px-4 py-2 ${isOwn
                                    ? 'bg-accent-indigo text-white rounded-tr-none'
                                    : 'bg-slate-800 text-slate-200 rounded-tl-none'
                                    }`}
                            >
                                <p>{msg.text}</p>
                                <p className={`text-[10px] mt-1 ${isOwn ? 'text-indigo-200' : 'text-slate-500'}`}>
                                    {timeAgo(msg.createdAt)}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-900/80 backdrop-blur-sm">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-slate-800 border-none rounded-full px-4 py-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-accent-indigo focus:outline-none"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="p-2 bg-accent-indigo text-white rounded-full hover:bg-accent-indigo/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </div>
            </form>
        </div>
    );
}
