export default function ApiAuthPage() {
    return (
        <div className="space-y-6">
            <h1>Authentication</h1>
            <p className="lead text-xl text-slate-400">
                Secure your API requests with Bearer tokens.
            </p>

            <hr className="border-white/10 my-8" />

            <h2>Overview</h2>
            <p>
                The EduMate AI API uses API keys to authenticate requests. You can view and manage your API keys in the <a href="/settings" className="text-blue-400 hover:underline">Settings</a> page.
            </p>
            <p>
                Your API keys carry many privileges, so be sure to keep them secure! Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth.
            </p>

            <h2>Sending the Token</h2>
            <p>
                Authentication to the API is performed via HTTP Basic Auth. Provide your API key as the basic auth username value. You do not need to provide a password.
            </p>

            <div className="not-prose bg-slate-950 rounded-xl border border-white/10 p-4 font-mono text-sm mb-6">
                <code className="text-blue-300">Authorization: Bearer sk_live_...</code>
            </div>
        </div>
    );
}
