export default function SocialDocsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">Social Hub</h1>
                <p className="text-xl text-slate-400 leading-relaxed">
                    Connect with other learners, share your progress, and get inspired by the community.
                </p>
            </div>

            <div className="h-px bg-gradient-to-r from-white/10 to-transparent" />

            <section>
                <h2 className="text-2xl font-bold text-white mb-4">The Feed</h2>
                <p className="text-slate-300 mb-6">
                    The Social Feed is your window into the EduMate AI community. It displays posts from users you follow, as well as trending content from around the platform. It's a great place to:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <li className="flex items-center gap-3 text-slate-300">
                        <span className="w-2 h-2 rounded-full bg-green-400" />
                        See what others are learning
                    </li>
                    <li className="flex items-center gap-3 text-slate-300">
                        <span className="w-2 h-2 rounded-full bg-green-400" />
                        Discover new roadmaps
                    </li>
                    <li className="flex items-center gap-3 text-slate-300">
                        <span className="w-2 h-2 rounded-full bg-green-400" />
                        Find study partners
                    </li>
                    <li className="flex items-center gap-3 text-slate-300">
                        <span className="w-2 h-2 rounded-full bg-green-400" />
                        Celebrate achievements
                    </li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-white mb-6">Creating Posts</h2>
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                    <p className="text-slate-300 mb-4">
                        Share your own journey by creating a post. You can access the post creator from the top of the feed or the "Create" button in the navigation.
                    </p>
                    <div className="space-y-4">
                        <div className="flex gap-4 items-start">
                            <div className="p-2 bg-slate-800 rounded-lg shrink-0">📝</div>
                            <div>
                                <h3 className="font-bold text-white">Text Posts</h3>
                                <p className="text-slate-400 text-sm">Write about what you learned today, ask a question, or share a tip.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="p-2 bg-slate-800 rounded-lg shrink-0">🖼️</div>
                            <div>
                                <h3 className="font-bold text-white">Image Uploads</h3>
                                <p className="text-slate-400 text-sm">Show off screenshots of your projects, certificates, or study setup.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-white mb-4">Interactions</h2>
                <p className="text-slate-300 mb-4">
                    Engage with the community using these features:
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                        <span className="text-2xl block mb-2">❤️</span>
                        <span className="font-bold text-white block">Like</span>
                        <span className="text-xs text-slate-400">Show appreciation</span>
                    </div>
                    <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                        <span className="text-2xl block mb-2">💬</span>
                        <span className="font-bold text-white block">Comment</span>
                        <span className="text-xs text-slate-400">Join the discussion</span>
                    </div>
                    <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                        <span className="text-2xl block mb-2">🔖</span>
                        <span className="font-bold text-white block">Save</span>
                        <span className="text-xs text-slate-400">Bookmark for later</span>
                    </div>
                </div>
            </section>
        </div>
    );
}
