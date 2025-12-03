export default function RoadmapsDocsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">AI Roadmaps</h1>
                <p className="text-xl text-slate-400 leading-relaxed">
                    Generate personalized, adaptive learning paths for any skill or topic using our advanced AI engine.
                </p>
            </div>

            <div className="h-px bg-gradient-to-r from-white/10 to-transparent" />

            <section>
                <h2 className="text-2xl font-bold text-white mb-4">How It Works</h2>
                <p className="text-slate-300 mb-4">
                    Unlike static tutorials, EduMate AI builds a custom curriculum just for you. Whether you want to learn "Quantum Computing" or "React Native", the AI analyzes the topic and constructs a comprehensive dependency tree of concepts.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-white mb-6">Generating a Roadmap</h2>
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                    <ol className="space-y-4 list-decimal list-inside text-slate-300 marker:text-blue-500 marker:font-bold">
                        <li className="pl-2">Navigate to the <strong>Roadmap</strong> page from the sidebar.</li>
                        <li className="pl-2">If you have no active roadmap, you will see the <strong>Initiate Protocol</strong> interface.</li>
                        <li className="pl-2">Enter your desired topic (e.g., <em className="text-blue-300">"Full Stack Web Development"</em>).</li>
                        <li className="pl-2">Select your current experience level (Beginner, Intermediate, Advanced).</li>
                        <li className="pl-2">Click <strong>Generate</strong> and watch as the AI constructs your Skill Tree.</li>
                    </ol>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-white mb-6">The Skill Tree</h2>
                <p className="text-slate-300 mb-6">
                    Your roadmap is visualized as an interactive node graph called the Skill Tree.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700">
                        <h3 className="font-bold text-white mb-2">🌳 Learning Areas</h3>
                        <p className="text-sm text-slate-400">The main branches of your tree. These represent high-level domains (e.g., "Frontend", "Backend", "DevOps").</p>
                    </div>
                    <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700">
                        <h3 className="font-bold text-white mb-2">🍃 Nodes (Topics)</h3>
                        <p className="text-sm text-slate-400">Specific subjects to master. Clicking a node reveals its "Key Points" and learning resources.</p>
                    </div>
                    <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700">
                        <h3 className="font-bold text-white mb-2">🔒 Locked Nodes</h3>
                        <p className="text-sm text-slate-400">Advanced topics that remain locked until you complete their prerequisites.</p>
                    </div>
                    <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700">
                        <h3 className="font-bold text-white mb-2">✨ Quest Path</h3>
                        <p className="text-sm text-slate-400">A linear sequence of essential concepts you must clear before the full tree opens up.</p>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-white mb-4">Mission Control Sidebar</h2>
                <p className="text-slate-300">
                    On the right side of the Roadmap page, you'll find the Mission Control panel. Use this to:
                </p>
                <ul className="list-disc list-inside text-slate-300 mt-4 space-y-2 marker:text-blue-500">
                    <li>Track your overall completion percentage.</li>
                    <li>Regenerate the roadmap if it's not quite right.</li>
                    <li><strong>Generate Course:</strong> Convert a specific node or the entire roadmap into a structured course with quizzes.</li>
                </ul>
            </section>
        </div>
    );
}
