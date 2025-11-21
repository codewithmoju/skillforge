"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Lock, MapPin, Calendar, Link as LinkIcon, Loader2, Grid, Bookmark, Users, Trophy, Flame } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FollowButton } from "@/components/social/FollowButton";
import { PostCard } from "@/components/social/PostCard";
import { getUserByUsername, FirestoreUserData } from "@/lib/services/firestore";
import { getUserPosts, getSavedPosts, isPostLiked, isPostSaved, Post } from "@/lib/services/posts";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";
import { cn } from "@/lib/utils";

type TabType = 'posts' | 'saved';

export default function ProfilePage() {
    const params = useParams();
    const username = params.username as string;
    const { user: currentUser } = useAuth();

    const [userData, setUserData] = useState<FirestoreUserData | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
    const [activeTab, setActiveTab] = useState<TabType>('posts');
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const isOwnProfile = currentUser?.uid === userData?.uid;

    useEffect(() => {
        loadProfile();
    }, [username, currentUser]);

    const loadProfile = async () => {
        setLoading(true);
        setNotFound(false);

        try {
            const user = await getUserByUsername(username);

            if (!user) {
                setNotFound(true);
                setLoading(false);
                return;
            }

            setUserData(user);

            // Load posts
            const userPosts = await getUserPosts(user.uid);
            setPosts(userPosts);

            // Check liked/saved status if logged in
            if (currentUser) {
                const liked = new Set<string>();
                const saved = new Set<string>();

                for (const post of userPosts) {
                    const [isLiked, isSaved] = await Promise.all([
                        isPostLiked(currentUser.uid, post.id),
                        isPostSaved(currentUser.uid, post.id),
                    ]);
                    if (isLiked) liked.add(post.id);
                    if (isSaved) saved.add(post.id);
                }

                setLikedPosts(liked);
                setSavedPosts(saved);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            setNotFound(true);
        } finally {
            setLoading(false);
        }
    };

    const loadSavedPosts = async () => {
        if (!currentUser || !isOwnProfile) return;

        setLoading(true);
        try {
            const saved = await getSavedPosts(currentUser.uid);
            setPosts(saved);

            // Update saved status for these posts (they are all saved by definition)
            const newSaved = new Set(savedPosts);
            saved.forEach(p => newSaved.add(p.id));
            setSavedPosts(newSaved);

            // Check likes for saved posts
            const liked = new Set(likedPosts);
            for (const post of saved) {
                if (await isPostLiked(currentUser.uid, post.id)) {
                    liked.add(post.id);
                }
            }
            setLikedPosts(liked);

        } catch (error) {
            console.error('Error loading saved posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePostDeleted = (deletedPostId: string) => {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== deletedPostId));
        if (activeTab === 'posts') {
            setUserData(prevData => prevData ? { ...prevData, postsCount: (prevData.postsCount || 0) - 1 } : null);
        }
    };

    const handleTabChange = (tab: TabType) => {
        if (activeTab === tab) return;
        setActiveTab(tab);
        if (tab === 'saved') {
            loadSavedPosts();
        } else {
            loadProfile();
        }
    };

    if (loading && !userData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
            </div>
        );
    }

    if (notFound || !userData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-2">User Not Found</h1>
                    <p className="text-slate-400 mb-6">The profile you're looking for doesn't exist.</p>
                    <Link href="/social">
                        <Button>Back to Feed</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Cover Image (Optional - using gradient for now) */}
            <div className="h-48 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative">
                <div className="absolute inset-0 bg-grid-white/[0.02]" />
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl"
                >
                    <div className="flex flex-col md:flex-row gap-6 md:items-start">
                        {/* Profile Picture */}
                        <div className="flex-shrink-0 mx-auto md:mx-0">
                            {userData.profilePicture ? (
                                <img
                                    src={userData.profilePicture}
                                    alt={userData.name}
                                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-slate-900 shadow-lg"
                                />
                            ) : (
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center border-4 border-slate-900 shadow-lg">
                                    <span className="text-white font-bold text-5xl">
                                        {userData.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-1">{userData.name}</h1>
                                    <p className="text-slate-400 text-lg">@{userData.username}</p>
                                </div>

                                <div className="flex items-center justify-center gap-3">
                                    {isOwnProfile ? (
                                        <Link href="/settings">
                                            <Button variant="outline" className="gap-2">
                                                <Settings className="w-4 h-4" />
                                                Edit Profile
                                            </Button>
                                        </Link>
                                    ) : (
                                        <FollowButton
                                            targetUserId={userData.uid}
                                            isPrivate={userData.isPrivate}
                                            onFollowChange={(isFollowing) => {
                                                setUserData(prev => prev ? {
                                                    ...prev,
                                                    followers: (prev.followers || 0) + (isFollowing ? 1 : -1)
                                                } : null);
                                            }}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Bio */}
                            {userData.bio && (
                                <p className="text-slate-300 mb-6 max-w-2xl mx-auto md:mx-0 leading-relaxed">
                                    {userData.bio}
                                </p>
                            )}

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-4 border-t border-slate-800 pt-6">
                                <div className="text-center md:text-left">
                                    <div className="text-2xl font-bold text-white">{userData.postsCount || 0}</div>
                                    <div className="text-sm text-slate-500">Posts</div>
                                </div>
                                <Link href={`/profile/${username}/followers`} className="text-center md:text-left hover:opacity-80 transition-opacity">
                                    <div className="text-2xl font-bold text-white">{userData.followers || 0}</div>
                                    <div className="text-sm text-slate-500">Followers</div>
                                </Link>
                                <Link href={`/profile/${username}/following`} className="text-center md:text-left hover:opacity-80 transition-opacity">
                                    <div className="text-2xl font-bold text-white">{userData.following || 0}</div>
                                    <div className="text-sm text-slate-500">Following</div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Gamification Stats */}
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-slate-800/50 rounded-xl p-4 flex items-center gap-4 border border-slate-700/50">
                            <div className="p-3 rounded-lg bg-accent-indigo/10 text-accent-indigo">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-sm text-slate-400">Level</div>
                                <div className="text-xl font-bold text-white">{userData.level}</div>
                            </div>
                        </div>
                        <div className="bg-slate-800/50 rounded-xl p-4 flex items-center gap-4 border border-slate-700/50">
                            <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-sm text-slate-400">XP</div>
                                <div className="text-xl font-bold text-white">{userData.xp}</div>
                            </div>
                        </div>
                        <div className="bg-slate-800/50 rounded-xl p-4 flex items-center gap-4 border border-slate-700/50">
                            <div className="p-3 rounded-lg bg-orange-500/10 text-orange-400">
                                <Flame className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-sm text-slate-400">Streak</div>
                                <div className="text-xl font-bold text-white">{userData.streak} Days</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Content Tabs */}
                <div className="mt-8">
                    <div className="flex items-center gap-8 border-b border-slate-800 mb-6">
                        <button
                            onClick={() => handleTabChange('posts')}
                            className={cn(
                                "flex items-center gap-2 pb-4 text-sm font-medium transition-all relative",
                                activeTab === 'posts' ? "text-white" : "text-slate-400 hover:text-slate-200"
                            )}
                        >
                            <Grid className="w-4 h-4" />
                            POSTS
                            {activeTab === 'posts' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-cyan"
                                />
                            )}
                        </button>
                        {isOwnProfile && (
                            <button
                                onClick={() => handleTabChange('saved')}
                                className={cn(
                                    "flex items-center gap-2 pb-4 text-sm font-medium transition-all relative",
                                    activeTab === 'saved' ? "text-white" : "text-slate-400 hover:text-slate-200"
                                )}
                            >
                                <Bookmark className="w-4 h-4" />
                                SAVED
                                {activeTab === 'saved' && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-cyan"
                                    />
                                )}
                            </button>
                        )}
                    </div>

                    {/* Posts Grid */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
                        </div>
                    ) : posts.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-20 bg-slate-900/30 rounded-2xl border border-slate-800/50"
                        >
                            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                                {activeTab === 'posts' ? (
                                    <Grid className="w-8 h-8 text-slate-600" />
                                ) : (
                                    <Bookmark className="w-8 h-8 text-slate-600" />
                                )}
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                {activeTab === 'posts' ? "No posts yet" : "No saved posts"}
                            </h3>
                            <p className="text-slate-400">
                                {activeTab === 'posts'
                                    ? (isOwnProfile ? "Share your learning journey with your first post!" : "This user hasn't posted anything yet.")
                                    : "Posts you save will appear here."}
                            </p>
                        </motion.div>
                    ) : (
                        <div className="space-y-6">
                            <AnimatePresence mode="popLayout">
                                {posts.map((post) => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        isLiked={likedPosts.has(post.id)}
                                        isSaved={savedPosts.has(post.id)}
                                        onDelete={handlePostDeleted}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}