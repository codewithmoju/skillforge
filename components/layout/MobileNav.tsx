"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, PlusCircle, Bell, UserCircle, Compass } from "lucide-react"; // Added Compass icon
import { useAuth } from "@/lib/hooks/useAuth";
import { getUserData } from "@/lib/services/firestore";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Explore", href: "/explore", icon: Compass }, // New Explore item
    { name: "Create", href: "/create", icon: PlusCircle },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Profile", href: "/profile", icon: UserCircle },
];

export function MobileNav() {
    const pathname = usePathname();
    const { user } = useAuth();
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

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 w-full bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 z-50 safe-area-bottom">
            <div className="flex items-center justify-around h-16 px-2 w-full max-w-md mx-auto">
                {navItems.map((item) => {
                    const href = item.name === "Profile" && username ? `/profile/${username}` : item.href;
                    const isActive = pathname === href || pathname.startsWith(href + "/");

                    return (
                        <Link
                            key={item.name}
                            href={href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all min-w-[60px]",
                                isActive
                                    ? "text-accent-cyan"
                                    : "text-slate-400 active:scale-95"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "w-6 h-6 transition-colors",
                                    isActive && "text-accent-cyan"
                                )}
                            />
                            <span className="text-xs font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}