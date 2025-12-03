export default function GroupsDocsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">Groups & Communities</h1>
                <p className="text-xl text-slate-400 leading-relaxed">
                    Join forces with like-minded learners. Collaborate, share resources, and grow together.
                </p>
            </div>

            <div className="h-px bg-gradient-to-r from-white/10 to-transparent" />

            <section>
                <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
                <p className="text-slate-300">
                    Groups are micro-communities within EduMate AI focused on specific topics, technologies, or goals. Whether you're into "React Development", "Data Science", or "UI Design", there's a group for you.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-white mb-6">Finding & Joining Groups</h2>
                <ol className="space-y-4 list-decimal list-inside text-slate-300 marker:text-indigo-500 marker:font-bold">
                    <li className="pl-2">Navigate to the <strong>Groups</strong> page.</li>
                    <li className="pl-2">Use the search bar to find communities by name or tag.</li>
                    <li className="pl-2">Browse the list of available groups.</li>
                    <li className="pl-2">Click on a group card to view its details and join.</li>
                </ol>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-white mb-6">Creating a Group</h2>
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                    <p className="text-slate-300 mb-4">
                        Can't find the right community? Create your own!
                    </p>
                    <ul className="space-y-3 text-slate-400 text-sm">
                        <li className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            Give your group a catchy <strong>Name</strong>.
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            Write a clear <strong>Description</strong> of its purpose.
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            Add relevant <strong>Tags</strong> (e.g., "javascript", "beginners") to help others find it.
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    );
}
