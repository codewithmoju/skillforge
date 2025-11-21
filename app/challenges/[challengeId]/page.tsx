'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useUserStore } from '@/lib/store';
import { getChallenge, joinChallenge, Challenge } from '@/lib/services/challenges';
import { Loader2, Trophy, Calendar, Users, CheckCircle, Clock } from 'lucide-react';

export default function ChallengeDetailsPage() {
    const { challengeId } = useParams();
    const { user } = useAuth();
    const incrementChallengesJoined = useUserStore((state) => state.incrementChallengesJoined);
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [isParticipant, setIsParticipant] = useState(false);

    useEffect(() => {
        const fetchChallenge = async () => {
            if (!challengeId) return;
            try {
                const data = await getChallenge(challengeId as string);
                setChallenge(data);
                if (data && user) {
                    setIsParticipant(data.participants.includes(user.uid));
                }
            } catch (error) {
                console.error('Error fetching challenge:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChallenge();
    }, [challengeId, user]);

    const handleJoin = async () => {
        if (!user || !challenge || joining || isParticipant) return;

        setJoining(true);
        try {
            await joinChallenge(user.uid, challenge.id);
            setIsParticipant(true);
            setChallenge(prev => prev ? { ...prev, participantsCount: prev.participantsCount + 1 } : null);
            
            // Update achievement progress
            incrementChallengesJoined();
        } catch (error) {
            console.error('Error joining challenge:', error);
        } finally {
            setJoining(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
            </div>
        );
    }

    if (!challenge) {
        return (
            <div className="flex justify-center items-center min-h-screen text-slate-500">
                Challenge not found
            </div>
        );
    }

    const daysLeft = Math.ceil((new Date(challenge.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden mb-8">
                <div className="h-64 bg-slate-800 relative">
                    <div className={`absolute inset-0 opacity-30 ${challenge.type === 'coding' ? 'bg-blue-500' :
                            challenge.type === 'design' ? 'bg-purple-500' : 'bg-green-500'
                        }`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Trophy className="w-24 h-24 text-white opacity-50" />
                    </div>

                    <div className="absolute bottom-0 left-0 p-8 w-full">
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${challenge.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                    challenge.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' :
                                        'bg-slate-500/20 text-slate-400'
                                }`}>
                                {challenge.status}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-yellow-500/20 text-yellow-400">
                                {challenge.xpReward} XP
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">{challenge.title}</h1>
                    </div>
                </div>

                <div className="p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-white mb-4">Overview</h2>
                            <p className="text-slate-300 mb-8 text-lg leading-relaxed">{challenge.description}</p>

                            <h3 className="text-lg font-bold text-white mb-4">How to Participate</h3>
                            <ul className="space-y-3 text-slate-300 mb-8">
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-accent-cyan mt-0.5" />
                                    <span>Join the challenge before the deadline.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-accent-cyan mt-0.5" />
                                    <span>Complete the required tasks (coding, design, or learning).</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-accent-cyan mt-0.5" />
                                    <span>Submit your work to receive XP and badges.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="w-full md:w-72 space-y-6">
                            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                                <div className="flex items-center gap-3 mb-4 text-slate-300">
                                    <Calendar className="w-5 h-5 text-accent-indigo" />
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase">Deadline</p>
                                        <p className="font-medium">{new Date(challenge.endDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 mb-4 text-slate-300">
                                    <Clock className="w-5 h-5 text-accent-indigo" />
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase">Time Left</p>
                                        <p className="font-medium">{daysLeft > 0 ? `${daysLeft} days` : 'Ended'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-slate-300">
                                    <Users className="w-5 h-5 text-accent-indigo" />
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase">Participants</p>
                                        <p className="font-medium">{challenge.participantsCount}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleJoin}
                                disabled={joining || isParticipant || challenge.status === 'completed'}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${isParticipant
                                        ? 'bg-green-500/20 text-green-400 cursor-default'
                                        : 'bg-accent-indigo text-white hover:bg-accent-indigo/90 shadow-lg shadow-accent-indigo/20'
                                    }`}
                            >
                                {joining ? (
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                                ) : isParticipant ? (
                                    'Joined'
                                ) : (
                                    'Join Challenge'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
