export default function TiersDocsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">Tiers & XP</h1>
                <p className="text-xl text-slate-400 leading-relaxed">
                    Level up your profile, unlock prestige, and climb the ranks of the SkillForge universe.
                </p>
            </div>

            <div className="h-px bg-gradient-to-r from-white/10 to-transparent" />

            <section>
                <h2 className="text-2xl font-bold text-white mb-6">Experience Points (XP)</h2>
                <p className="text-slate-300 mb-6">
                    XP is the currency of progress in EduMate AI. It measures your effort and dedication. You earn XP for almost every productive action you take.
                </p>

                <div className="overflow-hidden rounded-xl border border-slate-800">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-900 text-slate-200 uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">Action</th>
                                <th className="px-6 py-4">XP Reward</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                            <tr>
                                <td className="px-6 py-4">Completing a Lesson</td>
                                <td className="px-6 py-4 text-green-400 font-mono">+100 XP</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4">Passing a Quiz</td>
                                <td className="px-6 py-4 text-green-400 font-mono">+50 XP</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4">Daily Login</td>
                                <td className="px-6 py-4 text-green-400 font-mono">+20 XP</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4">Winning a Challenge</td>
                                <td className="px-6 py-4 text-yellow-400 font-mono font-bold">+500 XP</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-white mb-6">Level Tiers</h2>
                <p className="text-slate-300 mb-6">
                    As you accumulate XP, you will level up. Your level determines your Tier, which is displayed on your profile and leaderboard entries.
                </p>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-slate-700 mb-4 flex items-center justify-center text-xl">🛡️</div>
                        <h3 className="text-slate-400 font-bold text-lg">Novice</h3>
                        <p className="text-sm text-slate-500 mt-1">Levels 1-5</p>
                    </div>

                    <div className="p-6 rounded-xl bg-slate-900 border border-blue-900/50 flex flex-col items-center text-center shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                        <div className="w-12 h-12 rounded-full bg-blue-900/50 mb-4 flex items-center justify-center text-xl text-blue-400">⚔️</div>
                        <h3 className="text-blue-400 font-bold text-lg">Apprentice</h3>
                        <p className="text-sm text-slate-500 mt-1">Levels 6-15</p>
                    </div>

                    <div className="p-6 rounded-xl bg-slate-900 border border-purple-900/50 flex flex-col items-center text-center shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                        <div className="w-12 h-12 rounded-full bg-purple-900/50 mb-4 flex items-center justify-center text-xl text-purple-400">🔮</div>
                        <h3 className="text-purple-400 font-bold text-lg">Adept</h3>
                        <p className="text-sm text-slate-500 mt-1">Levels 16-30</p>
                    </div>

                    <div className="p-6 rounded-xl bg-slate-900 border border-amber-900/50 flex flex-col items-center text-center shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                        <div className="w-12 h-12 rounded-full bg-amber-900/50 mb-4 flex items-center justify-center text-xl text-amber-400">🦁</div>
                        <h3 className="text-amber-400 font-bold text-lg">Expert</h3>
                        <p className="text-sm text-slate-500 mt-1">Levels 31-50</p>
                    </div>

                    <div className="p-6 rounded-xl bg-slate-900 border border-red-900/50 flex flex-col items-center text-center shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                        <div className="w-12 h-12 rounded-full bg-red-900/50 mb-4 flex items-center justify-center text-xl text-red-400">🐉</div>
                        <h3 className="text-red-400 font-bold text-lg">Master</h3>
                        <p className="text-sm text-slate-500 mt-1">Levels 51-75</p>
                    </div>

                    <div className="p-6 rounded-xl bg-slate-900 border border-cyan-900/50 flex flex-col items-center text-center shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                        <div className="w-12 h-12 rounded-full bg-cyan-900/50 mb-4 flex items-center justify-center text-xl text-cyan-400">👑</div>
                        <h3 className="text-cyan-400 font-bold text-lg">Legend</h3>
                        <p className="text-sm text-slate-500 mt-1">Levels 76+</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
