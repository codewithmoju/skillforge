export default function CoursesDocsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">Courses & Lessons</h1>
                <p className="text-xl text-slate-400 leading-relaxed">
                    Dive deep into structured learning paths with AI-generated courses, quizzes, and interactive lessons.
                </p>
            </div>

            <div className="h-px bg-gradient-to-r from-white/10 to-transparent" />

            <section>
                <h2 className="text-2xl font-bold text-white mb-4">Active Missions</h2>
                <p className="text-slate-300">
                    The <strong>Courses</strong> page is your library of active learning content. Any roadmap you generate or course you enroll in appears here as an "Active Mission".
                </p>
                <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg">
                    <p className="text-blue-200 text-sm">
                        <strong>Note:</strong> You can have multiple active missions at once, but we recommend focusing on one to maintain your streak efficiency.
                    </p>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-white mb-6">Neural Upgrades</h2>
                <p className="text-slate-300 mb-6">
                    "Neural Upgrades" are AI-recommended courses tailored to your profile. The system analyzes your:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <li className="bg-slate-900 p-4 rounded-xl text-center border border-slate-800">
                        <span className="block text-2xl mb-2">📊</span>
                        <span className="text-slate-300 font-medium">Past Performance</span>
                    </li>
                    <li className="bg-slate-900 p-4 rounded-xl text-center border border-slate-800">
                        <span className="block text-2xl mb-2">🎯</span>
                        <span className="text-slate-300 font-medium">Stated Goals</span>
                    </li>
                    <li className="bg-slate-900 p-4 rounded-xl text-center border border-slate-800">
                        <span className="block text-2xl mb-2">👥</span>
                        <span className="text-slate-300 font-medium">Community Trends</span>
                    </li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-white mb-6">Course Structure</h2>
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/20">
                            <span className="text-cyan-400 font-bold">1</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Modules</h3>
                            <p className="text-slate-400">High-level chapters that group related concepts together. A course typically has 3-5 modules.</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/20">
                            <span className="text-cyan-400 font-bold">2</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Lessons</h3>
                            <p className="text-slate-400">Bite-sized learning units. Each lesson includes reading material, code examples, and diagrams.</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/20">
                            <span className="text-cyan-400 font-bold">3</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Quizzes</h3>
                            <p className="text-slate-400">Interactive tests at the end of each module to verify your understanding. You must pass the quiz to unlock the next module.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
