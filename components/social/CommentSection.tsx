"use client";

import { useState, useEffect } from "react";
import { Send, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { addComment, getComments, deleteComment, Comment } from "@/lib/services/comments";
import { getUserData } from "@/lib/services/firestore";
import Link from "next/link";

interface CommentSectionProps {
    postId: string;
    onCommentAdded?: () => void;
}

export function CommentSection({ postId, onCommentAdded }: CommentSectionProps) {
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
        <div className="mt-4 border-t border-slate-800 pt-4">
            {/* Comment Input */}
            <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-accent-indigo placeholder:text-slate-500"
                />
                <button
                    type="submit"
                    disabled={!newComment.trim() || submitting}
                    className="p-2 bg-accent-indigo text-white rounded-xl hover:bg-accent-indigo/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                        <Link href={`/profile/${comment.username}`}>
                            {comment.userPhoto ? (
                                <img
                                    src={comment.userPhoto}
                                    alt={comment.userName}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center">
                                    <span className="text-xs text-white font-semibold">
                                        {comment.userName.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </Link>
                        <div className="flex-1">
                            <div className="bg-slate-800/30 rounded-xl p-3">
                                <div className="flex items-center justify-between mb-1">
                                    <Link href={`/profile/${comment.username}`} className="font-semibold text-sm text-white hover:text-accent-cyan">
                                        {comment.userName}
                                    </Link>
                                    <span className="text-xs text-slate-500">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-300">{comment.text}</p>
                            </div>
                            {user?.uid === comment.userId && (
                                <button
                                    onClick={() => handleDelete(comment.id)}
                                    className="text-xs text-red-400 hover:text-red-300 mt-1 ml-2 flex items-center gap-1"
                                >
                                    <Trash2 className="w-3 h-3" /> Delete
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {comments.length === 0 && (
                    <p className="text-center text-sm text-slate-500 py-2">No comments yet. Be the first to share your thoughts!</p>
                )}
            </div>
        </div>
    );
}
