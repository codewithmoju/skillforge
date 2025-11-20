"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search as SearchIcon, Users, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FollowButton } from "@/components/social/FollowButton";
import Link from "next/link";

// This will be implemented with actual search service
export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);

    // Mock suggested users for now
    const mockUsers = [
        { uid: "1", username: "johndoe", name: "John Doe", profilePicture: "", isPrivate: false, xp: 1500 },
        { uid: "2", username: "janesmit", name: "Jane Smith", profilePicture: "", isPrivate: false, xp: 2000 },
    ];

    return (
        <div className="min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Explore</h1>
                    <p className="text-slate-400">Discover learners and content</p>
                </div>

                {/* Search Bar */}
                <div className="mb-6 md:mb-8">
                    <div className="relative">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search users, posts, roadmaps..."
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl md:rounded-2xl pl-12 pr-4 py-3 md:py-4 text-white focus:outline-none focus:border-accent-indigo"
                        />
                    </div>
                </div>

                {/* Suggested Users */}
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Suggested Users</h2>
                    <div className="space-y-3 md:space-y-4">
                        {mockUsers.map((user) => (
                            <motion.div
                                key={user.uid}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-slate-900/50 border border-slate-800 rounded-xl md:rounded-2xl p-4 md:p-6"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <Link href={`/profile/${user.username}`} className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                                        {user.profilePicture ? (
                                            <img
                                                src={user.profilePicture}
                                                alt={user.name}
                                                className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center shrink-0">
                                                <span className="text-white font-semibold text-lg md:text-xl">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-white truncate text-sm md:text-base">{user.name}</p>
                                            <p className="text-xs md:text-sm text-slate-400 truncate">@{user.username}</p>
                                            <p className="text-xs text-accent-cyan mt-1">{user.xp} XP</p>
                                        </div>
                                    </Link>
                                    <FollowButton targetUserId={user.uid} isPrivate={user.isPrivate} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Empty State */}
                {mockUsers.length === 0 && (
                    <div className="text-center py-12 md:py-20">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 md:w-10 md:h-10 text-slate-600" />
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold text-white mb-2">No users found</h3>
                        <p className="text-sm md:text-base text-slate-400">Try a different search query</p>
                    </div>
                )}
            </div>
        </div>
    );
}
