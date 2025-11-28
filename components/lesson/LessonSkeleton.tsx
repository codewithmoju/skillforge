import { motion } from "framer-motion";

export function LessonSkeleton() {
    return (
        <div className="min-h-screen bg-[#030014] text-white overflow-hidden relative">
            {/* Background Skeleton */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-indigo-900/20 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-900/20 blur-[100px] animate-pulse delay-1000" />
            </div>

            {/* Header Skeleton */}
            <div className="fixed top-0 left-0 right-0 z-50 h-20 border-b border-white/5 bg-[#030014]/80 backdrop-blur-xl flex items-center justify-between px-6">
                <div className="w-32 h-8 bg-white/5 rounded-lg animate-pulse" />
                <div className="w-48 h-2 bg-white/5 rounded-full animate-pulse" />
            </div>

            {/* Main Content Skeleton */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 pt-40 pb-48 space-y-24">

                {/* Hero Section */}
                <div className="text-center space-y-6">
                    <div className="w-24 h-6 bg-white/5 rounded-full mx-auto animate-pulse" />
                    <div className="w-3/4 h-16 bg-white/5 rounded-2xl mx-auto animate-pulse" />
                    <div className="w-1/2 h-4 bg-white/5 rounded-full mx-auto animate-pulse" />
                </div>

                {/* Mission Intel (Analogy) */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="h-64 bg-white/5 rounded-[2rem] animate-pulse" />
                    <div className="h-64 bg-white/5 rounded-[2rem] animate-pulse" />
                </div>

                {/* Diagram Skeleton */}
                <div className="h-96 bg-white/5 rounded-[2.5rem] animate-pulse" />

                {/* Sections Skeleton */}
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-12">
                        <div className="hidden md:block w-20 h-20 bg-white/5 rounded-[1.2rem] animate-pulse" />
                        <div className="flex-1 space-y-6">
                            <div className="h-8 w-1/3 bg-white/5 rounded-lg animate-pulse" />
                            <div className="h-4 w-full bg-white/5 rounded-full animate-pulse" />
                            <div className="h-4 w-5/6 bg-white/5 rounded-full animate-pulse" />
                            <div className="h-4 w-4/6 bg-white/5 rounded-full animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
