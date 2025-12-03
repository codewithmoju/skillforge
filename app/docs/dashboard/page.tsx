export default function DashboardDocsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">Mission Control</h1>
                <p className="text-xl text-slate-400 leading-relaxed">
                    Your central command center for tracking progress, managing quests, and monitoring your learning stats.
                </p>
            </div>

            <div className="h-px bg-gradient-to-r from-white/10 to-transparent" />

            <section>
                <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
                <p className="text-slate-300">
                    The Dashboard is the heartbeat of your EduMate AI experience. It provides a real-time, high-level view of your entire learning journey. From here, you can instantly jump back into your active roadmaps, check your competitive standing, and manage your daily goals.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-white mb-6">Key Features</h2>

                <div className="grid gap-8">
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                        <h3 className="text-xl font-bold text-cyan-400 mb-3">1. Player Stats</h3>
                        <p className="text-slate-400 mb-4">
                            Located at the top of the dashboard, your player stats card is your identity in the SkillForge universe.
                        </p>
                        <ul className="space-y-2 text-slate-300 list-disc list-inside marker:text-cyan-500">
                            <li><strong>Level & Tier:</strong> Your current rank (e.g., "Novice", "Adept").</li>
                            <li><strong>XP Progress:</strong> A visual bar showing how close you are to leveling up.</li>
                            <li><strong>Streak:</strong> The number of consecutive days you've been active. Keep it up to earn multipliers!</li>
                        </ul>
                    </div>

                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                        <h3 className="text-xl font-bold text-purple-400 mb-3">2. Season Pulse</h3>
                        <p className="text-slate-400 mb-4">
                            EduMate AI operates on competitive "Seasons". The Season Pulse card tracks your performance against the global community.
                        </p>
                        <ul className="space-y-2 text-slate-300 list-disc list-inside marker:text-purple-500">
                            <li><strong>Global Rank:</strong> Your position on the worldwide leaderboard.</li>
                            <li><strong>Rival:</strong> The player directly above you. Overtake them to climb the ranks!</li>
                        </ul>
                    </div>

                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                        <h3 className="text-xl font-bold text-amber-400 mb-3">3. Quest Board</h3>
                        <p className="text-slate-400 mb-4">
                            Your daily and weekly objectives are pinned here. Completing quests is the fastest way to earn XP.
                        </p>
                        <ul className="space-y-2 text-slate-300 list-disc list-inside marker:text-amber-500">
                            <li><strong>Daily Quests:</strong> Rotates every 24 hours (e.g., "Complete 3 Lessons").</li>
                            <li><strong>Project Sprints:</strong> Long-term coding challenges you are currently building.</li>
                        </ul>
                    </div>
                </div>
            </section>

            <blockquote className="border-l-4 border-blue-500 pl-4 py-1 bg-blue-500/10 rounded-r-lg italic text-slate-300">
                <strong>Pro Tip:</strong> Check your Dashboard daily to claim your "Daily Login" XP bonus and keep your streak alive!
            </blockquote>
        </div>
    );
}
