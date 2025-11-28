"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, Sparkles, ArrowRight, Check } from "lucide-react";
import { CourseRecommendation } from "@/lib/types/courseTypes";
import { getCourseRecommendations } from "@/lib/services/courses";
import { CourseCard3D } from "@/components/courses/CourseCard3D";

/**
 * AI Recommendations Component
 * Features: Neural network visualization, confidence scores, and personalized suggestions
 */
export function AIRecommendations() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRecommendations();
    }, []);

    const loadRecommendations = async () => {
        try {
            const data = await getCourseRecommendations("user-id");
            setRecommendations(data);
        } catch (error) {
            console.error("Failed to load recommendations:", error);
        } finally {
            setLoading(false);
        }
    };

    // Neural Network Animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let nodes: { x: number; y: number; vx: number; vy: number }[] = [];
        let connections: { from: number; to: number; active: number }[] = [];

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            initNodes();
        };

        const initNodes = () => {
            nodes = [];
            connections = [];
            const nodeCount = 30;

            for (let i = 0; i < nodeCount; i++) {
                nodes.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                });
            }

            // Create random connections
            for (let i = 0; i < nodeCount; i++) {
                for (let j = i + 1; j < nodeCount; j++) {
                    if (Math.random() > 0.85) {
                        connections.push({ from: i, to: j, active: 0 });
                    }
                }
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw connections
            connections.forEach(conn => {
                const nodeA = nodes[conn.from];
                const nodeB = nodes[conn.to];
                const dist = Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y);

                if (dist < 200) {
                    // Randomly activate connections
                    if (Math.random() > 0.99) conn.active = 1;
                    if (conn.active > 0) conn.active -= 0.02;

                    ctx.beginPath();
                    ctx.moveTo(nodeA.x, nodeA.y);
                    ctx.lineTo(nodeB.x, nodeB.y);
                    ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 + conn.active * 0.5})`;
                    ctx.lineWidth = 1 + conn.active * 2;
                    ctx.stroke();
                }
            });

            // Update and draw nodes
            nodes.forEach(node => {
                node.x += node.vx;
                node.y += node.vy;

                if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

                ctx.beginPath();
                ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = "#60A5FA";
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener("resize", resize);
        resize();
        draw();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    if (loading) return null;

    return (
        <div className="relative py-20 overflow-hidden">
            {/* Neural Network Background */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
            />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex items-center gap-4 mb-12">
                    <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
                        <Brain className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-white">AI Recommendations</h2>
                        <p className="text-slate-400">Personalized learning path based on your goals</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Top Recommendation */}
                    {recommendations.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative group"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl opacity-20 group-hover:opacity-40 blur-xl transition-opacity" />
                            <div className="relative p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2 text-green-400 font-bold bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                                        <Sparkles className="w-4 h-4" />
                                        <span>{(recommendations[0].confidence * 100).toFixed(0)}% Match</span>
                                    </div>
                                    <span className="text-slate-400 text-sm">Based on your profile</span>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-4">{recommendations[0].course.title}</h3>
                                <p className="text-slate-300 mb-6">{recommendations[0].course.description}</p>

                                <div className="space-y-3 mb-8">
                                    {recommendations[0].reasons.map((reason, idx) => (
                                        <div key={idx} className="flex items-center gap-3 text-slate-400">
                                            <Check className="w-5 h-5 text-blue-500" />
                                            <span>{reason}</span>
                                        </div>
                                    ))}
                                </div>

                                <button className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group-hover:scale-[1.02]">
                                    Start Learning Path
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Other Recommendations */}
                    <div className="space-y-6">
                        {recommendations.slice(1, 4).map((rec, idx) => (
                            <motion.div
                                key={rec.course.id}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/30 transition-colors group cursor-pointer"
                            >
                                <div className="w-24 h-24 rounded-xl bg-slate-800 flex-shrink-0 overflow-hidden relative">
                                    {/* Placeholder for thumbnail */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                                            {rec.course.title}
                                        </h4>
                                        <span className="text-xs font-bold text-green-400">
                                            {(rec.confidence * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-400 line-clamp-2 mb-3">
                                        {rec.course.shortDescription}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                                            {rec.course.difficulty}
                                        </span>
                                        <span>•</span>
                                        <span>{Math.floor(rec.course.totalDuration / 60)}h {rec.course.totalDuration % 60}m</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
