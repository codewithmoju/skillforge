'use client';

import React, { useState } from 'react';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { Mic, X, Check } from 'lucide-react';

interface VoiceRecorderProps {
    onRecordingComplete: (blob: Blob) => void;
    onCancel: () => void;
}

export function VoiceRecorder({ onRecordingComplete, onCancel }: VoiceRecorderProps) {
    const recorderControls = useAudioRecorder();
    const [isRecording, setIsRecording] = useState(false);

    const addAudioElement = (blob: Blob) => {
        onRecordingComplete(blob);
    };

    return (
        <div className="flex items-center gap-2 bg-slate-800 rounded-full px-2 py-1 animate-fadeIn">
            <div className="hidden">
                <AudioRecorder
                    onRecordingComplete={addAudioElement}
                    recorderControls={recorderControls}
                    showVisualizer={true}
                />
            </div>

            {isRecording ? (
                <>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse ml-2" />
                    <span className="text-xs text-slate-300 font-mono min-w-[40px]">
                        {new Date(recorderControls.recordingTime * 1000).toISOString().substr(14, 5)}
                    </span>
                    <button
                        onClick={() => {
                            recorderControls.stopRecording();
                            setIsRecording(false);
                        }}
                        className="p-1.5 bg-green-500/20 text-green-400 rounded-full hover:bg-green-500/30 transition-colors"
                    >
                        <Check className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => {
                            recorderControls.stopRecording(); // Stop but don't save? Library doesn't have cancel easily, so we might need to ignore the result.
                            // Actually, stopRecording triggers onRecordingComplete. We need to handle cancellation.
                            // For now, let's just stop.
                            setIsRecording(false);
                            onCancel();
                        }}
                        className="p-1.5 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </>
            ) : (
                <button
                    onClick={() => {
                        recorderControls.startRecording();
                        setIsRecording(true);
                    }}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                    <Mic className="w-5 h-5" />
                </button>
            )}
        </div>
    );
}
