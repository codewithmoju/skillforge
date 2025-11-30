"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BrandMark } from "@/components/ui/BrandMark";
import { cn } from "@/lib/utils";

const navLinks = [
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Blog", href: "/blog" },
    { name: "Docs", href: "/docs" },
    { name: "About", href: "/about" },
];

export function LandingNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
                <motion.nav
                    initial={{ y: -100, width: "100%", opacity: 0 }}
                    animate={{
                        y: 0,
                        marginTop: isScrolled ? "1.5rem" : "0rem",
                        width: isScrolled ? "90%" : "100%",
                        maxWidth: isScrolled ? "1100px" : "100%",
                        opacity: 1,
                    }}
                    transition={{
                        duration: 0.6,
                        ease: "easeInOut"
                    }}
                    className="pointer-events-auto"
                >
                    <motion.div
                        animate={{
                            borderRadius: isScrolled ? "9999px" : "0px",
                            backgroundColor: isScrolled ? "rgba(2, 6, 23, 0.8)" : "rgba(2, 6, 23, 0)",
                            borderColor: isScrolled ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0)",
                            backdropFilter: isScrolled ? "blur(16px)" : "blur(0px)",
                            paddingLeft: isScrolled ? "1.5rem" : "2rem",
                            paddingRight: isScrolled ? "1.5rem" : "2rem",
                            paddingTop: isScrolled ? "0.75rem" : "1.25rem",
                            paddingBottom: isScrolled ? "0.75rem" : "1.25rem",
                            boxShadow: isScrolled
                                ? "0 10px 40px -10px rgba(0,0,0,0.5)"
                                : "none",
                        }}
                        transition={{
                            duration: 0.6,
                            ease: "easeInOut"
                        }}
                        className="flex items-center justify-between border border-transparent transition-all duration-300 w-full mx-auto"
                    >
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
                                        pathname === link.href ? "text-white" : "text-slate-400"
                                    )}
                                >
                                    {link.name}
                                    {pathname === link.href && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute inset-0 bg-white/10 rounded-full"
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}
                                </Link>
                            ))}
                        </div>

                        <div className="hidden md:flex items-center gap-4">
                            <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                                Log in
                            </Link>
                            <Link href="/signup">
                                <Button
                                    className={cn(
                                        "font-semibold transition-all duration-300",
                                        isScrolled
                                            ? "bg-white text-slate-950 hover:bg-slate-200 rounded-full px-6 h-10"
                                            : "bg-white text-slate-950 hover:bg-slate-200 rounded-xl px-6 h-11 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                    )}
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
                    </motion.div>
                </motion.nav>
            </div>

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
