"use client";

import { useState } from "react";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { DocsSearch } from "@/components/docs/DocsSearch";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LandingNavbar } from "@/components/landing/LandingNavbar";

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-200 selection:bg-blue-500/30">
            <LandingNavbar />

            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
                <div className="flex flex-col lg:flex-row lg:gap-10">

                    {/* Mobile Search & Menu Toggle */}
                    <div className="lg:hidden flex flex-col gap-4 mb-8">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
                            >
                                {isMobileMenuOpen ? <X /> : <Menu />}
                            </button>
                            <div className="flex-1">
                                <DocsSearch />
                            </div>
                        </div>

                        <AnimatePresence>
                            {isMobileMenuOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <DocsSidebar className="py-4 border-t border-white/5" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-64 shrink-0 fixed top-24 bottom-0 overflow-y-auto pb-10 pr-2 scrollbar-hide">
                        <div className="mb-8 sticky top-0 bg-[#0F172A] z-10 py-2">
                            <DocsSearch />
                        </div>
                        <DocsSidebar />
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0 lg:pl-72 pb-16">
                        <div className="prose prose-invert prose-slate max-w-none prose-headings:scroll-mt-28 prose-headings:font-display prose-headings:font-bold prose-p:leading-relaxed prose-pre:bg-slate-900/50 prose-pre:border prose-pre:border-white/10">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
