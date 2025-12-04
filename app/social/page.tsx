"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, Users, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PostCard } from "@/components/social/PostCard";
import { getFeedPostsPaginated, isPostLiked, isPostSaved, PaginatedResult } from "@/lib/services/posts";
import type { Post } from "@/lib/services/posts";
import { getFollowing } from "@/lib/services/follow";
import { useAuth } from "@/lib/hooks/useAuth";
import { CreatePost } from "@/components/social/CreatePost";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

const PAGE_SIZE = 10;

export default function SocialPage() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const lastDocRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);
    const followingIdsRef = useRef<string[]>([]);

    const loadFeed = async (isRefresh = false) => {
        if (!user) return;

        if (isRefresh) {
            setLoading(true);
            setPosts([]);
            lastDocRef.current = null;
        }

        try {
            // Get users that current user follows
            const followingIds = await getFollowing(user.uid);
            followingIdsRef.current = [user.uid, ...followingIds];

            // Get paginated posts
            const result = await getFeedPostsPaginated(followingIdsRef.current, PAGE_SIZE);
            setPosts(result.items);
            lastDocRef.current = result.lastDoc;
            setHasMore(result.hasMore);

            // Check which posts are liked/saved
            await checkLikedSaved(result.items);
        } catch (error) {
            console.error('Error loading feed:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = async () => {
        if (!user || loadingMore || !hasMore || !lastDocRef.current) return;

        setLoadingMore(true);
        try {
            const result = await getFeedPostsPaginated(
                followingIdsRef.current,
                PAGE_SIZE,
                lastDocRef.current
            );

            setPosts(prev => [...prev, ...result.items]);
            lastDocRef.current = result.lastDoc;
            setHasMore(result.hasMore);

            // Check liked/saved for new posts
            await checkLikedSaved(result.items);
        } catch (error) {
            console.error('Error loading more:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    const checkLikedSaved = async (newPosts: Post[]) => {
        if (!user) return;

        const liked = new Set(likedPosts);
        const saved = new Set(savedPosts);

        for (const post of newPosts) {
            const [isLiked, isSaved] = await Promise.all([
                isPostLiked(user.uid, post.id),
                isPostSaved(user.uid, post.id),
            ]);
            if (isLiked) liked.add(post.id);
            if (isSaved) saved.add(post.id);
        }

        setLikedPosts(liked);
        setSavedPosts(saved);
    };

    const handlePostCreated = (newPost: Post) => {
        setPosts(prev => [newPost, ...prev]);
    };

    const handlePostDeleted = (deletedPostId: string) => {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== deletedPostId));
    };

    useEffect(() => {
        loadFeed(true);
    }, [user]);

    return (
        <div className="min-h-screen p-8 pt-24">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Social Feed</h1>
                        <p className="text-slate-400">See what others are learning</p>
                    </div>
                    <Button variant="outline" onClick={() => loadFeed(true)} disabled={loading}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                </div>

                {/* Create Post */}
                <div className="mb-8">
                    <CreatePost onPostCreated={handlePostCreated} />
                </div>

                {/* Feed */}
                {loading ? (
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

                        {/* Load More Button */}
                        {hasMore && (
                            <div className="flex justify-center pt-4">
                                <Button
                                    variant="outline"
                                    onClick={loadMore}
                                    disabled={loadingMore}
                                    className="w-full max-w-xs"
                                >
                                    {loadingMore ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Loading...
                                        </>
                                    ) : (
                                        "Load More Posts"
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}