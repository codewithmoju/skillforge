export default function GamificationGuidePage() {
    return (
        <div className="space-y-6">
            <h1>Gamification</h1>
            <p className="lead text-xl text-slate-400">
                Stay motivated with XP, levels, streaks, and achievements.
            </p>

            <hr className="border-white/10 my-8" />

            <h2>Experience Points (XP)</h2>
            <p>
                You earn XP for every action you take on the platform:
            </p>
            <ul>
                <li><strong>Completing a Lesson:</strong> 100 XP</li>
                <li><strong>Passing a Quiz:</strong> 50 XP</li>
                <li><strong>Daily Login:</strong> 20 XP</li>
            </ul>

            <h2>Streaks</h2>
            <p>
                Maintain a daily learning streak to earn bonus multipliers.
            </p>
            <div className="bg-orange-900/20 border border-orange-500/50 p-4 rounded-xl flex items-center gap-4">
                <div className="text-4xl">🔥</div>
                <div>
                    <h3 className="text-orange-400 font-bold m-0">Streak Freeze</h3>
                    <p className="text-sm text-orange-200/70 m-0">Missed a day? Use a Streak Freeze to keep your streak alive.</p>
                </div>
            </div>

            <h2>Leagues</h2>
            <p>
                Compete with other learners in weekly leagues. The top 10 learners promote to the next league, while the bottom 10 are demoted.
            </p>
        </div>
    );
}
