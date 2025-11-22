"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Map, FolderKanban, Users, UserCircle, Settings, LogOut, Globe, Trophy, MessageCircle } from "@/lib/icons";
import { useAuth } from "@/lib/hooks/useAuth";
import { getUserData } from "@/lib/services/firestore";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/ui/BrandMark";
import { motion } from "framer-motion";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Roadmap", href: "/roadmap", icon: Map },
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "Social", href: "/social", icon: Users },
    { name: "Messages", href: "/messages", icon: MessageCircle },
    { name: "Achievements", href: "/achievements", icon: Trophy },
    { name: "Explore", href: "/explore", icon: Globe },
];

interface ForestSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function ForestSidebar({ isOpen, onClose }: ForestSidebarProps) {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [username, setUsername] = useState<string>("");

    useEffect(() => {
        if (user) {
            getUserData(user.uid).then(data => {
                if (data?.username) {
                    setUsername(data.username);
                }
            });
        }
    }, [user]);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <aside className={cn(
            "fixed left-0 top-0 z-50 h-screen w-72 flex flex-col transition-transform duration-500 font-serif relative overflow-hidden md:translate-x-0 border-r border-[#2d1b0e] shadow-2xl",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            {/* Wooden Texture Background */}
            <div className="absolute inset-0 bg-[#1a120b] z-0">
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z' fill='%233e2723' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                        backgroundSize: '20px 20px'
                    }}
                />
                {/* Vertical Wood Grain Overlay */}
                <div className="absolute inset-0 opacity-10 bg-repeat-y"
                    style={{
                        backgroundImage: `linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.4) 2%, transparent 5%, rgba(255,255,255,0.05) 6%, transparent 10%)`,
                        backgroundSize: '100px 100%'
                    }}
                />
                {/* Side Borders (Stone/Bark) */}
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-[#2d1b0e] border-l border-[#4a3b2a] shadow-xl" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full p-6">
                {/* Brand - Carved Effect */}
                <div className="mb-8 relative group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-emerald-900/0 via-emerald-900/30 to-emerald-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                    <BrandMark size={36} tagline="Ancient Wisdom" variant="glass" showConnections={true} />
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#8B4513] to-transparent opacity-50" />
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all duration-300 group overflow-hidden",
                                    isActive ? "text-[#e2d5c3]" : "text-[#8b7355] hover:text-[#d4c5b0]"
                                )}
                            >
                                {/* Active Background - Glowing Rune Stone */}
                                {isActive && (
                                    <motion.div
                                        layoutId="forest-active-nav"
                                        className="absolute inset-0 bg-gradient-to-r from-[#2d4a22] to-[#1a2f16] border border-[#4a6741] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] rounded-lg"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        {/* Inner Glow */}
                                        <div className="absolute inset-0 bg-emerald-500/10 animate-pulse" />
                                    </motion.div>
                                )}

                                {/* Hover Effect - Vine Growth */}
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom rounded-r-full" />

                                {/* Icon & Text */}
                                <div className="relative z-10 flex items-center gap-3">
                                    <item.icon
                                        className={cn(
                                            "w-5 h-5 transition-all duration-300",
                                            isActive ? "text-emerald-400 drop-shadow-[0_0_3px_rgba(52,211,153,0.5)]" : "group-hover:text-emerald-500"
                                        )}
                                    />
                                    <span className={cn(
                                        "font-medium tracking-wide",
                                        isActive ? "text-emerald-100 text-shadow-sm" : ""
                                    )}>
                                        {item.name}
                                    </span>
                                </div>

                                {/* Active Indicator (Rune) */}
                                {isActive && (
                                    <motion.div
                                        initial={{ scale: 0, rotate: -45 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        className="absolute right-3 w-2 h-2 bg-emerald-400 rotate-45 shadow-[0_0_5px_#34d399]"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / Profile */}
                <div className="mt-auto pt-6 border-t border-[#3e2723]">
                    {/* Settings & Logout */}
                    <div className="space-y-1">
                        <Link
                            href="/settings"
                            className="flex items-center gap-3 px-4 py-3 text-[#8b7355] hover:text-[#d4c5b0] hover:bg-[#2d1b0e]/50 rounded-lg transition-colors"
                        >
                            <Settings className="w-5 h-5" />
                            <span>Settings</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 w-full text-[#8b7355] hover:text-red-400 hover:bg-red-900/10 rounded-lg transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
