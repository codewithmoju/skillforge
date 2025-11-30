"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, MessageSquare, Mic } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { cleanTextForTTS } from "@/lib/utils/tts-cleaner";

interface Message {
    role: 'user' | 'ai';
    content: string;
}

interface AISenseiProps {
    lessonContext: {
        title: string;
        sectionContent: string;
    };
    codeContext: string;
    primaryColor: string;
    onInteractionStart?: () => void;
    onInteractionEnd?: () => void;
    checkTopic?: (question: string) => boolean;
}

export function AISensei({ lessonContext, codeContext, primaryColor, onInteractionStart, onInteractionEnd, checkTopic }: AISenseiProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ai', content: "Greetings! I am your AI Sensei. 🥋 Stuck? Confused? Ask me anything about this lesson!" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const [isListening, setIsListening] = useState(false);

    const speakResponse = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop any previous speech
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1;

            // robust voice loading
            let voices = window.speechSynthesis.getVoices();
            const setVoice = () => {
                const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Natural')) || voices[0];
                if (preferredVoice) utterance.voice = preferredVoice;
                window.speechSynthesis.speak(utterance);
            };

            if (voices.length === 0) {
                window.speechSynthesis.onvoiceschanged = () => {
                    voices = window.speechSynthesis.getVoices();
                    setVoice();
                };
            } else {
                setVoice();
            }
        }
    };

    const handleVoiceInput = () => {
        if (isListening) return; // Prevent multiple starts

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Voice input is not supported in this browser. Please use Chrome or Edge.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            console.log("🎤 Voice recognition started");
        };

        recognition.onend = () => {
            setIsListening(false);
            console.log("🎤 Voice recognition ended");
        };

        recognition.onerror = (event: any) => {
            console.error("🎤 Voice recognition error:", event.error);
            setIsListening(false);
            if (event.error === 'not-allowed') {
                alert("Microphone access denied. Please allow microphone access.");
            } else if (event.error === 'no-speech') {
                alert("No speech detected. Please try again and speak closer to the microphone.");
            } else if (event.error === 'audio-capture') {
                alert("No microphone found. Please ensure your microphone is connected and working.");
            }
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            console.log("🎤 Heard:", transcript);
            setInput(transcript);
            // Optional: Auto-send after a short delay if confidence is high
            // handleSend(); 
        };

        try {
            recognition.start();
        } catch (err) {
            console.error("Failed to start recognition:", err);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user' as const, content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Notify parent to pause podcast (if applicable)
        if (onInteractionStart) onInteractionStart();

        try {
            // 1. Generate Audio Assets (Podcast Mode Only)
            let callerAudioUrl: string | null = null;
            let hostIntroUrl: string | null = null;

            if (onInteractionStart) {
                try {
                    // A. Generate Caller Audio
                    const cleanedQuestion = cleanTextForTTS(userMsg.content);
                    const callerRes = await fetch('/api/ai/tts', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: cleanedQuestion, speaker: 'Caller' })
                    });
                    if (callerRes.ok) {
                        const blob = await callerRes.blob();
                        callerAudioUrl = URL.createObjectURL(blob);
                    }

                    // B. Generate Host Intro
                    const intros = [
                        "Whoa, hold on! We've got a caller patching in! Go ahead!",
                        "Wait a second, incoming call! You're on the air!",
                        "System alert! We have a listener on the line! What's up?",
                        "Hold that thought! Let's hear from our listener!"
                    ];
                    const randomIntro = intros[Math.floor(Math.random() * intros.length)];
                    const introRes = await fetch('/api/ai/tts', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: randomIntro, speaker: 'Alex' })
                    });
                    if (introRes.ok) {
                        const blob = await introRes.blob();
                        hostIntroUrl = URL.createObjectURL(blob);
                    }
                } catch (e) {
                    console.error("Failed to generate interaction audio", e);
                }
            }

            // 2. Determine Reply (Smart Logic vs AI)
            let reply = "";
            if (checkTopic && checkTopic(userMsg.content)) {
                reply = "That's a fantastic question! We're actually going to dive deep into that in just a moment, so stay tuned!";
            } else {
                const history: any[] = [];
                const res = await fetch('/api/ai/sensei', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: [...messages, userMsg],
                        codeContext,
                        lessonContext,
                        userHistory: history
                    })
                });
                const data = await res.json();
                reply = data.reply;
            }

            if (reply) {
                setMessages(prev => [...prev, { role: 'ai', content: reply }]);

                // 3. Play Audio Sequence (Podcast Mode)
                if (onInteractionStart && callerAudioUrl && hostIntroUrl) {
                    try {
                        const cleanedAnswer = cleanTextForTTS(reply);
                        const hostRes = await fetch('/api/ai/tts', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ text: cleanedAnswer, speaker: 'Alex' })
                        });

                        if (hostRes.ok) {
                            const blob = await hostRes.blob();
                            const hostAnswerUrl = URL.createObjectURL(blob);

                            // Sequence: Host Intro -> Caller -> Host Answer -> Resume
                            const introAudio = new Audio(hostIntroUrl);
                            const callerAudio = new Audio(callerAudioUrl);
                            const answerAudio = new Audio(hostAnswerUrl);

                            introAudio.onended = () => callerAudio.play();
                            callerAudio.onended = () => answerAudio.play();
                            answerAudio.onended = () => {
                                if (onInteractionEnd) onInteractionEnd();
                            };

                            introAudio.play();
                        } else {
                            if (onInteractionEnd) onInteractionEnd();
                        }
                    } catch (e) {
                        console.error("Failed to play interaction sequence", e);
                        if (onInteractionEnd) onInteractionEnd();
                    }
                } else {
                    // Standard Mode
                    speakResponse(reply);
                }
            }
        } catch (error) {
            console.error("Sensei error:", error);
            setMessages(prev => [...prev, { role: 'ai', content: "My meditation was interrupted. Please try again. 🧘" }]);
            if (onInteractionEnd) onInteractionEnd();
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Floating Trigger Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className={cn(
                    "fixed bottom-8 right-8 z-[100] w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-300",
                    isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
                )}
                style={{
                    backgroundColor: primaryColor,
                    boxShadow: `0 0 30px ${primaryColor}66`
                }}
            >
                <Bot className="w-8 h-8" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
            </motion.button>

            {/* Chat Interface */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-8 right-8 z-50 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] rounded-3xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-xl flex flex-col"
                        style={{ backgroundColor: "#0f172aee" }}
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">AI Sensei</h3>
                                    <p className="text-xs text-slate-400 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                        Online & Ready
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="hover:bg-white/10 rounded-full w-8 h-8 p-0">
                                <X className="w-4 h-4 text-slate-400" />
                            </Button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={scrollRef}>
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "flex gap-3 max-w-[85%]",
                                        msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                                        msg.role === 'user' ? "bg-slate-700" : "bg-indigo-500/20 text-indigo-400"
                                    )}>
                                        {msg.role === 'user' ? <div className="w-4 h-4 bg-slate-400 rounded-full" /> : <Bot className="w-4 h-4" />}
                                    </div>
                                    <div className={cn(
                                        "p-3 rounded-2xl text-sm leading-relaxed",
                                        msg.role === 'user'
                                            ? "bg-slate-700 text-white rounded-tr-none"
                                            : "bg-indigo-500/10 text-indigo-100 border border-indigo-500/20 rounded-tl-none"
                                    )}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex gap-3 max-w-[85%]">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-1">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 rounded-tl-none flex gap-1 items-center">
                                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-white/5 bg-white/5">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="relative flex items-center gap-2"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={isListening ? "Listening..." : "Ask about code or concepts..."}
                                    className={cn(
                                        "flex-1 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors",
                                        isListening && "border-red-500/50 animate-pulse"
                                    )}
                                />
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleVoiceInput}
                                    className={cn(
                                        "rounded-xl w-12 h-11 flex items-center justify-center transition-all",
                                        isListening ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse" : "bg-slate-800 hover:bg-slate-700"
                                    )}
                                >
                                    <Mic className="w-4 h-4 text-white" />
                                </motion.button>
                                <Button
                                    type="submit"
                                    disabled={!input.trim() || isTyping}
                                    className="rounded-xl w-12 h-11 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
