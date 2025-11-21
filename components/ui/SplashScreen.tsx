"use client";

import { motion } from "framer-motion";
import { AnimatedLogo } from "@/components/ui/AnimatedLogo";

export function SplashScreen() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
            {/* Premium background effects */}
            <div className="absolute inset-0">
                {/* Radial gradient spotlight */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-indigo/20 via-slate-950/50 to-slate-950" />

                {/* Subtle animated orbs */}
                <motion.div
                    className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-accent-indigo/10 to-accent-violet/10 blur-3xl"
                    animate={{
                        x: ["-25%", "25%", "-25%"],
                        y: ["-25%", "25%", "-25%"],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    style={{ top: "20%", left: "20%" }}
                />
                <motion.div
                    className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-accent-cyan/10 to-blue-500/10 blur-3xl"
                    animate={{
                        x: ["25%", "-25%", "25%"],
                        y: ["25%", "-25%", "25%"],
                        scale: [1.2, 1, 1.2],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    style={{ bottom: "20%", right: "20%" }}
                />

                {/* Animated grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
            </div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 text-center"
            >
                {/* Premium logo container */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="relative inline-block mb-12"
                >
                    {/* Spotlight behind logo */}
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-indigo/30 to-accent-violet/30 blur-3xl scale-150" />

                    {/* Premium background card */}
                    <div className="relative bg-slate-900/50 backdrop-blur-xl border border-accent-indigo/20 rounded-3xl p-12">
                        {/* Animated border glow */}
                        <motion.div
                            className="absolute inset-0 rounded-3xl bg-gradient-to-r from-accent-indigo via-accent-violet to-accent-cyan opacity-20 blur-xl"
                            animate={{
                                opacity: [0.2, 0.4, 0.2],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />

                        {/* Large animated logo */}
                        <AnimatedLogo size={200} showConnections={true} />
                    </div>
                </motion.div>

                {/* Brand name */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-5xl font-bold mb-4"
                >
                    <span className="bg-gradient-to-r from-white via-slate-200 to-white bg-clip-text text-transparent">
                        EDUMATE AI
                    </span>
                </motion.h1>

                {/* Tagline */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="text-xl text-slate-400 mb-8"
                >
                    Intelligent Skill Engine
                </motion.p>

                {/* Loading indicator */}
                <motion.div
                    className="flex gap-2 justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                >
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-3 h-3 rounded-full bg-gradient-to-r from-accent-indigo to-accent-cyan"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </motion.div>

                {/* Loading text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: 1,
                    }}
                    className="text-sm text-slate-500 mt-4"
                >
                    Loading your learning journey...
                </motion.p>
            </motion.div>
        </div>
    );
}
