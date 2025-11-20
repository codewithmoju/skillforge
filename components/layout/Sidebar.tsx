"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Map, FolderKanban, Users, UserCircle, Settings, LogOut, Sparkles, Globe } from "@/lib/icons";
import { useAuth } from "@/lib/hooks/useAuth";
import { getUserData } from "@/lib/services/firestore";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Roadmap", href: "/roadmap", icon: Map },
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "Social", href: "/social", icon: Users },
    { name: "Explore", href: "/explore", icon: Globe }, // New Explore item
];

export function Sidebar() {
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
        <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-background-card/30 backdrop-blur-xl border-r border-slate-700/50 z-50">
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-indigo to-accent-cyan flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold font-heading bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    SkillForge
                </h1>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-accent-indigo/10 text-accent-indigo shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                                    : "text-text-secondary hover:text-text-primary hover:bg-slate-800/50"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "w-5 h-5 transition-colors",
                                    isActive ? "text-accent-indigo" : "text-slate-500 group-hover:text-white"
                                )}
                            />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}

                {/* Profile Link */}
                {username && (
                    <Link
                        href={`/profile/${username}`}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                            pathname.startsWith("/profile")
                                ? "bg-accent-indigo/10 text-accent-indigo shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                                : "text-text-secondary hover:text-text-primary hover:bg-slate-800/50"
                        )}
                    >
                        <UserCircle
                            className={cn(
                                "w-5 h-5 transition-colors",
                                pathname.startsWith("/profile") ? "text-accent-indigo" : "text-slate-500 group-hover:text-white"
                            )}
                        />
                        <span className="font-medium">Profile</span>
                    </Link>
                )}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-text-secondary hover:text-text-primary hover:bg-slate-800/50 transition-all"
                >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Settings</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-status-error/80 hover:text-status-error hover:bg-status-error/10 transition-all mt-1"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}