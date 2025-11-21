"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function SplashScreen() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <motion.div
                    animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center"
                >
                    <Image
                        src="/icons/MyLogo.png"
                        alt="EduMate AI Logo"
                        width={48}
                        height={48}
                        className="object-contain"
                    />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl font-bold text-white mb-4"
                >
                    EduMate AI
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-slate-400"
                >
                    Loading your learning journey...
                </motion.p>

                <motion.div
                    className="mt-8 flex gap-2 justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-3 h-3 rounded-full bg-accent-cyan"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                        />
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
}
