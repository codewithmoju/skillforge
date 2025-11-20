"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PostCard } from "@/components/social/PostCard";
import { CreatePost } from "@/components/social/CreatePost";
import { getFeedPosts, isPostLiked, isPostSaved, Post } from "@/lib/services/posts";
import { getFollowing } from "@/lib/services/follow";
import { useAuth } from "@/lib/hooks/useAuth";

export default function SocialPage() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

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

    const handlePostDeleted = (deletedPostId: string) => {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== deletedPostId));
    };

    useEffect(() => {
        loadFeed();
    }, [user]);

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Social Feed</h1>
                    <p className="text-slate-400">See what others are learning</p>
                </div>

                {/* Create Post Button */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <Button
                        onClick={() => setIsCreatePostOpen(true)}
                        className="w-full"
                        size="lg"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Create Post
                    </Button>
                </motion.div>

                {/* Feed */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                            <Plus className="w-10 h-10 text-slate-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
                        <p className="text-slate-400 mb-6">
                            Follow other users or create your first post to get started!
                        </p>
                        <Button onClick={() => setIsCreatePostOpen(true)}>
                            Create Your First Post
                        </Button>
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

                {/* Create Post Modal */}
                <CreatePost
                    isOpen={isCreatePostOpen}
                    onClose={() => setIsCreatePostOpen(false)}
                    onPostCreated={loadFeed}
                />
            </div>
        </div>
    );
}