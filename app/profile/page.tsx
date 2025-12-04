"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { getUserData, FirestoreUserData } from "@/lib/services/firestore";
import { getUserPosts, Post } from "@/lib/services/posts";
import { Loader2, MapPin, Link as LinkIcon, Calendar, Edit, Trophy, Flame, Star } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function ProfilePage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<FirestoreUserData | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadProfile();
        }
    }, [user]);

    const loadProfile = async () => {
        if (!user) return;
        try {
            const [userData, userPosts] = await Promise.all([
                getUserData(user.uid),
                getUserPosts(user.uid)
            ]);
            setProfile(userData);
            setPosts(userPosts);
        } catch (error) {
            console.error("Error loading profile:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex justify-center">
                <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen pt-24 text-center text-white">
                Profile not found
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Profile Header */}
                <div className="relative mb-8">
                    {/* Banner */}
                    <div className="h-48 md:h-64 rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                    </div>

                    {/* Profile Info */}
                    <div className="px-6 md:px-10 pb-6 -mt-16 md:-mt-20 relative flex flex-col md:flex-row items-end md:items-end gap-6">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-slate-950 bg-slate-900 overflow-hidden relative z-10">
                            {profile.profilePicture ? (
                                <Image
                                    src={profile.profilePicture}
                                    alt={profile.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white bg-gradient-to-br from-accent-indigo to-accent-cyan">
                                    {profile.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 mb-2">
                            <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
                            <p className="text-slate-400">@{profile.username}</p>
                        </div>

                        <div className="flex gap-3 mb-2 w-full md:w-auto">
                            <Button className="flex-1 md:flex-none">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Profile
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Sidebar */}
                    <div className="space-y-6">
                        {/* Bio & Details */}
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
                            {profile.bio && (
                                <p className="text-slate-300 leading-relaxed">{profile.bio}</p>
                            )}

                            <div className="space-y-3 pt-2">
                                {profile.location && (
                                    <div className="flex items-center text-slate-400 text-sm">
                                        <MapPin className="w-4 h-4 mr-3 text-slate-500" />
                                        {profile.location}
                                    </div>
                                )}
                                {profile.website && (
                                    <div className="flex items-center text-slate-400 text-sm">
                                        <LinkIcon className="w-4 h-4 mr-3 text-slate-500" />
                                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-accent-indigo hover:underline">
                                            {profile.website.replace(/^https?:\/\//, '')}
                                        </a>
                                    </div>
                                )}
                                <div className="flex items-center text-slate-400 text-sm">
                                    <Calendar className="w-4 h-4 mr-3 text-slate-500" />
                                    Joined {format(new Date(profile.createdAt), 'MMMM yyyy')}
                                </div>
                            </div>

                            <div className="flex gap-6 pt-4 border-t border-slate-800">
                                <div>
                                    <span className="block text-lg font-bold text-white">{profile.followers}</span>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider">Followers</span>
                                </div>
                                <div>
                                    <span className="block text-lg font-bold text-white">{profile.following}</span>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider">Following</span>
                                </div>
                            </div>
                        </div>

                        {/* Achievements */}
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-yellow-500" />
                                Achievements
                            </h3>

                            {profile.achievements && profile.achievements.length > 0 ? (
                                <div className="grid grid-cols-4 gap-2">
                                    {profile.achievements.map((achievement) => (
                                        <div key={achievement.id} className="aspect-square rounded-xl bg-slate-800 p-2 flex items-center justify-center relative group cursor-help">
                                            <span className="text-2xl">{achievement.icon}</span>

                                            {/* Tooltip */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                                                <p className="font-bold text-white mb-1">{achievement.title}</p>
                                                <p className="text-slate-400">{achievement.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-500 text-sm">No achievements yet. Keep learning!</p>
                            )}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-1 text-slate-400 text-sm">
                                    <Flame className="w-4 h-4 text-orange-500" />
                                    Streak
                                </div>
                                <span className="text-2xl font-bold text-white">{profile.streak} Days</span>
                            </div>
                            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-1 text-slate-400 text-sm">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    XP
                                </div>
                                <span className="text-2xl font-bold text-white">{profile.xp}</span>
                            </div>
                            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-1 text-slate-400 text-sm">
                                    <Trophy className="w-4 h-4 text-purple-500" />
                                    Level
                                </div>
                                <span className="text-2xl font-bold text-white">{profile.level}</span>
                            </div>
                        </div>

                        {/* Recent Activity / Posts */}
                        <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                        <div className="space-y-4">
                            {posts.length > 0 ? (
                                posts.map(post => (
                                    <motion.div
                                        key={post.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6"
                                    >
                                        <p className="text-slate-300 mb-4">{post.content.text}</p>
                                        {post.content.images && post.content.images.length > 0 && (
                                            <div className="grid grid-cols-2 gap-2 mb-4">
                                                {post.content.images.map((img, i) => (
                                                    <img key={i} src={img} alt="Post content" className="rounded-xl w-full h-48 object-cover" />
                                                ))}
                                            </div>
                                        )}
                                        <div className="text-sm text-slate-500">
                                            Posted {format(new Date(post.createdAt), 'MMM d, yyyy')}
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-2xl">
                                    <p className="text-slate-500">No recent activity</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
