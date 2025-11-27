"use client";

import { useState } from "react";
import { CourseLandingHero } from "@/components/courses/CourseLandingHero";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CoursesPage() {
    const [isGenerating, setIsGenerating] = useState(false);
    const router = useRouter();

    const handleGenerate = async (topic: string) => {
        setIsGenerating(true);
        try {
            const res = await fetch('/api/courses/generate-syllabus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, level: 'beginner' }) // Default to beginner for now
            });
            const data = await res.json();
            if (data.syllabus) {
                // Save to localStorage and redirect
                const tempId = `generated-${Date.now()}`;
                localStorage.setItem(`course-${tempId}`, JSON.stringify(data.syllabus));
                router.push(`/courses/${tempId}`);
            }
        } catch (error) {
            console.error("Failed to generate:", error);
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Hero Section with Generator */}
            <CourseLandingHero
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
            />

            {/* Loading Overlay */}
            {isGenerating && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
                    <div className="relative">
                        <div className="w-24 h-24 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-blue-500 animate-pulse" />
                        </div>
                    </div>
                    <p className="mt-8 text-xl font-bold text-white animate-pulse">
                        Constructing Neural Pathways...
                    </p>
                    <p className="text-slate-400 mt-2">
                        AI is designing your custom curriculum
                    </p>
                </div>
            )}
        </div>
    );
}
