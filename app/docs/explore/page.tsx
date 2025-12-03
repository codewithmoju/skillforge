export default function ExploreDocsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">Explore</h1>
                <p className="text-xl text-slate-400 leading-relaxed">
                    Discover new content, find trending posts, and connect with the global community.
                </p>
            </div>

            <div className="h-px bg-gradient-to-r from-white/10 to-transparent" />

            <section>
                <h2 className="text-2xl font-bold text-white mb-4">Search</h2>
                <p className="text-slate-300 mb-6">
                    The Explore page features a powerful search engine that allows you to find other users by name or username.
                </p>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">🔍</div>
                    <div>
                        <h3 className="font-bold text-white">Find Mentors & Peers</h3>
                        <p className="text-sm text-slate-400">Type a query to instantly see matching profiles. You can follow users directly from the search results.</p>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-white mb-6">Trending Grid</h2>
                <p className="text-slate-300 mb-6">
                    See what's hot on EduMate AI. The Trending Grid displays the most popular posts, roadmaps, and projects from across the platform.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 not-prose opacity-50 pointer-events-none select-none">
                    <div className="bg-slate-800 h-32 rounded-xl"></div>
                    <div className="bg-slate-800 h-32 rounded-xl"></div>
                    <div className="bg-slate-800 h-32 rounded-xl"></div>
                    <div className="bg-slate-800 h-32 rounded-xl col-span-2"></div>
                    <div className="bg-slate-800 h-32 rounded-xl"></div>
                </div>
                <p className="text-center text-xs text-slate-500 mt-2">Visual representation of the layout</p>
            </section>
        </div>
    );
}
