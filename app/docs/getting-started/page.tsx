export default function GettingStartedPage() {
    return (
        <div className="space-y-6">
            <h1>Getting Started with EduMate AI</h1>
            <p className="lead text-xl text-slate-400">
                EduMate AI is an intelligent learning platform that uses generative AI to create personalized curriculums for any subject.
            </p>

            <hr className="border-white/10 my-8" />

            <h2>Installation</h2>
            <p>
                EduMate AI is primarily a web-based platform, but we offer a CLI tool for power users who want to manage their learning paths from the terminal.
            </p>

            <div className="not-prose bg-slate-950 rounded-xl border border-white/10 p-4 font-mono text-sm mb-6">
                <div className="flex items-center gap-2 text-slate-500 mb-2 border-b border-white/5 pb-2">
                    <span className="text-green-400">$</span>
                    <span>bash</span>
                </div>
                <code className="text-blue-300">npm install -g @edumate/cli</code>
            </div>

            <h2>Your First Roadmap</h2>
            <p>
                To generate your first roadmap, navigate to the dashboard and click "Create New Path". You'll be prompted to enter a topic.
            </p>

            <div className="bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-lg my-6">
                <p className="m-0 text-blue-200">
                    <strong>Tip:</strong> Be specific! Instead of "Python", try "Python for Data Science" or "Python Web Development with Django".
                </p>
            </div>

            <h2>Next Steps</h2>
            <ul>
                <li>Explore the <a href="/docs/guides/ide" className="text-blue-400 hover:underline">Interactive IDE</a></li>
                <li>Learn about <a href="/docs/core-concepts" className="text-blue-400 hover:underline">Core Concepts</a></li>
                <li>Check out the <a href="/docs/api/endpoints" className="text-blue-400 hover:underline">API Reference</a></li>
            </ul>
        </div>
    );
}
