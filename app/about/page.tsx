"use client";

import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30">
            <LandingNavbar />

            <main className="pt-32 pb-20">
                <section className="max-w-7xl mx-auto px-6 mb-32">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-8xl font-black mb-12 tracking-tighter text-center"
                    >
                        We Are <span className="text-blue-500">EduMate AI</span>
                    </motion.h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-32">
                        <div className="text-xl text-slate-400 leading-relaxed space-y-6">
                            <p>
                                Education is the most powerful weapon which you can use to change the world.
                                But for too long, learning has been one-size-fits-all.
                            </p>
                            <p>
                                At EduMate AI, we believe everyone deserves a personalized tutor.
                                One that understands your pace, your interests, and your goals.
                            </p>
                            <p>
                                We're building the future of education—where AI empowers you to master
                                any skill, faster and deeper than ever before.
                            </p>
                        </div>
                        <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-900 border border-white/10">
                            {/* Placeholder for team/office image */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                                <span className="text-slate-500 font-bold">Our Mission Visualized</span>
                            </div>
                        </div>
                    </div>

                    {/* Values */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                        <ValueCard
                            title="Innovation"
                            description="Pushing the boundaries of what's possible with AI in education."
                        />
                        <ValueCard
                            title="Accessibility"
                            description="Making world-class learning available to anyone, anywhere."
                        />
                        <ValueCard
                            title="Community"
                            description="Learning is better together. We foster a global network of curious minds."
                        />
                    </div>
                </section>
            </main>

            <LandingFooter />
        </div>
    );
}

function ValueCard({ title, description }: { title: string; description: string }) {
    return (
        <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/10 hover:border-blue-500/50 transition-colors">
            <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
            <p className="text-slate-400">{description}</p>
        </div>
    );
}
