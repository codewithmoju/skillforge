export default function ApiEndpointsPage() {
    return (
        <div className="space-y-6">
            <h1>API Endpoints</h1>
            <p className="text-slate-400">
                The EduMate AI API is organized around REST. Our API has predictable resource-oriented URLs, accepts form-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.
            </p>

            <hr className="border-white/10 my-8" />

            <h2>Authentication</h2>
            <p>
                Authenticate your API requests using your API key. If you do not include your key when making an API request, or use one that is incorrect or disabled, EduMate AI returns an error.
            </p>

            <div className="not-prose bg-slate-950 rounded-xl border border-white/10 p-4 font-mono text-sm mb-6">
                <div className="flex items-center gap-2 text-slate-500 mb-2 border-b border-white/5 pb-2">
                    <span className="text-purple-400">Header</span>
                </div>
                <code className="text-blue-300">Authorization: Bearer YOUR_API_KEY</code>
            </div>

            <h2>Roadmaps</h2>

            <div className="space-y-8">
                {/* Endpoint 1 */}
                <div className="border border-white/10 rounded-xl overflow-hidden">
                    <div className="bg-slate-900/50 p-4 border-b border-white/10 flex items-center gap-3">
                        <span className="bg-green-500/10 text-green-400 px-2 py-1 rounded text-xs font-bold border border-green-500/20">GET</span>
                        <code className="text-sm text-slate-300">/v1/roadmaps</code>
                    </div>
                    <div className="p-6">
                        <p className="text-sm text-slate-400 mb-4">Returns a list of roadmaps belonging to the authenticated user.</p>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Parameters</h4>
                        <ul className="text-sm space-y-2 text-slate-300">
                            <li className="flex gap-4">
                                <code className="text-blue-400 min-w-[100px]">limit</code>
                                <span>Optional. A limit on the number of objects to be returned. Limit can range between 1 and 100.</span>
                            </li>
                            <li className="flex gap-4">
                                <code className="text-blue-400 min-w-[100px]">page</code>
                                <span>Optional. The page number to return.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Endpoint 2 */}
                <div className="border border-white/10 rounded-xl overflow-hidden">
                    <div className="bg-slate-900/50 p-4 border-b border-white/10 flex items-center gap-3">
                        <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs font-bold border border-blue-500/20">POST</span>
                        <code className="text-sm text-slate-300">/v1/roadmaps/generate</code>
                    </div>
                    <div className="p-6">
                        <p className="text-sm text-slate-400 mb-4">Generates a new roadmap based on the provided topic.</p>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Body</h4>
                        <div className="bg-slate-950 p-4 rounded-lg font-mono text-xs text-blue-300">
                            {`{
  "topic": "Machine Learning",
  "level": "beginner",
  "language": "en"
}`}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
