'use client';

import React, { useState, useRef } from 'react';
import { Send, Smile, X } from 'lucide-react';
import { EmojiPicker } from './EmojiPicker';

interface MessageInputProps {
    onSend: (text: string) => Promise<void>;
    onTyping: (isTyping: boolean) => void;
    disabled?: boolean;
}

export function MessageInput({ onSend, onTyping, disabled }: MessageInputProps) {
    const [message, setMessage] = useState('');
    const [showEmoji, setShowEmoji] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || disabled) return;

        const text = message;
        setMessage('');
        setShowEmoji(false);

        await onSend(text);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setMessage(newValue);

        // Handle typing indicator
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        onTyping(true);
        typingTimeoutRef.current = setTimeout(() => {
            onTyping(false);
        }, 1000);
    };

    return (
        <div className="px-6 py-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
            {showEmoji && (
                <div className="absolute bottom-24 left-6 z-50">
                    <div className="relative">
                        <button
                            onClick={() => setShowEmoji(false)}
                            className="absolute -top-2 -right-2 bg-white dark:bg-slate-800 rounded-full p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 shadow-lg transition-colors z-10"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <EmojiPicker
                            onEmojiClick={(emojiData) => setMessage(prev => prev + emojiData.emoji)}
                            onClose={() => setShowEmoji(false)}
                        />
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex gap-3 items-center">
                {/* Emoji Button */}
                <button
                    type="button"
                    onClick={() => setShowEmoji(!showEmoji)}
                    className={`p-2.5 rounded-full transition-all flex-shrink-0 ${showEmoji
                            ? 'text-accent-indigo bg-accent-indigo/10 dark:bg-accent-indigo/20'
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    title="Add emoji"
                >
                    <Smile className="w-5 h-5" />
                </button>

                {/* Input Field */}
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={message}
                        onChange={handleChange}
                        placeholder="Type a message..."
                        className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[24px] px-5 py-3 text-[15px] text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-accent-indigo focus:border-transparent focus:outline-none transition-all"
                        disabled={disabled}
                    />
                </div>

                {/* Send Button */}
                <button
                    type="submit"
                    disabled={!message.trim() || disabled}
                    className="p-3 bg-gradient-to-br from-accent-indigo to-blue-600 text-white rounded-full hover:shadow-lg hover:shadow-accent-indigo/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none flex-shrink-0 group"
                    title="Send message"
                >
                    <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
            </form>
        </div>
    );
}
