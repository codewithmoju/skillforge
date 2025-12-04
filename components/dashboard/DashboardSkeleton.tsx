import { Skeleton } from "@/components/ui/Skeleton";

export function DashboardSkeleton() {
    return (
        <div className="relative min-h-screen pb-16 space-y-10">
            {/* Header Section Skeleton */}
            <div className="grid gap-6 lg:grid-cols-[1.7fr,1fr]">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-10 h-[400px]">
                    <div className="flex flex-col gap-6">
                        <Skeleton className="h-8 w-32 bg-white/10 rounded-full" />
                        <div className="space-y-4">
                            <Skeleton className="h-12 w-3/4 bg-white/10 rounded-xl" />
                            <Skeleton className="h-6 w-1/2 bg-white/10 rounded-lg" />
                        </div>
                        <div className="mt-8 space-y-4">
                            <Skeleton className="h-4 w-full bg-white/10 rounded-full" />
                            <Skeleton className="h-3 w-full bg-white/10 rounded-full" />
                        </div>
                        <div className="mt-8 flex gap-3">
                            <Skeleton className="h-12 w-32 bg-white/10 rounded-2xl" />
                            <Skeleton className="h-12 w-32 bg-white/10 rounded-2xl" />
                            <Skeleton className="h-12 w-32 bg-white/10 rounded-2xl" />
                        </div>
                    </div>
                </div>

                {/* Leaderboard Skeleton */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 h-[400px]">
                    <div className="flex items-center justify-between mb-8">
                        <Skeleton className="h-6 w-32 bg-white/10 rounded-lg" />
                        <Skeleton className="h-10 w-24 bg-white/10 rounded-xl" />
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-20 w-full bg-white/10 rounded-2xl" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-32 w-full bg-white/10 rounded-2xl" />
                ))}
            </div>

            {/* Quests & Powerups Skeleton */}
            <div className="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 h-[300px]">
                    <div className="flex justify-between mb-6">
                        <Skeleton className="h-8 w-48 bg-white/10 rounded-lg" />
                        <Skeleton className="h-8 w-24 bg-white/10 rounded-lg" />
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-24 w-full bg-white/10 rounded-2xl" />
                        <Skeleton className="h-24 w-full bg-white/10 rounded-2xl" />
                    </div>
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-24 w-full bg-white/10 rounded-3xl" />
                    <Skeleton className="h-24 w-full bg-white/10 rounded-3xl" />
                </div>
            </div>
        </div>
    );
}
