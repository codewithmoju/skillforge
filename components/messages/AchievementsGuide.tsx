'use client';

import { ACHIEVEMENTS } from '@/lib/services/conversationStats';
import { Trophy, X } from 'lucide-react';

interface AchievementsGuideProps {
    onClose: () => void;
}

export function AchievementsGuide({ onClose }: AchievementsGuideProps) {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl transform animate-scaleIn">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <h3 className="font-bold text-white">Achievements Guide</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3">
                    <p className="text-sm text-slate-400 mb-4">
                        Unlock badges and earn XP by chatting! Here are the available achievements:
                    </p>

                    {ACHIEVEMENTS.map((achievement) => (
                        <div key={achievement.id} className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 flex items-start gap-3">
                            <div className="text-2xl bg-slate-800 w-10 h-10 rounded-full flex items-center justify-center border border-slate-700">
                                {achievement.icon}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-semibold text-white text-sm">{achievement.title}</h4>
                                    <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full">
                                        +{achievement.xpReward} XP
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">{achievement.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
