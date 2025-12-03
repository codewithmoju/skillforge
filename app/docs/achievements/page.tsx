export default function AchievementsDocsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">Achievements</h1>
                <p className="text-xl text-slate-400 leading-relaxed">
                    Track your milestones, unlock badges, and earn rewards as you master new skills.
                </p>
            </div>

            <div className="h-px bg-gradient-to-r from-white/10 to-transparent" />

            <section>
                <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
                <p className="text-slate-300">
                    Achievements are permanent records of your accomplishments in EduMate AI. There are over 50 unique achievements to unlock, ranging from completing your first lesson to maintaining a year-long streak.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-white mb-6">Achievement Categories</h2>
                <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-white/5">
                        <div className="text-2xl">🗺️</div>
                        <div>
                            <h3 className="font-bold text-white">Generation</h3>
                            <p className="text-slate-400 text-sm">Awarded for creating new roadmaps, courses, and exploring new topics.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-white/5">
                        <div className="text-2xl">✅</div>
                        <div>
                            <h3 className="font-bold text-white">Completion</h3>
                            <p className="text-slate-400 text-sm">Earned by finishing lessons, passing quizzes, and completing entire courses.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-white/5">
                        <div className="text-2xl">🔥</div>
                        <div>
                            <h3 className="font-bold text-white">Engagement</h3>
                            <p className="text-slate-400 text-sm">Recognizes consistency, such as daily logins and streak milestones.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-white/5">
                        <div className="text-2xl">👥</div>
                        <div>
                            <h3 className="font-bold text-white">Social</h3>
                            <p className="text-slate-400 text-sm">Unlocked by interacting with the community—posting, liking, and following.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-white mb-6">Stars & Tiers</h2>
                <p className="text-slate-300 mb-6">
                    Many achievements are multi-tiered, allowing you to level them up over time. Each tier is represented by a star.
                </p>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-amber-900/10 border border-amber-700/30 rounded-xl">
                        <div className="text-amber-700 text-2xl mb-2">★☆☆</div>
                        <h4 className="font-bold text-amber-500">Bronze</h4>
                        <p className="text-xs text-slate-400">Tier 1</p>
                    </div>
                    <div className="text-center p-4 bg-slate-300/10 border border-slate-400/30 rounded-xl">
                        <div className="text-slate-400 text-2xl mb-2">★★☆</div>
                        <h4 className="font-bold text-slate-300">Silver</h4>
                        <p className="text-xs text-slate-400">Tier 2</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                        <div className="text-yellow-500 text-2xl mb-2">★★★</div>
                        <h4 className="font-bold text-yellow-400">Gold</h4>
                        <p className="text-xs text-slate-400">Tier 3</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
