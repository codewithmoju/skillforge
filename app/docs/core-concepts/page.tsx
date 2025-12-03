export default function CoreConceptsPage() {
    return (
        <div className="space-y-6">
            <h1>Core Concepts</h1>
            <p className="lead text-xl text-slate-400">
                Understand the fundamental building blocks of EduMate AI's learning engine.
            </p>

            <hr className="border-white/10 my-8" />

            <h2>The Knowledge Graph</h2>
            <p>
                At the heart of EduMate AI is a dynamic Knowledge Graph. Unlike static textbooks, our graph connects concepts based on prerequisites, relatedness, and difficulty.
            </p>
            <p>
                When you request a roadmap, the AI traverses this graph to find the optimal path for your specific learning goals and current knowledge level.
            </p>

            <h2>Adaptive Difficulty</h2>
            <p>
                The system continuously monitors your performance on quizzes and coding challenges. If you're breezing through, it ramps up the complexity. If you're struggling, it offers remedial content and simpler explanations.
            </p>

            <h2>Modules and Nodes</h2>
            <p>
                A <strong>Roadmap</strong> consists of <strong>Modules</strong> (e.g., "Variables", "Loops"). Each Module contains <strong>Nodes</strong> (specific lessons, quizzes, or labs).
            </p>
        </div>
    );
}
