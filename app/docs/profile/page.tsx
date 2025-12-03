export default function ProfileDocsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">Your Profile</h1>
                <p className="text-xl text-slate-400 leading-relaxed">
                    Your public identity in the SkillForge universe. Showcase your achievements, stats, and learning journey.
                </p>
            </div>

            <div className="h-px bg-gradient-to-r from-white/10 to-transparent" />

            <section>
                <h2 className="text-2xl font-bold text-white mb-4">Profile Overview</h2>
                <p className="text-slate-300 mb-6">
                    Your profile is more than just a bio. It's a dynamic record of your growth. Other users can visit your profile to see your progress, follow you, and view your contributions.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                        <h3 className="text-xl font-bold text-white mb-3">👤 Identity</h3>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            <li><strong>Avatar:</strong> Your profile picture.</li>
                            <li><strong>Level Badge:</strong> Displays your current rank.</li>
                            <li><strong>Bio:</strong> A short description of who you are.</li>
                            <li><strong>Social Links:</strong> Website, location, and occupation.</li>
                        </ul>
                    </div>

                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                        <h3 className="text-xl font-bold text-white mb-3">📊 Stats</h3>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            <li><strong>XP Bar:</strong> Visual progress to the next level.</li>
                            <li><strong>Streak:</strong> Current daily learning streak.</li>
                            <li><strong>Lessons:</strong> Total lessons completed.</li>
                            <li><strong>Followers:</strong> People following your journey.</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-white mb-6">Tabs</h2>
                <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                        <div className="p-2 bg-slate-800 rounded-lg shrink-0">📝</div>
                        <div>
                            <h3 className="font-bold text-white">Posts</h3>
                            <p className="text-slate-400 text-sm">A timeline of all your shared updates, project showcases, and questions.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="p-2 bg-slate-800 rounded-lg shrink-0">🔖</div>
                        <div>
                            <h3 className="font-bold text-white">Saved</h3>
                            <p className="text-slate-400 text-sm">
                                <span className="text-blue-400 text-xs uppercase font-bold mr-2">Private</span>
                                A collection of posts you've bookmarked for later reference. Only you can see this tab.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="p-2 bg-slate-800 rounded-lg shrink-0">🏆</div>
                        <div>
                            <h3 className="font-bold text-white">Achievements</h3>
                            <p className="text-slate-400 text-sm">A showcase of all the badges you've unlocked.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
