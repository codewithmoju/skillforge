"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { getGroups, getUserGroups, Group } from "@/lib/services/groups";
import { motion } from "framer-motion";
import { Users, Plus, Search, Hash, Globe, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";

type TabType = "all" | "my";

export default function GroupsPage() {
    const { user } = useAuth();
    const [allGroups, setAllGroups] = useState<Group[]>([]);
    const [myGroups, setMyGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<TabType>("all");

    useEffect(() => {
        const fetchGroups = async () => {
            setLoading(true);
            try {
                const groups = await getGroups(50);
                setAllGroups(groups);

                if (user) {
                    const userGroups = await getUserGroups(user.uid);
                    setMyGroups(userGroups);
                }
            } catch (error) {
                console.error("Failed to fetch groups:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, [user]);

    const displayGroups = activeTab === "all" ? allGroups : myGroups;

    const filteredGroups = displayGroups.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="min-h-screen pt-24 px-6 flex justify-center">
                <Loader2 className="h-8 w-8 text-accent-cyan animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-4">Community Groups</h1>
                    <p className="text-slate-400 max-w-2xl">
                        Connect with like-minded learners, share knowledge, and collaborate on projects in specialized study groups.
                    </p>
                </div>
                <Link href="/groups/create">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Group
                    </Button>
                </Link>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab("all")}
                    className={`px-5 py-2.5 rounded-xl font-medium transition-all ${activeTab === "all"
                            ? "bg-accent-indigo text-white"
                            : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white"
                        }`}
                >
                    <Globe className="w-4 h-4 inline mr-2" />
                    All Groups
                </button>
                <button
                    onClick={() => setActiveTab("my")}
                    className={`px-5 py-2.5 rounded-xl font-medium transition-all ${activeTab === "my"
                            ? "bg-accent-indigo text-white"
                            : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white"
                        }`}
                >
                    <Users className="w-4 h-4 inline mr-2" />
                    My Groups
                    {myGroups.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-xs">
                            {myGroups.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-10">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search groups by name, description, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all"
                />
            </div>

            {/* Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGroups.length > 0 ? (
                    filteredGroups.map((group) => (
                        <Link href={`/groups/${group.id}`} key={group.id}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 hover:border-cyan-500/30 transition-all group cursor-pointer h-full flex flex-col"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden">
                                        {group.imageUrl ? (
                                            <Image src={group.imageUrl} alt={group.name} width={48} height={48} className="w-full h-full object-cover" />
                                        ) : (
                                            <Hash className="w-6 h-6 text-slate-400" />
                                        )}
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${(group as any).isPrivate
                                            ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                                            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                        }`}>
                                        {(group as any).isPrivate ? <Lock className="w-3 h-3 inline mr-1" /> : <Globe className="w-3 h-3 inline mr-1" />}
                                        {(group as any).isPrivate ? "Private" : "Public"}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                                    {group.name}
                                </h3>
                                <p className="text-slate-400 text-sm mb-6 line-clamp-2 flex-1">
                                    {group.description}
                                </p>

                                {group.tags && group.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {group.tags.slice(0, 3).map(tag => (
                                            <span key={tag} className="px-2 py-1 rounded-lg bg-slate-800 text-xs text-slate-300">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                                        <Users className="w-4 h-4" />
                                        <span>{group.membersCount || 0} members</span>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30">
                                        View Group
                                    </Button>
                                </div>
                            </motion.div>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full text-center py-20">
                        <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-slate-600" />
                        </div>
                        {activeTab === "my" ? (
                            <>
                                <h3 className="text-xl font-semibold text-white mb-2">You haven't joined any groups yet</h3>
                                <p className="text-slate-400 mb-6">Explore all groups and join communities that interest you!</p>
                                <Button onClick={() => setActiveTab("all")}>
                                    <Globe className="w-4 h-4 mr-2" />
                                    Browse All Groups
                                </Button>
                            </>
                        ) : (
                            <>
                                <h3 className="text-xl font-semibold text-white mb-2">No groups found</h3>
                                <p className="text-slate-400">Try adjusting your search or create a new group.</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
