"use client";

import { useState, useEffect } from "react";
import { Loader2, Users, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PostCard } from "@/components/social/PostCard";
import { getFeedPosts, isPostLiked, isPostSaved } from "@/lib/services/posts";
import type { Post } from "@/lib/services/posts";
import { getFollowing } from "@/lib/services/follow";
import { useAuth } from "@/lib/hooks/useAuth";
import { CreatePost } from "@/components/social/CreatePost";

export default function SocialPage() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    const loadFeed = async () => {
        if (!user) return;

        setLoading(true);
        try {
            // Get users that current user follows
            const followingIds = await getFollowing(user.uid);

            // Add current user to see their own posts
            const feedUserIds = [user.uid, ...followingIds];

            // Get posts from followed users
            const feedPosts = await getFeedPosts(feedUserIds);
            setPosts(feedPosts);

            // Check which posts are liked/saved
            const liked = new Set<string>();
            const saved = new Set<string>();

            for (const post of feedPosts) {
                const [isLiked, isSaved] = await Promise.all([
                    isPostLiked(user.uid, post.id),
                    isPostSaved(user.uid, post.id),
                ]);
                if (isLiked) liked.add(post.id);
                if (isSaved) saved.add(post.id);
            }

            setLikedPosts(liked);
            setSavedPosts(saved);
        } catch (error) {
            console.error('Error loading feed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePostCreated = (newPost: Post) => {
        setPosts(prev => [newPost, ...prev]);
    };

    const handlePostDeleted = (deletedPostId: string) => {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== deletedPostId));
    };

    useEffect(() => {
        loadFeed();
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
                    <Button variant="outline" onClick={loadFeed} disabled={loading}>
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
                    </div>
                )}
            </div>
        </div>
    );
}