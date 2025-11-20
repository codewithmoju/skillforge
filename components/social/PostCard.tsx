"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Added AnimatePresence import
import { Heart, Bookmark, MessageCircle, MoreVertical, Trash2, Loader2 } from "lucide-react";
import { Post, likePost, savePost, deletePost } from "@/lib/services/posts";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ShareButton } from "@/components/social/ShareButton";
import { sharePost } from "@/lib/utils/share";
import { CommentSection } from "@/components/social/CommentSection";

interface PostCardProps {
    post: Post;
    isLiked?: boolean;
    isSaved?: boolean;
    onDelete?: (postId: string) => void; // Callback for when a post is deleted
}

export function PostCard({ post, isLiked: initialLiked = false, isSaved: initialSaved = false, onDelete }: PostCardProps) {
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(initialLiked);
    const [isSaved, setIsSaved] = useState(initialSaved);
    const [likes, setLikes] = useState(post.likes);
    const [saves, setSaves] = useState(post.saves);
    const [showComments, setShowComments] = useState(false);
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);
    const [isLoadingLike, setIsLoadingLike] = useState(false);
    const [isLoadingSave, setIsLoadingSave] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const optionsMenuRef = useRef<HTMLDivElement>(null);

    const isOwnPost = user?.uid === post.userId;

    // Close options menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target as Node)) {
                setShowOptionsMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [optionsMenuRef]);

    const handleLike = async () => {
        if (!user || isLoadingLike) return;

        setIsLoadingLike(true);
        const previousLikedState = isLiked;
        const previousLikesCount = likes;

        // Optimistic UI update
        setIsLiked(prev => !prev);
        setLikes(prev => (previousLikedState ? prev - 1 : prev + 1));

        try {
            await likePost(user.uid, post.id);
        } catch (error) {
            console.error('Error liking post:', error);
            // Revert UI on error
            setIsLiked(previousLikedState);
            setLikes(previousLikesCount);
        } finally {
            setIsLoadingLike(false);
        }
    };

    const handleSave = async () => {
        if (!user || isLoadingSave) return;

        setIsLoadingSave(true);
        const previousSavedState = isSaved;
        const previousSavesCount = saves;

        // Optimistic UI update
        setIsSaved(prev => !prev);
        setSaves(prev => (previousSavedState ? prev - 1 : prev + 1));

        try {
            await savePost(user.uid, post.id);
        } catch (error) {
            console.error('Error saving post:', error);
            // Revert UI on error
            setIsSaved(previousSavedState);
            setSaves(previousSavesCount);
        } finally {
            setIsLoadingSave(false);
        }
    };

    const handleDeletePost = async () => {
        if (!user || !isOwnPost || isDeleting) return;

        if (!confirm("Are you sure you want to delete this post?")) {
            setShowOptionsMenu(false);
            return;
        }

        setIsDeleting(true);
        try {
            await deletePost(post.id, user.uid);
            onDelete?.(post.id); // Notify parent to remove the post from its state
        } catch (error) {
            console.error('Error deleting post:', error);
            setIsDeleting(false); // Revert loading state on error
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (days > 7) {
            return date.toLocaleDateString();
        } else if (days > 0) {
            return `${days}d ago`;
        } else if (hours > 0) {
            return `${hours}h ago`;
        } else {
            return 'Just now';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden"
        >
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
                <Link href={`/profile/${post.username}`} className="flex items-center gap-3 group">
                    {post.userPhoto ? (
                        <img
                            src={post.userPhoto}
                            alt={post.userName}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center">
                            <span className="text-white font-semibold">
                                {post.userName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                    <div>
                        <p className="font-semibold text-white group-hover:text-accent-cyan transition-colors">
                            {post.userName}
                        </p>
                        <p className="text-sm text-slate-500">@{post.username}</p>
                    </div>
                </Link>
                <div className="relative" ref={optionsMenuRef}>
                    <button
                        onClick={() => setShowOptionsMenu(prev => !prev)}
                        className="p-2 rounded-full text-slate-500 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                        <MoreVertical className="w-5 h-5" />
                    </button>
                    <AnimatePresence>
                        {showOptionsMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden z-10"
                            >
                                {isOwnPost && (
                                    <button
                                        onClick={handleDeletePost}
                                        disabled={isDeleting}
                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                    >
                                        {isDeleting ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                        Delete Post
                                    </button>
                                )}
                                {/* Add other options here if needed */}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 pb-4">
                {post.content.text && (
                    <p className="text-slate-300 mb-3 whitespace-pre-wrap">{post.content.text}</p>
                )}

                {/* Roadmap Preview */}
                {post.type === 'roadmap' && post.content.roadmapTitle && (
                    <div className="p-4 rounded-xl bg-accent-indigo/10 border border-accent-indigo/20 mb-3">
                        <p className="text-sm text-accent-cyan mb-1">Completed Roadmap</p>
                        <p className="font-semibold text-white">{post.content.roadmapTitle}</p>
                    </div>
                )}

                {/* Achievement Preview */}
                {post.type === 'achievement' && post.content.achievementTitle && (
                    <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 mb-3">
                        <p className="text-sm text-yellow-400 mb-1">Achievement Unlocked</p>
                        <p className="font-semibold text-white">{post.content.achievementTitle}</p>
                    </div>
                )}

                {/* Project Preview */}
                {post.type === 'project' && post.content.projectTitle && (
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 mb-3">
                        <p className="text-sm text-green-400 mb-1">Project Completed</p>
                        <p className="font-semibold text-white">{post.content.projectTitle}</p>
                    </div>
                )}

                {/* Images */}
                {post.content.images && post.content.images.length > 0 && (
                    <div className={cn(
                        "grid gap-2 mb-3 rounded-xl overflow-hidden",
                        post.content.images.length === 1 && "grid-cols-1",
                        post.content.images.length === 2 && "grid-cols-2",
                        post.content.images.length > 2 && "grid-cols-2"
                    )}>
                        {post.content.images.slice(0, 4).map((image, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "relative aspect-square",
                                    post.content.images!.length === 1 && "aspect-video"
                                )}
                            >
                                <img
                                    src={image}
                                    alt={`Post image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                {index === 3 && post.content.images!.length > 4 && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <span className="text-white text-2xl font-bold">
                                            +{post.content.images!.length - 4}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="px-4 py-3 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button
                        onClick={handleLike}
                        disabled={isLoadingLike}
                        className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors group"
                    >
                        {isLoadingLike ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Heart
                                className={cn(
                                    "w-5 h-5 transition-all",
                                    isLiked && "fill-red-400 text-red-400"
                                )}
                            />
                        )}
                        <span className="text-sm font-medium">{likes}</span>
                    </button>

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className={`flex items-center gap-2 transition-colors ${showComments ? "text-accent-cyan" : "text-slate-400 hover:text-accent-cyan"}`}
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">{post.comments}</span>
                    </button>

                    {/* Share Button */}
                    <ShareButton
                        url={sharePost(post.id)}
                        title={`Check out this post by ${post.userName}`}
                        text={post.content.text}
                    />
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSave}
                        disabled={isLoadingSave}
                        className="text-slate-400 hover:text-accent-cyan transition-colors"
                    >
                        {isLoadingSave ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Bookmark
                                className={cn(
                                    "w-5 h-5 transition-all",
                                    isSaved && "fill-accent-cyan text-accent-cyan"
                                )}
                            />
                        )}
                    </button>
                    <span className="text-xs text-slate-500">{formatDate(post.createdAt)}</span>
                </div>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="px-4 pb-4">
                    <CommentSection postId={post.id} />
                </div>
            )}
        </motion.div>
    );
}