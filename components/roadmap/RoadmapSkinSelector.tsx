"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Lock, Check, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import useSkinStore from "@/lib/store/skinStore";
import { SKIN_CONFIGS, SkinId } from "@/lib/types/skins";
import { cn } from "@/lib/utils";

export function RoadmapSkinSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const { currentSkin, setCurrentSkin, isSkinUnlocked, unlockSkin } = useSkinStore();
    const [selectedPreview, setSelectedPreview] = useState<SkinId | null>(null);

    const handleSkinSelect = (skinId: SkinId) => {
        const skin = SKIN_CONFIGS[skinId];

        if (!skin.isPremium || isSkinUnlocked(skinId)) {
            setCurrentSkin(skinId);
            setIsOpen(false);
        } else {
            // Show purchase modal (to be implemented)
            console.log(`Purchase skin: ${skinId}`);
        }
    };

    // Temporary unlock function for testing (remove in production)
    const handleUnlockForTesting = (skinId: SkinId) => {
        unlockSkin(skinId);
    };

    return (
        <>
            {/* Floating Skin Selector Button */}
            <motion.button
                onClick={() => setIsOpen(true)}
                className="fixed top-24 right-6 z-40 p-4 bg-gradient-to-br from-accent-indigo to-accent-purple rounded-2xl border-2 border-accent-indigo/30 shadow-2xl hover:scale-105 transition-transform"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-white" />
                    <span className="text-sm font-bold text-white hidden md:block">Themes</span>
                </div>
                {currentSkin !== 'cyber-neon' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-cyan rounded-full animate-pulse" />
                )}
            </motion.button>

            {/* Skin Selector Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-3xl border-2 border-slate-800 shadow-2xl"
                        >
                            {/* Header */}
                            <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                                            <Sparkles className="w-8 h-8 text-accent-cyan" />
                                            Roadmap Themes
                                        </h2>
                                        <p className="text-slate-400 mt-1">Transform your learning journey</p>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                                    >
                                        <X className="w-6 h-6 text-slate-400" />
                                    </button>
                                </div>
                            </div>

                            {/* Skin Grid */}
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Object.values(SKIN_CONFIGS).map((skin) => {
                                    const isUnlocked = !skin.isPremium || isSkinUnlocked(skin.id);
                                    const isActive = currentSkin === skin.id;

                                    return (
                                        <motion.div
                                            key={skin.id}
                                            whileHover={{ scale: isUnlocked ? 1.02 : 1 }}
                                            onHoverStart={() => setSelectedPreview(skin.id)}
                                            onHoverEnd={() => setSelectedPreview(null)}
                                        >
                                            <Card
                                                className={cn(
                                                    "relative overflow-hidden cursor-pointer transition-all",
                                                    isActive && "ring-2 ring-accent-cyan shadow-lg shadow-accent-cyan/20",
                                                    !isUnlocked && "opacity-75"
                                                )}
                                                onClick={() => isUnlocked && handleSkinSelect(skin.id)}
                                            >
                                                {/* Preview Gradient */}
                                                <div className={cn(
                                                    "h-32 bg-gradient-to-br",
                                                    skin.previewGradient,
                                                    "relative overflow-hidden"
                                                )}>
                                                    {/* Lock Overlay */}
                                                    {!isUnlocked && (
                                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                                            <Lock className="w-12 h-12 text-white/80" />
                                                        </div>
                                                    )}

                                                    {/* Active Indicator */}
                                                    {isActive && (
                                                        <div className="absolute top-3 right-3 p-2 bg-accent-cyan rounded-full">
                                                            <Check className="w-4 h-4 text-white" />
                                                        </div>
                                                    )}

                                                    {/* Icon */}
                                                    <div className="absolute bottom-3 left-3 text-4xl">
                                                        {skin.previewIcon}
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="text-lg font-bold text-white">{skin.name}</h3>
                                                        {skin.isPremium && !isUnlocked && (
                                                            <span className="px-2 py-1 bg-accent-indigo/20 text-accent-indigo text-xs font-bold rounded-full">
                                                                ${skin.price}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-slate-400 mb-3">{skin.tagline}</p>
                                                    <p className="text-xs text-slate-500">{skin.description}</p>

                                                    {/* Action Button */}
                                                    <div className="mt-4">
                                                        {isUnlocked ? (
                                                            <Button
                                                                size="sm"
                                                                className="w-full"
                                                                variant={isActive ? "outline" : "default"}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleSkinSelect(skin.id);
                                                                }}
                                                            >
                                                                {isActive ? "Active" : "Apply Theme"}
                                                            </Button>
                                                        ) : (
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    className="flex-1"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        // Purchase logic here
                                                                        console.log(`Purchase ${skin.id}`);
                                                                    }}
                                                                >
                                                                    Purchase
                                                                </Button>
                                                                {/* Temporary unlock button for testing */}
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleUnlockForTesting(skin.id);
                                                                    }}
                                                                >
                                                                    🔓
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Footer */}
                            <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 p-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-slate-400">
                                        <p>💎 Premium themes unlock new visual experiences</p>
                                        <p className="text-xs mt-1">Bundle: All 4 premium themes for $9.99 (Save 33%)</p>
                                    </div>
                                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                                        Close
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
