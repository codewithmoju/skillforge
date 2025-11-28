'use client';

import React, { useEffect, useState } from 'react';
import { DailyChallenge, getDailyChallenges } from '@/lib/services/challenges';
import { Trophy, CheckCircle2, Circle } from 'lucide-react';
import { AchievementsGuide } from './AchievementsGuide';

interface DailyChallengesProps {
    userId: string;
}

export function DailyChallenges({ userId }: DailyChallengesProps) {
    const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
    const [loading, setLoading] = useState(true);
    const [showGuide, setShowGuide] = useState(false);

    useEffect(() => {
        if (!userId) return;
        getDailyChallenges(userId).then(data => {
            setChallenges(data);
            setLoading(false);
        });
    }, [userId]);

    if (loading) return null;

    return (
        <>
            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-4 mt-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <h3 className="font-bold text-white">Daily Challenges</h3>
                    </div>
                    <button
                        onClick={() => setShowGuide(true)}
                        className="text-xs text-accent-cyan hover:underline"
                    >
                        View All
                    </button>
                </div>

                <div className="space-y-3">
                    {challenges.map((challenge) => (
                        <div key={challenge.id} className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="font-medium text-slate-200 text-sm">{challenge.title}</p>
                                    <p className="text-xs text-slate-500">{challenge.description}</p>
                                </div>
                                {challenge.completed ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                ) : (
                                    <Circle className="w-5 h-5 text-slate-600" />
                                )}
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${challenge.completed ? 'bg-green-500' : 'bg-accent-indigo'
                                        }`}
                                    style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                                />
                            </div>

                            <div className="flex justify-between items-center mt-1.5">
                                <span className="text-xs text-slate-400">
                                    {challenge.progress} / {challenge.target}
                                </span>
                                <span className="text-xs font-bold text-yellow-400">
                                    +{challenge.xpReward} XP
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showGuide && <AchievementsGuide onClose={() => setShowGuide(false)} />}
        </>
    );
}
