"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Map, FolderKanban, Users, UserCircle, Settings, LogOut, Globe, Trophy, MessageCircle } from "@/lib/icons";
import { useAuth } from "@/lib/hooks/useAuth";
import { getUserData } from "@/lib/services/firestore";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/ui/BrandMark";
import { useSkinContext } from "@/lib/contexts/SkinContext";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Roadmap", href: "/roadmap", icon: Map },
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "Social", href: "/social", icon: Users },
    { name: "Messages", href: "/messages", icon: MessageCircle },
    { name: "Achievements", href: "/achievements", icon: Trophy },
    { name: "Explore", href: "/explore", icon: Globe },
];

export function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [username, setUsername] = useState<string>("");
    const skinContext = useSkinContext();
    const { shouldApplySkin, colors } = skinContext || { shouldApplySkin: false, colors: null };

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

    const sidebarBg = shouldApplySkin && colors 
        ? `${colors.backgroundCard}CC` 
        : "bg-background-card/30";
    const sidebarBorder = shouldApplySkin && colors
        ? colors.primary + "40"
        : "border-slate-700/50";
    const activeBg = shouldApplySkin && colors
        ? `${colors.primary}20`
        : "bg-accent-indigo/10";
    const activeText = shouldApplySkin && colors
        ? colors.accent
        : "text-accent-indigo";
    const activeIcon = shouldApplySkin && colors
        ? colors.accent
        : "text-accent-indigo";
    const activeShadow = shouldApplySkin && colors
        ? `0 0 20px ${colors.primary}30`
        : "0 0 15px rgba(99,102,241,0.2)";

    return (
        <aside 
            className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 backdrop-blur-xl border-r z-50 transition-all duration-500"
            style={{
                backgroundColor: sidebarBg,
                borderColor: sidebarBorder,
            }}
        >
            <div className="p-6">
                <BrandMark size={36} tagline="AI Learning Hub" variant="glass" showConnections={true} />
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                                isActive ? "" : "hover:bg-slate-800/50"
                            )}
                            style={isActive ? {
                                backgroundColor: activeBg,
                                color: activeText,
                                boxShadow: activeShadow,
                            } : {
                                color: shouldApplySkin && colors ? colors.textSecondary : undefined,
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = shouldApplySkin && colors 
                                        ? `${colors.primary}10` 
                                        : "rgba(148, 163, 184, 0.1)";
                                    e.currentTarget.style.color = shouldApplySkin && colors 
                                        ? colors.textPrimary 
                                        : undefined;
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                    e.currentTarget.style.color = shouldApplySkin && colors ? colors.textSecondary : undefined;
                                }
                            }}
                        >
                            <item.icon
                                className="w-5 h-5 transition-colors"
                                style={{
                                    color: isActive 
                                        ? activeIcon 
                                        : shouldApplySkin && colors 
                                        ? colors.textMuted 
                                        : undefined,
                                }}
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
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                            pathname.startsWith("/profile") ? "" : "hover:bg-slate-800/50"
                        )}
                        style={pathname.startsWith("/profile") ? {
                            backgroundColor: activeBg,
                            color: activeText,
                            boxShadow: activeShadow,
                        } : {
                            color: shouldApplySkin && colors ? colors.textSecondary : undefined,
                        }}
                        onMouseEnter={(e) => {
                            if (!pathname.startsWith("/profile")) {
                                e.currentTarget.style.backgroundColor = shouldApplySkin && colors 
                                    ? `${colors.primary}10` 
                                    : "rgba(148, 163, 184, 0.1)";
                                e.currentTarget.style.color = shouldApplySkin && colors 
                                    ? colors.textPrimary 
                                    : undefined;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!pathname.startsWith("/profile")) {
                                e.currentTarget.style.backgroundColor = "transparent";
                                e.currentTarget.style.color = shouldApplySkin && colors ? colors.textSecondary : undefined;
                            }
                        }}
                    >
                        <UserCircle
                            className="w-5 h-5 transition-colors"
                            style={{
                                color: pathname.startsWith("/profile")
                                    ? activeIcon
                                    : shouldApplySkin && colors 
                                    ? colors.textMuted 
                                    : undefined,
                            }}
                        />
                        <span className="font-medium">Profile</span>
                    </Link>
                )}
            </nav>

            <div 
                className="p-4 border-t transition-colors duration-500"
                style={{ borderColor: shouldApplySkin && colors ? `${colors.primary}30` : undefined }}
            >
                <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all duration-300"
                    style={{
                        color: shouldApplySkin && colors ? colors.textSecondary : undefined,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = shouldApplySkin && colors 
                            ? `${colors.primary}10` 
                            : "rgba(148, 163, 184, 0.1)";
                        e.currentTarget.style.color = shouldApplySkin && colors 
                            ? colors.textPrimary 
                            : undefined;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = shouldApplySkin && colors ? colors.textSecondary : undefined;
                    }}
                >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Settings</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all duration-300 mt-1"
                    style={{
                        color: shouldApplySkin && colors ? colors.error + "CC" : undefined,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = shouldApplySkin && colors 
                            ? `${colors.error}20` 
                            : undefined;
                        e.currentTarget.style.color = shouldApplySkin && colors ? colors.error : undefined;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = shouldApplySkin && colors ? colors.error + "CC" : undefined;
                    }}
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}