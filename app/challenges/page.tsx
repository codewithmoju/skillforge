"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { collection, query, where, getDocs, updateDoc, doc, arrayUnion, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Trophy, Calendar, Target, Users, ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useUserStore } from "@/lib/store";
import { toast } from "sonner";
import Image from "next/image";

interface Challenge {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    participants: string[];
    xpReward: number;
    type: 'daily' | 'weekly' | 'special';
    requirements: {
        type: 'lessons' | 'streak' | 'xp';
        target: number;
    };
    image?: string;
}

export default function ChallengesPage() {
    const { user } = useAuth();
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState(true);
    const { xp, addXp } = useUserStore();

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const q = query(collection(db, "challenges"), orderBy("endDate", "desc"));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Challenge));
                setChallenges(data);
            } catch (error) {
                console.error("Failed to fetch challenges:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChallenges();
    }, []);

    const joinChallenge = async (challengeId: string) => {
        if (!user) return;
        try {
            const challengeRef = doc(db, "challenges", challengeId);
            await updateDoc(challengeRef, {
                participants: arrayUnion(user.uid)
            });

            // Update local state
            setChallenges(prev => prev.map(c =>
                c.id === challengeId
                    ? { ...c, participants: [...c.participants, user.uid] }
                    : c
            ));

            toast.success("Joined challenge successfully!");
        } catch (error) {
            console.error("Failed to join challenge:", error);
            toast.error("Failed to join challenge");
        }
    };

    const getProgress = (challenge: Challenge) => {
        // Placeholder logic - in real app, would calculate based on user stats
        return 0;
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 px-6 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-4">Challenges & Quests</h1>
                    <p className="text-slate-400 max-w-2xl">
                        Compete with others, maintain your streak, and earn exclusive rewards by completing limited-time challenges.
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                    <div className="p-3 bg-amber-500/10 rounded-xl">
                        <Trophy className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">Total XP Earned</p>
                        <p className="text-xl font-bold text-white">{xp.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.map((challenge) => {
                    const isJoined = user && challenge.participants.includes(user.uid);
                    const isActive = new Date(challenge.endDate) > new Date();
                    const progress = getProgress(challenge);

                    return (
                        <motion.div
                            key={challenge.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group relative bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300"
                        >
                            <div className="aspect-video relative bg-slate-800">
                                {challenge.image ? (
                                    <Image src={challenge.image} alt={challenge.title} fill className="object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                                        <Target className="w-12 h-12 text-slate-700" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs font-medium text-white">
                                    {challenge.type.toUpperCase()}
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                                        {challenge.title}
                                    </h3>
                                    <div className="flex items-center gap-1 text-amber-400 text-sm font-medium">
                                        <Trophy className="w-4 h-4" />
                                        +{challenge.xpReward} XP
                                    </div>
                                </div>

                                <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                                    {challenge.description}
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>{new Date(challenge.endDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            <span>{challenge.participants.length} joined</span>
                                        </div>
                                    </div>

                                    {isJoined ? (
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs text-slate-400">
                                                <span>Progress</span>
                                                <span>{progress}%</span>
                                            </div>
                                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <Button
                                            className="w-full"
                                            onClick={() => joinChallenge(challenge.id)}
                                            disabled={!isActive}
                                        >
                                            {isActive ? 'Join Challenge' : 'Ended'}
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
