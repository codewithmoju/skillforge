'use client';

import Link from 'next/link';
import { Trophy, Calendar, Users, ArrowRight } from 'lucide-react';
import { Challenge } from '@/lib/services/challenges';

interface ChallengeCardProps {
    challenge: Challenge;
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
    const daysLeft = Math.ceil((new Date(challenge.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    return (
        <Link href={`/challenges/${challenge.id}`} className="block">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hover:border-accent-cyan/50 transition-all group h-full flex flex-col">
                <div className="h-32 bg-slate-800 relative overflow-hidden">
                    <div className={`absolute inset-0 opacity-20 ${challenge.type === 'coding' ? 'bg-blue-500' :
                            challenge.type === 'design' ? 'bg-purple-500' : 'bg-green-500'
                        }`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Trophy className={`w-12 h-12 ${challenge.type === 'coding' ? 'text-blue-400' :
                                challenge.type === 'design' ? 'text-purple-400' : 'text-green-400'
                            }`} />
                    </div>

                    <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white border border-slate-700">
                        {challenge.xpReward} XP
                    </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-accent-cyan transition-colors">
                            {challenge.title}
                        </h3>
                    </div>

                    <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-1">
                        {challenge.description}
                    </p>

                    <div className="space-y-3 mt-auto">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-slate-500">
                                <Users className="w-4 h-4" />
                                <span>{challenge.participantsCount} joined</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500">
                                <Calendar className="w-4 h-4" />
                                <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}</span>
                            </div>
                        </div>

                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-accent-cyan rounded-full"
                                style={{ width: `${Math.min(100, (challenge.participantsCount / 100) * 100)}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
