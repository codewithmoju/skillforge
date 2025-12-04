"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Settings, MapPin, Link as LinkIcon, Loader2, Grid, Bookmark,
    Trophy, Flame, Star, Award, Target, Zap, Crown, Shield,
    TrendingUp, BookOpen, Code, Briefcase, Sparkles, Rocket,
    Medal, Heart, Users, Eye
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FollowButton } from "@/components/social/FollowButton";
import { PostCard } from "@/components/social/PostCard";
import { getUserByUsername, FirestoreUserData } from "@/lib/services/firestore";
import { getUserPosts, getSavedPosts, isPostLiked, isPostSaved } from "@/lib/services/posts";
import { getUserProgress } from "@/lib/services/userProgress";
import { ACHIEVEMENTS } from "@/lib/utils/achievements";
import type { Post } from "@/lib/services/posts";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

type TabType = 'posts' | 'saved' | 'achievements';

// Floating particle component for ambient effect
const FloatingParticle = ({ delay, duration, size }: { delay: number; duration: number; size: number }) => (
    <motion.div
        className="absolute rounded-full"
        style={{
            width: size,
            height: size,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(236,72,153,0.2) 50%, transparent 70%)`,
        }}
        animate={{
            y: [-20, -60, -20],
            x: [0, Math.random() * 30 - 15, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
        }}
        transition={{
            duration,
            repeat: Infinity,
            delay,
            ease: "easeInOut",
        }}
    />
);

// Animated stat ring component
const StatRing = ({ value, max, color, size = 80 }: { value: number; max: number; color: string; size?: number }) => {
    const percentage = Math.min((value / max) * 100, 100);
    const circumference = 2 * Math.PI * (size / 2 - 8);
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <svg width={size} height={size} className="transform -rotate-90">
            <circle
                cx={size / 2}
                cy={size / 2}
                r={size / 2 - 8}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="6"
                fill="none"
            />
            <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={size / 2 - 8}
                stroke={`url(#gradient-${color})`}
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ strokeDasharray: circumference }}
            />
            <defs>
                <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={color === 'purple' ? '#a855f7' : color === 'cyan' ? '#06b6d4' : color === 'orange' ? '#f97316' : '#22c55e'} />
                    <stop offset="100%" stopColor={color === 'purple' ? '#ec4899' : color === 'cyan' ? '#3b82f6' : color === 'orange' ? '#ef4444' : '#10b981'} />
                </linearGradient>
            </defs>
        </svg>
    );
};

