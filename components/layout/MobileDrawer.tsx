"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Settings, LogOut, User, Shield, Database, Trophy } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { getUserData } from "@/lib/services/firestore";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface MobileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
    const { user, logout } = useAuth();
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        if (user) {
            getUserData(user.uid).then(setUserData);
        }
    }, [user]);

    const handleLogout = async () => {
        try {
            await logout();
            onClose();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="md:hidden fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-slate-900 border-r border-slate-800 z-50 overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-800">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-white">Menu</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-slate-400 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* User Profile */}
                            {userData && (
                                <Link
                                    href={`/profile/${userData.username}`}
                                    onClick={onClose}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors"
                                >
                                    {userData.profilePicture ? (
                                        <Image
                                            src={userData.profilePicture}
                                            alt={userData.name}
                                            width={48}
                                            height={48}
                                            className="rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center">
                                            <span className="text-white font-semibold text-lg">
                                                {userData.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-white truncate">{userData.name}</p>
                                        <p className="text-sm text-slate-400 truncate">@{userData.username}</p>
                                    </div>
                                </Link>
                            )}
                        </div>

                        {/* Menu Items */}
                        <div className="p-4 space-y-2">
                            <Link
                                href="/achievements"
                                onClick={onClose}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
                            >
                                <Trophy className="w-5 h-5" />
                                <span className="font-medium">Achievements</span>
                            </Link>

                            <Link
                                href="/settings"
                                onClick={onClose}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
                            >
                                <Settings className="w-5 h-5" />
                                <span className="font-medium">Settings</span>
                            </Link>

                            <Link
                                href="/settings"
                                onClick={onClose}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
                            >
                                <Shield className="w-5 h-5" />
                                <span className="font-medium">Privacy</span>
                            </Link>

                            <Link
                                href="/settings"
                                onClick={onClose}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
                            >
                                <Database className="w-5 h-5" />
                                <span className="font-medium">Data</span>
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all w-full"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>

                        {/* Stats */}
                        {userData && (
                            <div className="p-4 border-t border-slate-800">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-2xl font-bold text-white">{userData.level}</p>
                                        <p className="text-xs text-slate-400">Level</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-accent-cyan">{userData.xp}</p>
                                        <p className="text-xs text-slate-400">XP</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-orange-400">{userData.streak}</p>
                                        <p className="text-xs text-slate-400">Streak</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
