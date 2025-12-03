"use client";

import { Search } from "lucide-react";

export function DocsSearch() {
    return (
        <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
            <input
                type="text"
                placeholder="Search documentation..."
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:border-blue-500/50 focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all duration-200"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-slate-400 opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </div>
        </div>
    );
}
