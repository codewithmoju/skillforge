"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { getGroup, joinGroup, leaveGroup, Group } from "@/lib/services/groups";
import { getGroupDiscussionsPaginated, createDiscussion, likeDiscussion, GroupDiscussion, PaginatedDiscussions } from "@/lib/services/discussions";
import { Button } from "@/components/ui/Button";
import { Loader2, Users, Lock, Globe, Calendar, ArrowLeft, MessageSquare, Shield, Heart, Send } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

const PAGE_SIZE = 10;

export default function GroupDetailsPage() {
    const params = useParams();
    const groupId = params.groupId as string;
    const { user } = useAuth();
    const router = useRouter();

    const [group, setGroup] = useState<Group | null>(null);
    const [discussions, setDiscussions] = useState<GroupDiscussion[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [isMember, setIsMember] = useState(false);
    const [newPost, setNewPost] = useState("");
    const [posting, setPosting] = useState(false);
    const lastDocRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);

    useEffect(() => {
        loadGroup();
    }, [groupId, user]);

    const loadGroup = async () => {
        setLoading(true);
        try {
            const groupData = await getGroup(groupId);
            setGroup(groupData);
            if (user && groupData) {
                setIsMember(groupData.members?.includes(user.uid) || false);
            }

            // Load discussions with pagination
            const result = await getGroupDiscussionsPaginated(groupId, PAGE_SIZE);
            setDiscussions(result.items);
            lastDocRef.current = result.lastDoc;
            setHasMore(result.hasMore);
        } catch (error) {
            console.error("Error loading group:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadMoreDiscussions = async () => {
        if (loadingMore || !hasMore || !lastDocRef.current) return;

        setLoadingMore(true);
        try {
            const result = await getGroupDiscussionsPaginated(groupId, PAGE_SIZE, lastDocRef.current);
            setDiscussions(prev => [...prev, ...result.items]);
            lastDocRef.current = result.lastDoc;
            setHasMore(result.hasMore);
        } catch (error) {
            console.error("Error loading more discussions:", error);
        } finally {
            setLoadingMore(false);
        }
    };

    const handleJoinLeave = async () => {
        if (!user || !group) return;

        setActionLoading(true);
        try {
            if (isMember) {
                await leaveGroup(user.uid, groupId);
                setIsMember(false);
                setGroup(prev => prev ? { ...prev, membersCount: prev.membersCount - 1 } : null);
            } else {
                await joinGroup(user.uid, groupId);
                setIsMember(true);
                setGroup(prev => prev ? { ...prev, membersCount: prev.membersCount + 1 } : null);
            }
        } catch (error) {
            console.error("Error joining/leaving group:", error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleCreatePost = async () => {
        if (!user || !newPost.trim()) return;

        setPosting(true);
        try {
            const discussionId = await createDiscussion(
                groupId,
                user.uid,
                user.displayName || "Anonymous",
                newPost.trim(),
                user.photoURL || undefined
            );

            const newDiscussion: GroupDiscussion = {
                id: discussionId,
                groupId,
                authorId: user.uid,
                authorName: user.displayName || "Anonymous",
                authorAvatar: user.photoURL || undefined,
                content: newPost.trim(),
                likes: 0,
                likedBy: [],
                comments: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            setDiscussions(prev => [newDiscussion, ...prev]);
            setNewPost("");
        } catch (error) {
            console.error("Error creating post:", error);
        } finally {
            setPosting(false);
        }
    };

    const handleLike = async (discussionId: string) => {
        if (!user) return;

        try {
            await likeDiscussion(discussionId, user.uid);

            setDiscussions(prev => prev.map(d => {
                if (d.id === discussionId) {
                    const isLiked = d.likedBy?.includes(user.uid);
                    return {
                        ...d,
                        likes: isLiked ? d.likes - 1 : d.likes + 1,
                        likedBy: isLiked
                            ? d.likedBy.filter(id => id !== user.uid)
                            : [...(d.likedBy || []), user.uid]
                    };
                }
                return d;
            }));
        } catch (error) {
            console.error("Error liking:", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
            </div>
        );
    }

    if (!group) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
                <h1 className="text-2xl font-bold text-white mb-2">Group Not Found</h1>
                <p className="text-slate-400 mb-6">The group you're looking for doesn't exist or has been deleted.</p>
                <Link href="/groups">
                    <Button variant="outline">Back to Groups</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4">
            <div className="max-w-5xl mx-auto">
                <Link
                    href="/groups"
                    className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Groups
                </Link>

                {/* Header Card */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden mb-8">
                    <div className="h-48 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 relative">
                        {group.imageUrl && (
                            <img
                                src={group.imageUrl}
                                alt={group.name}
                                className="w-full h-full object-cover opacity-50"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                    </div>

                    <div className="px-8 pb-8 -mt-12 relative">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-4xl font-bold text-white">{group.name}</h1>
                                    {(group as any).isPrivate ? (
                                        <div className="bg-slate-800/80 px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-medium text-slate-300 border border-slate-700">
                                            <Lock className="w-3 h-3" />
                                            Private
                                        </div>
                                    ) : (
                                        <div className="bg-emerald-500/10 px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                                            <Globe className="w-3 h-3" />
                                            Public
                                        </div>
                                    )}
                                </div>
                                <p className="text-slate-300 text-lg mb-4 max-w-2xl">{group.description}</p>

                                <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                                    <div className="flex items-center gap-1.5">
                                        <Users className="w-4 h-4" />
                                        {group.membersCount || 0} members
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        Created {formatDistanceToNow(new Date(group.createdAt))} ago
                                    </div>
                                </div>

                                {group.tags && group.tags.length > 0 && (
                                    <div className="flex gap-2 mt-4">
                                        {group.tags.map(tag => (
                                            <span key={tag} className="px-2 py-1 bg-slate-800 rounded-lg text-xs text-slate-400 border border-slate-700">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Button
                                onClick={handleJoinLeave}
                                disabled={actionLoading}
                                variant={isMember ? "outline" : "primary"}
                                className={isMember ? "border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300" : "bg-accent-indigo hover:bg-accent-indigo/90"}
                            >
                                {actionLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : isMember ? (
                                    "Leave Group"
                                ) : (
                                    "Join Group"
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Feed */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Discussion Input */}
                        {isMember ? (
                            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-indigo to-accent-cyan flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-bold">
                                            {user?.displayName?.charAt(0).toUpperCase() || "?"}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <textarea
                                            value={newPost}
                                            onChange={(e) => setNewPost(e.target.value)}
                                            placeholder="Start a discussion..."
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-accent-indigo/50 resize-none min-h-[100px]"
                                        />
                                        <div className="flex justify-end mt-3">
                                            <Button
                                                onClick={handleCreatePost}
                                                disabled={posting || !newPost.trim()}
                                                size="sm"
                                            >
                                                {posting ? (
                                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                ) : (
                                                    <Send className="w-4 h-4 mr-2" />
                                                )}
                                                Post
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center">
                                <Lock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                                <h3 className="text-white font-medium mb-1">Members Only</h3>
                                <p className="text-slate-400 text-sm">Join this group to view and participate in discussions.</p>
                            </div>
                        )}

                        {/* Discussions Feed */}
                        <AnimatePresence>
                            {discussions.length > 0 ? (
                                <div className="space-y-4">
                                    {discussions.map((discussion) => (
                                        <motion.div
                                            key={discussion.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5"
                                        >
                                            <div className="flex gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                                    {discussion.authorAvatar ? (
                                                        <img src={discussion.authorAvatar} alt="" className="w-full h-full rounded-full object-cover" />
                                                    ) : (
                                                        <span className="text-white font-bold text-sm">
                                                            {discussion.authorName?.charAt(0).toUpperCase() || "?"}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-medium text-white">{discussion.authorName}</span>
                                                        <span className="text-xs text-slate-500">
                                                            {formatDistanceToNow(new Date(discussion.createdAt))} ago
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-300 mb-4 whitespace-pre-wrap">{discussion.content}</p>

                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            onClick={() => handleLike(discussion.id)}
                                                            className={`flex items-center gap-1.5 text-sm transition-colors ${discussion.likedBy?.includes(user?.uid || "")
                                                                    ? "text-pink-400"
                                                                    : "text-slate-400 hover:text-pink-400"
                                                                }`}
                                                        >
                                                            <Heart className={`w-4 h-4 ${discussion.likedBy?.includes(user?.uid || "") ? "fill-current" : ""}`} />
                                                            {discussion.likes || 0}
                                                        </button>
                                                        <button className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-accent-cyan transition-colors">
                                                            <MessageSquare className="w-4 h-4" />
                                                            {discussion.comments || 0}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {/* Load More Button */}
                                    {hasMore && (
                                        <div className="flex justify-center pt-4">
                                            <Button
                                                variant="outline"
                                                onClick={loadMoreDiscussions}
                                                disabled={loadingMore}
                                                className="w-full max-w-xs"
                                            >
                                                {loadingMore ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Loading...
                                                    </>
                                                ) : (
                                                    "Load More Discussions"
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-2xl">
                                    <MessageSquare className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                                    <h3 className="text-slate-400 font-medium">No discussions yet</h3>
                                    <p className="text-slate-500 text-sm">Be the first to start a conversation!</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                            <h3 className="text-white font-semibold mb-4">About</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {group.description}
                            </p>
                        </div>

                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-white font-semibold">Members</h3>
                                <span className="text-xs text-accent-indigo cursor-pointer hover:underline">View All</span>
                            </div>
                            <div className="flex -space-x-2 overflow-hidden">
                                {group.membersCount > 0 && [...Array(Math.min(5, group.membersCount))].map((_, i) => (
                                    <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-slate-800 flex items-center justify-center text-xs text-white font-medium">
                                        {String.fromCharCode(65 + i)}
                                    </div>
                                ))}
                                {group.membersCount > 5 && (
                                    <div className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-slate-800 flex items-center justify-center text-xs text-slate-400 font-medium">
                                        +{group.membersCount - 5}
                                    </div>
                                )}
                                {(!group.membersCount || group.membersCount === 0) && (
                                    <p className="text-slate-500 text-sm">No members yet</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
