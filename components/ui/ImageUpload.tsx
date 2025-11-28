"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, Loader2, Camera } from "lucide-react";
import { convertToBase64, validateImageFile, compressImage } from "@/lib/utils/imageUpload";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    className?: string;
    label?: string;
    rounded?: boolean;
    size?: "sm" | "md" | "lg";
}

export function ImageUpload({
    value,
    onChange,
    className,
    label = "Upload Image",
    rounded = false,
    size = "md"
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string>(value || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Cache key for profile pictures
    const CACHE_KEY = "profile_picture_cache";

    // Update preview when value changes
    useEffect(() => {
        if (value) {
            setPreview(value);
            // Cache the profile picture
            try {
                localStorage.setItem(CACHE_KEY, value);
            } catch (e) {
                console.warn("Failed to cache profile picture:", e);
            }
        }
    }, [value]);

    // Load from cache on mount
    useEffect(() => {
        if (!value) {
            try {
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    setPreview(cached);
                }
            } catch (e) {
                console.warn("Failed to load cached profile picture:", e);
            }
        }
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError("");
        const validation = validateImageFile(file);

        if (!validation.valid) {
            setError(validation.error || "Invalid file");
            return;
        }

        setLoading(true);
        try {
            // Compress and convert to base64
            const base64 = await compressImage(file);
            setPreview(base64);
            onChange(base64);

            // Cache the new image
            try {
                localStorage.setItem(CACHE_KEY, base64);
            } catch (e) {
                console.warn("Failed to cache profile picture:", e);
            }
        } catch (err) {
            setError("Failed to process image");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = () => {
        setPreview("");
        onChange("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        // Clear cache
        try {
            localStorage.removeItem(CACHE_KEY);
        } catch (e) {
            console.warn("Failed to clear cache:", e);
        }
    };

    const sizeClasses = {
        sm: "w-24 h-24",
        md: "w-32 h-32",
        lg: "w-40 h-40"
    };

    const iconSizes = {
        sm: "w-6 h-6",
        md: "w-8 h-8",
        lg: "w-10 h-10"
    };

    const roundedClass = rounded ? "rounded-full" : "rounded-xl";

    return (
        <div className={cn("space-y-3", className)}>
            {label && <label className="block text-sm font-medium text-slate-300">{label}</label>}

            <div className="flex items-center gap-6">
                {preview ? (
                    <div className={cn("relative group", sizeClasses[size])}>
                        <img
                            src={preview}
                            alt="Preview"
                            className={cn(
                                "w-full h-full object-cover border-2 border-slate-700",
                                roundedClass
                            )}
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className={cn(
                                "absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center",
                                roundedClass
                            )}
                        >
                            <X className="w-8 h-8 text-white" />
                        </button>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className={cn(
                                "absolute bottom-0 right-0 p-2 bg-accent-indigo rounded-full border-2 border-slate-900 hover:bg-accent-indigo/80 transition-colors",
                                rounded ? "translate-x-1 translate-y-1" : ""
                            )}
                        >
                            <Camera className="w-4 h-4 text-white" />
                        </button>
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                            sizeClasses[size],
                            roundedClass,
                            "border-2 border-dashed border-slate-700 hover:border-accent-indigo transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 bg-slate-900/50"
                        )}
                    >
                        {loading ? (
                            <Loader2 className={cn(iconSizes[size], "text-accent-cyan animate-spin")} />
                        ) : (
                            <>
                                <Upload className={cn(iconSizes[size], "text-slate-500")} />
                                <span className="text-xs text-slate-500">Click to upload</span>
                            </>
                        )}
                    </div>
                )}

                {preview && (
                    <div className="flex-1">
                        <p className="text-sm text-slate-300 mb-2">Profile Picture</p>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-sm text-accent-indigo hover:text-accent-indigo/80 transition-colors font-medium"
                        >
                            Change Photo
                        </button>
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            {error && (
                <p className="text-sm text-red-400">{error}</p>
            )}

            <p className="text-xs text-slate-500">Max 2MB • JPEG, PNG, GIF, WebP</p>
        </div>
    );
}
