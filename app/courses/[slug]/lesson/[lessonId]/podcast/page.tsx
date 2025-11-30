"use client";

import { useEffect, useState, useRef, use } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Pause, Volume2, Radio, Wifi, Activity, Cpu, Disc, Zap, Headphones, Mic2, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { DeepSpaceBackground } from "@/components/ui/DeepSpaceBackground";
import { TextGenerateEffect } from "@/components/ui/TextGenerateEffect";
import { AISensei } from "@/components/lesson/AISensei";
import { AudioVisualizer } from "@/components/ui/AudioVisualizer";
import { cleanTextForTTS } from "@/lib/utils/tts-cleaner";

interface LessonContent {
    title: string;
    sections: any[];
}

export default function PodcastPage() {
    const params = useParams();
    const router = useRouter();
    const [content, setContent] = useState<LessonContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [script, setScript] = useState<{ speaker: string; text: string }[] | null>(null);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Audio State
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [currentLine, setCurrentLine] = useState(0);
    const bgMusicRef = useRef<HTMLAudioElement | null>(null);

    // Visualizer State
    const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

    // Audio Queue System
    const audioQueueRef = useRef<Map<number, string>>(new Map()); // Map index -> blob URL
    const mainAudioRef = useRef<HTMLAudioElement | null>(null); // Persistent audio element
    const [isBuffering, setIsBuffering] = useState(false);

    // Cinematic Intro State
    const [introQueue, setIntroQueue] = useState<string[]>([]);
    const [isIntroPlaying, setIsIntroPlaying] = useState(false);
    const [currentIntroIndex, setCurrentIntroIndex] = useState(0);
    const [isIncomingCall, setIsIncomingCall] = useState(false);

    const lessonId = params?.lessonId as string;
    const slug = params?.slug as string;

    console.log("🔍 PodcastPage Params:", { slug, lessonId, params });

    // Defensive check for lessonId
    const [moduleIdx, lessonIdx] = lessonId ? lessonId.split('-').map(Number) : [0, 0];

    // 1. Load Lesson Content
    useEffect(() => {
        if (!slug || !lessonId) {
            console.warn("⚠️ Missing slug or lessonId, skipping load.");
            return;
        }

        const loadLesson = async () => {
            console.log("🚀 Starting loadLesson for:", { slug, lessonId });
            // Try cache first
            const cacheKey = `lesson-${slug}-${moduleIdx}-${lessonIdx}`;
            const cachedContent = localStorage.getItem(cacheKey);

            if (cachedContent) {
                console.log("📦 Found cached content");
                setContent(JSON.parse(cachedContent));
                setLoading(false);
                return;
            }

            // Try Firestore
            try {
                console.log("🔥 Fetching from Firestore...");
                const docRef = doc(db, "courses", slug, "lessons", lessonId);
                const lessonDoc = await getDoc(docRef);

                if (lessonDoc.exists()) {
                    console.log("✅ Document found:", lessonDoc.id);
                    const data = lessonDoc.data() as LessonContent;
                    setContent(data);
                    localStorage.setItem(cacheKey, JSON.stringify(data));
                } else {
                    console.error("❌ Document does not exist");
                    setError("Lesson data not found. Please return to the lesson page.");
                }
            } catch (err) {
                console.error("❌ Failed to load lesson:", err);
                setError("Failed to load secure data stream.");
            } finally {
                console.log("🏁 loadLesson finished, setting loading=false");
                setLoading(false);
            }
        };

        loadLesson();
    }, [slug, lessonId, moduleIdx, lessonIdx]);

    // 2. Generate Script (with Caching)
    useEffect(() => {
        if (!content || script) return;

        const generateScript = async () => {
            // Try cache first
            const cacheKey = `podcast-script-${slug}-${lessonId}`;
            const cachedScript = localStorage.getItem(cacheKey);

            if (cachedScript) {
                console.log("📦 Found cached podcast script");
                const parsedScript = JSON.parse(cachedScript);
                setScript(parsedScript);

                // Start prefetching first few lines
                if (parsedScript && parsedScript.length > 0) {
                    prefetchAudio(0, parsedScript);
                    prefetchAudio(1, parsedScript);
                    prefetchAudio(2, parsedScript);
                }
                return;
            }

            setGenerating(true);
            try {
                const res = await fetch('/api/ai/podcast-script', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: content.title,
                        content: content.sections.map(s => s.content).join('\n\n')
                    })
                });

                if (!res.ok) throw new Error("Failed to generate script");

                const data = await res.json();
                setScript(data.script);
                localStorage.setItem(cacheKey, JSON.stringify(data.script));

                // Start prefetching first few lines
                if (data.script && data.script.length > 0) {
                    // Prefetch first 3 lines
                    prefetchAudio(0, data.script);
                    prefetchAudio(1, data.script);
                    prefetchAudio(2, data.script);
                }

            } catch (err) {
                console.error(err);
                setError("Failed to decrypt neural patterns.");
            } finally {
                setGenerating(false);
            }
        };

        generateScript();
    }, [content, script, slug, lessonId]);

    // 3. Fetch Cinematic Intro (Multi-Speaker)
    useEffect(() => {
        const fetchIntro = async () => {
            try {
                const introSegments = [
                    {
                        text: `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US"><prosody rate="+10%" pitch="-5%">WARNING. SYSTEM OVERRIDE. KNOWLEDGE UPLINK ESTABLISHED.</prosody></speak>`,
                        speaker: "System"
                    },
                    {
                        text: `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US"><prosody rate="+5%" pitch="-2%">You are now locked in to the EDUMATE. A. I. GRID.</prosody></speak>`,
                        speaker: "System"
                    },
                    {
                        text: `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US"><prosody rate="+20%" pitch="+10%">Yo! Welcome back to the future of learning! I'm Alex!</prosody></speak>`,
                        speaker: "Alex"
                    },
                    {
                        text: `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US"><prosody rate="+20%" pitch="+5%">And I'm Sam! We are LIVE from the neural core!</prosody></speak>`,
                        speaker: "Sam"
                    },
                    {
                        text: `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US"><prosody rate="+10%" pitch="-5%">INITIALIZING. DEEP DIVE. NOW.</prosody></speak>`,
                        speaker: "System"
                    }
                ];

                const promises = introSegments.map(seg =>
                    fetch('/api/ai/tts', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(seg)
                    }).then(res => res.ok ? res.blob() : null)
                );

                const blobs = await Promise.all(promises);
                const urls = blobs.filter(b => b !== null).map(b => URL.createObjectURL(b!));
                setIntroQueue(urls);

            } catch (e) {
                console.error("Failed to fetch intro:", e);
            }
        };
        fetchIntro();
    }, []);

    // Initialize Audio Context (Visualizer)
    const initAudioContext = () => {
        if (audioContextRef.current || !mainAudioRef.current) return;

        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContext();
        audioContextRef.current = ctx;

        const analyserNode = ctx.createAnalyser();
        analyserNode.fftSize = 256;
        setAnalyser(analyserNode);

        const source = ctx.createMediaElementSource(mainAudioRef.current);
        source.connect(analyserNode);
        analyserNode.connect(ctx.destination);
        sourceRef.current = source;
    };

    // Prefetch Audio Logic
    const prefetchAudio = async (index: number, currentScript = script) => {
        if (!currentScript || index >= currentScript.length || audioQueueRef.current.has(index)) return;

        try {
            console.log(`Fetching TTS for line ${index}...`);
            const line = currentScript[index];
            const cleanedText = cleanTextForTTS(line.text); // Clean text before TTS

            const res = await fetch('/api/ai/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: cleanedText, speaker: line.speaker })
            });
            // ...

            if (!res.ok) throw new Error(`TTS Failed: ${res.status} ${res.statusText}`);

            const blob = await res.blob();
            console.log(`✅ Received blob for line ${index}, size: ${blob.size} bytes, type: ${blob.type}`);

            if (blob.size < 100) {
                console.warn(`⚠️ Blob for line ${index} is suspiciously small!`);
            }

            const url = URL.createObjectURL(blob);
            audioQueueRef.current.set(index, url);
        } catch (err) {
            console.error(`❌ Failed to prefetch line ${index}:`, err);
        }
    };

    // Playback Logic
    const playLine = async (index: number) => {
        if (!script || index >= script.length) {
            setIsPlaying(false);
            setHasStarted(false);
            setCurrentLine(0);
            return;
        }

        setCurrentLine(index);
        setIsBuffering(true);

        // Ensure current line is ready
        if (!audioQueueRef.current.has(index)) {
            console.log(`⏳ Buffering line ${index}...`);
            await prefetchAudio(index);
        }

        const audioUrl = audioQueueRef.current.get(index);
        if (!audioUrl) {
            console.error("Audio URL missing after fetch");
            setIsBuffering(false);
            return;
        }

        // Use persistent audio element
        if (mainAudioRef.current) {
            mainAudioRef.current.src = audioUrl;
            mainAudioRef.current.playbackRate = 1.0;

            try {
                await mainAudioRef.current.play();
                setIsPlaying(true);
                console.log(`🎶 Playback started for line ${index}`);
            } catch (e) {
                console.error(`❌ Play failed for line ${index}:`, e);
            }

            setIsBuffering(false);
        }

        // Trigger prefetch for next few lines
        prefetchAudio(index + 1);
        prefetchAudio(index + 2);
    };

    const startPlayback = () => {
        console.log("🖱️ Start Playback");
        if (!script) return;

        // Initialize Visualizer Context
        initAudioContext();
        if (audioContextRef.current?.state === 'suspended') {
            audioContextRef.current.resume();
        }

        if (mainAudioRef.current && mainAudioRef.current.paused && hasStarted) {
            mainAudioRef.current.play();
            setIsPlaying(true);
            return;
        }

        // Play Intro First
        if (introQueue.length > 0 && !hasStarted) {
            console.log("📻 Playing Cinematic Intro Sequence");
            setIsIntroPlaying(true);
            setIsPlaying(true);
            setCurrentIntroIndex(0);

            if (mainAudioRef.current) {
                mainAudioRef.current.src = introQueue[0];
                mainAudioRef.current.playbackRate = 1.0;
                mainAudioRef.current.play();
            }
            setHasStarted(true);
        } else {
            playLine(currentLine);
            setHasStarted(true);
        }

        // Start background music
        if (bgMusicRef.current) {
            bgMusicRef.current.volume = 0.1;
            bgMusicRef.current.play().catch(e => console.error("Music play failed:", e));
        }
    };

    const togglePlay = () => {
        if (!script) return;

        if (isPlaying) {
            if (mainAudioRef.current) mainAudioRef.current.pause();
            if (bgMusicRef.current) bgMusicRef.current.pause();
            setIsPlaying(false);
        } else {
            if (audioContextRef.current?.state === 'suspended') {
                audioContextRef.current.resume();
            }
            if (mainAudioRef.current) {
                if (mainAudioRef.current.src) {
                    mainAudioRef.current.play();
                } else {
                    playLine(currentLine);
                }
            }
            if (bgMusicRef.current) bgMusicRef.current.play();
            setIsPlaying(true);
        }
    };

    // UI Constants
    const primaryColor = "#4f46e5";
    const secondaryColor = "#a855f7";
    const accentColor = "#06b6d4";

    // Smart Logic: Check if topic is in remaining script
    const checkTopicInScript = (question: string) => {
        if (!script || currentLine >= script.length) return false;

        const remainingScript = script.slice(currentLine).map(s => s.text.toLowerCase()).join(" ");
        const keywords = question.toLowerCase().split(" ").filter(w => w.length > 4); // Filter short words

        // Check if any significant keyword matches
        return keywords.some(keyword => remainingScript.includes(keyword));
    };

    return (
        <div className="min-h-screen bg-[#030014] text-white overflow-hidden font-sans selection:bg-indigo-500/30 relative">
            <DeepSpaceBackground />

            {/* Persistent Audio Element for Voice */}
            <audio
                ref={mainAudioRef}
                onEnded={() => {
                    if (isIntroPlaying) {
                        const nextIntroIndex = currentIntroIndex + 1;
                        if (nextIntroIndex < introQueue.length) {
                            console.log(`📻 Playing Intro Segment ${nextIntroIndex}`);
                            setCurrentIntroIndex(nextIntroIndex);
                            if (mainAudioRef.current) {
                                mainAudioRef.current.src = introQueue[nextIntroIndex];
                                mainAudioRef.current.play();
                            }
                        } else {
                            console.log("📻 Intro finished, starting main script");
                            setIsIntroPlaying(false);
                            playLine(0);
                        }
                    } else {
                        console.log(`🏁 Line ${currentLine} ended`);
                        // Revoke old URL
                        const oldUrl = audioQueueRef.current.get(currentLine);
                        if (oldUrl) URL.revokeObjectURL(oldUrl);
                        audioQueueRef.current.delete(currentLine);

                        playLine(currentLine + 1);
                    }
                }}

                onError={(e) => {
                    console.error("Audio playback error:", e);
                    setIsBuffering(false);
                    if (isIntroPlaying) {
                        // Skip to next intro segment or main script
                        const nextIntroIndex = currentIntroIndex + 1;
                        if (nextIntroIndex < introQueue.length) {
                            setCurrentIntroIndex(nextIntroIndex);
                            if (mainAudioRef.current) {
                                mainAudioRef.current.src = introQueue[nextIntroIndex];
                                mainAudioRef.current.play();
                            }
                        } else {
                            setIsIntroPlaying(false);
                            playLine(0);
                        }
                    } else {
                        playLine(currentLine + 1);
                    }
                }}
            />

            {/* Background Audio */}
            <audio
                ref={bgMusicRef}
                loop
                src="/audio/lofi-loop.mp3"
                onError={() => console.warn("Background audio failed to load (file missing)")}
            />

            {/* Incoming Call Overlay */}
            <AnimatePresence>
                {isIncomingCall && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md pointer-events-none"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                            className="flex flex-col items-center"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 animate-pulse" />
                                <Phone className="w-24 h-24 text-green-500 animate-bounce relative z-10" />
                            </div>
                            <h2 className="text-5xl font-black text-white tracking-widest uppercase mt-8 animate-pulse drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                                Incoming Call
                            </h2>
                            <div className="flex items-center gap-3 mt-4">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                                <p className="text-green-400 font-mono text-xl tracking-widest">LIVE ON AIR</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center backdrop-blur-sm border-b border-white/5">
                <MagneticButton
                    onClick={() => router.back()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-mono text-xs uppercase tracking-widest">Terminate Link</span>
                </MagneticButton>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                        <Radio className="w-3 h-3" /> Live Feed
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
                        <Wifi className="w-3 h-3" /> Secure
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 container mx-auto h-screen flex flex-col items-center justify-center pt-20 pb-10">

                {/* Central Visualizer / Status */}
                <div className="flex-1 w-full flex flex-col items-center justify-center relative">

                    {/* Loading / Generating State */}
                    <AnimatePresence mode="wait">
                        {(loading || generating) && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                className="text-center space-y-8"
                            >
                                <div className="relative w-48 h-48 mx-auto">
                                    <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin" />
                                    <div className="absolute inset-4 rounded-full border-r-2 border-purple-500 animate-spin animation-delay-2000" />
                                    <div className="absolute inset-8 rounded-full border-b-2 border-cyan-500 animate-spin animation-delay-4000" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Cpu className="w-12 h-12 text-white/50 animate-pulse" />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">
                                        {loading ? "Establishing Uplink..." : "Decrypting Audio Stream..."}
                                    </h2>
                                    <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.2em]">
                                        Processing Neural Data Packets
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Start Overlay (Fix for Autoplay) */}
                        {!loading && !generating && script && !hasStarted && (
                            <motion.div
                                key="start-overlay"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                            >
                                <button
                                    onClick={startPlayback}
                                    className="group relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110"
                                >
                                    <div className="absolute inset-0 bg-indigo-500 rounded-full opacity-20 animate-ping" />
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-[0_0_50px_rgba(79,70,229,0.5)] border border-white/20" />
                                    <Play className="w-12 h-12 text-white fill-current relative z-10 ml-1" />
                                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-bold uppercase tracking-[0.2em] text-indigo-300 group-hover:text-white transition-colors">
                                        Initialize Stream
                                    </div>
                                </button>
                            </motion.div>
                        )}

                        {/* Active Player State */}
                        {!loading && !generating && script && (
                            <motion.div
                                key="player-content"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={cn(
                                    "w-full max-w-6xl flex flex-col items-center gap-12 transition-all duration-1000",
                                    !hasStarted ? "blur-sm scale-95 opacity-50" : "blur-0 scale-100 opacity-100"
                                )}
                            >
                                {/* Holographic Stage */}
                                <div className="flex items-center justify-center gap-8 md:gap-20 w-full">

                                    {/* Alex Avatar */}
                                    <motion.div
                                        animate={{
                                            scale: script[currentLine].speaker === "Alex" ? 1.1 : 0.9,
                                            opacity: script[currentLine].speaker === "Alex" ? 1 : 0.5,
                                            filter: script[currentLine].speaker === "Alex" ? "grayscale(0%)" : "grayscale(100%)"
                                        }}
                                        className="relative group"
                                    >
                                        <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-2 border-indigo-500/50 overflow-hidden relative z-10 bg-black">
                                            <img src="/avatars/alex.png" alt="Alex" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-indigo-500/20 mix-blend-overlay" />
                                        </div>
                                        {/* Holographic Glow */}
                                        <div className="absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full -z-10 animate-pulse" />
                                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center">
                                            <div className="text-indigo-400 font-bold tracking-widest uppercase text-sm">Alex</div>
                                            <div className="text-indigo-500/50 text-[10px] uppercase tracking-widest">Host</div>
                                        </div>
                                    </motion.div>

                                    {/* Central Visualizer */}
                                    <div className="relative w-32 h-32 md:w-48 md:h-48 flex items-center justify-center">
                                        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 to-purple-500/20 blur-3xl rounded-full" />

                                        {/* Real-Time Visualizer */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            {isIntroPlaying ? (
                                                <div className="text-center animate-pulse">
                                                    <div className="text-red-500 font-black text-2xl tracking-widest uppercase drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">ON AIR</div>
                                                    <div className="text-xs text-red-400 font-mono mt-1">EDUMATE RADIO</div>
                                                </div>
                                            ) : (
                                                <AudioVisualizer
                                                    analyser={analyser}
                                                    isPlaying={isPlaying}
                                                    primaryColor={script[currentLine].speaker === "Alex" ? "#6366f1" : "#a855f7"}
                                                    secondaryColor={script[currentLine].speaker === "Alex" ? "#a855f7" : "#ec4899"}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* Sam Avatar */}
                                    <motion.div
                                        animate={{
                                            scale: script[currentLine].speaker === "Sam" ? 1.1 : 0.9,
                                            opacity: script[currentLine].speaker === "Sam" ? 1 : 0.5,
                                            filter: script[currentLine].speaker === "Sam" ? "grayscale(0%)" : "grayscale(100%)"
                                        }}
                                        className="relative group"
                                    >
                                        <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-2 border-purple-500/50 overflow-hidden relative z-10 bg-black">
                                            <img src="/avatars/sam.png" alt="Sam" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-purple-500/20 mix-blend-overlay" />
                                        </div>
                                        {/* Holographic Glow */}
                                        <div className="absolute inset-0 bg-purple-500/30 blur-3xl rounded-full -z-10 animate-pulse" />
                                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center">
                                            <div className="text-purple-400 font-bold tracking-widest uppercase text-sm">Sam</div>
                                            <div className="text-purple-500/50 text-[10px] uppercase tracking-widest">Co-Host</div>
                                        </div>
                                    </motion.div>

                                </div>

                                {/* Transcript / Terminal */}
                                <div className="w-full max-w-3xl bg-[#0a0a16]/80 border border-white/10 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden min-h-[180px] flex flex-col shadow-2xl">
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

                                    <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4 shrink-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Transcript Stream</span>
                                        </div>
                                        <span className={cn(
                                            "text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full",
                                            script[currentLine].speaker === "Alex" ? "bg-indigo-500/20 text-indigo-300" : "bg-purple-500/20 text-purple-300"
                                        )}>
                                            {script[currentLine].speaker} Speaking
                                        </span>
                                    </div>

                                    <div className="flex-1 flex items-center justify-center text-center">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={currentLine}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="text-xl md:text-2xl font-light text-slate-200 leading-relaxed"
                                            >
                                                <TextGenerateEffect words={script[currentLine].text} className="text-slate-200 font-light" />
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Controls - Redesigned */}
                                <div className="flex items-center gap-8">
                                    {/* Speed Control */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                if (mainAudioRef.current) {
                                                    const currentRate = mainAudioRef.current.playbackRate;
                                                    const newRate = currentRate === 1.0 ? 1.2 : currentRate === 1.2 ? 1.5 : 1.0;
                                                    mainAudioRef.current.playbackRate = newRate;
                                                    // Force update to re-render button (hacky, ideally use state)
                                                    setIsPlaying(prev => !prev); setIsPlaying(prev => !prev);
                                                }
                                            }}
                                            className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs font-bold text-slate-400 hover:text-white transition-colors border border-white/5"
                                        >
                                            {mainAudioRef.current?.playbackRate || "1.0"}x
                                        </button>
                                    </div>

                                    {/* Play/Pause */}
                                    <button
                                        onClick={togglePlay}
                                        className="group relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
                                        <div className="absolute inset-0 bg-[#0a0a16] border border-white/10 rounded-full shadow-2xl" />
                                        <div className={cn(
                                            "absolute inset-2 rounded-full border-2 border-dashed border-indigo-500/30 transition-all duration-[10s] ease-linear",
                                            isPlaying ? "animate-spin" : ""
                                        )} />

                                        <div className="relative z-10 text-white">
                                            {isPlaying ? (
                                                <Pause className="w-8 h-8 fill-current drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                                            ) : (
                                                <Play className="w-8 h-8 fill-current ml-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                                            )}
                                        </div>
                                    </button>

                                    {/* Skip Forward */}
                                    <button
                                        onClick={() => {
                                            if (script && currentLine < script.length - 1) {
                                                playLine(currentLine + 1);
                                            }
                                        }}
                                        className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors border border-white/5"
                                    >
                                        <div className="flex items-center">
                                            <Play className="w-3 h-3 fill-current" />
                                            <div className="w-0.5 h-3 bg-current ml-0.5" />
                                        </div>
                                    </button>
                                </div>

                            </motion.div>
                        )}

                        {/* Error State */}
                        {error && (
                            <motion.div
                                key="error-state"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center p-8 border border-red-500/30 bg-red-500/10 rounded-3xl max-w-md"
                            >
                                <Zap className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-red-400 mb-2">System Failure</h3>
                                <p className="text-red-200/70">{error}</p>
                                <Button
                                    onClick={() => window.location.reload()}
                                    className="mt-6 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/50"
                                >
                                    Retry Connection
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* AI Sensei (Ask the Hosts) */}
            <AISensei
                lessonContext={{
                    title: content?.title || "Podcast",
                    sectionContent: "Podcast Session"
                }}
                codeContext=""
                primaryColor={primaryColor}
                onInteractionStart={() => {
                    console.log("📞 Incoming Call...");
                    setIsIncomingCall(true);
                    if (mainAudioRef.current) mainAudioRef.current.pause();
                    if (bgMusicRef.current) bgMusicRef.current.pause();
                    setIsPlaying(false);
                }}
                onInteractionEnd={() => {
                    console.log("📞 Call Ended. Resuming...");
                    setIsIncomingCall(false);
                    if (mainAudioRef.current) mainAudioRef.current.play();
                    if (bgMusicRef.current) bgMusicRef.current.play();
                    setIsPlaying(true);
                }}
                checkTopic={checkTopicInScript}
            />
        </div>
    );
}
