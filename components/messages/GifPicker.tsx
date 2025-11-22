'use client';

import React, { useEffect, useRef, useState } from 'react';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Grid } from '@giphy/react-components';

interface GifPickerProps {
    onGifClick: (gif: any, e: React.SyntheticEvent<HTMLElement, Event>) => void;
    onClose: () => void;
}

const GIPHY_API_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY;

export function GifPicker({ onGifClick, onClose }: GifPickerProps) {
    const pickerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(350);

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

    if (!GIPHY_API_KEY) {
        return (
            <div ref={pickerRef} className="absolute bottom-16 left-4 z-50 bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-2xl w-[350px] h-[400px] flex items-center justify-center text-center">
                <div>
                    <p className="text-white font-bold mb-2">Giphy API Key Missing</p>
                    <p className="text-slate-400 text-sm">Please add NEXT_PUBLIC_GIPHY_API_KEY to your .env.local file.</p>
                </div>
            </div>
        );
    }

    const gf = new GiphyFetch(GIPHY_API_KEY);

    const fetchGifs = (offset: number) => gf.trending({ offset, limit: 10 });

    return (
        <div ref={pickerRef} className="absolute bottom-16 left-4 z-50 bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl w-[350px] h-[450px]">
            <div className="p-2 bg-slate-800 border-b border-slate-700">
                <input
                    type="text"
                    placeholder="Search GIFs..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-indigo"
                    onChange={(e) => {
                        // Implement search logic here if needed, or just use trending for now
                    }}
                />
            </div>
            <div className="h-full overflow-y-auto custom-scrollbar">
                <Grid
                    width={width}
                    columns={2}
                    fetchGifs={fetchGifs}
                    onGifClick={onGifClick}
                    noLink={true}
                />
            </div>
        </div>
    );
}
