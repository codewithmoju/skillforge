"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BrandMark } from "@/components/ui/BrandMark";
import { cn } from "@/lib/utils";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Docs", href: "/docs" },
    { name: "Community", href: "/community" },
    { name: "Blog", href: "/blog" },
];

export function LandingNavbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute top-0 left-0 right-0 z-50 py-6"
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <BrandMark tagline="" size={32} variant="glow" showName={true} />
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "relative px-4 py-2 text-sm font-medium transition-colors rounded-full hover:text-white group",
                                    pathname === link.href ? "text-white" : "text-slate-300"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            Log in
                        </Link>
                        <Link href="/signup">
                            <Button
                                className="bg-white text-[#071A3F] hover:bg-slate-200 rounded-xl px-6 h-11 shadow-[0_0_20px_rgba(255,255,255,0.2)] font-bold transition-all duration-300"
                            >
                                Get Started
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-white p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-slate-950 pt-32 px-6 md:hidden"
                    >
                        <div className="flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-2xl font-bold text-slate-300 hover:text-white hover:pl-4 transition-all duration-300 border-b border-white/5 pb-4"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="flex flex-col gap-4 mt-8">
                                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="outline" className="w-full h-12 text-lg rounded-xl border-slate-700">
                                        Log in
                                    </Button>
                                </Link>
                                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                                    <Button className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-500 text-white rounded-xl">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
