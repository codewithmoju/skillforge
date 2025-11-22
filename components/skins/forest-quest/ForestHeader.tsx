"use client";

import { Bell, Flame, Search, LogOut, Menu } from "lucide-react";
import { useUserStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";

interface ForestHeaderProps {
    onMenuClick?: () => void;
}

export function ForestHeader({ onMenuClick }: ForestHeaderProps) {
    const { xp, level, streak } = useUserStore();
    const { user, logout } = useAuth();

    return (
        <header className="flex h-20 md:h-24 px-4 md:px-8 items-center justify-between sticky top-0 z-40 transition-all duration-500 font-serif">
            {/* Mobile Menu Button */}
            <button
                onClick={onMenuClick}
                className="md:hidden p-2 mr-2 text-[#8b7355] hover:text-[#e2d5c3] hover:bg-[#2d4a22]/30 rounded-lg transition-colors relative z-50"
            >
                <Menu className="w-6 h-6" />
            </button>
            {/* Canopy Background */}
            <div className="absolute inset-0 bg-[#0f1f0f]/90 backdrop-blur-md border-b border-[#2d4a22] shadow-lg z-0">
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415-.828-.828-.828.828-1.415-1.415.828-.828-.828-.828 1.415-1.415.828.828.828-.828 1.415 1.415-.828.828zM22.485 22.485l.83.828-1.415 1.415-.828-.828-.828.828-1.415-1.415.828-.828-.828-.828 1.415-1.415.828.828.828-.828 1.415 1.415-.828.828zM0 54.627l.828.83-1.415 1.415-.828-.828-.828.828L-2.83 54.627l.828-.828-.828-.828 1.415-1.415.828.828.828-.828 1.415 1.415-.828.828zM22.485 54.627l.83.828-1.415 1.415-.828-.828-.828.828-1.415-1.415.828-.828-.828-.828 1.415-1.415.828.828.828-.828 1.415 1.415-.828.828zM54.627 22.485l.83.828-1.415 1.415-.828-.828-.828.828-1.415-1.415.828-.828-.828-.828 1.415-1.415.828.828.828-.828 1.415 1.415-.828.828zM54.627 54.627l.83.828-1.415 1.415-.828-.828-.828.828-1.415-1.415.828-.828-.828-.828 1.415-1.415.828.828.828-.828 1.415 1.415-.828.828zM22.485 0l.83.828-1.415 1.415-.828-.828-.828.828-1.415-1.415.828-.828-.828-.828 1.415-1.415.828.828.828-.828 1.415 1.415-.828.828zM0 22.485l.828.83-1.415 1.415-.828-.828-.828.828L-2.83 22.485l.828-.828-.828-.828 1.415-1.415.828.828.828-.828 1.415 1.415-.828.828zM0 0l.828.828-1.415 1.415-.828-.828-.828.828L-2.83 0l.828-.828-.828-.828 1.415-1.415.828.828.828-.828 1.415 1.415-.828.828z' fill='%2322c55e' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            {/* Search Bar - Ancient Scroll Style */}
            <div className="relative z-10 flex items-center gap-4 flex-1">
                <div className="relative w-96 hidden md:block group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b7355] group-hover:text-emerald-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Consult the archives..."
                        className="w-full bg-[#1a2f16]/50 border border-[#2d4a22] rounded-lg pl-10 pr-4 py-3 text-sm text-[#e2d5c3] placeholder-[#6b5a45] focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-inner"
                    />
                </div>
            </div>

            <div className="relative z-10 flex items-center gap-6">
                {/* Streak - Spirit Fire */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-amber-900/50 bg-amber-950/30 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                    <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
                    <span className="font-bold text-sm text-amber-200">{streak} Day Spirit</span>
                </div>

                {/* XP & Level - Mana */}
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <div className="text-xs font-medium text-[#8b7355]">Circle {level}</div>
                        <div className="text-sm font-bold text-emerald-400 text-shadow-sm">{xp} Mana</div>
                    </div>

                    {user ? (
                        <div className="flex items-center gap-4">
                            {/* Avatar Frame - Vine Wreath */}
                            <div className="relative w-12 h-12">
                                <div className="absolute inset-0 rounded-full border-2 border-[#2d4a22] shadow-[0_0_10px_rgba(34,197,94,0.2)]" />
                                <div className="absolute -inset-1 border border-emerald-900/50 rounded-full opacity-50" />
                                <div className="w-full h-full rounded-full overflow-hidden p-1">
                                    {user.photoURL ? (
                                        <Image
                                            src={user.photoURL}
                                            alt={user.displayName || "User"}
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-[#1a2f16] flex items-center justify-center rounded-full">
                                            <span className="font-bold text-emerald-200">{user.displayName?.charAt(0) || "U"}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={logout}
                                className="hidden md:flex text-[#8b7355] hover:text-red-400 hover:bg-red-950/30"
                            >
                                <LogOut className="w-4 h-4 mr-2" /> Leave
                            </Button>
                        </div>
                    ) : (
                        <Link href="/signup">
                            <Button size="sm" className="bg-emerald-700 hover:bg-emerald-600 text-emerald-100 border border-emerald-500/30">
                                Begin Journey
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Notifications - Whispers */}
                <button className="relative p-2 rounded-full hover:bg-[#2d4a22]/30 transition-colors group">
                    <Bell className="w-5 h-5 text-[#8b7355] group-hover:text-emerald-400 transition-colors" />
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981] animate-pulse" />
                </button>
            </div>
        </header>
    );
}
