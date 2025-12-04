"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
    TrendingUp,
    Target,
    Flame,
    Award,
    Plus,
    Sparkles,
    Shield,
    Zap,
    Users,
    Activity,
    Clock,
    Trophy as TrophyIcon
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/hooks/useAuth";
import { getUserData, type FirestoreUserData } from "@/lib/services/firestore";
import { getUserPosts, type Post } from "@/lib/services/posts";
import { getChallenges, type Challenge, getChallengeProgress, getTimeRemaining } from "@/lib/services/challenges";
import { getTopLeaderboard, getUserRank, type LeaderboardEntry } from "@/lib/services/leaderboard";
import { ACHIEVEMENT_DEFINITIONS } from "@/lib/utils/achievementSystem";
import type { Achievement } from "@/lib/types/gamification";
import { getLevelTier, getXPForLevel } from "@/lib/utils/levelSystem";
import { formatRelativeTime, truncate } from "@/lib/utils";
import { getUnlockedStars } from "@/lib/utils/achievementSystem";

// New Components
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { StatsOverview, type QuickAction } from "@/components/dashboard/StatsOverview";
import { LeaderboardWidget } from "@/components/dashboard/LeaderboardWidget";
import { ActiveQuests } from "@/components/dashboard/ActiveQuests";

const STREAK_MILESTONES = [3, 7, 14, 30, 60, 90, 180, 365];

