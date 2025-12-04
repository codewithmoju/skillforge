"use client";

import type { ComponentType } from "react";
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
    Star,
    Zap,
    Crown,
    Users,
    Activity,
    Clock
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/hooks/useAuth";
import { getUserData, type FirestoreUserData } from "@/lib/services/firestore";
import { getUserPosts, type Post } from "@/lib/services/posts";
import { getChallenges, type Challenge } from "@/lib/services/challenges";
import { getTopLeaderboard, getUserRank, type LeaderboardEntry } from "@/lib/services/leaderboard";
import { ACHIEVEMENT_DEFINITIONS } from "@/lib/utils/achievementSystem";
import type { Achievement } from "@/lib/types/gamification";
import { getLevelTier, getXPForLevel } from "@/lib/utils/levelSystem";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

const STREAK_MILESTONES = [3, 7, 14, 30, 60, 90, 180, 365];

type QuickAction = {
    label: string;
    href: string;
    icon: ComponentType<{ className?: string }>;
    meta?: string;
};

function DashboardContent() {
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

    const fetchDashboard = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const [data, posts, liveChallenges, topLeaders, rank] = await Promise.all([
                getUserData(user.uid),
                getUserPosts(user.uid, 5),
                getChallenges("active"),
                getTopLeaderboard(5),
                getUserRank(user.uid),
            ]);

            setUserData(data);
            setRecentPosts(posts);
            setChallenges(liveChallenges);
            setLeaderboard(topLeaders);
            setUserRank(rank > 0 ? rank : null);
        } catch (err) {
            console.error("Error loading dashboard:", err);
            setError("We couldn't sync your dashboard. Please try again.");
        } finally {
            setLoading(false);
        }
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
            icon: ComponentType<{ className?: string }>;
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

    const leaderboardGlows = ["from-amber-400/30 via-amber-600/10 to-slate-900/40", "from-slate-200/20 via-violet-400/10 to-slate-900/40", "from-cyan-300/20 via-blue-500/10 to-slate-900/40"];

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
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-6 text-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
                    className="h-16 w-16 rounded-full border-4 border-cyan-400/30 border-t-cyan-300"
                />
                <div>
                    <p className="text-lg font-semibold text-white">Syncing your command center</p>
                    <p className="text-slate-400 text-sm">Pulling live data from Firestore…</p>
                </div>
            </div>
        );
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
                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-indigo-950 to-black p-6 md:p-10">
                        <div className="absolute inset-px rounded-[calc(1.5rem-1px)] border border-white/5 pointer-events-none" />
                        <div className="absolute -top-20 -right-10 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
                        <div className="absolute -bottom-24 -left-8 h-52 w-52 rounded-full bg-violet-500/20 blur-3xl" />

                        <div className="relative flex flex-wrap items-center gap-3 text-sm uppercase tracking-widest text-cyan-200/80">
                            <Sparkles className="h-4 w-4 text-cyan-300" />
                            Mission Control
                        </div>

                        <div className="relative mt-4 flex flex-col gap-6 lg:flex-row lg:items-center">
                            <div>
                                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-widest text-slate-300">
                                    {tier.title}
                                    <Crown className="h-3.5 w-3.5 text-amber-300" />
                                </span>
                                <h1 className="mt-3 text-3xl md:text-5xl font-black text-white tracking-tight">
                                    Welcome back{displayName ? `, ${displayName}` : ""}!
                                </h1>
                                <p className="mt-2 text-base md:text-lg text-slate-300/90">
                                    Last synced {lastActiveLabel}. Your stats, streaks, and challenges are up to date.
                                </p>
                            </div>

                            <div className="relative min-w-[220px] rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur">
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Next Tier Target</p>
                                <p className="mt-1 text-2xl font-bold text-white">LV {level + 1}</p>
                                <p className="text-xs text-slate-400">{xpToNextLevel.toLocaleString()} XP needed</p>
                            </div>
                        </div>

                        <div className="relative mt-8 space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-300">XP Surge</span>
                                <span className="font-semibold text-white">{xpProgress}%</span>
                            </div>
                            <div className="h-3 rounded-full bg-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${xpProgress}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                                />
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-400">
                                <span>{xp.toLocaleString()} XP</span>
                                <span>{xpForNextLevel.toLocaleString()} XP Target</span>
                            </div>
                        </div>

                        <div className="relative mt-8 flex flex-wrap gap-3">
                            {quickActions.map((action) => (
                                <Link key={action.label} href={action.href}>
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        className="group inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/90 hover:border-cyan-400/40 hover:text-white"
                                    >
                                        <action.icon className="h-4 w-4 text-cyan-300 group-hover:text-white" />
                                        <div className="text-left">
                                            <p>{action.label}</p>
                                            {action.meta && <p className="text-xs text-slate-400">{action.meta}</p>}
                                        </div>
                                    </motion.button>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 p-6">
                        <div className="absolute inset-x-6 top-6 flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-slate-400">
                            <Star className="h-4 w-4 text-amber-300" />
                            Season Pulse
                        </div>
                        <div className="relative mt-12 space-y-6">
                            <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-amber-500/15 via-white/5 to-transparent p-5 shadow-[0_10px_40px_rgba(15,118,255,0.25)]">
                                <div className="absolute -top-10 -right-6 h-24 w-24 rounded-full bg-amber-400/20 blur-3xl" />
                                <p className="text-xs uppercase tracking-[0.5em] text-amber-200">Your Rank</p>
                                <p className="text-4xl font-extrabold text-white mt-1 flex items-baseline gap-2">
                                    {userRank ? `#${userRank}` : "Unranked"}
                                    <span className="text-xs font-semibold text-white/60">Season {new Date().getFullYear()}</span>
                                </p>
                                <p className="text-xs text-white/70 mt-2">
                                    {rival && xpGap > 0
                                        ? `${xpGap.toLocaleString()} XP to catch ${rival.name}`
                                        : "You hold the top slot in this slice"}
                                </p>
                            </div>

                            <div className="space-y-4">
                                {leaderboard.slice(0, 3).map((entry, index) => (
                                    <motion.div
                                        key={entry.uid}
                                        whileHover={{ scale: 1.01 }}
                                        className="relative overflow-hidden rounded-2xl border border-white/15 p-4"
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-br ${leaderboardGlows[index] ?? "from-white/10 to-transparent"}`} />
                                        <div className="relative flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/30 font-black text-white text-lg">
                                                    #{index + 1}
                                                </div>
                                                <div>
                                                    <p className="text-white font-semibold">{entry.name}</p>
                                                    <p className="text-xs text-white/70">
                                                        {entry.xp.toLocaleString()} XP • Lv {entry.level}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs uppercase tracking-[0.4em] text-white/50">Streak</p>
                                                <p className="text-sm font-semibold text-emerald-200">{entry.streak}d 🔥</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {!leaderboard.length && (
                                    <p className="text-sm text-slate-400 text-center">Leaderboard data will appear once the season updates.</p>
                                )}
                            </div>
                        </div>
                    </div>
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

                <section className="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
                    <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                            <div>
                                <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Quest Board</p>
                                <h2 className="text-2xl font-bold text-white">Personal Missions</h2>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => router.push("/roadmap")}>
                                Manage Roadmaps
                            </Button>
                        </div>

                        {questCards.length ? (
                            <div className="mt-6 space-y-4">
                                {questCards.map((quest) => (
                                    <motion.div
                                        key={quest.title}
                                        whileHover={{ scale: 1.01 }}
                                        className="rounded-2xl border border-white/10 bg-white/5 p-5"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">{quest.detail}</p>
                                                <p className="text-xl font-semibold text-white">{quest.title}</p>
                                                <p className="text-sm text-slate-400">{quest.subtitle}</p>
                                            </div>
                                            <Link href={quest.href} className="text-xs font-semibold text-cyan-300">
                                                View
                                            </Link>
                                        </div>
                                        <div className="mt-4 h-2 rounded-full bg-white/5">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500"
                                                style={{ width: `${quest.progress}%` }}
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-8 text-center">
                                <p className="text-slate-400">No active missions yet. Generate a roadmap or create a project to unlock quests.</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        {powerUps.length ? (
                            powerUps.map((power) => (
                                <motion.div
                                    key={power.title}
                                    whileHover={{ x: 6 }}
                                    className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 p-5"
                                >
                                    <div className="relative flex items-start gap-4">
                                        <div className="rounded-2xl bg-black/30 p-3">
                                            <power.icon className="h-6 w-6 text-cyan-200" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-white">{power.title}</p>
                                            <p className="text-sm text-slate-300">{power.value}</p>
                                            <p className="text-xs text-slate-500">{power.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="rounded-3xl border border-dashed border-white/10 p-8 text-center text-slate-400">
                                Activate a streak, roadmap, or project to unlock power-ups.
                            </div>
                        )}
                    </div>
                </section>

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
                                                <TrophyIcon />
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
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Projects Built</p>
                                <p className="text-3xl font-bold text-white">{userData?.projects?.length || 0}</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();

    if (authLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-6 text-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
                    className="h-16 w-16 rounded-full border-4 border-cyan-400/30 border-t-cyan-300"
                />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center space-y-4">
                <h1 className="text-3xl font-bold text-white">Sign in to access your dashboard</h1>
                <p className="text-slate-400 max-w-md">
                    Connect your account to restore your gamified control center, track missions, and sync rewards.
                </p>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <DashboardContent />
        </ErrorBoundary>
    );
}

function TrophyIcon() {
    return (
        <svg
            className="h-5 w-5 text-amber-300"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M9 6h14v6a7 7 0 0 1-7 7 7 7 0 0 1-7-7V6Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M9 8H5a4 4 0 0 0 4 4m14-4h4a4 4 0 0 1-4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M12 27h8m-4-8v4m-4 4v3m8-3v3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function getUnlockedStars(achievement: Achievement) {
    return achievement.stars.filter((star) => star.unlocked).length;
}

function formatRelativeTime(dateString?: string) {
    if (!dateString) return "moments ago";
    const date = new Date(dateString);
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 60) return `${Math.max(1, minutes)}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

function getChallengeProgress(challenge: Challenge) {
    const start = new Date(challenge.startDate).getTime();
    const end = new Date(challenge.endDate).getTime();
    const now = Date.now();
    if (end <= start) return 0;
    return Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100)));
}

function getTimeRemaining(endDate: string) {
    const diff = new Date(endDate).getTime() - Date.now();
    if (diff <= 0) return "Ended";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h left`;
    const days = Math.ceil(hours / 24);
    return `${days}d left`;
}

function truncate(value: string, max = 26) {
    if (!value) return "";
    return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}