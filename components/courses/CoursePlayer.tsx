"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Play, Pause, Volume2, VolumeX, Maximize2, Minimize2,
    Settings, SkipBack, SkipForward, FileText, Brain,
    MessageSquare, CheckCircle, Clock, ChevronRight, Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { CourseLesson } from "@/lib/types/courseTypes";

interface CoursePlayerProps {
    lesson: CourseLesson;
    onComplete: () => void;
    onNext: () => void;
    onPrevious: () => void;
    isFirst: boolean;
    isLast: boolean;
}

/**
 * Immersive Course Player
 * Features: Theater mode, interactive transcript, AI notes, custom controls
 */
export function CoursePlayer({ lesson, onComplete, onNext, onPrevious, isFirst, isLast }: CoursePlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [showTranscript, setShowTranscript] = useState(false);
    const [showAiNotes, setShowAiNotes] = useState(false);

    // Mock transcript data
    const transcript = [
        { time: 0, text: "Welcome to this lesson on " + lesson.title },
        { time: 5, text: "In this video, we'll cover the fundamental concepts." },
        { time: 15, text: "Let's start by looking at the basic structure." },
        { time: 30, text: "As you can see, this pattern repeats throughout the system." },
        { time: 45, text: "Now, let's try to implement this ourselves." },
    ];

    // Mock AI Notes
    const aiNotes = [
        { time: 10, content: "Key Concept: Component Structure" },
        { time: 25, content: "Important: Remember to handle state updates correctly" },
        { time: 50, content: "Tip: Use the useEffect hook for side effects" },
    ];

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateTime = () => setCurrentTime(video.currentTime);
        const updateDuration = () => setDuration(video.duration);
        const onEnded = () => {
            setIsPlaying(false);
            onComplete();
        };

        video.addEventListener("timeupdate", updateTime);
        video.addEventListener("loadedmetadata", updateDuration);
        video.addEventListener("ended", onEnded);

        return () => {
            video.removeEventListener("timeupdate", updateTime);
            video.removeEventListener("loadedmetadata", updateDuration);
            video.removeEventListener("ended", onEnded);
        };
    }, [onComplete]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            setIsMuted(newVolume === 0);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            videoRef.current?.parentElement?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
        <div className={cn(
            "relative w-full bg-black rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 group",
            isFullscreen ? "h-screen rounded-none" : "aspect-video"
        )}>
            {/* Video Element */}
            <video
                ref={videoRef}
                src={lesson.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"} // Fallback video
                className="w-full h-full object-cover"
                onClick={togglePlay}
            />

            {/* Overlay Gradient */}
            <div className={cn(
                "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-300",
                showControls || !isPlaying ? "opacity-100" : "opacity-0"
            )} />

            {/* Center Play Button */}
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl"
                    >
                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </motion.div>
                </div>
            )}

            {/* Side Panels (Transcript / AI Notes) */}
            <AnimatePresence>
                {showTranscript && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        className="absolute top-0 right-0 w-80 h-full bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 p-6 overflow-y-auto z-20"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-400" />
                                Transcript
                            </h3>
                            <button onClick={() => setShowTranscript(false)} className="text-slate-400 hover:text-white">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {transcript.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "p-3 rounded-lg transition-colors cursor-pointer",
                                        currentTime >= item.time && currentTime < (transcript[idx + 1]?.time || duration)
                                            ? "bg-blue-500/20 border border-blue-500/30"
                                            : "hover:bg-slate-800/50"
                                    )}
                                    onClick={() => {
                                        if (videoRef.current) videoRef.current.currentTime = item.time;
                                    }}
                                >
                                    <span className="text-xs text-slate-500 font-mono mb-1 block">{formatTime(item.time)}</span>
                                    <p className="text-sm text-slate-300">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {showAiNotes && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        className="absolute top-0 right-0 w-80 h-full bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 p-6 overflow-y-auto z-20"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Brain className="w-5 h-5 text-purple-400" />
                                AI Notes
                            </h3>
                            <button onClick={() => setShowAiNotes(false)} className="text-slate-400 hover:text-white">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {aiNotes.map((note, idx) => (
                                <div key={idx} className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Star className="w-3 h-3 text-purple-400 fill-purple-400" />
                                        <span className="text-xs text-purple-300 font-mono">{formatTime(note.time)}</span>
                                    </div>
                                    <p className="text-sm text-slate-200">{note.content}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Controls Bar */}
            <div
                className={cn(
                    "absolute bottom-0 left-0 right-0 p-6 transition-transform duration-300 z-10",
                    showControls || !isPlaying ? "translate-y-0" : "translate-y-full"
                )}
                onMouseEnter={() => setShowControls(true)}
            >
                {/* Progress Bar */}
                <div className="group/progress relative h-1 bg-slate-700/50 rounded-full mb-4 cursor-pointer">
                    <div
                        className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                    <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleSeek}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity"
                        style={{ left: `${(currentTime / duration) * 100}%` }}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={togglePlay}
                            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                        >
                            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-white" />}
                        </button>

                        <div className="flex items-center gap-2 group/volume">
                            <button onClick={toggleMute} className="text-white hover:text-blue-400 transition-colors">
                                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                            </button>
                            <div className="w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-300">
                                <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.1}
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    className="w-20 h-1 bg-slate-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                                />
                            </div>
                        </div>

                        <span className="text-sm font-mono text-slate-300">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                setShowTranscript(!showTranscript);
                                setShowAiNotes(false);
                            }}
                            className={cn(
                                "p-2 rounded-lg transition-colors",
                                showTranscript ? "bg-blue-500/20 text-blue-400" : "hover:bg-white/10 text-slate-300"
                            )}
                            title="Transcript"
                        >
                            <FileText className="w-5 h-5" />
                        </button>

                        <button
                            onClick={() => {
                                setShowAiNotes(!showAiNotes);
                                setShowTranscript(false);
                            }}
                            className={cn(
                                "p-2 rounded-lg transition-colors",
                                showAiNotes ? "bg-purple-500/20 text-purple-400" : "hover:bg-white/10 text-slate-300"
                            )}
                            title="AI Notes"
                        >
                            <Brain className="w-5 h-5" />
                        </button>

                        <div className="w-px h-6 bg-slate-700 mx-2" />

                        <button onClick={toggleFullscreen} className="text-white hover:text-blue-400 transition-colors">
                            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
