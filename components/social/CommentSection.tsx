"use client";

import { useState, useEffect } from "react";
import { Send, Trash2, Loader2, MoreHorizontal, CornerDownRight } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { addComment, getComments, deleteComment, Comment } from "@/lib/services/comments";
import { getUserData } from "@/lib/services/firestore";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CommentSectionProps {
    postId: string;
    postOwnerId: string;
    onCommentAdded?: () => void;
}

export function CommentSection({ postId, postOwnerId, onCommentAdded }: CommentSectionProps) {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadComments();
    }, [postId]);

    const loadComments = async () => {
        try {
            const fetchedComments = await getComments(postId);
            setComments(fetchedComments);
        } catch (error) {
            console.error("Error loading comments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newComment.trim() || submitting) return;

        setSubmitting(true);
        try {
            const userData = await getUserData(user.uid);
            if (!userData) return;

            const comment = await addComment(
                postId,
                user.uid,
                userData.username,
                userData.name,
                userData.profilePicture,
                newComment.trim()
            );

            setComments([comment, ...comments]);
            setNewComment("");
            if (onCommentAdded) onCommentAdded();
        } catch (error) {
            console.error("Error posting comment:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;
        try {
            await deleteComment(commentId, postId);
            setComments(comments.filter(c => c.id !== commentId));
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin text-accent-cyan" /></div>;
    }

    return (
        <div className="mt-4 border-t border-slate-800/50 pt-4">
            {/* Comment Input */}
            <form onSubmit={handleSubmit} className="flex gap-3 mb-6 relative group">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full bg-slate-800/30 border border-slate-700/50 rounded-xl px-4 py-3 pr-12 text-sm text-white focus:outline-none focus:border-accent-indigo/50 focus:bg-slate-800/50 placeholder:text-slate-500 transition-all"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <button
                            type="submit"
                            disabled={!newComment.trim() || submitting}
                            className="p-1.5 text-accent-indigo hover:text-white hover:bg-accent-indigo rounded-lg disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-accent-indigo transition-all"
                        >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
                <AnimatePresence initial={false} mode="popLayout">
                    {comments.map((comment) => (
                        <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                            className="flex gap-3 group/comment"
                        >
                            <Link href={`/profile/${comment.username}`} className="flex-shrink-0 mt-1">
                                {comment.userPhoto ? (
                                    <img
                                        src={comment.userPhoto}
                                        alt={comment.userName}
                                        className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-800 group-hover/comment:ring-slate-700 transition-all"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center ring-2 ring-slate-800 group-hover/comment:ring-slate-700 transition-all">
                                        <span className="text-xs text-white font-semibold">
                                            {comment.userName.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </Link>
                            <div className="flex-1">
                                <div className="bg-slate-800/30 border border-slate-800/50 rounded-2xl rounded-tl-none p-3 hover:bg-slate-800/50 hover:border-slate-700/50 transition-all">
                                    <div className="flex items-center justify-between mb-1">
                                        <Link href={`/profile/${comment.username}`} className="font-semibold text-sm text-white hover:text-accent-cyan transition-colors">
                                            {comment.userName}
                                        </Link>
                                        <span className="text-xs text-slate-500">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{comment.text}</p>
                                </div>

                                {(user?.uid === comment.userId || user?.uid === postOwnerId) && (
                                    <div className="flex justify-end mt-1 opacity-0 group-hover/comment:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleDelete(comment.id)}
                                            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 px-2 py-1 rounded hover:bg-red-500/10 transition-colors"
                                        >
                                            <Trash2 className="w-3 h-3" /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {comments.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8"
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-800/30 flex items-center justify-center mx-auto mb-3 border border-slate-800/50">
                            <MoreHorizontal className="w-6 h-6 text-slate-600" />
                        </div>
                        <p className="text-sm text-slate-500">No comments yet.</p>
                        <p className="text-xs text-slate-600 mt-1">Start the conversation!</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
