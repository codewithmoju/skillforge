"use client";

import React, { useState, useEffect } from 'react';
import { ForestSidebar } from './ForestSidebar';
import { ForestHeader } from './ForestHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

// Particle Component
const ForestParticles = () => {
    const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; size: number }>>([]);

    useEffect(() => {
        // Generate particles only on client side to avoid hydration mismatch
        const newParticles = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            delay: Math.random() * 20,
            size: Math.random() * 4 + 2
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full bg-emerald-400/20 blur-[1px]"
                    style={{
                        left: `${p.x}%`,
                        width: p.size,
                        height: p.size,
                    }}
                    initial={{ y: "110vh", opacity: 0 }}
                    animate={{
                        y: "-10vh",
                        opacity: [0, 0.5, 0],
                        x: [`${p.x}%`, `${p.x + (Math.random() * 10 - 5)}%`]
                    }}
                    transition={{
                        duration: Math.random() * 15 + 15,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "linear"
                    }}
                />
            ))}
            {/* Fireflies */}
            {particles.slice(0, 5).map((p) => (
                <motion.div
                    key={`firefly-${p.id}`}
                    className="absolute w-1 h-1 rounded-full bg-yellow-400/60 blur-[2px]"
                    style={{ left: `${p.x}%`, top: '50%' }}
                    animate={{
                        x: [0, 50, -50, 0],
                        y: [0, -50, 50, 0],
                        opacity: [0, 1, 0]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        times: [0, 0.2, 0.8, 1]
                    }}
                />
            ))}
        </div>
    );
};

import { usePathname } from 'next/navigation';

// ... (keep existing imports)

import { Sidebar } from "@/components/layout/Sidebar";

// ... (keep existing imports)

export function ForestQuestWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isMessagesPage = pathname === "/messages";
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#050a05] text-[#e2d5c3] font-sans selection:bg-emerald-500/30 relative">
            {/* Ambient Particles */}
            <ForestParticles />

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Mobile Sidebar */}
            <div className="md:hidden">
                <ForestSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            </div>

            {/* Desktop Sidebar (Standard) */}
            <Sidebar />

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-h-screen md:ml-20 relative z-10 transition-all duration-300">
                {!isMessagesPage && <ForestHeader onMenuClick={() => setIsSidebarOpen(true)} />}

                <main className={`flex-1 overflow-y-auto relative ${isMessagesPage
                    ? 'h-screen p-0'
                    : 'p-4 md:p-8'
                    }`}>
                    {children}
                </main>
            </div>
        </div>
    );
}
