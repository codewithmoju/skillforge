export default function SettingsDocsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">Settings</h1>
                <p className="text-xl text-slate-400 leading-relaxed">
                    Manage your account preferences, privacy, and profile details.
                </p>
            </div>

            <div className="h-px bg-gradient-to-r from-white/10 to-transparent" />

            <section>
                <h2 className="text-2xl font-bold text-white mb-6">Configuration Options</h2>

                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center shrink-0">👤</div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Edit Profile</h3>
                            <p className="text-slate-400">Update your display name, bio, profile picture, and professional details like occupation and website.</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center shrink-0">🔔</div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Notifications</h3>
                            <p className="text-slate-400">Control which alerts you receive. You can toggle push notifications, likes, and comments.</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center shrink-0">🔒</div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Privacy</h3>
                            <p className="text-slate-400">
                                <strong>Private Account:</strong> Enable this to require approval for new followers. Only approved followers can see your posts.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <blockquote className="border-l-4 border-red-500 pl-4 py-1 bg-red-500/10 rounded-r-lg italic text-slate-300">
                <strong>Note:</strong> Your username and email address are managed by your core account and cannot be changed from this screen.
            </blockquote>
        </div>
    );
}
