"use client";

import { motion } from "framer-motion";

export function RecommendationSkeleton() {
    return (
        <div className="relative h-full rounded-[24px] overflow-hidden">
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

            <div className="h-full bg-slate-900/50 border border-white/5 rounded-[23px] p-6 flex flex-col">
                {/* Header Skeleton */}
                <div className="flex justify-between items-start mb-6">
                    <div className="w-24 h-6 rounded-full bg-white/5 animate-pulse" />
                    <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
                </div>

                {/* Title Skeleton */}
                <div className="w-3/4 h-8 rounded-lg bg-white/5 mb-4 animate-pulse" />

                {/* Body Skeleton */}
                <div className="space-y-2 mb-6">
                    <div className="w-full h-4 rounded bg-white/5 animate-pulse" />
                    <div className="w-full h-4 rounded bg-white/5 animate-pulse" />
                    <div className="w-2/3 h-4 rounded bg-white/5 animate-pulse" />
                </div>

                {/* Footer Skeleton */}
                <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                    <div className="w-20 h-4 rounded bg-white/5 animate-pulse" />
                    <div className="w-24 h-4 rounded bg-white/5 animate-pulse" />
                </div>
            </div>
        </div>
    );
}
