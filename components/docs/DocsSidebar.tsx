"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Map,
    Users,
    MessageSquare,
    Trophy,
    Crown,
    BookOpen,
    Rocket,
    Swords
} from "lucide-react";

const docSections = [
    {
        title: "Getting Started",
        items: [
            { name: "Introduction", href: "/docs", icon: BookOpen },
            { name: "Dashboard Tour", href: "/docs/dashboard", icon: LayoutDashboard },
        ],
    },
    {
        title: "Learning Engine",
        items: [
            { name: "Roadmaps", href: "/docs/roadmaps", icon: Map },
            { name: "Courses & Lessons", href: "/docs/courses", icon: BookOpen },
            { name: "Challenges", href: "/docs/challenges", icon: Swords },
        ],
    },
    {
        title: "Community",
        items: [
            { name: "Social Hub", href: "/docs/social", icon: Users },
            { name: "Messages", href: "/docs/messages", icon: MessageSquare },
        ],
    },
    {
        title: "Gamification",
        items: [
            { name: "Achievements", href: "/docs/achievements", icon: Trophy },
            { name: "Tiers & XP", href: "/docs/tiers", icon: Crown },
        ],
    },
];

export function DocsSidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    return (
        <nav className={cn("space-y-8", className)}>
            {docSections.map((section) => (
                <div key={section.title}>
                    <h5 className="font-bold text-white mb-4 px-2 flex items-center gap-2">
                        {section.title}
                    </h5>
                    <ul className="space-y-1">
                        {section.items.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                                            isActive
                                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                                        )}
                                    >
                                        <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-blue-400" : "text-slate-500 group-hover:text-white")} />
                                        {item.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </nav>
    );
}
