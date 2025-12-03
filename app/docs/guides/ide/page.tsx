export default function IdeGuidePage() {
    return (
        <div className="space-y-6">
            <h1>Using the IDE</h1>
            <p className="lead text-xl text-slate-400">
                EduMate AI features a powerful, browser-based Integrated Development Environment (IDE).
            </p>

            <hr className="border-white/10 my-8" />

            <h2>Features</h2>
            <ul>
                <li><strong>Syntax Highlighting:</strong> Supports over 50 languages.</li>
                <li><strong>IntelliSense:</strong> Smart code completion and suggestions.</li>
                <li><strong>Instant Execution:</strong> Run code safely in a sandboxed environment.</li>
                <li><strong>AI Assistant:</strong> Highlight code and ask the AI to explain or debug it.</li>
            </ul>

            <h2>Keyboard Shortcuts</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="py-2 font-bold text-white">Action</th>
                            <th className="py-2 font-bold text-white">Shortcut</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-400">
                        <tr className="border-b border-white/5">
                            <td className="py-2">Run Code</td>
                            <td className="py-2"><kbd className="bg-white/10 px-2 py-1 rounded text-xs">Ctrl</kbd> + <kbd className="bg-white/10 px-2 py-1 rounded text-xs">Enter</kbd></td>
                        </tr>
                        <tr className="border-b border-white/5">
                            <td className="py-2">Format Code</td>
                            <td className="py-2"><kbd className="bg-white/10 px-2 py-1 rounded text-xs">Shift</kbd> + <kbd className="bg-white/10 px-2 py-1 rounded text-xs">Alt</kbd> + <kbd className="bg-white/10 px-2 py-1 rounded text-xs">F</kbd></td>
                        </tr>
                        <tr>
                            <td className="py-2">Toggle Terminal</td>
                            <td className="py-2"><kbd className="bg-white/10 px-2 py-1 rounded text-xs">Ctrl</kbd> + <kbd className="bg-white/10 px-2 py-1 rounded text-xs">`</kbd></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
