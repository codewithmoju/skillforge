"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FollowButton } from "@/components/social/FollowButton";
import { getUserByUsername } from "@/lib/services/firestore";
import { getFollowers } from "@/lib/services/follow";
import { getUserData } from "@/lib/services/firestore";
import Link from "next/link";

export default function FollowersPage() {
    const params = useParams();
    const router = useRouter();
    const username = params.username as string;

    const [followers, setFollowers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFollowers();
    }, [username]);

    const loadFollowers = async () => {
        try {
            const user = await getUserByUsername(username);
            if (!user) return;

            const followerIds = await getFollowers(user.uid);

            // Get full user data for each follower
            const followerData = await Promise.all(
                followerIds.map(id => getUserData(id))
            );

            setFollowers(followerData.filter(Boolean));
        } catch (error) {
            console.error('Error loading followers:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm md:text-base">Back</span>
                    </button>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Followers</h1>
                    <p className="text-slate-400">@{username}</p>
                </div>

                {/* Followers List */}
                {loading ? (
                    <div className="flex items-center justify-center py-12 md:py-20">
                        <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
                    </div>
                ) : followers.length > 0 ? (
                    <div className="space-y-3 md:space-y-4">
                        {followers.map((follower) => (
                            <motion.div
                                key={follower.uid}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-slate-900/50 border border-slate-800 rounded-xl md:rounded-2xl p-4 md:p-6"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <Link href={`/profile/${follower.username}`} className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                                        {follower.profilePicture ? (
                                            <img
                                                src={follower.profilePicture}
                                                alt={follower.name}
                                                className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center shrink-0">
                                                <span className="text-white font-semibold text-lg md:text-xl">
                                                    {follower.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-white truncate text-sm md:text-base">{follower.name}</p>
                                            <p className="text-xs md:text-sm text-slate-400 truncate">@{follower.username}</p>
                                            {follower.bio && (
                                                <p className="text-xs md:text-sm text-slate-500 mt-1 truncate">{follower.bio}</p>
                                            )}
                                        </div>
                                    </Link>
                                    <FollowButton targetUserId={follower.uid} isPrivate={follower.isPrivate} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 md:py-20">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 md:w-10 md:h-10 text-slate-600" />
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold text-white mb-2">No followers yet</h3>
                        <p className="text-sm md:text-base text-slate-400">This user doesn't have any followers</p>
                    </div>
                )}
            </div>
        </div>
    );
}
