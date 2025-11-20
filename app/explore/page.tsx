"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search as SearchIcon, Users, TrendingUp, Loader2, Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FollowButton } from "@/components/social/FollowButton";
import Link from "next/link";
import { searchUsers, FirestoreUserData } from "@/lib/services/firestore";
import { getTrendingPosts, isPostLiked, isPostSaved, Post } from "@/lib/services/posts";
import { useAuth } from "@/lib/hooks/useAuth";
import { PostCard } from "@/components/social/PostCard";

export default function ExplorePage() {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<FirestoreUserData[]>([]);
    const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [loadingTrending, setLoadingTrending] = useState(true);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());

    // Load trending posts on initial mount
    useEffect(() => {
        loadTrendingPosts();
    }, [user]);

    const loadTrendingPosts = async () => {
        setLoadingTrending(true);
        try {
            const posts = await getTrendingPosts();
            setTrendingPosts(posts);

            if (user) {
                const liked = new Set<string>();
                const saved = new Set<string>();
                for (const post of posts) {
                    const [isLiked, isSaved] = await Promise.all([
                        isPostLiked(user.uid, post.id),
                        isPostSaved(user.uid, post.id),
                    ]);
                    if (isLiked) liked.add(post.id);
                    if (isSaved) saved.add(post.id);
                }
                setLikedPosts(liked);
                setSavedPosts(saved);
            }
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

    const handlePostDeleted = (deletedPostId: string) => {
        setTrendingPosts(prevPosts => prevPosts.filter(post => post.id !== deletedPostId));
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
                                                    <img
                                                        src={foundUser.profilePicture}
                                                        alt={foundUser.name}
                                                        className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center shrink-0">
                                                        <span className="text-white font-semibold text-lg md:text-xl">
                                                            {foundUser.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-white truncate text-sm md:text-base">{foundUser.name}</p>
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
                                <p className="text-slate-400">No users found for "{searchQuery}"</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Trending Posts */}
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Trending Posts</h2>
                    {loadingTrending ? (
                        <div className="flex items-center justify-center py-12 md:py-20">
                            <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
                        </div>
                    ) : trendingPosts.length > 0 ? (
                        <div className="space-y-6">
                            {trendingPosts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    isLiked={likedPosts.has(post.id)}
                                    isSaved={savedPosts.has(post.id)}
                                    onDelete={handlePostDeleted}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 md:py-20">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                                <Compass className="w-8 h-8 md:w-10 md:h-10 text-slate-600" />
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