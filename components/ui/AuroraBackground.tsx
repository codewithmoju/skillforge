"use client";

import { motion } from "framer-motion";

export function AuroraBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#030014]">
            {/* Base Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#2e1065_0%,#000000_50%)]" />

            {/* Aurora Beams */}
            <motion.div
                className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-indigo-600/30 rounded-full blur-[120px] mix-blend-screen"
                animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.2, 1],
                    rotate: [0, 20, 0]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
                className="absolute top-[10%] right-[0%] w-[60%] h-[60%] bg-violet-600/30 rounded-full blur-[120px] mix-blend-screen"
                animate={{
                    x: [0, -100, 0],
                    y: [0, 50, 0],
                    scale: [1.2, 1, 1.2],
                    rotate: [0, -20, 0]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />

            <motion.div
                className="absolute bottom-[-10%] left-[20%] w-[80%] h-[60%] bg-cyan-600/20 rounded-full blur-[120px] mix-blend-screen"
                animate={{
                    x: [0, 50, 0],
                    scale: [1, 1.3, 1],
                }}
                transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            />

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            {/* Noise Texture for "Glass" feel */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("/noise.png")' }} />
        </div>
    );
}
