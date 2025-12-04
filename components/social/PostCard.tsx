"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Bookmark, MessageCircle, MoreVertical, Trash2, AlertTriangle, Edit2 } from "lucide-react";
import { likePost, savePost, deletePost } from "@/lib/services/posts";
import type { Post } from "@/lib/services/posts";
import { useAuth } from "@/lib/hooks/useAuth";
import { useUserStore } from "@/lib/store";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ShareButton } from "@/components/social/ShareButton";
import { sharePost } from "@/lib/utils/share";
import { CommentSection } from "@/components/social/CommentSection";
import { ReportModal } from "@/components/moderation/ReportModal";
import Image from "next/image";

interface PostCardProps {
    post: Post;
    isLiked?: boolean;
    isSaved?: boolean;
    onDelete?: (postId: string) => void;
}

export function PostCard({ post, isLiked: initialLiked = false, isSaved: initialSaved = false, onDelete }: PostCardProps) {
    const { user } = useAuth();
    const incrementLikesGiven = useUserStore((state) => state.incrementLikesGiven);
    const incrementSaves = useUserStore((state) => state.incrementSaves);
    const updatePostLikes = useUserStore((state) => state.updatePostLikes);
    const [isLiked, setIsLiked] = useState(initialLiked);
    const [isSaved, setIsSaved] = useState(initialSaved);
    const [likes, setLikes] = useState(post.likes);
    const [saves, setSaves] = useState(post.saves);
    const [showComments, setShowComments] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);

    const handleLike = async () => {
        if (!user) return;

        try {
            await likePost(user.uid, post.id);
            const newLiked = !isLiked;
            setIsLiked(newLiked);
            const newLikes = isLiked ? likes - 1 : likes + 1;
            setLikes(newLikes);

            // Update achievements
            if (newLiked) {
                incrementLikesGiven();
            }
            // Update trendsetter achievement for post owner (if likes >= 10)
            if (newLikes >= 10) {
                updatePostLikes(newLikes);
            }
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleSave = async () => {
        if (!user) return;

        try {
            await savePost(user.uid, post.id);
            const newSaved = !isSaved;
            setIsSaved(newSaved);
            setSaves(isSaved ? saves - 1 : saves + 1);

            // Update achievements
            if (newSaved) {
                incrementSaves();
            }
        } catch (error) {
            console.error('Error saving post:', error);
        }
    };

    const handleDelete = async () => {
        if (!user || user.uid !== post.userId) return;

        if (confirm("Are you sure you want to delete this post?")) {
            try {
                await deletePost(post.id, user.uid);
                if (onDelete) {
                    onDelete(post.id);
                }
            } catch (error) {
                console.error("Error deleting post:", error);
            }
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

    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(post.content.text || "");
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdate = async () => {
        if (!user || !editText.trim()) return;

        setIsUpdating(true);
        try {
            const { updatePost } = await import("@/lib/services/posts");
            await updatePost(post.id, user.uid, editText);
            setIsEditing(false);
            // Optimistic update (in real app, might want to refetch or update parent state)
            post.content.text = editText;
        } catch (error) {
            console.error("Failed to update post:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden mb-4"
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

                {user?.uid === post.userId && (
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="text-slate-500 hover:text-white transition-colors"
                        >
                            <MoreVertical className="w-5 h-5" />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-xl shadow-xl border border-slate-700 z-10 overflow-hidden">
                                <button
                                    onClick={() => {
                                        setIsEditing(true);
                                        setShowMenu(false);
                                    }}
                                    className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit Post
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-slate-700 flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Post
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {user?.uid !== post.userId && (
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="text-slate-500 hover:text-white transition-colors"
                        >
                            <MoreVertical className="w-5 h-5" />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-xl shadow-xl border border-slate-700 z-10 overflow-hidden">
                                <button
                                    onClick={() => setShowReportModal(true)}
                                    className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2"
                                >
                                    <AlertTriangle className="w-4 h-4" />
                                    Report Post
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="px-4 pb-4">
                {isEditing ? (
                    <div className="mb-3">
                        <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-cyan-500 min-h-[100px]"
                        />
                        <div className="flex justify-end gap-2 mt-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-3 py-1.5 text-sm text-slate-400 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                disabled={isUpdating}
                                className="px-3 py-1.5 text-sm bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50"
                            >
                                {isUpdating ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                ) : (
                    post.content.text && (
                        <p className="text-slate-300 mb-3 whitespace-pre-wrap">{post.content.text}</p>
                    )
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
                        className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors group"
                    >
                        <Heart
                            className={cn(
                                "w-5 h-5 transition-all",
                                isLiked && "fill-red-400 text-red-400"
                            )}
                        />
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
                        className="text-slate-400 hover:text-accent-cyan transition-colors"
                    >
                        <Bookmark
                            className={cn(
                                "w-5 h-5 transition-all",
                                isSaved && "fill-accent-cyan text-accent-cyan"
                            )}
                        />
                    </button>
                    <span className="text-xs text-slate-500">{formatDate(post.createdAt)}</span>
                </div>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="px-4 pb-4">
                    <CommentSection postId={post.id} postOwnerId={post.userId} />
                </div>
            )}

            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                targetId={post.id}
                targetType="post"
            />
        </motion.div>
    );
}