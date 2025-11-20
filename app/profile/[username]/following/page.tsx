"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FollowButton } from "@/components/social/FollowButton";
import { getUserByUsername } from "@/lib/services/firestore";
import { getFollowing } from "@/lib/services/follow";
import { getUserData } from "@/lib/services/firestore";
import Link from "next/link";

export default function FollowingPage() {
    const params = useParams();
    const router = useRouter();
    const username = params.username as string;

    const [following, setFollowing] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFollowing();
    }, [username]);

    const loadFollowing = async () => {
        try {
            const user = await getUserByUsername(username);
            if (!user) return;

            const followingIds = await getFollowing(user.uid);

            // Get full user data for each following
            const followingData = await Promise.all(
                followingIds.map(id => getUserData(id))
            );

            setFollowing(followingData.filter(Boolean));
        } catch (error) {
            console.error('Error loading following:', error);
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
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Following</h1>
                    <p className="text-slate-400">@{username}</p>
                </div>

                {/* Following List */}
                {loading ? (
                    <div className="flex items-center justify-center py-12 md:py-20">
                        <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
                    </div>
                ) : following.length > 0 ? (
                    <div className="space-y-3 md:space-y-4">
                        {following.map((user) => (
                            <motion.div
                                key={user.uid}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-slate-900/50 border border-slate-800 rounded-xl md:rounded-2xl p-4 md:p-6"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <Link href={`/profile/${user.username}`} className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                                        {user.profilePicture ? (
                                            <img
                                                src={user.profilePicture}
                                                alt={user.name}
                                                className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center shrink-0">
                                                <span className="text-white font-semibold text-lg md:text-xl">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-white truncate text-sm md:text-base">{user.name}</p>
                                            <p className="text-xs md:text-sm text-slate-400 truncate">@{user.username}</p>
                                            {user.bio && (
                                                <p className="text-xs md:text-sm text-slate-500 mt-1 truncate">{user.bio}</p>
                                            )}
                                        </div>
                                    </Link>
                                    <FollowButton targetUserId={user.uid} isPrivate={user.isPrivate} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 md:py-20">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 md:w-10 md:h-10 text-slate-600" />
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Not following anyone</h3>
                        <p className="text-sm md:text-base text-slate-400">This user isn't following anyone yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
