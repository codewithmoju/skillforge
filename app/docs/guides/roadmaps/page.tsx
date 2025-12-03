export default function RoadmapsGuidePage() {
    return (
        <div className="space-y-6">
            <h1>Creating Roadmaps</h1>
            <p className="lead text-xl text-slate-400">
                Learn how to generate and customize your learning paths.
            </p>

            <hr className="border-white/10 my-8" />

            <h2>Generating a Roadmap</h2>
            <ol>
                <li>Go to your Dashboard.</li>
                <li>Click the <strong>"New Journey"</strong> button.</li>
                <li>Enter a topic (e.g., "React Native").</li>
                <li>Select your current experience level.</li>
                <li>Click <strong>"Generate"</strong>.</li>
            </ol>

            <p>
                The AI will take a few seconds to analyze the topic and construct a custom curriculum.
            </p>

            <h2>Customizing Your Path</h2>
            <p>
                Once generated, you can:
            </p>
            <ul>
                <li><strong>Reorder Modules:</strong> Drag and drop to change the learning order.</li>
                <li><strong>Add Custom Notes:</strong> Attach personal notes to any node.</li>
                <li><strong>Regenerate Sections:</strong> If a module isn't quite right, ask the AI to regenerate just that part.</li>
            </ul>
        </div>
    );
}
