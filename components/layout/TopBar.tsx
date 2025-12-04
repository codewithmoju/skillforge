"use client";

import { Bell, Flame, Search, LogOut } from "lucide-react";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useUserStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import { useSkinContext } from "@/lib/contexts/SkinContext";

export function TopBar() {
    const { xp, level, streakData } = useUserStore();
    const streak = streakData.currentStreak;
    const { user, logout } = useAuth();
    const skinContext = useSkinContext();
    const { shouldApplySkin, colors } = skinContext || { shouldApplySkin: false, colors: null };
    const safeColors = shouldApplySkin && colors ? colors : null;

    return (
        <header
            className="hidden md:flex h-20 px-8 items-center justify-between fixed top-0 right-0 left-20 z-40 backdrop-blur-md transition-all duration-500"
            style={{
                backgroundColor: safeColors ? `${safeColors.background}CC` : "rgba(15, 23, 42, 0.6)",
            }}
        >
            <div className="flex items-center gap-4 flex-1">
                <div className="relative w-96 hidden md:block">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-500"
                        style={{ color: safeColors ? safeColors.textMuted : undefined }}
                    />
                    <input
                        type="text"
                        placeholder="Search your roadmaps, projects, or posts..."
                        className="w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm transition-all duration-500"
                        style={{
                            backgroundColor: safeColors ? `${safeColors.backgroundCard}80` : undefined,
                            borderColor: safeColors ? `${safeColors.primary}40` : undefined,
                            color: safeColors ? safeColors.textPrimary : undefined,
                        }}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = safeColors ? safeColors.accent : "";
                            e.currentTarget.style.boxShadow = safeColors
                                ? `0 0 0 1px ${safeColors.accent}50`
                                : "";
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = safeColors ? `${safeColors.primary}40` : "";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <NotificationBell />
                {/* Streak */}
                <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-500"
                    style={{
                        backgroundColor: safeColors ? `${safeColors.warning}20` : undefined,
                        borderColor: safeColors ? `${safeColors.warning}40` : undefined,
                        color: safeColors ? safeColors.warning : undefined,
                    }}
                >
                    <Flame
                        className="w-4 h-4"
                        style={{
                            fill: safeColors ? safeColors.warning : undefined,
                            color: safeColors ? safeColors.warning : undefined,
                        }}
                    />
                    <span className="font-bold text-sm">{streak} Day Streak</span>
                </div>

                {/* XP & Level */}
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <div
                            className="text-xs font-medium transition-colors duration-500"
                            style={{ color: safeColors ? safeColors.textSecondary : undefined }}
                        >
                            Level {level}
                        </div>
                        <div
                            className="text-sm font-bold transition-colors duration-500"
                            style={{ color: safeColors ? safeColors.accent : undefined }}
                        >
                            {xp} XP
                        </div>
                    </div>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-indigo to-accent-violet p-0.5">
                                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                                    {user.photoURL ? (
                                        <Image
                                            src={user.photoURL}
                                            alt={user.displayName || "User"}
                                            width={40}
                                            height={40}
                                            className="w-full h-full object-cover"
                                        />
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
                        <Link href="/signup">
                            <Button size="sm">
                                Get Started
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}