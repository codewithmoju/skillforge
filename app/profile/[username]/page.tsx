"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Settings, MapPin, Link as LinkIcon, Loader2, Grid, Bookmark,
    Trophy, Flame, Star, Award, Target, Zap, Crown, Shield,
    TrendingUp, BookOpen, Code, Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FollowButton } from "@/components/social/FollowButton";
import { PostCard } from "@/components/social/PostCard";
import { getUserByUsername, FirestoreUserData } from "@/lib/services/firestore";
import { getUserPosts, getSavedPosts, isPostLiked, isPostSaved } from "@/lib/services/posts";
import type { Post } from "@/lib/services/posts";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

type TabType = 'posts' | 'saved' | 'achievements';

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

            const newSaved = new Set(savedPosts);
            saved.forEach(p => newSaved.add(p.id));
            setSavedPosts(newSaved);

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
        } else if (tab === 'posts') {
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

    const xpProgress = ((userData.xp % 1000) / 1000) * 100;
    const nextLevelXP = (userData.level) * 1000;

    return (
        <div className="min-h-screen pb-20 bg-gradient-to-b from-slate-900 via-slate-900 to-black">
            {/* Epic Header with Gradient */}
            <div className="h-64 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                {/* Floating particles effect */}
                <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, -30, 0],
                                opacity: [0.2, 0.8, 0.2],
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
                {/* Main Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border-2 border-purple-500/30 rounded-3xl p-8 shadow-2xl shadow-purple-500/20"
                >
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Avatar with Level Badge */}
                        <div className="relative mx-auto md:mx-0">
                            <div className="relative">
                                {userData.profilePicture ? (
                                    <div className="relative w-32 h-32 md:w-40 md:h-40">
                                        <Image
                                            src={userData.profilePicture}
                                            alt={userData.name}
                                            fill
                                            className="rounded-full object-cover border-4 border-purple-500 shadow-lg shadow-purple-500/50"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-4 border-purple-400 shadow-lg shadow-purple-500/50">
                                        <span className="text-white font-bold text-5xl">
                                            {userData.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}

                                {/* Level Badge */}
                                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-3 border-4 border-slate-900 shadow-lg">
                                    <div className="flex flex-col items-center">
                                        <Crown className="w-5 h-5 text-white mb-0.5" />
                                        <span className="text-white font-bold text-sm">{userData.level}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <div>
                                    <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3 justify-center md:justify-start">
                                        {userData.name}
                                        <Trophy className="w-6 h-6 text-yellow-400" />
                                    </h1>
                                    <p className="text-purple-300 text-lg">@{userData.username}</p>
                                </div>

                                <div className="flex items-center justify-center gap-3">
                                    {isOwnProfile ? (
                                        <Link href="/settings">
                                            <Button variant="outline" className="gap-2 border-purple-500 hover:bg-purple-500/20">
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
                                <p className="text-slate-300 mb-4 max-w-2xl mx-auto md:mx-0 leading-relaxed">
                                    {userData.bio}
                                </p>
                            )}

                            {/* Additional Info */}
                            {(userData.location || userData.occupation || userData.website) && (
                                <div className="flex flex-wrap gap-4 mb-6 text-sm text-slate-400 justify-center md:justify-start">
                                    {userData.location && (
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4" />
                                            <span>{userData.location}</span>
                                        </div>
                                    )}
                                    {userData.occupation && (
                                        <div className="flex items-center gap-1.5">
                                            <Briefcase className="w-4 h-4" />
                                            <span>{userData.occupation}</span>
                                        </div>
                                    )}
                                    {userData.website && (
                                        <a
                                            href={userData.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 hover:text-purple-400 transition-colors"
                                        >
                                            <LinkIcon className="w-4 h-4" />
                                            <span>{userData.website.replace(/^https?:\/\//, '')}</span>
                                        </a>
                                    )}
                                </div>
                            )}

                            {/* XP Progress Bar */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-purple-300">Level {userData.level}</span>
                                    <span className="text-sm text-slate-400">{userData.xp} / {nextLevelXP} XP</span>
                                </div>
                                <div className="h-3 bg-slate-700 rounded-full overflow-hidden border border-purple-500/30">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-[length:200%_100%]"
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${xpProgress}%`,
                                            backgroundPosition: ['0% 0%', '100% 0%']
                                        }}
                                        transition={{
                                            width: { duration: 1, ease: "easeOut" },
                                            backgroundPosition: { duration: 2, repeat: Infinity, ease: "linear" }
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Social Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-slate-800/50 rounded-xl p-4 border border-purple-500/20 text-center">
                                    <div className="text-2xl font-bold text-white">{userData.postsCount || 0}</div>
                                    <div className="text-xs text-slate-400">Posts</div>
                                </div>
                                <Link href={`/profile/${username}/followers`} className="bg-slate-800/50 rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-colors text-center">
                                    <div className="text-2xl font-bold text-white">{userData.followers || 0}</div>
                                    <div className="text-xs text-slate-400">Followers</div>
                                </Link>
                                <Link href={`/profile/${username}/following`} className="bg-slate-800/50 rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-colors text-center">
                                    <div className="text-2xl font-bold text-white">{userData.following || 0}</div>
                                    <div className="text-xs text-slate-400">Following</div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Gamification Stats Grid */}
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            icon={Flame}
                            label="Streak"
                            value={`${userData.streak} Days`}
                            gradient="from-orange-500 to-red-500"
                            iconBg="bg-orange-500/10"
                            iconColor="text-orange-400"
                        />
                        <StatCard
                            icon={Target}
                            label="Lessons"
                            value={userData.totalLessonsCompleted || 0}
                            gradient="from-blue-500 to-cyan-500"
                            iconBg="bg-blue-500/10"
                            iconColor="text-blue-400"
                        />
                        <StatCard
                            icon={Award}
                            label="Achievements"
                            value={userData.achievements?.length || 0}
                            gradient="from-purple-500 to-pink-500"
                            iconBg="bg-purple-500/10"
                            iconColor="text-purple-400"
                        />
                        <StatCard
                            icon={TrendingUp}
                            label="Roadmaps"
                            value={userData.completedRoadmaps || 0}
                            gradient="from-green-500 to-emerald-500"
                            iconBg="bg-green-500/10"
                            iconColor="text-green-400"
                        />
                    </div>
                </motion.div>

                {/* Content Tabs */}
                <div className="mt-8">
                    <div className="flex items-center gap-8 border-b border-slate-800 mb-6">
                        <TabButton
                            active={activeTab === 'posts'}
                            onClick={() => handleTabChange('posts')}
                            icon={Grid}
                            label="POSTS"
                        />
                        {isOwnProfile && (
                            <TabButton
                                active={activeTab === 'saved'}
                                onClick={() => handleTabChange('saved')}
                                icon={Bookmark}
                                label="SAVED"
                            />
                        )}
                        <TabButton
                            active={activeTab === 'achievements'}
                            onClick={() => handleTabChange('achievements')}
                            icon={Trophy}
                            label="ACHIEVEMENTS"
                        />
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'achievements' ? (
                        <AchievementsSection achievements={userData.achievements?.map(a => a.id) || []} />
                    ) : loading ? (
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

// Stat Card Component
function StatCard({ icon: Icon, label, value, gradient, iconBg, iconColor }: {
    icon: any;
    label: string;
    value: string | number;
    gradient: string;
    iconBg: string;
    iconColor: string;
}) {
    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className={`bg-gradient-to-br ${gradient} p-[2px] rounded-xl`}
        >
            <div className="bg-slate-900 rounded-xl p-4 h-full">
                <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${iconBg}`}>
                        <Icon className={`w-6 h-6 ${iconColor}`} />
                    </div>
                    <div>
                        <div className="text-sm text-slate-400">{label}</div>
                        <div className="text-2xl font-bold text-white">{value}</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// Tab Button Component
function TabButton({ active, onClick, icon: Icon, label }: {
    active: boolean;
    onClick: () => void;
    icon: any;
    label: string;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 pb-4 text-sm font-medium transition-all relative",
                active ? "text-white" : "text-slate-400 hover:text-slate-200"
            )}
        >
            <Icon className="w-4 h-4" />
            {label}
            {active && (
                <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
                />
            )}
        </button>
    );
}

// Achievements Section
function AchievementsSection({ achievements }: { achievements: string[] }) {
    const achievementData = [
        { id: 'first-post', name: 'First Steps', description: 'Created your first post', icon: Star, color: 'from-blue-500 to-cyan-500' },
        { id: 'week-streak', name: 'Week Warrior', description: '7-day learning streak', icon: Flame, color: 'from-orange-500 to-red-500' },
        { id: 'social-butterfly', name: 'Social Butterfly', description: '10 followers gained', icon: Shield, color: 'from-purple-500 to-pink-500' },
        { id: 'knowledge-seeker', name: 'Knowledge Seeker', description: 'Completed 5 lessons', icon: BookOpen, color: 'from-green-500 to-emerald-500' },
        { id: 'code-master', name: 'Code Master', description: 'Completed a roadmap', icon: Code, color: 'from-yellow-500 to-orange-500' },
        { id: 'rising-star', name: 'Rising Star', description: 'Reached level 5', icon: Zap, color: 'from-indigo-500 to-purple-500' },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievementData.map((achievement) => {
                const isUnlocked = achievements.includes(achievement.id);
                return (
                    <motion.div
                        key={achievement.id}
                        whileHover={isUnlocked ? { scale: 1.05 } : {}}
                        className={cn(
                            "relative rounded-xl p-6 border-2 transition-all",
                            isUnlocked
                                ? `bg-gradient-to-br ${achievement.color} border-transparent`
                                : "bg-slate-800/30 border-slate-700 opacity-50"
                        )}
                    >
                        {isUnlocked && (
                            <div className="absolute top-2 right-2">
                                <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                            </div>
                        )}
                        <achievement.icon className={cn(
                            "w-12 h-12 mb-3",
                            isUnlocked ? "text-white" : "text-slate-600"
                        )} />
                        <h3 className={cn(
                            "font-bold text-lg mb-1",
                            isUnlocked ? "text-white" : "text-slate-500"
                        )}>
                            {achievement.name}
                        </h3>
                        <p className={cn(
                            "text-sm",
                            isUnlocked ? "text-white/80" : "text-slate-600"
                        )}>
                            {achievement.description}
                        </p>
                        {!isUnlocked && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-6xl opacity-10">🔒</div>
                            </div>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
}