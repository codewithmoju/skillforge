"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Database, Server, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store";

export default function ProjectBuilderPage() {
    const router = useRouter();
    const { addProject } = useUserStore();
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);
    const [prompt, setPrompt] = useState("");

    const handleGenerate = () => {
        if (!prompt) return;
        setIsGenerating(true);
        // Simulate AI generation
        setTimeout(() => {
            setIsGenerating(false);
            setHasGenerated(true);
        }, 2000);
    };

    return (
        <div className="min-h-screen h-full flex flex-col lg:flex-row gap-6">
            {/* Left: Input Section */}
            <div className="flex-1 flex flex-col">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold font-heading text-white mb-2">
                        Project Builder <span className="text-accent-cyan">AI</span>
                    </h1>
                    <p className="text-text-secondary">
                        Describe your dream project, and we'll generate a complete technical blueprint.
                    </p>
                </div>

                <Card className="flex-1 flex flex-col border-accent-indigo/20 bg-slate-800/50">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="I want to build a real-time task management app like Trello but with AI features. It should have drag-and-drop, user authentication, and a dark mode..."
                        className="flex-1 w-full bg-transparent border-none resize-none text-lg text-white placeholder:text-slate-600 focus:ring-0 p-0"
                    />
                    <div className="mt-6 flex justify-between items-center border-t border-slate-700/50 pt-4">
                        <div className="text-xs text-slate-500">
                            {prompt.length} characters
                        </div>
                        <Button
                            onClick={handleGenerate}
                            disabled={!prompt || isGenerating}
                            isLoading={isGenerating}
                            leftIcon={!isGenerating && <Wand2 className="w-4 h-4" />}
                            className="bg-gradient-to-r from-accent-violet to-accent-indigo"
                        >
                            {isGenerating ? "Dreaming..." : "Generate Blueprint"}
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Right: Output Section */}
            <div className="flex-1">
                <AnimatePresence mode="wait">
                    {!hasGenerated ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/20"
                        >
                            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                                <Wand2 className="w-8 h-8 text-slate-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-400 mb-2">Ready to Build?</h3>
                            <p className="text-slate-500 max-w-xs">
                                Your AI-generated project architecture, tech stack, and tasks will appear here.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6 h-full overflow-y-auto pr-2"
                        >
                            {/* Tech Stack Card */}
                            <Card className="border-l-4 border-l-accent-cyan">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Server className="w-5 h-5 text-accent-cyan" /> Recommended Stack
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {["Next.js 14", "TypeScript", "Tailwind CSS", "Supabase", "Zustand", "Dnd Kit"].map((tech) => (
                                        <span key={tech} className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-300">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </Card>

                            {/* Core Features */}
                            <Card className="border-l-4 border-l-accent-violet">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-accent-violet" /> Core Features
                                </h3>
                                <ul className="space-y-3">
                                    {[
                                        "User Authentication (Google/GitHub)",
                                        "Kanban Board with Drag & Drop",
                                        "Real-time Updates (WebSockets)",
                                        "AI Task Summarization",
                                        "Dark/Light Mode Toggle"
                                    ].map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-accent-violet shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </Card>

                            {/* Database Schema */}
                            <Card className="border-l-4 border-l-accent-indigo">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Database className="w-5 h-5 text-accent-indigo" /> Database Schema
                                </h3>
                                <div className="space-y-3 font-mono text-xs text-slate-400 bg-slate-950 p-4 rounded-xl border border-slate-800">
                                    <div>
                                        <span className="text-accent-indigo">users</span> (id, email, name, avatar_url)
                                    </div>
                                    <div>
                                        <span className="text-accent-indigo">boards</span> (id, user_id, title, created_at)
                                    </div>
                                    <div>
                                        <span className="text-accent-indigo">columns</span> (id, board_id, title, order)
                                    </div>
                                    <div>
                                        <span className="text-accent-indigo">tasks</span> (id, column_id, content, priority)
                                    </div>
                                </div>
                            </Card>

                            <Button
                                className="w-full"
                                size="lg"
                                onClick={() => {
                                    addProject({
                                        id: Math.random().toString(36).substr(2, 9),
                                        title: "AI Generated Project",
                                        description: prompt,
                                        status: "In Progress",
                                        stack: ["Next.js", "TypeScript", "Tailwind"],
                                        progress: 0,
                                        createdAt: new Date()
                                    });
                                    router.push("/");
                                }}
                            >
                                Save Project & Start Building
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
