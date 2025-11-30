
<main className="pt-24 flex max-w-7xl mx-auto">
    {/* Sidebar */}
    <aside className="w-64 hidden lg:block fixed top-24 bottom-0 overflow-y-auto border-r border-white/5 pr-6 py-8">
        <div className="mb-8">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                    type="text"
                    placeholder="Search docs..."
                    className="w-full bg-slate-900 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:border-blue-500/50 focus:outline-none transition-colors"
                />
            </div>
        </div>

        <nav className="space-y-8">
            <div>
                <h5 className="font-bold text-white mb-4 px-2">Getting Started</h5>
                <ul className="space-y-1">
                    <DocLink active>Introduction</DocLink>
                    <DocLink>Quick Start</DocLink>
                    <DocLink>Core Concepts</DocLink>
                </ul>
            </div>
            <div>
                <h5 className="font-bold text-white mb-4 px-2">Guides</h5>
                <ul className="space-y-1">
                    <DocLink>Creating Roadmaps</DocLink>
                    <DocLink>Using the IDE</DocLink>
                    <DocLink>Gamification</DocLink>
                </ul>
            </div>
            <div>
                <h5 className="font-bold text-white mb-4 px-2">API Reference</h5>
                <ul className="space-y-1">
                    <DocLink>Authentication</DocLink>
                    <DocLink>Endpoints</DocLink>
                    <DocLink>Rate Limits</DocLink>
                </ul>
            </div>
        </nav>
    </aside>

    {/* Main Content */}
    <div className="flex-1 lg:pl-72 px-6 py-12 max-w-4xl">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <span>Docs</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Introduction</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black mb-6">Introduction to EduMate AI</h1>
        <p className="text-xl text-slate-400 mb-12 leading-relaxed">
            EduMate AI is an intelligent learning platform that uses generative AI to create personalized curriculums for any subject.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/50 hover:border-blue-500/50 transition-colors cursor-pointer">
                <Book className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Quick Start Guide</h3>
                <p className="text-slate-400 text-sm">Learn the basics and generate your first roadmap in under 5 minutes.</p>
            </div>
            <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/50 hover:border-purple-500/50 transition-colors cursor-pointer">
                <Terminal className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">API Reference</h3>
                <p className="text-slate-400 text-sm">Integrate EduMate AI's engine into your own applications.</p>
            </div>
        </div>

        <div className="prose prose-invert max-w-none">
            <h2>Why EduMate AI?</h2>
            <p>
                Traditional learning is linear and static. EduMate AI is dynamic and adaptive.
                We use large language models to analyze your learning style and adjust the content accordingly.
            </p>

            <h3>Key Features</h3>
            <ul>
                <li><strong>Dynamic Curriculums:</strong> No two roadmaps are the same.</li>
                <li><strong>Interactive Labs:</strong> Code and practice in the browser.</li>
                <li><strong>Real-time Feedback:</strong> Get instant corrections and explanations.</li>
            </ul>

            <h3>Code Example</h3>
            <div className="bg-slate-900 rounded-xl border border-white/10 p-6 font-mono text-sm overflow-x-auto">
                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                    <span className="text-slate-500">example.js</span>
                    <span className="text-xs text-slate-500">JavaScript</span>
                </div>
                <pre className="text-blue-300">
                    {`const edumate = new EduMateClient({
  apiKey: 'YOUR_API_KEY'
});

const roadmap = await edumate.generateRoadmap({
  topic: 'Machine Learning',
  level: 'Beginner'
});

console.log(roadmap.modules);`}
                </pre>
            </div>
        </div>
    </div>
</main>
        </div >
    );
}

function DocLink({ children, active }: { children: React.ReactNode; active?: boolean }) {
    return (
        <li>
            <Link
                href="#"
                className={cn(
                    "block px-2 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    active
                        ? "bg-blue-500/10 text-blue-400"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
            >
                {children}
            </Link>
        </li>
    );
}
