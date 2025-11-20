"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Github, Globe, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";

// This page handles the 404 for projects by providing a placeholder
// In a real app, this would fetch project data from Firestore
export default function ProjectPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.projectId as string;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading
        setTimeout(() => setLoading(false), 1000);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm md:text-base">Back</span>
                    </button>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Project Details</h1>
                    <p className="text-slate-400">Project ID: {projectId}</p>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-xl md:rounded-2xl p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                        {/* Project Image Placeholder */}
                        <div className="w-full md:w-1/3 aspect-video bg-gradient-to-br from-accent-indigo/20 to-accent-violet/20 rounded-xl flex items-center justify-center border border-slate-700">
                            <span className="text-slate-400">Project Preview</span>
                        </div>

                        {/* Project Info */}
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-white mb-2">Awesome Project</h2>
                            <p className="text-slate-300 mb-4">
                                This is a placeholder for the project details page. In the future, this will display the full project description, technologies used, and more.
                            </p>

                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm border border-blue-500/20">React</span>
                                <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm border border-cyan-500/20">TypeScript</span>
                                <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm border border-purple-500/20">Tailwind</span>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="outline" className="flex items-center gap-2">
                                    <Github className="w-4 h-4" />
                                    View Code
                                </Button>
                                <Button className="flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    Live Demo
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
