"use client";

import Link from "next/link";
import { BrandMark } from "@/components/ui/BrandMark";
import { Twitter, Github, Linkedin, Mail, ArrowRight, Terminal, Command, Cpu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ParallaxElement } from "@/components/ui/ParallaxElement";

export function LandingFooter() {
    return (
        <footer className="bg-[#020617] border-t border-[#6B46FF]/30 pt-24 pb-12 relative overflow-hidden perspective-[1000px]">
            {/* Holographic Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(107,70,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(107,70,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] pointer-events-none transform-gpu rotate-x-12 scale-150 origin-bottom" />

            {/* Top Energy Beam */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#6B46FF] to-transparent shadow-[0_0_20px_#6B46FF]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-[#00D4FF] shadow-[0_0_10px_#00D4FF]" />

            {/* Floating Parallax Elements */}
            <ParallaxElement speed={0.05} className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 right-20 opacity-10"><Command className="w-64 h-64 text-[#6B46FF]" /></div>
                <div className="absolute bottom-20 left-20 opacity-10"><Cpu className="w-48 h-48 text-[#00D4FF]" /></div>
            </ParallaxElement>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-20">
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-6 group">
                            <div className="relative">
                                <BrandMark tagline="" size={40} variant="glow" showName={false} />
                                <div className="absolute inset-0 bg-[#6B46FF] blur-[20px] opacity-20 group-hover:opacity-40 transition-opacity" />
                            </div>
                            <span className="text-3xl font-black text-white tracking-tight">EduMate <span className="text-[#00D4FF]">AI</span></span>
                        </Link>
                        <p className="text-slate-400 mb-8 leading-relaxed font-light text-lg">
                            The intelligent skill engine that adapts to your unique learning style.
                            <br />
                            <span className="text-[#6B46FF] font-mono text-sm mt-2 block">// SYSTEM STATUS: ONLINE</span>
                        </p>
                        <div className="flex gap-4">
                            <SocialLink href="#" icon={Twitter} label="TWITTER_UPLINK" />
                            <SocialLink href="#" icon={Github} label="GITHUB_REPO" />
                            <SocialLink href="#" icon={Linkedin} label="LINKEDIN_NODE" />
                            <SocialLink href="#" icon={Mail} label="MAIL_RELAY" />
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-1 h-4 bg-[#6B46FF] rounded-full" />
                            PRODUCT
                        </h4>
                        <ul className="space-y-4 text-slate-400">
                            <FooterLink href="/features">Features</FooterLink>
                            <FooterLink href="/pricing">Pricing</FooterLink>
                            <FooterLink href="/roadmap">Roadmap</FooterLink>
                            <FooterLink href="/changelog">Changelog</FooterLink>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-1 h-4 bg-[#00D4FF] rounded-full" />
                            RESOURCES
                        </h4>
                        <ul className="space-y-4 text-slate-400">
                            <FooterLink href="/docs">Documentation</FooterLink>
                            <FooterLink href="/blog">Blog</FooterLink>
                            <FooterLink href="/community">Community</FooterLink>
                            <FooterLink href="/help">Help Center</FooterLink>
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-1 h-4 bg-[#00E676] rounded-full" />
                            DATA UPLINK
                        </h4>
                        <p className="text-slate-400 mb-6 text-sm">
                            Subscribe to the neural feed for the latest updates.
                        </p>
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6B46FF] to-[#00D4FF] rounded-xl opacity-30 group-hover:opacity-100 transition duration-500 blur" />
                            <div className="relative flex bg-[#020617] rounded-xl p-1">
                                <div className="flex items-center pl-3 text-slate-500">
                                    <Terminal className="w-4 h-4" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="enter_email_address..."
                                    className="bg-transparent border-none px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-0 w-full font-mono text-sm"
                                />
                                <Button className="bg-white text-slate-950 hover:bg-[#00D4FF] hover:text-white rounded-lg px-4 transition-colors font-bold">
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 relative">
                    <div className="text-slate-500 text-xs font-mono">
                        © 2025 EDUMATE_AI // ALL_RIGHTS_RESERVED
                    </div>
                    <div className="flex gap-8 text-xs font-mono text-slate-500">
                        <Link href="/privacy" className="hover:text-[#00D4FF] transition-colors hover:underline decoration-[#00D4FF]/50 underline-offset-4">PRIVACY_PROTOCOL</Link>
                        <Link href="/terms" className="hover:text-[#00D4FF] transition-colors hover:underline decoration-[#00D4FF]/50 underline-offset-4">TERMS_OF_SERVICE</Link>
                        <Link href="/cookies" className="hover:text-[#00D4FF] transition-colors hover:underline decoration-[#00D4FF]/50 underline-offset-4">COOKIE_SETTINGS</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
    return (
        <a
            href={href}
            className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-[#6B46FF] hover:text-white hover:border-[#6B46FF] hover:shadow-[0_0_15px_#6B46FF] transition-all duration-300 group relative"
            aria-label={label}
        >
            <Icon className="w-5 h-5" />
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#020617] text-white text-[10px] font-mono px-2 py-1 rounded border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {label}
            </span>
        </a>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <li>
            <Link href={href} className="hover:text-[#00D4FF] transition-colors flex items-center gap-2 group w-fit">
                <span className="w-1 h-1 bg-slate-600 rounded-full group-hover:bg-[#00D4FF] group-hover:scale-150 transition-all duration-300" />
                <span className="group-hover:translate-x-1 transition-transform duration-300">{children}</span>
            </Link>
        </li>
    );
}