export default function DashboardPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [userData, setUserData] = useState<FirestoreUserData | null>(null);
    const [recentPosts, setRecentPosts] = useState<Post[]>([]);
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [userRank, setUserRank] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Trigger data migration from localStorage to Firestore
    useEffect(() => {
        if (user) {
            import('@/lib/services/migration').then(({ migrateLocalStorageToFirestore }) => {
                migrateLocalStorageToFirestore(user.uid);
            });
        }
    }, [user]);

    const fetchDashboard = useCallback(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        // 1. Critical Data (User Profile) - Blocks initial render
        setLoading(true);
        getUserData(user.uid)
            .then((data) => {
                if (data) setUserData(data);
                setLoading(false); // Unblock UI as soon as user data is ready
            })
            .catch((err) => {
                console.error("Failed to fetch user data:", err);
                setError("Failed to load profile.");
                setLoading(false);
            });

        // 2. Secondary Data - Loads in parallel, updates independently
        getUserPosts(user.uid, 5)
            .then(setRecentPosts)
            .catch(err => console.error("Failed to fetch posts:", err));

        getChallenges("active")
            .then(setChallenges)
            .catch(err => console.error("Failed to fetch challenges:", err));

        getTopLeaderboard(5)
            .then(setLeaderboard)
            .catch(err => console.error("Failed to fetch leaderboard:", err));

        getUserRank(user.uid)
            .then(rank => setUserRank(rank > 0 ? rank : null))
            .catch(err => console.error("Failed to fetch rank:", err));

    }, [user]);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    const xp = userData?.xp ?? 0;
    const level = userData?.level ?? 1;
    const streak = userData ? Math.max(1, userData.streak || 0) : 0;
    const lessonsCompleted = userData?.totalLessonsCompleted ?? 0;
    const completedRoadmaps = userData?.completedRoadmaps ?? 0;
    const postsCount = userData?.postsCount ?? recentPosts.length;
    const followers = userData?.followers ?? 0;
    const following = userData?.following ?? 0;
    const tier = getLevelTier(level);
    const xpForCurrentLevel = getXPForLevel(level);
    const xpForNextLevel = getXPForLevel(level + 1);
    const xpSpan = Math.max(1, xpForNextLevel - xpForCurrentLevel);
    const xpProgress = Math.min(100, Math.round(((xp - xpForCurrentLevel) / xpSpan) * 100));
    const xpToNextLevel = Math.max(0, xpForNextLevel - xp);
    const nextStreakMilestone = STREAK_MILESTONES.find((milestone) => milestone > streak);
    const displayName = userData?.name || user?.displayName || "Learner";
    const lastActiveLabel = formatRelativeTime(userData?.lastActive);
    const roadmapDefinitions = (userData?.roadmapDefinitions as any[]) || [];
    const roadmapProgress = userData?.roadmapProgress || {};

    const roadmapNodes = roadmapDefinitions.map((node: any) => {
        const progress = roadmapProgress?.[node.id] || {};
        return {
            ...node,
            status: progress.status || "locked",
            completedLessons: progress.completedLessons || 0,
            totalLessons: node.lessons || progress.totalLessons || 0,
        };
    });

    const currentRoadmapNode = roadmapNodes.find((node) => node.status === "active");
    const completedNodes = roadmapNodes.filter((node) => node.status === "completed").length;
    const roadmapCompletionPercent = roadmapNodes.length
        ? Math.round((completedNodes / roadmapNodes.length) * 100)
        : 0;

    const projectSpotlight = Array.isArray(userData?.projects)
        ? userData?.projects.find((project: any) => project.status !== "Completed")
        : undefined;

    const normalizedAchievements = useMemo<Achievement[]>(() => {
        if (!userData?.achievements) return [];
        return (userData.achievements as any[])
            .map((achievement) => {
                if (achievement && typeof achievement === "object" && "stars" in achievement) {
                    return achievement as Achievement;
                }
                if (typeof achievement === "string") {
                    const definition = ACHIEVEMENT_DEFINITIONS.find((def) => def.id === achievement);
                    if (!definition) return null;
                    return {
                        ...definition,
                        currentProgress: 0,
                        totalXpEarned: 0,
                    };
                }
                return null;
            })
            .filter(Boolean) as Achievement[];
    }, [userData?.achievements]);

    const featuredAchievements = useMemo(() => {
        const unlocked = normalizedAchievements.filter((achievement) => getUnlockedStars(achievement) > 0);
        if (unlocked.length) {
            return [...unlocked].sort((a, b) => getUnlockedStars(b) - getUnlockedStars(a)).slice(0, 4);
        }
        return normalizedAchievements.slice(0, 4);
    }, [normalizedAchievements]);

    const statCards = useMemo(
        () => [
            {
                label: "Total XP",
                value: xp.toLocaleString(),
                meta: `${xpProgress}% to LV ${level + 1}`,
                icon: TrendingUp,
                gradient: "from-[#211b46]/90 via-[#4338ca]/80 to-[#06b6d4]/80",
                glow: "shadow-[0_20px_55px_rgba(67,56,202,0.45)]",
            },
            {
                label: "Roadmaps Completed",
                value: completedRoadmaps,
                meta: roadmapCompletionPercent ? `${roadmapCompletionPercent}% of current map` : "Ready for a new map",
                icon: Target,
                gradient: "from-[#3b0764]/90 via-[#9333ea]/80 to-[#ec4899]/75",
                glow: "shadow-[0_20px_55px_rgba(236,72,153,0.35)]",
            },
            {
                label: "Daily Streak",
                value: `${streak} days`,
                meta: nextStreakMilestone
                    ? `${nextStreakMilestone - streak} days to ${nextStreakMilestone}d badge`
                    : "🔥 Max milestone locked",
                icon: Flame,
                gradient: "from-[#451a03]/90 via-[#ea580c]/80 to-[#f97316]/75",
                glow: "shadow-[0_20px_55px_rgba(249,115,22,0.35)]",
            },
            {
                label: "Badge Vault",
                value: normalizedAchievements.length,
                meta: `${featuredAchievements.filter((a) => getUnlockedStars(a) > 0).length} glowing`,
                icon: Award,
                gradient: "from-[#052e16]/90 via-[#15803d]/80 to-[#34d399]/75",
                glow: "shadow-[0_20px_55px_rgba(52,211,153,0.35)]",
            },
        ],
        [
            xp,
            xpProgress,
            level,
            completedRoadmaps,
            roadmapCompletionPercent,
            streak,
            nextStreakMilestone,
            normalizedAchievements.length,
            featuredAchievements,
        ]
    );

    const quickActions = useMemo(() => {
        const actions: QuickAction[] = [];

        if (currentRoadmapNode || userData?.currentTopic) {
            actions.push({
                label: currentRoadmapNode?.title
                    ? `Resume ${truncate(currentRoadmapNode.title)}`
                    : `Resume ${truncate(userData?.currentTopic || "roadmap")}`,
                href: "/roadmap",
                icon: Target,
                meta: currentRoadmapNode
                    ? `${Math.round(
                        Math.min(
                            100,
                            (currentRoadmapNode.completedLessons / Math.max(1, currentRoadmapNode.totalLessons)) * 100
                        )
                    )}% node`
                    : "Jump back in",
            });
        }

        if (projectSpotlight) {
            actions.push({
                label: `Boost ${truncate(projectSpotlight.title || "Project")}`,
                href: projectSpotlight.id ? `/project/${projectSpotlight.id}` : "/projects/new",
                icon: Activity,
                meta: `${Math.round(projectSpotlight.progress || 0)}% built`,
            });
        } else {
            actions.push({
                label: "Launch Project",
                href: "/projects/new",
                icon: Plus,
                meta: "No active builds",
            });
        }

        actions.push({
            label: "Share Signal",
            href: "/social",
            icon: Sparkles,
            meta: `${postsCount} posts live`,
        });

        actions.push({
            label: "Community Groups",
            href: "/groups",
            icon: Users,
            meta: "Join or create",
        });

        return actions;
    }, [currentRoadmapNode, projectSpotlight, userData?.currentTopic, postsCount]);

    const questCards = useMemo(() => {
        const cards: Array<{
            title: string;
            subtitle: string;
            progress: number;
            detail: string;
            href: string;
        }> = [];

        if (currentRoadmapNode) {
            const progress = Math.round(
                Math.min(100, (currentRoadmapNode.completedLessons / Math.max(1, currentRoadmapNode.totalLessons)) * 100)
            );
            cards.push({
                title: currentRoadmapNode.title || "Current Checkpoint",
                subtitle: `${currentRoadmapNode.completedLessons}/${currentRoadmapNode.totalLessons || 0} lessons cleared`,
                progress,
                detail: userData?.currentTopic ? `${userData.currentTopic} roadmap` : "Live roadmap",
                href: "/roadmap",
            });
        } else if (userData?.currentTopic) {
            cards.push({
                title: userData.currentTopic,
                subtitle: "No active checkpoint yet",
                progress: 0,
                detail: "Generate your first node",
                href: "/roadmap",
            });
        }

        if (projectSpotlight) {
            cards.push({
                title: projectSpotlight.title || "Project Sprint",
                subtitle: projectSpotlight.description || "In-progress build",
                progress: Math.round(projectSpotlight.progress || 0),
                detail: projectSpotlight.status || "In Progress",
                href: projectSpotlight.id ? `/project/${projectSpotlight.id}` : "/projects/new",
            });
        }

        return cards;
    }, [currentRoadmapNode, userData?.currentTopic, projectSpotlight]);

    const powerUps = useMemo(() => {
        const items: Array<{
            title: string;
            value: string;
            description: string;
            icon: typeof Shield;
        }> = [];

        if (streak > 0) {
            items.push({
                title: "Streak Shield",
                value: `${streak} day flame`,
                description: nextStreakMilestone
                    ? `${nextStreakMilestone - streak} days to ignite the ${nextStreakMilestone}d core`
                    : "You hold the max streak milestone",
                icon: Shield,
            });
        }

        if (lessonsCompleted > 0 || roadmapCompletionPercent > 0) {
            items.push({
                title: "Momentum Core",
                value: `${lessonsCompleted} lessons`,
                description: roadmapCompletionPercent
                    ? `${roadmapCompletionPercent}% of current roadmap cleared`
                    : "Generate a roadmap to begin tracking momentum",
                icon: Zap,
            });
        }

        if (followers || following || postsCount) {
            items.push({
                title: "Community Signal",
                value: `${followers.toLocaleString()} followers`,
                description: `${postsCount} posts • following ${following.toLocaleString()}`,
                icon: Users,
            });
        }

        return items;
    }, [streak, nextStreakMilestone, lessonsCompleted, roadmapCompletionPercent, followers, following, postsCount]);

    const challengeHighlights = useMemo(() => {
        if (!challenges.length) return [];
        const participantChallenges = user?.uid
            ? challenges.filter((challenge) => challenge.participants?.includes(user.uid))
            : [];
        const pool = participantChallenges.length ? participantChallenges : challenges;
        return pool.slice(0, 3);
    }, [challenges, user?.uid]);

    const rival = leaderboard.find((entry) => entry.xp > xp);
    const xpGap = rival ? rival.xp - xp : 0;

    if (loading) {
        return <DashboardSkeleton />;
    }

    if (!userData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center space-y-4">
                <h1 className="text-3xl font-bold text-white">No profile data yet</h1>
                <p className="text-slate-400 max-w-md">
                    Generate your first roadmap or complete onboarding so we can build your personalized dashboard.
                </p>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen pb-16">
            <div className="absolute inset-0 opacity-60 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,45,105,0.65),_transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(14,165,233,0.2),_transparent_55%)] blur-3xl" />
                <div className="absolute inset-y-0 inset-x-10 border border-white/5 rounded-[3rem] opacity-30" />
            </div>

            <div className="relative space-y-10">
                {error && (
                    <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 flex flex-wrap items-center justify-between gap-4 text-sm text-rose-100">
                        <span>{error}</span>
                        <Button variant="outline" size="sm" onClick={fetchDashboard}>
                            Retry
                        </Button>
                    </div>
                )}

                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="grid gap-6 lg:grid-cols-[1.7fr,1fr]"
                >
                    <StatsOverview
                        userData={userData}
                        tier={tier}
                        level={level}
                        xp={xp}
                        xpToNextLevel={xpToNextLevel}
                        xpProgress={xpProgress}
                        xpForNextLevel={xpForNextLevel}
                        quickActions={quickActions}
                        displayName={displayName}
                        lastActiveLabel={lastActiveLabel}
                    />

                    <LeaderboardWidget
                        leaderboard={leaderboard}
                        userRank={userRank}
                        rival={rival}
                        xpGap={xpGap}
                    />
                </motion.section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative overflow-hidden rounded-2xl border border-white/15 p-5 bg-gradient-to-br ${stat.gradient} ${stat.glow ?? ""}`}
                        >
                            <div className="relative flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-white/70">{stat.label}</p>
                                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                                    <p className="text-xs text-white/60 mt-1">{stat.meta}</p>
                                </div>
                                <div className="rounded-xl bg-black/20 p-3">
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </section>

                <ActiveQuests
                    questCards={questCards}
                    powerUps={powerUps}
                />

                <section className="grid gap-6 xl:grid-cols-[1.4fr,0.8fr]">
                    <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
                        <div className="mb-4 flex items-center justify-between gap-4 flex-wrap">
                            <div>
                                <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Live Challenges</p>
                                <h2 className="text-2xl font-bold text-white">Community Operations</h2>
                            </div>
                            <Link href="/challenges">
                                <Button variant="outline" size="sm">Browse All</Button>
                            </Link>
                        </div>

                        {challengeHighlights.length ? (
                            <div className="space-y-4">
                                {challengeHighlights.map((challenge) => {
                                    const progress = getChallengeProgress(challenge);
                                    return (
                                        <motion.div
                                            key={challenge.id}
                                            whileHover={{ scale: 1.01 }}
                                            className="rounded-2xl border border-white/10 bg-white/5 p-5"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
                                                        {challenge.status}
                                                    </p>
                                                    <p className="text-xl font-semibold text-white">{challenge.title}</p>
                                                    <p className="text-sm text-slate-400">{challenge.description}</p>
                                                </div>
                                                <div className="text-right text-xs text-slate-400">
                                                    <p>{challenge.participantsCount} players</p>
                                                    <p>{challenge.xpReward.toLocaleString()} XP reward</p>
                                                    <p className="flex items-center gap-1 justify-end">
                                                        <Clock className="h-3 w-3" />
                                                        {getTimeRemaining(challenge.endDate)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-4 h-2 rounded-full bg-white/5">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-slate-400">
                                No live challenges found. Check back soon!
                            </div>
                        )}
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Badge Vault</p>
                                <h2 className="text-2xl font-bold text-white">Featured Achievements</h2>
                            </div>
                            <Link href="/achievements" className="text-sm text-cyan-300 hover:text-white">
                                View All
                            </Link>
                        </div>

                        {featuredAchievements.length ? (
                            <div className="space-y-4">
                                {featuredAchievements.map((achievement) => (
                                    <motion.div
                                        key={achievement.id}
                                        whileHover={{ rotate: -1, scale: 1.02 }}
                                        className="rounded-2xl border border-white/10 bg-gradient-to-br from-amber-500/10 via-white/5 to-transparent p-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-full bg-white/10 p-2">
                                                <TrophyIcon className="h-4 w-4 text-amber-300" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">{achievement.name}</p>
                                                <p className="text-xs text-slate-400">{achievement.description}</p>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex items-center gap-1">
                                            {achievement.stars.map((star, index) => (
                                                <span
                                                    key={`${achievement.id}-star-${star.star}-${index}`}
                                                    className={`h-2 w-2 rounded-full ${star.unlocked ? "bg-amber-300" : "bg-white/20"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
                                <p className="text-slate-400">Unlock achievements by completing roadmaps, streaks, and challenges.</p>
                            </div>
                        )}
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Signal Feed</p>
                                <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
                            </div>
                            <Link href="/social">
                                <Button variant="outline" size="sm">View All</Button>
                            </Link>
                        </div>

                        {recentPosts.length ? (
                            <div className="space-y-4">
                                {recentPosts.map((post) => (
                                    <motion.div
                                        key={post.id}
                                        whileHover={{ scale: 1.01 }}
                                        className="rounded-2xl border border-white/10 bg-white/5 p-4"
                                    >
                                        <p className="text-sm text-slate-100">{post.content.text}</p>
                                        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <Sparkles className="h-3 w-3 text-cyan-300" />
                                                {post.likes} reacts
                                            </span>
                                            <span>{post.comments} replies</span>
                                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
                                <p className="text-slate-400 mb-4">No recent drops in your feed.</p>
                                <Button onClick={() => router.push("/social")}>Create Your First Post</Button>
                            </div>
                        )}
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Learning Ledger</p>
                                <h2 className="text-2xl font-bold text-white">Progress Snapshot</h2>
                            </div>
                            <Button variant="outline" size="sm" onClick={fetchDashboard}>
                                Refresh Data
                            </Button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Lessons Completed</p>
                                <p className="text-3xl font-bold text-white">{lessonsCompleted}</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Active Projects</p>
                                <p className="text-3xl font-bold text-white">{userData?.projects?.length || 0}</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Total Roadmaps</p>
                                <p className="text-3xl font-bold text-white">{completedRoadmaps}</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Following</p>
                                <p className="text-3xl font-bold text-white">{following}</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}