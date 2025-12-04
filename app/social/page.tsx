"use client";

import { useState, useEffect } from "react";
import { Loader2, Users, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PostCard } from "@/components/social/PostCard";
import { isPostLiked, isPostSaved, checkPostInteractions } from "@/lib/services/posts";
import type { Post } from "@/lib/services/posts";
import { useAuth } from "@/lib/hooks/useAuth";
import { CreatePost } from "@/components/social/CreatePost";
import { usePosts } from "@/lib/hooks/usePosts";
import { useInView } from "react-intersection-observer";
import { useQueryClient } from "@tanstack/react-query";

export default function SocialPage() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const {
        posts,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        deletePost
    } = usePosts("feed");

    const { ref, inView } = useInView();

    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    // Check liked/saved status when posts change
    const checkedIdsRef = useState(new Set<string>())[0];

    useEffect(() => {
        const checkLikedSaved = async () => {
            if (!user || posts.length === 0) return;

            const postsToCheck = posts.filter(p => !checkedIdsRef.has(p.id));
            if (postsToCheck.length === 0) return;

            // Mark as checked immediately to prevent double checking
            postsToCheck.forEach(p => checkedIdsRef.add(p.id));

            const postIds = postsToCheck.map(p => p.id);
            const { liked, saved } = await checkPostInteractions(user.uid, postIds);

            if (liked.size > 0 || saved.size > 0) {
                setLikedPosts(prev => {
                    const next = new Set(prev);
                    liked.forEach(id => next.add(id));
                    return next;
                });
                setSavedPosts(prev => {
                    const next = new Set(prev);
                    saved.forEach(id => next.add(id));
                    return next;
                });
            }
        };

        checkLikedSaved();
    }, [posts, user, likedPosts, savedPosts, checkedIdsRef]);

    const handlePostCreated = (newPost: Post) => {
        // Manually update the cache since CreatePost handles the API call
        queryClient.setQueryData(["posts", "feed", user?.uid], (old: any) => {
            if (!old) return old;
            return {
                ...old,
                pages: old.pages.map((page: any, index: number) => {
                    if (index === 0) {
                        return {
                            ...page,
                            items: [newPost, ...page.items]
                        };
                    }
                    return page;
                })
            };
        });
    };

    const handlePostDeleted = (deletedPostId: string) => {
        deletePost(deletedPostId);
    };

    return (
        <div className="min-h-screen p-8 pt-24">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Social Feed</h1>
                        <p className="text-slate-400">See what others are learning</p>
                    </div>
                </div>

                {/* Create Post */}
                <div className="mb-8">
                    <CreatePost onPostCreated={handlePostCreated} />
                </div>

                {/* Feed */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                            <Users className="w-10 h-10 text-slate-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
                        <p className="text-slate-400">
                            Follow other users or create your first post to get started!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                isLiked={likedPosts.has(post.id)}
                                isSaved={savedPosts.has(post.id)}
                                onDelete={handlePostDeleted}
                            />
                        ))}

                        {/* Loading Indicator / Infinite Scroll Trigger */}
                        <div ref={ref} className="flex justify-center py-4">
                            {isFetchingNextPage && (
                                <Loader2 className="w-6 h-6 text-accent-cyan animate-spin" />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}