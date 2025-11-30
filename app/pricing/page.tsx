"use client";

import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const plans = [
    {
        name: "Free",
        price: "0",
        description: "Perfect for getting started with AI learning.",
        features: [
            "5 AI Roadmaps per month",
            "Basic Interactive Labs",
            "Community Access",
            "Standard Support",
        ],
        cta: "Start for Free",
        popular: false,
    },
    {
        name: "Pro",
        price: "19",
        description: "Unlock unlimited potential and advanced features.",
        features: [
            "Unlimited AI Roadmaps",
            "Advanced Labs & Projects",
            "Priority Support",
            "Certificate of Completion",
            "Offline Mode",
            "Custom Learning Styles",
        ],
        cta: "Get Pro",
        popular: true,
    },
    {
        name: "Team",
        price: "49",
        description: "Collaborate and learn together with your team.",
        features: [
            "Everything in Pro",
            "Team Analytics Dashboard",
            "Shared Projects",
            "Admin Controls",
            "SSO Integration",
            "Dedicated Success Manager",
        ],
        cta: "Contact Sales",
        popular: false,
    },
];

export default function PricingPage() {
    const [annual, setAnnual] = useState(true);

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30">
            <LandingNavbar />

            <main className="pt-32 pb-20">
                <section className="text-center max-w-7xl mx-auto px-6 mb-20">
                    <h1 className="text-5xl md:text-7xl font-black mb-6">
                        Simple, Transparent <span className="text-blue-500">Pricing</span>
                    </h1>
                    <p className="text-xl text-slate-400 mb-12">
                        Choose the plan that fits your learning journey.
                    </p>

                    <div className="flex items-center justify-center gap-4 mb-16">
                        <span className={cn("text-lg font-medium", !annual ? "text-white" : "text-slate-500")}>Monthly</span>
                        <button
                            onClick={() => setAnnual(!annual)}
                            className="w-16 h-8 rounded-full bg-slate-800 relative p-1 transition-colors hover:bg-slate-700"
                        >
                            <motion.div
                                animate={{ x: annual ? 32 : 0 }}
                                className="w-6 h-6 rounded-full bg-blue-500 shadow-lg"
                            />
                        </button>
                        <span className={cn("text-lg font-medium", annual ? "text-white" : "text-slate-500")}>
                            Yearly <span className="text-green-400 text-sm ml-1 font-bold">-20%</span>
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={cn(
                                    "relative p-8 rounded-3xl border flex flex-col text-left",
                                    plan.popular
                                        ? "bg-slate-900/80 border-blue-500/50 shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]"
                                        : "bg-slate-950/50 border-white/10"
                                )}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> Most Popular
                                    </div>
                                )}

                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-4xl font-black">${annual ? (Number(plan.price) * 0.8).toFixed(0) : plan.price}</span>
                                    <span className="text-slate-500">/month</span>
                                </div>
                                <p className="text-slate-400 mb-8 h-12">{plan.description}</p>

                                <ul className="space-y-4 mb-8 flex-1">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3 text-slate-300">
                                            <Check className="w-5 h-5 text-green-400 shrink-0" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    className={cn(
                                        "w-full h-12 rounded-xl font-bold text-lg",
                                        plan.popular
                                            ? "bg-blue-600 hover:bg-blue-500 text-white"
                                            : "bg-white/10 hover:bg-white/20 text-white"
                                    )}
                                >
                                    {plan.cta}
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        <FaqItem
                            question="Can I cancel anytime?"
                            answer="Yes, you can cancel your subscription at any time. You'll keep access until the end of your billing period."
                        />
                        <FaqItem
                            question="How does the AI generation work?"
                            answer="Our advanced AI analyzes your topic and learning goals to create a structured curriculum, complete with lessons, quizzes, and projects."
                        />
                        <FaqItem
                            question="Is there a student discount?"
                            answer="Yes! We offer 50% off for students with a valid .edu email address. Contact support to apply."
                        />
                    </div>
                </section>
            </main>

            <LandingFooter />
        </div>
    );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-white/10 pb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between text-left text-lg font-medium hover:text-blue-400 transition-colors"
            >
                {question}
                <motion.div animate={{ rotate: isOpen ? 45 : 0 }}>
                    <X className="w-5 h-5" />
                </motion.div>
            </button>
            <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                className="overflow-hidden"
            >
                <p className="pt-4 text-slate-400 leading-relaxed">{answer}</p>
            </motion.div>
        </div>
    );
}
