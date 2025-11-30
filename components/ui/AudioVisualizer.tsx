"use client";

import { useEffect, useRef } from "react";

interface AudioVisualizerProps {
    analyser: AnalyserNode | null;
    isPlaying: boolean;
    primaryColor?: string;
    secondaryColor?: string;
    barWidth?: number;
    gap?: number;
    barCount?: number;
}

export const AudioVisualizer = ({
    analyser,
    isPlaying,
    primaryColor = "#6366f1", // Indigo
    secondaryColor = "#a855f7", // Purple
    barWidth = 6,
    gap = 4,
    barCount = 32
}: AudioVisualizerProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current || !analyser) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        let animationId: number;

        const renderFrame = () => {
            animationId = requestAnimationFrame(renderFrame);

            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Calculate bar dimensions based on canvas size
            // We only use the lower frequency range (bass/mids) for better visuals
            const usableDataLength = Math.floor(bufferLength * 0.6);
            const step = Math.floor(usableDataLength / barCount);

            const centerX = canvas.width / 2;

            for (let i = 0; i < barCount; i++) {
                const dataIndex = i * step;
                const value = dataArray[dataIndex];

                // Scale height
                const percent = value / 255;
                const height = Math.max(4, percent * (canvas.height * 0.8));

                // Dynamic color blending
                const gradient = ctx.createLinearGradient(0, canvas.height / 2 - height / 2, 0, canvas.height / 2 + height / 2);
                gradient.addColorStop(0, primaryColor);
                gradient.addColorStop(1, secondaryColor);

                ctx.fillStyle = gradient;

                // Mirrored layout (center outward)
                const xOffset = (barWidth + gap) * i;

                // Right side
                ctx.fillRect(centerX + xOffset, (canvas.height - height) / 2, barWidth, height);

                // Left side (if not center bar)
                if (i > 0) {
                    ctx.fillRect(centerX - xOffset, (canvas.height - height) / 2, barWidth, height);
                }
            }
        };

        if (isPlaying) {
            renderFrame();
        } else {
            // Draw flat line or idle state
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#334155";
            for (let i = 0; i < barCount; i++) {
                const xOffset = (barWidth + gap) * i;
                const centerX = canvas.width / 2;
                ctx.fillRect(centerX + xOffset, (canvas.height - 4) / 2, barWidth, 4);
                if (i > 0) ctx.fillRect(centerX - xOffset, (canvas.height - 4) / 2, barWidth, 4);
            }
        }

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, [analyser, isPlaying, primaryColor, secondaryColor, barWidth, gap, barCount]);

    return (
        <canvas
            ref={canvasRef}
            width={barCount * (barWidth + gap) * 2}
            height={100}
            className="w-full h-full"
        />
    );
};