export default function ProfilePage() {
    const params = useParams();
    const username = params.username as string;
    const { user: currentUser } = useAuth();

    const [userData, setUserData] = useState<FirestoreUserData | null>(null);
    const [userStats, setUserStats] = useState<{
        xp: number;
        level: number;
        streak: number;
        totalLessonsCompleted: number;
        completedRoadmaps: number;
    } | null>(null);
    const [earnedAchievements, setEarnedAchievements] = useState<string[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
    const [activeTab, setActiveTab] = useState<TabType>('posts');
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const isOwnProfile = currentUser?.uid === userData?.uid;

    // Calculate level progress
    const xpForCurrentLevel = useMemo(() => {
        if (!userStats) return 0;
        return userStats.xp % 1000;
    }, [userStats]);

    const xpProgress = useMemo(() => {
        return (xpForCurrentLevel / 1000) * 100;
    }, [xpForCurrentLevel]);

    // Get rank title based on level
    const getRankTitle = (level: number) => {
        if (level >= 50) return { title: "Legendary Master", icon: Crown, color: "from-yellow-400 to-amber-600" };
        if (level >= 40) return { title: "Grand Champion", icon: Trophy, color: "from-purple-400 to-pink-600" };
        if (level >= 30) return { title: "Elite Scholar", icon: Medal, color: "from-cyan-400 to-blue-600" };
        if (level >= 20) return { title: "Senior Learner", icon: Star, color: "from-green-400 to-emerald-600" };
        if (level >= 10) return { title: "Rising Star", icon: Rocket, color: "from-orange-400 to-red-600" };
        if (level >= 5) return { title: "Apprentice", icon: Zap, color: "from-blue-400 to-indigo-600" };
        return { title: "Novice", icon: BookOpen, color: "from-slate-400 to-slate-600" };
    };

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

            // Fetch dynamic user progress stats from userProgress collection
            const progress = await getUserProgress(user.uid);
            if (progress) {
                setUserStats({
                    xp: progress.xp || 0,
                    level: progress.level || 1,
                    streak: progress.streak || 0,
                    totalLessonsCompleted: progress.totalLessonsCompleted || 0,
                    completedRoadmaps: progress.completedRoadmaps || 0
                });

                // Compute earned achievements based on user stats
                const earned = ACHIEVEMENTS.filter(achievement => {
                    switch (achievement.type) {
                        case 'xp': return (progress.xp || 0) >= achievement.requirement;
                        case 'streak': return (progress.streak || 0) >= achievement.requirement;
                        case 'lessons': return (progress.totalLessonsCompleted || 0) >= achievement.requirement;
                        case 'roadmaps': return (progress.completedRoadmaps || 0) >= achievement.requirement;
                        default: return false;
                    }
                }).map(a => a.id);
                setEarnedAchievements(earned);
            } else {
                // Default stats if no progress document exists
                setUserStats({
                    xp: 0,
                    level: 1,
                    streak: 0,
                    totalLessonsCompleted: 0,
                    completedRoadmaps: 0
                });
            }

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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
                <motion.div
                    className="flex flex-col items-center gap-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="relative">
                        <div className="absolute inset-0 blur-xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-50 animate-pulse" />
                        <Loader2 className="w-12 h-12 text-purple-400 animate-spin relative" />
                    </div>
                    <p className="text-slate-400 animate-pulse">Loading profile...</p>
                </motion.div>
            </div>
        );
    }

    if (notFound || !userData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-slate-700">
                        <Users className="w-12 h-12 text-slate-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">User Not Found</h1>
                    <p className="text-slate-400 mb-6">The profile you're looking for doesn't exist.</p>
                    <Link href="/social">
                        <Button className="gap-2">
                            <Rocket className="w-4 h-4" />
                            Back to Feed
                        </Button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    const rank = getRankTitle(userStats?.level || 1);
    const RankIcon = rank.icon;

    return (
        <div className="min-h-screen pb-20 bg-gradient-to-br from-slate-950 via-purple-950/10 to-slate-950 relative overflow-hidden">
            {/* Ambient floating particles */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {[...Array(15)].map((_, i) => (
                    <FloatingParticle key={i} delay={i * 0.3} duration={4 + Math.random() * 3} size={8 + Math.random() * 20} />
                ))}
            </div>

            {/* Epic Header with Holographic Effect */}
            <div className="relative h-72 md:h-80 overflow-hidden">
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-900/60 to-pink-900/40" />

                {/* Animated mesh pattern */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0 bg-[url('/grid.svg')]" />
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                {/* Holographic scanlines */}
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute h-px w-full bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"
                            style={{ top: `${20 + i * 12}%` }}
                            animate={{ opacity: [0.2, 0.5, 0.2], x: [-100, 100] }}
                            transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
                        />
                    ))}
                </div>

                {/* Fade to content */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-44 relative z-10">
                {/* Main Profile Card - Glassmorphism */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                >
                    {/* Glow effect behind card */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-cyan-600/20 rounded-3xl blur-xl" />

                    <div className="relative bg-gradient-to-br from-slate-900/95 to-slate-950/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Left Section - Avatar & Level */}
                            <div className="flex flex-col items-center lg:items-start gap-4">
                                {/* Avatar with ring indicator */}
                                <div className="relative">
                                    <div className="absolute -inset-3">
                                        <StatRing value={xpForCurrentLevel} max={1000} color="purple" size={176} />
                                    </div>
                                    {userData.profilePicture ? (
                                        <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-slate-800 shadow-xl">
                                            <Image
                                                src={userData.profilePicture}
                                                alt={userData.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center border-4 border-slate-800 shadow-xl">
                                            <span className="text-white font-bold text-5xl">
                                                {userData.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}

                                    {/* Level badge */}
                                    <motion.div
                                        className="absolute -bottom-2 -right-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl px-4 py-2 border-4 border-slate-900 shadow-lg"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <Crown className="w-4 h-4 text-white" />
                                            <span className="text-white font-bold text-lg">{userStats?.level || 1}</span>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Rank badge */}
                                <motion.div
                                    className={cn("flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r", rank.color)}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <RankIcon className="w-4 h-4 text-white" />
                                    <span className="text-white text-sm font-semibold">{rank.title}</span>
                                </motion.div>
                            </div>

                            {/* Center Section - Profile Info */}
                            <div className="flex-1 text-center lg:text-left">
                                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 justify-center lg:justify-start mb-1">
                                            <h1 className="text-3xl md:text-4xl font-bold text-white">{userData.name}</h1>
                                            {earnedAchievements.length >= 5 && (
                                                <motion.div
                                                    animate={{ rotate: [0, 10, -10, 0] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    <Sparkles className="w-6 h-6 text-yellow-400" />
                                                </motion.div>
                                            )}
                                        </div>
                                        <p className="text-purple-400 text-lg">@{userData.username}</p>
                                    </div>

                                    <div className="flex items-center justify-center gap-3">
                                        {isOwnProfile ? (
                                            <Link href="/settings">
                                                <Button variant="outline" className="gap-2 border-purple-500/50 hover:bg-purple-500/20 hover:border-purple-400">
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
                                    <p className="text-slate-300 mb-4 max-w-2xl leading-relaxed">{userData.bio}</p>
                                )}

                                {/* Meta info */}
                                {(userData.location || userData.occupation || userData.website) && (
                                    <div className="flex flex-wrap gap-4 mb-6 text-sm text-slate-400 justify-center lg:justify-start">
                                        {userData.occupation && (
                                            <div className="flex items-center gap-1.5 bg-slate-800/50 px-3 py-1.5 rounded-full">
                                                <Briefcase className="w-3.5 h-3.5" />
                                                <span>{userData.occupation}</span>
                                            </div>
                                        )}
                                        {userData.location && (
                                            <div className="flex items-center gap-1.5 bg-slate-800/50 px-3 py-1.5 rounded-full">
                                                <MapPin className="w-3.5 h-3.5" />
                                                <span>{userData.location}</span>
                                            </div>
                                        )}
                                        {userData.website && (
                                            <a
                                                href={userData.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 bg-slate-800/50 px-3 py-1.5 rounded-full hover:bg-purple-500/20 transition-colors"
                                            >
                                                <LinkIcon className="w-3.5 h-3.5" />
                                                <span>{userData.website.replace(/^https?:\/\//, '')}</span>
                                            </a>
                                        )}
                                    </div>
                                )}

                                {/* XP Progress bar */}
                                <div className="mb-6 max-w-md mx-auto lg:mx-0">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-purple-300">Level {userStats?.level || 1}</span>
                                        <span className="text-sm text-slate-400">{xpForCurrentLevel} / 1000 XP</span>
                                    </div>
                                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-[length:200%_100%] relative"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${xpProgress}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                        >
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                                                animate={{ x: ['-100%', '200%'] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            />
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Social Stats */}
                                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                                    <motion.div
                                        className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center hover:border-purple-500/50 transition-colors cursor-default"
                                        whileHover={{ y: -2 }}
                                    >
                                        <div className="text-2xl font-bold text-white">{userData.postsCount || 0}</div>
                                        <div className="text-xs text-slate-400 uppercase tracking-wide">Posts</div>
                                    </motion.div>
                                    <Link href={`/profile/${username}/followers`}>
                                        <motion.div
                                            className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center hover:border-purple-500/50 transition-all"
                                            whileHover={{ y: -2, scale: 1.02 }}
                                        >
                                            <div className="text-2xl font-bold text-white">{userData.followers || 0}</div>
                                            <div className="text-xs text-slate-400 uppercase tracking-wide">Followers</div>
                                        </motion.div>
                                    </Link>
                                    <Link href={`/profile/${username}/following`}>
                                        <motion.div
                                            className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center hover:border-purple-500/50 transition-all"
                                            whileHover={{ y: -2, scale: 1.02 }}
                                        >
                                            <div className="text-2xl font-bold text-white">{userData.following || 0}</div>
                                            <div className="text-xs text-slate-400 uppercase tracking-wide">Following</div>
                                        </motion.div>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Gamification Stats Grid */}
                        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <GamifiedStatCard
                                icon={Flame}
                                label="Streak"
                                value={`${userStats?.streak || 0}`}
                                suffix="Days"
                                gradient="from-orange-500 to-red-500"
                                glow="shadow-orange-500/25"
                                progress={(userStats?.streak || 0) / 30}
                            />
                            <GamifiedStatCard
                                icon={Target}
                                label="Lessons"
                                value={`${userStats?.totalLessonsCompleted || 0}`}
                                gradient="from-cyan-500 to-blue-500"
                                glow="shadow-cyan-500/25"
                                progress={(userStats?.totalLessonsCompleted || 0) / 100}
                            />
                            <GamifiedStatCard
                                icon={Award}
                                label="Achievements"
                                value={`${earnedAchievements.length}`}
                                suffix={`/ ${ACHIEVEMENTS.length}`}
                                gradient="from-purple-500 to-pink-500"
                                glow="shadow-purple-500/25"
                                progress={earnedAchievements.length / ACHIEVEMENTS.length}
                            />
                            <GamifiedStatCard
                                icon={TrendingUp}
                                label="Roadmaps"
                                value={`${userStats?.completedRoadmaps || 0}`}
                                gradient="from-green-500 to-emerald-500"
                                glow="shadow-green-500/25"
                                progress={(userStats?.completedRoadmaps || 0) / 10}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Content Tabs */}
                <div className="mt-8">
                    <div className="flex items-center gap-2 bg-slate-900/50 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-800/50 w-fit mx-auto mb-8">
                        <TabButton
                            active={activeTab === 'posts'}
                            onClick={() => handleTabChange('posts')}
                            icon={Grid}
                            label="Posts"
                        />
                        {isOwnProfile && (
                            <TabButton
                                active={activeTab === 'saved'}
                                onClick={() => handleTabChange('saved')}
                                icon={Bookmark}
                                label="Saved"
                            />
                        )}
                        <TabButton
                            active={activeTab === 'achievements'}
                            onClick={() => handleTabChange('achievements')}
                            icon={Trophy}
                            label="Achievements"
                        />
                    </div>

                    {/* Tab Content */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'achievements' ? (
                            <motion.div
                                key="achievements"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <AchievementsSection achievements={earnedAchievements} userStats={userStats} />
                            </motion.div>
                        ) : loading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex justify-center py-20"
                            >
                                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                            </motion.div>
                        ) : posts.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="text-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800/50 backdrop-blur-sm"
                            >
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center mx-auto mb-4 border border-slate-700">
                                    {activeTab === 'posts' ? (
                                        <Grid className="w-10 h-10 text-slate-600" />
                                    ) : (
                                        <Bookmark className="w-10 h-10 text-slate-600" />
                                    )}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    {activeTab === 'posts' ? "No posts yet" : "No saved posts"}
                                </h3>
                                <p className="text-slate-400 max-w-sm mx-auto">
                                    {activeTab === 'posts'
                                        ? (isOwnProfile ? "Share your learning journey with your first post!" : "This user hasn't posted anything yet.")
                                        : "Posts you save will appear here."}
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="posts"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-6"
                            >
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
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

// Gamified Stat Card Component
function GamifiedStatCard({ icon: Icon, label, value, suffix, gradient, glow, progress }: {
    icon: any;
    label: string;
    value: string;
    suffix?: string;
    gradient: string;
    glow: string;
    progress: number;
}) {
    return (
        <motion.div
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className={cn("relative group cursor-default", `shadow-lg ${glow}`)}
        >
            <div className={cn("absolute inset-0 bg-gradient-to-br rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl", gradient)} />
            <div className="relative bg-slate-900/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50 overflow-hidden">
                {/* Progress indicator */}
                <motion.div
                    className={cn("absolute bottom-0 left-0 h-1 bg-gradient-to-r", gradient)}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progress * 100, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />

                <div className="flex items-center gap-4">
                    <div className={cn("p-3 rounded-xl bg-gradient-to-br", gradient)}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <div className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">{label}</div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-white">{value}</span>
                            {suffix && <span className="text-sm text-slate-500">{suffix}</span>}
                        </div>
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
        <motion.button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all relative",
                active
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <Icon className="w-4 h-4" />
            {label}
        </motion.button>
    );
}

// Achievements Section with real achievements from lib
function AchievementsSection({ achievements, userStats }: { achievements: string[]; userStats: any }) {
    // Get achievement icon mapping
    const getAchievementIcon = (type: string) => {
        switch (type) {
            case 'xp': return Star;
            case 'streak': return Flame;
            case 'lessons': return BookOpen;
            case 'roadmaps': return TrendingUp;
            case 'projects': return Code;
            default: return Award;
        }
    };

    // Get achievement color based on type
    const getAchievementColor = (type: string) => {
        switch (type) {
            case 'xp': return 'from-yellow-500 to-orange-500';
            case 'streak': return 'from-orange-500 to-red-500';
            case 'lessons': return 'from-blue-500 to-cyan-500';
            case 'roadmaps': return 'from-green-500 to-emerald-500';
            case 'projects': return 'from-purple-500 to-pink-500';
            default: return 'from-slate-500 to-slate-600';
        }
    };

    // Get progress towards achievement
    const getProgress = (achievement: typeof ACHIEVEMENTS[0]) => {
        if (!userStats) return 0;
        let current = 0;
        switch (achievement.type) {
            case 'xp': current = userStats.xp || 0; break;
            case 'streak': current = userStats.streak || 0; break;
            case 'lessons': current = userStats.totalLessonsCompleted || 0; break;
            case 'roadmaps': current = userStats.completedRoadmaps || 0; break;
            default: current = 0;
        }
        return Math.min(current / achievement.requirement, 1);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ACHIEVEMENTS.map((achievement, index) => {
                const isUnlocked = achievements.includes(achievement.id);
                const Icon = getAchievementIcon(achievement.type);
                const color = getAchievementColor(achievement.type);
                const progress = getProgress(achievement);

                return (
                    <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={isUnlocked ? { scale: 1.03, y: -5 } : { scale: 1.01 }}
                        className={cn(
                            "relative rounded-2xl p-6 border-2 transition-all overflow-hidden",
                            isUnlocked
                                ? "border-transparent shadow-lg"
                                : "bg-slate-900/50 border-slate-800 opacity-60"
                        )}
                    >
                        {/* Background gradient for unlocked */}
                        {isUnlocked && (
                            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90", color)} />
                        )}

                        {/* Progress bar for locked */}
                        {!isUnlocked && (
                            <motion.div
                                className={cn("absolute bottom-0 left-0 h-1 bg-gradient-to-r opacity-50", color)}
                                initial={{ width: 0 }}
                                animate={{ width: `${progress * 100}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                        )}

                        <div className="relative z-10">
                            {/* Unlocked badge */}
                            {isUnlocked && (
                                <motion.div
                                    className="absolute -top-1 -right-1"
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <div className="bg-yellow-400 rounded-full p-1.5 shadow-lg">
                                        <Star className="w-4 h-4 text-yellow-900 fill-yellow-900" />
                                    </div>
                                </motion.div>
                            )}

                            {/* Icon */}
                            <div className={cn(
                                "w-14 h-14 rounded-xl flex items-center justify-center mb-4",
                                isUnlocked ? "bg-white/20" : "bg-slate-800"
                            )}>
                                <span className="text-3xl">{achievement.icon}</span>
                            </div>

                            {/* Content */}
                            <h3 className={cn(
                                "font-bold text-lg mb-1",
                                isUnlocked ? "text-white" : "text-slate-400"
                            )}>
                                {achievement.title}
                            </h3>
                            <p className={cn(
                                "text-sm",
                                isUnlocked ? "text-white/80" : "text-slate-500"
                            )}>
                                {achievement.description}
                            </p>

                            {/* Progress text for locked */}
                            {!isUnlocked && (
                                <div className="mt-3 text-xs text-slate-500">
                                    {Math.round(progress * 100)}% complete
                                </div>
                            )}
                        </div>

                        {/* Lock overlay for locked achievements */}
                        {!isUnlocked && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-6xl opacity-5">🔒</div>
                            </div>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
}