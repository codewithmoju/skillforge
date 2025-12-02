"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidRendererProps {
    chart: string;
}

export function MermaidRenderer({ chart }: MermaidRendererProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
        if (ref.current && chart) {
            mermaid.initialize({
                startOnLoad: true,
                theme: "base",
                securityLevel: "loose",
                fontFamily: '"Outfit", "Inter", sans-serif',
                themeVariables: {
                    primaryColor: '#1e1b4b', // Indigo 950
                    primaryTextColor: '#e2e8f0', // Slate 200
                    primaryBorderColor: '#6366f1', // Indigo 500
                    lineColor: '#818cf8', // Indigo 400
                    secondaryColor: '#312e81', // Indigo 900
                    tertiaryColor: '#0f172a', // Slate 900
                    fontFamily: '"Outfit", "Inter", sans-serif',
                    fontSize: '16px',
                },
                flowchart: {
                    curve: 'basis',
                    htmlLabels: true,
                }
            });

            const renderChart = async () => {
                try {
                    // Basic sanitization for common LLM errors
                    const sanitizedChart = chart
                        .replace(/console\.log/g, 'Log')
                        .replace(/['"]/g, ''); // Remove quotes which often break labels

                    const { svg } = await mermaid.render(`mermaid-${Date.now()}`, sanitizedChart);
                    if (ref.current) {
                        ref.current.innerHTML = svg;
                        setIsRendered(true);
                    }
                } catch (error) {
                    console.error("Mermaid render failed:", error);
                    if (ref.current) {
                        ref.current.innerHTML = "<div class='text-red-400 text-sm'>Failed to render diagram</div>";
                    }
                }
            };

            renderChart();
        }
    }, [chart]);

    return (
        <div className="relative w-full min-h-[300px] flex justify-center items-center">
            {!isRendered && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/5 rounded-xl animate-pulse">
                    <div className="flex flex-col items-center gap-3 opacity-50">
                        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                        <span className="text-xs font-mono text-indigo-300 uppercase tracking-widest">Rendering Schematic...</span>
                    </div>
                </div>
            )}
            <div
                ref={ref}
                className={`w-full overflow-x-auto flex justify-center p-4 transition-all duration-700 ${isRendered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            />
        </div>
    );
}
