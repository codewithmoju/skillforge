"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Map, FolderKanban, Users, UserCircle, Settings, Globe, Trophy, MessageCircle, PlusCircle, BookOpen } from "@/lib/icons";
import { useAuth } from "@/lib/hooks/useAuth";
import { getUserData } from "@/lib/services/firestore";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/ui/BrandMark";
import { useSkinContext } from "@/lib/contexts/SkinContext";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Roadmap", href: "/roadmap", icon: Map },
    { name: "Courses", href: "/courses", icon: BookOpen },
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "Social", href: "/social", icon: Users },
    { name: "Create Post", href: "/create", icon: PlusCircle },
    { name: "Messages", href: "/messages", icon: MessageCircle },
    { name: "Achievements", href: "/achievements", icon: Trophy },
    { name: "Explore", href: "/explore", icon: Globe },
];

export function Sidebar() {
    const pathname = usePathname();
    const { user } = useAuth();
    const [username, setUsername] = useState<string>("");
    const [isHovered, setIsHovered] = useState(false);
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

    // Skin overrides (undefined if not applying skin)
    const sidebarBg = shouldApplySkin && colors
        ? `${colors.backgroundCard}CC`
        : undefined;
    const sidebarBorder = shouldApplySkin && colors
        ? colors.primary + "40"
        : undefined;
    const activeBg = shouldApplySkin && colors
        ? `${colors.primary}20`
        : undefined;
    const activeText = shouldApplySkin && colors
        ? colors.accent
        : undefined;
    const activeIcon = shouldApplySkin && colors
        ? colors.accent
        : undefined;
    const activeShadow = shouldApplySkin && colors
        ? `0 0 20px ${colors.primary}30`
        : undefined;

    return (
        <aside
            className={cn(
                "hidden md:flex flex-col h-screen fixed left-0 top-0 backdrop-blur-xl z-50 transition-all duration-700 ease-in-out",
                isHovered ? "w-64 shadow-2xl" : "w-20",
                !shouldApplySkin && "bg-background-card/30 border-slate-700/50"
            )}
            style={{
                backgroundColor: sidebarBg,
                borderColor: sidebarBorder,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={cn(
                "p-6 flex items-center transition-all duration-700",
                isHovered ? "justify-start" : "justify-center px-2"
            )}>
                <BrandMark
                    size={isHovered ? 36 : 32}
                    tagline="AI Learning Hub"
                    variant="glass"
                    showConnections={true}
                    showName={isHovered}
                    className="transition-all duration-700"
                />
            </div>

            <nav className="flex-1 px-3 py-6 space-y-2 overflow-hidden">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-700 group relative overflow-hidden",
                                isActive
                                    ? !shouldApplySkin && "bg-accent-indigo/10 text-accent-indigo shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                                    : "hover:bg-slate-800/50",
                                isHovered ? "" : "justify-center"
                            )}
                            style={isActive ? {
                                backgroundColor: activeBg,
                                color: activeText,
                                boxShadow: activeShadow,
                            } : {
                                color: shouldApplySkin && colors?.textSecondary ? colors.textSecondary : undefined,
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = shouldApplySkin && colors
                                        ? `${colors.primary}10`
                                        : "rgba(148, 163, 184, 0.1)";
                                    e.currentTarget.style.color = shouldApplySkin && colors?.textPrimary
                                        ? colors.textPrimary
                                        : "";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                    e.currentTarget.style.color = shouldApplySkin && colors?.textSecondary ? colors.textSecondary : "";
                                }
                            }}
                        >
                            <div className="relative z-10">
                                <item.icon
                                    className={cn(
                                        "w-6 h-6 transition-all duration-700",
                                        isActive && !isHovered && "scale-110",
                                        isActive && !shouldApplySkin && "text-accent-indigo"
                                    )}
                                    style={{
                                        color: isActive
                                            ? activeIcon
                                            : shouldApplySkin && colors?.textMuted
                                                ? colors.textMuted
                                                : undefined,
                                    }}
                                />
                            </div>

                            <span className={cn(
                                "font-medium whitespace-nowrap transition-all duration-700 absolute left-12",
                                isHovered
                                    ? "opacity-100 translate-x-0"
                                    : "opacity-0 -translate-x-4 pointer-events-none"
                            )}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}

                {/* Profile Link */}
                {username && (
                    <Link
                        href={`/profile/${username}`}
                        className={cn(
                            "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-700 group relative overflow-hidden mt-4",
                            pathname.startsWith("/profile")
                                ? !shouldApplySkin && "bg-accent-indigo/10 text-accent-indigo shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                                : "hover:bg-slate-800/50",
                            isHovered ? "" : "justify-center"
                        )}
                        style={pathname.startsWith("/profile") ? {
                            backgroundColor: activeBg,
                            color: activeText,
                            boxShadow: activeShadow,
                        } : {
                            color: shouldApplySkin && colors?.textSecondary ? colors.textSecondary : undefined,
                        }}
                        onMouseEnter={(e) => {
                            if (!pathname.startsWith("/profile")) {
                                e.currentTarget.style.backgroundColor = shouldApplySkin && colors
                                    ? `${colors.primary}10`
                                    : "rgba(148, 163, 184, 0.1)";
                                e.currentTarget.style.color = shouldApplySkin && colors?.textPrimary
                                    ? colors.textPrimary
                                    : "";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!pathname.startsWith("/profile")) {
                                e.currentTarget.style.backgroundColor = "transparent";
                                e.currentTarget.style.color = shouldApplySkin && colors?.textSecondary ? colors.textSecondary : "";
                            }
                        }}
                    >
                        <div className="relative z-10">
                            <UserCircle
                                className="w-6 h-6 transition-colors"
                                style={{
                                    color: pathname.startsWith("/profile")
                                        ? activeIcon
                                        : shouldApplySkin && colors?.textMuted
                                            ? colors.textMuted
                                            : undefined,
                                }}
                            />
                        </div>
                        <span className={cn(
                            "font-medium whitespace-nowrap transition-all duration-700 absolute left-12",
                            isHovered
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 -translate-x-4 pointer-events-none"
                        )}>
                            Profile
                        </span>
                    </Link>
                )}
            </nav>

            <div
                className={cn(
                    "p-4 transition-all duration-700 overflow-hidden",
                    isHovered ? "" : "px-2"
                )}
            >
                <Link
                    href="/settings"
                    className={cn(
                        "flex items-center gap-4 px-3 py-3 w-full rounded-xl transition-all duration-700 relative",
                        isHovered ? "" : "justify-center"
                    )}
                    style={{
                        color: shouldApplySkin && colors?.textSecondary ? colors.textSecondary : undefined,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = shouldApplySkin && colors
                            ? `${colors.primary}10`
                            : "rgba(148, 163, 184, 0.1)";
                        e.currentTarget.style.color = shouldApplySkin && colors?.textPrimary
                            ? colors.textPrimary
                            : "";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = shouldApplySkin && colors?.textSecondary ? colors.textSecondary : "";
                    }}
                >
                    <Settings className="w-6 h-6 flex-shrink-0" />
                    <span className={cn(
                        "font-medium whitespace-nowrap transition-all duration-700 absolute left-12",
                        isHovered
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-4 pointer-events-none"
                    )}>
                        Settings
                    </span>
                </Link>
            </div>
        </aside>
    );
}