export default function MessagesDocsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">Messages</h1>
                <p className="text-xl text-slate-400 leading-relaxed">
                    Direct messaging for collaboration, networking, and mentorship.
                </p>
            </div>

            <div className="h-px bg-gradient-to-r from-white/10 to-transparent" />

            <section>
                <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
                <p className="text-slate-300">
                    The Messages feature allows you to have private, real-time conversations with other users. Whether you're coordinating on a group project or asking a mentor for advice, the chat system is your direct line of communication.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-white mb-6">Starting a Conversation</h2>
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                    <ol className="space-y-4 list-decimal list-inside text-slate-300 marker:text-indigo-500 marker:font-bold">
                        <li className="pl-2">Navigate to the <strong>Messages</strong> page from the sidebar.</li>
                        <li className="pl-2">Click the <strong>New Message</strong> (pencil icon) button.</li>
                        <li className="pl-2">Type the name or username of the person you want to chat with in the search bar.</li>
                        <li className="pl-2">Select them from the list to open a secure chat window.</li>
                    </ol>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-white mb-6">Chat Features</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700">
                        <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                            <span className="text-green-400">●</span> Real-time Sync
                        </h3>
                        <p className="text-sm text-slate-400">Messages are delivered instantly. You can see when other users are typing.</p>
                    </div>
                    <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700">
                        <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                            <span className="text-blue-400">↺</span> History
                        </h3>
                        <p className="text-sm text-slate-400">Your entire conversation history is saved securely, allowing you to scroll back and reference past discussions.</p>
                    </div>
                    <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700">
                        <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                            <span className="text-purple-400">🔍</span> User Search
                        </h3>
                        <p className="text-sm text-slate-400">Easily find study buddies, mentors, or friends by searching the global user directory.</p>
                    </div>
                    <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700">
                        <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                            <span className="text-amber-400">🔔</span> Notifications
                        </h3>
                        <p className="text-sm text-slate-400">Receive alerts when you get a new message, so you never miss a connection.</p>
                    </div>
                </div>
            </section>

            <blockquote className="border-l-4 border-indigo-500 pl-4 py-1 bg-indigo-500/10 rounded-r-lg italic text-slate-300">
                <strong>Privacy Note:</strong> All messages are private between participants. Please adhere to our community guidelines and be respectful.
            </blockquote>
        </div>
    );
}
