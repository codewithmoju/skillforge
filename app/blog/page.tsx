"use client";

import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const articles = [
    {
        id: 1,
        title: "The Future of AI in Education",
        excerpt: "How generative models are reshaping the way we learn and teach.",
        category: "AI Trends",
        readTime: "5 min read",
        image: "bg-gradient-to-br from-blue-500 to-purple-600",
    },
    {
        id: 2,
        title: "Mastering Python in 30 Days",
        excerpt: "A step-by-step guide using EduMate AI's roadmap generator.",
        category: "Learning Guides",
        readTime: "8 min read",
        image: "bg-gradient-to-br from-green-500 to-emerald-600",
    },
    {
        id: 3,
        title: "Gamification Psychology",
        excerpt: "Why earning XP and badges makes you study harder.",
        category: "Science",
        readTime: "6 min read",
        image: "bg-gradient-to-br from-orange-500 to-red-600",
    },
    {
        id: 4,
        title: "New Feature: Interactive Labs",
        excerpt: "Code directly in your browser with our new IDE integration.",
        category: "Product Updates",
        readTime: "3 min read",
        image: "bg-gradient-to-br from-cyan-500 to-blue-600",
    },
];

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30">
            <LandingNavbar />

            <main className="pt-32 pb-20">
                <section className="max-w-7xl mx-auto px-6 mb-20">
                    <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter">
                        The <span className="text-blue-500">Knowledge Hub</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mb-12">
                        Insights, tutorials, and updates from the EduMate AI team.
                    </p>

                    {/* Featured Article */}
                    <div className="relative rounded-3xl overflow-hidden aspect-[21/9] mb-20 group cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-slate-900" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                        <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-3xl">
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-bold mb-4">
                                Featured
                            </span>
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 group-hover:text-blue-300 transition-colors">
                                Revolutionizing Self-Taught Programming
                            </h2>
                            <p className="text-lg text-slate-300 mb-6">
                                Discover how thousands of students are breaking into tech without a degree.
                            </p>
                            <div className="flex items-center gap-2 text-sm font-medium text-white">
                                Read Article <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    {/* Article Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article, index) => (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group cursor-pointer"
                            >
                                <div className={`aspect-video rounded-2xl mb-6 ${article.image} relative overflow-hidden`}>
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-white/10 transition-colors" />
                                </div>
                                <div className="flex items-center gap-4 text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">
                                    <span className="text-blue-400">{article.category}</span>
                                    <span>•</span>
                                    <span>{article.readTime}</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                                    {article.title}
                                </h3>
                                <p className="text-slate-400 leading-relaxed">
                                    {article.excerpt}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>

            <LandingFooter />
        </div>
    );
}
