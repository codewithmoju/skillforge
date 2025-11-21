'use client';

import { useState, useEffect } from 'react';
import { getChallenges, seedChallenges, Challenge } from '@/lib/services/challenges';
import { ChallengeCard } from '@/components/challenges/ChallengeCard';
import { Loader2, Trophy, Flame } from 'lucide-react';

export default function ChallengesPage() {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'active' | 'upcoming'>('all');

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                // Seed initial data if needed
                await seedChallenges();

                const data = await getChallenges(filter === 'all' ? undefined : filter);
                setChallenges(data);
            } catch (error) {
                console.error('Error fetching challenges:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChallenges();
    }, [filter]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 pb-24 md:pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Trophy className="w-8 h-8 text-yellow-500" />
                        Challenges
                    </h1>
                    <p className="text-slate-400">Compete, learn, and earn XP</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                    {(['all', 'active', 'upcoming'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f
                                    ? 'bg-slate-800 text-white shadow-sm'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Featured Challenge (First Active) */}
            {challenges.length > 0 && filter !== 'upcoming' && (
                <div className="mb-12 relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent-indigo to-accent-violet p-1">
                    <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 text-yellow-400 mb-2 font-semibold">
                                <Flame className="w-5 h-5" />
                                <span>Featured Challenge</span>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">{challenges[0].title}</h2>
                            <p className="text-slate-300 mb-6 text-lg">{challenges[0].description}</p>
                            <div className="flex items-center gap-6 mb-6">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-white">{challenges[0].xpReward}</p>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider">XP Reward</p>
                                </div>
                                <div className="w-px h-10 bg-slate-700" />
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-white">{challenges[0].participantsCount}</p>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider">Participants</p>
                                </div>
                            </div>
                            <button className="bg-white text-accent-indigo px-8 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors">
                                Join Now
                            </button>
                        </div>
                        <div className="w-full md:w-1/3 aspect-video bg-slate-800 rounded-xl flex items-center justify-center relative overflow-hidden">
                            <div className={`absolute inset-0 opacity-30 ${challenges[0].type === 'coding' ? 'bg-blue-500' :
                                    challenges[0].type === 'design' ? 'bg-purple-500' : 'bg-green-500'
                                }`} />
                            <Trophy className="w-20 h-20 text-white opacity-80" />
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.map(challenge => (
                    <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
            </div>
        </div>
    );
}
