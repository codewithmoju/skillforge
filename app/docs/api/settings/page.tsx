export default function ApiSettingsPage() {
    return (
        <div className="space-y-6">
            <h1>Settings API</h1>
            <p className="lead text-xl text-slate-400">
                Manage user preferences and account settings programmatically.
            </p>

            <hr className="border-white/10 my-8" />

            <h2>Update Profile</h2>
            <div className="border border-white/10 rounded-xl overflow-hidden">
                <div className="bg-slate-900/50 p-4 border-b border-white/10 flex items-center gap-3">
                    <span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded text-xs font-bold border border-purple-500/20">PATCH</span>
                    <code className="text-sm text-slate-300">/v1/user/settings</code>
                </div>
                <div className="p-6">
                    <p className="text-sm text-slate-400 mb-4">Updates the authenticated user's settings.</p>
                    <div className="bg-slate-950 p-4 rounded-lg font-mono text-xs text-blue-300">
                        {`{
  "theme": "dark",
  "notifications": {
    "email": true,
    "push": false
  }
}`}
                    </div>
                </div>
            </div>
        </div>
    );
}
