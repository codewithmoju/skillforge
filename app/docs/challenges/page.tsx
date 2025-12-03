export default function ChallengesDocsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">Challenges</h1>
                <p className="text-xl text-slate-400 leading-relaxed">
                    Compete with other learners, test your skills in real-world scenarios, and earn massive XP rewards.
                </p>
            </div>

            <div className="h-px bg-gradient-to-r from-white/10 to-transparent" />

            <section>
                <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
                <p className="text-slate-300">
                    Challenges are time-limited events designed to push your skills to the limit. Unlike standard lessons, challenges require you to apply what you've learned to solve complex problems. They are the best way to prove your mastery and climb the leaderboards.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-white mb-6">Challenge Types</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 hover:border-blue-500/50 transition-colors">
                        <div className="text-4xl mb-4">💻</div>
                        <h3 className="text-xl font-bold text-white mb-2">Coding</h3>
                        <p className="text-slate-400 text-sm">
                            Solve algorithmic problems or build small applications. Verified by automated test cases.
                        </p>
                    </div>

                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 hover:border-purple-500/50 transition-colors">
                        <div className="text-4xl mb-4">🎨</div>
                        <h3 className="text-xl font-bold text-white mb-2">Design</h3>
                        <p className="text-slate-400 text-sm">
                            Create UI/UX mockups based on a specific prompt. Voted on by the community.
                        </p>
                    </div>

                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 hover:border-green-500/50 transition-colors">
                        <div className="text-4xl mb-4">⚡</div>
                        <h3 className="text-xl font-bold text-white mb-2">Quiz</h3>
                        <p className="text-slate-400 text-sm">
                            Rapid-fire questions to test your theoretical knowledge. Speed and accuracy matter!
                        </p>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-white mb-6">How to Participate</h2>
                <ol className="space-y-4 list-decimal list-inside text-slate-300 marker:text-yellow-500 marker:font-bold">
                    <li className="pl-2">Navigate to the <strong>Challenges</strong> page.</li>
                    <li className="pl-2">Browse the <strong>Active</strong> or <strong>Upcoming</strong> tabs.</li>
                    <li className="pl-2">Click <strong>Join Now</strong> on a challenge card to register.</li>
                    <li className="pl-2">Submit your solution before the timer runs out!</li>
                </ol>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-white mb-4">Rewards</h2>
                <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-1 bg-gradient-to-br from-yellow-500/10 to-orange-600/10 p-6 rounded-2xl border border-yellow-500/20">
                        <h3 className="font-bold text-yellow-400 mb-2">Experience (XP)</h3>
                        <p className="text-slate-300 text-sm">Challenges offer significantly more XP than regular lessons.</p>
                    </div>
                    <div className="flex-1 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 p-6 rounded-2xl border border-cyan-500/20">
                        <h3 className="font-bold text-cyan-400 mb-2">Badges</h3>
                        <p className="text-slate-300 text-sm">Exclusive badges for winners and participants to display on their profile.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
