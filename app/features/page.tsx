"use client";

import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { motion } from "framer-motion";
import { Brain, Zap, Globe, Code, Layers, Shield, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/lib/utils";

function FeatureCard({ title, description, icon: Icon, className, delay }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true }}
            className={cn(
                "p-8 rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800/50 transition-colors group",
                className
            )}
        >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Icon className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
            <p className="text-slate-400 leading-relaxed">{description}</p>
        </motion.div>
    );
}

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30">
            <LandingNavbar />

            <main className="pt-32 pb-20">
                {/* Hero */}
                <section className="max-w-7xl mx-auto px-6 mb-32 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-8"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span className="font-medium">Discover the Power of AI Learning</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black mb-8 tracking-tight"
                    >
                        A Complete <span className="text-blue-500">Learning Ecosystem</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl text-slate-400 max-w-3xl mx-auto mb-12"
                    >
                        EduMate AI combines advanced generative AI with gamification and analytics
                        to create the most engaging learning experience ever built.
                    </motion.p>
                </section>

                {/* Feature Grid */}
                <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
                    <FeatureCard
                        title="AI Roadmap Generation"
                        description="Instantly generate comprehensive learning paths for any topic. Our AI breaks down complex subjects into manageable lessons."
                        icon={Brain}
                        delay={0.1}
                        className="lg:col-span-2"
                    />
                    <FeatureCard
                        title="Interactive Labs"
                        description="Practice coding in real-time with our built-in IDE and execution environment."
                        icon={Code}
                        delay={0.2}
                    />
                    <FeatureCard
                        title="Global Community"
                        description="Connect with learners worldwide. Share projects, get feedback, and collaborate."
                        icon={Globe}
                        delay={0.3}
                    />
                    <FeatureCard
                        title="Gamified Progress"
                        description="Earn XP, level up, and unlock achievements. Learning has never been this addictive."
                        icon={Zap}
                        delay={0.4}
                        className="lg:col-span-2"
                    />
                    <FeatureCard
                        title="Smart Analytics"
                        description="Track your learning velocity, retention rates, and skill mastery with detailed charts."
                        icon={Layers}
                        delay={0.5}
                    />
                    <FeatureCard
                        title="Enterprise Security"
                        description="Bank-grade encryption and privacy controls to keep your learning data safe."
                        icon={Shield}
                        delay={0.6}
                    />
                </section>

                {/* Interactive Demo Section (Placeholder for "Show Don't Tell") */}
                <section className="max-w-7xl mx-auto px-6 mb-32">
                    <div className="bg-slate-900 rounded-3xl border border-white/10 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
                        <div className="relative z-10 p-12 md:p-20 text-center">
                            <h2 className="text-4xl md:text-5xl font-bold mb-8">Experience the Magic</h2>
                            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
                                See how EduMate AI transforms a simple topic into a full course in seconds.
                            </p>
                            <div className="relative max-w-3xl mx-auto aspect-video bg-slate-950 rounded-xl border border-white/10 shadow-2xl flex items-center justify-center group cursor-pointer overflow-hidden">
                                <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
                                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                                </div>
                                <span className="absolute bottom-6 text-sm font-medium text-slate-400">Watch Demo (1:30)</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="text-center px-6">
                    <h2 className="text-4xl font-bold mb-8">Ready to start learning?</h2>
                    <Link href="/signup">
                        <Button size="lg" className="h-16 px-10 rounded-2xl bg-white text-slate-950 hover:bg-slate-200 font-bold text-xl">
                            Get Started for Free <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </section>
            </main>

            <LandingFooter />
        </div>
    );
}
