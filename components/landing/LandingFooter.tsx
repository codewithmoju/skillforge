"use client";

import Link from "next/link";
import { BrandMark } from "@/components/ui/BrandMark";
import { Twitter, Github, Linkedin, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function LandingFooter() {
    return (
        <footer className="bg-slate-950 border-t border-white/5 pt-20 pb-10 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-20">
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <BrandMark tagline="" size={32} variant="glow" />
                            <span className="text-2xl font-bold text-white">EduMate AI</span>
                        </Link>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            The intelligent skill engine that adapts to your unique learning style.
                            Master any subject with personalized roadmaps and interactive labs.
                        </p>
                        <div className="flex gap-4">
                            <SocialLink href="#" icon={Twitter} />
                            <SocialLink href="#" icon={Github} />
                            <SocialLink href="#" icon={Linkedin} />
                            <SocialLink href="#" icon={Mail} />
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Product</h4>
                        <ul className="space-y-4 text-slate-400">
                            <FooterLink href="/features">Features</FooterLink>
                            <FooterLink href="/pricing">Pricing</FooterLink>
                            <FooterLink href="/roadmap">Roadmap</FooterLink>
                            <FooterLink href="/changelog">Changelog</FooterLink>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Resources</h4>
                        <ul className="space-y-4 text-slate-400">
                            <FooterLink href="/docs">Documentation</FooterLink>
                            <FooterLink href="/blog">Blog</FooterLink>
                            <FooterLink href="/community">Community</FooterLink>
                            <FooterLink href="/help">Help Center</FooterLink>
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="font-bold text-white mb-6">Stay Updated</h4>
                        <p className="text-slate-400 mb-4 text-sm">
                            Join our newsletter for the latest AI learning tips and platform updates.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 w-full transition-all"
                            />
                            <Button className="bg-white text-slate-950 hover:bg-slate-200 rounded-xl px-4">
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-slate-500 text-sm">
                        © 2025 EduMate AI. All rights reserved.
                    </div>
                    <div className="flex gap-8 text-sm text-slate-500">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/cookies" className="hover:text-white transition-colors">Cookie Settings</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon: Icon }: { href: string; icon: any }) {
    return (
        <a
            href={href}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-950 hover:scale-110 transition-all duration-300"
        >
            <Icon className="w-5 h-5" />
        </a>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <li>
            <Link href={href} className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                <span className="w-0 group-hover:w-2 h-px bg-blue-400 transition-all duration-300" />
                {children}
            </Link>
        </li>
    );
}
