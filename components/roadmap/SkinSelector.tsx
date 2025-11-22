"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Sparkles } from "lucide-react";
import { SKIN_CONFIGS, SkinId } from "@/lib/types/skins";
import { useUserStore } from "@/lib/store";
import { useSkin } from "@/lib/hooks/useSkin";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface SkinSelectorProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SkinSelector({ isOpen, onClose }: SkinSelectorProps) {
    const { colors, skin } = useSkin();
    const { selectedSkin, setSkin } = useUserStore();

    const handleSkinSelect = (skinId: SkinId) => {
        // All skins are unlocked for everyone
        setSkin(skinId);
        onClose();
    };

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="w-[95vw] max-w-5xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col relative border-2"
                    style={{
                        backgroundColor: colors.backgroundCard,
                        borderColor: colors.primary,
                        boxShadow: `0 0 50px ${colors.primary}20`
                    }}
                >
                    {/* Forest Quest Texture Overlay */}
                    {skin.id === 'forest-quest' && (
                        <div className="absolute inset-0 pointer-events-none opacity-10 z-0"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                                backgroundSize: '20px 20px'
                            }}
                        />
                    )}

                    {/* Header */}
                    <div
                        className="p-6 border-b flex items-center justify-between relative z-10"
                        style={{
                            borderColor: `${colors.primary}40`,
                            background: `linear-gradient(to right, ${colors.backgroundCard}, ${colors.primary}10)`
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="p-2 rounded-lg"
                                style={{ backgroundColor: `${colors.accent}20` }}
                            >
                                <Sparkles className="w-6 h-6" style={{ color: colors.accent }} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Choose Your Roadmap Theme</h2>
                                <p className="text-sm" style={{ color: colors.textSecondary }}>Transform your learning journey with premium skins</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg transition-colors hover:bg-white/10"
                            style={{ color: colors.textSecondary }}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Skin Grid */}
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Object.values(SKIN_CONFIGS).map((skinConfig) => {
                                const isSelected = selectedSkin === skinConfig.id;

                                return (
                                    <motion.div
                                        key={skinConfig.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: Object.values(SKIN_CONFIGS).indexOf(skinConfig) * 0.1 }}
                                        className="relative group cursor-pointer"
                                        onClick={() => handleSkinSelect(skinConfig.id)}
                                    >
                                        {/* Preview Card */}
                                        <div
                                            className={cn(
                                                "relative h-64 rounded-2xl border-2 overflow-hidden transition-all duration-300",
                                                isSelected
                                                    ? "border-accent-cyan shadow-lg shadow-accent-cyan/50 scale-105"
                                                    : "border-slate-700 hover:border-slate-600 hover:scale-102"
                                            )}
                                            style={{
                                                background: `linear-gradient(135deg, ${skinConfig.colors.primary}20, ${skinConfig.colors.secondary}20, ${skinConfig.colors.accent}20)`,
                                                borderColor: isSelected ? colors.accent : `${colors.primary}40`
                                            }}
                                        >
                                            {/* Preview Gradient */}
                                            <div
                                                className="absolute inset-0 opacity-80"
                                                style={{
                                                    background: `linear-gradient(135deg, ${skinConfig.colors.primary}40, ${skinConfig.colors.secondary}40, ${skinConfig.colors.accent}40)`,
                                                }}
                                            />

                                            {/* Preview Icon */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="text-6xl">{skinConfig.previewIcon}</div>
                                            </div>

                                            {/* Preview Layout Indicator */}
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <div className="bg-black/50 backdrop-blur-sm rounded-lg p-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex gap-1">
                                                            {Array.from({ length: 4 }).map((_, i) => (
                                                                <div
                                                                    key={i}
                                                                    className="w-2 h-2 rounded-full"
                                                                    style={{
                                                                        backgroundColor: skinConfig.colors.primary,
                                                                        opacity: i < 3 ? 1 : 0.3,
                                                                    }}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-xs text-white font-medium ml-2">
                                                            {skinConfig.layout}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Premium Badge */}
                                            {skinConfig.isPremium && (
                                                <div className="absolute top-3 right-3">
                                                    <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                                        <Sparkles className="w-3 h-3" />
                                                        Premium
                                                    </div>
                                                </div>
                                            )}

                                            {/* Selected Indicator */}
                                            {isSelected && (
                                                <div className="absolute top-3 left-3">
                                                    <div
                                                        className="text-white p-2 rounded-full"
                                                        style={{ backgroundColor: colors.accent }}
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Skin Info */}
                                        <div className="mt-4">
                                            <h3 className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>
                                                {skinConfig.name}
                                            </h3>
                                            <p className="text-sm" style={{ color: colors.textSecondary }}>
                                                {skinConfig.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Footer */}
                    <div
                        className="p-6 border-t relative z-10"
                        style={{
                            borderColor: `${colors.primary}40`,
                            backgroundColor: `${colors.backgroundCard}80`
                        }}
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-sm" style={{ color: colors.textSecondary }}>
                                All skins are available! Choose your favorite theme to transform your roadmap.
                            </p>
                            <Button onClick={onClose} variant="outline">
                                Close
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
}

