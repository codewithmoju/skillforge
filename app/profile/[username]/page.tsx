"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Settings, Lock, MapPin, Calendar, Link as LinkIcon, Loader2, Grid, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FollowButton } from "@/components/social/FollowButton";
import { PostCard } from "@/components/social/PostCard";
import { getUserByUsername, FirestoreUserData } from "@/lib/services/firestore";
import { getUserPosts, getSavedPosts, isPostLiked, isPostSaved, Post } from "@/lib/services/posts";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";

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
    }, [username]);

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

        try {
            const saved = await getSavedPosts(currentUser.uid);
            setPosts(saved);
        } catch (error) {
            console.error('Error loading saved posts:', error);
        }
    };

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        if (tab === 'saved') {
            loadSavedPosts();
        } else {
            loadProfile();
        }
    };

    if (loading) {
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
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 mb-6"
                >
                    <div className="flex items-start gap-6">
                        {/* Profile Picture */}
                        {userData.profilePicture ? (
                            <img
                                src={userData.profilePicture}
                                alt={userData.name}
                                className="w-32 h-32 rounded-full object-cover border-4 border-slate-800"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center border-4 border-slate-800">
                                <span className="text-white font-bold text-4xl">
                                    {userData.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}

                        {/* Profile Info */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-1">{userData.name}</h1>
                                    <p className="text-slate-400">@{userData.username}</p>
                                </div>

                                {isOwnProfile ? (
                                    <Link href="/settings">
                                        <Button variant="outline" size="sm">
                                            <Settings className="w-4 h-4 mr-2" />
                                            Edit Profile
                                        </Button>
                                    </Link>
                                ) : (
                                    <FollowButton
                                        targetUserId={userData.uid}
                                        isPrivate={userData.isPrivate}
                                    />
                                )}
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-4 md:gap-6 mb-4">
                                <div>
                                    <span className="font-bold text-white">{userData.postsCount || 0}</span>
                                    <span className="text-slate-400 ml-1 text-sm md:text-base">posts</span>
                                </div>
                                <Link href={`/profile/${username}/followers`} className="hover:opacity-80 transition-opacity">
                                    <span className="font-bold text-white">{userData.followers || 0}</span>
                                    <span className="text-slate-400 ml-1 text-sm md:text-base">followers</span>
                                </Link>
                                <Link href={`/profile/${username}/following`} className="hover:opacity-80 transition-opacity">
                                    <span className="font-bold text-white">{userData.following || 0}</span>
                                    <span className="text-slate-400 ml-1 text-sm md:text-base">following</span>
                                </Link>
                            </div>

                            {/* Bio */}
                            {userData.bio && (
                                <p className="text-slate-300 mb-4">{userData.bio}</p>
                            )}

                            {/* Learning Stats */}
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2 text-accent-cyan">
                                    <span className="font-semibold">Level {userData.level}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <span>{userData.xp} XP</span>
                                </div>
                                <div className="flex items-center gap-2 text-orange-400">
                                    <span>{userData.streak} day streak 🔥</span>
                                </div>
                            </div>

                            {/* Privacy Badge */}
                            {userData.isPrivate && (
                                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-sm">
                                    <Lock className="w-4 h-4" />
                                    Private Account
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-slate-800">
                    <button
                        onClick={() => handleTabChange('posts')}
                        className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${activeTab === 'posts'
                            ? 'text-white border-b-2 border-accent-indigo'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        <Grid className="w-5 h-5" />
                        Posts
                    </button>
                    {isOwnProfile && (
                        <button
                            onClick={() => handleTabChange('saved')}
                            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${activeTab === 'saved'
                                ? 'text-white border-b-2 border-accent-indigo'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <Bookmark className="w-5 h-5" />
                            Saved
                        </button>
                    )}
                </div>

                {/* Posts Grid */}
                {posts.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                            <Grid className="w-10 h-10 text-slate-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
                        <p className="text-slate-400">
                            {isOwnProfile
                                ? "Share your learning journey with your first post!"
                                : "This user hasn't posted anything yet."}
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
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
