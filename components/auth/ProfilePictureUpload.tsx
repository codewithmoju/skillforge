"use client";

import { useState, useRef, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Loader2, Camera, User } from "lucide-react";
import Image from "next/image";
import { validateImageFile, compressImage } from "@/lib/utils/imageUpload";

interface ProfilePictureUploadProps {
    value: string;
    onChange: (url: string) => void;
    loading?: boolean;
}

export function ProfilePictureUpload({
    value,
    onChange,
    loading = false
}: ProfilePictureUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string>(value);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (file: File) => {
        setError(null);

        const validation = validateImageFile(file);
        if (!validation.valid) {
            setError(validation.error || 'Invalid file');
            return;
        }

        setUploading(true);
        try {
            // Compress and convert to base64
            const base64 = await compressImage(file);
            setPreview(base64);
            onChange(base64);
        } catch (err) {
            setError("Failed to process image");
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleRemove = () => {
        setPreview('');
        onChange('');
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const isLoading = loading || uploading;

    return (
        <div className="w-full">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg,image/gif"
                onChange={handleInputChange}
                className="hidden"
            />

            <div className="flex flex-col items-center">
                {/* Upload Area */}
                <motion.div
                    whileHover={{ scale: preview ? 1 : 1.02 }}
                    className="relative"
                >
                    {preview ? (
                        // Preview
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-700 group-hover:border-accent-indigo transition-colors">
                                <img
                                    src={preview}
                                    alt="Profile preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="flex gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                                        type="button"
                                    >
                                        <Camera className="w-5 h-5 text-white" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleRemove}
                                        className="p-2 bg-red-500/20 backdrop-blur-sm rounded-full hover:bg-red-500/30 transition-colors"
                                        type="button"
                                    >
                                        <X className="w-5 h-5 text-red-400" />
                                    </motion.button>
                                </div>
                            </div>

                            {/* Loading overlay */}
                            {isLoading && (
                                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                                </div>
                            )}
                        </div>
                    ) : (
                        // Upload placeholder
                        <motion.div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`
                                w-32 h-32 rounded-full border-4 border-dashed cursor-pointer
                                flex flex-col items-center justify-center gap-2
                                transition-all
                                ${isDragging
                                    ? 'border-accent-indigo bg-accent-indigo/10 scale-105'
                                    : 'border-slate-700 hover:border-accent-indigo/50 hover:bg-slate-800/50'
                                }
                            `}
                        >
                            {isLoading ? (
                                <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
                            ) : (
                                <>
                                    <div className="p-3 bg-slate-800 rounded-full">
                                        <User className="w-8 h-8 text-slate-500" />
                                    </div>
                                    <Upload className="w-5 h-5 text-slate-500" />
                                </>
                            )}
                        </motion.div>
                    )}
                </motion.div>

                {/* Instructions */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm text-slate-400 mt-4 text-center"
                >
                    {preview ? 'Click to change or remove' : 'Click or drag to upload'}
                </motion.p>
                <p className="text-xs text-slate-500 mt-1">
                    Max 2MB • JPEG, PNG, WebP
                </p>

                {/* Error Message */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-3 text-sm text-red-400 text-center"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
