"use client";

import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft, Search, Menu, Sparkles } from "lucide-react";
import { useState } from "react";

interface MobileHeaderProps {
    onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const isNested = pathname.split('/').length > 2;

    return (
        <header className="md:hidden fixed top-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 z-40 safe-area-top">
            <div className="flex items-center justify-between h-14 px-4">
                {/* Left Side */}
                <div className="flex items-center gap-3">
                    {isNested ? (
                        <button
                            onClick={() => router.back()}
                            className="p-2 -ml-2 text-white active:scale-95 transition-transform"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                    ) : (
                        <button
                            onClick={onMenuClick}
                            className="p-2 -ml-2 text-white active:scale-95 transition-transform"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    )}

                    {!isNested && (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-indigo to-accent-cyan flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-white">SkillForge</h1>
                        </div>
                    )}
                </div>

                {/* Right Side */}
                <button
                    onClick={() => router.push('/search')}
                    className="p-2 -mr-2 text-slate-400 hover:text-white active:scale-95 transition-all"
                >
                    <Search className="w-6 h-6" />
                </button>
            </div>
        </header>
    );
}
