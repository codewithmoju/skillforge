"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Search as SearchIcon, Loader2, Globe, Heart, MessageCircle } from "@/lib/icons";
import { FollowButton } from "@/components/social/FollowButton";
import Link from "next/link";
import Image from "next/image";
import { searchUsers, FirestoreUserData } from "@/lib/services/firestore";
import { getTrendingPosts, Post } from "@/lib/services/posts";
import { useAuth } from "@/lib/hooks/useAuth";
import { cn } from "@/lib/utils";

export default function ExplorePage() {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<FirestoreUserData[]>([]);
    const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [loadingTrending, setLoadingTrending] = useState(true);

    const getUserDisplayName = (userData: FirestoreUserData) => userData?.name?.trim() || userData?.username || "Learner";
    const getUserInitial = (userData: FirestoreUserData) => getUserDisplayName(userData).charAt(0).toUpperCase();
    const ensurePostContent = (post: Post): Post["content"] => post.content ?? {};
    const getPostPrimaryTitle = (post: Post) => {
        const content = ensurePostContent(post);
        return (
            content.roadmapTitle ||
            content.projectTitle ||
            content.achievementTitle ||
            content.text ||
            post.userName ||
            post.username ||
            "SkillForge Post"
        );
    };

    // Load trending posts on initial mount
    useEffect(() => {
        loadTrendingPosts();
    }, [user]);

    const loadTrendingPosts = async () => {
        setLoadingTrending(true);
        try {
            const posts = await getTrendingPosts();
            setTrendingPosts(posts);
        } catch (error) {
            console.error("Error loading trending posts:", error);
        } finally {
            setLoadingTrending(false);
        }
    };

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.trim().length > 0) {
            setLoadingSearch(true);
            try {
                const users = await searchUsers(query);
                setSearchResults(users);
            } catch (error) {
                console.error("Error searching users:", error);
            } finally {
                setLoadingSearch(false);
            }
        } else {
            setSearchResults([]);
        }
    };

    const tilePattern = useMemo(
        () => [
            "md:col-span-2 md:row-span-2",
            "",
            "",
            "row-span-2",
            "",
            "",
            "md:col-span-2",
            "",
            "row-span-2",
        ],
        []
    );

    const getCoverImage = (post: Post) => ensurePostContent(post).images?.[0];

    const getFallbackStyles = (post: Post) => {
        const map: Record<Post["type"], string> = {
            text: "from-accent-indigo/40 via-slate-900 to-slate-950",
            roadmap: "from-emerald-500/30 via-slate-900 to-slate-950",
            achievement: "from-amber-500/30 via-slate-900 to-slate-950",
            project: "from-cyan-500/30 via-slate-900 to-slate-950",
        };
        return map[post.type] ?? map.text;
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Explore</h1>
                    <p className="text-slate-400">Discover learners and trending content</p>
                </div>

                {/* Search Bar */}
                <div className="mb-6 md:mb-8">
                    <div className="relative">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search users..."
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl md:rounded-2xl pl-12 pr-4 py-3 md:py-4 text-white focus:outline-none focus:border-accent-indigo"
                        />
                        {loadingSearch && (
                            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-cyan animate-spin" />
                        )}
                    </div>
                </div>

                {/* Search Results */}
                {searchQuery.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Search Results</h2>
                        {loadingSearch ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
                            </div>
                        ) : searchResults.length > 0 ? (
                            <div className="space-y-3 md:space-y-4">
                                {searchResults.map((foundUser) => (
                                    <motion.div
                                        key={foundUser.uid}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-slate-900/50 border border-slate-800 rounded-xl md:rounded-2xl p-4 md:p-6"
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <Link href={`/profile/${foundUser.username}`} className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                                                {foundUser.profilePicture ? (
                                                    <div className="relative w-12 h-12 md:w-16 md:h-16">
                                                        <Image
                                                            src={foundUser.profilePicture}
                                                            alt={getUserDisplayName(foundUser)}
                                                            fill
                                                            sizes="64px"
                                                            className="rounded-full object-cover"
                                                            unoptimized
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center shrink-0">
                                                        <span className="text-white font-semibold text-lg md:text-xl">
                                                            {getUserInitial(foundUser)}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-white truncate text-sm md:text-base">
                                                        {getUserDisplayName(foundUser)}
                                                    </p>
                                                    <p className="text-xs md:text-sm text-slate-400 truncate">@{foundUser.username}</p>
                                                    <p className="text-xs text-accent-cyan mt-1">{foundUser.xp} XP</p>
                                                </div>
                                            </Link>
                                            <FollowButton targetUserId={foundUser.uid} isPrivate={foundUser.isPrivate} />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-slate-400">
                                    No users found for <span className="text-white">{searchQuery}</span>
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Trending Grid */}
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Trending Grid</h2>
                    {loadingTrending ? (
                        <div className="flex items-center justify-center py-12 md:py-20">
                            <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
                        </div>
                    ) : trendingPosts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[150px] sm:auto-rows-[180px] md:auto-rows-[220px] gap-2 md:gap-3">
                            {trendingPosts.map((post, index) => {
                                const cover = getCoverImage(post);
                                const pattern = tilePattern[index % tilePattern.length];
                                const postTitle = getPostPrimaryTitle(post);
                                const displayName = post.userName || post.username || "Learner";
                                const likes = typeof post.likes === "number" ? post.likes : 0;
                                const comments = typeof post.comments === "number" ? post.comments : 0;
                                return (
                                    <Link
                                        key={post.id}
                                        href={`/profile/${post.username}`}
                                        className={cn(
                                            "group relative overflow-hidden rounded-2xl bg-slate-900/40 border border-slate-800",
                                            pattern
                                        )}
                                    >
                                        {cover ? (
                                            <Image
                                                src={cover}
                                                alt={postTitle}
                                                fill
                                                sizes="(max-width: 768px) 50vw, 33vw"
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                unoptimized
                                            />
                                        ) : (
                                            <div
                                                className={cn(
                                                    "h-full w-full bg-gradient-to-br",
                                                    getFallbackStyles(post)
                                                )}
                                            >
                                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 text-white">
                                                    <p className="text-sm uppercase tracking-widest text-white/70">
                                                        {post.type}
                                                    </p>
                                                    <p className="text-lg font-semibold mt-2 line-clamp-2">
                                                        {postTitle}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs md:text-sm">
                                            <div>
                                                <p className="font-semibold">{displayName}</p>
                                                <p className="text-white/70">@{post.username || "skillforge"}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1">
                                                    <Heart className="w-4 h-4" />
                                                    <span>{likes}</span>
                                                </div>
                                            <div className="flex items-center gap-1">
                                                    <MessageCircle className="w-4 h-4" />
                                                    <span>{comments}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 md:py-20">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                                <Globe className="w-8 h-8 md:w-10 md:h-10 text-slate-600" />
                            </div>
                            <h3 className="text-lg md:text-xl font-semibold text-white mb-2">No trending posts yet</h3>
                            <p className="text-sm md:text-base text-slate-400">Check back later for new content!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}