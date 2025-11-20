"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { convertToBase64, validateImageFile, compressImage } from "@/lib/utils/imageUpload";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    className?: string;
    label?: string;
}

export function ImageUpload({ value, onChange, className, label = "Upload Image" }: ImageUploadProps) {
    const [preview, setPreview] = useState<string>(value || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

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
    };

    return (
        <div className={cn("space-y-2", className)}>
            <label className="block text-sm font-medium text-slate-300">{label}</label>

            {preview ? (
                <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-slate-700 group">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                        <X className="w-8 h-8 text-white" />
                    </button>
                </div>
            ) : (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-32 h-32 rounded-xl border-2 border-dashed border-slate-700 hover:border-accent-indigo transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 bg-slate-900/50"
                >
                    {loading ? (
                        <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
                    ) : (
                        <>
                            <Upload className="w-8 h-8 text-slate-500" />
                            <span className="text-xs text-slate-500">Click to upload</span>
                        </>
                    )}
                </div>
            )}

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
