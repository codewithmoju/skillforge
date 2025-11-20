"use client";

import { useState } from "react";
import { Bell, Flame, Search, LogOut } from "lucide-react";
import { useUserStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/hooks/useAuth";
import { AuthModal } from "@/components/features/AuthModal";

export function TopBar() {
    const { xp, level, streak } = useUserStore();
    const { user, logout } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    return (
        <header className="h-20 px-8 flex items-center justify-between bg-transparent sticky top-0 z-40 backdrop-blur-sm">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative w-96 hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search your roadmaps, projects, or posts..."
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo/50 transition-all placeholder:text-slate-600"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* Streak */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500">
                    <Flame className="w-4 h-4 fill-orange-500" />
                    <span className="font-bold text-sm">{streak} Day Streak</span>
                </div>

                {/* XP & Level */}
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <div className="text-xs text-text-secondary font-medium">Level {level}</div>
                        <div className="text-sm font-bold text-accent-cyan">{xp} XP</div>
                    </div>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-indigo to-accent-violet p-0.5">
                                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="font-bold text-white">{user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}</span>
                                    )}
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={logout} className="hidden md:flex">
                                <LogOut className="w-4 h-4 mr-2" /> Logout
                            </Button>
                        </div>
                    ) : (
                        <Button size="sm" onClick={() => setIsAuthModalOpen(true)}>
                            Get Started
                        </Button>
                    )}
                </div>

                {/* Notifications */}
                <button className="relative p-2 rounded-full hover:bg-slate-800 transition-colors text-text-secondary hover:text-text-primary">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-status-error border-2 border-slate-900"></span>
                </button>
            </div>

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </header>
    );
}