"use client";

import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "default";
    isLoading?: boolean;
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "default",
    isLoading = false,
}: ConfirmDialogProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !isLoading) onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose, isLoading]);

    if (!mounted) return null;

    const variantStyles = {
        danger: {
            icon: "text-red-500",
            button: "bg-red-600 hover:bg-red-700 border-red-700",
            iconBg: "bg-red-500/10",
        },
        warning: {
            icon: "text-yellow-500",
            button: "bg-yellow-600 hover:bg-yellow-700 border-yellow-700",
            iconBg: "bg-yellow-500/10",
        },
        default: {
            icon: "text-accent-cyan",
            button: "bg-accent-indigo hover:bg-accent-indigo/90",
            iconBg: "bg-accent-cyan/10",
        },
    };

    const styles = variantStyles[variant];

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => !isLoading && onClose()}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className={cn("p-3 rounded-full", styles.iconBg)}>
                                    <AlertTriangle className={cn("w-6 h-6", styles.icon)} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        {title}
                                    </h3>
                                    <p className="text-sm text-slate-400">{description}</p>
                                </div>
                                <button
                                    onClick={() => !isLoading && onClose()}
                                    className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                                    disabled={isLoading}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 p-4 border-t border-slate-800 bg-slate-900/50">
                            <Button
                                variant="ghost"
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                {cancelText}
                            </Button>
                            <Button
                                onClick={onConfirm}
                                disabled={isLoading}
                                className={cn("text-white border-none", styles.button)}
                            >
                                {isLoading ? "Loading..." : confirmText}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
