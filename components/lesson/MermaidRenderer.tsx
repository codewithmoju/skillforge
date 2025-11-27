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
                theme: "dark",
                securityLevel: "loose",
                fontFamily: "Inter, sans-serif",
            });

            const renderChart = async () => {
                try {
                    const { svg } = await mermaid.render(`mermaid-${Date.now()}`, chart);
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
        <div
            ref={ref}
            className={`w-full overflow-x-auto flex justify-center p-4 transition-opacity duration-500 ${isRendered ? 'opacity-100' : 'opacity-0'}`}
        />
    );
}
