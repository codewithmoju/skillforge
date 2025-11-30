"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, Volume2, Mic } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PodcastPlayerProps {
    script: { speaker: string; text: string }[];
    onClose: () => void;
    primaryColor?: string;
}

export const PodcastPlayer: React.FC<PodcastPlayerProps> = ({ script, onClose, primaryColor = "#4f46e5" }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentLine, setCurrentLine] = useState(0);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const synth = useRef<SpeechSynthesis | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (!window.speechSynthesis) {
                setError("Speech synthesis is not supported in this browser.");
                return;
            }
            synth.current = window.speechSynthesis;

            const loadVoices = () => {
                const availableVoices = synth.current?.getVoices() || [];
                setVoices(availableVoices);
            };

            loadVoices();
            if (synth.current?.onvoiceschanged !== undefined) {
                synth.current.onvoiceschanged = loadVoices;
            }
        }

        return () => {
            if (synth.current) {
                synth.current.cancel();
            }
        };
    }, []);

    const speakLine = (index: number) => {
        if (!synth.current || index >= script.length) {
            setIsPlaying(false);
            return;
        }

        const line = script[index];
        const utterance = new SpeechSynthesisUtterance(line.text);
        utteranceRef.current = utterance;

        // Ensure voices are loaded
        let currentVoices = voices;
        if (currentVoices.length === 0) {
            currentVoices = synth.current.getVoices();
            if (currentVoices.length > 0) {
                setVoices(currentVoices);
            }
        }

        // Assign voices (heuristic: try to find male/female or just different ones)
        const voice1 = currentVoices.find(v => v.name.includes("Google US English")) || currentVoices[0];
        const voice2 = currentVoices.find(v => v.name.includes("Google UK English Male")) || currentVoices[1] || voice1;

        if (voice1 && voice2) {
            utterance.voice = line.speaker === "Alex" ? voice1 : voice2;
        }

        utterance.rate = 1.1; // Slightly faster for energy
        utterance.pitch = line.speaker === "Alex" ? 1.1 : 0.9; // Alex higher, Sam lower

        console.log(`Speaking line ${index}: ${line.speaker} - ${line.text.substring(0, 20)}...`);

        utterance.onend = () => {
            if (index < script.length - 1) {
                setCurrentLine(index + 1);
                speakLine(index + 1);
            } else {
                setIsPlaying(false);
                setCurrentLine(0);
            }
        };

        utterance.onerror = (e) => {
            if (e.error === 'interrupted' || e.error === 'canceled') return;
            console.error("Speech synthesis error:", e);
            setIsPlaying(false);
        };

        synth.current.speak(utterance);
    };

    const togglePlay = () => {
        if (!synth.current) return;

        if (isPlaying) {
            synth.current.pause();
            setIsPlaying(false);
        } else {
            if (synth.current.paused) {
                synth.current.resume();
            } else {
                speakLine(currentLine);
            }
            setIsPlaying(true);
        }
    };

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 right-6 z-[120] w-96 bg-black/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
        >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-bold tracking-widest uppercase text-slate-400">Live Podcast</span>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                </Button>
            </div>

            {/* Visualizer Area */}
            <div className="h-32 relative flex items-center justify-center gap-1 bg-gradient-to-b from-transparent to-indigo-500/10">
                {isPlaying ? (
                    [...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                height: [10, Math.random() * 60 + 20, 10],
                            }}
                            transition={{
                                duration: 0.5,
                                repeat: Infinity,
                                repeatType: "reverse",
                                delay: i * 0.05
                            }}
                            className="w-1.5 rounded-full"
                            style={{ backgroundColor: primaryColor }}
                        />
                    ))
                ) : (
                    <div className="flex items-center gap-2 text-slate-500">
                        <Volume2 className="w-5 h-5" />
                        <span className="text-sm font-medium">Paused</span>
                    </div>
                )}
            </div>

            {/* Controls & Transcript */}
            <div className="p-6 space-y-4">
                {error ? (
                    <div className="text-red-400 text-center text-sm font-bold bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                        {error}
                    </div>
                ) : (
                    <>
                        <div className="text-center">
                            <h4 className="text-white font-bold text-lg mb-1">{script[currentLine]?.speaker || "Loading..."}</h4>
                            <p className="text-slate-400 text-sm line-clamp-2 h-10">
                                {script[currentLine]?.text || "..."}
                            </p>
                        </div>

                        <div className="flex justify-center pt-2">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={togglePlay}
                                className="w-14 h-14 rounded-full flex items-center justify-center transition-transform"
                                style={{ backgroundColor: primaryColor, boxShadow: `0 0 20px ${primaryColor}66` }}
                            >
                                {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white ml-1" />}
                            </motion.button>
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
};
