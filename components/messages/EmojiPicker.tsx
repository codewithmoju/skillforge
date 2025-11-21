'use client';

import EmojiPickerReact, { EmojiClickData, Theme } from 'emoji-picker-react';
import { useEffect, useRef } from 'react';

interface EmojiPickerProps {
    onEmojiClick: (emojiData: EmojiClickData) => void;
    onClose: () => void;
}

export function EmojiPicker({ onEmojiClick, onClose }: EmojiPickerProps) {
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <div ref={pickerRef} className="absolute bottom-16 left-4 z-50 shadow-2xl rounded-2xl overflow-hidden border border-slate-700">
            <EmojiPickerReact
                onEmojiClick={onEmojiClick}
                theme={Theme.DARK}
                lazyLoadEmojis={true}
                searchDisabled={false}
                width={350}
                height={450}
                previewConfig={{ showPreview: false }}
            />
        </div>
    );
}
