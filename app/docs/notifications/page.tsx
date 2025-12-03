export default function NotificationsDocsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">Notifications</h1>
                <p className="text-xl text-slate-400 leading-relaxed">
                    Stay updated with everything happening in your network.
                </p>
            </div>

            <div className="h-px bg-gradient-to-r from-white/10 to-transparent" />

            <section>
                <h2 className="text-2xl font-bold text-white mb-4">Activity Feed</h2>
                <p className="text-slate-300 mb-6">
                    The Notifications page aggregates all interactions related to your account.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5 flex items-center gap-3">
                        <span className="text-red-400">❤️</span>
                        <span className="text-slate-300">Likes on your posts</span>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5 flex items-center gap-3">
                        <span className="text-blue-400">👤</span>
                        <span className="text-slate-300">New followers</span>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5 flex items-center gap-3">
                        <span className="text-green-400">💬</span>
                        <span className="text-slate-300">Comments and replies</span>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5 flex items-center gap-3">
                        <span className="text-yellow-400">🔔</span>
                        <span className="text-slate-300">Mentions</span>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-white mb-4">Managing Notifications</h2>
                <ul className="space-y-2 text-slate-300 list-disc list-inside">
                    <li><strong>Mark as Read:</strong> Click on a notification to mark it as read.</li>
                    <li><strong>Mark All:</strong> Use the "Mark all as read" button to clear your unread count instantly.</li>
                    <li><strong>Navigation:</strong> Clicking a notification will take you directly to the relevant post or profile.</li>
                </ul>
            </section>
        </div>
    );
}
