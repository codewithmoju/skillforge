import { Skeleton } from "@/components/ui/Skeleton";

export default function ProfileLoading() {
    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header Skeleton */}
                <div className="relative mb-8 rounded-3xl border border-white/10 bg-slate-900/50 p-8 overflow-hidden">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <Skeleton className="w-32 h-32 rounded-full" />
                        <div className="flex-1 space-y-4 w-full">
                            <Skeleton className="h-8 w-1/3" />
                            <Skeleton className="h-4 w-1/2" />
                            <div className="flex gap-4 pt-2">
                                <Skeleton className="h-10 w-24 rounded-xl" />
                                <Skeleton className="h-10 w-24 rounded-xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-2xl" />
                    ))}
                </div>

                {/* Content Tabs Skeleton */}
                <div className="space-y-6">
                    <div className="flex gap-4 border-b border-white/10 pb-4">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-8 w-24 rounded-lg" />
                        ))}
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-48 rounded-2xl" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
