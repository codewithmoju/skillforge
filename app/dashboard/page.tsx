"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Target, Flame, Award, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/hooks/useAuth";
import { getUserData } from "@/lib/services/firestore";
import { getUserPosts } from "@/lib/services/posts";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [userData, setUserData] = useState<any>(null);
    const [recentPosts, setRecentPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadDashboard();
        }
    }, [user]);

    const loadDashboard = async () => {
        if (!user) return;

        try {
            const [data, posts] = await Promise.all([
                getUserData(user.uid),
                getUserPosts(user.uid, 5)
            ]);

            setUserData(data);
            setRecentPosts(posts);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        {
            label: "XP",
            value: userData?.xp || 0,
            icon: TrendingUp,
            color: "from-blue-500 to-cyan-500",
            bgColor: "bg-blue-500/10",
        },
        {
            label: "Level",
            value: userData?.level || 1,
            icon: Target,
            color: "from-purple-500 to-pink-500",
            bgColor: "bg-purple-500/10",
        },
        {
            label: "Streak",
            value: `${userData?.streak || 0} days`,
            icon: Flame,
            color: "from-orange-500 to-red-500",
            bgColor: "bg-orange-500/10",
        },
        {
            label: "Achievements",
            value: userData?.achievements?.length || 0,
            icon: Award,
            color: "from-yellow-500 to-orange-500",
            bgColor: "bg-yellow-500/10",
        },
    ];

    const quickActions = [
        { label: "Start Roadmap", href: "/roadmap", icon: Target },
        { label: "Create Post", href: "/social", icon: Plus },
        { label: "View Profile", href: userData?.username ? `/profile/${userData.username}` : "/profile", icon: Award },
    ];

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="mb-6 md:mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Welcome back, {userData?.name || 'Learner'}! 👋
                </h1>
                <p className="text-slate-400">Here's your learning progress</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-slate-900/50 border border-slate-800 rounded-xl md:rounded-2xl p-4 md:p-6"
                    >
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${stat.bgColor} flex items-center justify-center mb-3 md:mb-4`}>
                            <stat.icon className={`w-5 h-5 md:w-6 md:h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent' }} />
                        </div>
                        <p className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</p>
                        <p className="text-xs md:text-sm text-slate-400">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                    {quickActions.map((action, index) => (
                        <motion.div
                            key={action.label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                        >
                            <Link href={action.href}>
                                <div className="bg-slate-900/50 border border-slate-800 rounded-xl md:rounded-2xl p-4 md:p-6 hover:border-accent-indigo transition-all group cursor-pointer">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 md:gap-4">
                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-accent-indigo/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <action.icon className="w-5 h-5 md:w-6 md:h-6 text-accent-cyan" />
                                            </div>
                                            <span className="font-semibold text-white text-sm md:text-base">{action.label}</span>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-accent-cyan transition-colors" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl md:text-2xl font-bold text-white">Recent Activity</h2>
                    <Link href="/social">
                        <Button variant="outline" size="sm">View All</Button>
                    </Link>
                </div>

                {recentPosts.length > 0 ? (
                    <div className="space-y-3 md:space-y-4">
                        {recentPosts.map((post) => (
                            <div
                                key={post.id}
                                className="bg-slate-900/50 border border-slate-800 rounded-xl md:rounded-2xl p-4 md:p-6"
                            >
                                <p className="text-slate-300 text-sm md:text-base">{post.content.text}</p>
                                <div className="flex items-center gap-4 mt-3 text-xs md:text-sm text-slate-500">
                                    <span>{post.likes} likes</span>
                                    <span>{post.comments} comments</span>
                                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl md:rounded-2xl p-8 md:p-12 text-center">
                        <p className="text-slate-400 mb-4">No recent activity</p>
                        <Button onClick={() => router.push('/social')}>
                            Create Your First Post
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
